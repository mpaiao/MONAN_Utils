*===+===
*===+===
*
*  Script to plot a colour bar
*
*  The script will assume a colorbar is wanted even if there is not room -- it will plot
*  on the side or the bottom if there is room in either place, otherwise it will plot
*  along the bottom and overlay labels there if any.  This can be dealt with via the
*  'set parea' command.  In version 2 the default parea will be changed, but we want to
*  guarantee upward compatibility in sub-releases.
*
*
*  Modifications by mike fiorino 940614
*
*  - the extreme colors are plotted as triangles
*  - the colours are boxed in white
*  - input arguments in during a run execution:
*
*  Modifications by Marcos Longo (31-Mar-2004):
*  - New arguments for size and angle
*  - Removed the black lines between colours so it works with tens of colours.
*
*  Modifications by Marcos Longo (05-Apr-2014):
*  - Added option to give dummy values so for example you can modify the 5th argument
*    whilst using the default 3rd argument.
*
*  Usage:
*
* run cbare.gs [skip] [offset] [scale] [vert] [xmid] [ymid] [labsiz] [labang]
*
*   skip   -- 1: write all labels; 2: write 1, skip 1; 3: write 1, skip 2; etc)
*   offset -- 0: start with first label; 1: skip first, start with the second label; etc.
*             If the provided offset greater than or equal to skip, it will be ignored.
*   scale  -- Relative size of the bar (1=100%)
*   vert   -- 0 = horizontal bar, 1= vertical bar, 2 let the script decide
*   xmid   -- X position for the centre of the bar (if xmid < 0, the script decides)
*   ymid   -- Y position for the centre of the bar (if ymid < 0, the script decides)
*   labsiz -- Label size (if labsiz < 0, the script decides).
*   labang -- Label angle in degrees (values between -90 and 90)
*
*---~---
function colourbar (args)

   skip=subwrd(args,1)
   offset=subwrd(args,2)
   sf=subwrd(args,3)
   vert=subwrd(args,4)
   xmid=subwrd(args,5)
   ymid=subwrd(args,6)
   size=subwrd(args,7)
   angle=subwrd(args,8)

   ;*---~---
   ;* If the first argument is "help", print the help banner and returns.
   ;*---~---
   if ( skip = '-h' | skip = '--help' | skip = '-help' | skip = '?')
      say ' ______________________________________________________________________________'
      say '|                                                                             |'
      say '| Possible arguments:                                                         |'
      say '| run cbare.gs [skip] [offset] [scale] [vert] [xmid] [ymid] [labsiz] [labang] |'
      say '|                                                                             |'
      say '| skip   -- 1: write all labels; 2: write 1, skip 1; 3: write 1, skip 2; etc) |'
      say '| offset -- 0: start with first label; 1: skip first, start with the second   |'
      say '|              label; etc. If the provided offset greater than or equal to    |'
      say '|              skip, it will be ignored.                                      |'
      say '| scale  -- Relative size of the bar (1=100%)                                 |'
      say '| vert   -- 0 = horizontal bar, 1= vertical bar, 2 let the script decide      |'
      say '| xmid   -- X mid position (if xmid < 0, then the script decides)             |'
      say '| ymid   -- Y mid position (if ymid < 0, then the script decides)             |'
      say '| labsiz -- Label size (if labsiz < 0, the script decides).                   |'
      say '| labang -- Label angle in degrees (values between -90 and 90)                |'
      say '|                                                                             |'
      say '| Arguments are optional, there are default values for them                   |'
      say '|_____________________________________________________________________________|'
      return
   endif
   ;*---~---


   ;*--- Fill in the arguments with defaults.
   if ( skip   = '' ); skip   =     1 ; endif
   if ( offset = '' ); offset =     0 ; endif
   if ( sf     = '' ); sf     =   1.0 ; endif
   if ( vert   = '' ); vert   =   2.0 ; endif
   if ( xmid   = '' ); xmid   =  -1.0 ; endif
   if ( ymid   = '' ); ymid   =  -1.0 ; endif
   if ( size   = '' ); size   =  0.13 ; endif
   if ( angle  = '' ); angle  =     0 ; endif
   ;*---~---



   ;*--- Make size offset does not exceed skip.
   if( offset >= skip ); offset = 0 ; endif
   ;*---~---



   ;*--- Make size default in case it was a dummy argument.
   if( size < 0 ); size = 0.13; endif
   ;*---~---



   ;*--- Prevent weird angles.
   if( angle < -90 | angle > 90 )
     say 'Angle must be between -90 and 90, I shall use 0 instead of 'angle'...'
     angle = 0
   endif
   ;*---~---



   ;*--- Check shading information.
   'query shades'
   shdinfo = result
   if (subwrd(shdinfo,1)='None') 
      say 'No colour bar will be drawn: no shading information given...'
      return
   endif
   ;*---~---



   ;*--- Get plot size info.
   'query gxinfo'
   rec2 = sublin(result, 2)
   rec3 = sublin(result, 3)
   rec4 = sublin(result, 4)
   xsiz = subwrd(rec2,   4)
   ysiz = subwrd(rec2,   6)
   ylo  = subwrd(rec4,   4)
   xhi  = subwrd(rec3,   6)
   xd  = xsiz - xhi
   ;*---~---



   ;*--- Scale the default values by sf.
   ylolim  = 0.60 * sf
   xdlim1  = 1.00 * sf
   xdlim2  = 1.50 * sf
   barsf   = 0.80 * sf
   yoffset = 0.20 * sf
   stroff  = 0.10 * sf
   strxsiz = size * sf
   strysiz = size * sf
   ;*---~---


   ;*--- Decide whether there is room to plot horizontal a colour bar.
   if ( ylo < ylolim & xd < xdlim1 )
     say 'Not enough room to plot the colour bar...'
     return
   endif
   ncols = subwrd(shdinfo,5)
   ;*---~---


   ;*---~---
   ;*   Find the smallest delta. Skip the first and the last line
   ;*---~---
   ii    = 1
   delta = 9999999999999999999
   while (ii < ncols - 1)
      ii =  ii + 1

      ;*--- Retrieve data
      rec = sublin(shdinfo,ii+1)
      lo  = subwrd(rec,2)
      hi  = subwrd(rec,3)
      ;*---~---


      ;*--- Check whether of not this delta is the smallest one.
      dtnow = hi - lo
      if (dtnow < delta); delta = dtnow; endif
      ;*---~---
   endwhile
   ;*---~---



   ;*--- Find the lowest possible upper bound
   rec    = sublin(shdinfo,2)
   lowest = subwrd(rec,3)
   ;*---~---



   ;*--- Logic for setting the bar orientation with user overides.
   if (vert = 0)
      vchk = 0
   else; if (vert = 1)
      vchk = 1
   else; if ( ylo < ylolim | xd > xdlim1 )
      vchk = 1
   else
      vchk = 0
   endif; endif; endif
   ;*---~---



   ;*--- Retrieve the lowest level
   
   if (vert = 0)
      vchk = 0
   else; if (vert = 1)
      vchk = 1
   else; if ( ylo < ylolim | xd > xdlim1 )
      vchk = 1
   else
      vchk = 0
   endif; endif; endif
   ;*---~---




   ;*---~---
   ;*     Decide settings based on whether to draw a vertical or horizontal bar.
   ;*---~---
   if (vchk)
      ;*--- Vertical bar.
      if (xmid < 0.) ; xmid = xhi+xd/2 ; endif
      xwid = 0.2 * sf
      ywid = 0.5 * sf

      xl   = xmid-xwid/2
      xr   = xl + xwid
      if (ywid*ncols > ysiz*barsf) 
         ywid = ysiz * barsf / ncols
      endif
      if (ymid < 0.) ; ymid = ysiz/2 ; endif
      yb = ymid - ywid*ncols/2
      'set string 1 l 5 'angle
      ;*---~---
   else
      ;*--- Vertical bar.
      ywid = 0.4
      xwid = 0.8

      if (ymid < 0.) ; ymid = ylo/2-ywid/2 ; endif
      yt = ymid + yoffset
      yb = ymid
      if (xmid < 0.) ; xmid = xsiz/2 ; endif
      if (xwid*ncols > xsiz*barsf)
         xwid = xsiz*barsf/ncols
      endif
      xl = xmid - xwid*ncols/2
      ;*---~---


      ;*--- Adjust string position depending on the angle.
      if (angle = 0)
        'set string 1 tc 5 'angle
      else;if(angle > 0)
        'set string 1 tr 5 'angle
      else
        'set string 1 tl 5 'angle
      endif;endif
      ;*---~---
   endif
   ;*---~---




   ;*---~---
   ;*   Plot the colour bar.
   ;*---~---
   'set strsiz 'strxsiz' 'strysiz
   ii  = 0
   while (ii < ncols)
      ii  = ii + 1

      ;*--- Retrieve the information for this line.
      rec = sublin(shdinfo,ii + 1)
      col = subwrd(rec,1)
      if (vchk)
         yt = yb + ywid
      else 
         xr = xl + xwid
      endif
      if (ii < ncols)
         hi  = subwrd(rec,3)
      else
         hi  = subwrd(rec,2) + delta
      endif
      if (hi > -1.e-13 & hi < 1.e-13); hi = 0; endif
      step = math_int((hi-lowest)/delta)
      ;*---~---



      ;*---~---
      ;*   Decide how to plot based on which level to plot.
      ;*---~---
      if (ii = 1)
         ;*---~---
         ;*   First step, create widening triangle.
         ;*---~---
         if (vchk)
            xm = ( xl + xr ) * 0.5
            'set line 1 1 10'
            'draw line 'xl' 'yt' 'xm' 'yb
            'draw line 'xm' 'yb' 'xr' 'yt

            'set line 'col
            'draw polyf 'xl' 'yt' 'xm' 'yb' 'xr' 'yt' 'xl' 'yt
         else
            ym = ( yb + yt ) * 0.5
            'set line 1 1 10'
            'draw line 'xl' 'ym' 'xr' 'yb
            'draw line 'xr' 'yt' 'xl' 'ym

            'set line 'col
            'draw polyf 'xl' 'ym' 'xr' 'yb' 'xr' 'yt' 'xl' 'ym
         endif
         ;*---~---
      else; if (ii = ncols)
         ;*---~---
         ;*   First step, create narrowing triangle.
         ;*---~---
         if (vchk)
            'set line 1 1 10'
            'draw line 'xl' 'yb' 'xm' 'yt
            'draw line 'xm' 'yt' 'xr' 'yb

            'set line 'col
            'draw polyf 'xl' 'yb' 'xm' 'yt' 'xr' 'yb' 'xl' 'yb
         else

            'set line 1 1 10'
            'draw line 'xr' 'ym' 'xl' 'yb
            'draw line 'xl' 'yt' 'xr' 'ym

            'set line 'col
            'draw polyf 'xr' 'ym' 'xl' 'yb' 'xl' 'yt' 'xr' 'ym
         endif
         ;*---~---
      else
        ;*---~---
        ;*   Middle steps, create a rectangle.
        ;*---~---
        if (vchk)
            'set line 1 1 10'
            'draw line 'xl' 'yb' 'xl' 'yt
            'draw line 'xr' 'yb' 'xr' 'yt
         else
            'set line 1 1 10'
            'draw line 'xl' 'yb' 'xr' 'yb
            'draw line 'xl' 'yt' 'xr' 'yt
         endif

         'set line 'col
         'draw recf 'xl' 'yb' 'xr' 'yt
         ;*---~---
      endif; endif
      ;*---~---


      ;*---~---
      ;*   This set of if blocks will decide when to write labels. By default we never write
      ;* the last one, and we will skip labels based on variables 'skip' and 'offset'. We 
      ;* calculate the order based on the values, to make sure labels are not shifted when
      ;* multiple levels share the same colour (typically values close to zero that are to
      ;* be ignored). 
      ;*---~---
      if (ii < ncols)
         if (math_mod(step-offset,skip) = 0)
            ;*---~---
            ;*   Choose orientation
            ;*---~---
            if (vchk)
               ;*--- Vertical orientation
               xp = xr + stroff
               'draw string 'xp' 'yt' 'hi
               ;*---~---
            else
               ;*--- Horizontal orientation
               yp = yb - stroff
               'draw string 'xr' 'yp' 'hi
               ;*---~---
            endif
            ;*---~---
         endif
         ;*---~---
      endif
      ;*---~---

      ;*---~---
      ;*   Update values.
      ;*---~---
      if (vchk)
         yb = yt;
      else
         xl = xr
      endif
      ;*---~---
   endwhile
return
*===+===
*===+===
