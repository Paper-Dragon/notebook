import{a as e,c as a,g as t,o as i}from"./app-cZ-25As0.js";const l="/assets/20191031161908405-16919219329121-D44-kTRO.png",o="/assets/watermark_type_ZmFuZ3poZW5naGVpdGk_shadow_10_text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODgxNTk5OA___size_16_color_FFFFFF_t_70-16919219356843-Csm-zIe5.png",r={};function s(p,n){return i(),a("div",null,[...n[0]||(n[0]=[t('<h1 id="c语言volatile关键字详解" tabindex="-1"><a class="header-anchor" href="#c语言volatile关键字详解"><span>C语言volatile关键字详解</span></a></h1><h2 id="_1-volatile和什么有关" tabindex="-1"><a class="header-anchor" href="#_1-volatile和什么有关"><span>1.volatile和什么有关</span></a></h2><p>百度翻译是这样子翻译volatile的：</p><p><img src="'+l+`" alt="img"></p><p>volatile属于C语言的关键字，《C Primer Plus》 是这样解释关键字的：关键字是C语言的词汇，由于编译器不具备真正的智能，所以你必须用编译器能理解的术语表示你的意图。开发者告诉编译器该变量是易变的，无非就是希望编译器去注意该变量的状态，时刻注意该变量是易变的，每次读取该变量的值都重新从内存中读取。（ahhhh，是不是一脸蒙蔽，举个例子吧）</p><pre><code>int i = 10;
int main(void){
 
    int a, b;
 
    a = i;
    ...//伪代码，里面不含有对 a 、 b 以及 i的操作
    b = i;
 
    if(a == b){
        printf(&quot;a = b&quot;);
    }
    else {
        printf(&quot;a != b&quot;);
    }
    return 0;
}
</code></pre><p>如上代码，如果选择编译器优化，可能会被编译成如下代码（当然不是在C语言层面上优化，而是在汇编过程优化，只是使用C程序举例）：</p><pre><code>int i = 10;
int main(void){
 
    int a, b;
 
    a = i;
    ...//伪代码，里面不含有对 a 、 b 以及 i的操作
    b = i;
 
    printf(&quot;a = b&quot;);

    return 0;
}
</code></pre><p>因为在仅仅从main主函数来看，a == b是必然的，那么在什么情况，a 和 b不是必然相等呢？</p><pre><code>1. i 是其他子线程与主线程共享的全局变量，其他子线程有可能修改 i 值；

2. i 是中断函数与主函数共享的全局变量，中断函数有可能修改 i 值；

3. i 属于硬件寄存器，CPU可能通过硬件直接改变 i 的值（例如寄存器的标志位）
</code></pre><p>但是仔细想一想，好像我们都遇到过上述情况，也没有对相对应的变量使用volatile修饰呀？也没出现奇怪的问题呀？本小白猜测，大佬您是不是没有开启编译器优化，编译器其实是默认不优化的，这对入门者是友好的，但是当进入企业开发中，我们可能就会遇到 leader 在编译源码时，选择了编译器优化，以减少可执行程序大小和提高性能，这时候我们就不得不去考虑编译器优化问题，如何启动编译器优化，我们结合 GCC 编译器和 keil 开发软件讲解。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>使用GCC编译器时，在编译脚本命令加入 -On  ; n: 0 ~ 3，数字代表优化等级，数字越大，优化级别越高。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>例如：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>gcc -O2 -O hello hello.c</span></span>
<span class="line"><span></span></span>
<span class="line"><span>使用 O2 优化级别编译 hello.c</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用keil 软件，我们可以通过如下操作选择优化级别：</p><p><img src="`+o+`" alt="img"></p><h2 id="_2-volatile关键字什么情况下要用" tabindex="-1"><a class="header-anchor" href="#_2-volatile关键字什么情况下要用"><span>2.volatile关键字什么情况下要用</span></a></h2><pre><code>此博文为了限幅，达到更好的阅读效果，仅仅对如下几个方面进行简单分析，如需更加深入了解，可以访问实验博文进行查看。
</code></pre><h3 id="_2-1自定义延时函数" tabindex="-1"><a class="header-anchor" href="#_2-1自定义延时函数"><span>2.1自定义延时函数</span></a></h3><pre><code>#include &lt;stdio.h&gt;
 
void delay(long val);
int main(){
					
	delay(1000000);
 
	return 0;
}
 
void delay(long val){
 
	while(val--);
}
</code></pre><p>相信大佬们对如上程序都挺熟悉的，特别是玩过单片机的同学，主要是通过CPU不断进行无意义的操作达到延时的效果，这种操作如果不启用编译器优化是可以达到预期效果的，但是启用编译器优化就会被优化成如下效果（当然不是在C语言层面上优化，而是在汇编过程优化，只是使用C程序举例）：</p><pre><code>#include &lt;stdio.h&gt;
 
void delay(long val);
int main(){
					
	delay(1000000);
 
	return 0;
}
 
void delay(long val){
 
	;
}
</code></pre><p>这个时候，delay函数就起不了效果了，需要使用 volatile 修饰 val ；具体可见： 编译器优化对自定义延时程序的影响(volatile详解实验一)</p><h3 id="_2-2多线程共享的全局变量" tabindex="-1"><a class="header-anchor" href="#_2-2多线程共享的全局变量"><span>2.2多线程共享的全局变量</span></a></h3><pre><code>多线程数据安全问题一直是计算机领域十分常见的问题，为了解决这类问题，衍生出互斥锁、条件变量、临界区以及自旋锁等解决办法，如上都是为了线程数据同步，但是要做到线程数据同步，我们还需要注意一个编译器优化问题。

我们都知道，每一个线程虽然共享一个进程的资源，但是每个线程同样拥有自己的私有堆栈，保证每个线程函数中定义的局部变量相互之间不可见；线程间通信是十分简单的，其中一个十分常见的方式就是通过共享全局变量，全局变量对于每一个线程都是可见的，但是线程的每一次读写全局变量都是对全局变量直接操作吗，答案是否定的。

例如下面这个操作（伪代码）：

    //一个全局变量a
    int a = 1;

    int main(){

        int b,c,d,e,f;

        //多次赋值
        b = a;
        c = a;
        d = a;
        e = a;
        f = a;
        ....
    }

    void *child_pth_fun{

        //子线程修改a值
        a = 2;
        ......

    }

如果每次赋值都去内存中读入 a , 对于程序来说开销实在太大了，这时候编译器优化会引入一个中间变量，加快程序执行效率，也正是因为优化原因，如果这个全局变量是多线程共享的，子线程可能在任意时刻改变a的值，但是主程序引入的中间变量值确实过去a的值，就可能出现数据未同步问题。
</code></pre><p>会出现什么问题、怎么解决此类问题、怎么去复现数据不同步问题、想看看博主有多傻逼 都看看<br> 编译器优化对多线程数据同步的影响(volatile详解实验二）</p><h3 id="_2-3中断函数与主函数共享的全局变量" tabindex="-1"><a class="header-anchor" href="#_2-3中断函数与主函数共享的全局变量"><span>2.3中断函数与主函数共享的全局变量</span></a></h3><pre><code>中断函数和主函数共享的全局变量需要使用 volatile 修饰的情况是相似的。大家可以感受实验二，去做一个中断的实验。（对于只学过stm32，没有接触linux的同学可以在下面评论，博主按照需求去开实验三）
</code></pre><p>编译器优化对中断数据同步的影响(volatile详解实验三）</p><h3 id="_2-4硬件寄存器" tabindex="-1"><a class="header-anchor" href="#_2-4硬件寄存器"><span>2.4硬件寄存器</span></a></h3><pre><code>什么叫硬件寄存器，学过硬件的同学应该不陌生，我们在做按键检测的时候是不是下面这种流程：

1.设置GPIO对应的寄存器配置成输入模式 

2.不断地去访问GPIO电平标志寄存器（或者是一个寄存器的标志位）

3.根据寄存器值的某个二进制位确定当前引脚电平

那么有没有想过一个问题，是什么去改变硬件寄存器的值？其实，硬件寄存器上的值的是和底层电路相关的，硬件寄存器的值会影响电路，电路也会反过来影响硬件寄存器的值。

所以在这种情况下，编译器更不应该拷贝副本，而应该每次读写都从内存中读写，保证数据正确，声明成volatile可以防止出现数据出错问题。
</code></pre><p>例如：</p><pre><code>//GPIOE13 ----&gt;LEDD7
//GPIOA28 ----&gt; KEY2
//注意：裸机程序是直接在硬件上运行的程序，是不能使用标准C库。
 
#define GPIOEALTFN0 (*(volatile unsigned int *)0xC001E020)
#define GPIOEOUTENB (*(volatile unsigned int *)0xC001E004)
#define GPIOEOUT	(*(volatile unsigned int *)0xC001E000)
 
#define GPIOAALTFN1 (*(volatile unsigned int *)0xC001A024)
#define GPIOAOUTENB (*(volatile unsigned int *)0xC001A004)
#define GPIOAPAD	(*(volatile unsigned int *)0xC001A018)
 
void _start(void) //gcc编译器中，裸机程序的入口是start，不是main
{
	GPIOEALTFN0 &amp;= ~(3&lt;&lt;26);
	GPIOEOUTENB |= (1&lt;&lt;13);
	
	GPIOAALTFN1 &amp;= ~(3&lt;&lt;24);
	GPIOAOUTENB &amp;= ~(1&lt;&lt;28);
</code></pre><p>​<br> ​ while(1) ​ { ​ //读取GPIO引脚电平 ​ if(!(GPIOAPAD &amp; (1&lt;&lt;28))) ​ GPIOEOUT &amp;= ~(1&lt;&lt;13); ​ else ​ GPIOEOUT |= (1&lt;&lt;13); ​ } ​ }</p><p>这种情况加volatile的情况是最多的，比如stm32函数库底层的寄存器定义就是加了volatile的：</p><p>所以，也没有实验ahhh！</p>`,34)])])}const c=e(r,[["render",s]]),h=JSON.parse('{"path":"/note-book/Research_Develop/C/C%E8%AF%AD%E8%A8%80volatile%E5%85%B3%E9%94%AE%E5%AD%97%E8%AF%A6%E8%A7%A3.html","title":"C语言volatile关键字详解","lang":"zh-CN","frontmatter":{"description":"C语言volatile关键字详解 1.volatile和什么有关 百度翻译是这样子翻译volatile的： img volatile属于C语言的关键字，《C Primer Plus》 是这样解释关键字的：关键字是C语言的词汇，由于编译器不具备真正的智能，所以你必须用编译器能理解的术语表示你的意图。开发者告诉编译器该变量是易变的，无非就是希望编译器去注意...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"C语言volatile关键字详解\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-09-12T17:44:20.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Paper-Dragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/Research_Develop/C/C%E8%AF%AD%E8%A8%80volatile%E5%85%B3%E9%94%AE%E5%AD%97%E8%AF%A6%E8%A7%A3.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"C语言volatile关键字详解"}],["meta",{"property":"og:description","content":"C语言volatile关键字详解 1.volatile和什么有关 百度翻译是这样子翻译volatile的： img volatile属于C语言的关键字，《C Primer Plus》 是这样解释关键字的：关键字是C语言的词汇，由于编译器不具备真正的智能，所以你必须用编译器能理解的术语表示你的意图。开发者告诉编译器该变量是易变的，无非就是希望编译器去注意..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-09-12T17:44:20.000Z"}],["meta",{"property":"article:modified_time","content":"2024-09-12T17:44:20.000Z"}]]},"git":{"createdTime":1691939318000,"updatedTime":1726163060000,"contributors":[{"name":"Paper-Dragon","username":"Paper-Dragon","email":"2678885646@qq.com","commits":2,"url":"https://github.com/Paper-Dragon"},{"name":"PaperDragon-SH","username":"PaperDragon-SH","email":"2678885646@qq.com","commits":1,"url":"https://github.com/PaperDragon-SH"}],"changelog":[{"hash":"b0a548ca2488d7c6ffde57c0a85ecb2a42e4a21a","time":1726163060000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"markdown format"},{"hash":"cb0daa33b6329eb21784aa12ccdc214113fb2885","time":1710835005000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"c"},{"hash":"392a519398b2e846f316619fbe831e100164de7c","time":1691939318000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Create The Worid!"}]},"readingTime":{"minutes":6.65,"words":1996},"filePathRelative":"note-book/Research_Develop/C/C语言volatile关键字详解.md","excerpt":"\\n<h2>1.volatile和什么有关</h2>\\n<p>百度翻译是这样子翻译volatile的：</p>\\n<p></p>\\n<p>volatile属于C语言的关键字，《C Primer Plus》 是这样解释关键字的：关键字是C语言的词汇，由于编译器不具备真正的智能，所以你必须用编译器能理解的术语表示你的意图。开发者告诉编译器该变量是易变的，无非就是希望编译器去注意该变量的状态，时刻注意该变量是易变的，每次读取该变量的值都重新从内存中读取。（ahhhh，是不是一脸蒙蔽，举个例子吧）</p>\\n<pre><code>int i = 10;\\nint main(void){\\n \\n    int a, b;\\n \\n    a = i;\\n    ...//伪代码，里面不含有对 a 、 b 以及 i的操作\\n    b = i;\\n \\n    if(a == b){\\n        printf(\\"a = b\\");\\n    }\\n    else {\\n        printf(\\"a != b\\");\\n    }\\n    return 0;\\n}\\n</code></pre>","autoDesc":true}');export{c as comp,h as data};
