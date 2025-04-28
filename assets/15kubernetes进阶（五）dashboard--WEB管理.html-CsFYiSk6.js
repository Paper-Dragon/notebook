import{ah as n,ai as a,an as e,am as i}from"./app-dc1QLWj0.js";const l="/assets/1034759-20191125193911658-1073438860-16918406809571-vo8SIs8l.png",p="/assets/1034759-20191126161244510-1269371002-16918406826423-DRHjp4PI.png",d="/assets/1034759-20191126163610063-918814879-16918406847055-MP1im4fS.png",r="/assets/1034759-20191126172440979-1913961041-16918406864827-BnZjQlGt.png",c="/assets/1034759-20191126172608230-363720611-16918406885179-CHqntM2q.png",t="/assets/1034759-20191126183554740-658611982-169184069139711-Bl8ssb93.png",o="/assets/1034759-20191126183711805-835833813-169184069393713-6vAtzZB8.png",b={};function v(m,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="kubernetes进阶-五-dashboard-web管理" tabindex="-1"><a class="header-anchor" href="#kubernetes进阶-五-dashboard-web管理"><span>kubernetes进阶（五）dashboard--WEB管理</span></a></h1><p>dashboard是k8s的可视化管理平台，是三种管理k8s集群方法之一</p><p>首先下载镜像上传到我们的私有仓库中：hdss7-200</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># docker pull k8scn/kubernetes-dashboard-amd64:v1.8.3</span></span>
<span class="line"><span># docker tag fcac9aa03fd6 harbor.od.com/public/dashboard:v1.8.3</span></span>
<span class="line"><span># docker push harbor.od.com/public/dashboard:v1.8.3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编辑dashboard资源配置清单：</p><p>1、rbac.yaml</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># vi rbac.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># mkdir -p /data/k8s-yaml/dashboard</span></span>
<span class="line"><span># cd /data/k8s-yaml/dashboard</span></span>
<span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>kind: ServiceAccount</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  labels:</span></span>
<span class="line"><span>    k8s-app: kubernetes-dashboard</span></span>
<span class="line"><span>    addonmanager.kubernetes.io/mode: Reconcile</span></span>
<span class="line"><span>  name: kubernetes-dashboard-admin</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>apiVersion: rbac.authorization.k8s.io/v1</span></span>
<span class="line"><span>kind: ClusterRoleBinding</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: kubernetes-dashboard-admin</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>  labels:</span></span>
<span class="line"><span>    k8s-app: kubernetes-dashboard</span></span>
<span class="line"><span>    addonmanager.kubernetes.io/mode: Reconcile</span></span>
<span class="line"><span>roleRef:</span></span>
<span class="line"><span>  apiGroup: rbac.authorization.k8s.io</span></span>
<span class="line"><span>  kind: ClusterRole</span></span>
<span class="line"><span>  name: cluster-admin</span></span>
<span class="line"><span>subjects:</span></span>
<span class="line"><span>- kind: ServiceAccount</span></span>
<span class="line"><span>  name: kubernetes-dashboard-admin</span></span>
<span class="line"><span>  namespace: kube-system</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、dp.yaml</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># vi dp.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>apiVersion: apps/v1</span></span>
<span class="line"><span>kind: Deployment</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: kubernetes-dashboard</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>  labels:</span></span>
<span class="line"><span>    k8s-app: kubernetes-dashboard</span></span>
<span class="line"><span>    kubernetes.io/cluster-service: &quot;true&quot;</span></span>
<span class="line"><span>    addonmanager.kubernetes.io/mode: Reconcile</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  selector:</span></span>
<span class="line"><span>    matchLabels:</span></span>
<span class="line"><span>      k8s-app: kubernetes-dashboard</span></span>
<span class="line"><span>  template:</span></span>
<span class="line"><span>    metadata:</span></span>
<span class="line"><span>      labels:</span></span>
<span class="line"><span>        k8s-app: kubernetes-dashboard</span></span>
<span class="line"><span>      annotations:</span></span>
<span class="line"><span>        scheduler.alpha.kubernetes.io/critical-pod: &#39;&#39;</span></span>
<span class="line"><span>    spec:</span></span>
<span class="line"><span>      priorityClassName: system-cluster-critical</span></span>
<span class="line"><span>      containers:</span></span>
<span class="line"><span>      - name: kubernetes-dashboard</span></span>
<span class="line"><span>        image: harbor.od.com/public/dashboard:v1.8.3</span></span>
<span class="line"><span>        resources:</span></span>
<span class="line"><span>          limits:</span></span>
<span class="line"><span>            cpu: 100m</span></span>
<span class="line"><span>            memory: 300Mi</span></span>
<span class="line"><span>          requests:</span></span>
<span class="line"><span>            cpu: 50m</span></span>
<span class="line"><span>            memory: 100Mi</span></span>
<span class="line"><span>        ports:</span></span>
<span class="line"><span>        - containerPort: 8443</span></span>
<span class="line"><span>          protocol: TCP</span></span>
<span class="line"><span>        args:</span></span>
<span class="line"><span>          # PLATFORM-SPECIFIC ARGS HERE</span></span>
<span class="line"><span>          - --auto-generate-certificates</span></span>
<span class="line"><span>        volumeMounts:</span></span>
<span class="line"><span>        - name: tmp-volume</span></span>
<span class="line"><span>          mountPath: /tmp</span></span>
<span class="line"><span>        livenessProbe:</span></span>
<span class="line"><span>          httpGet:</span></span>
<span class="line"><span>            scheme: HTTPS</span></span>
<span class="line"><span>            path: /</span></span>
<span class="line"><span>            port: 8443</span></span>
<span class="line"><span>          initialDelaySeconds: 30</span></span>
<span class="line"><span>          timeoutSeconds: 30</span></span>
<span class="line"><span>      volumes:</span></span>
<span class="line"><span>      - name: tmp-volume</span></span>
<span class="line"><span>        emptyDir: {}</span></span>
<span class="line"><span>      serviceAccountName: kubernetes-dashboard-admin</span></span>
<span class="line"><span>      tolerations:</span></span>
<span class="line"><span>      - key: &quot;CriticalAddonsOnly&quot;</span></span>
<span class="line"><span>        operator: &quot;Exists&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、svc.yaml</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># vi svc.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>apiVersion: v1</span></span>
<span class="line"><span>kind: Service</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: kubernetes-dashboard</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>  labels:</span></span>
<span class="line"><span>    k8s-app: kubernetes-dashboard</span></span>
<span class="line"><span>    kubernetes.io/cluster-service: &quot;true&quot;</span></span>
<span class="line"><span>    addonmanager.kubernetes.io/mode: Reconcile</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  selector:</span></span>
<span class="line"><span>    k8s-app: kubernetes-dashboard</span></span>
<span class="line"><span>  ports:</span></span>
<span class="line"><span>  - port: 443</span></span>
<span class="line"><span>    targetPort: 8443</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、ingress.yaml</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># vi ingress.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>apiVersion: extensions/v1beta1</span></span>
<span class="line"><span>kind: Ingress</span></span>
<span class="line"><span>metadata:</span></span>
<span class="line"><span>  name: kubernetes-dashboard</span></span>
<span class="line"><span>  namespace: kube-system</span></span>
<span class="line"><span>  annotations:</span></span>
<span class="line"><span>    kubernetes.io/ingress.class: traefik</span></span>
<span class="line"><span>spec:</span></span>
<span class="line"><span>  rules:</span></span>
<span class="line"><span>  - host: dashboard.od.com</span></span>
<span class="line"><span>    http:</span></span>
<span class="line"><span>      paths:</span></span>
<span class="line"><span>      - backend:</span></span>
<span class="line"><span>          serviceName: kubernetes-dashboard</span></span>
<span class="line"><span>          servicePort: 443</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建资源：任意node</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># kubectl create -f http://k8s-yaml.od.com/dashboard/rbac.yaml</span></span>
<span class="line"><span># kubectl create -f http://k8s-yaml.od.com/dashboard/dp.yaml</span></span>
<span class="line"><span># kubectl create -f http://k8s-yaml.od.com/dashboard/svc.yaml</span></span>
<span class="line"><span># kubectl create -f http://k8s-yaml.od.com/dashboard/ingress.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>添加域名解析：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># vi /var/named/od.com.zone</span></span>
<span class="line"><span>dashboard          A    10.4.7.10</span></span>
<span class="line"><span># systemctl restart named</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过浏览器访问：</p><p><a href="http://dashboard.od.com/" target="_blank" rel="noopener noreferrer">http://dashboard.od.com</a></p><p><img src="`+l+'" alt="img"></p><p>美好的点点点运维开始了~</p><p>但是，我们可以看到我们安装1.8版本的dashboard，默认是可以跳过验证的：</p><p><img src="'+p+`" alt="img"></p><p>很显然，跳过登录，是不科学的，因为我们在配置dashboard的rbac权限时，绑定的角色是system:admin，这个是集群管理员的角色，权限很大，所以这里我们把版本换成1.10以上版本</p><p>下载1.10.1版本：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># docker pull loveone/kubernetes-dashboard-amd64:v1.10.1</span></span>
<span class="line"><span># docker tag f9aed6605b81 harbor.od.com/public/dashboard:v1.10.1</span></span>
<span class="line"><span># docker push harbor.od.com/public/dashboard:v1.10.1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改dp.yaml重新应用，我直接用edit修改了，没有使用apply</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># kubectl edit deploy kubernetes-dashboard -n kube-system</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>等待滚动发布完成后，在刷新dashboard页面：</p><p><img src="`+d+`" alt="img"></p><p>可以看到这里原来的skip跳过已经没有了，我们如果想登陆，必须输入token，那我们如何获取token呢：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># kubectl get secret  -n kube-system</span></span>
<span class="line"><span># kubectl describe secret kubernetes-dashboard-admin-token-pg77n  -n kube-system</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+r+'" alt="img"></p><p>这样我们就拿到了token，接下来我们试试能不能登录：</p><p>我们发现我们还是无法登录，原因是必须使用https登录，接下来我们需要申请证书：</p><p><img src="'+c+`" alt="img"></p><p>接下来我们申请证书：</p><p>依然使用cfssl来申请证书：hdss7-200</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># cd /opt/certs/</span></span>
<span class="line"><span># vi dashboard-csr.json</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>{</span></span>
<span class="line"><span>    &quot;CN&quot;: &quot;*.od.com&quot;,</span></span>
<span class="line"><span>    &quot;hosts&quot;: [</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>    &quot;key&quot;: {</span></span>
<span class="line"><span>        &quot;algo&quot;: &quot;rsa&quot;,</span></span>
<span class="line"><span>        &quot;size&quot;: 2048</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    &quot;names&quot;: [</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            &quot;C&quot;: &quot;CN&quot;,</span></span>
<span class="line"><span>            &quot;ST&quot;: &quot;beijing&quot;,</span></span>
<span class="line"><span>            &quot;L&quot;: &quot;beijing&quot;,</span></span>
<span class="line"><span>            &quot;O&quot;: &quot;od&quot;,</span></span>
<span class="line"><span>            &quot;OU&quot;: &quot;ops&quot;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=server dashboard-csr.json |cfssl-json -bare dashboard</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>然后拷贝到我们nginx的服务器上：7-11 7-12 都需要</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># cd /etc/nginx/</span></span>
<span class="line"><span># mkdir certs</span></span>
<span class="line"><span># cd certs</span></span>
<span class="line"><span># scp hdss7-200:/opt/cert/dash* ./</span></span>
<span class="line"><span># cd /etc/nginx/conf.d/</span></span>
<span class="line"><span># vi dashboard.od.com.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>server {</span></span>
<span class="line"><span>    listen       80;</span></span>
<span class="line"><span>    server_name  dashboard.od.com;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    rewrite ^(.*)$ https://\${server_name}$1 permanent;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>server {</span></span>
<span class="line"><span>    listen       443 ssl;</span></span>
<span class="line"><span>    server_name  dashboard.od.com;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ssl_certificate &quot;certs/dashboard.pem&quot;;</span></span>
<span class="line"><span>    ssl_certificate_key &quot;certs/dashboard-key.pem&quot;;</span></span>
<span class="line"><span>    ssl_session_cache shared:SSL:1m;</span></span>
<span class="line"><span>    ssl_session_timeout  10m;</span></span>
<span class="line"><span>    ssl_ciphers HIGH:!aNULL:!MD5;</span></span>
<span class="line"><span>    ssl_prefer_server_ciphers on;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    location / {</span></span>
<span class="line"><span>        proxy_pass http://default_backend_traefik;</span></span>
<span class="line"><span>        proxy_set_header Host       $http_host;</span></span>
<span class="line"><span>        proxy_set_header x-forwarded-for $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># nginx -t</span></span>
<span class="line"><span># nginx -s reload</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>然后刷新页面：虽然证书无效(因为是自签证书)，但是已经是https了，试下我们刚才的token能不能登录了</p><p><img src="`+t+'" alt="img"></p><p><img src="'+o+`" alt="img"></p><p>可以登录了~</p><p>登录是登录了，但是我们要思考一个问题，我们使用rbac授权来访问dashboard,如何做到权限精细化呢？比如开发，只能看，不能摸，不同的项目组，看到的资源应该是不一样的，测试看到的应该是测试相关的资源。</p><p>我们在下一章详解sa授权和ua授权。</p><pre><code>分类:             [Kubernetes](https://www.cnblogs.com/slim-liu/category/1588426.html)
</code></pre>`,56)]))}const h=n(b,[["render",v]]),k=JSON.parse('{"path":"/note-book/Kubernetes/15kubernetes%E8%BF%9B%E9%98%B6%EF%BC%88%E4%BA%94%EF%BC%89dashboard--WEB%E7%AE%A1%E7%90%86.html","title":"kubernetes进阶（五）dashboard--WEB管理","lang":"zh-CN","frontmatter":{"description":"kubernetes进阶（五）dashboard--WEB管理 dashboard是k8s的可视化管理平台，是三种管理k8s集群方法之一 首先下载镜像上传到我们的私有仓库中：hdss7-200 编辑dashboard资源配置清单： 1、rbac.yaml 2、dp.yaml 3、svc.yaml 4、ingress.yaml 创建资源：任意node 添...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"kubernetes进阶（五）dashboard--WEB管理\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-03-07T08:15:04.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Paper-Dragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/Kubernetes/15kubernetes%E8%BF%9B%E9%98%B6%EF%BC%88%E4%BA%94%EF%BC%89dashboard--WEB%E7%AE%A1%E7%90%86.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"kubernetes进阶（五）dashboard--WEB管理"}],["meta",{"property":"og:description","content":"kubernetes进阶（五）dashboard--WEB管理 dashboard是k8s的可视化管理平台，是三种管理k8s集群方法之一 首先下载镜像上传到我们的私有仓库中：hdss7-200 编辑dashboard资源配置清单： 1、rbac.yaml 2、dp.yaml 3、svc.yaml 4、ingress.yaml 创建资源：任意node 添..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-07T08:15:04.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-07T08:15:04.000Z"}]]},"git":{"createdTime":1691939318000,"updatedTime":1709799304000,"contributors":[{"name":"Paper-Dragon","username":"Paper-Dragon","email":"2678885646@qq.com","commits":1,"url":"https://github.com/Paper-Dragon"},{"name":"PaperDragon-SH","username":"PaperDragon-SH","email":"2678885646@qq.com","commits":2,"url":"https://github.com/PaperDragon-SH"}],"changelog":[{"hash":"d9487231a8c7ade839488b74acab413e440a9cab","time":1709799304000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"sort"},{"hash":"7646042278e35f7e20714d4f0b2c0c200323cd2e","time":1709795646000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"kubernetes进阶（五）dashboard--WEB管理"},{"hash":"392a519398b2e846f316619fbe831e100164de7c","time":1691939318000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Create The Worid!"}]},"readingTime":{"minutes":3.46,"words":1037},"filePathRelative":"note-book/Kubernetes/15kubernetes进阶（五）dashboard--WEB管理.md","excerpt":"\\n<p>dashboard是k8s的可视化管理平台，是三种管理k8s集群方法之一</p>\\n<p>首先下载镜像上传到我们的私有仓库中：hdss7-200</p>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span># docker pull k8scn/kubernetes-dashboard-amd64:v1.8.3</span></span>\\n<span class=\\"line\\"><span># docker tag fcac9aa03fd6 harbor.od.com/public/dashboard:v1.8.3</span></span>\\n<span class=\\"line\\"><span># docker push harbor.od.com/public/dashboard:v1.8.3</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{h as comp,k as data};
