@echo off
setlocal enableextensions enabledelayedexpansion

if not exist settings.preset.js (
	
	echo インストールに必要な settings.preset.js が存在しません。
	echo 該当ファイルを移動させた場合はこのフォルダー内に、
	echo 削除するか場所が不明な場合は、再ダウンロードして入手し、再度インストールを実行してください。
	goto END
	
)
if not exist settings.js copy /-Y settings.preset.js settings.js

call :isDir "img"

if not exist img md img
if not exist audios md audios

echo インストールを完了しました。
:END
endlocal
pause

:isDir
set isDir=%~a1:~1:1%
exit /b