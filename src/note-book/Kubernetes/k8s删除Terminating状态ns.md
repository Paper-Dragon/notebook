

# k8s删除Terminating状态ns

## 假设你要删掉ns资源，发现一直删不了处于terminating状态

```bash
# kubectl get ns
NAME              STATUS        AGE
default           Active        7h11m
kube-flannel      Terminating   6h41m
kube-node-lease   Active        7h11m
kube-public       Active        7h11m
kube-system       Active        7h11m
```

## 首先试一下先把这个ns的所有pod都删掉

    kubectl delete pod --all -n kube-flannel

还是不行的话，加个参数强制删除

    kubectl delete pod --grace-period=0 --force -n kube-flannel

如果依然是卡死状态，就要使用下面的必杀技了

## 首先生成一个tmp.json文件

    kubectl get namespace kube-flannel -o json > tmp.json



## 然后修改这个json文件tmp.json ，把finalizers的kubernetes删掉

```json
{
    "apiVersion": "v1",
    "kind": "Namespace",
    "metadata": {
        "annotations": {
            "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"v1\",\"kind\":\"Namespace\",\"metadata\":{\"annotations\":{},\"labels\":{\"pod-security.kubernetes.io/enforce\":\"privileged\"},\"name\":\"kube-flannel\"}}\n"
        },
        "creationTimestamp": "2022-09-01T18:52:03Z",
        "deletionTimestamp": "2022-09-02T01:27:51Z",
        "labels": {
            "kubernetes.io/metadata.name": "kube-flannel",
            "pod-security.kubernetes.io/enforce": "privileged"
        },
        "name": "kube-flannel",
        "resourceVersion": "45633",
        "uid": "d2ed1197-ce79-4892-b861-68d13a5bade9"
    },
    "spec": {
        "finalizers": [
            "kubernetes"  //删除这一行
        ]
    },
    "status": {
        "conditions": [
            {
                "lastTransitionTime": "2022-09-02T01:27:57Z",
                "message": "All resources successfully discovered",
                "reason": "ResourcesDiscovered",
                "status": "False",
                "type": "NamespaceDeletionDiscoveryFailure"
            },
            {
                "lastTransitionTime": "2022-09-02T01:27:57Z",
                "message": "All legacy kube types successfully parsed",
                "reason": "ParsedGroupVersions",
                "status": "False",
                "type": "NamespaceDeletionGroupVersionParsingFailure"
            },
            {
                "lastTransitionTime": "2022-09-02T01:28:34Z",
                "message": "Failed to delete all resource types, 1 remaining: unexpected items still remain in namespace: kube-flannel for gvr: /v1, Resource=pods",
                "reason": "ContentDeletionFailed",
                "status": "True",
                "type": "NamespaceDeletionContentFailure"
            },
            {
                "lastTransitionTime": "2022-09-02T01:27:57Z",
                "message": "Some resources are remaining: pods. has 1 resource instances",
                "reason": "SomeResourcesRemain",
                "status": "True",
                "type": "NamespaceContentRemaining"
            },
            {
                "lastTransitionTime": "2022-09-02T01:27:57Z",
                "message": "All content-preserving finalizers finished",
                "reason": "ContentHasNoFinalizers",
                "status": "False",
                "type": "NamespaceFinalizersRemaining"
            }
        ],
        "phase": "Terminating"
    }
}
```



## 然后本机服务暴露在本地端口的8001端口上

    kubectl proxy
    
    kubectl proxy
    Starting to serve on 127.0.0.1:8001

## 新开一个terminal，把修改后的tmp.json到要删除的ns资源目录下

    curl -k -H "Content-Type: application/json" -X PUT --data-binary @tmp.json http://127.0.0.1:8001/api/v1/namespaces/kube-flannel/finalize

这样就可以删掉了
