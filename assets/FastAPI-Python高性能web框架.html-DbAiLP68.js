import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{aj as a,ao as e,am as i}from"./app-BTliMZdR.js";const l="/assets/2ab113f5bbfc49a9befae75e5d06fa08tplv-k3u1fbpfcp-zoom-in-crop-mark4536000-DL-T3p8X.webp",p="/assets/6474dac09c9f4e9584cb52f4369659dftplv-k3u1fbpfcp-zoom-in-crop-mark4536000-tDlWiIIW.webp",d="/assets/0093421e41164cadaa99f7c6cff38cdbtplv-k3u1fbpfcp-zoom-in-crop-mark4536000-BrBNZBVX.webp",t="/assets/79962ef2cd624404a0561097cf39a7c2tplv-k3u1fbpfcp-zoom-in-crop-mark4536000-NiPGYkVG.webp",c="/assets/8271350760154f89bf6bf126de2a5b85tplv-k3u1fbpfcp-zoom-in-crop-mark4536000-CQ55zda9.webp",r={};function u(v,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="fastapi-python高性能web框架" tabindex="-1"><a class="header-anchor" href="#fastapi-python高性能web框架"><span>FastAPI--python高性能web框架</span></a></h1><blockquote><p>https://github.com/Paper-Dragon/learn-fastapi</p><p>https://www.bilibili.com/video/BV1iN411X72b</p></blockquote><h2 id="第2章-fastapi介绍和项目准备" tabindex="-1"><a class="header-anchor" href="#第2章-fastapi介绍和项目准备"><span>第2章 FastAPI介绍和项目准备</span></a></h2><h3 id="_2-1-starlette-pydantic-与-fastapi-框架是什么关系" tabindex="-1"><a class="header-anchor" href="#_2-1-starlette-pydantic-与-fastapi-框架是什么关系"><span>2.1 Starlette，Pydantic 与 FastAPI 框架是什么关系？</span></a></h3><p>python的类型提示，基于类型提示type hints</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>from typing import List</span></span>
<span class="line"><span>def func(name:str,age:int,l:List):</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    print(name,age)</span></span>
<span class="line"><span>    print(l)    </span></span>
<span class="line"><span># Python的类型提示使用方法，使用的好能够提高代码的健壮性</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Pydantic是一个基于Python类型提示来定义数据验证，序列化和文档（使用JSON模式）库</p><p>Starlette是一个轻量级的ASGI框架/工具包，是构建高性能Asyncio服务的理想选择</p><figure><img src="`+l+`" alt="image-20210202092756107" tabindex="0" loading="lazy"><figcaption>image-20210202092756107</figcaption></figure><p>安装环境，python环境必须是3.6以上的，然后去github中将<a href="https://github.com/liaogx/fastapi-tutorial" target="_blank" rel="noopener noreferrer">github.com/liaogx/fastapi-tutorial</a> 拷贝下来，安装reqiurements.txt里面的包</p><p>一定要注意版本的兼容性</p><h3 id="_2-2-pydantic基础教程" tabindex="-1"><a class="header-anchor" href="#_2-2-pydantic基础教程"><span>2.2 Pydantic基础教程</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>Data validation and settings management using python type annotations.</span></span>
<span class="line"><span>使用Python的类型注解来进行数据校验和settings管理</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pydantic enforces type hints at runtime, and provides user friendly errors when data is invalid.</span></span>
<span class="line"><span>Pydantic可以在代码运行时提供类型提示，数据校验失败时提供友好的错误提示</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Define how data should be in pure, canonical python; validate it with pydantic.</span></span>
<span class="line"><span>定义数据应该如何在纯规范的Python代码中保存，并用Pydantic验证它</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from typing import List</span></span>
<span class="line"><span>from datetime import datetime</span></span>
<span class="line"><span>from pydantic import BaseModel</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 如果类的属性中有默认值是选填，没有默认值就是必填的</span></span>
<span class="line"><span>class User(BaseModel):</span></span>
<span class="line"><span>    id = int</span></span>
<span class="line"><span>    name: str = &quot;andy&quot;</span></span>
<span class="line"><span>    signup_list: datetime</span></span>
<span class="line"><span>    friends: List[int] = []</span></span>
<span class="line"><span></span></span>
<span class="line"><span>external_data = {</span></span>
<span class="line"><span>    &quot;id&quot;: 1,</span></span>
<span class="line"><span>    &quot;signup_list&quot;: &quot;2021-02-02 10:10&quot;,</span></span>
<span class="line"><span>    &quot;friends&quot;:[1, 2, &quot;3&quot;]</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>user = User(**external_data)</span></span>
<span class="line"><span>print(user.name)</span></span>
<span class="line"><span>print(user.friends)</span></span>
<span class="line"><span>print(repr(user.signup_list))</span></span>
<span class="line"><span>print(user.dict())  # 以字典的格式输出</span></span>
<span class="line"><span>print(user.json())  # 以json的格式输出</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># class People(User):</span></span>
<span class="line"><span>#     def start(self):</span></span>
<span class="line"><span>#         print(f&quot;我的名字{self.name}&quot;)</span></span>
<span class="line"><span>#     def friend(self):</span></span>
<span class="line"><span>#         print(f&quot;我的朋友们{str(self.friends)}&quot;)</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># people = People(**external_data)</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># people.start()</span></span>
<span class="line"><span># people.friend()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>pycharm安装pydantic插件</strong> <img src="`+p+`" alt=" image-20210202100216847 " loading="lazy"></p><p><strong>校验失败的处理</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span># 校验失败的处理</span></span>
<span class="line"><span>try:</span></span>
<span class="line"><span>    User(id=1,signup_list=datetime.today(),friends=[1,2,&#39;hello world&#39;])</span></span>
<span class="line"><span>except ValidationError as e:</span></span>
<span class="line"><span>    print(e.json())</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>打印的结果</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>[</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    &quot;loc&quot;: [</span></span>
<span class="line"><span>      &quot;friends&quot;,</span></span>
<span class="line"><span>      2</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>    &quot;msg&quot;: &quot;value is not a valid integer&quot;,</span></span>
<span class="line"><span>    &quot;type&quot;: &quot;type_error.integer&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>模型类的属性和方法</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>print(user.dict())</span></span>
<span class="line"><span>print(user.json())</span></span>
<span class="line"><span>print(user.copy())  # 这里是浅拷贝</span></span>
<span class="line"><span>print(User.parse_obj(external_data))</span></span>
<span class="line"><span>print(User.parse_raw(&#39;{&quot;id&quot;: &quot;123&quot;, &quot;signup_ts&quot;: &quot;2020-12-22 12:22&quot;, &quot;friends&quot;: [1, 2, &quot;3&quot;]}&#39;))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>path = Path(&#39;pydantic_tutorial.json&#39;)</span></span>
<span class="line"><span>path.write_text(&#39;{&quot;id&quot;: &quot;123&quot;, &quot;signup_ts&quot;: &quot;2020-12-22 12:22&quot;, &quot;friends&quot;: [1, 2, &quot;3&quot;]}&#39;)</span></span>
<span class="line"><span>print(User.parse_file(path))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(user.schema())</span></span>
<span class="line"><span>print(user.schema_json())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>user_data = {&quot;id&quot;: &quot;error&quot;, &quot;signup_ts&quot;: &quot;2020-12-22 12 22&quot;, &quot;friends&quot;: [1, 2, 3]}  # id是字符串 是错误的</span></span>
<span class="line"><span>print(User.construct(**user_data))  # 不检验数据直接创建模型类，不建议在construct方法中传入未经验证的数据</span></span>
<span class="line"><span></span></span>
<span class="line"><span>print(User.__fields__.keys())  # 定义模型类的时候，所有字段都注明类型，字段顺序就不会乱</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>递归模型</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>class Sound(BaseModel):</span></span>
<span class="line"><span>    sound: str</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Dog(BaseModel):</span></span>
<span class="line"><span>    birthday: date</span></span>
<span class="line"><span>    weight: float = Optional[None]</span></span>
<span class="line"><span>    sound: List[Sound]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>dogs = Dog(birthday=date.today(),weight=9.99,sound=[{&quot;sound&quot;:&quot;wang wang~&quot;},{&quot;sound&quot;: &quot;ying ying ~&quot;}])</span></span>
<span class="line"><span>print(dogs.json())</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行结果</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>{&quot;birthday&quot;: &quot;2021-02-02&quot;, &quot;sound&quot;: [{&quot;sound&quot;: &quot;wang wang~&quot;}, {&quot;sound&quot;: &quot;ying ying ~&quot;}]}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>ORM模型，从类实例创建符合ORM对象的模型</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>from sqlalchemy.dialects.postgresql import ARRAY</span></span>
<span class="line"><span>from sqlalchemy.ext.declarative import declarative_base</span></span>
<span class="line"><span>from sqlalchemy import Integer, String, Column</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Base = declarative_base()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class CompanyOrm(Base):</span></span>
<span class="line"><span>    __tablename__ = &#39;companies&#39;</span></span>
<span class="line"><span>    id =Column(Integer, primary_key=True, nullable=True)</span></span>
<span class="line"><span>    public_key = Column(String(20), index=True, nullable=False, unique=True)</span></span>
<span class="line"><span>    name = Column(String(100), unique=True)</span></span>
<span class="line"><span>    domains = Column(ARRAY(String(255)))</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class CompanyModel(BaseModel):</span></span>
<span class="line"><span>    id: int</span></span>
<span class="line"><span>    public_key: constr(max_length=20)</span></span>
<span class="line"><span>    name: constr(max_length=100)</span></span>
<span class="line"><span>    domains: List[constr(max_length=255)]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    class Config:</span></span>
<span class="line"><span>        orm_mode = True</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>co_orm = CompanyOrm(</span></span>
<span class="line"><span>    id=1,</span></span>
<span class="line"><span>    public_key=&quot;akey&quot;,</span></span>
<span class="line"><span>    name=&quot;andy&quot;,</span></span>
<span class="line"><span>    domains=[&#39;123.com&#39;, &#39;456.com&#39;]</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>print(CompanyModel.from_orm(co_orm))</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第3章-请求参数和验证" tabindex="-1"><a class="header-anchor" href="#第3章-请求参数和验证"><span>第3章：请求参数和验证</span></a></h2><h3 id="_3-1fastapi的简单使用" tabindex="-1"><a class="header-anchor" href="#_3-1fastapi的简单使用"><span>3.1fastapi的简单使用</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>from typing import Optional</span></span>
<span class="line"><span>from fastapi import FastAPI</span></span>
<span class="line"><span>from pydantic import BaseModel</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app = FastAPI()</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class People(BaseModel):</span></span>
<span class="line"><span>    id: int</span></span>
<span class="line"><span>    name: str</span></span>
<span class="line"><span>    addr: Optional[str] = None</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app.get(&#39;/&#39;)</span></span>
<span class="line"><span>async def person():</span></span>
<span class="line"><span>    return {&quot;name&quot;: &quot;hello world&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app.get(&#39;/city/{city}&#39;)</span></span>
<span class="line"><span>async def result(city: str, query_str: Optional[str] = None):</span></span>
<span class="line"><span>    return {&#39;city&#39;: city, &#39;query_str&#39;: query_str}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app.post(&#39;/person/{person}&#39;)</span></span>
<span class="line"><span>async def result(person: str, city_info: People):</span></span>
<span class="line"><span>    return {&quot;person&quot;: person, &quot;id&quot;: city_info.id, &#39;name&#39;: city_info.name, &#39;addr&#39;: city_info.addr}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 项目的启动</span></span>
<span class="line"><span>uvicorn 文件名:app --reload</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 接口文档的生成</span></span>
<span class="line"><span>localhost:8000/docs</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 展示接口的接口</span></span>
<span class="line"><span>localhost:8000/redoc</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-fastapi的结构" tabindex="-1"><a class="header-anchor" href="#_3-2-fastapi的结构"><span>3.2 fastApi的结构</span></a></h3><p>首先创建一个文件包，用于存放各个app <img src="`+d+`" alt=" image-20210202145110225" loading="lazy"></p><p>然后再<strong>chapter03.py</strong>中实现</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>from enum import Enum</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from fastapi import APIRouter</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app03 = APIRouter()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其他app一样的操作</p><p>在<em><strong>inif</strong>.py</em>文件中</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>from .chapter03 import app03</span></span>
<span class="line"><span>from .chapter04 import app04</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在run.py文件中</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>import uvicorn</span></span>
<span class="line"><span>from fastapi import FastAPI</span></span>
<span class="line"><span>from tutorial import app03</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app = FastAPI()</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 将app的子应用集成进来</span></span>
<span class="line"><span>app.include_router(app03, prefix=&#39;/chapter03&#39;, tags=[&#39;第三章，请求参数和验证&#39;])</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &#39;__main__&#39;:</span></span>
<span class="line"><span>    uvicorn.run(&#39;run:app&#39;,host=&#39;0.0.0.0&#39;,port=8000,reload=True,debug=True,workers=1)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from enum import Enum</span></span>
<span class="line"><span>from typing import Optional, List</span></span>
<span class="line"><span>from fastapi import APIRouter, Query, Cookie, Header</span></span>
<span class="line"><span>from pydantic import BaseModel, Field</span></span>
<span class="line"><span>from datetime import date</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app03 = APIRouter()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;Path Parameters and Number Validations 路径参数和数字验证&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app03.get(&#39;/path/parameters&#39;)</span></span>
<span class="line"><span>def path_params01():</span></span>
<span class="line"><span>    return {&quot;message&quot;: &quot;This is a message&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app03.get(&#39;/path/{parameters}&#39;)</span></span>
<span class="line"><span>def path_parameters02(parameters: str):</span></span>
<span class="line"><span>    return {&quot;message&quot;: parameters}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 枚举</span></span>
<span class="line"><span>class CityName(str, Enum):</span></span>
<span class="line"><span>    Beijing = &quot;Beijing china&quot;</span></span>
<span class="line"><span>    Shanghai = &quot;Shanghai china&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app03.get(&#39;/enum/{city}&#39;)</span></span>
<span class="line"><span>async def latest(city: CityName):</span></span>
<span class="line"><span>    if city == CityName.Shanghai:</span></span>
<span class="line"><span>        return {&quot;city_name&quot;: city, &quot;confirmed&quot;: 1492, &quot;death&quot;: 7}</span></span>
<span class="line"><span>    elif city == CityName.Beijing:</span></span>
<span class="line"><span>        return {&#39;city_name&#39;: city, &quot;confirmed&quot;: 971, &quot;death&quot;: 9}</span></span>
<span class="line"><span>    return {&quot;city_name&quot;: city, &#39;latest&#39;: &quot;unknown&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app03.get(&#39;/files/{filepath:path}&#39;)</span></span>
<span class="line"><span>def filepath(filepath: str):</span></span>
<span class="line"><span>    return f&quot;This file path is {filepath}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;Query Parameters and String Validations 查询参数和字符串验证&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app03.get(&#39;/query&#39;)</span></span>
<span class="line"><span>def page_limit(page: int = 1, limit: Optional[int] = None):</span></span>
<span class="line"><span>    if limit:</span></span>
<span class="line"><span>        return {&#39;page&#39;: page, &#39;limit&#39;: limit}</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        return {&quot;page&quot;: page}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app03.get(&#39;/query/bool/conversion&#39;)  # bool类型转换：yes on 1 True true会转换成true, 其它为false</span></span>
<span class="line"><span>def query_params_validate(query: bool = False):</span></span>
<span class="line"><span>    return f&quot;返回的数据是{query}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app03.get(&quot;/query/validations&quot;)</span></span>
<span class="line"><span>def query_params_validate(</span></span>
<span class="line"><span>        value: str = Query(..., min_length=8, max_length=16, regex=&quot;^a&quot;),</span></span>
<span class="line"><span>        values: List[str] = Query([&#39;V1&#39;, &#39;V2&#39;], alias=&quot;alias_name&quot;)</span></span>
<span class="line"><span>):</span></span>
<span class="line"><span>    return value, values</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;Request Body and Fields 请求体和字段&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class CityInfo(BaseModel):</span></span>
<span class="line"><span>    name: str = Field(..., example=&quot;Beijing&quot;)  # example是注解的作用，值不会被验证</span></span>
<span class="line"><span>    country: str</span></span>
<span class="line"><span>    country_code: str = None  # 给一个默认值</span></span>
<span class="line"><span>    country_population: int = Field(default=800, title=&quot;人口数量&quot;, description=&quot;国家的人口数量&quot;, ge=800)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    class Config:</span></span>
<span class="line"><span>        schema_extra = {</span></span>
<span class="line"><span>            &quot;example&quot;: {</span></span>
<span class="line"><span>                &quot;name&quot;: &quot;Shanghai&quot;,</span></span>
<span class="line"><span>                &quot;country&quot;: &quot;China&quot;,</span></span>
<span class="line"><span>                &quot;country_code&quot;: &quot;CN&quot;,</span></span>
<span class="line"><span>                &quot;country_population&quot;: 1400000000,</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app03.post(&quot;/request_body/city&quot;)</span></span>
<span class="line"><span>def city_info(city: CityInfo):</span></span>
<span class="line"><span>    print(city.name, city.country)  # 当在IDE中输入city.的时候，属性会自动弹出</span></span>
<span class="line"><span>    return city.dict()</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;Request Body - Nested Nodels 数据格式嵌套的请求体&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Data(BaseModel):</span></span>
<span class="line"><span>    city: List[CityInfo] = None</span></span>
<span class="line"><span>    date: date</span></span>
<span class="line"><span>    confirmed: int = Field(ge=0, description=&quot;确诊数&quot;, default=0)</span></span>
<span class="line"><span>    deaths: int = Field(ge=0, description=&quot;死亡数&quot;, default=0)</span></span>
<span class="line"><span>    recovered: int = Field(ge=0, description=&quot;痊愈数&quot;, default=0)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app03.put(&#39;/request_body/nested&#39;)</span></span>
<span class="line"><span>def nested_models(data: Data):</span></span>
<span class="line"><span>    return data</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;如何设置Cookie和Header参数&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app03.get(&quot;/cookie&quot;)  # 这个只能用postman测试，在Header中添加Cookie = cookie_id=xxx</span></span>
<span class="line"><span># 定义Cookie参数需要使用Cookie类，否则就是查询参数</span></span>
<span class="line"><span>def cookie(cookie_id: Optional[str] = Cookie(None)):</span></span>
<span class="line"><span>    return cookie_id</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app03.get(&quot;/header&quot;)</span></span>
<span class="line"><span>def header(user_agent: Optional[str] = Header(None, convert_underscores=True), x_token: List[str] = Header(None)):</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    有些HTTP代理和服务器是不允许在请求头中带有下划线的，所以Header提供convert_underscores属性让设置</span></span>
<span class="line"><span>    :param user_agent: convert_underscores=True 会把 user_agent 变成 user-agent</span></span>
<span class="line"><span>    :param x_token: x_token是包含多个值的列表</span></span>
<span class="line"><span>    :return:</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    return {&quot;User-Agent&quot;: user_agent, &quot;x-Token&quot;: x_token}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查询参数总的数据格式校验使用Query--from fastapi import Query</p><p>请求体中的参数校验使用Field---from pydantic import Field</p><p><strong>使用pandtic来定义请求体数据的时候使用Filed类,</strong></p><p><strong>使用路径参数的时候对数据进行校验使用Path类，</strong></p><p><strong>对查询参数进行校验的时候使用Query类</strong></p><h2 id="第4章-响应处理和fastapi配置" tabindex="-1"><a class="header-anchor" href="#第4章-响应处理和fastapi配置"><span>第4章 响应处理和FastAPI配置</span></a></h2><h3 id="_4-1响应模型示例精讲" tabindex="-1"><a class="header-anchor" href="#_4-1响应模型示例精讲"><span>4-1响应模型示例精讲</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>from fastapi import BaseModel</span></span>
<span class="line"><span>from pydantic import EmailStr</span></span>
<span class="line"><span>from typing import Option,List</span></span>
<span class="line"><span>&quot;&quot;&quot;4.1 Reponse Model响应模型&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class UserIn(BaseModel):</span></span>
<span class="line"><span>    username: str</span></span>
<span class="line"><span>    password: str</span></span>
<span class="line"><span>    email: EmailStr</span></span>
<span class="line"><span>    mobile: str = &#39;110&#39;</span></span>
<span class="line"><span>    address: str = None</span></span>
<span class="line"><span>    full_name: Optional[str] = None</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class UserOut(BaseModel):</span></span>
<span class="line"><span>    username: str</span></span>
<span class="line"><span>    email: EmailStr</span></span>
<span class="line"><span>    mobile: str = &#39;110&#39;</span></span>
<span class="line"><span>    address: str = None</span></span>
<span class="line"><span>    full_name: Optional[str] = None</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>users = {</span></span>
<span class="line"><span>    &quot;user01&quot;: {&quot;username&quot;: &quot;user01&quot;, &quot;password&quot;: &quot;123123&quot;, &quot;email&quot;: &quot;user01@example.com&quot;},</span></span>
<span class="line"><span>    &quot;user02&quot;: {&quot;username&quot;: &quot;user02&quot;, &quot;password&quot;: &quot;123456&quot;, &quot;email&quot;: &quot;user02@example.com&quot;, &quot;mobile&quot;: &quot;110&quot;}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app04.post(&quot;/response_model&quot;, response_model=UserOut, response_model_exclude_unset=True)</span></span>
<span class="line"><span>async def response_model(user: UserIn):</span></span>
<span class="line"><span>    &quot;&quot;&quot;response_model_exclude_unset=True表示默认值不包含在响应中，仅包含实际给的值，如果实际给的值与默认值相同也会包含在响应中&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    print(user.password)</span></span>
<span class="line"><span>    return users[&quot;user02&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app04.post(</span></span>
<span class="line"><span>    &quot;/response_model/attributes&quot;,</span></span>
<span class="line"><span>    response_model=UserOut,  # 指定模型类</span></span>
<span class="line"><span>    # response_model=Union[UserIn, UserOut],  # 联合两个模型类</span></span>
<span class="line"><span>    # response_model=List[UserOut],  # 返回结果是一个列表，返回结果包含多个响应模型</span></span>
<span class="line"><span>    response_model_include=[&quot;username&quot;, &quot;email&quot;, &quot;mobile&quot;],  # 包含哪些字段</span></span>
<span class="line"><span>    response_model_exclude=[&quot;mobile&quot;]  # 过滤掉哪些字段</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>async def response_model_attributes(user: UserIn):</span></span>
<span class="line"><span>    &quot;&quot;&quot;response_model_include列出需要在返回结果中包含的字段；response_model_exclude列出需要在返回结果中排除的字段&quot;&quot;&quot;</span></span>
<span class="line"><span>    # del user.password  # Union[UserIn, UserOut]后，删除password属性也能返回成功</span></span>
<span class="line"><span>    return user</span></span>
<span class="line"><span>    # return [user, user]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2响应状态码和快捷属性" tabindex="-1"><a class="header-anchor" href="#_4-2响应状态码和快捷属性"><span>4.2响应状态码和快捷属性</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>from fastapi import status</span></span>
<span class="line"><span>&quot;&quot;&quot;Response Status Code 响应状态码&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> </span></span>
<span class="line"><span>@app04.post(&quot;/status_code&quot;, status_code=200)</span></span>
<span class="line"><span>async def status_code():</span></span>
<span class="line"><span>    return {&quot;status_code&quot;: 200}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app04.post(&quot;/status_attribute&quot;, status_code=status.HTTP_200_OK)</span></span>
<span class="line"><span>async def status_attribute():</span></span>
<span class="line"><span>    print(type(status.HTTP_200_OK))</span></span>
<span class="line"><span>    return {&quot;status_code&quot;: status.HTTP_200_OK}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3表单数据处理" tabindex="-1"><a class="header-anchor" href="#_4-3表单数据处理"><span>4.3表单数据处理</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>from fastapi import Form, File, UploadFile</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;Form Data 表单数据处理&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app04.post(&quot;/login/&quot;)</span></span>
<span class="line"><span>async def login(username: str = Form(...), password: str = Form(...)):  # 定义表单参数</span></span>
<span class="line"><span>    &quot;&quot;&quot;用Form类需要pip install python-multipart; Form类的元数据和校验方法类似Body/Query/Path/Cookie&quot;&quot;&quot;</span></span>
<span class="line"><span>    return {&quot;username&quot;: username}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;Request Files 单文件、多文件上传及参数详解&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app04.post(&quot;/file&quot;)</span></span>
<span class="line"><span>async def file_(file: bytes = File(...)):  # 如果要上传多个文件 files: List[bytes] = File(...)</span></span>
<span class="line"><span>    &quot;&quot;&quot;使用File类 文件内容会以bytes的形式读入内存 适合于上传小文件&quot;&quot;&quot;</span></span>
<span class="line"><span>    return {&quot;file_size&quot;: len(file)}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app04.post(&quot;/upload_files&quot;)</span></span>
<span class="line"><span>async def upload_files(files: List[UploadFile] = File(...)):  # 如果要上传单个文件 file: UploadFile = File(...)</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    使用UploadFile类的优势:</span></span>
<span class="line"><span>    1.文件存储在内存中，使用的内存达到阈值后，将被保存在磁盘中</span></span>
<span class="line"><span>    2.适合于图片、视频大文件</span></span>
<span class="line"><span>    3.可以获取上传的文件的元数据，如文件名，创建时间等</span></span>
<span class="line"><span>    4.有文件对象的异步接口</span></span>
<span class="line"><span>    5.上传的文件是Python文件对象，可以使用write(), read(), seek(), close()操作</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    for file in files:</span></span>
<span class="line"><span>        contents = await file.read()</span></span>
<span class="line"><span>        print(contents)</span></span>
<span class="line"><span>    return {&quot;filename&quot;: files[0].filename, &quot;content_type&quot;: files[0].content_type}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-fastapi项目的静态文件配置" tabindex="-1"><a class="header-anchor" href="#_4-4-fastapi项目的静态文件配置"><span>4.4 FastAPI项目的静态文件配置</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span># 在run.py中</span></span>
<span class="line"><span>from fastapi.staticfiles import StaticFiles</span></span>
<span class="line"><span># mount表示将某个目录下一个完全独立的应用挂载过来，这个不会在API交互文档中显示</span></span>
<span class="line"><span>app.mount(path=&#39;corona/static&#39;,app=StaticFiles(directory=&#39;./corona/statuic&#39;),name=&quot;static&quot;)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-fastapi项目的静态文件配置-1" tabindex="-1"><a class="header-anchor" href="#_4-4-fastapi项目的静态文件配置-1"><span>4.4 FastAPI项目的静态文件配置</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span># 在run.py中</span></span>
<span class="line"><span>from fastapi.staticfiles import StaticFiles</span></span>
<span class="line"><span># mount表示将某个目录下一个完全独立的应用挂载过来，这个不会在API交互文档中显示</span></span>
<span class="line"><span>app.mount(path=&#39;static&#39;,app=StaticFiles(directory=&#39;./corona/statuic&#39;),name=&quot;static&quot;)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-5-路径操作配置" tabindex="-1"><a class="header-anchor" href="#_4-5-路径操作配置"><span>4.5 路径操作配置</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>@app04.post(</span></span>
<span class="line"><span>    &quot;/path_operation_configuration&quot;,</span></span>
<span class="line"><span>    response_model=UserOut,  # 指定响应模型</span></span>
<span class="line"><span>    # tags=[&quot;Path&quot;, &quot;Operation&quot;, &quot;Configuration&quot;],</span></span>
<span class="line"><span>    summary=&quot;This is summary&quot;,  </span></span>
<span class="line"><span>    description=&quot;This is description&quot;,</span></span>
<span class="line"><span>    response_description=&quot;This is response description&quot;,</span></span>
<span class="line"><span>    deprecated=True,  # 表示该接口是否可用</span></span>
<span class="line"><span>    status_code=status.HTTP_200_OK  # 状态码</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>async def path_operation_configuration(user: UserIn):</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    Path Operation Configuration 路径操作配置</span></span>
<span class="line"><span>    :param user: 用户信息</span></span>
<span class="line"><span>    :return: 返回结果</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    return user.dict()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-6-fastapi-应用的常见配置项" tabindex="-1"><a class="header-anchor" href="#_4-6-fastapi-应用的常见配置项"><span>4.6 FastAPI 应用的常见配置项</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span># run.py</span></span>
<span class="line"><span>app = FastAPI(</span></span>
<span class="line"><span>    title=&#39;FastAPI Tutorial and Coronavirus Tracker API Docs&#39;,</span></span>
<span class="line"><span>    description=&#39;FastAPI教程 新冠病毒疫情跟踪器API接口文档，项目代码：https://github.com/liaogx/fastapi-tutorial&#39;,</span></span>
<span class="line"><span>    version=&#39;1.0.0&#39;,</span></span>
<span class="line"><span>    docs_url=&#39;/docs&#39;,</span></span>
<span class="line"><span>    redoc_url=&#39;/redocs&#39;,</span></span>
<span class="line"><span>)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4.7 fastapi的异常处理</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>from fastapi.exceptions import RequestValidationError</span></span>
<span class="line"><span>from fastapi.responses import PlainTextResponse</span></span>
<span class="line"><span>from starlette.exceptions import HTTPException as StarletteHTTPException</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app04.get(&quot;/http_exception&quot;)</span></span>
<span class="line"><span>async def http_exception(city: str):</span></span>
<span class="line"><span>    if city != &quot;Beijing&quot;:</span></span>
<span class="line"><span>        raise HTTPException(status_code=404, detail=&quot;City not found!&quot;, headers={&quot;X-Error&quot;: &quot;Error&quot;})</span></span>
<span class="line"><span>    return {&quot;city&quot;: city}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app04.get(&quot;/http_exception/{city_id}&quot;)</span></span>
<span class="line"><span>async def override_http_exception(city_id: int):</span></span>
<span class="line"><span>    if city_id == 1:</span></span>
<span class="line"><span>        raise HTTPException(status_code=418, detail=&quot;Nope! I don&#39;t like 1.&quot;)</span></span>
<span class="line"><span>    return {&quot;city_id&quot;: city_id}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第5章-fastapi的依赖注入系统" tabindex="-1"><a class="header-anchor" href="#第5章-fastapi的依赖注入系统"><span>第5章：FastAPI的依赖注入系统</span></a></h2><h3 id="_5-1-依赖注入系统介绍和使用场景" tabindex="-1"><a class="header-anchor" href="#_5-1-依赖注入系统介绍和使用场景"><span>5.1 依赖注入系统介绍和使用场景</span></a></h3><p>”依赖注入“是指在编程中，为保证代码成功运行，先导入或声明其所需要的的“依赖”，如子函数，数据库连接等</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>1 提高代码的复用率</span></span>
<span class="line"><span>2 共享数据库链接</span></span>
<span class="line"><span>3 增强安全，认证和角色管理</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>FastAPI的兼容性</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>1 所有的关系型数据库，支撑NoSQL数据库</span></span>
<span class="line"><span>2 第三方的包和API</span></span>
<span class="line"><span>3 认证和授权系统</span></span>
<span class="line"><span>4 响应数据注入系统</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-创建-导入和声明依赖" tabindex="-1"><a class="header-anchor" href="#_5-2-创建-导入和声明依赖"><span>5.2 创建，导入和声明依赖</span></a></h3><p>我们在Django或者Flask中对于参数的传递使用继承的方式，在FastAPI中我们可以使用声明依赖的方式</p><p>函数作为依赖</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;Dependencies 创建 ，导入和声明依赖&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def common_parameters(q: Optional[str] = None, page: int = 1, limit: int = 100):</span></span>
<span class="line"><span>    return {&quot;q&quot;: 1, &quot;page&quot;: page, &quot;limit&quot;: limit}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 可以在async def中调用def依赖，也可以在def中导入async def依赖</span></span>
<span class="line"><span>@app05.get(&#39;/dependency01&#39;)</span></span>
<span class="line"><span>async def dependency01(commons: dict = Depends(common_parameters)):</span></span>
<span class="line"><span>    return commons</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app05.get(&#39;/dependency02&#39;)</span></span>
<span class="line"><span>def dependency02(commons: dict = Depends(common_parameters)):</span></span>
<span class="line"><span>    return commons</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-如何将类作为依赖性" tabindex="-1"><a class="header-anchor" href="#_5-3-如何将类作为依赖性"><span>5.3 如何将类作为依赖性</span></a></h3><p>类作为依赖</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>fake_itmes_db = [{&quot;item_name&quot;: &quot;Foo&quot;}, {&quot;item_name&quot;: &quot;Bar&quot;}, {&quot;item_name&quot;: &quot;Baz&quot;}, {&quot;item_name&quot;: &quot;Andy&quot;}]</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class CommonQueryParams:</span></span>
<span class="line"><span>    def __init__(self, q: Optional[str] = None, page: int = 1, limit: int = 100):</span></span>
<span class="line"><span>        self.q = q</span></span>
<span class="line"><span>        self.page = page</span></span>
<span class="line"><span>        self.limit = limit</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app05.get(&#39;/classes_as_dependencies&#39;)</span></span>
<span class="line"><span>async def classes_as_dependencies(commons=Depends(CommonQueryParams)):</span></span>
<span class="line"><span>    response = {}</span></span>
<span class="line"><span>    if commons.q:</span></span>
<span class="line"><span>        response.update({&quot;q&quot;: commons.q})</span></span>
<span class="line"><span>    itmes = fake_itmes_db[commons.page:commons.limit]</span></span>
<span class="line"><span>    response.update({&#39;items&#39;: itmes})</span></span>
<span class="line"><span>    return response</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-自已来的创建和调用" tabindex="-1"><a class="header-anchor" href="#_5-4-自已来的创建和调用"><span>5.4 自已来的创建和调用</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>def query(q: Optional[str] = None):</span></span>
<span class="line"><span>    return q</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def sub_query(q: str = Depends(query), last_query: Optional[str] = None):</span></span>
<span class="line"><span>    if not q:</span></span>
<span class="line"><span>        return last_query</span></span>
<span class="line"><span>    return q</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app05.get(&quot;/sub_dependency&quot;)</span></span>
<span class="line"><span>async def sub_dependency(final_query: str = Depends(sub_query, use_cache=True)):</span></span>
<span class="line"><span>    &quot;&quot;&quot;use_cache默认是True, 表示当多个依赖有一个共同的子依赖时，每次request请求只会调用子依赖一次，多次调用将从缓存中获取&quot;&quot;&quot;</span></span>
<span class="line"><span>    return {&quot;sub_dependency&quot;: final_query}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-5-路径操作装饰器中导入依赖" tabindex="-1"><a class="header-anchor" href="#_5-5-路径操作装饰器中导入依赖"><span>5-5 路径操作装饰器中导入依赖</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;路径操作装饰器中导入依赖&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def verify_token(x_token: str = Header(...)):</span></span>
<span class="line"><span>    if x_token != &quot;fake-super-secret-token&quot;:</span></span>
<span class="line"><span>        raise HTTPException(status_code=404, detail=&#39;X-Token header invalid&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def verify_key(x_key: str = Header(...)):</span></span>
<span class="line"><span>    &quot;&quot;&quot;又返回值的子依赖，但是返回值不会被调用&quot;&quot;&quot;</span></span>
<span class="line"><span>    if x_key != &quot;fake-supplier-secret-token&quot;:</span></span>
<span class="line"><span>        raise HTTPException(status_code=400, detail=&quot;x_Key header invalid&quot;)</span></span>
<span class="line"><span>    return x_key</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app05.get(&#39;/dependency_in_path_operation&#39;, dependencies=[Depends(verify_token), Depends(verify_key)])</span></span>
<span class="line"><span>async def dependency_in_path_operation():</span></span>
<span class="line"><span>    return {&quot;fuck&quot;: &quot;fuck&quot;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-6-fastapi框架中全局依赖的使用" tabindex="-1"><a class="header-anchor" href="#_5-6-fastapi框架中全局依赖的使用"><span>5.6 FastAPI框架中全局依赖的使用</span></a></h3><p>我们不光可以在单个接口中添加依赖，用来验证token护着sercet_key</p><p>也可以在子应用中添加</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>app05 = APIRouter(dependencies=[Depends(verify_token),Depends(verify_key)])</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以在全局app中添加依赖</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>app = FastAPI(dependencies=[Depends(verify_token),Depends(verify_key)])</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>其实这样就可以对我们的接口进行权限之类的校验了</p><h3 id="_5-7-使用yield的依赖和子依赖" tabindex="-1"><a class="header-anchor" href="#_5-7-使用yield的依赖和子依赖"><span>5.7 使用yield的依赖和子依赖</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;Dependencies with yield 带yield的依赖&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 这个需要Python3.7才支持，Python3.6需要pip install async-exit-stack async-generator</span></span>
<span class="line"><span># 以下都是伪代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def get_db():</span></span>
<span class="line"><span>    db = &quot;db_connection&quot;</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        yield db</span></span>
<span class="line"><span>    finally:</span></span>
<span class="line"><span>        db.endswith(&quot;db_close&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def dependency_a():</span></span>
<span class="line"><span>    dep_a = &quot;generate_dep_a()&quot;</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        yield dep_a</span></span>
<span class="line"><span>    finally:</span></span>
<span class="line"><span>        dep_a.endswith(&quot;db_close&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def dependency_b(dep_a=Depends(dependency_a)):</span></span>
<span class="line"><span>    dep_b = &quot;generate_dep_b()&quot;</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        yield dep_b</span></span>
<span class="line"><span>    finally:</span></span>
<span class="line"><span>        dep_b.endswith(dep_a)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def dependency_c(dep_b=Depends(dependency_b)):</span></span>
<span class="line"><span>    dep_c = &quot;generate_dep_c()&quot;</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        yield dep_c</span></span>
<span class="line"><span>    finally:</span></span>
<span class="line"><span>        dep_c.endswith(dep_b)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第6章-安全、认证和授权" tabindex="-1"><a class="header-anchor" href="#第6章-安全、认证和授权"><span>第6章：安全、认证和授权</span></a></h2><h3 id="_6-1-oauth2-密码模式和-fastapi-的-oauth2passwordbearer" tabindex="-1"><a class="header-anchor" href="#_6-1-oauth2-密码模式和-fastapi-的-oauth2passwordbearer"><span>6.1 OAuth2 密码模式和 FastAPI 的 OAuth2PasswordBearer</span></a></h3><figure><img src="`+t+`" alt=" image-20210204152011882" tabindex="0" loading="lazy"><figcaption> image-20210204152011882</figcaption></figure><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;OAuth2 密码模式和 FastAPI 的 OAuth2PasswordBearer&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span>OAuth2PasswordBearer是接收URL作为参数的一个类：客户端会向该URL发送username和password参数，然后得到一个Token值</span></span>
<span class="line"><span>OAuth2PasswordBearer并不会创建相应的URL路径操作，只是指明客户端用来请求Token的URL地址</span></span>
<span class="line"><span>当请求到来的时候，FastAPI会检查请求的Authorization头信息，如果没有找到Authorization头信息，或者头信息的内容不是Bearer token，它会返回401状态码(UNAUTHORIZED)</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span>oauth2_schema = OAuth2PasswordBearer(tokenUrl=&quot;/chapter06/token&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app06.get(&#39;/oauth2_password_bearer&#39;)</span></span>
<span class="line"><span>async def oauth2_password_bearer(token: str = Depends(oauth2_schema)):</span></span>
<span class="line"><span>    return {&quot;token&quot;: token}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-基于-password-和-bearer-token-的-oauth2-认证" tabindex="-1"><a class="header-anchor" href="#_6-2-基于-password-和-bearer-token-的-oauth2-认证"><span>6.2 基于 Password 和 Bearer token 的 OAuth2 认证</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;OAuth2 密码模式和 FastAPI 的 OAuth2PasswordBearer&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span>OAuth2PasswordBearer是接收URL作为参数的一个类：客户端会向该URL发送username和password参数，然后得到一个Token值</span></span>
<span class="line"><span>OAuth2PasswordBearer并不会创建相应的URL路径操作，只是指明客户端用来请求Token的URL地址</span></span>
<span class="line"><span>当请求到来的时候，FastAPI会检查请求的Authorization头信息，如果没有找到Authorization头信息，或者头信息的内容不是Bearer token，它会返回401状态码(UNAUTHORIZED)</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>oauth2_schema = OAuth2PasswordBearer(tokenUrl=&quot;/chapter06/token&quot;)  # 请求Token的URL地址 http://127.0.0.1:8000/chapter06/token</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app06.get(&quot;/oauth2_password_bearer&quot;)</span></span>
<span class="line"><span>async def oauth2_password_bearer(token: str = Depends(oauth2_schema)):</span></span>
<span class="line"><span>    return {&quot;token&quot;: token}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;基于 Password 和 Bearer token 的 OAuth2 认证&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>fake_users_db = {</span></span>
<span class="line"><span>    &quot;john snow&quot;: {</span></span>
<span class="line"><span>        &quot;username&quot;: &quot;john snow&quot;,</span></span>
<span class="line"><span>        &quot;full_name&quot;: &quot;John Snow&quot;,</span></span>
<span class="line"><span>        &quot;email&quot;: &quot;johnsnow@example.com&quot;,</span></span>
<span class="line"><span>        &quot;hashed_password&quot;: &quot;fakehashedsecret&quot;,</span></span>
<span class="line"><span>        &quot;disabled&quot;: False,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    &quot;alice&quot;: {</span></span>
<span class="line"><span>        &quot;username&quot;: &quot;alice&quot;,</span></span>
<span class="line"><span>        &quot;full_name&quot;: &quot;Alice Wonderson&quot;,</span></span>
<span class="line"><span>        &quot;email&quot;: &quot;alice@example.com&quot;,</span></span>
<span class="line"><span>        &quot;hashed_password&quot;: &quot;fakehashedsecret2&quot;,</span></span>
<span class="line"><span>        &quot;disabled&quot;: True,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def fake_hash_password(password: str):</span></span>
<span class="line"><span>    return &quot;fakehashed&quot; + password</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class User(BaseModel):</span></span>
<span class="line"><span>    username: str</span></span>
<span class="line"><span>    email: Optional[str] = None</span></span>
<span class="line"><span>    full_name: Optional[str] = None</span></span>
<span class="line"><span>    disabled: Optional[bool] = None</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class UserInDB(User):</span></span>
<span class="line"><span>    hashed_password: str</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app06.post(&quot;/token&quot;)</span></span>
<span class="line"><span>async def login(form_data: OAuth2PasswordRequestForm = Depends()):</span></span>
<span class="line"><span>    user_dict = fake_users_db.get(form_data.username)</span></span>
<span class="line"><span>    if not user_dict:</span></span>
<span class="line"><span>        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=&quot;Incorrect username or password&quot;)</span></span>
<span class="line"><span>    user = UserInDB(**user_dict)</span></span>
<span class="line"><span>    hashed_password = fake_hash_password(form_data.password)</span></span>
<span class="line"><span>    if not hashed_password == user.hashed_password:</span></span>
<span class="line"><span>        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=&quot;Incorrect username or password&quot;)</span></span>
<span class="line"><span>    return {&quot;access_token&quot;: user.username, &quot;token_type&quot;: &quot;bearer&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def get_user(db, username: str):</span></span>
<span class="line"><span>    if username in db:</span></span>
<span class="line"><span>        user_dict = db[username]</span></span>
<span class="line"><span>        return UserInDB(**user_dict)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def fake_decode_token(token: str):</span></span>
<span class="line"><span>    user = get_user(fake_users_db, token)</span></span>
<span class="line"><span>    return user</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def get_current_user(token: str = Depends(oauth2_schema)):</span></span>
<span class="line"><span>    user = fake_decode_token(token)</span></span>
<span class="line"><span>    if not user:</span></span>
<span class="line"><span>        raise HTTPException(</span></span>
<span class="line"><span>            status_code=status.HTTP_401_UNAUTHORIZED,</span></span>
<span class="line"><span>            detail=&quot;Invalid authentication credentials&quot;,</span></span>
<span class="line"><span>            headers={&quot;WWW-Authenticate&quot;: &quot;Bearer&quot;},  # OAuth2的规范，如果认证失败，请求头中返回“WWW-Authenticate”</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>    return user</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def get_current_active_user(current_user: User = Depends(get_current_user)):</span></span>
<span class="line"><span>    if current_user.disabled:</span></span>
<span class="line"><span>        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=&quot;Inactive user&quot;)</span></span>
<span class="line"><span>    return current_user</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app06.get(&quot;/users/me&quot;)</span></span>
<span class="line"><span>async def read_users_me(current_user: User = Depends(get_current_active_user)):</span></span>
<span class="line"><span>    return current_user</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>fake_users_db.update({</span></span>
<span class="line"><span>    &quot;john snow&quot;: {</span></span>
<span class="line"><span>        &quot;username&quot;: &quot;john snow&quot;,</span></span>
<span class="line"><span>        &quot;full_name&quot;: &quot;John Snow&quot;,</span></span>
<span class="line"><span>        &quot;email&quot;: &quot;johnsnow@example.com&quot;,</span></span>
<span class="line"><span>        &quot;hashed_password&quot;: &quot;$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW&quot;,</span></span>
<span class="line"><span>        &quot;disabled&quot;: False,</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>})</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-开发基于-json-web-tokens-的认证" tabindex="-1"><a class="header-anchor" href="#_6-3-开发基于-json-web-tokens-的认证"><span>6.3 开发基于 JSON Web Tokens 的认证</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;OAuth2 with Password (and hashing), Bearer with JWT tokens 开发基于JSON Web Tokens的认证&quot;&quot;&quot;</span></span>
<span class="line"><span>SECRET_KEY = &quot;09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7&quot;  # 生成密钥 openssl rand -hex 32</span></span>
<span class="line"><span>ALGORITHM = &quot;HS256&quot;  # 算法</span></span>
<span class="line"><span>ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 访问令牌过期分钟</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Token(BaseModel):</span></span>
<span class="line"><span>    &quot;&quot;&quot;返回给用户的Token&quot;&quot;&quot;</span></span>
<span class="line"><span>    access_token: str</span></span>
<span class="line"><span>    token_type: str</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>pwd_context = CryptContext(schemes=[&#39;bcrypt&#39;], deprecated=&#39;auto&#39;)</span></span>
<span class="line"><span>oauth2_schema = OAuth2PasswordBearer(tokenUrl=&#39;/chapter06/jwt/token&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def verify_password(plain_password, hashed_password):</span></span>
<span class="line"><span>    &quot;&quot;&quot;对密码进行校验&quot;&quot;&quot;</span></span>
<span class="line"><span>    return pwd_context.verify(plain_password, hashed_password)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def jwt_get_user(db, username: str):</span></span>
<span class="line"><span>    if username in db:</span></span>
<span class="line"><span>        user_dict = db[username]</span></span>
<span class="line"><span>        return UserInDB(**user_dict)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def jwt_authenticate_user(db, username: str, password: str):</span></span>
<span class="line"><span>    user = jwt_get_user(db, username)</span></span>
<span class="line"><span>    if not user:</span></span>
<span class="line"><span>        return False</span></span>
<span class="line"><span>    if not verify_password(password, user.hashed_password):</span></span>
<span class="line"><span>        return False</span></span>
<span class="line"><span>    return user</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):</span></span>
<span class="line"><span>    to_encode = data.copy()</span></span>
<span class="line"><span>    if expires_delta:</span></span>
<span class="line"><span>        expire = datetime.utcnow() + expires_delta</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        expire = datetime.utcnow() + timedelta(minutes=15)</span></span>
<span class="line"><span>    to_encode.update({&#39;exp&#39;: expire})</span></span>
<span class="line"><span>    encode_jwt = jwt.encode(claims=to_encode, key=SECRET_KEY, algorithm=ALGORITHM)</span></span>
<span class="line"><span>    return encode_jwt</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app06.post(&#39;/jwt/token&#39;, response_model=Token)</span></span>
<span class="line"><span>async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):</span></span>
<span class="line"><span>    user = jwt_authenticate_user(db=fake_users_db, username=form_data.username, password=form_data.password)</span></span>
<span class="line"><span>    if not user:</span></span>
<span class="line"><span>        raise HTTPException(</span></span>
<span class="line"><span>            status.HTTP_401_UNAUTHORIZED,</span></span>
<span class="line"><span>            detail=&quot;Incorrect username or password&quot;,</span></span>
<span class="line"><span>            headers={&quot;WWW-Authenticate&quot;: &quot;Bearer&quot;},</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>    # 获取Token的过期时间</span></span>
<span class="line"><span>    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)</span></span>
<span class="line"><span>    access_token = create_access_token(</span></span>
<span class="line"><span>        data={&quot;sub&quot;: user.username},</span></span>
<span class="line"><span>        expires_delta=access_token_expires</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>    return {&quot;access_token&quot;: access_token, &quot;token_type&quot;: &quot;bearer&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def jwt_get_current_user(token: str = Depends(oauth2_schema)):</span></span>
<span class="line"><span>    credentials_exception = HTTPException(</span></span>
<span class="line"><span>        status.HTTP_401_UNAUTHORIZED,</span></span>
<span class="line"><span>        detail=&quot;Could not validate credentials&quot;,</span></span>
<span class="line"><span>        headers={&quot;WWW-Authenticate&quot;: &quot;Bearer&quot;},</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        payload = jwt.decode(token=token, key=SECRET_KEY, algorithms=[ALGORITHM])</span></span>
<span class="line"><span>        username = payload.get(&quot;sub&quot;)</span></span>
<span class="line"><span>        if username is None:</span></span>
<span class="line"><span>            raise credentials_exception</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    except JWTError:</span></span>
<span class="line"><span>        raise credentials_exception</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    user = jwt_get_user(db=fake_users_db, username=username)</span></span>
<span class="line"><span>    if user is None:</span></span>
<span class="line"><span>        raise credentials_exception</span></span>
<span class="line"><span>    return user</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def jwt_get_current_active_user(current_user: User = Depends(jwt_get_current_user)):</span></span>
<span class="line"><span>    if current_user.disabled:</span></span>
<span class="line"><span>        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=&quot;Inactive user&quot;)</span></span>
<span class="line"><span>    return current_user</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app06.get(&quot;/jwt/users/me&quot;)</span></span>
<span class="line"><span>async def jwt_read_users_me(current_user: User = Depends(jwt_get_current_active_user)):</span></span>
<span class="line"><span>    return current_user</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第7章-fastapi的数据库操作和多应用的目录结构设计" tabindex="-1"><a class="header-anchor" href="#第7章-fastapi的数据库操作和多应用的目录结构设计"><span>第7章 FastAPI的数据库操作和多应用的目录结构设计</span></a></h2><p>项目结构</p><figure><img src="`+c+`" alt="image-20210204205745513" tabindex="0" loading="lazy"><figcaption>image-20210204205745513</figcaption></figure><h3 id="_7-1-flastapi中配置sqlalchemy数据库操作" tabindex="-1"><a class="header-anchor" href="#_7-1-flastapi中配置sqlalchemy数据库操作"><span>7.1 FlastAPI中配置SQLAlchemy数据库操作</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span># database.py</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>from sqlalchemy import create_engine</span></span>
<span class="line"><span>from sqlalchemy.ext.declarative import declarative_base</span></span>
<span class="line"><span>from sqlalchemy.orm import sessionmaker</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SQLALCHEMY_DATABASE_URL = &#39;sqlite:///./coronavirus.sqlite3&#39;</span></span>
<span class="line"><span># SQLALCHEMY_DATABASE_URL = &quot;postgresql://username:password@host:port/database_name&quot;  # MySQL或PostgreSQL的连接方法</span></span>
<span class="line"><span></span></span>
<span class="line"><span>engine = create_engine(</span></span>
<span class="line"><span>    # echo=True表示引擎将用repr()函数记录所有语句及其参数列表到日志</span></span>
<span class="line"><span>    # 由于SQLAlchemy是多线程，指定check_same_thread=False来让建立的对象任意线程都可使用。这个参数只在用SQLite数据库时设置</span></span>
<span class="line"><span>    SQLALCHEMY_DATABASE_URL, encoding=&#39;utf-8&#39;, echo=True, connect_args={&#39;check_same_thread&#39;: False}</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 在SQLAlchemy中，CRUD都是通过会话(session)进行的，所以我们必须要先创建会话，每一个SessionLocal实例就是一个数据库session</span></span>
<span class="line"><span># flush()是指发送数据库语句到数据库，但数据库不一定执行写入磁盘；commit()是指提交事务，将变更保存到数据库文件</span></span>
<span class="line"><span>SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=True)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 创建基本映射类</span></span>
<span class="line"><span>Base = declarative_base(bind=engine, name=&#39;Base&#39;)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-sqlalchemy模型类开发" tabindex="-1"><a class="header-anchor" href="#_7-2-sqlalchemy模型类开发"><span>7.2 SQLAlchemy模型类开发</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span># models.py</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from sqlalchemy import Column, String, Integer, BigInteger, Date, DateTime, ForeignKey, func</span></span>
<span class="line"><span>from sqlalchemy.orm import relationship</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from .database import Base</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class City(Base):</span></span>
<span class="line"><span>    __tablename__ = &#39;city&#39;  # 数据表的表名</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    id = Column(Integer, primary_key=True, index=True, autoincrement=True)</span></span>
<span class="line"><span>    province = Column(String(100), unique=True, nullable=False, comment=&#39;省/直辖市&#39;)</span></span>
<span class="line"><span>    country = Column(String(100), nullable=False, comment=&#39;国家&#39;)</span></span>
<span class="line"><span>    country_code = Column(String(100), nullable=False, comment=&#39;国家代码&#39;)</span></span>
<span class="line"><span>    country_population = Column(BigInteger, nullable=False, comment=&#39;国家人口&#39;)</span></span>
<span class="line"><span>    data = relationship(&#39;Data&#39;, back_populates=&#39;city&#39;)  # &#39;Data&#39;是关联的类名；back_populates来指定反向访问的属性名称</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    created_at = Column(DateTime, server_default=func.now(), comment=&#39;创建时间&#39;)</span></span>
<span class="line"><span>    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment=&#39;更新时间&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    __mapper_args__ = {&quot;order_by&quot;: country_code}  # 默认是正序，倒序加上.desc()方法</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def __repr__(self):</span></span>
<span class="line"><span>        return f&#39;{self.country}_{self.province}&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Data(Base):</span></span>
<span class="line"><span>    __tablename__ = &#39;data&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    id = Column(Integer, primary_key=True, index=True, autoincrement=True)</span></span>
<span class="line"><span>    city_id = Column(Integer, ForeignKey(&#39;city.id&#39;), comment=&#39;所属省/直辖市&#39;)  # ForeignKey里的字符串格式不是类名.属性名，而是表名.字段名</span></span>
<span class="line"><span>    date = Column(Date, nullable=False, comment=&#39;数据日期&#39;)</span></span>
<span class="line"><span>    confirmed = Column(BigInteger, default=0, nullable=False, comment=&#39;确诊数量&#39;)</span></span>
<span class="line"><span>    deaths = Column(BigInteger, default=0, nullable=False, comment=&#39;死亡数量&#39;)</span></span>
<span class="line"><span>    recovered = Column(BigInteger, default=0, nullable=False, comment=&#39;痊愈数量&#39;)</span></span>
<span class="line"><span>    city = relationship(&#39;City&#39;, back_populates=&#39;data&#39;)  # &#39;City&#39;是关联的类名；back_populates来指定反向访问的属性名称</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    created_at = Column(DateTime, server_default=func.now(), comment=&#39;创建时间&#39;)</span></span>
<span class="line"><span>    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), comment=&#39;更新时间&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    __mapper_args__ = {&quot;order_by&quot;: date.desc()}  # 按日期降序排列</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def __repr__(self):</span></span>
<span class="line"><span>        return f&#39;{repr(self.date)}：确诊{self.confirmed}例&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot; 附上三个SQLAlchemy教程</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SQLAlchemy的基本操作大全 </span></span>
<span class="line"><span>    http://www.taodudu.cc/news/show-175725.html</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Python3+SQLAlchemy+Sqlite3实现ORM教程 </span></span>
<span class="line"><span>    https://www.cnblogs.com/jiangxiaobo/p/12350561.html</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SQLAlchemy基础知识 Autoflush和Autocommit</span></span>
<span class="line"><span>    https://zhuanlan.zhihu.com/p/48994990</span></span>
<span class="line"><span>&quot;&quot;&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-pydantic建立与模型类对应的数据格式类" tabindex="-1"><a class="header-anchor" href="#_7-3-pydantic建立与模型类对应的数据格式类"><span>7.3 Pydantic建立与模型类对应的数据格式类</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;规范数据格式&quot;&quot;&quot;</span></span>
<span class="line"><span># schemas.py</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from datetime import date as date_</span></span>
<span class="line"><span>from datetime import datetime</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from pydantic import BaseModel</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class CreateData(BaseModel):</span></span>
<span class="line"><span>    date: date_</span></span>
<span class="line"><span>    confirmed: int = 0</span></span>
<span class="line"><span>    deaths: int = 0</span></span>
<span class="line"><span>    recovered: int = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class CreateCity(BaseModel):</span></span>
<span class="line"><span>    province: str</span></span>
<span class="line"><span>    country: str</span></span>
<span class="line"><span>    country_code: str</span></span>
<span class="line"><span>    country_population: int</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class ReadData(CreateData):</span></span>
<span class="line"><span>    id: int</span></span>
<span class="line"><span>    city_id: int</span></span>
<span class="line"><span>    updated_at: datetime</span></span>
<span class="line"><span>    created_at: datetime</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    class Config:</span></span>
<span class="line"><span>        orm_mode = True</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class ReadCity(CreateCity):</span></span>
<span class="line"><span>    id: int</span></span>
<span class="line"><span>    updated_at: datetime</span></span>
<span class="line"><span>    created_at: datetime</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    class Config:</span></span>
<span class="line"><span>        orm_mode = True</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-4-把创建和查询的函数进行封装" tabindex="-1"><a class="header-anchor" href="#_7-4-把创建和查询的函数进行封装"><span>7.4 把创建和查询的函数进行封装</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span># crud.py</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>from sqlalchemy.orm import Session</span></span>
<span class="line"><span>from corona import models, schemas</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 根据id查询城市</span></span>
<span class="line"><span>def get_city(db: Session, city_id: int):</span></span>
<span class="line"><span>    return db.query(models.City).filter(models.City.id == city_id).first()</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 根据城市名字查询城市</span></span>
<span class="line"><span>def get_city_by_name(db: Session, name: str):</span></span>
<span class="line"><span>    return db.query(models.City).filter(models.City.province == name).first()</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 查询一定数量的城市</span></span>
<span class="line"><span>def get_cities(db: Session, skip: int = 0, limit: int = 10):</span></span>
<span class="line"><span>    return db.query(models.City).offset(skip).limit(limit).all()</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 创建城市</span></span>
<span class="line"><span>def create_city(db: Session, city: schemas.CreateCity):</span></span>
<span class="line"><span>    db_city = models.City(**city.dict())</span></span>
<span class="line"><span>    db.add(db_city)</span></span>
<span class="line"><span>    db.commit()</span></span>
<span class="line"><span>    db.refresh(db_city)</span></span>
<span class="line"><span>    return db_city</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 获取数据</span></span>
<span class="line"><span>def get_data(db: Session, city: str = None, skip: int = 0, limit: int = 100):</span></span>
<span class="line"><span>    if city:</span></span>
<span class="line"><span>        return db.query(models.Data).filter(models.Data.has(province=city))</span></span>
<span class="line"><span>    return db.query(models.Data).offset(skip).limit(limit).all()</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 创建数据</span></span>
<span class="line"><span>def create_city_data(db: Session, data: schemas.CreateCity, city_id: int):</span></span>
<span class="line"><span>    db_data = models.Data(**data.dict(), city_id=city_id)</span></span>
<span class="line"><span>    db.add(db_data)</span></span>
<span class="line"><span>    db.commit()</span></span>
<span class="line"><span>    db.refresh(db_data)</span></span>
<span class="line"><span>    return db_data</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-5-jinjia2渲染前端页面" tabindex="-1"><a class="header-anchor" href="#_7-5-jinjia2渲染前端页面"><span>7.5 Jinjia2渲染前端页面</span></a></h3><p><strong>main.py</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>#!/usr/bin/python3</span></span>
<span class="line"><span># -*- coding:utf-8 -*-</span></span>
<span class="line"><span># __author__ = &#39;__Jack__&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from typing import List</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import requests</span></span>
<span class="line"><span>from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request</span></span>
<span class="line"><span>from fastapi.templating import Jinja2Templates</span></span>
<span class="line"><span>from pydantic import HttpUrl</span></span>
<span class="line"><span>from sqlalchemy.orm import Session</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from coronavirus import crud, schemas</span></span>
<span class="line"><span>from coronavirus.database import engine, Base, SessionLocal</span></span>
<span class="line"><span>from coronavirus.models import City, Data</span></span>
<span class="line"><span></span></span>
<span class="line"><span>application = APIRouter()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>templates = Jinja2Templates(directory=&#39;./coronavirus/templates&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Base.metadata.create_all(bind=engine)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def get_db():</span></span>
<span class="line"><span>    db = SessionLocal()</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        yield db</span></span>
<span class="line"><span>    finally:</span></span>
<span class="line"><span>        db.close()</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@application.post(&quot;/create_city&quot;, response_model=schemas.ReadCity)</span></span>
<span class="line"><span>def create_city(city: schemas.CreateCity, db: Session = Depends(get_db)):</span></span>
<span class="line"><span>    db_city = crud.get_city_by_name(db, name=city.province)</span></span>
<span class="line"><span>    if db_city:</span></span>
<span class="line"><span>        raise HTTPException(status_code=400, detail=&quot;City already registered&quot;)</span></span>
<span class="line"><span>    return crud.create_city(db=db, city=city)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@application.get(&quot;/get_city/{city}&quot;, response_model=schemas.ReadCity)</span></span>
<span class="line"><span>def get_city(city: str, db: Session = Depends(get_db)):</span></span>
<span class="line"><span>    db_city = crud.get_city_by_name(db, name=city)</span></span>
<span class="line"><span>    if db_city is None:</span></span>
<span class="line"><span>        raise HTTPException(status_code=404, detail=&quot;City not found&quot;)</span></span>
<span class="line"><span>    return db_city</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@application.get(&quot;/get_cities&quot;, response_model=List[schemas.ReadCity])</span></span>
<span class="line"><span>def get_cities(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):</span></span>
<span class="line"><span>    cities = crud.get_cities(db, skip=skip, limit=limit)</span></span>
<span class="line"><span>    return cities</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@application.post(&quot;/create_data&quot;, response_model=schemas.ReadData)</span></span>
<span class="line"><span>def create_data_for_city(city: str, data: schemas.CreateData, db: Session = Depends(get_db)):</span></span>
<span class="line"><span>    db_city = crud.get_city_by_name(db, name=city)</span></span>
<span class="line"><span>    data = crud.create_city_data(db=db, data=data, city_id=db_city.id)</span></span>
<span class="line"><span>    return data</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@application.get(&quot;/get_data&quot;)</span></span>
<span class="line"><span>def get_data(city: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):</span></span>
<span class="line"><span>    data = crud.get_data(db, city=city, skip=skip, limit=limit)</span></span>
<span class="line"><span>    return data</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def bg_task(url: HttpUrl, db: Session):</span></span>
<span class="line"><span>    &quot;&quot;&quot;这里注意一个坑，不要在后台任务的参数中db: Session = Depends(get_db)这样导入依赖&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    city_data = requests.get(url=f&quot;{url}?source=jhu&amp;country_code=CN&amp;timelines=false&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if 200 == city_data.status_code:</span></span>
<span class="line"><span>        db.query(City).delete()  # 同步数据前先清空原有的数据</span></span>
<span class="line"><span>        for location in city_data.json()[&quot;locations&quot;]:</span></span>
<span class="line"><span>            city = {</span></span>
<span class="line"><span>                &quot;province&quot;: location[&quot;province&quot;],</span></span>
<span class="line"><span>                &quot;country&quot;: location[&quot;country&quot;],</span></span>
<span class="line"><span>                &quot;country_code&quot;: &quot;CN&quot;,</span></span>
<span class="line"><span>                &quot;country_population&quot;: location[&quot;country_population&quot;]</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            crud.create_city(db=db, city=schemas.CreateCity(**city))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    coronavirus_data = requests.get(url=f&quot;{url}?source=jhu&amp;country_code=CN&amp;timelines=true&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if 200 == coronavirus_data.status_code:</span></span>
<span class="line"><span>        db.query(Data).delete()</span></span>
<span class="line"><span>        for city in coronavirus_data.json()[&quot;locations&quot;]:</span></span>
<span class="line"><span>            db_city = crud.get_city_by_name(db=db, name=city[&quot;province&quot;])</span></span>
<span class="line"><span>            for date, confirmed in city[&quot;timelines&quot;][&quot;confirmed&quot;][&quot;timeline&quot;].items():</span></span>
<span class="line"><span>                data = {</span></span>
<span class="line"><span>                    &quot;date&quot;: date.split(&quot;T&quot;)[0],  # 把&#39;2020-12-31T00:00:00Z&#39; 变成 ‘2020-12-31’</span></span>
<span class="line"><span>                    &quot;confirmed&quot;: confirmed,</span></span>
<span class="line"><span>                    &quot;deaths&quot;: city[&quot;timelines&quot;][&quot;deaths&quot;][&quot;timeline&quot;][date],</span></span>
<span class="line"><span>                    &quot;recovered&quot;: 0  # 每个城市每天有多少人痊愈，这种数据没有</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                # 这个city_id是city表中的主键ID，不是coronavirus_data数据里的ID</span></span>
<span class="line"><span>                crud.create_city_data(db=db, data=schemas.CreateData(**data), city_id=db_city.id)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@application.get(&quot;/sync_coronavirus_data/jhu&quot;)</span></span>
<span class="line"><span>def sync_coronavirus_data(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):</span></span>
<span class="line"><span>    &quot;&quot;&quot;从Johns Hopkins University同步COVID-19数据&quot;&quot;&quot;</span></span>
<span class="line"><span>    background_tasks.add_task(bg_task, &quot;https://coronavirus-tracker-api.herokuapp.com/v2/locations&quot;, db)</span></span>
<span class="line"><span>    return {&quot;message&quot;: &quot;正在后台同步数据...&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@application.get(&quot;/&quot;)</span></span>
<span class="line"><span>def coronavirus(request: Request, city: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):</span></span>
<span class="line"><span>    data = crud.get_data(db, city=city, skip=skip, limit=limit)</span></span>
<span class="line"><span>    return templates.TemplateResponse(&quot;home.html&quot;, {</span></span>
<span class="line"><span>        &quot;request&quot;: request,</span></span>
<span class="line"><span>        &quot;data&quot;: data,</span></span>
<span class="line"><span>        &quot;sync_data_url&quot;: &quot;/coronavirus/sync_coronavirus_data/jhu&quot;</span></span>
<span class="line"><span>    })</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>home.html</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>&lt;!DOCTYPE html&gt;</span></span>
<span class="line"><span>&lt;html lang=&quot;en&quot;&gt;</span></span>
<span class="line"><span>&lt;head&gt;</span></span>
<span class="line"><span>    &lt;title&gt;新冠病毒疫情跟踪器&lt;/title&gt;</span></span>
<span class="line"><span>    &lt;link rel=&quot;stylesheet&quot; href=&quot;{{ url_for(&#39;static&#39;, path=&#39;/semantic.min.css&#39;) }}&quot;&gt;</span></span>
<span class="line"><span>    &lt;script src=&quot;{{ url_for(&#39;static&#39;, path=&#39;/jquery-3.5.1/jquery-3.5.1.min.js&#39;) }}&quot;&gt;&lt;/script&gt;</span></span>
<span class="line"><span>    &lt;script src=&quot;{{ url_for(&#39;static&#39;, path=&#39;/semantic.min.js&#39;) }}&quot;&gt;&lt;/script&gt;</span></span>
<span class="line"><span>    &lt;script&gt;</span></span>
<span class="line"><span>        $(document).ready(function () {</span></span>
<span class="line"><span>            $(&quot;#filter&quot;).click(function () {</span></span>
<span class="line"><span>                const city = $(&quot;#city&quot;).val();</span></span>
<span class="line"><span>                window.location.href = &quot;http://&quot; + window.location.host + &quot;/coronavirus?city=&quot; + city;</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span>            $(&quot;#sync&quot;).click(function () {</span></span>
<span class="line"><span>                $.get(&quot;{{ sync_data_url }}&quot;, function (result) {</span></span>
<span class="line"><span>                    alert(&quot;Message: &quot; + result.message);</span></span>
<span class="line"><span>                });</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>    &lt;/script&gt;</span></span>
<span class="line"><span>&lt;/head&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;body&gt;</span></span>
<span class="line"><span>&lt;div class=&quot;ui container&quot;&gt;</span></span>
<span class="line"><span>    &lt;h2&gt;&lt;/h2&gt;</span></span>
<span class="line"><span>    &lt;h1 style=&quot;text-align: center&quot;&gt;新冠病毒疫情跟踪器&lt;/h1&gt;</span></span>
<span class="line"><span>    &lt;h2&gt;&lt;/h2&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;button id=&quot;filter&quot; style=&quot;float: left&quot; type=&quot;submit&quot; class=&quot;ui button alert-secondary&quot;&gt;过滤&lt;/button&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;div class=&quot;ui input&quot;&gt;</span></span>
<span class="line"><span>        &lt;label for=&quot;city&quot;&gt;&lt;/label&gt;&lt;input id=&quot;city&quot; type=&quot;text&quot; placeholder=&quot;城市&quot; value=&quot;&quot;&gt;</span></span>
<span class="line"><span>    &lt;/div&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;button id=&quot;sync&quot; style=&quot;float: right&quot; type=&quot;submit&quot; class=&quot;ui button primary&quot;&gt;同步数据&lt;/button&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;table class=&quot;ui celled table&quot;&gt;</span></span>
<span class="line"><span>        &lt;thead&gt;</span></span>
<span class="line"><span>        &lt;tr&gt;</span></span>
<span class="line"><span>            &lt;th&gt;城市&lt;/th&gt;</span></span>
<span class="line"><span>            &lt;th&gt;日期&lt;/th&gt;</span></span>
<span class="line"><span>            &lt;th&gt;累计确诊数&lt;/th&gt;</span></span>
<span class="line"><span>            &lt;th&gt;累计死亡数&lt;/th&gt;</span></span>
<span class="line"><span>            &lt;th&gt;累计痊愈数&lt;/th&gt;</span></span>
<span class="line"><span>            &lt;th&gt;更新时间&lt;/th&gt;</span></span>
<span class="line"><span>        &lt;/tr&gt;</span></span>
<span class="line"><span>        &lt;/thead&gt;</span></span>
<span class="line"><span>        &lt;tbody&gt;</span></span>
<span class="line"><span>        {% for d in data %}</span></span>
<span class="line"><span>        &lt;tr&gt;</span></span>
<span class="line"><span>            &lt;td&gt;{{ d.city.province }}&lt;/td&gt;</span></span>
<span class="line"><span>            &lt;td&gt;{{ d.date }}&lt;/td&gt;</span></span>
<span class="line"><span>            &lt;td&gt;{{ d.confirmed }}&lt;/td&gt;</span></span>
<span class="line"><span>            &lt;td&gt;{{ d.deaths }}&lt;/td&gt;</span></span>
<span class="line"><span>            &lt;td&gt;{{ d.recovered }}&lt;/td&gt;</span></span>
<span class="line"><span>            &lt;td&gt;{{ d.updated_at }}&lt;/td&gt;</span></span>
<span class="line"><span>        &lt;/tr&gt;</span></span>
<span class="line"><span>        {% endfor %}</span></span>
<span class="line"><span>        &lt;/tbody&gt;</span></span>
<span class="line"><span>    &lt;/table&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span>
<span class="line"><span>&lt;/body&gt;</span></span>
<span class="line"><span>&lt;/html&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-6-大型工程木路结构设计-应用文件拆分" tabindex="-1"><a class="header-anchor" href="#_7-6-大型工程木路结构设计-应用文件拆分"><span>7.6 大型工程木路结构设计-应用文件拆分</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>from fastapi import APIRouter, Depends, Request</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;【见coronavirus应用】SQL (Relational) Databases FastAPI的数据库操作&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;Bigger Applications - Multiple Files 多应用的目录结构设计&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>async def get_user_agent(request: Request):</span></span>
<span class="line"><span>    print(request.headers[&quot;User-Agent&quot;])</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>app07 = APIRouter(</span></span>
<span class="line"><span>    prefix=&quot;/bigger_applications&quot;,</span></span>
<span class="line"><span>    tags=[&quot;第七章 FastAPI的数据库操作和多应用的目录结构设计&quot;],  # 与run.py中的tags名称相同</span></span>
<span class="line"><span>    dependencies=[Depends(get_user_agent)],</span></span>
<span class="line"><span>    responses={200: {&quot;description&quot;: &quot;Good job!&quot;}},</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app07.get(&quot;/bigger_applications&quot;)</span></span>
<span class="line"><span>async def bigger_applications():</span></span>
<span class="line"><span>    return {&quot;message&quot;: &quot;Bigger Applications - Multiple Files&quot;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第八章-中间件、cors、后台任务、测试用例" tabindex="-1"><a class="header-anchor" href="#第八章-中间件、cors、后台任务、测试用例"><span>第八章： 中间件、CORS、后台任务、测试用例</span></a></h2><h3 id="_8-1-中间件的概念和开发示例" tabindex="-1"><a class="header-anchor" href="#_8-1-中间件的概念和开发示例"><span>8.1 中间件的概念和开发示例</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span># run.py</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from fastapi import FastAPI, Request</span></span>
<span class="line"><span>app = FastAPI(</span></span>
<span class="line"><span>    title=&#39;FastAPI Tutorial and Coronavirus Tracker API Docs&#39;,</span></span>
<span class="line"><span>    description=&#39;FastAPI教程 新冠病毒疫情跟踪器API接口文档，项目代码：https://github.com/liaogx/fastapi-tutorial&#39;,</span></span>
<span class="line"><span>    version=&#39;1.0.0&#39;,</span></span>
<span class="line"><span>    docs_url=&#39;/docs&#39;,</span></span>
<span class="line"><span>    redoc_url=&#39;/redocs&#39;,</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app.middleware(&#39;http&#39;)</span></span>
<span class="line"><span>async def add_process_time_header(request: Request, call_next):  # call_next将接收request请求做为参数</span></span>
<span class="line"><span>    start_time = time.time()</span></span>
<span class="line"><span>    response = await call_next(request)</span></span>
<span class="line"><span>    process_time = time.time() - start_time</span></span>
<span class="line"><span>    response.headers[&#39;X-Process-Time&#39;] = str(process_time)  # 添加自定义的以“X-”开头的请求头</span></span>
<span class="line"><span>    return response</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-关于资源共享cors的原理" tabindex="-1"><a class="header-anchor" href="#_8-2-关于资源共享cors的原理"><span>8.2 关于资源共享CORS的原理</span></a></h3><p>直白的说就是我们跨站点了，js请求发生冲突或者不允许</p><h3 id="_8-3-fastapi的corsmiddleware实现方式" tabindex="-1"><a class="header-anchor" href="#_8-3-fastapi的corsmiddleware实现方式"><span>8.3 FastAPI的CORSMiddleware实现方式</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span># run.py</span></span>
<span class="line"><span>from fastapi.middleware.cors import CORSMiddleware</span></span>
<span class="line"><span>app.add_middleware(</span></span>
<span class="line"><span>    CORSMiddleware,</span></span>
<span class="line"><span>    allow_origins=[</span></span>
<span class="line"><span>        &quot;http://127.0.0.1&quot;,</span></span>
<span class="line"><span>        &quot;http://127.0.0.1:8080&quot;</span></span>
<span class="line"><span>    ],</span></span>
<span class="line"><span>    allow_credentials=True,</span></span>
<span class="line"><span>    allow_methods=[&quot;*&quot;],</span></span>
<span class="line"><span>    allow_headers=[&quot;*&quot;],</span></span>
<span class="line"><span>)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-4-fastapi实现蕾西celery的后台任务" tabindex="-1"><a class="header-anchor" href="#_8-4-fastapi实现蕾西celery的后台任务"><span>8.4 FastAPI实现蕾西Celery的后台任务</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>from typing import Optional</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from fastapi import APIRouter, BackgroundTasks, Depends</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app08 = APIRouter()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;【见run.py】Middleware 中间件&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 注：带yield的依赖的退出部分的代码 和 后台任务 会在中间件之后运行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;【见run.py】CORS (Cross-Origin Resource Sharing) 跨源资源共享&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 域的概念：协议+域名+端口</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;Background Tasks 后台任务&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def bg_task(framework: str):</span></span>
<span class="line"><span>    with open(&quot;README.md&quot;, mode=&quot;a&quot;) as f:</span></span>
<span class="line"><span>        f.write(f&quot;## {framework} 框架精讲&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app08.post(&quot;/background_tasks&quot;)</span></span>
<span class="line"><span>async def run_bg_task(framework: str, background_tasks: BackgroundTasks):</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    :param framework: 被调用的后台任务函数的参数</span></span>
<span class="line"><span>    :param background_tasks: FastAPI.BackgroundTasks</span></span>
<span class="line"><span>    :return:</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    background_tasks.add_task(bg_task, framework)</span></span>
<span class="line"><span>    return {&quot;message&quot;: &quot;任务已在后台运行&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def continue_write_readme(background_tasks: BackgroundTasks, q: Optional[str] = None):</span></span>
<span class="line"><span>    if q:</span></span>
<span class="line"><span>        background_tasks.add_task(bg_task, &quot;\\n&gt; 整体的介绍 FastAPI，快速上手开发，结合 API 交互文档逐个讲解核心模块的使用\\n&quot;)</span></span>
<span class="line"><span>    return q</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app08.post(&quot;/dependency/background_tasks&quot;)</span></span>
<span class="line"><span>async def dependency_run_bg_task(q: str = Depends(continue_write_readme)):</span></span>
<span class="line"><span>    if q:</span></span>
<span class="line"><span>        return {&quot;message&quot;: &quot;README.md更新成功&quot;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-5-后台任务更新" tabindex="-1"><a class="header-anchor" href="#_8-5-后台任务更新"><span>8.5 后台任务更新</span></a></h3><p>见7.5main.py</p><h3 id="_8-6-testclient编写测试用例" tabindex="-1"><a class="header-anchor" href="#_8-6-testclient编写测试用例"><span>8.6 TestClient编写测试用例</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>from fastapi.testclient import TestClient</span></span>
<span class="line"><span></span></span>
<span class="line"><span>from run import app</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;&quot;&quot;Testing 测试用例&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>client = TestClient(app)  # 先pip install pytest</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def test_run_bg_task():  # 函数名用“test_”开头是 pytest 的规范。注意不是async def</span></span>
<span class="line"><span>    response = client.post(url=&quot;/chapter08/background_tasks?framework=FastAPI&quot;)</span></span>
<span class="line"><span>    assert response.status_code == 200</span></span>
<span class="line"><span>    assert response.json() == {&quot;message&quot;: &quot;任务已在后台运行&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def test_dependency_run_bg_task():</span></span>
<span class="line"><span>    response = client.post(url=&quot;/chapter08/dependency/background_tasks&quot;)</span></span>
<span class="line"><span>    assert response.status_code == 200</span></span>
<span class="line"><span>    assert response.json() is None</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>def test_dependency_run_bg_task_q():</span></span>
<span class="line"><span>    response = client.post(url=&quot;/chapter08/dependency/background_tasks?q=1&quot;)</span></span>
<span class="line"><span>    assert response.status_code == 200</span></span>
<span class="line"><span>    assert response.json() == {&quot;message&quot;: &quot;README.md更新成功&quot;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,125)]))}const b=n(r,[["render",u],["__file","FastAPI-Python高性能web框架.html.vue"]]),h=JSON.parse('{"path":"/note-book/Research_Develop/Python/FastAPI-Python%E9%AB%98%E6%80%A7%E8%83%BDweb%E6%A1%86%E6%9E%B6.html","title":"FastAPI--python高性能web框架","lang":"zh-CN","frontmatter":{"description":"FastAPI--python高性能web框架 https://github.com/Paper-Dragon/learn-fastapi https://www.bilibili.com/video/BV1iN411X72b 第2章 FastAPI介绍和项目准备 2.1 Starlette，Pydantic 与 FastAPI 框架是什么关系？ py...","head":[["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/Research_Develop/Python/FastAPI-Python%E9%AB%98%E6%80%A7%E8%83%BDweb%E6%A1%86%E6%9E%B6.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"FastAPI--python高性能web框架"}],["meta",{"property":"og:description","content":"FastAPI--python高性能web框架 https://github.com/Paper-Dragon/learn-fastapi https://www.bilibili.com/video/BV1iN411X72b 第2章 FastAPI介绍和项目准备 2.1 Starlette，Pydantic 与 FastAPI 框架是什么关系？ py..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-19T07:56:45.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-19T07:56:45.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"FastAPI--python高性能web框架\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-03-19T07:56:45.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"PaperDragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"第2章 FastAPI介绍和项目准备","slug":"第2章-fastapi介绍和项目准备","link":"#第2章-fastapi介绍和项目准备","children":[{"level":3,"title":"2.1 Starlette，Pydantic 与 FastAPI 框架是什么关系？","slug":"_2-1-starlette-pydantic-与-fastapi-框架是什么关系","link":"#_2-1-starlette-pydantic-与-fastapi-框架是什么关系","children":[]},{"level":3,"title":"2.2 Pydantic基础教程","slug":"_2-2-pydantic基础教程","link":"#_2-2-pydantic基础教程","children":[]}]},{"level":2,"title":"第3章：请求参数和验证","slug":"第3章-请求参数和验证","link":"#第3章-请求参数和验证","children":[{"level":3,"title":"3.1fastapi的简单使用","slug":"_3-1fastapi的简单使用","link":"#_3-1fastapi的简单使用","children":[]},{"level":3,"title":"3.2 fastApi的结构","slug":"_3-2-fastapi的结构","link":"#_3-2-fastapi的结构","children":[]}]},{"level":2,"title":"第4章 响应处理和FastAPI配置","slug":"第4章-响应处理和fastapi配置","link":"#第4章-响应处理和fastapi配置","children":[{"level":3,"title":"4-1响应模型示例精讲","slug":"_4-1响应模型示例精讲","link":"#_4-1响应模型示例精讲","children":[]},{"level":3,"title":"4.2响应状态码和快捷属性","slug":"_4-2响应状态码和快捷属性","link":"#_4-2响应状态码和快捷属性","children":[]},{"level":3,"title":"4.3表单数据处理","slug":"_4-3表单数据处理","link":"#_4-3表单数据处理","children":[]},{"level":3,"title":"4.4 FastAPI项目的静态文件配置","slug":"_4-4-fastapi项目的静态文件配置","link":"#_4-4-fastapi项目的静态文件配置","children":[]},{"level":3,"title":"4.4 FastAPI项目的静态文件配置","slug":"_4-4-fastapi项目的静态文件配置-1","link":"#_4-4-fastapi项目的静态文件配置-1","children":[]},{"level":3,"title":"4.5  路径操作配置","slug":"_4-5-路径操作配置","link":"#_4-5-路径操作配置","children":[]},{"level":3,"title":"4.6 FastAPI 应用的常见配置项","slug":"_4-6-fastapi-应用的常见配置项","link":"#_4-6-fastapi-应用的常见配置项","children":[]}]},{"level":2,"title":"第5章：FastAPI的依赖注入系统","slug":"第5章-fastapi的依赖注入系统","link":"#第5章-fastapi的依赖注入系统","children":[{"level":3,"title":"5.1 依赖注入系统介绍和使用场景","slug":"_5-1-依赖注入系统介绍和使用场景","link":"#_5-1-依赖注入系统介绍和使用场景","children":[]},{"level":3,"title":"5.2 创建，导入和声明依赖","slug":"_5-2-创建-导入和声明依赖","link":"#_5-2-创建-导入和声明依赖","children":[]},{"level":3,"title":"5.3 如何将类作为依赖性","slug":"_5-3-如何将类作为依赖性","link":"#_5-3-如何将类作为依赖性","children":[]},{"level":3,"title":"5.4 自已来的创建和调用","slug":"_5-4-自已来的创建和调用","link":"#_5-4-自已来的创建和调用","children":[]},{"level":3,"title":"5-5 路径操作装饰器中导入依赖","slug":"_5-5-路径操作装饰器中导入依赖","link":"#_5-5-路径操作装饰器中导入依赖","children":[]},{"level":3,"title":"5.6 FastAPI框架中全局依赖的使用","slug":"_5-6-fastapi框架中全局依赖的使用","link":"#_5-6-fastapi框架中全局依赖的使用","children":[]},{"level":3,"title":"5.7 使用yield的依赖和子依赖","slug":"_5-7-使用yield的依赖和子依赖","link":"#_5-7-使用yield的依赖和子依赖","children":[]}]},{"level":2,"title":"第6章：安全、认证和授权","slug":"第6章-安全、认证和授权","link":"#第6章-安全、认证和授权","children":[{"level":3,"title":"6.1 OAuth2 密码模式和 FastAPI 的 OAuth2PasswordBearer","slug":"_6-1-oauth2-密码模式和-fastapi-的-oauth2passwordbearer","link":"#_6-1-oauth2-密码模式和-fastapi-的-oauth2passwordbearer","children":[]},{"level":3,"title":"6.2 基于 Password 和 Bearer token 的 OAuth2 认证","slug":"_6-2-基于-password-和-bearer-token-的-oauth2-认证","link":"#_6-2-基于-password-和-bearer-token-的-oauth2-认证","children":[]},{"level":3,"title":"6.3 开发基于 JSON Web Tokens 的认证","slug":"_6-3-开发基于-json-web-tokens-的认证","link":"#_6-3-开发基于-json-web-tokens-的认证","children":[]}]},{"level":2,"title":"第7章 FastAPI的数据库操作和多应用的目录结构设计","slug":"第7章-fastapi的数据库操作和多应用的目录结构设计","link":"#第7章-fastapi的数据库操作和多应用的目录结构设计","children":[{"level":3,"title":"7.1 FlastAPI中配置SQLAlchemy数据库操作","slug":"_7-1-flastapi中配置sqlalchemy数据库操作","link":"#_7-1-flastapi中配置sqlalchemy数据库操作","children":[]},{"level":3,"title":"7.2 SQLAlchemy模型类开发","slug":"_7-2-sqlalchemy模型类开发","link":"#_7-2-sqlalchemy模型类开发","children":[]},{"level":3,"title":"7.3 Pydantic建立与模型类对应的数据格式类","slug":"_7-3-pydantic建立与模型类对应的数据格式类","link":"#_7-3-pydantic建立与模型类对应的数据格式类","children":[]},{"level":3,"title":"7.4 把创建和查询的函数进行封装","slug":"_7-4-把创建和查询的函数进行封装","link":"#_7-4-把创建和查询的函数进行封装","children":[]},{"level":3,"title":"7.5 Jinjia2渲染前端页面","slug":"_7-5-jinjia2渲染前端页面","link":"#_7-5-jinjia2渲染前端页面","children":[]},{"level":3,"title":"7.6 大型工程木路结构设计-应用文件拆分","slug":"_7-6-大型工程木路结构设计-应用文件拆分","link":"#_7-6-大型工程木路结构设计-应用文件拆分","children":[]}]},{"level":2,"title":"第八章： 中间件、CORS、后台任务、测试用例","slug":"第八章-中间件、cors、后台任务、测试用例","link":"#第八章-中间件、cors、后台任务、测试用例","children":[{"level":3,"title":"8.1 中间件的概念和开发示例","slug":"_8-1-中间件的概念和开发示例","link":"#_8-1-中间件的概念和开发示例","children":[]},{"level":3,"title":"8.2 关于资源共享CORS的原理","slug":"_8-2-关于资源共享cors的原理","link":"#_8-2-关于资源共享cors的原理","children":[]},{"level":3,"title":"8.3 FastAPI的CORSMiddleware实现方式","slug":"_8-3-fastapi的corsmiddleware实现方式","link":"#_8-3-fastapi的corsmiddleware实现方式","children":[]},{"level":3,"title":"8.4 FastAPI实现蕾西Celery的后台任务","slug":"_8-4-fastapi实现蕾西celery的后台任务","link":"#_8-4-fastapi实现蕾西celery的后台任务","children":[]},{"level":3,"title":"8.5  后台任务更新","slug":"_8-5-后台任务更新","link":"#_8-5-后台任务更新","children":[]},{"level":3,"title":"8.6 TestClient编写测试用例","slug":"_8-6-testclient编写测试用例","link":"#_8-6-testclient编写测试用例","children":[]}]}],"git":{"createdTime":1691939318000,"updatedTime":1710835005000,"contributors":[{"name":"PaperDragon-SH","email":"2678885646@qq.com","commits":1}]},"readingTime":{"minutes":21.41,"words":6424},"filePathRelative":"note-book/Research_Develop/Python/FastAPI-Python高性能web框架.md","localizedDate":"2023年8月13日","excerpt":"\\n<blockquote>\\n<p>https://github.com/Paper-Dragon/learn-fastapi</p>\\n<p>https://www.bilibili.com/video/BV1iN411X72b</p>\\n</blockquote>\\n<h2>第2章 FastAPI介绍和项目准备</h2>\\n<h3>2.1 Starlette，Pydantic 与 FastAPI 框架是什么关系？</h3>\\n<p>python的类型提示，基于类型提示type hints</p>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"\\" data-title=\\"\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span></span></span>\\n<span class=\\"line\\"><span>from typing import List</span></span>\\n<span class=\\"line\\"><span>def func(name:str,age:int,l:List):</span></span>\\n<span class=\\"line\\"><span>    </span></span>\\n<span class=\\"line\\"><span>    print(name,age)</span></span>\\n<span class=\\"line\\"><span>    print(l)    </span></span>\\n<span class=\\"line\\"><span># Python的类型提示使用方法，使用的好能够提高代码的健壮性</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{b as comp,h as data};
