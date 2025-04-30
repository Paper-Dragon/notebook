import{ah as n,ai as a,an as e,am as i}from"./app-DBI7Ez9C.js";const l="/assets/1034759-20191123175410495-632059730-16918406651821-zxJIbfm2.png",p="/assets/1034759-20191123195126520-796246549-16918406692903-C-jYa0mg.png",r={};function d(c,s){return i(),a("div",null,s[0]||(s[0]=[e('<h1 id="kubernetes进阶-四-服务暴露-ingress控制器之traefik" tabindex="-1"><a class="header-anchor" href="#kubernetes进阶-四-服务暴露-ingress控制器之traefik"><span>kubernetes进阶（四）服务暴露-ingress控制器之traefik</span></a></h1><p>上一章我们测试了在集群内部解析service名称，</p><p>下面我们测试在集群外部解析：</p><p><img src="'+l+`" alt="img"></p><p>根本解析不到，因为我们外部用的dns是10.4.7.11，也就是我们的自建bind dns，这个DNS服务器上也没有响应的搜索域。</p><p>如何能让集群外部访问nginx-dp？</p><p>这里有两种服务暴露方式：修改工作模式，在kube-proxy中修改，并重启</p><p>1、使用nodeport方式，但是这种方式不能使用ipvs，只能使用iptables，iptables只能使用rr调度方式。原理相当于端口映射，将容器内的端口映射到宿主机上的某个端口。</p><p>2、使用ingress，但是只能工作在七层网络下，建议暴露http, https可以使用前端nginx来做证书方面的卸载 ---推荐使用</p><p>Ingress是基于域名和URL路径，将用户的请求转发至特定的service资源。</p><p>下面我们部署traefik：<a href="https://github.com/containous/traefik" target="_blank" rel="noopener noreferrer">GITHUB官方地址</a> 在hdss7-200上执行：</p><p>下载镜像：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># docker pull traefik:v1.7.2-alpine</span></span>
<span class="line"><span># docker tag add5fac61ae5 harbor.od.com/public/traefik:v1.7.2</span></span>
<span class="line"><span># docker push harbor.od.com/public/traefik:v1.7.</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建资源配置清单：</p><p>1.rbac.yaml</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># cd /data/k8s-yaml/traefik/</span></span>
<span class="line"><span># vi rbac.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>kind: ServiceAccount</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: traefik-ingress-controller</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>apiVersion: rbac.authorization.k8s.io/v1beta1</span></span>
<span class="line"><span>kind: ClusterRole</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: traefik-ingress-controller</span></span>
<span class="line"><span>rules:</span></span>
<span class="line"><span>  - apiGroups:</span></span>
<span class="line"><span>      - &quot;&quot;</span></span>
<span class="line"><span>    resources:</span></span>
<span class="line"><span>      - services</span></span>
<span class="line"><span>      - endpoints</span></span>
<span class="line"><span>      - secrets</span></span>
<span class="line"><span>    verbs:</span></span>
<span class="line"><span>      - get</span></span>
<span class="line"><span>      - list</span></span>
<span class="line"><span>      - watch</span></span>
<span class="line"><span>  - apiGroups:</span></span>
<span class="line"><span>      - extensions</span></span>
<span class="line"><span>    resources:</span></span>
<span class="line"><span>      - ingresses</span></span>
<span class="line"><span>    verbs:</span></span>
<span class="line"><span>      - get</span></span>
<span class="line"><span>      - list</span></span>
<span class="line"><span>      - watch</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>kind: ClusterRoleBinding</span></span>
<span class="line"><span>apiVersion: rbac.authorization.k8s.io/v1beta1</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: traefik-ingress-controller</span></span>
<span class="line"><span>roleRef:</span></span>
<span class="line"><span>  apiGroup: rbac.authorization.k8s.io</span></span>
<span class="line"><span>  kind: ClusterRole</span></span>
<span class="line"><span>  name: traefik-ingress-controller</span></span>
<span class="line"><span>subjects:</span></span>
<span class="line"><span>- kind: ServiceAccount</span></span>
<span class="line"><span>  name: traefik-ingress-controller</span></span>
<span class="line"><span>  namespace: kube-system</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2.ds.yaml</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># vi ds.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>apiVersion: extensions/v1beta1</span></span>
<span class="line"><span>kind: DaemonSet</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: traefik-ingress</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>  labels:</span></span>
<span class="line"><span>    k8s-app: traefik-ingress</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  template:</span></span>
<span class="line"><span>    metadata:</span></span>
<span class="line"><span>      labels:</span></span>
<span class="line"><span>        k8s-app: traefik-ingress</span></span>
<span class="line"><span>        name: traefik-ingress</span></span>
<span class="line"><span>    spec:</span></span>
<span class="line"><span>      serviceAccountName: traefik-ingress-controller</span></span>
<span class="line"><span>      terminationGracePeriodSeconds: 60</span></span>
<span class="line"><span>      containers:</span></span>
<span class="line"><span>      - image: harbor.od.com/public/traefik:v1.7.2</span></span>
<span class="line"><span>        name: traefik-ingress</span></span>
<span class="line"><span>        ports:</span></span>
<span class="line"><span>        - name: controller</span></span>
<span class="line"><span>          containerPort: 80</span></span>
<span class="line"><span>          hostPort: 81</span></span>
<span class="line"><span>        - name: admin-web</span></span>
<span class="line"><span>          containerPort: 8080</span></span>
<span class="line"><span>        securityContext:</span></span>
<span class="line"><span>          capabilities:</span></span>
<span class="line"><span>            drop:</span></span>
<span class="line"><span>            - ALL</span></span>
<span class="line"><span>            add:</span></span>
<span class="line"><span>            - NET_BIND_SERVICE</span></span>
<span class="line"><span>        args:</span></span>
<span class="line"><span>        - --api</span></span>
<span class="line"><span>        - --kubernetes</span></span>
<span class="line"><span>        - --logLevel=INFO</span></span>
<span class="line"><span>        - --insecureskipverify=true</span></span>
<span class="line"><span>        - --kubernetes.endpoint=https://10.4.7.10:7443</span></span>
<span class="line"><span>        - --accesslog</span></span>
<span class="line"><span>        - --accesslog.filepath=/var/log/traefik_access.log</span></span>
<span class="line"><span>        - --traefiklog</span></span>
<span class="line"><span>        - --traefiklog.filepath=/var/log/traefik.log</span></span>
<span class="line"><span>        - --metrics.prometheus</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3.svc.yaml</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># vi svc.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>kind: Service</span></span>
<span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: traefik-ingress-service</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  selector:</span></span>
<span class="line"><span>    k8s-app: traefik-ingress</span></span>
<span class="line"><span>  ports:</span></span>
<span class="line"><span>    - protocol: TCP</span></span>
<span class="line"><span>      port: 80</span></span>
<span class="line"><span>      name: controller</span></span>
<span class="line"><span>    - protocol: TCP</span></span>
<span class="line"><span>      port: 8080</span></span>
<span class="line"><span>      name: admin-web</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4.ingress.yaml</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># vi ingress.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>apiVersion: extensions/v1beta1</span></span>
<span class="line"><span>kind: Ingress</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: traefik-web-ui</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>  annotations:</span></span>
<span class="line"><span>    kubernetes.io/ingress.class: traefik</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  rules:</span></span>
<span class="line"><span>  - host: traefik.od.com</span></span>
<span class="line"><span>    http:</span></span>
<span class="line"><span>      paths:</span></span>
<span class="line"><span>      - path: /</span></span>
<span class="line"><span>        backend:</span></span>
<span class="line"><span>          serviceName: traefik-ingress-service</span></span>
<span class="line"><span>          servicePort: 8080</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后到node节点上创建资源：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># kubectl create -f http://k8s-yaml.od.com/traefik/rbac.yaml</span></span>
<span class="line"><span># kubectl create -f http://k8s-yaml.od.com/traefik/ds.yaml</span></span>
<span class="line"><span># kubectl create -f http://k8s-yaml.od.com/traefik/svc.yaml</span></span>
<span class="line"><span># kubectl create -f http://k8s-yaml.od.com/traefik/ingress.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置nginx解析：hdss7-11,hdss7-12</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># vi /etc/nginx/conf.d/od.com.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>upstream default_backend_traefik {</span></span>
<span class="line"><span>    server 10.4.7.21:81    max_fails=3 fail_timeout=10s;</span></span>
<span class="line"><span>    server 10.4.7.22:81    max_fails=3 fail_timeout=10s;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>server {</span></span>
<span class="line"><span>    server_name *.od.com;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    location / {</span></span>
<span class="line"><span>        proxy_pass http://default_backend_traefik;</span></span>
<span class="line"><span>        proxy_set_header Host       $http_host;</span></span>
<span class="line"><span>        proxy_set_header x-forwarded-for $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在hdss7-11上添加域名解析：在ingress.yaml中的host值：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># vi /var/named/od.com.zone</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>在最后加上traefik的域名解析：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$ORIGIN od.com.</span></span>
<span class="line"><span>$TTL 600        ; 10 minutes</span></span>
<span class="line"><span>@               IN SOA  dns.od.com. dnsadmin.od.com. (</span></span>
<span class="line"><span>                                2019061804 ; serial</span></span>
<span class="line"><span>                                10800      ; refresh (3 hours)</span></span>
<span class="line"><span>                                900        ; retry (15 minutes)</span></span>
<span class="line"><span>                                604800     ; expire (1 week)</span></span>
<span class="line"><span>                                86400      ; minimum (1 day)</span></span>
<span class="line"><span>                                )</span></span>
<span class="line"><span>                                NS   dns.od.com.</span></span>
<span class="line"><span>$TTL 60 ; 1 minute</span></span>
<span class="line"><span>dns                A    10.4.7.11</span></span>
<span class="line"><span>harbor             A    10.4.7.200</span></span>
<span class="line"><span>k8s-yaml           A    10.4.7.200</span></span>
<span class="line"><span>traefik            A    10.4.7.10</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># systemctl restart named</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>然后我们就可以在集群外，通过浏览器访问这个域名了：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>http://traefik.od.com  #我们的宿主机的虚拟网卡指定了bind域名解析服务器</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><img src="`+p+`" alt="img"></p><pre><code>分类:             [Kubernetes](https://www.cnblogs.com/slim-liu/category/1588426.html)
</code></pre>`,40)]))}const v=n(r,[["render",d]]),m=JSON.parse('{"path":"/note-book/Kubernetes/14kubernetes%E8%BF%9B%E9%98%B6%EF%BC%88%E5%9B%9B%EF%BC%89%E6%9C%8D%E5%8A%A1%E6%9A%B4%E9%9C%B2-ingress%E6%8E%A7%E5%88%B6%E5%99%A8%E4%B9%8Btraefik.html","title":"kubernetes进阶（四）服务暴露-ingress控制器之traefik","lang":"zh-CN","frontmatter":{"description":"kubernetes进阶（四）服务暴露-ingress控制器之traefik 上一章我们测试了在集群内部解析service名称， 下面我们测试在集群外部解析： img 根本解析不到，因为我们外部用的dns是10.4.7.11，也就是我们的自建bind dns，这个DNS服务器上也没有响应的搜索域。 如何能让集群外部访问nginx-dp？ 这里有两种服务...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"kubernetes进阶（四）服务暴露-ingress控制器之traefik\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-03-07T08:15:04.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Paper-Dragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/Kubernetes/14kubernetes%E8%BF%9B%E9%98%B6%EF%BC%88%E5%9B%9B%EF%BC%89%E6%9C%8D%E5%8A%A1%E6%9A%B4%E9%9C%B2-ingress%E6%8E%A7%E5%88%B6%E5%99%A8%E4%B9%8Btraefik.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"kubernetes进阶（四）服务暴露-ingress控制器之traefik"}],["meta",{"property":"og:description","content":"kubernetes进阶（四）服务暴露-ingress控制器之traefik 上一章我们测试了在集群内部解析service名称， 下面我们测试在集群外部解析： img 根本解析不到，因为我们外部用的dns是10.4.7.11，也就是我们的自建bind dns，这个DNS服务器上也没有响应的搜索域。 如何能让集群外部访问nginx-dp？ 这里有两种服务..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-07T08:15:04.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-07T08:15:04.000Z"}]]},"git":{"createdTime":1691939318000,"updatedTime":1709799304000,"contributors":[{"name":"Paper-Dragon","username":"Paper-Dragon","email":"2678885646@qq.com","commits":1,"url":"https://github.com/Paper-Dragon"},{"name":"PaperDragon-SH","username":"PaperDragon-SH","email":"2678885646@qq.com","commits":2,"url":"https://github.com/PaperDragon-SH"}],"changelog":[{"hash":"d9487231a8c7ade839488b74acab413e440a9cab","time":1709799304000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"sort"},{"hash":"4cd4267ca674534af11dc7ef2ffe5c405aeb6532","time":1709795703000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"kubernetes进阶（四）服务暴露-ingress控制器之traefik"},{"hash":"392a519398b2e846f316619fbe831e100164de7c","time":1691939318000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Create The Worid!"}]},"readingTime":{"minutes":2.56,"words":767},"filePathRelative":"note-book/Kubernetes/14kubernetes进阶（四）服务暴露-ingress控制器之traefik.md","excerpt":"\\n<p>上一章我们测试了在集群内部解析service名称，</p>\\n<p>下面我们测试在集群外部解析：</p>\\n<p></p>\\n<p>根本解析不到，因为我们外部用的dns是10.4.7.11，也就是我们的自建bind dns，这个DNS服务器上也没有响应的搜索域。</p>\\n<p>如何能让集群外部访问nginx-dp？</p>\\n<p>这里有两种服务暴露方式：修改工作模式，在kube-proxy中修改，并重启</p>\\n<p>1、使用nodeport方式，但是这种方式不能使用ipvs，只能使用iptables，iptables只能使用rr调度方式。原理相当于端口映射，将容器内的端口映射到宿主机上的某个端口。</p>","autoDesc":true}');export{v as comp,m as data};
