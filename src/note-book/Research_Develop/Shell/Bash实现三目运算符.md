# Bash实现三目运算符

## 三目运算符

shell能否实现三目运算符呢？像下面这样：

```c
int a = (b == 1) ? c : d;
```

## 实现方法

```bash
a=$([ "$b" == "1" ] && echo "$c" || echo "$d")
```

## 原理

&&的优先级比||高，所以如果前面的&&成功，后面的||就不会执行；相反，后面的||就会执行。

## 案例

```bash
cat >/lib/systemd/system/${TARGET_FRP_NAME}.service <<EOF
[Unit]
Description=$([ "${SPY_MODE}" == "False" ] && echo "Frp Server Service" || echo "Qemu Virtual Service")
After=network.target syslog.target
Wants=network.target

[Service]
Type=simple
Restart=on-failure
RestartSec=5s
ExecStart=${FRP_PATH}/${TARGET_FRP_NAME} -c ${FRP_PATH}/${TARGET_FRP_NAME}.ini
$([ "${SPY_MODE}" == "False" ] && echo "" || echo -e "StandardOutput=null\nStandardError=null")

[Install]
WantedBy=multi-user.target
EOF

```

