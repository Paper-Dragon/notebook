# Shell脚本加密解密工具Shc

# 一.简单介绍

shc是linux的一款加密脚本的插件，将shc放到系统的可执行目录下我们可以直接运行shc命令

# 二.shc的安装



```less
[root@disk ~]#yum install gcc -y
[root@disk ~]#curl -fsSl http://www.datsi.fi.upm.es/~frosal/sources/shc-3.8.9.tgz > shc-3.8.9.tgz
[root@disk ~]#tar zxf shc-3.8.9.tgz
[root@disk ~]#cd shc-3.8.9
[root@disk ~]#make
[root@disk ~]#mv shc /bin/
[root@disk ~]#cd
```

# 三.使用shc加密

参数说明：



```diff
-v：是加密过程
-f：后面跟需要加密的文件
```

这里举个实例进行说明：



```bash
[root@k8s001 test]# shc -v -rT -f test-shc.sh 
shc shll=bash
shc [-i]=-c
shc [-x]=exec '%s' "$@"
shc [-l]=
shc opts=
shc: cc  test-shc.sh.x.c -o test-shc.sh.x
shc: strip test-shc.sh.x
shc: chmod go-r test-shc.sh.x
```

运行完成后，会生成两个文件test-shc.sh.x和test-shc.sh.x.c，其中test-shc.sh.x为二进制文件，这里给予可执行权限后，可直接执行。当前也可以进行重命名：



```bash
# 直接执行二进制文件
[root@k8s001 test]# ./test-shc.sh.x 
==============shc test=============
#　重命名后执行
[root@k8s001 test]# mv test-shc.sh.x test.sh
[root@k8s001 test]# ./test.sh 
==============shc test=============
```

test-shc.sh.x.c是ｃ的源文件，这里基本没有作用，可以删除。

注意：这里我们需要注意参数-r很重要，如果脚本只需要在当前服务器上执行，可以不加，如果需要在别的系统下也能执行，这里就需要加-r

# 四.解密



```vhdl
[root@k8s001 test]# git clone https://github.com/yanncam/UnSHc.git
[root@k8s001 test]# ./UnSHc/latest/unshc.sh -h
 _   _       _____ _   _      
| | | |     /  ___| | | |     
| | | |_ __ \ `--.| |_| | ___ 
| | | | '_ \ `--. \  _  |/ __|
| |_| | | | /\__/ / | | | (__ 
 \___/|_| |_\____/\_| |_/\___|

--- UnSHc - The shc decrypter.
--- Version: 0.8
------------------------------
UnSHc is used to decrypt script encrypted with SHc
Original idea from Luiz Octavio Duarte (LOD)
Updated and modernized by Yann CAM
- SHc   : [http://www.datsi.fi.upm.es/~frosal/]
- UnSHc : [https://www.asafety.fr/unshc-the-shc-decrypter/]
------------------------------

[*] Usage : ./UnSHc/latest/unshc.sh [OPTIONS] <file.sh.x>
	 -h | --help                          : print this help message
	 -a OFFSET | --arc4 OFFSET            : specify the arc4() offset arbitrarily (without 0x prefix)
	 -d DUMPFILE | --dumpfile DUMPFILE    : provide an object dump file (objdump -D script.sh.x > DUMPFILE)
	 -s STRFILE | --stringfile STRFILE    : provide a string dump file (objdump -s script.sh.x > STRFILE)
	 -o OUTFILE | --outputfile OUTFILE    : indicate the output file name

[*] e.g : 
	./UnSHc/latest/unshc.sh script.sh.x
	./UnSHc/latest/unshc.sh script.sh.x -o script_decrypted.sh
	./UnSHc/latest/unshc.sh script.sh.x -a 400f9b
	./UnSHc/latest/unshc.sh script.sh.x -d /tmp/dumpfile -s /tmp/strfile
	./UnSHc/latest/unshc.sh script.sh.x -a 400f9b -d /tmp/dumpfile -s /tmp/strfile -o script_decrypted.sh
```

这里我们对刚才解密的脚本进行解密：这里脚本后面跟上我们需要解密的脚本即可



```bash
[root@k8s001 test]# ./UnSHc/latest/unshc.sh test.sh
[root@k8s001 test]# cat test.sh.sh 
#!/bin/bash 
echo "==============shc test============="
```