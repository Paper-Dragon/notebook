# Iptables实现转发一片连续的端口

## 转发命令

```bash
iptables -t nat -A PREROUTING -i xenbr0 -p tcp --dport 64000:65000 -j DNAT --to 172.16.10.10:61000-62000
```



新版防火墙nftables入门解释 https://blog.rachelt.one/articles/new-to-nftables-from-config-to-dnat/?