
#!/usr/bin/env bash


wget -O /tmp/Sunday-cn.tar.gz https://gitee.com/muaimingjun/LinuxCTS/raw/main/app/Sunday-cn.tar.gz
sudo mkdir /usr/share/grub/themes
sudo tar -zxvf /tmp/Sunday-cn.tar.gz -C /usr/share/grub/themes

#4.将主题添加到文本文件的底部 
sudo echo GRUB_THEME=\"/usr/share/grub/themes/Sunday_cn/theme.txt\" >> /etc/default/grub

#5.更新 grub
sudo grub-mkconfig -o /boot/grub/grub.cfg

#6.重新启动计算机
echo "主题已经安装完成，5秒后重启计算机以应用主题"
sleep 5
reboot