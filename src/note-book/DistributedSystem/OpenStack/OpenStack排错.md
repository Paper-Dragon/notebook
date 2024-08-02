# OpenStack排错

## 排错Exceeded maximum number of re tries. Exhausted all hosts available for retrying build

**创建云主机报错Exceeded maximum number of re tries. Exhausted all hosts available for retrying build，无法创建云主机**

### 控制节点 controller
#### neutron 日志分析
grep ERROR /var/log/neutron/server.log

```bash
2020-11-22 18:17:30.537 27477 ERROR neutron.plugins.ml2.managers [req-c117507f-a7fd-452d-a0a3-fcf928c7d115 66c4a34b461444afac62a6c7416c109b df1082a78def4615a858b64a6c12c198 - 9a37718adbcf441aa294c93d40bb91bc 9a37718adbcf441aa294c93d40bb91bc] Failed to bind port 6c119e38-8772-49f4-ada1-a4d8ae3073fd on host compute for vnic_type normal using segments [{'network_id': '328a483e-a346-448c-9c45-c26fd0162754', 'segmentation_id': 3, 'physical_network': None, 'id': 'e11308a4-d612-4604-851a-8aa90754885d', 'network_type': u'vxlan'}]
2020-11-22 18:17:30.564 27477 ERROR neutron.plugins.ml2.managers [req-c117507f-a7fd-452d-a0a3-fcf928c7d115 66c4a34b461444afac62a6c7416c109b df1082a78def4615a858b64a6c12c198 - 9a37718adbcf441aa294c93d40bb91bc 9a37718adbcf441aa294c93d40bb91bc] Failed to bind port 6c119e38-8772-49f4-ada1-a4d8ae3073fd on host compute for vnic_type normal using segments [{'network_id': '328a483e-a346-448c-9c45-c26fd0162754', 'segmentation_id': 3, 'physical_network': None, 'id': 'e11308a4-d612-4604-851a-8aa90754885d', 'network_type': u'vxlan'}]
2020-11-22 18:17:30.588 27477 ERROR neutron.plugins.ml2.managers [req-c117507f-a7fd-452d-a0a3-fcf928c7d115 66c4a34b461444afac62a6c7416c109b df1082a78def4615a858b64a6c12c198 - 9a37718adbcf441aa294c93d40bb91bc 9a37718adbcf441aa294c93d40bb91bc] Failed to bind port 6c119e38-8772-49f4-ada1-a4d8ae3073fd on host compute for vnic_type normal using segments [{'network_id': '328a483e-a346-448c-9c45-c26fd0162754', 'segmentation_id': 3, 'physical_network': None, 'id': 'e11308a4-d612-4604-851a-8aa90754885d', 'network_type': u'vxlan'}]
2020-11-22 18:17:30.612 27477 ERROR neutron.plugins.ml2.managers [req-c117507f-a7fd-452d-a0a3-fcf928c7d115 66c4a34b461444afac62a6c7416c109b df1082a78def4615a858b64a6c12c198 - 9a37718adbcf441aa294c93d40bb91bc 9a37718adbcf441aa294c93d40bb91bc] Failed to bind port 6c119e38-8772-49f4-ada1-a4d8ae3073fd on host compute for vnic_type normal using segments [{'network_id': '328a483e-a346-448c-9c45-c26fd0162754', 'segmentation_id': 3, 'physical_network': None, 'id': 'e11308a4-d612-4604-851a-8aa90754885d', 'network_type': u'vxlan'}]
2020-11-22 18:17:30.635 27477 ERROR neutron.plugins.ml2.managers [req-c117507f-a7fd-452d-a0a3-fcf928c7d115 66c4a34b461444afac62a6c7416c109b df1082a78def4615a858b64a6c12c198 - 9a37718adbcf441aa294c93d40bb91bc 9a37718adbcf441aa294c93d40bb91bc] Failed to bind port 6c119e38-8772-49f4-ada1-a4d8ae3073fd on host compute for vnic_type normal using segments [{'network_id': '328a483e-a346-448c-9c45-c26fd0162754', 'segmentation_id': 3, 'physical_network': None, 'id': 'e11308a4-d612-4604-851a-8aa90754885d', 'network_type': u'vxlan'}]
```
其他日志文件

```bash
[root@controller neutron]# grep ERROR linuxbridge-agent.log 
[root@controller neutron]# grep ERROR l3-agent.log 
[root@controller neutron]# grep ERROR dhcp-agent.log 
[root@controller neutron]# grep ERROR metadata-agent.log 
```
#### nova 日志分析
nova-conductor.log 

```bash
2020-11-22 18:09:49.570 22881 WARNING oslo_config.cfg [req-33860c7c-9b1f-4b2d-a0f1-401ac21d43d0 83b70ce8339e4673ae33edf613291108 b91453e898d2402495f54b8533bc
002b - 9a37718adbcf441aa294c93d40bb91bc 9a37718adbcf441aa294c93d40bb91bc] Option "url" from group "neutron" is deprecated for removal (Endpoint lookup uses t
he service catalog via common keystoneauth1 Adapter configuration options. In the current release, "url" will override this behavior, but will be ignored and
/or removed in a future release. To achieve the same result, use the endpoint_override option instead.).  Its value may be silently ignored in the future.
2020-11-22 18:11:31.636 22880 ERROR nova.scheduler.utils [req-fe2b1525-0dc9-44ef-8ac1-013fc083323f 83b70ce8339e4673ae33edf613291108 b91453e898d2402495f54b853
3bc002b - 9a37718adbcf441aa294c93d40bb91bc 9a37718adbcf441aa294c93d40bb91bc] [instance: a9f3b569-708e-4a56-8f57-51e17924a1bc] Error from last host: compute (
node compute): [u'Traceback (most recent call last):\n', u'  File "/usr/lib/python2.7/site-packages/nova/compute/manager.py", line 1862, in _do_build_and_run
_instance\n    filter_properties, request_spec)\n', u'  File "/usr/lib/python2.7/site-packages/nova/compute/manager.py", line 2142, in _build_and_run_instanc
e\n    instance_uuid=instance.uuid, reason=six.text_type(e))\n', u'RescheduledException: Build of instance a9f3b569-708e-4a56-8f57-51e17924a1bc was re-schedu
led: Binding failed for port b924b7e9-0dfc-41a5-860a-4c0002fc7c68, please check neutron logs for more information.\n']
2020-11-22 18:11:31.638 22880 WARNING nova.scheduler.utils [req-fe2b1525-0dc9-44ef-8ac1-013fc083323f 83b70ce8339e4673ae33edf613291108 b91453e898d2402495f54b8
533bc002b - 9a37718adbcf441aa294c93d40bb91bc 9a37718adbcf441aa294c93d40bb91bc] Failed to compute_task_build_instances: Exceeded maximum number of retries. Ex
hausted all hosts available for retrying build failures for instance a9f3b569-708e-4a56-8f57-51e17924a1bc.: MaxRetriesExceeded: Exceeded maximum number of re
tries. Exhausted all hosts available for retrying build failures for instance a9f3b569-708e-4a56-8f57-51e17924a1bc.
2020-11-22 18:11:31.638 22880 WARNING nova.scheduler.utils [req-fe2b1525-0dc9-44ef-8ac1-013fc083323f 83b70ce8339e4673ae33edf613291108 b91453e898d2402495f54b8
533bc002b - 9a37718adbcf441aa294c93d40bb91bc 9a37718adbcf441aa294c93d40bb91bc] [instance: a9f3b569-708e-4a56-8f57-51e17924a1bc] Setting instance to ERROR sta
te.: MaxRetriesExceeded: Exceeded maximum number of retries. Exhausted all hosts available for retrying build failures for instance a9f3b569-708e-4a56-8f57-5
1e17924a1bc.
2020-11-22 18:17:33.047 22878 ERROR nova.scheduler.utils [req-47aa5b56-67c2-4dd3-9491-077d0bc12a11 83b70ce8339e4673ae33edf613291108 b91453e898d2402495f54b853
3bc002b - 9a37718adbcf441aa294c93d40bb91bc 9a37718adbcf441aa294c93d40bb91bc] [instance: 3c141ca8-0545-4627-af9b-30c84ec3454b] Error from last host: compute (
node compute): [u'Traceback (most recent call last):\n', u'  File "/usr/lib/python2.7/site-packages/nova/compute/manager.py", line 1862, in _do_build_and_run
_instance\n    filter_properties, request_spec)\n', u'  File "/usr/lib/python2.7/site-packages/nova/compute/manager.py", line 2142, in _build_and_run_instanc
e\n    instance_uuid=instance.uuid, reason=six.text_type(e))\n', u'RescheduledException: Build of instance 3c141ca8-0545-4627-af9b-30c84ec3454b was re-schedu
led: Binding failed for port 6c119e38-8772-49f4-ada1-a4d8ae3073fd, please check neutron logs for more information.\n']
2020-11-22 18:17:33.048 22878 WARNING nova.scheduler.utils [req-47aa5b56-67c2-4dd3-9491-077d0bc12a11 83b70ce8339e4673ae33edf613291108 b91453e898d2402495f54b8
533bc002b - 9a37718adbcf441aa294c93d40bb91bc 9a37718adbcf441aa294c93d40bb91bc] Failed to compute_task_build_instances: Exceeded maximum number of retries. Ex
hausted all hosts available for retrying build failures for instance 3c141ca8-0545-4627-af9b-30c84ec3454b.: MaxRetriesExceeded: Exceeded maximum number of re
tries. Exhausted all hosts available for retrying build failures for instance 3c141ca8-0545-4627-af9b-30c84ec3454b.
2020-11-22 18:17:33.049 22878 WARNING nova.scheduler.utils [req-47aa5b56-67c2-4dd3-9491-077d0bc12a11 83b70ce8339e4673ae33edf613291108 b91453e898d2402495f54b8
533bc002b - 9a37718adbcf441aa294c93d40bb91bc 9a37718adbcf441aa294c93d40bb91bc] [instance: 3c141ca8-0545-4627-af9b-30c84ec3454b] Setting instance to ERROR sta
te.: MaxRetriesExceeded: Exceeded maximum number of retries. Exhausted all hosts available for retrying build failures for instance 3c141ca8-0545-4627-af9b-3
0c84ec3454b.
2020-11-22 18:17:33.151 22878 WARNING oslo_config.cfg [req-47aa5b56-67c2-4dd3-9491-077d0bc12a11 83b70ce8339e4673ae33edf613291108 b91453e898d2402495f54b8533bc
002b - 9a37718adbcf441aa294c93d40bb91bc 9a37718adbcf441aa294c93d40bb91bc] Option "url" from group "neutron" is deprecated for removal (Endpoint lookup uses t
he service catalog via common keystoneauth1 Adapter configuration options. In the current release, "url" will override this behavior, but will be ignored and
/or removed in a future release. To achieve the same result, use the endpoint_override option instead.).  Its value may be silently ignored in the future.
```

均无法看出错误

### 计算节点 compute
#### tail -f linuxbridge-agent.log
```bash
_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
2020-11-22 18:18:37.411 12909 ERROR neutron.plugins.ml2.drivers.linuxbridge.agent.linuxbridge_neutron_agent [-] Tunneling cannot be enabled without the local_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
2020-11-22 18:18:40.376 12933 ERROR neutron.plugins.ml2.drivers.linuxbridge.agent.linuxbridge_neutron_agent [-] Tunneling cannot be enabled without the local_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
2020-11-22 18:18:43.384 12957 ERROR neutron.plugins.ml2.drivers.linuxbridge.agent.linuxbridge_neutron_agent [-] Tunneling cannot be enabled without the local_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
2020-11-22 18:18:46.179 12981 ERROR neutron.plugins.ml2.drivers.linuxbridge.agent.linuxbridge_neutron_agent [-] Tunneling cannot be enabled without the local_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
2020-11-22 18:18:49.139 13005 ERROR neutron.plugins.ml2.drivers.linuxbridge.agent.linuxbridge_neutron_agent [-] Tunneling cannot be enabled without the local_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
2020-11-22 18:18:52.156 13029 ERROR neutron.plugins.ml2.drivers.linuxbridge.agent.linuxbridge_neutron_agent [-] Tunneling cannot be enabled without the local_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
2020-11-22 18:18:54.938 13056 ERROR neutron.plugins.ml2.drivers.linuxbridge.agent.linuxbridge_neutron_agent [-] Tunneling cannot be enabled without the local_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
2020-11-22 18:18:57.886 13086 ERROR neutron.plugins.ml2.drivers.linuxbridge.agent.linuxbridge_neutron_agent [-] Tunneling cannot be enabled without the local_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
2020-11-22 18:19:00.898 13114 ERROR neutron.plugins.ml2.drivers.linuxbridge.agent.linuxbridge_neutron_agent [-] Tunneling cannot be enabled without the local_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
2020-11-22 18:19:03.881 13146 ERROR neutron.plugins.ml2.drivers.linuxbridge.agent.linuxbridge_neutron_agent [-] Tunneling cannot be enabled without the local_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
2020-11-22 18:19:06.870 13171 ERROR neutron.plugins.ml2.drivers.linuxbridge.agent.linuxbridge_neutron_agent [-] Tunneling cannot be enabled without the local_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
2020-11-22 18:19:09.873 13195 ERROR neutron.plugins.ml2.drivers.linuxbridge.agent.linuxbridge_neutron_agent [-] Tunneling cannot be enabled without the local_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
2020-11-22 18:19:12.878 13219 ERROR neutron.plugins.ml2.drivers.linuxbridge.agent.linuxbridge_neutron_agent [-] Tunneling cannot be enabled without the local_ip bound to an interface on the host. Please configure local_ip 172.17.1.10 on the host interface to be used for tunneling and restart the agent.
```
### 问题找到了 ，compute找不到Tunnel Network Interface. example:x.x.x.x

INTERFACE_IP=172.17.1.20

```bash
手误，更改 TUNNELIP后创建云主机正常

对于Q版快速更改方法
```

```bash
crudini --set /etc/neutron/plugins/ml2/linuxbridge_agent.ini linux_bridge physical_interface_mappings  provider:172.17.1.20
crudini --set /etc/neutron/plugins/ml2/linuxbridge_agent.ini vxlan local_ip 172.17.1.20
```