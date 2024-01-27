import { defineUserConfig } from "vuepress";
import { umamiAnalyticsPlugin } from 'vuepress-plugin-umami-analytics'
//import { cut } from "nodejs-jieba";
//import { searchProPlugin } from "vuepress-plugin-search-pro";
import theme from "./theme.js";
import { viteBundler } from '@vuepress/bundler-vite';

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "运维开发绿皮书",
  description: "运维开发绿皮书,放置我的笔记、搜集、摘录、实践，保持好奇心。看文需谨慎，后果很严重。",

  bundler: viteBundler(),
  theme,

  head: [
      ["script",
        {},
      `
      /*禁用F12*/
      document.onkeydown = function(){
          if(window.event.keyCode==123) {
              var x;
              var r=confirm('大佬，别扒了！不妨加个友链？\\n点击确认键跳转到友链！\\n\\n执意要做？亦或是再按下F12可调出控制台\\n');
              if (r==true){
                //x="你按下的是\\"确定\\"按钮。";
                window.location.replace("/友链/友链.html");
              }
              else{
                x="你按下的是\\"取消\\"按钮。";
              }
              // document.write(x)
              event.preventDefault(); // 阻止默认事件行为
              event.keyCode=0;
              event.returnValue=false;
          }
      }
      `,
      ],
  ],
  plugins: [
    // 迁移到theme.ts中
    // searchProPlugin({
    //   indexContent: true,
    //   worker: "search-pro-worker-XPathResult.js",
    //   hotReload: true,
    //   indexOptions: {
    //     tokenize: (text, fieldName) =>
    //       fieldName === "id" ? [text] : cut(text, true),
    //   },
    //   // customFields: [
    //   //   // {
    //   //   //   getter: ({ frontmatter }) =>
    //   //   //     <string | undefined>frontmatter.category ?? null,
    //   //   //   formatter: "分类: $content",
    //   //   // },
    //   // ],
    //   autoSuggestions: false,
    //   suggestDelay: 60,
    // }),
    umamiAnalyticsPlugin({
      // options
      id: "eecd3f56-5668-4c9e-b123-b2853b91a310",
      src: "https://analytics.umami.is/script.js"
    }),
  ],

  // Enable it with pwa
  // shouldPrefetch: false,
});

