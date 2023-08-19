## 一、setup模块

setup模块用于收集远程主机的基本信息（如操作系统类型,主机名,ip,cpu信息,内存信息等）

```
#打印192.168.98.201机器的所有信息
[root@manage01 ~]# ansible -m setup 192.168.98.201

#使用filter过滤输出
#打印192.168.98.201机器的CPU信息
[root@manage01 ~]# ansible -m setup 192.168.98.201 -a "filter='ansible_processor'"
192.168.98.201 | SUCCESS => {
    "ansible_facts": {
        "ansible_processor": [
            "0",
            "GenuineIntel",
            "Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz",
            "1",
            "GenuineIntel",
            "Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz",
            "2",
            "GenuineIntel",
            "Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz",
            "3",
            "GenuineIntel",
            "Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz"
        ],
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": false
}
#打印192.168.98.201机器的内核信息
[root@manage01 ~]# ansible -m setup 192.168.98.201 -a "filter='ansible_kernel'"
192.168.98.201 | SUCCESS => {
    "ansible_facts": {
        "ansible_kernel": "4.18.0-80.el8.x86_64",
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": false
}
#打印192.168.98.201机器的主机名
[root@manage01 ~]#  ansible -m setup 192.168.98.201 -a "filter='ansible_hostname'"
192.168.98.201 | SUCCESS => {
    "ansible_facts": {
        "ansible_hostname": "node1",
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": false
}
#打印192.168.98.201机器的网卡信息
[root@manage01 ~]# ansible -m setup 192.168.98.201 -a "filter='ansible_ens*'"
192.168.98.201 | SUCCESS => {
    "ansible_facts": {
        "ansible_ens33": {
            "active": true,
            "device": "ens33",
            "features": {
                "esp_hw_offload": "off [fixed]",
                "esp_tx_csum_hw_offload": "off [fixed]",
                "fcoe_mtu": "off [fixed]",
                "generic_receive_offload": "on",
                "generic_segmentation_offload": "on",
                "highdma": "off [fixed]",
                "hw_tc_offload": "off [fixed]",
                "l2_fwd_offload": "off [fixed]",
                "large_receive_offload": "off [fixed]",
                "loopback": "off [fixed]",
                "netns_local": "off [fixed]",
                "ntuple_filters": "off [fixed]",
                "receive_hashing": "off [fixed]",
                "rx_all": "off",
                "rx_checksumming": "off",
                "rx_fcs": "off",
                "rx_gro_hw": "off [fixed]",
                "rx_udp_tunnel_port_offload": "off [fixed]",
                "rx_vlan_filter": "on [fixed]",
                "rx_vlan_offload": "on",
                "rx_vlan_stag_filter": "off [fixed]",
                "rx_vlan_stag_hw_parse": "off [fixed]",
                "scatter_gather": "on",
                "tcp_segmentation_offload": "on",
                "tls_hw_record": "off [fixed]",
                "tls_hw_tx_offload": "off [fixed]",
                "tx_checksum_fcoe_crc": "off [fixed]",
                "tx_checksum_ip_generic": "on",
                "tx_checksum_ipv4": "off [fixed]",
                "tx_checksum_ipv6": "off [fixed]",
                "tx_checksum_sctp": "off [fixed]",
                "tx_checksumming": "on",
                "tx_esp_segmentation": "off [fixed]",
                "tx_fcoe_segmentation": "off [fixed]",
                "tx_gre_csum_segmentation": "off [fixed]",
                "tx_gre_segmentation": "off [fixed]",
                "tx_gso_partial": "off [fixed]",
                "tx_gso_robust": "off [fixed]",
                "tx_ipxip4_segmentation": "off [fixed]",
                "tx_ipxip6_segmentation": "off [fixed]",
                "tx_lockless": "off [fixed]",
                "tx_nocache_copy": "off",
                "tx_scatter_gather": "on",
                "tx_scatter_gather_fraglist": "off [fixed]",
                "tx_sctp_segmentation": "off [fixed]",
                "tx_tcp6_segmentation": "off [fixed]",
                "tx_tcp_ecn_segmentation": "off [fixed]",
                "tx_tcp_mangleid_segmentation": "off",
                "tx_tcp_segmentation": "on",
                "tx_udp_segmentation": "off [fixed]",
                "tx_udp_tnl_csum_segmentation": "off [fixed]",
                "tx_udp_tnl_segmentation": "off [fixed]",
                "tx_vlan_offload": "on [fixed]",
                "tx_vlan_stag_hw_insert": "off [fixed]",
                "udp_fragmentation_offload": "off",
                "vlan_challenged": "off [fixed]"
            },
            "hw_timestamp_filters": [],
            "ipv4": {
                "address": "192.168.98.201",
                "broadcast": "192.168.98.255",
                "netmask": "255.255.255.0",
                "network": "192.168.98.0"
            },
            "ipv6": [
                {
                    "address": "fe80::357b:9443:2232:f0c0",
                    "prefix": "64",
                    "scope": "link"
                }
            ],
            "macaddress": "00:0c:29:b8:d0:45",
            "module": "e1000",
            "mtu": 1500,
            "pciid": "0000:02:01.0",
            "promisc": false,
            "speed": 1000,
            "timestamping": [
                "tx_software",
                "rx_software",
                "software"
            ],
            "type": "ether"
        },
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": false
}


其它常见的过滤条件
ansible_all_ipv4_addresses：显示ipv4的信息。
ansible_devices：显示磁盘设备信息。
ansible_distribution_major_version：显示是系统主版本。
ansible_distribution_version：仅显示系统版本。
ansible_machine：显示系统类型，例：32位，还是64位。
ansible_lvm：显示lvm相关信息。
ansible_memtotal_mb：显示系统总内存。
ansible_memfree_mb：显示可用系统内存。
ansible_memory_mb：详细显示内存情况。
ansible_swaptotal_mb：显示总的swap内存。
ansible_swapfree_mb：显示swap内存的可用内存。
ansible_mounts：显示系统磁盘挂载情况。
ansible_processor：显示cpu个数(具体显示每个cpu的型号)。
ansible_processor_vcpus：显示cpu个数(只显示总的个数)。
```

## 二、学习视频

[视频：setup模块](https://www.bilibili.com/video/BV19J41167sM?p=24)