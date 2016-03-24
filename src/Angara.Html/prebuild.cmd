set path=%1\Extensions\Microsoft\Web Tools\External\;%PATH%
cd %~p0\..\..\
echo calling npm in %CD%
call npm install
echo calling grunt 
call node node_modules\grunt-cli\bin\grunt angara_html --no-color
echo end of prebuild script