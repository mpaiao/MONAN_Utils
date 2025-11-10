#===+===
#===+===
#   This function is a wrapper for the C function that will write NoahMP surface files 
# following the grid.
#---~---
write.geogrid <<- function( data
                          , ixa
                          , iya
                          , ixz
                          , iyz
                          , output.path = getwd()
                          , signed      = TRUE
                          , endian      = .Platform$endian
                          , wordsize    = 1L
                          ){

   #---~---


   #--- Confirm that the endian choice provided is valid.
   endian = match.arg(endian,choices=c("little","big","swap"),several.ok=FALSE)
   #---~---


   #--- Make sure all required variables are present.
   if (missing(data) || missing(ixa) || missing(iya) || missing(ixz) || missing(iyz)){
      cat0("---~---"         )
      cat0("   FATAL ERROR! ")
      cat0("---~---"         )
      cat0(" Some required variables are missing.")
      cat0(" - Variable \"data\" is missing: ",missing(data))
      cat0(" - Variable \"ixa\" is missing:  ",missing(ixa ))
      cat0(" - Variable \"iya\" is missing:  ",missing(iya ))
      cat0(" - Variable \"ixz\" is missing:  ",missing(ixz ))
      cat0(" - Variable \"iyz\" is missing:  ",missing(iyz ))
      cat0("---~---"         )
      stop(" Make sure all required variables are provided.")
   }#end if (missing(data) || missing(ixa) || missing(iya) || missing(ixz) || missing(iyz))
   #---~---


   #--- Dynamically load the compiled C object.
   dyn.load(file.path(srcdir,"write_geogrid.so"))
   #---~---


   #--- Re-shape data so it matches the expected dimensions for 
   if (is.array(data)){
      #--- Make sure the number of dimensions does not exceed 3.
      ndim.data = length(dim(data))
      if (ndim.data %or% c(2L,3L)){
         cat0("---~---")
         cat0("   FATAL ERROR!")
         cat0("---~---")
         cat0(" Number of dimensions of \"data\":",ndim.data,".")
         cat0("---~---")
         stop(" Variable \"data\" must be an array of dimension 2 or 3.")
      }else if(ndim.data %eq% 2L){
         #--- Turn 2-dimension arrays into 3-dimension ones (but crop the array subset).
         nx     = ixz - ixa + 1L
         ny     = iyz - iya + 1L
         nz     = 1L
         darray = array(data=c(as.double(data[ixa:ixz,iya:iyz])),dim=c(nx,ny,nz))
         #---~---
      }else{
         #--- Extract subset from the 3-D array.
         nx     = ixz - ixa + 1L
         ny     = iyz - iya + 1L
         nz     = dim(data)[3L]
         darray = array(data=c(as.double(data[ixa:ixz,iya:iyz,])),dim=c(nx,ny,nz))
         #---~---
      }#end if (ndim.data %or% c(2L,3L))
      #---~---
   }else if (is.matrix(data) || is.data.frame(data) || is.data.table(data)){
      #--- Turn matrices and alikes into arrays (but crop the data subset).
      nx     = ixz - ixa + 1L
      ny     = iyz - iya + 1L
      nz     = 1L
      darray = array(data=c(as.double((data[ixa:ixz,iya:iyz])),dim=c(nx,ny,nz)))
      #---~---
   }else{
      cat0("---~---")
      cat0("   FATAL ERROR!")
      cat0("---~---")
      stop(" Variable \"data\" must be a matrix, or an array of dimension 2 or 3.")
   }#end if (is.array(data))
   #---~---


   #---~---
   #   Write the binary
   #---~---
   output.base = sprintf("%5.5i-%5.5i.%5.5i-%5.5i",ixa,ixz,iya,iyz)
   output.file = file.path(output.path,output.base)
   #---~---


   pathnow = getwd()
   dummy   = setwd(output.path)
   ans     = .C( "write_geogrid"
               , darray      = darray
               , ixa_in      = as.integer(ixa)
               , iya_in      = as.integer(iya)
               , ixz_in      = as.integer(ixz)
               , iyz_in      = as.integer(iyz)
               , nx_in       = as.integer(nx )
               , ny_in       = as.integer(ny )
               , nz_in       = as.integer(nz )
               , isigned_in  = ifelse(test=signed           ,yes=1L,no=0L)
               , endian_in   = ifelse(test=endian %in% "big",yes=0L,no=1L)
               , wordsize_in = as.integer(wordsize)
               )#end .C
   dummy = setwd(pathnow)
   #---~---

   return(ans)
}#end write.geogrid
#===+===
#===+===
