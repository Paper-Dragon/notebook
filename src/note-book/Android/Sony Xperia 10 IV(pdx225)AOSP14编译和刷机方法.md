## Sony Xperia 10 IV(pdx225)AOSP14编译和刷机方法

## 编译机环境准备

### 清理环境

```bash
sudo apt-get purge openjdk-* icedtea-* icedtea6-*
```

### 安装jdk

```bash
sudo apt-get update
sudo apt-get install openjdk-11-jdk
java -version
```

```bash
openjdk version "11.0.20.1" 2023-08-24 
OpenJDK Runtime Environment (build 11.0.20.1+1-post-Ubuntu-0ubuntu120.04) 
OpenJDK 64-Bit Server VM (build 11.0.20.1+1-post-Ubuntu-0ubuntu120.04, mixed mode, sharing)
```

经过测试，大版本一致即可

### 安装依赖

```bash
sudo apt-get install bison g++-multilib git gperf libxml2-utils make zlib1g-dev:i386 zip liblz4-tool libncurses5 libssl-dev bc flex curl python-is-python3 zlib1g-dev libelf-dev dwarves
```



## 下载源码

> 官方参考链接： https://developer.sony.com/open-source/aosp-on-xperia-open-devices/guides/aosp-build-instructions/build-aosp-android-14/
>
> 经过测试官方最新源码无效，代码没有完全更新
>
> 这里需要选择 android-14.0.0_r34 版本进行编译

### 下载repo工具

下载工具并且添加进当前用户环境变量里

```bash
mkdir ~/bin
curl http://commondatastorage.googleapis.com/git-repo-downloads/repo > ~/bin/repo
chmod a+x ~/bin/repo

vim ~/.bashrc
export PATH=~/bin:$PATH

source ~/.bashrc
```

### 初始化AOSP官方源码树

> 使用 清华源更快

```bash
mkdir ~/android
cd ~/android
# repo init -u https://android.googlesource.com/platform/manifest -b <branch>
repo init -u https://mirrors.tuna.tsinghua.edu.cn/git/AOSP/platform/manifest -b android-14.0.0_r34

```



### 克隆sony官方源码库

```bash
cd .repo
git clone https://github.com/sonyxperiadev/local_manifests
cd local_manifests
git checkout android-14.0.0_r34
cd ../..
```

### 同步源码

```bash
repo sync -c -j8
```

## 合并源码

> 这一步必须执行，不单单是更新aosp源码，sony源码会合并到aosp里

```bash
./repo_update.sh
```

## 编译

> 编译机用了 38G 内存， 32G不够用
>
> lunch 必须是 aosp_xqcc54-ap1a-userdebug

```bash
source build/envsetup.sh && lunch lunch aosp_xqcc54-ap1a-userdebug
```

```bash
make -j$(nproc) 
```

## 电脑端驱动安装

>  插上手机用驱动精灵更方便，没有找到别的驱动，Android Studio会自带？



## 刷入

> 从官方下载OEM分区 并解压

> https://developer.sony.com/file/download/software-binaries-for-aosp-android-14-0-kernel-5-4-murray-v3a

总共需要如下镜像

```bash
$ ls -l | grep img
-rw-r--r-- 1 IT-Desktop 197121 100663296  8月 19 17:29 boot.img
-rw-r--r-- 1 IT-Desktop 197121  25165824  8月 19 17:31 dtbo.img
-rw-r--r-- 1 IT-Desktop 197121 287400120  8月 19 17:40 product.img
-rw-r--r-- 1 IT-Desktop 197121 446763712  6月  4 16:26 SW_binaries_for_Xperia_Android_14_5.4_v3a_murray.img
-rw-r--r-- 1 IT-Desktop 197121 897827108  8月 19 17:39 system.img
-rw-r--r-- 1 IT-Desktop 197121 200142984  8月 19 17:40 system_ext.img
-rw-r--r-- 1 IT-Desktop 197121   6226268  8月 19 17:39 userdata.img
-rw-r--r-- 1 IT-Desktop 197121      8192  8月 19 17:31 vbmeta.img
-rw-r--r-- 1 IT-Desktop 197121      4096  8月 19 17:40 vbmeta_system.img
-rw-r--r-- 1 IT-Desktop 197121 157900960  8月 19 17:39 vendor.img
-rw-r--r-- 1 IT-Desktop 197121 100663296  8月 19 17:40 vendor_boot.img

```



### 进入fastbootd模式

```bash
adb reboot fastboot
```





### 按分区刷入

> 有些分区编译出来没有，不刷也能正常运行

```bash
fastboot flash boot out/target/product/<device>/boot.img
fastboot flash vbmeta out/target/product/<device>/vbmeta.img
fastboot flash dtbo out/target/product/<device>/dtbo.img
# fastboot flash recovery out/target/product/<device>/recovery.img
fastboot flash system out/target/product/<device>/system.img
fastboot flash vendor out/target/product/<device>/vendor.img
fastboot flash userdata out/target/product/<device>/userdata.img
fastboot flash product out/target/product/<device>/product.img
fastboot flash vbmeta_system out/target/product/<device>/vbmeta_system.img
fastboot flash system_ext out/target/product/<device>/system_ext.img
fastboot flash vendor_boot out/target/product/<device>/vendor_boot.img
# fastboot flash vendor_dlkm_a out/target/product/<device>/vendor_dlkm.img

fastboot flash oem .....<path>/SW_binaries_for_Xperia_Android_14_5.4_v3a_murray.img
```





### 重启

```bash
fastboot reboot
```

