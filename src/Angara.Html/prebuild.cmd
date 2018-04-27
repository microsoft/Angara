set path=%1\Extensions\Microsoft\Web Tools\External\;%PATH%
cd %~p0\..\..\
echo calling yarn in %CD%
call packages\build\Yarnpkg.Yarn\content\bin\yarn.cmd
echo calling grunt 
call node node_modules\grunt-cli\bin\grunt angara_html --no-color
echo end of prebuild script