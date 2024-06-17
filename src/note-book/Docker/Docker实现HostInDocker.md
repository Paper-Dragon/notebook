# Docker实现HostInDocker

先记录过程，有空再写

```bash
root@aaa-ai~# docker run -it --ipc=host --pid=host -v host ubuntu bash
root@bedd413c7d54# chroot host bash
root@bedd413c7d54# docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED          STATUS          PORTS     NAMES
bedd413c7d54   ubuntu    bash    19 seconds ago   Up 17 seconds             angry_spence
root@bedd413c7d54# systemctl status nginx
● nginx.service - A high performance web server and a reverse proxy server
     Loaded loaded (libsystemdsystemnginx.service; enabled; vendor preset enabled)
     Active active (running) since Wed 2024-04-17 152345 CST; 6min ago
       Docs mannginx(8)
    Process 194847 ExecStartPre=usrsbinnginx -t -q -g daemon on; master_process on; (code=exited, status=0SUCCESS)
    Process 194848 ExecStart=usrsbinnginx -g daemon on; master_process on; (code=exited, status=0SUCCESS)
   Main PID 194849 (nginx)
      Tasks 17 (limit 38341)
     Memory 13.8M
        CPU 43ms
     CGroup system.slicenginx.service
             ├─194849 nginx master process usrsbinnginx -g daemon on; master_process on;
             ├─194850 nginx worker process                           
             ├─194851 nginx worker process                           
             ├─194852 nginx worker process                           
             ├─194853 nginx worker process                           
             ├─194854 nginx worker process                           
             ├─194855 nginx worker process                           
             ├─194856 nginx worker process                           
             ├─194857 nginx worker process                           
             ├─194858 nginx worker process                           
             ├─194859 nginx worker process                           
             ├─194860 nginx worker process                           
             ├─194861 nginx worker process                           
             ├─194862 nginx worker process                           
             ├─194863 nginx worker process                           
             ├─194864 nginx worker process                           
             └─194865 nginx worker process                           

Apr 17 152345 aaa-ai systemd[1] Starting A high performance web server and a reverse proxy server...
Apr 17 152345 aaa-ai systemd[1] Started A high performance web server and a reverse proxy server.

```
