# gitlab ci/cd 的两大要素

* gitlab runner
* gitlab-ci.yml

.gitlab-ci.yml 基本关键词的使用

```yaml
before_script
script
after_script

allow_failure 
artifiacts 
cache
coverage 
dependencies
environment
except
extends
image
include
interruprible
only
pages
parallel
release
resource_group
retry
rules
services
stage
tags
timeout
trigger
variables
when

```

# 关键字分为两大类

* 全局关键字
* 普通关键字

## 全局关键字

* `stages` , 用来定义流水线各个阶段的执行顺序

* `workflow` ， 控制那种类型的流水线可以运行

* `include` ， 从其他YAML里导入配置

### stages

`stages` 是用来定义流水线各个阶段的，示例如下：

```yaml
stages:
  - build
  - test
  - deploy
```

上面的示例中就定义了一个三个阶段的流水线，里面各个阶段的定义顺序就是每个阶段的执行顺序，即安装build、test、deploy这样的顺序来执行。

如果你没有主动使用`stages`关键字定义阶段的话，gitlab默认会有下面5个阶段：

* `.pre`
* `build`
* `test`
* `deploy`
* `.post`

### workflow

`workflow`是用来决定执行哪个流水线以及这个流水线是否执行的关键字。

它和`stages`是一个级别，

在使用的时候，一般需要和`rules`关键字搭配使用。`rules`关键字是一个普通关键字，是用来定义流程是否执行的规则，通过`if`条件和`when`条件的组合来判断和规则匹配的流水线是否执行。`if`判断条件是否匹配，`when`决定符合条件的流水线是否执行。光看概念可能比较模糊，直接看示例。

```yaml
workflow:
  rules:
    - if: $CI_COMMIT_MESSAGE =~ /-draft$/
      when: never
    - if: $CI_PIPELINE_SOURCE == "push"
```

在上面的示例中，定义的是严格的规则。里面使用了两个Gitlab预定义的变量`$CI_COMMIT_MESSAGE`和 `$CI_PIPELINE_SOURCE`，前者的含义是你往gitlab仓库里提交的commit信息，后者的含义是你往gitlab仓库里做的操作（例如推送`push`，合并请求`merge`等）。上面两个条件的以上就是：

* 如果提交信息里有`-draft`，那么这个流水线就不会运行（`when: never`表示永不执行）
* 如果做的操作是`push`，那么流水线就会执行。

只有符合上面两个条件的流水线会有下一步操作，其他任何类型流水线都不会执行。这个东西有点类似于linux里的防火墙，即符合某些规则的流量会放行或拒绝，其他不匹配的全部丢弃。
 有严格的匹配，也有宽松的匹配，看下面的例子：

```yaml
workflow:
  rules:
    - if: '$CI_PIPELINE_SOURCE == "schedule"'
      when: never
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: never
    - when: always
```

这个例子里匹配前面两个条件的流水线不会执行（`when: never`），其他流水线全部执行（`when: always`）

#### 根据不同的条件使用不同的变量值

在文章开头的时候，第一个问题是怎么在任务里使用变量。答案就是`variables`关键字，这是一个普通关键字，既可以在全局使用，也可以在任务里使用。特别是和`workflow`组合使用，在不同条件下有不同的值，看下面的示例：

```yaml
variables:
  DEPLOY_VARIABLE: "default-deploy"

workflow:
  rules:
    - if: $CI_COMMIT_REF_NAME == $CI_DEFAULT_BRANCH
      variables:
        DEPLOY_VARIABLE: "deploy-production"  # 覆盖全局定义的 DEPLOY_VARIABLE
    - if: $CI_COMMIT_REF_NAME =~ /feature/
      variables:
        IS_A_FEATURE: "true"                  # 定义一个新变量
    - when: always                            # 其他任何条件都运行流水线

job1:
  variables:
    DEPLOY_VARIABLE: "job1-default-deploy"
  rules:
    - if: $CI_COMMIT_REF_NAME == $CI_DEFAULT_BRANCH
      variables:                                   # 在任务级别覆盖定义的DEPLOY_VARIABLE 变量
        DEPLOY_VARIABLE: "job1-deploy-production"   
    - when: on_success                             # 在其他情况运行任务
  script:
    - echo "Run script with $DEPLOY_VARIABLE as an argument"
    - echo "Run another script if $IS_A_FEATURE exists"

job2:
  script:
    - echo "Run script with $DEPLOY_VARIABLE as an argument"
    - echo "Run another script if $IS_A_FEATURE exists"
```

在上面的示例中，定义了一个全局变量`DEPLOY_VARIABLE`，默认值是`default_deploy`，然后会根据下面的workflow判断，在不同的任务中会使用不同的值，分为以下几种情况：

* 当触发流水线的分支是默认分支时（一般是master），则

  * job1里`DEPLOY_VARIABLE`的值是`job1-deploy-production`（因为job1里的rules匹配了，此时rules下面的变量定义生效）
  * job2里`DEPLOY_VARIABLE`的值是`deploy-production`，此时workflow里的rules匹配，变量定义生效。

* 当触发的分支是feature时，workflow里的rules规则匹配，会创建变量

  ```
  IS_A_FEATURE: "true"
  ```

  ，对两个任务同时生效。

  * job1里的`DEPLOY_VARIABLE`的值是`job1-default-production`，局部变量覆盖全局变量
  * job2里的`DEPLOY_VARIABLE`的值是`default-deploy`，使用最开始的全局变量

* 当触发流水线的分支是其他时

  * job1里`DEPLOY_VARIABLE`的值是`job1-default-deploy`，局部变量覆盖全局变量
  * job2里`DEPLOY_VARIABLE`的值是`default-deploy`，使用最开始的全局变量

变量关键字`variables`和规则`rules`解决我们在第一篇文章里提出来的两个问题。

### include

`include`关键字也是一个全局关键字，用来导入其他YAML文件，这样可以把一个很长的`.gitlab-ci.yml`文件分割成很多个小文件，然后通过`include`包含进来，可以提高文件的可读性和复用性。
 `include`包含进来的文件必须是`.yml`或`.yaml`结尾的，其他类型文件会被忽略。支持下面四种包含方法：

* `local`，导入相同项目下的文件
* `file`，导入其他项目仓库下的文件
* `remote`，从远程URL里导入文件，这个URL必须是可以公开访问的。
* `template`，包含Gitlab提供的模板文件

#### local

导入本仓库里的文件时，需要以仓库根目录为起点，而`.gitlab-ci.yml`文件刚好位于根目录下，因此可以直接使用相对路径来写。基本用法如下所示：

```yaml
include: configs/conf.yaml 
```

还可以使用通配符来匹配

```css
include: configs/*.yaml
include: configs/**/*.yml
```

第一个是导入configs目录下的所有yaml文件
 第二个是导入configs所有子目录下的所有yaml文件

#### file

要导入相同gitlab服务器上其他仓库里的文件，可以使用file格式，这个时候需要使用绝对路径，如下所示：

```yaml
include:
  - project: 'userA/projectA'
    file: '/templates/.gitlab-ci-template.yml'
```

上面的命令会导入userA空间下projectA项目里的`templates/.gitlab-ci-template.yml`文件。

还可以指定分支号、tag号或直接通过哈希值导入，示例如下：

```yaml
include:
  # 通过分支号导入  
  - project: 'userA/projectA'
    ref: master
    file: '/templates/.gitlab-ci-template.yml'

  # 通过tag导入
  - project: 'userA/projectA'
    ref: v1.0.1
    file: '/templates/.gitlab-ci-template.yml'

  # 通过哈希值导入
  - project: 'userA/projectA'
    ref:  7234123b
    file: '/templates/.gitlab-ci-template.yml'
```

如果想导入一个项目里的多个文件，除了使用上面说到的通配符以外，还可以使用文件列表的方式，如下所示：

```yaml
include:
  - project: 'userA/projectA'
    file: 
      - '/templates/.gitlab-ci-template.yml'
      - '/configs/conf.yaml'
```

#### remote

remote用来导入远程仓库里的文件，示例如下：

```yaml
include:
  - remote: 'https://gitlab.com/userA/projectA/-/raw/main/.gitlab-ci.yaml'
```

#### template

目前还不知道Gitlab提供的模板是什么意思，也没有正式使用。只有官网上的一个例子：

```yaml
include:
  - template: Android-Fastlane.gitlab-ci.yml
  - template: Auto-DevOps.gitlab-ci.yml
```

上面是导入多个模板的方式，还可以导入单个模板，用法和file、local类似。

以上就是三个全局变量的全部内容，明天再接着看其他变量的内容。

## variables

用来定义变量，既可以在全局范围使用，也可以单任务级别使用。在gitlab里，变量分为两种类型：

* 自定义变量，即使用variables关键字定义的变量
* 预定义变量，即gitlab官方提前定义好的变量，可以直接使用。例如CI_COMMIT_REF_NAME，表示正在构建项目的分支或者tag名称。

变量定义的一些规则：

* 在变量的名称和值里都只能出现数字和字符串。
* 出现同名变量时，后出现的值覆盖先出现的。
* 所有YAML格式定义的变量在服务容器里都可以访问到。

示例如下：

```bash
variables:
  DEPLOY_SITE: "https://example.com/"

deploy_job:
  stage: deploy
  script:
    - deploy-script --url $DEPLOY_SITE --path "/"

deploy_review_job:
  stage: deploy
  variables:
    REVIEW_PATH: "/review"
  script:
    - deploy-review-script --url $DEPLOY_SITE --path $REVIEW_PATH
```

调用方式和shell里调用变量的方式一样。

手动流水线里可以使用value和description来定义预填充变量：
 示例如下：

```yaml
variables:
  DEPLOY_ENVIRONMENT:
    value: "staging"  # Deploy to staging by default
    description: "The deployment target. Change this variable to 'canary' or 'production' if needed."
```

但是手动流水线的概念还没搞明白，所以这块内容在后面需要进行修改和更新。

## image

用来指定运行这个**任务**的docker镜像。基本用法如下所示：

```yaml
default:
  image: ruby:2.6

  services:
    - postgres:11.7

  before_script:
    - bundle install

test:
  script:
    - bundle exec rake spec
```

上面的示例中使用`default`关键字定义了一个全局的镜像参数，即所有任务默认都会使用这个镜像。除此之外，还可以在任务级别定义，即每个任务使用自己的镜像：

```yaml
build-job1:
  stage: build
  image: nginx:1.8.0  
```

在上面这个示例中，build-job1任务使用nginx:1.8.0镜像。（待测试）

镜像的名称遵循下面的格式：

* `image: <image-name>`（等同于`image-name:latest`）
* `image: <image-name>:<tag>`
* `image: <image-name>@<digest>`
   即使用最新镜像，标签指定镜像，哈希值指定镜像

### image的扩展用法

`image:name`
 用来指定镜像的名称，用法如下：

```yaml
image:
  name: 'registry.example.com/my/image:latest'  
```

这种用法和上面的三种没有区别。这种用法一般是和下面的`entrypoint`搭配使用。

`image:entrypoint`
 `entrypoint`是用来覆盖镜像默认的执行命令。用法如下：
 17.06及之后的版本

```dart
image:
  name: super/sql:experimental
  entrypoint: [""]
```

17.03及之前的版本

```dart
image:
  name: super/sql:experimental
  entrypoint: ["/bin/sh", "-c"]
```

上面这两种格式，会让runner基于镜像`super/sql:experimental`启动一个新镜像，但是会使用默认的shell来覆盖原来镜像的启动命令。

除了使用默认shell覆盖以外， 还可以使用其他任何你想使用的命令来覆盖，只需要将命令写入上面的entrypoint后面的数组里即可。

## services

这个关键字用来指定一个服务容器镜像，在任务运行的时候，会创建一个服务容器，链接到image关键字里指定的镜像创建的任务容器上。实际上的流程比这一句要复杂的多，简单概括一下，应该是：

* 根据services里指定的镜像，启动一个服务容器（service container）
* 根据job里的image启动一个任务容器（job container）
* 将服务容器和任务容器链接到一起，然后在任务容器里可以通过主机名访问服务容器里提供的服务（目前还不知道有什么用）

目前服务容器主要作用还是当做一个单独的小数据库使用，官方文档上提供的4种服务容器类型分别是：

* postgresql
* mysql
* redis
* gitlab
   具体的用法后面再具体研究，这个`services`在`.gitlab-ci.yml`文件里的用法如下所示：

```css
default:
  before_script:
    - bundle install

test:2.6:
  image: ruby:2.6
  services:
    - postgres:11.7
  script:
    - bundle exec rake spec

test:2.7:
  image: ruby:2.7
  services:
    - postgres:12.2
  script:
    - bundle exec rake spec
```

在test:2.6任务里，定义的任务容器镜像是`ruby:2.6`，服务镜像是`postgres:11.7`。

除了这种格式以外，还有更复杂一点的定义方式，看下面的示例：

```bash
default:
  image:
    name: ruby:2.6
    entrypoint: ["/bin/bash"]

  services:
    - name: my-postgres:11.7
      alias: db-postgres
      entrypoint: ["/usr/local/bin/db-postgres"]
      command: ["start"]

  before_script:
    - bundle install

test:
  script:
    - bundle exec rake spec
```

在services下支持另外4个参数：

* name，服务名称，也是镜像名称
* alias，别名，可以用来在任务容器里访问服务，因为默认名称在带有registry信息的时候非常长，不方便使用，可以设置一个简短的别名。
* entrypoint，用来覆盖服务镜像默认执行命令
* command，和Dockerfile里的CMD指令类似，用来覆盖镜像里默认的CMD指令。

## 隐藏任务（hidden_job）

如果想临时禁用一个任务，除了将它注释起来以外，还可以在它名称前面加一个点号，将它变成一个隐藏任务，这样在Gitlab的UI界面就看不到这个任务了，它也不会实际执行，如下所示：

```bash
.hidden_job:
  script:
    - run test
```

隐藏任务在`.gitlab-ci.yml`里的用法一般是用来做一些命令、变量或者配置的模板。在其他位置导入，例如昨天发布的文章里介绍的YAML锚，就可以导入隐藏任务模板。

## extends

`extends`关键字是用来复用配置部分，和它功能类似的是YAML锚，但是它更灵活且可读性更强。它和YAML锚的区别是，可以从`include`关键字包含进来的配置文件里复用配置。

看下面的示例：

```bash
.tests:
  script: rake test
  stage: test
  only:
    refs:
      - branches

rspec:
  extends: .tests
  script: rake rspec
  only:
    variables:
      - $RSPEC
```

在这个例子里，rspec任务复用了来自`.tests`任务模板里的配置。然后在实际执行时，Gitlab会做以下操作：

* 基于键做深度迭代合并
* 合并.tests的内容到rspec任务
* 不会合并键对应的值

最终解析出来的rspec任务内容如下所示：

```bash
rspec:
  script: rake test
  stage: test
  only:
    refs:
      - branches
    variables:
      - $RSPEC  
```

从结果中可以看到，相同的键`only`，它下面的两个值会合并到一起，用于最终的条件判断。`only`关键字在后面会介绍。

### 多级别继承

`extends`支持多级别继承，在实际使用的时候，应该避免超过3层的命令，最多可以使用11层（但是不要使用，太过复杂）。下面的实例演示了一个2层继承：

```dart
.tests:
  rules:
    - if: "$CI_PIPELINE_SOURCE" = "push"
    
.rspec:
  extends: .tests
  script: rake test

rspec 1:
  variables:
    RSPEC_SUITE: '1'
  extends: .rspec

rspec 2:
  variables:
    RSPEC_SUITE: '2'
    extends: .rspec
    
spinach
  extends: .tests
  script: rake spinach 
```

在上面的示例中，`rspec1`和`rspec2`这两个任务都是双层扩展，他们俩扩展`.rspec` 这个隐藏任务模板的内容，而`.rspec`扩展来自`.tests`任务模板的内容。

### 合并细节

可以使用`extends`来合并哈希字典，而不是数组。合并使用的算法是**“最近范围优先”**。所以来自最后一个同名成员会覆盖之前定义的，示例如下；

```bash
.only-important:
  variables:
    URL; "http://my-url.internal"
    IMPORTANT_VAR: "the details"
    
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
    - if: $CI_COMMIT_BRANCH == "stable"
    
  tags:
    - production
  script:
    - echo "Hello world"
    
.in-docker:
  variables:
    URL: "http://docker-url.internal"
  tags:
    - docker
  image: alpine
  
rspec:
  variables:
    GITLAB: "is-awesome"
  extends:
    - .only-important
    - .in-docker
  script:
   - rake rspec                        
```

在上面的示例里，同时扩展了`.only-important`和`.in-docker`这两个隐藏任务模板。而在这两个模板里面，有一个相同的变量`URL`，一个相同的`tags`。后扩展的是`.in-docker`模板，那么最终生效的是`.in-docker`里的URL变量以及`tags`，即URL变量的值是 `"http://docker-url.internal"`，`tags`的值是`docker`。最终的`rspec`任务的内容是：

```yaml
rspec:
  variables:
    URL: "http://docker-url.internal"
    IMPORTANT_VAR: "the details"
    GITLAB: "is-awesome"
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
    - if: $CI_COMMIT_BRANCH == "stable"
  tags:
    - docker
  image: alpine
  script:
    - rake rspec
```

`script`的内容不会合并，因此最终生效的是`rspec`里自己的`script`，即`- rake rspec`。

### `extends`和`include`结合使用

要复用来自其他配置文件里的配置，可以结合使用`extends`和`include`，示例如下：
 `included.yaml`文件内容

```bash
.template:
  script:
    - echo Hello!  
```

`.gitlab-ci.yml`文件内容：

```css
include: included.yml

useTemplate:
  image: alpine
  extends: .template  
```

`extends`会首先到`.gitlab-ci.yml`文件里找`.template`模板的定义，如果没找到，才会去`included.yml`文件里查找。

## stage

`stage`关键字用来定义任务所属的阶段，在相同`stage`里的任务会并行执行。如果没有定义`stage`参数，那么这个任务默认属于`test`阶段。

`stage`示例如下：

```bash
stages:
  - build
  - test
  - deploy

job1:
  stage: build
  script:
    - echo "This job compiles code."

job2:
  stage: test
  script:
    - echo "This job tests the compiled code. It runs when the build stage completes."

job3:
  script:
    - echo "This job also runs in the test stage".

job4:
  stage: deploy
  script:
    - echo "This job deploys the code. It runs when the test stage completes."
```

对于并发执行的任务，有一些前提条件：

* 有多个runner，可以一次运行多个任务
* 一个runner里的concurrent设置大于1，表示一个runner可以同时运行超过1个任务，此时可以并发执行多个任务。

### `stage: .pre`和`stage: .post`

`.pre`阶段里的任务会在流水线开始执行之前就执行完成。`.post`是流水线任务执行完成以后执行的阶段。用户不需要自己定义`.pre`或`.post`阶段，可以直接在任务里直接使用`stage: .pre`和`stage: .post`将任务划分到这两个阶段即可。看下面的示例：

```bash
stages:
  - build
  - test

job1:
  stage: build
  script:
    - echo "This job runs in the build stage."

first-job:
  stage: .pre
  script:
    - echo "This job runs in the .pre stage, before all other stages."

job2:
  stage: test
  script:
    - echo "This job runs in the test stage."

last-job:
  stage: .post
  script:
    - echo "This job runs in the .post stage, after all other stages."   
```

在上面的示例里，4个任务的执行顺序按照规则依次是：

* first-job
* job1
* job2
* last-job

## before_script

`before_script`用来定义一个命令数组，在任务运行之前，会先执行这部分命令。但是`artifacts`比`before_script`先执行，后面会介绍`artfacts`的用途。
 `beforce_script`里定义的命令类型包括：

* 单行命令
* 分为多行的单个长命令
* YAML锚

`before_script示例如下：

```bash
job:
  before_script:
    - echo "Execute this command before any `script:` command"
  script:
    - echo "This command execute after before-script command"    
```

提示，`before_script`里定义的命令和`script`里定义的命令是按照顺序在相同的shell里执行的。

## script

使用`script`指定`runner`执行的`shell`脚本。除了触发任务（trigger job）以外，其他任务都需要使用`script`关键字指定执行的脚本。例如：

单个命令

```bash
job:
  script: "bundle exec rspec"
```

多个命令

```bash
job:
  script:
    - uname -a
    - bundle exec rspec  
```

有时候需要将命令使用单引号或双引号括起来，如下所示：

```rust
job:
  script:
    - curl --request POST --header 'Content-Type: application/json' \
        "https://gitlab/api/v4/projects"
job:
  script:
    - 'curl --request POST --header "Content-Type: application/json" \
        "https://gitlab/api/v4/projects"'
```

在写这些命令的时候，需要注意下面这些特殊字符：
 `{, }, [, ], ,, &, *, #, ?, |, -, <, >, =, !, %, @,`
 如果某个命令的返回结果不是0，那么整个任务就会执行失败，可以捕获命令的返回结果，主动报错。但是可以保证任务不结束：

```bash
job:
  script:
    - false || exit_code=$?
    - if [ $exit_code -ne 0 ]; then echo "Previous command failed"; fi;
   
```

## after_script

使用`after_script`可以定义一个命令数组，用于在任务执行完成之后执行，包括失败的任务。

在after_script里定义的命令类型包括：

* 单行命令
* 分为多行的单个长命令
* YAML锚

after_script示例：

```bash
ob:
  script:
    - echo "An example script section"
  after_script:
    - echo "Execute this command after the `script` section completes"  
```

提示：在`after_script`里指定的脚本是在新shell里执行的，和`before_script`以及`script`命令的执行环境是隔离开的。因此：

* 会将当前工作目录设置为默认值
* 无权访问before_script或script里定义的命令做出的修改，包括：
  * 在script脚本里定义的命令别名或导出的变量
  * 在工作树以外做出的修改（取决于runner执行器），像在before_script里或script里安装的软件。
* 有一个独立的超时时间，硬编码为5min
* 不会影响任务的结束代码。如果任务的script部分成功执行，但是after_script超时导致失败。整个任务的结束代码还是0（表示任务成功执行）
* 如果任务超时或者被取消，after_script不会执行。

以上就是今天学习的几个脚本关键字，明天继续。

## 💖[预定义 CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)

### 预定义变量参考

| 变量                                            | GitLab        | Runner | 描述                                                         |
| :---------------------------------------------- | :------------ | :----- | :----------------------------------------------------------- |
| `CHAT_CHANNEL`                                  | 10.6          | 全部   | 触发[ChatOps](https://docs.gitlab.com/ee/ci/chatops/index.html)命令的源聊天频道。 |
| `CHAT_INPUT`                                    | 10.6          | 全部   | [使用ChatOps](https://docs.gitlab.com/ee/ci/chatops/index.html)命令 传递的附加参数。 |
| `CHAT_USER_ID`                                  | 14.4          | 全部   | [触发ChatOps](https://docs.gitlab.com/ee/ci/chatops/index.html)命令 的用户的聊天服务用户 ID 。 |
| `CI`                                            | 全部          | 0.4    | 可用于 CI/CD 中执行的所有作业。`true`有空的时候。            |
| `CI_API_V4_URL`                                 | 11.7          | 全部   | GitLab API v4 根 URL。                                       |
| `CI_BUILDS_DIR`                                 | 全部          | 11.10  | 执行构建的顶级目录。                                         |
| `CI_COMMIT_AUTHOR`                              | 13.11         | 全部   | `Name <email>`格式 提交的作者。                              |
| `CI_COMMIT_BEFORE_SHA`                          | 11.2          | 全部   | 分支上存在的上一个最新提交。始终`0000000000000000000000000000000000000000`在合并请求管道中。 |
| `CI_COMMIT_BRANCH`                              | 12.6          | 0.5    | 提交分支名称。在分支管道中可用，包括默认分支的管道。在合并请求管道或标签管道中不可用。 |
| `CI_COMMIT_DESCRIPTION`                         | 10.8          | 全部   | 提交的描述。如果标题少于 100 个字符，则没有第一行的消息。    |
| `CI_COMMIT_MESSAGE`                             | 10.8          | 全部   | 完整的提交消息。                                             |
| `CI_COMMIT_REF_NAME`                            | 9.0           | 全部   | 为其构建项目的分支或标签名称。                               |
| `CI_COMMIT_REF_PROTECTED`                       | 11.11         | 全部   | `true`如果作业正在运行以获取受保护的引用。                   |
| `CI_COMMIT_REF_SLUG`                            | 9.0           | 全部   | `CI_COMMIT_REF_NAME`小写，缩短为 63 字节`0-9`，除. 没有前导/尾随。在 URL、主机名和域名中使用。 `a-z``-``-` |
| `CI_COMMIT_SHA`                                 | 9.0           | 全部   | 构建项目的提交版本。                                         |
| `CI_COMMIT_SHORT_SHA`                           | 11.7          | 全部   | 的前八个字符`CI_COMMIT_SHA`。                                |
| `CI_COMMIT_TAG`                                 | 9.0           | 0.5    | 提交标记名称。仅在标签的管道中可用。                         |
| `CI_COMMIT_TIMESTAMP`                           | 13.4          | 全部   | ISO 8601 格式的提交时间戳。                                  |
| `CI_COMMIT_TITLE`                               | 10.8          | 全部   | 提交的标题。消息的完整第一行。                               |
| `CI_CONCURRENT_ID`                              | 全部          | 11.10  | 单个执行器中构建执行的唯一 ID。                              |
| `CI_CONCURRENT_PROJECT_ID`                      | 全部          | 11.10  | 单个执行器和项目中构建执行的唯一 ID。                        |
| `CI_CONFIG_PATH`                                | 9.4           | 0.5    | CI/CD 配置文件的路径。默认为`.gitlab-ci.yml`. 在正在运行的管道中只读。 |
| `CI_DEBUG_TRACE`                                | 全部          | 1.7    | `true`如果启用 [了调试日志记录（跟踪） 。](https://docs.gitlab.com/ee/ci/variables/index.html#debug-logging) |
| `CI_DEFAULT_BRANCH`                             | 12.4          | 全部   | 项目默认分支的名称。                                         |
| `CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX`        | 13.7          | 全部   | 通过依赖代理拉取镜像的顶级组镜像前缀。                       |
| `CI_DEPENDENCY_PROXY_DIRECT_GROUP_IMAGE_PREFIX` | 14.3          | 全部   | 通过依赖代理拉取镜像的直接组镜像前缀。                       |
| `CI_DEPENDENCY_PROXY_PASSWORD`                  | 13.7          | 全部   | 通过依赖代理拉取图像的密码。                                 |
| `CI_DEPENDENCY_PROXY_SERVER`                    | 13.7          | 全部   | 用于登录依赖代理的服务器。这相当于`$CI_SERVER_HOST:$CI_SERVER_PORT`. |
| `CI_DEPENDENCY_PROXY_USER`                      | 13.7          | 全部   | 通过依赖代理拉取图像的用户名。                               |
| `CI_DEPLOY_FREEZE`                              | 13.2          | 全部   | 仅当管道在[部署冻结窗口](https://docs.gitlab.com/ee/user/project/releases/index.html#prevent-unintentional-releases-by-setting-a-deploy-freeze)期间运行时才可用。`true`有空的时候。 |
| `CI_DEPLOY_PASSWORD`                            | 10.8          | 全部   | [GitLab Deploy Token](https://docs.gitlab.com/ee/user/project/deploy_tokens/index.html#gitlab-deploy-token)的认证密码，如果项目有的话。 |
| `CI_DEPLOY_USER`                                | 10.8          | 全部   | [GitLab Deploy Token](https://docs.gitlab.com/ee/user/project/deploy_tokens/index.html#gitlab-deploy-token)的身份验证用户名，如果项目有的话。 |
| `CI_DISPOSABLE_ENVIRONMENT`                     | 全部          | 10.1   | 仅当作业在一次性环境中执行时才可用（仅为此作业创建并在执行后处置/销毁的东西 - 除`shell`和之外的所有执行器`ssh`）。`true`有空的时候。 |
| `CI_ENVIRONMENT_NAME`                           | 8.15          | 全部   | 此作业的环境名称。设置后可用[`environment:name`](https://docs.gitlab.com/ee/ci/yaml/index.html#environmentname)。 |
| `CI_ENVIRONMENT_SLUG`                           | 8.15          | 全部   | 环境名称的简化版本，适合包含在 DNS、URL、Kubernetes 标签等中。设置后可用[`environment:name`](https://docs.gitlab.com/ee/ci/yaml/index.html#environmentname)。slug 被[截断为 24 个字符](https://gitlab.com/gitlab-org/gitlab/-/issues/20941)。 |
| `CI_ENVIRONMENT_URL`                            | 9.3           | 全部   | 此作业的环境 URL。设置后可用[`environment:url`](https://docs.gitlab.com/ee/ci/yaml/index.html#environmenturl)。 |
| `CI_ENVIRONMENT_ACTION`                         | 13.11         | 全部   | 为此作业的环境指定的操作注释。设置后可用[`environment:action`](https://docs.gitlab.com/ee/ci/yaml/index.html#environmentaction)。可以是`start`、`prepare`或`stop`。 |
| `CI_ENVIRONMENT_TIER`                           | 14.0          | 全部   | 此作业 的[环境部署层。](https://docs.gitlab.com/ee/ci/environments/index.html#deployment-tier-of-environments) |
| `CI_HAS_OPEN_REQUIREMENTS`                      | 13.1          | 全部   | 仅当管道的项目有开放[需求](https://docs.gitlab.com/ee/user/project/requirements/index.html)时才可用。`true`有空的时候。 |
| `CI_JOB_ID`                                     | 9.0           | 全部   | 作业的内部 ID，在 GitLab 实例中的所有作业中是唯一的。        |
| `CI_JOB_IMAGE`                                  | 12.9          | 12.9   | 运行作业的 Docker 映像的名称。                               |
| `CI_JOB_JWT`                                    | 12.10         | 全部   | 一个 RS256 JSON Web 令牌，用于向支持 JWT 身份验证的第三方系统进行身份验证，例如[HashiCorp 的 Vault](https://docs.gitlab.com/ee/ci/secrets/index.html)。 |
| `CI_JOB_JWT_V1`                                 | 14.6          | 全部   | 与 相同的值`CI_JOB_JWT`。                                    |
| `CI_JOB_JWT_V2`                                 | 14.6          | 全部   | [**alpha：**](https://docs.gitlab.com/ee/policy/alpha-beta-support.html#alpha-features)一种新格式化的 RS256 JSON Web 令牌，以增加兼容性。与 类似`CI_JOB_JWT`，除了 issuer (`iss`) 声明从 更改`gitlab.com`为`https://gitlab.com`，`sub`已从 更改`job_id`为包含项目路径的字符串，并`aud`添加了声明。格式可能会发生变化。请注意，该`aud`字段是一个常量值。在多个依赖方中信任 JWT 会导致[一个 RP 向另一个 RP 发送 JWT 并恶意充当作业](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/72555#note_769112331)。 |
| `CI_JOB_MANUAL`                                 | 8.12          | 全部   | `true`如果作业是手动启动的。                                 |
| `CI_JOB_NAME`                                   | 9.0           | 0.5    | 作业的名称。                                                 |
| `CI_JOB_STAGE`                                  | 9.0           | 0.5    | 作业阶段的名称。                                             |
| `CI_JOB_STATUS`                                 | 全部          | 13.5   | 执行每个运行器阶段时的作业状态。与 一起使用[`after_script`](https://docs.gitlab.com/ee/ci/yaml/index.html#after_script)。可以是`success`、`failed`或`canceled`。 |
| `CI_JOB_TOKEN`                                  | 9.0           | 1.2    | [使用某些 API 端点](https://docs.gitlab.com/ee/ci/jobs/ci_job_token.html)进行身份验证的令牌。只要作业正在运行，令牌就有效。 |
| `CI_JOB_URL`                                    | 11.1          | 0.5    | 作业详细信息 URL。                                           |
| `CI_JOB_STARTED_AT`                             | 13.10         | 全部   | 作业开始时的 UTC 日期时间，采用[ISO 8601](https://tools.ietf.org/html/rfc3339#appendix-A)格式。 |
| `CI_KUBERNETES_ACTIVE`                          | 13.0          | 全部   | 仅当管道具有可用于部署的 Kubernetes 集群时才可用。`true`有空的时候。 |
| `CI_NODE_INDEX`                                 | 11.5          | 全部   | 作业集中作业的索引。仅当作业使用[`parallel`](https://docs.gitlab.com/ee/ci/yaml/index.html#parallel). |
| `CI_NODE_TOTAL`                                 | 11.5          | 全部   | 此作业并行运行的实例总数。`1`如果作业不使用，则设置为[`parallel`](https://docs.gitlab.com/ee/ci/yaml/index.html#parallel)。 |
| `CI_OPEN_MERGE_REQUESTS`                        | 13.8          | 全部   | 使用当前分支和项目作为合并请求源的最多四个合并请求的逗号分隔列表。如果分支具有关联的合并请求，则仅在分支和合并请求管道中可用。例如，`gitlab-org/gitlab!333,gitlab-org/gitlab-foss!11`。 |
| `CI_PAGES_DOMAIN`                               | 11.8          | 全部   | 托管 GitLab 页面的配置域。                                   |
| `CI_PAGES_URL`                                  | 11.8          | 全部   | GitLab 页面站点的 URL。始终是`CI_PAGES_DOMAIN`.              |
| `CI_PIPELINE_ID`                                | 8.10          | 全部   | 当前管道的实例级 ID。此 ID 在 GitLab 实例上的所有项目中都是唯一的。 |
| `CI_PIPELINE_IID`                               | 11.0          | 全部   | 当前管道的项目级 IID（内部 ID）。此 ID 仅在当前项目中是唯一的。 |
| `CI_PIPELINE_SOURCE`                            | 10.0          | 全部   | 管道是如何触发的。可以是`push`, `web`, `schedule`, `api`, `external`, `chat`, `webide`, `merge_request_event`, `external_pull_request_event`, `parent_pipeline`, [`trigger`, 或`pipeline`](https://docs.gitlab.com/ee/ci/triggers/index.html#configure-cicd-jobs-to-run-in-triggered-pipelines). |
| `CI_PIPELINE_TRIGGERED`                         | 全部          | 全部   | `true`如果作业被[触发](https://docs.gitlab.com/ee/ci/triggers/index.html)。 |
| `CI_PIPELINE_URL`                               | 11.1          | 0.5    | 管道详细信息的 URL。                                         |
| `CI_PIPELINE_CREATED_AT`                        | 13.10         | 全部   | 创建管道时的 UTC 日期时间，采用[ISO 8601](https://tools.ietf.org/html/rfc3339#appendix-A)格式。 |
| `CI_PROJECT_CONFIG_PATH`                        | 13.8 至 13.12 | 全部   | 在 GitLab 14.0 中[删除。](https://gitlab.com/gitlab-org/gitlab/-/issues/322807)使用`CI_CONFIG_PATH`. |
| `CI_PROJECT_DIR`                                | 全部          | 全部   | 存储库克隆到的完整路径，以及作业的运行位置。如果设置了 GitLab Runner`builds_dir`参数，则此变量设置为相对于`builds_dir`. 有关更多信息，请参阅[高级 GitLab 运行器配置](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runners-section)。 |
| `CI_PROJECT_ID`                                 | 全部          | 全部   | 当前项目的 ID。此 ID 在 GitLab 实例上的所有项目中都是唯一的。 |
| `CI_PROJECT_NAME`                               | 8.10          | 0.5    | 项目目录的名称。例如，如果项目 URL 为`gitlab.example.com/group-name/project-1`，`CI_PROJECT_NAME`则为`project-1`。 |
| `CI_PROJECT_NAMESPACE`                          | 8.10          | 0.5    | 作业的项目命名空间（用户名或组名）。                         |
| `CI_PROJECT_PATH_SLUG`                          | 9.3           | 全部   | `$CI_PROJECT_PATH`小写字母，字符不被替换`a-z`或被缩短为 63 个字节。在 URL 和域名中使用。 `0-9``-` |
| `CI_PROJECT_PATH`                               | 8.10          | 0.5    | 包含项目名称的项目命名空间。                                 |
| `CI_PROJECT_REPOSITORY_LANGUAGES`               | 12.3          | 全部   | 存储库中使用的语言的逗号分隔小写列表。例如`ruby,javascript,html,css`. |
| `CI_PROJECT_ROOT_NAMESPACE`                     | 13.2          | 0.5    | 作业的根项目命名空间（用户名或组名）。例如，如果`CI_PROJECT_NAMESPACE`是`root-group/child-group/grandchild-group`，`CI_PROJECT_ROOT_NAMESPACE`是`root-group`。 |
| `CI_PROJECT_TITLE`                              | 12.4          | 全部   | GitLab Web 界面中显示的人类可读的项目名称。                  |
| `CI_PROJECT_URL`                                | 8.10          | 0.5    | 项目的 HTTP(S) 地址。                                        |
| `CI_PROJECT_VISIBILITY`                         | 10.3          | 全部   | 项目可见性。可以是`internal`、`private`或`public`。          |
| `CI_PROJECT_CLASSIFICATION_LABEL`               | 14.2          | 全部   | 项目[对外授权分类标签](https://docs.gitlab.com/ee/user/admin_area/settings/external_authorization.html)。 |
| `CI_REGISTRY_IMAGE`                             | 8.10          | 0.5    | 项目的 Container Registry 的地址。仅当为项目启用了 Container Registry 时才可用。 |
| `CI_REGISTRY_PASSWORD`                          | 9.0           | 全部   | 将容器推送到项目的 GitLab 容器注册表的密码。仅当为项目启用了 Container Registry 时才可用。此密码值与 相同，`CI_JOB_TOKEN`并且仅在作业运行时才有效。使用`CI_DEPLOY_PASSWORD`长期访问注册表 |
| `CI_REGISTRY_USER`                              | 9.0           | 全部   | 将容器推送到项目的 GitLab 容器注册表的用户名。仅当为项目启用了 Container Registry 时才可用。 |
| `CI_REGISTRY`                                   | 8.10          | 0.5    | GitLab 容器注册表的地址。仅当为项目启用了 Container Registry 时才可用。`:port`如果在注册表配置中指定了一个值，则 此变量包含一个值。 |
| `CI_REPOSITORY_URL`                             | 9.0           | 全部   | 克隆 Git 存储库的 URL。                                      |
| `CI_RUNNER_DESCRIPTION`                         | 8.10          | 0.5    | 跑步者的描述。                                               |
| `CI_RUNNER_EXECUTABLE_ARCH`                     | 全部          | 10.6   | GitLab Runner 可执行文件的操作系统/架构。可能与执行者的环境不一样。 |
| `CI_RUNNER_ID`                                  | 8.10          | 0.5    | 正在使用的跑步者的唯一 ID。                                  |
| `CI_RUNNER_REVISION`                            | 全部          | 10.6   | 运行作业的运行器的修订版。                                   |
| `CI_RUNNER_SHORT_TOKEN`                         | 全部          | 12.3   | 用于验证新作业请求的运行者令牌的前八个字符。用作跑步者的唯一 ID。 |
| `CI_RUNNER_TAGS`                                | 8.10          | 0.5    | 运行者标签的逗号分隔列表。                                   |
| `CI_RUNNER_VERSION`                             | 全部          | 10.6   | 运行作业的 GitLab Runner 的版本。                            |
| `CI_SERVER_HOST`                                | 12.1          | 全部   | GitLab 实例 URL 的主机，没有协议或端口。例如`gitlab.example.com`. |
| `CI_SERVER_NAME`                                | 全部          | 全部   | 协调作业的 CI/CD 服务器的名称。                              |
| `CI_SERVER_PORT`                                | 12.8          | 全部   | GitLab 实例 URL 的端口，没有主机或协议。例如`8080`.          |
| `CI_SERVER_PROTOCOL`                            | 12.8          | 全部   | GitLab 实例 URL 的协议，没有主机或端口。例如`https`.         |
| `CI_SERVER_REVISION`                            | 全部          | 全部   | 安排作业的 GitLab 修订版。                                   |
| `CI_SERVER_URL`                                 | 12.7          | 全部   | GitLab 实例的基本 URL，包括协议和端口。例如`https://gitlab.example.com:8080`. |
| `CI_SERVER_VERSION_MAJOR`                       | 11.4          | 全部   | GitLab 实例的主要版本。例如，如果 GitLab 版本为`13.6.1`，`CI_SERVER_VERSION_MAJOR`则为`13`. |
| `CI_SERVER_VERSION_MINOR`                       | 11.4          | 全部   | GitLab 实例的次要版本。例如，如果 GitLab 版本为`13.6.1`，`CI_SERVER_VERSION_MINOR`则为`6`. |
| `CI_SERVER_VERSION_PATCH`                       | 11.4          | 全部   | GitLab 实例的补丁版本。例如，如果 GitLab 版本为`13.6.1`，`CI_SERVER_VERSION_PATCH`则为`1`. |
| `CI_SERVER_VERSION`                             | 全部          | 全部   | GitLab 实例的完整版本。                                      |
| `CI_SERVER`                                     | 全部          | 全部   | 可用于 CI/CD 中执行的所有作业。`yes`有空的时候。             |
| `CI_SHARED_ENVIRONMENT`                         | 全部          | 10.1   | 仅当作业在共享环境中执行时才可用（在 CI/CD 调用中持续存在的东西，如`shell`or`ssh`执行器）。`true`有空的时候。 |
| `GITLAB_CI`                                     | 全部          | 全部   | 可用于 CI/CD 中执行的所有作业。`true`有空的时候。            |
| `GITLAB_FEATURES`                               | 10.6          | 全部   | GitLab 实例和许可证可用的许可功能的逗号分隔列表。            |
| `GITLAB_USER_EMAIL`                             | 8.12          | 全部   | 开始作业的用户的电子邮件。                                   |
| `GITLAB_USER_ID`                                | 8.12          | 全部   | 启动作业的用户的 ID。                                        |
| `GITLAB_USER_LOGIN`                             | 10.0          | 全部   | 启动作业的用户的用户名。                                     |
| `GITLAB_USER_NAME`                              | 10.0          | 全部   | 启动作业的用户的名称。                                       |
| `TRIGGER_PAYLOAD`                               | 13.9          | 全部   | Webhook 有效负载。仅在[使用 webhook 触发](https://docs.gitlab.com/ee/ci/triggers/index.html#use-a-webhook-payload)管道时可用。 |

# 普通关键字

今天自己看了这么多关键字，感觉最有用的几个关键字是：

* artifacts，用来配置不同任务之间传递的文件
* rules、when，用来配置在什么时候启用任务，有多种条件的结合
* tags，用来选择不同的runner
* retry，任务执行失败时可以重试，而不是直接结束任务和流水线。
* !reference，用来选择其他位置定义的变量或脚本，类似于锚，但是比锚更灵活。

# gitlab-ci.yml里使用的YAML特性

本来打算今天继续介绍`.gitlab-ci.yml`文件里使用的其他关键字，但是普通的关键字太多，而且一些重要关键字内容都比较长。需要花更多的时间去整理。今天暂时把理解了的一部分内容先放上来。

这篇文章要介绍的是`.gitlab-ci.yml`文件里使用的YAML特性，主要介绍：

* 一些特殊符号的含义
* 锚的含义和使用。

## 特殊符号

在`.gitlab-ci.yml`文件里常用的特殊符号主要有以下几个：

* `&`，用来定义一个锚的名称，具体什么是锚，有什么用，下面第二部分会具体讲解。
* `*`，后面跟上锚的名称，用来引用锚
* `<<`，用于字典合并的，YAML文件的格式和嵌套字典非常类似，一层一层嵌套的键值对。而这个符号就是用来在指定位置插入新的键值对或者嵌套的键值对。因此被称为字典合并。

上面三个符号，除了最后一个以外，前面两个都是和锚相关的，这三个符号都是用来提高`.gitlab-ci.yml`文件里代码的复用性及可读性。降低代码复杂度，让你写出来的`.gitlab-ci.yml`文件更容易理解。

### 锚（anchor）

锚是用来提高代码复用性的，类似于编程语言里的函数。在编程语言里，先把一些常用功能抽象出来，定义成函数。然后在需要使用的位置字节调用函数即可。而锚的作用也是这样，可以把需要执行的脚本先定义好，然后在需要的位置调用即可。定义锚的格式是：`&anchor_name`，调用锚的格式则是`*anchor_name`，就是上面说的两个特殊符号`&`和`*`号的作用，我们来看两个具体示例：

```yaml
.job_template: &job_configuration  # 隐藏定义一个叫做'job_configuration'的锚的内容
  image: ruby:2.6
  services:
    - postgres
    - redis

test1:
  <<: *job_configuration           # 合并 'job_configuration' 别名的内容
  script:
    - test1 project

test2:
  <<: *job_configuration           # 合并 'job_configuration' 别名的内容
  script:
    - test2 project
```

在上面这个示例里不光演示了锚的定义和使用，还定义了字典合并符号`<<`的使用。这里来详细介绍一下。在上面的示例里首先定义了一个隐藏任务模板`.job_template`，所谓的隐藏任务就是在任务名称前面加上一个点号`.`，然后在Gitlab的UI界面就看不到这个任务对应的图标，在实际运行的时候也不会跑这个任务。隐藏任务一般是用来当做模板使用，就像上面例子里的用法。
 隐藏任务定义好以后，在它名称后面使用`&job_configuration`定义一个锚叫做`job_configuration`，它下面的内容就是模板的内容。
 然后在下面的任务test1和test2中，使用字典合并符号`<<:*job_configuration`，表示要在这个位置导入隐藏任务模板里的内容。当正式开始运行以后，解析出来的实际任务是：

```yaml
.job_template:
  image: ruby:2.6
  services:
    - postgres
    - redis

test1:
  image: ruby:2.6
  services:
    - postgres
    - redis
  script:
    - test1 project

test2:
  image: ruby:2.6
  services:
    - postgres
    - redis
  script:
    - test2 project
```

### 表示脚本的锚

锚的另外一个常用方式是，将多个任务里都使用的命令抽出来，定义为锚，然后在任务里通过锚的名称直接调用，看下面的示例：

```yaml
.some-script-before: &some-script-before
  - echo "Execute this script first"

.some-script: &some-script
  - echo "Execute this script second"
  - echo "Execute this script too"

.some-script-after: &some-script-after
  - echo "Execute this script last"

job1:
  before_script:
    - *some-script-before
  script:
    - *some-script
    - echo "Execute something, for this job only"
  after_script:
    - *some-script-after

job2:
  script:
    - *some-script-before
    - *some-script
    - echo "Execute something else, for this job only"
    - *some-script-after
```

在上面的示例中，就是将多个不同位置的脚本都抽出来，定义成锚，然后在下面的任务里直接调用。

#### 用于变量的锚

在Gitlab的官方文档上，锚的最后一种用法是，将多个位置都要使用的同名变量抽出来定义为锚，然后直接调用，给出的示例是：

```yaml
variables: &global-variables
  SAMPLE_VARIABLE: sample_variable_value
  ANOTHER_SAMPLE_VARIABLE: another_sample_variable_value

# a job that must set the GIT_STRATEGY variable, yet depend on global variables
job_no_git_strategy:
  stage: cleanup
  variables:
    <<: *global-variables
    GIT_STRATEGY: none
  script: echo $SAMPLE_VARIABLE
```

但是在这里我感觉它给出的例子非常不恰当，例如下面的代码：

```yaml
variables: 
  SAMPLE_VARIABLE: sample_variable_value
  ANOTHER_SAMPLE_VARIABLE: another_sample_variable_value

# a job that must set the GIT_STRATEGY variable, yet depend on global variables
job_no_git_strategy:
  stage: cleanup
  variables:
    GIT_STRATEGY: none
  script: echo $SAMPLE_VARIABLE
```

在这里我不需要直接定义锚，也可以直接使用`variables`关键字实现变量`GIT_STRATEGY`的定义。也可以直接通过`$SAMPLE_VARIABLE`实现对全局变量`SAMPLE_VARIABLE`的调用。目前还没看出这两种方式的区别，如果后面验证了这两个位置的区别，再来更新这部分的文档。

以上就是今天弄懂的一些东西

# cache缓存和artifacts工件

缓存是任务下载和保存的一个或多个文件，随后的任务可以直接使用这部分文件，用以加快执行速度。而工件也是任务执行过程中保存下来的文件。

## 缓存和工件的区别

缓存一般是用于依赖，像从网上下载下来的依赖包。缓存一般是存储在runner所在的机器上（如果是容器方式，则会新开一个容器，专门用来存放缓存数据），如果开启了分布式缓存技术，还能够存放到s3存储上。

而工件则一般是用来保存不同阶段构建时生成的一些中间文件，是由任务生成，保存在gitlab所在主机上，可以在gitlab页面的GUI 流水线里下载。（保存在什么位置还不知道）

缓存和工件都会定义相对于项目根目录的文件路径，并且都不能链接到项目外部的文件。

## 缓存的保存位置

所有任务里里定义的缓存都打包到一个`cache.zip`文件里。runner配置会定义在哪里存储这个文件。默认情况下，缓存是存储在runner安装机器上，而位置也会根据执行器（executor）的不同而不同，具体的情况如下所示：

| runner执行器类型                      | 缓存的路径                                                   |
| ------------------------------------- | ------------------------------------------------------------ |
| shell（linux主机类型）                | 本地目录，在gitlab-runner用户的家目录：`/home/gitlab-runner/cache/<user>/<project>/<cache-key>/cache.zip.` |
| Docker （容器类型）                   | Docker卷下，路径是：`/var/lib/docker/volumes/<volume-id>/_data/<user>/<project>/<cache-key>/cache.zip` |
| Docker主机（自动扩展runner，例如k8s） | 和Docker一样                                                 |

如果缓存和工件都使用了同一个目录，那么缓存可能会覆盖工件的内容，因为缓存更先存储。

## 缓存打包和解压是怎么执行的？

下面是两个不同阶段的任务示例：

```bash
stages:
  - build
  - test

before_script:
  - echo "Hello"

job A:
  stage: build
  script:
    - mkdir vendor/
    - echo "build" > vendor/hello.txt
  cache:
    key: build-cache
    paths:
      - vendor/
  after_script:
    - echo "World"

job B:
  stage: test
  script:
    - cat vendor/hello.txt
  cache:
    key: build-cache
    paths:
      - vendor/
```

如果在一个机器上安装了一个runner，那么你项目里的所有任务都会运行在相同的主机上，任务执行流程是：

1. 流水线执行
2. `job A`开始运行
3. 执行`before_script`脚本
4. 执行`script`脚本
5. 执行`after_script`脚本
6. `cache`部分运行，`vendor/`目录会被打包压缩到`cache.zip`，这个文件然后会被保存到上面说到的目录下（根据执行器和`cache: key`的不同而不同）
7. `job B`运行
8. 缓存解压（如果根据`cache: key`在对应目录下找到了）
9. `before_script`脚本执行
10. `script`脚本执行
11. 流水线结束。

## 缓存的清除

Runner会使用缓存来加速任务的执行，因为它可以复用数据，但是有时候会导致一些不一致的问题，因此需要清除缓存。有两种方式：

### 1. 修改cache:key来清除缓存

在.gitlab-ci.yml文件里修改cache: key的值，下一次流水线运行时，缓存就会存储在不同的位置（旧的缓存是否会被清除，待验证）

### 2. 手动清除缓存

在Gitlab的web界面，按下面流程执行：

* 在顶部，选择Menu->Projects，找到你的项目
* 在左侧边栏，点击CI/CD->Pipelines页
* 在右上方，点击Clear runner caches

下一次提交代码的时候，你的CI/CD任务会使用一个新的缓存。
