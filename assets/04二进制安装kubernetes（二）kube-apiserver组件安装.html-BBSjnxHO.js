import{ah as n,ai as a,ar as e,am as i}from"./app-D0PKVTpZ.js";const l="/assets/1034759-20191113161103150-1839664051-16918405238861-tv09UY0s.png",p="/assets/1034759-20191113163151886-1369051614-16918405286763-BeVL1CNA.png",r="/assets/1034759-20191209165848123-1526028674-16918405319815-D6ZVkKjE.png",d={};function t(c,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="二进制安装kubernetes-二-kube-apiserver组件安装" tabindex="-1"><a class="header-anchor" href="#二进制安装kubernetes-二-kube-apiserver组件安装"><span>二进制安装kubernetes（二）kube-apiserver组件安装</span></a></h1><p>根据架构图，我们的apiserver部署在hdss7-21和hdss7-22上：</p><p>首先在hdss7-200上申请证书并拷贝到21和22上：</p><p>创建证书文件：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># cd /opt/certs</span></span>
<span class="line"><span># vi client-csr.json</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>{</span></span>
<span class="line"><span>    &quot;CN&quot;: &quot;k8s-node&quot;,</span></span>
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
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>申请证书：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=client client-csr.json |cfssl-json -bare client</span></span>
<span class="line"><span># vi apiserver-csr.json</span></span>
<span class="line"><span>知识点：</span></span>
<span class="line"><span>这个证书目前专属于 apiserver加了一个 *.kubernetes.master 域名以便内部私有 DNS 解析使用(可删除)；至于很多人问过 kubernetes 这几个能不能删掉，答案是不可以的；因为当集群创建好后，default namespace 下会创建一个叫 kubenretes 的 svc，有一些组件会直接连接这个 svc 来跟 api 通讯的，证书如果不包含可能会出现无法连接的情况；其他几个 kubernetes 开头的域名作用相同</span></span>
<span class="line"><span>   hosts包含的是授权范围，不在此范围的的节点或者服务使用此证书就会报证书不匹配错误。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>{</span></span>
<span class="line"><span>    &quot;CN&quot;: &quot;k8s-apiserver&quot;,</span></span>
<span class="line"><span>    &quot;hosts&quot;: [</span></span>
<span class="line"><span>        &quot;127.0.0.1&quot;,</span></span>
<span class="line"><span>        &quot;192.168.0.1&quot;,</span></span>
<span class="line"><span>        &quot;kubernetes.default&quot;,</span></span>
<span class="line"><span>        &quot;kubernetes.default.svc&quot;,</span></span>
<span class="line"><span>        &quot;kubernetes.default.svc.cluster&quot;,</span></span>
<span class="line"><span>        &quot;kubernetes.default.svc.cluster.local&quot;,</span></span>
<span class="line"><span>        &quot;10.4.7.10&quot;,</span></span>
<span class="line"><span>        &quot;10.4.7.21&quot;,</span></span>
<span class="line"><span>        &quot;10.4.7.22&quot;,</span></span>
<span class="line"><span>        &quot;10.4.7.23&quot;</span></span>
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
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=server apiserver-csr.json |cfssl-json -bare apiserver</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>下载kubernetes，放到21，22服务器上，官方地址：https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-binary-via-curl</p><p>我这里用的是1.15版本，下载后操作：21,22上操作</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># cd /opt/src</span></span>
<span class="line"><span># tar -zxf kubernetes-server-linux-amd64-v1.15.4.tar.gz -C ../</span></span>
<span class="line"><span># cd ..</span></span>
<span class="line"><span># mv kubernetes/ kubernetes-1.15</span></span>
<span class="line"><span># ln -s /opt/kubernetes-1.15/ /opt/kubernete</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建证书和配置文件存放目录：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># mkdir /opt/kubernetes/server/bin/cert /opt/kubernetes/server/bin/conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>接下来拷贝证书，将apiserver证书拷贝到hdss7-21,7-22上：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># cd /opt/kubernetes/server/bin/cert# scp hdss7-200:/opt/certs/ca.pem ./</span></span>
<span class="line"><span># scp hdss7-200:/opt/certs/apiserver.pem ./</span></span>
<span class="line"><span># scp hdss7-200:/opt/certs/apiserver-key.pem ./</span></span>
<span class="line"><span># scp hdss7-200:/opt/certs/ca-key.pem ./</span></span>
<span class="line"><span># scp hdss7-200:/opt/certs/client-key.pem ./</span></span>
<span class="line"><span># scp hdss7-200:/opt/certs/client.pem ./</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>进入配置文件目录：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># cd /opt/kubernetes/server/bin/conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>编辑配置文件：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># vi audit.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>apiVersion: audit.k8s.io/v1beta1 # This is required.</span></span>
<span class="line"><span>kind: Policy</span></span>
<span class="line"><span># Don&#39;t generate audit events for all requests in RequestReceived stage.</span></span>
<span class="line"><span>omitStages:</span></span>
<span class="line"><span>  - &quot;RequestReceived&quot;</span></span>
<span class="line"><span>rules:</span></span>
<span class="line"><span>  # Log pod changes at RequestResponse level</span></span>
<span class="line"><span>  - level: RequestResponse</span></span>
<span class="line"><span>    resources:</span></span>
<span class="line"><span>    - group: &quot;&quot;</span></span>
<span class="line"><span>      # Resource &quot;pods&quot; doesn&#39;t match requests to any subresource of pods,</span></span>
<span class="line"><span>      # which is consistent with the RBAC policy.</span></span>
<span class="line"><span>      resources: [&quot;pods&quot;]</span></span>
<span class="line"><span>  # Log &quot;pods/log&quot;, &quot;pods/status&quot; at Metadata level</span></span>
<span class="line"><span>  - level: Metadata</span></span>
<span class="line"><span>    resources:</span></span>
<span class="line"><span>    - group: &quot;&quot;</span></span>
<span class="line"><span>      resources: [&quot;pods/log&quot;, &quot;pods/status&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # Don&#39;t log requests to a configmap called &quot;controller-leader&quot;</span></span>
<span class="line"><span>  - level: None</span></span>
<span class="line"><span>    resources:</span></span>
<span class="line"><span>    - group: &quot;&quot;</span></span>
<span class="line"><span>      resources: [&quot;configmaps&quot;]</span></span>
<span class="line"><span>      resourceNames: [&quot;controller-leader&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # Don&#39;t log watch requests by the &quot;system:kube-proxy&quot; on endpoints or services</span></span>
<span class="line"><span>  - level: None</span></span>
<span class="line"><span>    users: [&quot;system:kube-proxy&quot;]</span></span>
<span class="line"><span>    verbs: [&quot;watch&quot;]</span></span>
<span class="line"><span>    resources:</span></span>
<span class="line"><span>    - group: &quot;&quot; # core API group</span></span>
<span class="line"><span>      resources: [&quot;endpoints&quot;, &quot;services&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # Don&#39;t log authenticated requests to certain non-resource URL paths.</span></span>
<span class="line"><span>  - level: None</span></span>
<span class="line"><span>    userGroups: [&quot;system:authenticated&quot;]</span></span>
<span class="line"><span>    nonResourceURLs:</span></span>
<span class="line"><span>    - &quot;/api*&quot; # Wildcard matching.</span></span>
<span class="line"><span>    - &quot;/version&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # Log the request body of configmap changes in kube-system.</span></span>
<span class="line"><span>  - level: Request</span></span>
<span class="line"><span>    resources:</span></span>
<span class="line"><span>    - group: &quot;&quot; # core API group</span></span>
<span class="line"><span>      resources: [&quot;configmaps&quot;]</span></span>
<span class="line"><span>    # This rule only applies to resources in the &quot;kube-system&quot; namespace.</span></span>
<span class="line"><span>    # The empty string &quot;&quot; can be used to select non-namespaced resources.</span></span>
<span class="line"><span>    namespaces: [&quot;kube-system&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # Log configmap and secret changes in all other namespaces at the Metadata level.</span></span>
<span class="line"><span>  - level: Metadata</span></span>
<span class="line"><span>    resources:</span></span>
<span class="line"><span>    - group: &quot;&quot; # core API group</span></span>
<span class="line"><span>      resources: [&quot;secrets&quot;, &quot;configmaps&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # Log all other resources in core and extensions at the Request level.</span></span>
<span class="line"><span>  - level: Request</span></span>
<span class="line"><span>    resources:</span></span>
<span class="line"><span>    - group: &quot;&quot; # core API group</span></span>
<span class="line"><span>    - group: &quot;extensions&quot; # Version of group should NOT be included.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # A catch-all rule to log all other requests at the Metadata level.</span></span>
<span class="line"><span>  - level: Metadata</span></span>
<span class="line"><span>    # Long-running requests like watches that fall under this rule will not</span></span>
<span class="line"><span>    # generate an audit event in RequestReceived.</span></span>
<span class="line"><span>    omitStages:</span></span>
<span class="line"><span>      - &quot;RequestReceived&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>便携启动脚本：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># vi /opt/kubernetes/server/bin/kube-apiserver.sh</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span>./kube-apiserver \\</span></span>
<span class="line"><span>  --apiserver-count 2 \\</span></span>
<span class="line"><span>  --audit-log-path /data/logs/kubernetes/kube-apiserver/audit-log \\</span></span>
<span class="line"><span>  --audit-policy-file ./conf/audit.yaml \\</span></span>
<span class="line"><span>  --authorization-mode RBAC \\</span></span>
<span class="line"><span>  --client-ca-file ./cert/ca.pem \\</span></span>
<span class="line"><span>  --requestheader-client-ca-file ./cert/ca.pem \\</span></span>
<span class="line"><span>  --enable-admission-plugins NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota \\</span></span>
<span class="line"><span>  --etcd-cafile ./cert/ca.pem \\</span></span>
<span class="line"><span>  --etcd-certfile ./cert/client.pem \\</span></span>
<span class="line"><span>  --etcd-keyfile ./cert/client-key.pem \\</span></span>
<span class="line"><span>  --etcd-servers https://10.4.7.12:2379,https://10.4.7.21:2379,https://10.4.7.22:2379 \\</span></span>
<span class="line"><span>  --service-account-key-file ./cert/ca-key.pem \\</span></span>
<span class="line"><span>  --service-cluster-ip-range 192.168.0.0/16 \\</span></span>
<span class="line"><span>  --service-node-port-range 3000-29999 \\</span></span>
<span class="line"><span>  --target-ram-mb=1024 \\</span></span>
<span class="line"><span>  --kubelet-client-certificate ./cert/client.pem \\</span></span>
<span class="line"><span>  --kubelet-client-key ./cert/client-key.pem \\</span></span>
<span class="line"><span>  --log-dir  /data/logs/kubernetes/kube-apiserver \\</span></span>
<span class="line"><span>  --tls-cert-file ./cert/apiserver.pem \\</span></span>
<span class="line"><span>  --tls-private-key-file ./cert/apiserver-key.pem \\</span></span>
<span class="line"><span>  --v 2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># chmod +x /opt/kubernetes/server/bin/kube-apiserver.sh</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>编写supervisord启动文件：红色部分对应主机修改</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[program:kube-apiserver-7-21]</span></span>
<span class="line"><span>command=/opt/kubernetes/server/bin/kube-apiserver.sh            ; the program (relative uses PATH, can take args)</span></span>
<span class="line"><span>numprocs=1                                                      ; number of processes copies to start (def 1)</span></span>
<span class="line"><span>directory=/opt/kubernetes/server/bin                            ; directory to cwd to before exec (def no cwd)</span></span>
<span class="line"><span>autostart=true                                                  ; start at supervisord start (default: true)</span></span>
<span class="line"><span>autorestart=true                                                ; retstart at unexpected quit (default: true)</span></span>
<span class="line"><span>startsecs=30                                                    ; number of secs prog must stay running (def. 1)</span></span>
<span class="line"><span>startretries=3                                                  ; max # of serial start failures (default 3)</span></span>
<span class="line"><span>exitcodes=0,2                                                   ; &#39;expected&#39; exit codes for process (default 0,2)</span></span>
<span class="line"><span>stopsignal=QUIT                                                 ; signal used to kill process (default TERM)</span></span>
<span class="line"><span>stopwaitsecs=10                                                 ; max num secs to wait b4 SIGKILL (default 10)</span></span>
<span class="line"><span>user=root                                                       ; setuid to this UNIX account to run the program</span></span>
<span class="line"><span>redirect_stderr=true                                            ; redirect proc stderr to stdout (default false)</span></span>
<span class="line"><span>stdout_logfile=/data/logs/kubernetes/kube-apiserver/apiserver.stdout.log        ; stderr log path, NONE for none; default AUTO</span></span>
<span class="line"><span>stdout_logfile_maxbytes=64MB                                    ; max # logfile bytes b4 rotation (default 50MB)</span></span>
<span class="line"><span>stdout_logfile_backups=4                                        ; # of stdout logfile backups (default 10)</span></span>
<span class="line"><span>stdout_capture_maxbytes=1MB                                     ; number of bytes in &#39;capturemode&#39; (default 0)</span></span>
<span class="line"><span>stdout_events_enabled=false                                     ; emit events on stdout writes (default false)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建日志存放目录：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># mkdir -p /data/logs/kubernetes/kube-apiserver</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>更新supervisord：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># supervisorctl update</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>检查是否启动：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># supervisorctl status</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><img src="`+l+`" alt="img"></p><p>至此，kube-apiserver核心组件已经安装完成，接下来要对apiserver做高可用负载：</p><p>在hdss7-11,hdss7-12上部署nginx：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># yum install nginx -y</span></span>
<span class="line"><span># vi /etc/nginx/nginx.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>nginx四层负载，必须与http同级：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>stream {</span></span>
<span class="line"><span>    upstream kube-apiserver {</span></span>
<span class="line"><span>        server 10.4.7.21:6443     max_fails=3 fail_timeout=30s;</span></span>
<span class="line"><span>        server 10.4.7.22:6443     max_fails=3 fail_timeout=30s;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    server {</span></span>
<span class="line"><span>        listen 7443;</span></span>
<span class="line"><span>        proxy_connect_timeout 2s;</span></span>
<span class="line"><span>        proxy_timeout 900s;</span></span>
<span class="line"><span>        proxy_pass kube-apiserver;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># nginx -t</span></span>
<span class="line"><span># systemctl start nginx</span></span>
<span class="line"><span># systemctl enable nginx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>部署keepalived实现高可用：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span> # yum install keepalived -y</span></span>
<span class="line"><span># vi /etc/keepalived/check_port.sh</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span>#keepalived 监控端口脚本</span></span>
<span class="line"><span>#使用方法：</span></span>
<span class="line"><span>#在keepalived的配置文件中</span></span>
<span class="line"><span>#vrrp_script check_port {#创建一个vrrp_script脚本,检查配置</span></span>
<span class="line"><span>#    script &quot;/etc/keepalived/check_port.sh 6379&quot; #配置监听的端口</span></span>
<span class="line"><span>#    interval 2 #检查脚本的频率,单位（秒）</span></span>
<span class="line"><span>#}</span></span>
<span class="line"><span>CHK_PORT=$1</span></span>
<span class="line"><span>if [ -n &quot;$CHK_PORT&quot; ];then</span></span>
<span class="line"><span>        PORT_PROCESS=\`ss -lnt|grep $CHK_PORT|wc -l\`</span></span>
<span class="line"><span>        if [ $PORT_PROCESS -eq 0 ];then</span></span>
<span class="line"><span>                echo &quot;Port $CHK_PORT Is Not Used,End.&quot;</span></span>
<span class="line"><span>                exit 1</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>        echo &quot;Check Port Cant Be Empty!&quot;</span></span>
<span class="line"><span>fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># chmod +x /etc/keepalived/check_port.sh</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>编辑keepalived配置文件，注意主从配置文件不一样：</p><p>hdss7-11 主：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># vi /etc/keepalived/keepalived.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>! Configuration File for keepalived</span></span>
<span class="line"><span></span></span>
<span class="line"><span>global_defs {</span></span>
<span class="line"><span>   router_id 10.4.7.11</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vrrp_script chk_nginx {</span></span>
<span class="line"><span>    script &quot;/etc/keepalived/check_port.sh 7443&quot;</span></span>
<span class="line"><span>    interval 2</span></span>
<span class="line"><span>    weight -20</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vrrp_instance VI_1 {</span></span>
<span class="line"><span>    state MASTER</span></span>
<span class="line"><span>    interface eth0</span></span>
<span class="line"><span>    virtual_router_id 251</span></span>
<span class="line"><span>    priority 100</span></span>
<span class="line"><span>    advert_int 1</span></span>
<span class="line"><span>    mcast_src_ip 10.4.7.11</span></span>
<span class="line"><span>    nopreempt   #非抢占式 ，当主节点挂了以后，从节点vip飘到从上，主节点恢复以后，不主动飘回主，需要手动重启keepalived</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    authentication {</span></span>
<span class="line"><span>        auth_type PASS</span></span>
<span class="line"><span>        auth_pass 11111111</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    track_script {</span></span>
<span class="line"><span>         chk_nginx</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    virtual_ipaddress {</span></span>
<span class="line"><span>        10.4.7.10</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>hdss7-12 从：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>! Configuration File for keepalived</span></span>
<span class="line"><span>global_defs {</span></span>
<span class="line"><span>    router_id 10.4.7.12</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>vrrp_script chk_nginx {</span></span>
<span class="line"><span>    script &quot;/etc/keepalived/check_port.sh 7443&quot;</span></span>
<span class="line"><span>    interval 2</span></span>
<span class="line"><span>    weight -20</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>vrrp_instance VI_1 {</span></span>
<span class="line"><span>    state BACKUP</span></span>
<span class="line"><span>    interface eth0</span></span>
<span class="line"><span>    virtual_router_id 251</span></span>
<span class="line"><span>    mcast_src_ip 10.4.7.12</span></span>
<span class="line"><span>    priority 90</span></span>
<span class="line"><span>    advert_int 1</span></span>
<span class="line"><span>    authentication {</span></span>
<span class="line"><span>        auth_type PASS</span></span>
<span class="line"><span>        auth_pass 11111111</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    track_script {</span></span>
<span class="line"><span>        chk_nginx</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    virtual_ipaddress {</span></span>
<span class="line"><span>        10.4.7.10</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动keepalived并配置开机自启：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># systemctl start keepalived</span></span>
<span class="line"><span># systemctl enable keepalived</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>检查VIP情况：</p><p>7-11是主，现在vip绑定在主上，正常：</p><p><img src="`+p+'" alt="img"></p><p>如果keepalived出现脑裂问题，两台上面都有vip，可以加入以下配置，将多播修改成单播：</p><p><img src="'+r+'" alt="img"></p><p>至此，apiserver部署完成，并且配置了负载高可用。下一章节部署kube-controller-manager。</p>',59)]))}const v=n(d,[["render",t]]),o=JSON.parse('{"path":"/note-book/Kubernetes/04%E4%BA%8C%E8%BF%9B%E5%88%B6%E5%AE%89%E8%A3%85kubernetes%EF%BC%88%E4%BA%8C%EF%BC%89kube-apiserver%E7%BB%84%E4%BB%B6%E5%AE%89%E8%A3%85.html","title":"二进制安装kubernetes（二）kube-apiserver组件安装","lang":"zh-CN","frontmatter":{"description":"二进制安装kubernetes（二）kube-apiserver组件安装 根据架构图，我们的apiserver部署在hdss7-21和hdss7-22上： 首先在hdss7-200上申请证书并拷贝到21和22上： 创建证书文件： 申请证书： 下载kubernetes，放到21，22服务器上，官方地址：https://kubernetes.io/docs...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"二进制安装kubernetes（二）kube-apiserver组件安装\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-03-07T08:15:04.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Paper-Dragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/Kubernetes/04%E4%BA%8C%E8%BF%9B%E5%88%B6%E5%AE%89%E8%A3%85kubernetes%EF%BC%88%E4%BA%8C%EF%BC%89kube-apiserver%E7%BB%84%E4%BB%B6%E5%AE%89%E8%A3%85.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"二进制安装kubernetes（二）kube-apiserver组件安装"}],["meta",{"property":"og:description","content":"二进制安装kubernetes（二）kube-apiserver组件安装 根据架构图，我们的apiserver部署在hdss7-21和hdss7-22上： 首先在hdss7-200上申请证书并拷贝到21和22上： 创建证书文件： 申请证书： 下载kubernetes，放到21，22服务器上，官方地址：https://kubernetes.io/docs..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-07T08:15:04.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-07T08:15:04.000Z"}]]},"git":{"createdTime":1691939318000,"updatedTime":1709799304000,"contributors":[{"name":"Paper-Dragon","username":"Paper-Dragon","email":"2678885646@qq.com","commits":1,"url":"https://github.com/Paper-Dragon"},{"name":"PaperDragon-SH","username":"PaperDragon-SH","email":"2678885646@qq.com","commits":2,"url":"https://github.com/PaperDragon-SH"}],"changelog":[{"hash":"d9487231a8c7ade839488b74acab413e440a9cab","time":1709799304000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"sort"},{"hash":"add06512dbab9c2ec374f7e7202d1e4485d6abdc","time":1709795464000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"二进制安装kubernetes（二）kube-apiserver组件安装"},{"hash":"392a519398b2e846f316619fbe831e100164de7c","time":1691939318000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Create The Worid!"}]},"readingTime":{"minutes":5.19,"words":1557},"filePathRelative":"note-book/Kubernetes/04二进制安装kubernetes（二）kube-apiserver组件安装.md","excerpt":"\\n<p>根据架构图，我们的apiserver部署在hdss7-21和hdss7-22上：</p>\\n<p>首先在hdss7-200上申请证书并拷贝到21和22上：</p>\\n<p>创建证书文件：</p>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code class=\\"language-\\"><span class=\\"line\\"><span># cd /opt/certs</span></span>\\n<span class=\\"line\\"><span># vi client-csr.json</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{v as comp,o as data};
