@echo off
setlocal enableextensions enabledelayedexpansion

if not exist settings.preset.js (
	
	echo �C���X�g�[���ɕK�v�� settings.preset.js �����݂��܂���B
	echo �Y���t�@�C�����ړ��������ꍇ�͂��̃t�H���_�[���ɁA
	echo �폜���邩�ꏊ���s���ȏꍇ�́A�ă_�E�����[�h���ē��肵�A�ēx�C���X�g�[�������s���Ă��������B
	goto END
	
)
if not exist settings.js copy /-Y settings.preset.js settings.js

call :isDir "img"

if not exist img md img
if not exist audios md audios

echo �C���X�g�[�����������܂����B
:END
endlocal
pause

:isDir
set isDir=%~a1:~1:1%
exit /b