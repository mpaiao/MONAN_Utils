*==========================================================================================*
*==========================================================================================*
*    Script fi.gs                                                                          *
* Develeoped by Marcos Longo - Lab. MASTER - IAG/USP                                       *
* Sao Paulo, 04 November 2002                                                              *
*                                                                                          *
*     This GrADS scripts generates figures based on the file extension.  The advantage     *
* wi is that it generates raster files from vector, thus it looks nicer.                   *
*                                                                                          *
*  Usage: run fi.gs filename.fmt <resolution (ppi)>                                        *
*                                                                                          *
*  fmt        -- any format recognised by imagemagick                                      *
*  resolution -- optional argument to set the sought resolution (meaningless for vector    *
*                formats)                                                                  *
*                                                                                          *
*  This only works if you have gxeps and imagemagick.                                      *
*  For more information on gxeps: http://lmgtfy.com/?q=gxeps                               *
*  For more information on imagemagick: http://lmgtfy.com/?q=imagemagick                   *
*                                                                                          *
*  Modified by Marcos Longo 05 April 2014:                                                 *
*  Make it compatible with GrADS 2.1.                                                      *
*------------------------------------------------------------------------------------------*
function fi(args)
   ;*----- Retrieve arguments. ------------------------------------------------------------*
   filename = subwrd(args,1)
   res      = subwrd(args,2)
   version  = subwrd(args,3)
   ;*--------------------------------------------------------------------------------------*


   ;*---- Set default resolution in case none is given. -----------------------------------*
   if (res = '')
      res=96
   endif
   ;*--------------------------------------------------------------------------------------*


   ;*--------------------------------------------------------------------------------------*
   ;*    Find the dot                                                                      *
   ;*--------------------------------------------------------------------------------------*
   dot = ';'
   i   = 0
   while (dot != '.' & dot != '')
      i   = i+1
      dot = substr(filename,i,1)
   endwhile
   posdot = i
   ;*--------------------------------------------------------------------------------------*


   ;*--------------------------------------------------------------------------------------*
   ;*     Make sure we have found the dot.                                                 *
   ;*--------------------------------------------------------------------------------------*
   if (dot = '')
      say ' In script fi.gs, incorrect file name given ('filename')'
      say ' Usage: run fi.gs filename.extension <resolution>'
      exit
   endif
   ;*--------------------------------------------------------------------------------------*


   ;*--------------------------------------------------------------------------------------*
   ;*    Find out which version we are using in case none is given.                        *
   ;*--------------------------------------------------------------------------------------*
   if (version = '')
      'query config'
      version=sublin(result,1)
      version=subwrd(version,2)
      version=substr(version,2,3)
   endif
   ;*--------------------------------------------------------------------------------------*




   ;*----- Find out whether this is landscape or portrait. --------------------------------*
   'query gxinfo'
   aux  = sublin(result,2)
   xmax = subwrd(aux,4)
   ymax = subwrd(aux,6)
   ;*--------------------------------------------------------------------------------------*


   ;*--------------------------------------------------------------------------------------*
   ;*    Decide how to generate the plot based on the GrADS version.                       *
   ;*--------------------------------------------------------------------------------------*
   if (version >= 2.1)
      ;*-----------------------------------------------------------------------------------*
      ;*     In case the extension is not vector, define x and y based on the resolution.  *
      ;*-----------------------------------------------------------------------------------*
      if (ext = 'eps' | ext = 'EPS' | ext = 'PDF' | ext = 'pdf' | ext = 'ps' & ext = 'PS')
         'gxprint 'filename
      else
         xsize=xmax*res
         ysize=ymax*res
         'gxprint 'filename' white x'xsize' y'ysize
      endif
      ;*-----------------------------------------------------------------------------------*


   else
      ;*-----------------------------------------------------------------------------------*
      ;*    Find the names.                                                                *
      ;*-----------------------------------------------------------------------------------*
      basename = substr(filename,1,posdot-1)
      ext      = substr(filename,posdot+1,posdot+3)
      gmf      = basename'.gmf'
      eps      = basename'.eps'
      ;*-----------------------------------------------------------------------------------*



      ;*-----------------------------------------------------------------------------------*
      ;*    Create a temporary GrADS metafile.                                             *
      ;*-----------------------------------------------------------------------------------*
      'enable print 'gmf
      'print'
      'disable print'
      ;*-----------------------------------------------------------------------------------*




      ;*----- Find out whether to rotate or not. ------------------------------------------*
      if (xmax <= ymax)
         rotate = 0
      else
         rotate = 90
      endif
      ;*-----------------------------------------------------------------------------------*





      ;*----- Convert the file to encapsulated post script. -------------------------------*
      '! gxeps -c -l -i 'gmf' -o 'eps
      '! /bin/rm -f 'gmf
      ;*-----------------------------------------------------------------------------------*



      ;*----- If the output format is anything other than EPS, use imagemagick. -----------*
      if (ext != 'eps' & ext != 'EPS')
         '! convert 'eps' -units PixelsPerInch -density 'res'x'res' -rotate 'rotate' -background white -flatten +antialias 'filename
         '! /bin/rm -f 'eps
      endif
      ;*-----------------------------------------------------------------------------------*
   endif
return
*==========================================================================================*
*==========================================================================================*
