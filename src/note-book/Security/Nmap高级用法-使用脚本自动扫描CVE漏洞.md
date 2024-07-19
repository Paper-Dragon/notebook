# Nmap高级用法-使用脚本自动扫描CVE漏洞

> Nmap有一个高级的用法是NSE，即Nmap Scripting Engine，这个使得使用Nmap非常灵活。它允许用户自己编写脚本脚本，自动执行扫描任务。
>
> Nmap内置了比较全面的NSE脚本集合。



`nmap-vulners`和`vulscan`都使用CVE记录来增强Nmap的版本检测。Nmap将识别扫描服务的版本信息。NSE脚本将获取该信息并生成可用于利用该服务的已知CVE，这使得查找漏洞变得更加简单。



## 使用vuln云端扫描

使用NSE脚本的同一台服务器的示例

```bash
# vuln是内置脚本 有250G的漏洞数据库， 使用云端扫描
root@bit-node:~#   nmap -p- -sV --version-all --script vuln 124.222.170.9
Starting Nmap 7.80 ( https://nmap.org ) at 2024-07-19 09:20 UTC
Stats: 0:15:40 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
NSE Timing: About 99.68% done; ETC: 09:35 (0:00:01 remaining)
Nmap scan report for 124.222.170.9
Host is up (0.071s latency).
Not shown: 65517 closed ports
PORT     STATE    SERVICE        VERSION
21/tcp   open     ftp            Pure-FTPd
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
|_sslv2-drown: 
22/tcp   open     ssh            OpenSSH 7.4 (protocol 2.0)
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
| vulners: 
|   cpe:/a:openbsd:openssh:7.4: 
|       CVE-2023-38408  9.8 https://vulners.com/cve/CVE-2023-38408
|       B8190CDB-3EB9-5631-9828-8064A1575B23    9.8 https://vulners.com/githubexploit/B8190CDB-3EB9-5631-9828-8064A1575B23  *EXPLOIT*
|       8FC9C5AB-3968-5F3C-825E-E8DB5379A623    9.8 https://vulners.com/githubexploit/8FC9C5AB-3968-5F3C-825E-E8DB5379A623  *EXPLOIT*
|       CVE-2020-15778  7.8 https://vulners.com/cve/CVE-2020-15778
|       SSV:92579   7.5 https://vulners.com/seebug/SSV:92579    *EXPLOIT*
|       PACKETSTORM:173661  7.5 https://vulners.com/packetstorm/PACKETSTORM:173661  *EXPLOIT*
|       F0979183-AE88-53B4-86CF-3AF0523F3807    7.5 https://vulners.com/githubexploit/F0979183-AE88-53B4-86CF-3AF0523F3807  *EXPLOIT*
|       1337DAY-ID-26576    7.5 https://vulners.com/zdt/1337DAY-ID-26576    *EXPLOIT*
|       CVE-2021-41617  7.0 https://vulners.com/cve/CVE-2021-41617
|       EDB-ID:46516    6.8 https://vulners.com/exploitdb/EDB-ID:46516  *EXPLOIT*
|       EDB-ID:46193    6.8 https://vulners.com/exploitdb/EDB-ID:46193  *EXPLOIT*
|       CVE-2019-6110   6.8 https://vulners.com/cve/CVE-2019-6110
|       CVE-2019-6109   6.8 https://vulners.com/cve/CVE-2019-6109
|       C94132FD-1FA5-5342-B6EE-0DAF45EEFFE3    6.8 https://vulners.com/githubexploit/C94132FD-1FA5-5342-B6EE-0DAF45EEFFE3  *EXPLOIT*
|       10213DBE-F683-58BB-B6D3-353173626207    6.8 https://vulners.com/githubexploit/10213DBE-F683-58BB-B6D3-353173626207  *EXPLOIT*
|       CVE-2023-51385  6.5 https://vulners.com/cve/CVE-2023-51385
|       CVE-2023-48795  5.9 https://vulners.com/cve/CVE-2023-48795
|       CVE-2020-14145  5.9 https://vulners.com/cve/CVE-2020-14145
|       CVE-2019-6111   5.9 https://vulners.com/cve/CVE-2019-6111
|       EXPLOITPACK:98FE96309F9524B8C84C508837551A19    5.8 https://vulners.com/exploitpack/EXPLOITPACK:98FE96309F9524B8C84C508837551A19    *EXPLOIT*
|       EXPLOITPACK:5330EA02EBDE345BFC9D6DDDD97F9E97    5.8 https://vulners.com/exploitpack/EXPLOITPACK:5330EA02EBDE345BFC9D6DDDD97F9E97    *EXPLOIT*
|       1337DAY-ID-32328    5.8 https://vulners.com/zdt/1337DAY-ID-32328    *EXPLOIT*
|       1337DAY-ID-32009    5.8 https://vulners.com/zdt/1337DAY-ID-32009    *EXPLOIT*
|       MSF:AUXILIARY-SCANNER-SSH-SSH_ENUMUSERS-    5.3 https://vulners.com/metasploit/MSF:AUXILIARY-SCANNER-SSH-SSH_ENUMUSERS- *EXPLOIT*
|       EDB-ID:45939    5.3 https://vulners.com/exploitdb/EDB-ID:45939  *EXPLOIT*
|       EDB-ID:45233    5.3 https://vulners.com/exploitdb/EDB-ID:45233  *EXPLOIT*
|       CVE-2018-20685  5.3 https://vulners.com/cve/CVE-2018-20685
|       CVE-2018-15919  5.3 https://vulners.com/cve/CVE-2018-15919
|       CVE-2018-15473  5.3 https://vulners.com/cve/CVE-2018-15473
|       CVE-2017-15906  5.3 https://vulners.com/cve/CVE-2017-15906
|       CVE-2016-20012  5.3 https://vulners.com/cve/CVE-2016-20012
|       SSH_ENUM    5.0 https://vulners.com/canvas/SSH_ENUM *EXPLOIT*
|       PACKETSTORM:150621  5.0 https://vulners.com/packetstorm/PACKETSTORM:150621  *EXPLOIT*
|       EXPLOITPACK:F957D7E8A0CC1E23C3C649B764E13FB0    5.0 https://vulners.com/exploitpack/EXPLOITPACK:F957D7E8A0CC1E23C3C649B764E13FB0    *EXPLOIT*
|       EXPLOITPACK:EBDBC5685E3276D648B4D14B75563283    5.0 https://vulners.com/exploitpack/EXPLOITPACK:EBDBC5685E3276D648B4D14B75563283    *EXPLOIT*
|       1337DAY-ID-31730    5.0 https://vulners.com/zdt/1337DAY-ID-31730    *EXPLOIT*
|       CVE-2021-36368  3.7 https://vulners.com/cve/CVE-2021-36368
|       PACKETSTORM:151227  0.0 https://vulners.com/packetstorm/PACKETSTORM:151227  *EXPLOIT*
|       PACKETSTORM:140261  0.0 https://vulners.com/packetstorm/PACKETSTORM:140261  *EXPLOIT*
|_      1337DAY-ID-30937    0.0 https://vulners.com/zdt/1337DAY-ID-30937    *EXPLOIT*
80/tcp   open     http           nginx
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
|_http-csrf: Couldn't find any CSRF vulnerabilities.
|_http-dombased-xss: Couldn't find any DOM based XSS.
|_http-stored-xss: Couldn't find any stored XSS vulnerabilities.
| http-vuln-cve2011-3192: 
|   VULNERABLE:
|   Apache byterange filter DoS
|     State: VULNERABLE
|     IDs:  CVE:CVE-2011-3192  BID:49303
|       The Apache web server is vulnerable to a denial of service attack when numerous
|       overlapping byte ranges are requested.
|     Disclosure date: 2011-08-19
|     References:
|       https://www.tenable.com/plugins/nessus/55976
|       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-3192
|       https://www.securityfocus.com/bid/49303
|_      https://seclists.org/fulldisclosure/2011/Aug/175
88/tcp   open     http           nginx
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
|_http-csrf: Couldn't find any CSRF vulnerabilities.
|_http-dombased-xss: Couldn't find any DOM based XSS.
|_http-stored-xss: Couldn't find any stored XSS vulnerabilities.
| http-vuln-cve2011-3192: 
|   VULNERABLE:
|   Apache byterange filter DoS
|     State: VULNERABLE
|     IDs:  CVE:CVE-2011-3192  BID:49303
|       The Apache web server is vulnerable to a denial of service attack when numerous
|       overlapping byte ranges are requested.
|     Disclosure date: 2011-08-19
|     References:
|       https://www.tenable.com/plugins/nessus/55976
|       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2011-3192
|       https://www.securityfocus.com/bid/49303
|_      https://seclists.org/fulldisclosure/2011/Aug/175
135/tcp  filtered msrpc
139/tcp  filtered netbios-ssn
443/tcp  open     ssl/http       nginx
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
| http-cross-domain-policy: 
|   VULNERABLE:
|   Cross-domain and Client Access policies.
|     State: VULNERABLE
|       A cross-domain policy file specifies the permissions that a web client such as Java, Adobe Flash, Adobe Reader,
|       etc. use to access data across different domains. A client acces policy file is similar to cross-domain policy
|       but is used for M$ Silverlight applications. Overly permissive configurations enables Cross-site Request
|       Forgery attacks, and may allow third parties to access sensitive data meant for the user.
|     Check results:
|       /crossdomain.xml:
|   
|   
|   
|   
|         
|     Extra information:
|       Trusted domains:*
|   
|     References:
|       https://www.adobe.com/devnet-docs/acrobatetk/tools/AppSec/CrossDomain_PolicyFile_Specification.pdf
|       http://sethsec.blogspot.com/2014/03/exploiting-misconfigured-crossdomainxml.html
|       http://acunetix.com/vulnerabilities/web/insecure-clientaccesspolicy-xml-file
|       https://www.owasp.org/index.php/Test_RIA_cross_domain_policy_%28OTG-CONFIG-008%29
|       http://gursevkalra.blogspot.com/2013/08/bypassing-same-origin-policy-with-flash.html
|_      https://www.adobe.com/devnet/articles/crossdomain_policy_file_spec.html
| http-csrf: 
| Spidering limited to: maxdepth=3; maxpagecount=20; withinhost=124.222.170.9
|   Found the following possible CSRF vulnerabilities: 
|     
|     Path: https://124.222.170.9:443/
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/forum.php?showoldetails=no
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/forum.php?showoldetails=no
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&username=fweerg
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&username=fweerg
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/forum.php?mod=guide&amp;view=new
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/forum.php?mod=guide&amp;view=new
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/forum.php
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/forum.php
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90551
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90551
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/member.php?mod=register
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/member.php?mod=register
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/member.php?mod=register
|     Form id: registerform
|     Form action: member.php?mod=register
|     
|     Path: https://124.222.170.9:443/search.php?searchsubmit=yes
|     Form id: searchlogo
|     Form action: search.php?mod=forum
|     
|     Path: https://124.222.170.9:443/forum.php?mod=misc&amp;action=nav
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/forum.php?mod=misc&amp;action=nav
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90553
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90553
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90552
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90552
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/forum.php?mod=misc&action=showdarkroom
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/forum.php?mod=misc&action=showdarkroom
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90560
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90560
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90558
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90558
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/search.php?mod=forum&amp;srchtxt=%E4%BA%A4%E5%8F%8B&amp;formhash=f158a5cf&amp;searchsubmit=true&amp;source=hotsearch
|     Form id: searchlogo
|     Form action: search.php?mod=forum
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90557
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90557
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/member.php?mod=logging&amp;action=login&amp;loginsubmit=yes&amp;infloat=yes&amp;lssubmit=yes
|     Form id: scbar_form
|     Form action: search.php?searchsubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90556
|     Form id: lsform
|     Form action: member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes
|     
|     Path: https://124.222.170.9:443/home.php?mod=space&amp;uid=90556
|     Form id: scbar_form
|_    Form action: search.php?searchsubmit=yes
|_http-dombased-xss: Couldn't find any DOM based XSS.
|_http-stored-xss: Couldn't find any stored XSS vulnerabilities.
|_http-vuln-cve2017-1001000: ERROR: Script execution failed (use -d to debug)
|_sslv2-drown: 
445/tcp  filtered microsoft-ds
593/tcp  filtered http-rpc-epmap
888/tcp  open     http           nginx
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
|_http-aspnet-debug: ERROR: Script execution failed (use -d to debug)
|_http-csrf: Couldn't find any CSRF vulnerabilities.
|_http-dombased-xss: Couldn't find any DOM based XSS.
|_http-stored-xss: Couldn't find any stored XSS vulnerabilities.
|_http-vuln-cve2014-3704: ERROR: Script execution failed (use -d to debug)
3306/tcp open     mysql          MySQL 5.7.40-log
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
4444/tcp filtered krb524
4786/tcp filtered smart-install
5443/tcp open     ssl/spss?
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
|_sslv2-drown: 
6292/tcp open     unknown
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
| fingerprint-strings: 
|   GetRequest: 
|     HTTP/1.1 200 
|     Vary: Origin
|     Vary: Access-Control-Request-Method
|     Vary: Access-Control-Request-Headers
|     X-Content-Type-Options: nosniff
|     X-XSS-Protection: 1; mode=block
|     Cache-Control: no-cache, no-store, max-age=0, must-revalidate
|     Pragma: no-cache
|     Expires: 0
|     Content-Type: text/plain;charset=UTF-8
|     Content-Length: 92
|     Date: Fri, 19 Jul 2024 09:21:36 GMT
|     Connection: close
|     RuoYi
|     v3.6.0
|   HTTPOptions: 
|     HTTP/1.1 200 
|     Vary: Origin
|     Vary: Access-Control-Request-Method
|     Vary: Access-Control-Request-Headers
|     X-Content-Type-Options: nosniff
|     X-XSS-Protection: 1; mode=block
|     Cache-Control: no-cache, no-store, max-age=0, must-revalidate
|     Pragma: no-cache
|     Expires: 0
|     Content-Type: application/json;charset=utf-8
|     Content-Length: 79
|     Date: Fri, 19 Jul 2024 09:21:36 GMT
|     Connection: close
|     {"msg":"
|     ","code":401}
|   RTSPRequest: 
|     HTTP/1.1 400 
|     Content-Type: text/html;charset=utf-8
|     Content-Language: en
|     Content-Length: 435
|     Date: Fri, 19 Jul 2024 09:21:36 GMT
|     Connection: close
|     <!doctype html><html lang="en"><head><title>HTTP Status 400 
|     Request</title><style type="text/css">body {font-family:Tahoma,Arial,sans-serif;} h1, h2, h3, b {color:white;background-color:#525D76;} h1 {font-size:22px;} h2 {font-size:16px;} h3 {font-size:14px;} p {font-size:12px;} a {color:black;} .line {height:1px;background-color:#525D76;border:none;}</style></head><body><h1>HTTP Status 400 
|_    Request</h1></body></html>
8232/tcp open     http           Apache Tomcat 8.5.81
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
|_http-csrf: Couldn't find any CSRF vulnerabilities.
|_http-dombased-xss: Couldn't find any DOM based XSS.
| http-enum: 
|   /examples/: Sample scripts
|_  /docs/: Potentially interesting folder
|_http-stored-xss: Couldn't find any stored XSS vulnerabilities.
| vulners: 
|   cpe:/a:apache:tomcat:8.5.81: 
|       CVE-2020-8022   7.8 https://vulners.com/cve/CVE-2020-8022
|       F7F6E599-CEF4-5E03-8E10-FE18C4101E38    7.5 https://vulners.com/githubexploit/F7F6E599-CEF4-5E03-8E10-FE18C4101E38  *EXPLOIT*
|       E5C174E5-D6E8-56E0-8403-D287DE52EB3F    7.5 https://vulners.com/githubexploit/E5C174E5-D6E8-56E0-8403-D287DE52EB3F  *EXPLOIT*
|       DB6E1BBD-08B1-574D-A351-7D6BB9898A4A    7.5 https://vulners.com/githubexploit/DB6E1BBD-08B1-574D-A351-7D6BB9898A4A  *EXPLOIT*
|       CVE-2023-46589  7.5 https://vulners.com/cve/CVE-2023-46589
|       CVE-2023-44487  7.5 https://vulners.com/cve/CVE-2023-44487
|       CVE-2023-34981  7.5 https://vulners.com/cve/CVE-2023-34981
|       CVE-2023-28709  7.5 https://vulners.com/cve/CVE-2023-28709
|       CVE-2023-24998  7.5 https://vulners.com/cve/CVE-2023-24998
|       CVE-2022-45143  7.5 https://vulners.com/cve/CVE-2022-45143
|       CVE-2022-42252  7.5 https://vulners.com/cve/CVE-2022-42252
|       CVE-2021-30639  7.5 https://vulners.com/cve/CVE-2021-30639
|       CVE-2021-25122  7.5 https://vulners.com/cve/CVE-2021-25122
|       BFEA664A-42A3-57A8-997C-08119CE73488    7.5 https://vulners.com/githubexploit/BFEA664A-42A3-57A8-997C-08119CE73488  *EXPLOIT*
|       B0208442-6E17-5772-B12D-B5BE30FA5540    7.5 https://vulners.com/githubexploit/B0208442-6E17-5772-B12D-B5BE30FA5540  *EXPLOIT*
|       A820A056-9F91-5059-B0BC-8D92C7A31A52    7.5 https://vulners.com/githubexploit/A820A056-9F91-5059-B0BC-8D92C7A31A52  *EXPLOIT*
|       9814661A-35A4-5DB7-BB25-A1040F365C81    7.5 https://vulners.com/githubexploit/9814661A-35A4-5DB7-BB25-A1040F365C81  *EXPLOIT*
|       5A864BCC-B490-5532-83AB-2E4109BB3C31    7.5 https://vulners.com/githubexploit/5A864BCC-B490-5532-83AB-2E4109BB3C31  *EXPLOIT*
|       CVE-2021-25329  7.0 https://vulners.com/cve/CVE-2021-25329
|       CVE-2023-41080  6.1 https://vulners.com/cve/CVE-2023-41080
|       CVE-2022-34305  6.1 https://vulners.com/cve/CVE-2022-34305
|       CVE-2023-42794  5.9 https://vulners.com/cve/CVE-2023-42794
|       CVE-2021-24122  5.9 https://vulners.com/cve/CVE-2021-24122
|       CVE-2024-21733  5.3 https://vulners.com/cve/CVE-2024-21733
|       CVE-2023-45648  5.3 https://vulners.com/cve/CVE-2023-45648
|       CVE-2023-42795  5.3 https://vulners.com/cve/CVE-2023-42795
|       1337DAY-ID-39294    5.3 https://vulners.com/zdt/1337DAY-ID-39294    *EXPLOIT*
|       PACKETSTORM:176951  5.0 https://vulners.com/packetstorm/PACKETSTORM:176951  *EXPLOIT*
|       F60737C1-A24B-51C1-AE8D-73A65C778FFF    4.4 https://vulners.com/githubexploit/F60737C1-A24B-51C1-AE8D-73A65C778FFF  *EXPLOIT*
|       E95D9A0E-E9DE-5D95-9879-E07C0257318C    4.4 https://vulners.com/githubexploit/E95D9A0E-E9DE-5D95-9879-E07C0257318C  *EXPLOIT*
|       D5CBA0E2-A4B0-52CE-B93B-F433CE8662DA    4.4 https://vulners.com/githubexploit/D5CBA0E2-A4B0-52CE-B93B-F433CE8662DA  *EXPLOIT*
|       C4EDB405-454C-5160-9A99-21A930740C3F    4.4 https://vulners.com/githubexploit/C4EDB405-454C-5160-9A99-21A930740C3F  *EXPLOIT*
|       B0BA17F5-F171-5C97-9F6C-D5F38B5B64F5    4.4 https://vulners.com/githubexploit/B0BA17F5-F171-5C97-9F6C-D5F38B5B64F5  *EXPLOIT*
|       92CE6110-40F8-5FE5-909B-BE6B59186578    4.4 https://vulners.com/githubexploit/92CE6110-40F8-5FE5-909B-BE6B59186578  *EXPLOIT*
|       743F51FB-8BF4-5425-AEFA-10B2A14C8F3B    4.4 https://vulners.com/githubexploit/743F51FB-8BF4-5425-AEFA-10B2A14C8F3B  *EXPLOIT*
|       5602A60A-886A-598C-99B3-EE2E820506AD    4.4 https://vulners.com/githubexploit/5602A60A-886A-598C-99B3-EE2E820506AD  *EXPLOIT*
|       504D019A-423C-50A0-9677-93192F0ECDFC    4.4 https://vulners.com/githubexploit/504D019A-423C-50A0-9677-93192F0ECDFC  *EXPLOIT*
|       4278B435-D22E-57E8-ABC4-639BAAFA6FC9    4.4 https://vulners.com/githubexploit/4278B435-D22E-57E8-ABC4-639BAAFA6FC9  *EXPLOIT*
|       25B0D3BA-0039-5AAB-97E1-07A88FE23CC1    4.4 https://vulners.com/githubexploit/25B0D3BA-0039-5AAB-97E1-07A88FE23CC1  *EXPLOIT*
|       14CD7401-C309-52B2-B4EE-AD54900F0455    4.4 https://vulners.com/githubexploit/14CD7401-C309-52B2-B4EE-AD54900F0455  *EXPLOIT*
|       CVE-2023-28708  4.3 https://vulners.com/cve/CVE-2023-28708
|       CVE-2024-24549  0.0 https://vulners.com/cve/CVE-2024-24549
|_      CVE-2024-23672  0.0 https://vulners.com/cve/CVE-2024-23672
8888/tcp open     http           nginx
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
|_http-csrf: Couldn't find any CSRF vulnerabilities.
|_http-dombased-xss: Couldn't find any DOM based XSS.
| http-slowloris-check: 
|   VULNERABLE:
|   Slowloris DOS attack
|     State: LIKELY VULNERABLE
|     IDs:  CVE:CVE-2007-6750
|       Slowloris tries to keep many connections to the target web server open and hold
|       them open as long as possible.  It accomplishes this by opening connections to
|       the target web server and sending a partial request. By doing so, it starves
|       the http server's resources causing Denial Of Service.
|       
|     Disclosure date: 2009-09-17
|     References:
|       http://ha.ckers.org/slowloris/
|_      https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-6750
|_http-stored-xss: Couldn't find any stored XSS vulnerabilities.
9993/tcp open     palace-2?
|_clamav-exec: ERROR: Script execution failed (use -d to debug)
| fingerprint-strings: 
|   FourOhFourRequest, GetRequest, HTTPOptions: 
|     HTTP/1.1 401 Unauthorized
|     Content-Length: 2
|     Content-Type: application/json
|     Keep-Alive: timeout=5, max=5
|   GenericLines, Hello, Help, Kerberos, LDAPSearchReq, LPDString, NessusTPv12, RTSPRequest, SIPOptions, SSLSessionReq, SSLv23SessionReq, TLSSessionReq, TerminalServerCookie: 
|     HTTP/1.1 400 Bad Request
|     Content-Length: 0
|_    Keep-Alive: timeout=5, max=5
2 services unrecognized despite returning data. If you know the service/version, please submit the following fingerprints at https://nmap.org/cgi-bin/submit.cgi?new-service :
==============NEXT SERVICE FINGERPRINT (SUBMIT INDIVIDUALLY)==============
SF-Port6292-TCP:V=7.80%I=9%D=7/19%Time=669A3020%P=x86_64-pc-linux-gnu%r(Ge
SF:tRequest,1D9,"HTTP/1\.1\x20200\x20\r\nVary:\x20Origin\r\nVary:\x20Acces
SF:s-Control-Request-Method\r\nVary:\x20Access-Control-Request-Headers\r\n
SF:X-Content-Type-Options:\x20nosniff\r\nX-XSS-Protection:\x201;\x20mode=b
SF:lock\r\nCache-Control:\x20no-cache,\x20no-store,\x20max-age=0,\x20must-
SF:revalidate\r\nPragma:\x20no-cache\r\nExpires:\x200\r\nContent-Type:\x20
SF:text/plain;charset=UTF-8\r\nContent-Length:\x2092\r\nDate:\x20Fri,\x201
SF:9\x20Jul\x202024\x2009:21:36\x20GMT\r\nConnection:\x20close\r\n\r\n\xe6
SF:\xac\xa2\xe8\xbf\x8e\xe4\xbd\xbf\xe7\x94\xa8RuoYi\xe5\x90\x8e\xe5\x8f\x
SF:b0\xe7\xae\xa1\xe7\x90\x86\xe6\xa1\x86\xe6\x9e\xb6\xef\xbc\x8c\xe5\xbd\
SF:x93\xe5\x89\x8d\xe7\x89\x88\xe6\x9c\xac\xef\xbc\x9av3\.6\.0\xef\xbc\x8c
SF:\xe8\xaf\xb7\xe9\x80\x9a\xe8\xbf\x87\xe5\x89\x8d\xe7\xab\xaf\xe5\x9c\xb
SF:0\xe5\x9d\x80\xe8\xae\xbf\xe9\x97\xae\xe3\x80\x82")%r(HTTPOptions,1D2,"
SF:HTTP/1\.1\x20200\x20\r\nVary:\x20Origin\r\nVary:\x20Access-Control-Requ
SF:est-Method\r\nVary:\x20Access-Control-Request-Headers\r\nX-Content-Type
SF:-Options:\x20nosniff\r\nX-XSS-Protection:\x201;\x20mode=block\r\nCache-
SF:Control:\x20no-cache,\x20no-store,\x20max-age=0,\x20must-revalidate\r\n
SF:Pragma:\x20no-cache\r\nExpires:\x200\r\nContent-Type:\x20application/js
SF:on;charset=utf-8\r\nContent-Length:\x2079\r\nDate:\x20Fri,\x2019\x20Jul
SF:\x202024\x2009:21:36\x20GMT\r\nConnection:\x20close\r\n\r\n{\"msg\":\"\
SF:xe8\xaf\xb7\xe6\xb1\x82\xe8\xae\xbf\xe9\x97\xae\xef\xbc\x9a/\xef\xbc\x8
SF:c\xe8\xae\xa4\xe8\xaf\x81\xe5\xa4\xb1\xe8\xb4\xa5\xef\xbc\x8c\xe6\x97\x
SF:a0\xe6\xb3\x95\xe8\xae\xbf\xe9\x97\xae\xe7\xb3\xbb\xe7\xbb\x9f\xe8\xb5\
SF:x84\xe6\xba\x90\",\"code\":401}")%r(RTSPRequest,24E,"HTTP/1\.1\x20400\x
SF:20\r\nContent-Type:\x20text/html;charset=utf-8\r\nContent-Language:\x20
SF:en\r\nContent-Length:\x20435\r\nDate:\x20Fri,\x2019\x20Jul\x202024\x200
SF:9:21:36\x20GMT\r\nConnection:\x20close\r\n\r\n<!doctype\x20html><html\x
SF:20lang=\"en\"><head><title>HTTP\x20Status\x20400\x20\xe2\x80\x93\x20Bad
SF:\x20Request</title><style\x20type=\"text/css\">body\x20{font-family:Tah
SF:oma,Arial,sans-serif;}\x20h1,\x20h2,\x20h3,\x20b\x20{color:white;backgr
SF:ound-color:#525D76;}\x20h1\x20{font-size:22px;}\x20h2\x20{font-size:16p
SF:x;}\x20h3\x20{font-size:14px;}\x20p\x20{font-size:12px;}\x20a\x20{color
SF::black;}\x20\.line\x20{height:1px;background-color:#525D76;border:none;
SF:}</style></head><body><h1>HTTP\x20Status\x20400\x20\xe2\x80\x93\x20Bad\
SF:x20Request</h1></body></html>");
==============NEXT SERVICE FINGERPRINT (SUBMIT INDIVIDUALLY)==============
SF-Port9993-TCP:V=7.80%I=9%D=7/19%Time=669A301F%P=x86_64-pc-linux-gnu%r(Ge
SF:nericLines,4D,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Length:\x2
SF:00\r\nKeep-Alive:\x20timeout=5,\x20max=5\r\n\r\n")%r(GetRequest,70,"HTT
SF:P/1\.1\x20401\x20Unauthorized\r\nContent-Length:\x202\r\nContent-Type:\
SF:x20application/json\r\nKeep-Alive:\x20timeout=5,\x20max=5\r\n\r\n{}")%r
SF:(HTTPOptions,70,"HTTP/1\.1\x20401\x20Unauthorized\r\nContent-Length:\x2
SF:02\r\nContent-Type:\x20application/json\r\nKeep-Alive:\x20timeout=5,\x2
SF:0max=5\r\n\r\n{}")%r(RTSPRequest,4D,"HTTP/1\.1\x20400\x20Bad\x20Request
SF:\r\nContent-Length:\x200\r\nKeep-Alive:\x20timeout=5,\x20max=5\r\n\r\n"
SF:)%r(Hello,4D,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Length:\x20
SF:0\r\nKeep-Alive:\x20timeout=5,\x20max=5\r\n\r\n")%r(Help,4D,"HTTP/1\.1\
SF:x20400\x20Bad\x20Request\r\nContent-Length:\x200\r\nKeep-Alive:\x20time
SF:out=5,\x20max=5\r\n\r\n")%r(SSLSessionReq,4D,"HTTP/1\.1\x20400\x20Bad\x
SF:20Request\r\nContent-Length:\x200\r\nKeep-Alive:\x20timeout=5,\x20max=5
SF:\r\n\r\n")%r(TerminalServerCookie,4D,"HTTP/1\.1\x20400\x20Bad\x20Reques
SF:t\r\nContent-Length:\x200\r\nKeep-Alive:\x20timeout=5,\x20max=5\r\n\r\n
SF:")%r(TLSSessionReq,4D,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Le
SF:ngth:\x200\r\nKeep-Alive:\x20timeout=5,\x20max=5\r\n\r\n")%r(SSLv23Sess
SF:ionReq,4D,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Length:\x200\r
SF:\nKeep-Alive:\x20timeout=5,\x20max=5\r\n\r\n")%r(Kerberos,4D,"HTTP/1\.1
SF:\x20400\x20Bad\x20Request\r\nContent-Length:\x200\r\nKeep-Alive:\x20tim
SF:eout=5,\x20max=5\r\n\r\n")%r(FourOhFourRequest,70,"HTTP/1\.1\x20401\x20
SF:Unauthorized\r\nContent-Length:\x202\r\nContent-Type:\x20application/js
SF:on\r\nKeep-Alive:\x20timeout=5,\x20max=5\r\n\r\n{}")%r(LPDString,4D,"HT
SF:TP/1\.1\x20400\x20Bad\x20Request\r\nContent-Length:\x200\r\nKeep-Alive:
SF:\x20timeout=5,\x20max=5\r\n\r\n")%r(LDAPSearchReq,4D,"HTTP/1\.1\x20400\
SF:x20Bad\x20Request\r\nContent-Length:\x200\r\nKeep-Alive:\x20timeout=5,\
SF:x20max=5\r\n\r\n")%r(SIPOptions,4D,"HTTP/1\.1\x20400\x20Bad\x20Request\
SF:r\nContent-Length:\x200\r\nKeep-Alive:\x20timeout=5,\x20max=5\r\n\r\n")
SF:%r(NessusTPv12,4D,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Length
SF::\x200\r\nKeep-Alive:\x20timeout=5,\x20max=5\r\n\r\n");

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 1070.34 seconds
root@bit-node:~# 
```

## 步骤一

> 步骤来自 https://cloud.tencent.com/developer/article/1921015

### 安装：Nmap-Vulners

要安装nmap-vulners脚本，使用cd来更改为Nmap脚本目录。

```bash
cd /usr/share/nmap/scripts/
```

然后，克隆nmap-vulners GitHub存储库。安装后不需要配置

```bash
git clone https://github.com/vulnersCom/nmap-vulners.git
```

## 步骤二

### 安装：Vulscan

安装vulscan，将GitHub存储库克隆到Nmap脚本目录中。

使用以下命令以执行此操作。

```bash
git clone https://github.com/scipag/vulscan.git
```

如前所述，vulscan使用本地存储在我们计算机上的预配置数据库。我们可以在vulscan目录的根目录中查看这些数据库。

ls命令列出可用的数据库。

```bash
ls vulscan/*.csv
vulscan/cve.csv
vulscan/exploitdb.csv
vulscan/openvas.csv
vulscan/osvdb.csv
vulscan/scipvuldb.csv
vulscan/securityfocus.csv
vulscan/securitytracker.csv
vulscan/xforce.csv
```

#### Vulscan支持许多优秀的漏洞利用数据库：

```bash
scipvuldb.csv
cve.csv
osvdb.csv
securityfocus.csv
securitytracker.csv
xforce.csv
expliotdb.csv
openvas.csv
```

为确保数据库完全是最新的，可以使用 vulscan/utilities/updater/ 目录中的 updateFiles.sh 脚本。

通过在终端中键入以下命令，切换到updater目录。

```bash
cd vulscan/utilities/updater/
```

使用chmod命令确保具有执行权限。

```bash
chmod +x updateFiles.sh
```

可以通过以下命令来执行和运行脚本

```bash
./updateFiles.sh
```

完成后，我们现在可以开始使用NSE脚本了。

## 步骤三

### 使用Nmap-Vulners进行扫描

使用NSE脚本很简单。将 --script 参数添加到我们的Nmap命令中，并告诉Nmap使用哪个NSE脚本。

要使用nmap-vulners脚本，我们将使用以下命令。

当然，将 -p更改为扫描端口，将以下 井号 更改为您正在使用的IP地址。

```bash
nmap --script nmap-vulners -sV -p### #.###.###.### 
```

该-sV是绝对必要的。

使用-sV，我们告诉Nmap探测版本信息的目标地址。

如果Nmap不生成版本信息，则nmap-vulners将没有任何数据来查询Vulners数据库。

使用这些NSE脚本时始终使用-sV。

```bash
nmap --script nmap-vulners -sV -p80 1##.##.###.#/24
```

以下是其中一个正在使用的示例：

```bash
nmap --script vulscan --script-args vulscandb=exploitdb.csv -sV -p22 1##.##.### .#43

Starting Nmap 7.60 ( https://nmap.org )
Nmap scan report for 1##.##.### .#43
Host is up (0.52s latency).

PORT    STATE   SERVICE VERSION
22/tcp  open    ssh     OpenSSH 4.3 (protocol 2.0)
| vulscan: exploitdb.csv:
| [2444] OpenSSH <= 4.3 pl (Duplicated Block) Remote Denital of Service Exploit
| [21402] OpenSSH s.x/3.x Kerberos 4 TGT/AFS Token Buffer Overflow Vulnerability
| [3303] Portable OpenSSH <= 3.6.1p-PAM / 4.1-SUSE Timing Attack Exploit
```

作为VulDB的首席架构师，vulscan开发人员通常会花时间更新scipvuldb.csv数据库文件。

使用vulscan NSE脚本时，查询该数据库可能会产生最佳结果。

## 步骤五

合并为一个命令

作为安全扫描程序，NSE脚本显着提高了Nmap的多功能性。为了充分利用Nmap的版本扫描，我们可以在一个命令中同时使用nmap-vulners和vulscan。要执行此操作，键入以下命令。

```bash
nmap --script nmap-vulners,vulscan --script-args vulscandb=scipvuldb.csv -sV -p### #.###.###.### 
```
