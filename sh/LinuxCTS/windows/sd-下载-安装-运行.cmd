@echo off

SET GenFile=stable-diffusion-webui
 
if not exist %GenFile% (
        git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
        cd stable-diffusion-webui 
        ./webui-user.bat
    ) else (
        cd stable-diffusion-webui
        ./webui-user.bat
    )
