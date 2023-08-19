## 写一个KFC餐厅点餐程序

**案例需求**
写一个程序，模拟KFC点餐系统，要求有以下功能：

- 1、点餐功能
- 2、结算功能
- 3、打印流水单

**案例步骤**

- 1、交互点餐
- 2、结账收银
- 3、打印流水单给客户

**案例代码**

```
#!/bin/bash
# 
#Author:www.zutuanxue.com
#
#Release: 
#Description: 

#1)录入单价
HBB=19.8
JC=12.3
KL=9.9

#2)定义输出
cat <<EOF
				welcome to KFC
今天KFC提供菜品如下:
	1）汉堡
	2）鸡翅
	3）可乐
EOF

echo -e "\n请您输入希望购买菜品的数量，不需要输入0\n"
###1.用户交互
#定义变量类型为整形
declare -i NUM_HBB
declare -i NUM_JC
declare -i NUM_KL

read -p "汉堡: " NUM_HBB
read -p "鸡翅: " NUM_JC
read -p "可乐: " NUM_KL

###2.计算输出
HBB_price=`echo "scale=2;$HBB*$NUM_HBB"|bc`
JC_price=`echo "scale=2;$JC*$NUM_JC"|bc`
KL_price=`echo "scale=2;$KL*$NUM_KL"|bc`
total_price=`echo "scale=2;$HBB_price+$JC_price+$KL_price"|bc`

###3.付款
echo -n "合计: $total_price "
read -p "请付款: " USER_price

###4.打印小票
clear
echo -e "\t\tKFC结算单"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "商品\t单价\t数量\t合计"
echo -e "汉堡包\t$HBB\t$NUM_HBB\t$HBB_price"
echo -e "鸡翅\t$JC\t$NUM_JC\t$JC_price"
echo -e "可乐\t$KL\t$NUM_KL\t$KL_price"
echo -e "\n\n"
echo "总计: $total_price"
echo -e "支付:$USER_price"
echo -e "找零: `echo "scale=2;$USER_price-$total_price"|bc`"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo -e "地址:北京东大桥路33号KFC店\n联系电话:400-123-456\nwww.kfc.com"
```

**案例效果**

![仿真KFC.gif](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601010636415.gif)