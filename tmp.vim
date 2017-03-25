let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/Projects/psd.js
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +0 index.js
badd +45 lib/psd.coffee
badd +0 shims/init.coffee
badd +0 lib/psd/file.coffee
badd +0 lib/psd/files.js
badd +0 dist/psd.js
argglobal
silent! argdel *
argadd index.js
edit dist/psd.js
set splitbelow splitright
wincmd _ | wincmd |
vsplit
wincmd _ | wincmd |
vsplit
2wincmd h
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd w
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
exe '1resize ' . ((&lines * 32 + 33) / 67)
exe 'vert 1resize ' . ((&columns * 106 + 159) / 318)
exe '2resize ' . ((&lines * 32 + 33) / 67)
exe 'vert 2resize ' . ((&columns * 106 + 159) / 318)
exe 'vert 3resize ' . ((&columns * 105 + 159) / 318)
exe 'vert 4resize ' . ((&columns * 105 + 159) / 318)
argglobal
setlocal fdm=marker
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 623 - ((13 * winheight(0) + 16) / 32)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
623
normal! 018|
wincmd w
argglobal
edit lib/psd/file.coffee
setlocal fdm=marker
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 31 - ((30 * winheight(0) + 16) / 32)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
31
normal! 0
wincmd w
argglobal
edit lib/psd/files.js
setlocal fdm=marker
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 45 - ((38 * winheight(0) + 32) / 65)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
45
normal! 09|
wincmd w
argglobal
edit index.js
setlocal fdm=marker
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 23 - ((14 * winheight(0) + 32) / 65)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
23
normal! 012|
wincmd w
3wincmd w
exe '1resize ' . ((&lines * 32 + 33) / 67)
exe 'vert 1resize ' . ((&columns * 106 + 159) / 318)
exe '2resize ' . ((&lines * 32 + 33) / 67)
exe 'vert 2resize ' . ((&columns * 106 + 159) / 318)
exe 'vert 3resize ' . ((&columns * 105 + 159) / 318)
exe 'vert 4resize ' . ((&columns * 105 + 159) / 318)
tabnext 1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToO
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
