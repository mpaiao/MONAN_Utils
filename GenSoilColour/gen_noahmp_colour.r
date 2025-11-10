#===+===
#===+===
#   Reset the session.
#---~---
if ("nc.conn"      %in% ls()){dummy = nc_close(nc.conn); rm(nc.conn)}
if ("lyr.file"     %in% ls()){if(file.exists(lyr.file    )){foo=file.remove(lyr.file    )}}
if ("tmp.file"     %in% ls()){if(file.exists(tmp.file    )){foo=file.remove(tmp.file    )}}
if ("nc.temporary" %in% ls()){if(file.exists(nc.temporary)){foo=file.remove(nc.temporary)}}
rm(list=ls())
graphics.off()
options(warn=0)
#===+===
#===+===




#===+===
#===+===
#    Main settings.                                                                        #
#---~---



#---~---
#   File and path information.
#---~---
home.path     = path.expand("~")                     # Home directory
main.path     = getwd()                              # Working directory
srcdir        = file.path(main.path,"RUtils")        # Path(s) with R utility scripts. This
                                                     #    script will pick the first path 
                                                     #    that is found.
scolour.path  = file.path(main.path,"Original"  )    # Path with input data
scolour.base  = "SoilColour_0.125x0.125_c251017.nc"  # Basename for NetCDF file.
scolour.vnam  = "SOIL_COLOUR"                        # Variable name in the original NetCDF
                                                     #    file
noahmp.label  = "soilcolour_30s"                     # Prefix for output data set
tifroot       = file.path(main.path,"GeoTIFF")       # Path with GeoTIFF file
noahmproot    = file.path(main.path,noahmp.label)    # Path with NoahMP files (binaries)
#---~---


#--- Define block length.
lona    = -180     # Westernmost longitude
lonz    =  180     # Easternmost longitude
lata    =  -90     # Southernmost latitude
latz    =   90     # Northernmost latitude
dblock  =   10     # Size of output blocks (in degrees)
dxyout  = 1./120.  # Output resolution (in degrees)
#---~---



#---~---
#   We recommend testing the processing first, using a block that has a coastline and well
# known geographic features (e.g., bays) to see if the coordinates were correctly
# retrieved. This step is necessary because most CLM surface data sets do not come with
# coordinates, and we want to make sure the output blocks are geographically accurate.
#---~---
run.dbg = c(FALSE,TRUE)[1L]   # Flag to turn on/off debugging
dbg.lon = -50
dbg.lat = -30
#---~---


#---~---
#---~---
#---~---
#---~---
#---~---
#---~---
#---~---
#---~---
#   CHANGES BEYOND THIS POINT ARE FOR ADJUSTING THE INPUT FILE ONLY.
#---~---
#---~---
#---~---
#---~---
#---~---
#---~---
#---~---
#---~---




#--- Load some useful packages and functions.
srcdir = (srcdir[file.exists(srcdir)])[1]
source(file.path(srcdir,"load.everything.r"))
isok.ncdf4 = require(ncdf4)
if (! isok.ncdf4) stop(" This script also requires package ncdf4!")
isok.rhdf5 = require(rhdf5)
if (! isok.rhdf5) stop(" This script also requires package rhdf5!")
#---~---



#--- Find the nearest neighbour.
idx.nearest <<- function(here,there){
   xdist = (here[1L] - there[,1L])
   ydist = (here[2L] - there[,2L])
   dist  = xdist*xdist + ydist*ydist
   near  = which.min(dist)
   ans   = there[near,]
   return(ans)
}#end idx.nearest
#---~---



#---~---
#   Function to eliminate missing values from the raster file.
#---~---
missfill <<- function(mat,gmin=1,gby=1){
   #--- Do nothing in case the matrix is empty.
   if (all(is.na(mat)) || (! any(is.na(mat)))) return(mat)
   #---~---


   #--- Find the gap sizes to try filling.
   xmat  = row(mat)
   ymat  = col(mat)
   miss  = which(is.na(c(mat)))
   fine  = which(is.finite(c(mat)))
   #---~---


   #--- Create arrays with the coordinates of missing and fine data.
   xy.miss   = cbind(xmat[miss],ymat[miss])
   xy.miss   = split(x=xy.miss,f=row(xy.miss))
   xy.fine   = cbind(xmat[fine],ymat[fine])
   xy.near   = t(sapply(X=xy.miss,FUN=idx.nearest,there=xy.fine))
   ans       = mat
   ans[miss] = mat[xy.near]
   #---~---

   return(ans)
}#end missfill
#---~---


#--- In case the output directory doesn't exist, create it.
dummy = dir.create(noahmproot,recursive=TRUE,showWarnings=FALSE)
dummy = dir.create(tifroot   ,recursive=TRUE,showWarnings=FALSE)
#---~---


#--- Load Soil Colour data set.
cat0(" + Open NetCDF file with soil colour (",scolour.base,").")
scolour.file  = file.path(scolour.path,scolour.base)
nc.conn       = nc_open(filename=scolour.file)
nix           = nc.conn$dim$lsmlon$len
niy           = nc.conn$dim$lsmlat$len
ilonbnd       = seq(from=-180.,to=180.,length.out=nix+1L)
ilatbnd       = seq(from= -90.,to= 90.,length.out=niy+1L)
ilonmid       = mid.points(ilonbnd)
ilatmid       = mid.points(ilatbnd)
#---~---



#--- Extract data and reorganise data.
cat0(" + Extract data.")
nc.dat      = ncvar_get(nc=nc.conn,varid=scolour.vnam)
#---~---



#--- Extract data and reorganise data.
cat0(" + Fix longitude.")
nixh        = nix / 2.
ilon        = c(seq(from=nixh+1L,to=nix,by=1L),sequence(nixh))
nc.dat      = nc.dat[ilon,,drop=FALSE]
#---~---



#--- Close the file.
dummy   = nc_close(nc.conn)
#---~---






#---~---
#   Create raster with the native resolution.
#---~---
cat0(" + Generate raster object.")
col.rast = terra::rast( xmin       = -180.
                      , xmax       = +180.
                      , ymin       =  -90.
                      , ymax       =  +90.
                      , ncols      = nrow(nc.dat)
                      , nrows      = ncol(nc.dat)
                      , crs        = "epsg:4326"
                      , vals       = as.integer(c(nc.dat[,rev(sequence(niy))]))
                      )#end terra::rast
col.tiff = file.path(tifroot,"SoilColour_CLM5_longlat.tif")
dummy    = terra::writeRaster( x         = col.rast
                             , filename  = col.tiff
                             , overwrite = TRUE
                             , gdal      = c("COMPRESS=DEFLATE")
                             , datatype  = "INT1U"
                             )#end terra::writeRaster
#---~---



#---~---
#   Create a data set with the output resolution.
#---~---
olonbnd     = seq(from=lona,to=lonz,by=dxyout)
olatbnd     = seq(from=lata,to=latz,by=dxyout)
olonmid     = mid.points(olonbnd)
olatmid     = mid.points(olatbnd)
nox         = length(olonmid)
noy         = length(olatmid)
xcopy       = sapply(X=olonmid,FUN=which.closest,A=ilonmid)
ycopy       = sapply(X=olatmid,FUN=which.closest,A=ilatmid)
soil.colour = matrix(data=nc.dat[xcopy,ycopy],nrow=nox,ncol=noy)
if (run.dbg){
   quartz(width=9.,height=5.)
   par(par.user)
   gridded.plot( x              = olonmid
               , y              = olatmid
               , z              = soil.colour
               , col            = imagma(n=20L)
               , levels         = sequence(21L)-0.5
               , xlim           = c(lona,lonz)
               , ylim           = c(lata,latz)
               , plot.after     = list( map = list( use.package = "maps"
                                                  , database    = "mapdata::worldHires"
                                                  , add         = TRUE
                                                  )#end list
                                      )#end list
               )#end gridded.plot
   locator(n=1L)
}#end if (run.dbg)
#---~---




#--- Find coordinates.
lonbnds = seq(from=lona,to=lonz,by=dblock)
latbnds = seq(from=lata,to=latz,by=dblock)
lonbnds = lonbnds[lonbnds %wr% c(-180,180)]
latbnds = latbnds[latbnds %wr% c( -90, 90)]
west    = lonbnds[-length(lonbnds)]
east    = lonbnds[              -1]
south   = latbnds[-length(latbnds)]
north   = latbnds[              -1]
nlon    = length(west )
nlat    = length(south)
#---~---


#--- Set x and y loop (typically everything, unless this is a debugging run).
if (run.dbg){
  xloop = which(west  %in% dbg.lon)
  yloop = which(south %in% dbg.lat)
}else{
  xloop = sequence(nlon)
  yloop = sequence(nlat)
}#end if (run.dbg)
#---~---





#---~---
#   Loop through longitudes.
#---~---
premier = TRUE
for (x in xloop){
   #--- Current longitude bounds.
   wnow   = west[x]
   enow   = east[x]
   selx   = olonmid %wr% c(wnow,enow)
   nxnow  = sum(selx)
   iwest  = min(which(selx))
   ieast  = max(which(selx))
   xlabel = paste0(sprintf("%5.5i",iwest),"-",sprintf("%5.5i",ieast))
   lonlab = paste0(sprintf("%3.3i",abs(wnow)),ifelse(test=wnow < 0,yes="W",no="E"))
   #---~---



   #---~---
   #   Loop through latitudes.
   #---~---
   for (y in yloop){
      #--- Current latitude bounds.
      snow   = south[y]
      nnow   = north[y]
      sely   = olatmid %wr% c(snow,nnow)
      nynow  = sum(sely)
      isouth = min(which(sely))
      inorth = max(which(sely))
      latlab = paste0(sprintf("%2.2i",abs(snow)),ifelse(test=snow < 0,yes="S",no="N"))
      ylabel = paste0(sprintf("%5.5i",isouth),"-",sprintf("%5.5i",inorth))
      cat0("   - Process block ",lonlab,"; ",latlab,".")
      #---~---




      #--- Call function that will write the output file.
      cat0("     ~ Write data.")
      dummy   = write.geogrid( data        = soil.colour
                             , ixa         = iwest
                             , iya         = isouth
                             , ixz         = ieast
                             , iyz         = inorth
                             , output.path = noahmproot
                             , signed      = TRUE
                             , endian      = "big"
                             , wordsize    = 1L
                             )#end write.geogrid
      #---~---



      #---~---
      #   If this is the first file, write the data set header file.
      #---~---
      if (premier){
         cat0("     ~ Write header file.")
         premier  = FALSE

         #--- Define header.
         header   = c( "type=categorical"
                     , "category_min=1"
                     , "category_max=20"
                     , "projection=regular_ll"
                     , paste0("dx=",sprintf("%.8f",dxyout))
                     , paste0("dy=",sprintf("%.8f",dxyout))
                     , "known_x=1.0"
                     , "known_y=1.0"
                     , paste0("known_lat=",sprintf("%.8f",lata+0.5*dxyout))
                     , paste0("known_lon=",sprintf("%.8f",lona+0.5*dxyout))
                     , "wordsize=1"
                     , paste0("tile_x=",as.integer(dblock/dxyout))
                     , paste0("tile_y=",as.integer(dblock/dxyout))
                     , "tile_z=1"
                     , "units=\"category\""
                     , "description=\"20-category CLM soil colour\""
                     )#end c
         #---~---


         #--- Write header.
         head.file = file.path(noahmproot,"index")
         dummy     = write(x=header,file=head.file,ncolumns=1L,append=FALSE)
         #---~---
      }#end if (premier)
      #---~---
   }#end for (y in sequence(nlat))
   #---~---
}#end for (x in sequence(nlon))
#---~---
