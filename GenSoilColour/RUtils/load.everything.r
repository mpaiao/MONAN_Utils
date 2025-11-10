#===+===
#===+===
#     This script loads all other scripts in this path, and also loads all the necessary   #
# packages.                                                                                #
#---~---
if ("srcdir" %in% ls()){
   srcdir <<- srcdir
}else{
   srcdir <<- getwd()
}#end if
#---~---



#---~---
#   Find which major version of R is calling this script.
#---~---
R.major <<- as.numeric(R.version$major)
#---~---



#---~---
#   Make the screen output as wide as the screen permits.
#---~---
ncstring = as.integer(Sys.getenv("COLUMNS"))
if (! is.na(ncstring)){
   if ( ( ncstring > 80 ) & ( ncstring < 500 ) ) options(width=ncstring)
}#end if (! is.na(ncstring))
#---~---


#---~---
#   Wrapper function. It checks whether or not the packages are installed. If they are, it
# quietly loads the package. If not, it first attempts to install it, and if not 
# successful, it quietly returns FALSE, indicating that the package is not loaded. If the 
# package is loaded (regardless of whether or not it needed to be installed), it returns 
# TRUE.
#---~---
discreet.require <<- function(package="",install.miss=TRUE,...){

   #--- First we check if we should try to install the package if it is missing.
   if ( install.miss ){
      #--- Search for package.
      miss = length(find.package(package,quiet=TRUE)) == 0L
      #---~---
      

      #--- Attempt to install the package.
      if ( miss ) dummy = suppressWarnings(install.packages(package,quiet=TRUE))
      #---~---
   }#end if ( install.miss )
   #---~---



   #--- Attempt to load package.
   ans =  suppressPackageStartupMessages(
             suppressWarnings(
                require(package,character.only=TRUE,...)
             )#end suppressWarnings
          )#end suppressPackageStartupMessages
   #---~---

   return(ans)
}#end discreet.require
#---~---



#--- Load all packages needed.
is.fine = list()
is.fine[["ncdf4"       ]] = discreet.require( package="ncdf4"        , install.miss=TRUE)
is.fine[["terra"       ]] = discreet.require( package="terra"        , install.miss=TRUE)
is.fine[["callr"       ]] = discreet.require( package="callr"        , install.miss=TRUE)
#---~---


#--- Make sure all packages are loaded fine.
is.fine = unlist(is.fine)
if (! all(is.fine)){
   miss = which(! is.fine)
   cat(" You must install the following packages before using the scripts:","\n")
   for (m in miss) cat(" -> ",names(is.fine)[m],"\n",sep="")
   risky = readline(" Are you sure you want to proceed [y|N]? ")
   risky = tolower(risky)
   if (! risky %in% c("y","yes")) stop("Missing packages!!!")
}#end if
#---~---



#---~---
#  SHADY BUSINESS...  We must unlock some variable names from packages that are also used
#                     for defining local variables and functions.
#---~---
if ("terra" %in% names(sessionInfo()$otherPkgs)){
   envir = as.environment("package:terra")
   try(unlockBinding("trim",envir),silent=TRUE)
}#end if ("terra" %in% names(sessionInfo()$otherPkgs))
#---~---


#---~---
#   Organise the files so we load them in the right order.
#---~---
at.first      = character(0L)
at.end        = character(0L)
myself        = c("load.everything.r")
all.scripts   = sort(list.files(path=srcdir,pattern="\\.[RrSsQq]$"))
back.up       = sort(list.files(path=srcdir,pattern="^[~]"))
keep          = ! ( all.scripts %in% at.first
                  | all.scripts %in% at.end
                  | all.scripts %in% myself
                  | all.scripts %in% back.up
                  )#end
middle        = all.scripts[keep]
order.scripts = c(at.first,middle,at.end)
nscripts      = length(order.scripts)
#---~---



#---~---
#   Load all files, in order.  Here we replace the warnings by errors, just to make sure
# that all the functions are clean.
#---~---
warn.orig = getOption("warn")
options(warn=2)
cat(" + Load scripts from ",srcdir,".","\n",sep="")
for (iscript in sequence(nscripts)){
   script.now  = order.scripts[iscript]
   full        = file.path(srcdir,script.now)
   isok        = try(source(full),silent=TRUE)
   if ("try-error" %in% is(isok)){
      options(warn=warn.orig)
      cat("   - Script ",script.now," has bugs!  Check the errors/warnings: ","\n",sep="")
      source(full)
      stop("Source code problem")
   }#end if
}#end for
options(warn=warn.orig)
#---~---



#---~---
#   Check for Fortran and C code to be loaded.
#---~---
all.cf90  = sort( c( list.files(path=srcdir,pattern="\\.[Ff]90$")
                   , list.files(path=srcdir,pattern="\\.[Ff]$")
                   , list.files(path=srcdir,pattern="\\.[Cc]$")
                   )#end c
                )#end sort
nall.cf90 = length(all.cf90)
for (icf90 in sequence(nall.cf90)){
   cfnow    = file.path(srcdir,all.cf90[icf90])
   cflib.o  = cfnow
   cflib.o  = gsub(pattern = "\\.[Ff]90$",replacement=".o",x=cflib.o)
   cflib.o  = gsub(pattern = "\\.[Ff]$"  ,replacement=".o",x=cflib.o)
   cflib.o  = gsub(pattern = "\\.[Cc]$"  ,replacement=".o",x=cflib.o)
   cflib.so = cfnow
   cflib.so = gsub(pattern = "\\.[Ff]90$",replacement=".so",x=cflib.so)
   cflib.so = gsub(pattern = "\\.[Ff]$"  ,replacement=".so",x=cflib.so)
   cflib.so = gsub(pattern = "\\.[Cc]$"  ,replacement=".so",x=cflib.so)
   cflib.sl = cfnow
   cflib.sl = gsub(pattern = "\\.[Ff]90$",replacement=".sl",x=cflib.sl)
   cflib.sl = gsub(pattern = "\\.[Ff]$"  ,replacement=".sl",x=cflib.sl)
   cflib.sl = gsub(pattern = "\\.[Cc]$"  ,replacement=".sl",x=cflib.sl)

   #--- Select library.
   if (file.exists(cflib.so)){
      cflib.sx = cflib.so
   }else if (file.exists(cflib.sl)){
      cflib.sx = cflib.sl
   }else{
      #--- This is guaranteed to fail, so it will force recompilation.
      cflib.sx = cflib.o
      #---~---
   }#end if (file.exists(cflib.so))
   #---~---



   #--- Check whether dynamic library can be loaded.  In case not, recompile.
   dummy = try(dyn.load(cflib.sx),silent=TRUE)
   if ("try-error" %in% is(dummy)){
      dummy = if (file.exists(cflib.so)){file.remove(cflib.so)}else{character(0)}
      dummy = if (file.exists(cflib.sl)){file.remove(cflib.sl)}else{character(0)}
      dummy = if (file.exists(cflib.o )){file.remove(cflib.o )}else{character(0)}
      dummy = rcmd(cmd="SHLIB",cmdargs=cfnow  )
      dummy = rcmd(cmd="SHLIB",cmdargs=cflib.o)
      #---~---
   }#end if ("try-error" %in% is(dummy))
   #---~---
}#end for (icf90 in sequence(nall.cf90))
#---~---



#---~---
#   Get rid of the extremely annoying and unnecessary bell.  Also, force the system to use
# Helvetica as the default font family.
#---~---
options(locatorBell=FALSE,family="Helvetica")
#---~---

#===+===
#===+===
