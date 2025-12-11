*===+===
*===+===
*   This script makes some comparison plots from two MONAN runs.
*---~---


*---~---
*   Input settings
*---~---
* Main path
here      = '/mnt/beegfs/marcos.longo/CompareRuns'
* Baseline (control) run
base_nc   = 'MONAN+NoahMP+Base_DIAG_G_POS_GFS_2025092200.00.00.x1024002L55.nc'
* Test (new version) run
test_nc   = 'MONAN+NoahMP+Colour_DIAG_G_POS_GFS_2025092200.00.00.x1024002L55.nc'
* Path where figures will be placed
fig_path  = here'/Figures'
*---~---


*---~---
*   Simulation settings
*---~---
yyyy_0        = 2025                           ;* Initial time: year
mm_0          = 09                             ;* Initial time: month
dd_0          = 22                             ;* Initial time: day
hh_0          = 00                             ;* Initial time: hour
tta           = 2                              ;* First time to include in average
ttz           = 97                             ;* Last time to include in average
base_label    = 'Baseline'                     ;* Title label for baseline run
test_label    = 'Soil Colour'                  ;* Title label for test run
diff_label    = ''test_label' - 'base_label''  ;* Title label for differences
exp_key       = 'soil_colour_NoahMP'           ;* Key of this experiment, for file names
*---~---


*---~---
*   Plot settings
*---~---
dlon        =   45              ;* Distance between longitude axis ticks 
dlat        =   20              ;* Distance between latitude axis ticks
plotwm      =   1               ;* Plot Water Mark? 0 - No; 1 - Yes
wmstring    = 'DIMNT/CGCT/INPE' ;* Water mark string
xwm         = 8.0               ;* Water mark position (x)
ywm         = 0.2               ;* Water mark position (y)
outres      = 128               ;* Resolution of figures (points per inch)
interactive =   0               ;* Interactive session? (0 = no, 1 = yes)
                                ;*    Make sure this is 0 for batch runs.
*---~---


*---~---
*   List of variables that should be plotted for each simulation as well as the difference
* between simulations. These are defined through a series of vectors:
* 
* vnam           -- Variable name. This must be either a variable described in the NetCDF
*                   files, or 'albbulk' for "bulk" albedo, defined as 
*                   (averaged(SW_up)/averaged(SW_down)). 
* desc           -- Descriptive name of the variable, for title annotation
* unit           -- Units for variable, or "unitless" for variables with no unit.
* vlwr           -- Lowest value in colour ramp when plotting the actual value.
* vdelta         -- Bin widths for colour ramps (actual value).
* vformat        -- Format for labels, following the sprintf standard.
* vskip          -- Skip parameter for cbare.gs so the legend looks neat.
* vpalette       -- Colour palette for absolute values. Avoid divergent palettes unless
*                   the variable is a net flux (e.g., NEP, residuals).
* vreverse       -- Use colour palette in the reverse order? (0 = no ; 1 = yes)
* ddelta         -- Bin widths for colour ramps
* dformat        -- Format for labels, following the sprintf standard.
* nwhite         -- Number of white bins centred around zero that will be displayed as
*                   white. This must be an odd number, otherwise, it will be forced to
*                   be the next odd number. For example, if ddelta  is 0.2 and nwhite is 
*                   3, the following bins will be displayed as white:
*                   -0.3 -- -0.1; -0.1 -- 0.1; 0.1 -- 0.3.
* dskip          -- Skip parameter for cbare.gs so the legend looks neat. This number must
*                   be odd for values to be nicely centred around zero.
* dpalette       -- Colour palette for differences. Divergent palettes work best here.
* dreverse       -- Use colour palette in the reverse order? (0 = no ; 1 = yes)
*---~---
nvarplot      = 4
* Leaf area index
vnam.1        = 'lai'
   desc.1     = 'Leaf area index'
   unit.1     = 'm2/m2'
   vlwr.1     = 0.
   vdelta.1   = 0.125
   vformat.1  = '%.3f'
   vskip.1    = 8
   vpalette.1 = 'pubugn'
   vreverse.1 = 0
   ddelta.1   = 0.001
   dformat.1  = '%.4f'
   nwhite.1   = 3
   dskip.1    = 5
   dpalette.1 = 'piyg'
   dreverse.1 = 0
* Bulk albedo
vnam.2        = 'albbulk'
   desc.2     = 'Albedo'
   unit.2     = 'unitless'
   vlwr.2     = 0.
   vdelta.2   = 0.008
   vformat.2  = '%.3f'
   vskip.2    = 5
   vpalette.2 = 'plasma'
   vreverse.2 = 0
   ddelta.2   = 0.004
   dformat.2  = '%.3f'
   nwhite.2   = 3
   dskip.2    = 5
   dpalette.2 = 'bugy'
   dreverse.2 = 1
* Latent heat flux
vnam.3        = 'lh'
   desc.3     = 'Latent Heat'
   unit.3     = 'W/m2'
   vlwr.3     = -40.
   vdelta.3   = 60./9.
   vformat.3  = '%.1f'
   vskip.3    = 6
   vpalette.3 = 'ylgnbu'
   vreverse.3 = 0
   ddelta.3   = 1.
   nwhite.3   = 3
   dskip.3    = 5
   dformat.3  = '%.1f'
   dpalette.3 = 'rdbu'
   dreverse.3 = 0
* Sensible heat flux
vnam.4        = 'hfx'
   desc.4     = 'Sensible Heat'
   unit.4     = 'W/m2'
   vlwr.4     = -40.
   vdelta.4   = 60./9.
   vformat.4  = '%.0f'
   vskip.4    = 6
   vpalette.4 = 'orrd'
   vreverse.4 = 0
   ddelta.4   = 2.
   dformat.4  = '%.0f'
   nwhite.4   = 3
   dskip.4    = 5
   dpalette.4 = 'puor'
   dreverse.4 = 1
*---~---



*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*   No changes needed beyond this point, unless you are implementing new features or
* debugging the script.
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===


*--- Colour settings.
cola = 17                 ;* First colour used by most palettes
colz = 83                 ;* Last colour used by most palettes
'set rgb 84  48  48  48'  ;* Map colour
'set rgb 85  96  96  96'
'set rgb 86 204 204 204'
'set rgb 87 160 160 160'
'set rgb 91  59  66 179'
'set rgb 92 163 204  84'
'set rgb 93 230  92  23'
'set rgb 94 153  15  15'
'set rgb 95  48 102  20'
'set rgb 96  41 150 204'
'set rgb 97 180 158 210'
'set rgb 98 208  40   8'
'set rgb 99 255 255 255' ;* Background colour
*---~---



*---~---
*   Restart session
*---~---
'reinit'
version=defsetting()
say ' + GrADS version: 'version
say ' + Simulation comparison. 'diff_label
say ' + Open 'base_nc' -- 'base_label'.'
'sdfopen 'here'/'base_nc
say ' + Open 'test_nc' -- 'test_label'.'
'sdfopen 'here'/'test_nc
*---~---



*--- Retrieve all grid information
'query file'
dims   = sublin(result,5)
xmax   = subwrd(dims,3)
ymax   = subwrd(dims,6)
zmax   = subwrd(dims,9)
tmax   = subwrd(dims,12)
aux    = sublin(result,6)
say 'xmax = 'xmax
say 'ymax = 'ymax
say 'zmax = 'zmax
say 'tmax = 'tmax
say 'aux  = 'aux
*---~---



*--- Make sure ttz does not exceed tmax.
if (ttz > tmax)
   say ' Force ttz to be the maximum time ('tmax'). Original value: 'ttz'.'
   ttz=tmax
endif
*---~---


*--- Make sure the output path exists.
'! mkdir -pv 'fig_path
*---~---



*--- Retrieve the first time.
'set t 1'
'query time'
when         = subwrd(result,3)
zero_display = mktstamp(when)
zero_key     = mktimekey(when)
*---~---



*--- Retrieve the last time.
'set t 'tmax
'query time'
when         = subwrd(result,3)
last_display = mktstamp(when)
last_key     = mktimekey(when)
*---~---


*--- Bottom part of the title
bottitle = 'Averaging window: 'zero_display' - 'last_display
*---~---




*---~---
*   Plot soil colour
*---~---
   say ' * Plot soil colour'

   ;*--- Set colours
   'run slcol.gs'
   skip  = 1
   ;*---~--- 



   ;*--- Initial settings.
   'clear'
   'set t 1'
   'set z 1'
   'set lon -180 180'
   'set lat -90 90'
   'set xlint 'dlon
   'set ylint 'dlat
   'set mproj robinson'
   'set map  84 1 2'
   'set grads off'
   'set grid on 3 86 1'
   ;*---~--- 



   ;*--- Plot soil colour
   'display isctyp.2'
   ;*---~--- 



   ;*--- .
   toptitle = 'Soil colour index '
   'draw title 'toptitle
   ;*---~---


   ;*--- Plot water mark (if sought).
   if (plotwm); dummy = watermark(xwm,ywm,wmstring); endif
   ;*---~---


   ;*--- Make a figure
   fig_file = fig_path'/isctyp_'exp_key'_'zero_key'.png'
   'run fi.gs 'fig_file' 'outres
   ;*---~---

   ;*--- Wait for user to click before moving on (if interactive).
   if (interactive); 'query pos'; endif
   dummy = defsetting()
   ;*---~---
*---~---




*---~---
*   Loop through all variables to be plotted.
*---~---
ii = 0
while (ii < nvarplot)
   ii = ii + 1
   say ' * Plot average 'desc.ii':'

   ;*---~---
   ;*   Define averages and difference. Bulk albedo requires a specific calculation.
   ;*---~---
   if (vnam.ii = 'albbulk')
     'define base = ave(swupb.1,t='tta',t='ttz')/(ave(swdnb.1,t='tta',t='ttz')+0.00001)'
     'define test = ave(swupb.2,t='tta',t='ttz')/(ave(swdnb.2,t='tta',t='ttz')+0.00001)'
   else
     'define base = ave('vnam.ii'.1,t='tta',t='ttz')'
     'define test = ave('vnam.ii'.2,t='tta',t='ttz')'
   endif
   'define delta = test - base'
   ;*---~---





   ;*===+===
   ;*===+===
   ;*   Baseline simulation
   ;*---~---
   say '   - 'base_label'.'

      ;*--- Set colours
      'run 'vpalette.ii'.gs'
      ccols = collev_seq('ccols',cola,colz,vlwr.ii,vdelta.ii,0,99,0,0.5,vreverse.ii,vformat.ii)
      clevs = collev_seq('clevs',cola,colz,vlwr.ii,vdelta.ii,0,99,0,0.5,vreverse.ii,vformat.ii)
      ;*---~--- 



      ;*--- Initial settings.
      'clear'
      'set z 1'
      'set lon -180 180'
      'set lat -90 90'
      'set xlint 'dlon
      'set ylint 'dlat
      'set mproj robinson'
      'set map  84 1 2'
      'set grads off'
      'set grid on 3 86 1'
      ;*---~--- 



      ;*--- Plot variable for baseline run
      'set clevs 'clevs
      'set ccols 'ccols
      'set gxout shaded'
      'display base'
      'run cbare.gs 'vskip.ii' 0 1.0 0 -1 -1 -1 -45'
      ;*---~--- 



      ;*--- Add title.
      toptitle = 'Average 'desc.ii': 'base_label
      'draw title 'toptitle
      'draw xlab  'bottitle
      ;*---~---


      ;*--- Plot water mark (if sought).
      if (plotwm); dummy = watermark(xwm,ywm,wmstring); endif
      ;*---~---


      ;*--- Make a figure
      fig_file = fig_path'/'vnam.ii'_base_'exp_key'_'zero_key'.png'
      'run fi.gs 'fig_file' 'outres
      ;*---~---

      ;*--- Wait for user to click before moving on (if interactive).
      if (interactive); 'query pos'; endif
      dummy = defsetting()
      ;*---~---
   ;*===+===
   ;*===+===



   ;*===+===
   ;*===+===
   ;*   Test simulation
   ;*---~---
   say '   - 'test_label'.'

      ;*--- Set colours
      'run 'vpalette.ii'.gs'
      ccols = collev_seq('ccols',cola,colz,vlwr.ii,vdelta.ii,0,99,0,0.5,vreverse.ii,vformat.ii)
      clevs = collev_seq('clevs',cola,colz,vlwr.ii,vdelta.ii,0,99,0,0.5,vreverse.ii,vformat.ii)
      ;*---~--- 



      ;*--- Initial settings.
      'clear'
      'set z 1'
      'set lon -180 180'
      'set lat -90 90'
      'set xlint 'dlon
      'set ylint 'dlat
      'set mproj robinson'
      'set map  84 1 2'
      'set grads off'
      'set grid on 3 86 1'
      ;*---~--- 



      ;*--- Plot variable for baseline run
      'set clevs 'clevs
      'set ccols 'ccols
      'set gxout shaded'
      'display test'
      'run cbare.gs 'vskip.ii' 0 1.0 0 -1 -1 -1 -45'
      ;*---~--- 



      ;*--- Add title.
      toptitle = 'Average 'desc.ii': 'test_label
      'draw title 'toptitle
      'draw xlab  'bottitle
      ;*---~---


      ;*--- Plot water mark (if sought).
      if (plotwm); dummy = watermark(xwm,ywm,wmstring); endif
      ;*---~---


      ;*--- Make a figure
      fig_file = fig_path'/'vnam.ii'_test_'exp_key'_'zero_key'.png'
      'run fi.gs 'fig_file' 'outres
      ;*---~---

      ;*--- Wait for user to click before moving on (if interactive).
      if (interactive); 'query pos'; endif
      dummy = defsetting()
      ;*---~---
   ;*===+===
   ;*===+===



   ;*===+===
   ;*===+===
   ;*   Difference between test and baseline
   ;*---~---
   say '   - 'diff_label'.'

      ;*--- Set colours
      'run 'dpalette.ii'.gs'
      ccols = collev_div('ccols',cola,colz,ddelta.ii,99,nwhite.ii,dreverse.ii,dformat.ii)
      clevs = collev_div('clevs',cola,colz,ddelta.ii,99,nwhite.ii,dreverse.ii,dformat.ii)
      ;*---~---


      ;*---~---
      ;*   Find the correct offset so colour bar labels are symmetric
      ;*---~---
      ;* Number of colours.
      ncols    = 1+2*math_int((colz-cola)/2)
      actdskip = 1+2*math_int(dskip.ii/2)
      zeroleft = cola + math_int(ncols/2) - 1
      showleft = zeroleft - math_int(actdskip/2)
      offset   = math_mod(showleft-cola,actdskip)

      halt     = cola + actdskip - 1
      ;*---~---



      ;*--- Initial settings.
      'clear'
      'set z 1'
      'set lon -180 180'
      'set lat -90 90'
      'set xlint 'dlon
      'set ylint 'dlat
      'set mproj robinson'
      'set map  84 1 2'
      'set grads off'
      'set grid on 3 86 1'
      ;*---~--- 



      ;*--- Plot albedo
      'set clevs 'clevs
      'set ccols 'ccols
      'set gxout shaded'
      'display delta'
      'run cbare.gs 'actdskip' 'offset' 1.0 0 -1 -1 -1 -45'
      ;*---~--- 



      ;*--- Add title.
      toptitle = desc.ii' comparison: 'diff_label
      'draw title 'toptitle
      'draw xlab  'bottitle
      ;*---~---


      ;*--- Plot water mark (if sought).
      if (plotwm); dummy = watermark(xwm,ywm,wmstring); endif
      ;*---~---


      ;*--- Make a figure
      fig_file = fig_path'/'vnam.ii'_diff_'exp_key'_'zero_key'.png'
      'run fi.gs 'fig_file' 'outres
      ;*---~---


      ;*--- Wait for user to click before moving on (if interactive).
      if (interactive); 'query pos'; endif
      dummy = defsetting()
      ;*---~---

   ;*===+===
   ;*===+===

endwhile
*---~---




*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*   End of the main script, and beginning of list of functions and procedures.
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===
*===+===





*===+===
*===+===
*   This function retrieves the main version of this GrADS.
*---~---
function grads_version()
   'query config'
   version=sublin(result,1)
   version=subwrd(version,2)
   version=substr(version,2,3)
return version
*===+===
*===+===







*===+===
*===+===
*   This function splits the time into different parts. It returns a vector with the
* following components:
* split.1=year
* split.2=month(number)
* split.3=month(character)
* split.4=day
* split.5=hour
* split.6=minute
*
* This function requires the mmm2mm function.
*---~---
function splittime(when,which)
   third=substr(when,3,1)

   if (third = ':')
      split.6=substr(when,4,2)
      split.5=substr(when,1,2)
      split.4=substr(when,7,2)
      split.3=substr(when,9,3)
      split.2=mmm2mm(split.3)
      split.1=substr(tempo,12,4)
   else; if(third = 'z' | third = 'Z')
      split.6='00'
      split.5=substr(when,1,2)
      split.4=substr(when,4,2)
      split.3=substr(when,6,3)
      split.2=mmm2mm(split.3)
      split.1=substr(when,9,4)
   else
      split.6='00'
      split.5='00'
      split.4=substr(when,1,2)
      split.3=substr(when,3,3)
      split.2=mmm2mm(split.3)
      split.1=substr(when,6,4)
   endif;endif
   myvar=split.which
return myvar
*===+===
*===+===






*===+===
*===+===
*   Function that converts 3-letter month labels into 2-digit month labels.
*---~---
function mmm2mm(mmm)
   if (mmm = 'JAN' | mmm =  'jan'); mm='01' ;endif
   if (mmm = 'FEB' | mmm =  'feb'); mm='02' ;endif
   if (mmm = 'MAR' | mmm =  'mar'); mm='03' ;endif
   if (mmm = 'APR' | mmm =  'apr'); mm='04' ;endif
   if (mmm = 'MAY' | mmm =  'may'); mm='05' ;endif
   if (mmm = 'JUN' | mmm =  'jun'); mm='06' ;endif
   if (mmm = 'JUL' | mmm =  'jul'); mm='07' ;endif
   if (mmm = 'AUG' | mmm =  'aug'); mm='08' ;endif
   if (mmm = 'SEP' | mmm =  'sep'); mm='09' ;endif
   if (mmm = 'OCT' | mmm =  'oct'); mm='10' ;endif
   if (mmm = 'NOV' | mmm =  'nov'); mm='11' ;endif
   if (mmm = 'DEC' | mmm =  'dec'); mm='12' ;endif
return mm
*===+===
*===+===






*===+===
*===+===
*   Function that makes a neat vector map.  The wind scale is positioned away so it is
* not on top or beneath the colour scale, and lets you add the units.
*
* Arguments:
*   + xvec    -- X component of the vector
*   + yvec    -- Y component of the vector
*   + skipx   -- 100/skipx % of arrows on the X axis won't be drawn.
*   + skipy   -- 100/skipy % of arrows on the Y axis won't be drawn.
*   + arrtype -- type of arrow ('vector' or 'barb', used by set gxout).
*   + arrsize -- size of the reference arrow (only if arrtype is 'vector')
*   + arrmag  -- magnitude of the reference arrow (only if arrtype is 'vector')
*   + arrhead -- arrow head size (only if arrtype is 'vector')
*   + colmag  -- use colours to show vector magnitude? (0 means no, 1 means yes)
*   + colour  -- vector colour (only if colmag is 0)
*   + addscale -- add the colour scale (0 mean no, 1 means yes, only if arrtype is 'vector')
*   + unit     -- units for arrows (only if arrtype is 'vector')
*---~---
function drawvector(xvec,yvec,skipx,skipy,arrtype,arrsize,arrmag,arrhead,colmag,colour,addscale,unit)

   ;*--- Set the arrow type, with additional settings in case it is a vector. 
   'set arrscl 'arrsize' 'arrmag
   'set arrowhead 'arrhead
   'set arrlab off'
   'set gxout 'arrtype
   ;*---~---




   ;*--- Decide whether to use colours to show magnitude. 
   if (colmag)
      'display skip('xvec','skipx','skipy');'yvec';mag('xvec','yvec')'
   else
      'set ccolor 'colour
      'display skip('xvec','skipx','skipy');'yvec
   endif
   ;*---~---


   ;*--- Draw the arrow scale in case the user wants one. 
   if (addscale & arrtype = 'vector')
      ;*--- Get the position of the plotting area. 
      'query gxinfo'
      aux  = sublin(result,3)
      xmin = subwrd(aux,4)
      aux  = sublin(result,4)
      ymin = subwrd(aux,4)
      ;*---~---


      ;*---~---
      ;*   Find the coordinates for the arrow segment.
      ;*---~---
      xmin = xmin*0.2
      xmax = xmin+arrsize
      xmid = 0.5*(xmin+xmax)
      ymid = ymin*0.85
      'set line 1 1 5'
      'draw line 'xmin' 'ymid' 'xmax' 'ymid
      'draw line 'xmax-0.1' 'ymid-0.1' 'xmax' 'ymid
      'draw line 'xmax-0.1' 'ymid+0.1' 'xmax' 'ymid
      ;*---~---


      ;*--- Draw the label. 
      version=grads_version()
      if (version >= 2.1)
         'set strsiz 0.16'
      else
         'set strsiz 0.15'
      endif
      'set string 1 c 5 0'
      'draw string 'xmid' 'ymid-0.2' 'arrmag''unit
      ;*---~---
   endif
return
*===+===
*===+===





*===+===
*===+===
*   This function creates a sequential colour palette.  This is basically a long string 
* with colour and corresponding levels. Using this function for divergent colour palettes
* is not recommended, unless this is not intended to be symmetric around zero.
*
*  Arguments:
*    + which  -- which variable goes to output? Options are 'clevs' and 'ccols'
*    + cola   -- first colour
*    + colz   -- last colour
*    + val0   -- first level
*    + dval   -- delta value (or exponent in case of log scale)
*    + islog  -- Log scale? (0 means no, 1 means yes)
*    + white  -- colour number for white
*    + skip0  -- Make values around zero white? (0 means no, 1 means yes)
*    + near0  -- Maximum value close enough to be considered zero.
*    + colrev -- Reverse colours (from colz to cola)? (0 means no, 1 means yes)
*    + fmt    -- Output format.
*
*===+===
*===+===
function collev_seq(which,cola,colz,val0,dval,islog,white,skip0,near0,colrev,fmt)

   ;*--- Initialise the level and level vectors. 
   if (islog)
      vlwr   = val0 * math_pow(10,-dval)
      vmid   = vlwr * math_pow(10,0.5 * dval)
      vupr   = vlwr * math_pow(10, dval)
   else
      vlwr   = val0 - dval
      vmid   = vlwr + 0.5 * dval
      vupr   = vlwr + dval
   endif
   clevs  = ''
   ;*---~---


   ;*---~---
   ;*   First colour, check whether it should use colour or be zero.
   ;*---~---
   xnow   = cola
   if (skip0 & math_abs(vmid) <= near0)
      ccols  = 0
   else
      ccols  = xnow * (1 - colrev) + colrev * (colz - xnow + cola)
   endif
   ;*---~---


   ;*---~---
   ;*    Main loop.
   ;*---~---
   while (xnow < colz)
      xnow = xnow + 1

      ;*--- Update lev.
      vlwr = vupr
      if (islog)
         vmid = vlwr * math_pow(10,0.5 * dval)
         vupr = vlwr * math_pow(10,dval)
      else
         vmid = vlwr + 0.5 * dval
         vupr = vlwr + dval
      endif
      ;*---~---


      ;*--- Check which colour to use. 
      if (skip0 & math_abs(vmid) <= near0)
         col    = white
      else
         col  = xnow * (1 - colrev) + colrev * (colz - xnow + cola)
      endif
      ;*---~---

      ;*--- Append level and colour. 
      clevs = clevs' 'math_format(fmt,vlwr)
      ccols = ccols' 'col
      ;*---~---
   endwhile
   ;*---~---


   ;*--- Decide which string goes to answer. 
   wh = substr(which,1,2)
   if (wh = 'cl' | wh = 'CL' | wh = 'cL' | wh = 'Cl')
      ans = clevs
   else; if (wh = 'cc' | wh = 'CC' | wh = 'cC' | wh = 'Cc')
      ans = ccols
   else
      say 'Given option for WHICH ('which') is invalid.'
      say 'Use ccols or clevs (case insensitive, partial match is fine too)'
      exit
   endif; endif
   ;*---~---

return ans
*===+===
*===+===





*===+===
*===+===
*   This function creates a divergent colour palette that is symmetric around zero.  This
* is basically a long string with colour and corresponding levels. Using this function for
* sequential palettes is not recommended; use collev_seq instead.
*
*  Arguments:
*    + which  -- which variable goes to output? Options are 'clevs' and 'ccols'
*    + cola   -- first colour
*    + colz   -- last colour. If (colz-cola+1) is even, the last colour will be dropped.
*    + dval   -- delta value (or exponent in case of log scale)
*    + white  -- colour number for white
*    + nwhite -- Number of classes centred around zero that should be displayed as white.
*                This must be an odd number. If even, it will be coerced to the next odd
*                number (e.g., if nwhite = 2, the code will force it to be 3).
*    + near0  -- Maximum value close enough to be considered zero.
*    + colrev -- Reverse colours (from colz to cola)? (0 means no, 1 means yes)
*    + fmt    -- Output format.
*
*===+===
*===+===
function collev_div(which,cola,colz,dval,white,nwhite,colrev,fmt)

   ;*---~---
   ;*   Make sure we have an odd number of colours. If not, drop the last one.
   ;*---~---
   ncols = 1+2*math_int((colz-cola)/2)
   nlevs = ncols - 1
   colz  = cola + ncols - 1
   ;*---~---


   ;*---~---
   ;*   Make sure nwhite is odd, otherwise, force it to be the next odd number.
   ;*---~---
   nwhite = 1 + 2 * math_int(nwhite/2)
   near0  = 0.5 * nwhite * dval
   ;*---~---


   ;*---~---
   ;*   Find the lowest value, then initialise the level and level vector.
   ;*---~---
   vlwr   = - 0.5 * dval - (0.5 * nlevs) * dval
   vmid   = vlwr + 0.5 * dval
   vupr   = vlwr + dval
   clevs  = ''
   ;*---~---


   ;*---~---
   ;*   First colour, check whether it should use colour or be zero.
   ;*---~---
   xnow   = cola
   if (math_abs(vmid) <= near0)
      ccols  = 0
   else
      ccols  = xnow * (1 - colrev) + colrev * (colz - xnow + cola)
   endif
   ;*---~---


   ;*---~---
   ;*    Main loop.
   ;*---~---
   while (xnow < colz)
      xnow = xnow + 1

      ;*--- Update level.
      vlwr = vupr
      vmid = vlwr + 0.5 * dval
      vupr = vupr + dval
      ;*---~---


      ;*--- Check which colour to use. 
      if (math_abs(vmid) <= near0)
         col  = white
      else
         col  = xnow * (1 - colrev) + colrev * (colz - xnow + cola)
      endif
      ;*---~---


      ;*--- Append level and colour. 
      clevs = clevs' 'math_format(fmt,vlwr)
      ccols = ccols' 'col
      ;*---~---
   endwhile
   ;*---~---


   ;*--- Decide which string goes to answer. 
   wh = substr(which,1,2)
   if (wh = 'cl' | wh = 'CL' | wh = 'cL' | wh = 'Cl')
      ans = clevs
   else; if (wh = 'cc' | wh = 'CC' | wh = 'cC' | wh = 'Cc')
      ans = ccols
   else
      say 'Given option for WHICH ('which') is invalid.'
      say 'Use ccols or clevs (case insensitive, partial match is fine too)'
      exit
   endif; endif
   ;*---~---

return ans
*===+===
*===+===






*===+===
*===+===
*     This function resets all settings.  This should be called after every plot.
*---~---
function defsetting()
   'set display color white'
   'set mpdset sres'
   'set map 1 1 3'
   'run viridis.gs'
   'set gxout shaded'

   version=grads_version()


   ;*--- Several default options for arrows, annotations, and labels. 
   'set annot 1 5'
   'set arrowhead -0.20'
   'set grid off'
   'set grads off'
   'set xlab on'
   'set ylab on'
   'set xlpos 0 b'
   'set ylpos 0 l'
   'set xlopts 1 5 0.16'
   'set ylopts 1 5 0.16'
   'set clopts -1 5 0.13'
   ;*---~---


   ;*--- Make the plotting area larger. 
   'query gxinfo'
   aux=sublin(result,2)
   width=subwrd(aux,4)
   height=subwrd(aux,6)
   xa=1.50; xz=width-1.50
   ya=0.75; yz=height-0.75
   'set parea 'xa' 'xz' 'ya' 'yz
   ans = xa' 'xz' 'ya' 'yz
   ;*---~---
return version
*===+===
*===+===





*===+===
*===+===
*     This function plots the water mark.
*---~---
function watermark(xwm,ywm,wmstring)

   version=grads_version()
   if (version >= 2.1)
      strsiz = 0.13
   else
      strsiz = 0.11
   endif

   'set string 1 l 5 0'
   'set strsiz 'strsiz
   'draw string 'xwm' 'ywm' 'wmstring
return
*===+===
*===+===





*===+===
*===+===
*     This function finds a pretty scale given the lower and upper values, and the number
* of intervals.
*---~---
function pretty(low,high,nlev,islog)
   ;*--- Make sure low and high are different numbers.  If not, we make up something. 
   if (low = high)
      abslow = math_abs(low)
      if (abslow < 1.e-7)
         low  = 0
         high = 1
      else; if (low > 0)
         low  = 0.9 * low
         high = 1.1 * high
      else
         low  = 1.1 * low
         high = 0.9 * high
      endif; endif
   endif
   ;*---~---


   ;*--- Find the range, then a fraction mark. 
   range    = high - low
   rangelog = math_log10(range)
   rangelog = math_int(rangelog)
   rangeexp = math_pow(10.,rangelog)
   frac     = range / rangeexp
   if (frac < 1.5)
      range = 1.  * rangeexp
   else; if( frac < 3)
      range = 2.  * rangeexp
   else; if( frac < 7)
      range = 5.  * rangeexp
   else
      range = 10. * rangeexp
   endif; endif; endif
   ;*---~---


   ;*--- Now do the same for to get the step size. 
   delta = range / (nlev - 1)
   deltalog = math_log10(delta)
   deltalog = math_int(deltalog)
   deltaexp = math_pow(10.,deltalog)
   frac     = delta / deltaexp
   if (frac < 1.5)
      delta = 1.  * deltaexp
   else; if( frac < 3)
      delta = 2.  * deltaexp
   else; if( frac < 7)
      delta = 5.  * deltaexp
   else
      delta = 10. * deltaexp
   endif; endif; endif
   ;*---~---




   ;*---~---
   ;*     Find the minimum and maximum for plot that looks nice with the delta we have
   ;* just found.
   ;*---~---
   ;*--- Minimum.  Use the "floor" 
   outmin = math_int(low/delta)
   outmin = outmin * delta
   ;*--- Minimum.  Use the "floor" 
   outmax = math_ceiling(high/delta)
   outmax = outmax * delta
   ;*--- Nfrac is the number of fraction digits. 
   nfrac  = math_log10(delta)
   nfrac  = math_int(nfrac)
   nfrac  = - nfrac
   if (nfrac < 0); nfrac = 0; endif
   fmt    = '%.'nfrac'f'
   ;*---~---



   ;*---~---
   ;*   Create output vector with the levels.
   ;*---~---
   low  = math_format(fmt,outmin)
   dlt  = math_format(fmt,delta )
   val  = outmin - delta
   high = outmax + 0.5 * delta
   n    = 0
   while (val < high)
      n   = n   + 1
      val = val + delta
   endwhile
   high = math_format(fmt,high)
   ans = low' 'dlt' 'n
   ;*---~---
return ans
*===+===
*===+===






*===+===
*===+===
*    This function finds the ceiling of a number.
*---~---
function math_ceiling(x)
   integer = math_int(x)
   remain  = math_fmod(x,1)
   remain  = math_abs(remain)
   if (remain < 1.e-7)
      ans = integer
   else
      ans = integer + 1
   endif
return ans
*===+===
*===+===






*===+===
*===+===
*   This function creates a time stamp with format yyyy-mm-dd hhUTC.  This function requires
* the mmm2mm function.
*===+===
function mktstamp(when)
   third=substr(when,3,1)

   ;*--- Split the date information.
   if (third = ':')
      hour   = substr(when,1,2)
      day    = substr(when,7,2)
      mlabel = substr(when,9,3)
      year   = substr(when,12,4)
   else; if(third = 'z' | third = 'Z')
      hour   = substr(when,1,2)
      day    = substr(when,4,2)
      mlabel = substr(when,6,3)
      year   = substr(when,9,4)
   else
      hour   = '00'
      day    = substr(when,1,2)
      mlabel = substr(when,3,3)
      day    = substr(when,6,4)
   endif;endif
   ;*---~---



   ;*--- Retrieve month information (numeric format)
   month = mmm2mm(mlabel)
   ;*---~---



   ;*--- Write the label
   mylabel = year'-'month'-'day' 'hour'UTC'
   ;*---~---
return mylabel
*===+===
*===+===






*===+===
*===+===
*   This function creates a time key for file names with format yyyymmddhh.  This is similar
* to mktstamp, except that it makes sure that there are no spaces.
* the mmm2mm function.
*===+===
function mktimekey(when)
   third=substr(when,3,1)

   ;*--- Split the date information.
   if (third = ':')
      hour   = substr(when,1,2)
      day    = substr(when,7,2)
      mlabel = substr(when,9,3)
      year   = substr(when,12,4)
   else; if(third = 'z' | third = 'Z')
      hour   = substr(when,1,2)
      day    = substr(when,4,2)
      mlabel = substr(when,6,3)
      year   = substr(when,9,4)
   else
      hour   = '00'
      day    = substr(when,1,2)
      mlabel = substr(when,3,3)
      day    = substr(when,6,4)
   endif;endif
   ;*---~---



   ;*--- Retrieve month information (numeric format)
   month = mmm2mm(mlabel)
   ;*---~---



   ;*--- Write the key
   mykey = year''month''day''hour
   ;*---~---
return mykey
*===+===
*===+===






*===+===
*===+===
*    This function creates labels for radiosondes. This function requires the mmm2mm 
* function.
*===+===
function mkradio_stamp(tnow)
   'set t 'tnow
   'query time'
   when=subwrd(result,3)
   third=substr(when,3,1)


   ;*--- Split the date information.
   if (third = ':')
      hour   = substr(when,1,2)
      day    = substr(when,7,2)
      mlabel = substr(when,9,3)
      year   = substr(when,12,4)
   else; if(third = 'z' | third = 'Z')
      hour   = substr(when,1,2)
      day    = substr(when,4,2)
      mlabel = substr(when,6,3)
      year   = substr(when,9,4)
   else
      hour   = '00'
      day    = substr(when,1,2)
      mlabel = substr(when,3,3)
      year   = substr(when,6,4)
   endif;endif
   ;*---~---




   ;*--- Retrieve month information (numeric format)
   month = mmm2mm(mlabel)
   ;*---~---


   ;*--- Retrieve forecast time.
   tfor  = tnow-1
   tfor  = math_format('%03.0f',tfor)
   ;*---~---




   ;*--- Write the key
   mykey = year''month''day''hour'_'tfor
   ;*---~---
return mykey
*===+===
*===+===







*===+===
*===+===
*   This function translates the months to Portuguese.
*---~---
function month_port(month)
   if (month = 'JAN' | month =  'jan'); mport='JAN' ;endif
   if (month = 'FEB' | month =  'feb'); mport='FEV' ;endif
   if (month = 'MAR' | month =  'mar'); mport='MAR' ;endif
   if (month = 'APR' | month =  'apr'); mport='ABR' ;endif
   if (month = 'MAY' | month =  'may'); mport='MAI' ;endif
   if (month = 'JUN' | month =  'jun'); mport='JUN' ;endif
   if (month = 'JUL' | month =  'jul'); mport='JUL' ;endif
   if (month = 'AUG' | month =  'aug'); mport='AGO' ;endif
   if (month = 'SEP' | month =  'sep'); mport='SET' ;endif
   if (month = 'OCT' | month =  'oct'); mport='OUT' ;endif
   if (month = 'NOV' | month =  'nov'); mport='NOV' ;endif
   if (month = 'DEC' | month =  'dec'); mport='DEZ' ;endif
return mport
*===+===
*===+===
