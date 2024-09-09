# Iptables实现转发一片连续的端口

## 转发命令

```bash
iptables -t nat -A PREROUTING -i xenbr0 -p tcp --dport 64000:65000 -j DNAT --to 172.16.10.10:61000-62000
```

**解释**

`--to` 是  `--to-destination` 或 `--to-source` 的简写

```bash
DNAT target options:
 --to-destination [<ipaddr>[-<ipaddr>]][:port[-port[/port]]]
                                Address to map destination to.
```

```bash
SNAT target options:
 --to-source [<ipaddr>[-<ipaddr>]][:port[-port]]
                                Address to map source to.

```

新版防火墙nftables入门解释 [https://blog.rachelt.one/articles/new-to-nftables-from-config-to-dnat/](https://blog.rachelt.one/articles/new-to-nftables-from-config-to-dnat/)