import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
// import {cut} from "nodejs-jieba";

export default hopeTheme({
  hostname: "https://paper-dragon.github.io",
  
  fullscreen: true,
  
  author: {
    name: "PaperDragon",
    url: "https://github.com/Paper-Dragon",
    email: "2678885646@qq.com"
  },

  iconAssets: "fontawesome-with-brands",

  logo: "/logo.svg",

  repo: "https://github.com/Paper-Dragon/paper-dragon.github.io",

  docsDir: "src",

  docsBranch: "main",

  // navbar
  navbar,

  // sidebar
  sidebar,

  //footer: "主题使用 <a href=\"https://theme-hope.vuejs.press/zh/\">VuePress Theme Hope</a> | <a href=\"https://mister-hope.com/about/site.html\" target=\"_blank\">关于网站</a>",
  footer: "运维开发绿皮书",
  copyright: "copyleft 2023-至今 PaperDragon",
  displayFooter: true,

  // encrypt: {
  //   config: {
  //     "/notebook/": ["1234"],
  //   },
  // },

  blog: {
    timeline: "红了樱桃，绿了芭蕉"
  },

  // page meta
  metaLocales: {
    editLink: "在 Github 上编辑此页",
  },

  plugins: {
    blog: true,
    // You should generate and use your own comment service
    // comment: {
    //   provider: "Giscus",
    //   repo: "Paper-Dragon/paper-dragon.github.io",
    //   repoId: "R_kgDOKGpjZw",
    //   category: "blog",
    //   categoryId: "DIC_kwDOKGpjZ84CauNO",
    // },

    comment: {
      provider: "Waline",
      serverURL: "https://comment.geekery.cn/",
      reaction: true,
    },

    components: {
      // 你想使用的组件
      components: [
        // "ArtPlayer",
        // "AudioPlayer",
        // "Badge",
        // "BiliBili",
        // "CodePen",
        "PDF",
        // "Replit",
        // "Share",
        "SiteInfo",
        // "StackBlitz",
        "VPCard",
        // "VidStack",
        // "VideoPlayer",
        // "XiGua",
        // "YouTube",
      ],
    },
    feed: false,
    searchPro: {
      // 是否在输入时提供自动建议
      indexContent: true,
      // 是否在输入时提供自动建议
      autoSuggestions: false,
      // // 存储查询历史的最大数量
      // queryHistoryCount: 3,
      // // 存储结果历史的最大数量
      // resultHistoryCount: 10,
      // // 结束输入到开始搜索的延时
      // // searchDelay: 150,
      // suggestDelay: 60,
      // Custom field for search
      customFields: [
        {
          getter: ({ frontmatter }) =>
            <string | undefined>frontmatter.category ?? null,
          formatter: "分类: $content",
        },
      ],
      // // 输出文件名
      // worker: "search-pro-worker-XPathResult.js",
      // // 热重载
      hotReload: true,
      // 结果排序策略: 当有多个匹配的结果时，会按照策略对结果进行排序。`max` 表示最高分更高的页面会排在前面。`total` 表示总分更高的页面会排在前面
      sortStrategy: "max",
      // indexOptions: {
      //   tokenize: (text, fieldName) => fieldName === "id" ? [text] : cut(text, true),
      // },
    },

    // All features are enabled for demo, only preserve features you need here
    mdEnhance: {
       // https://theme-hope.vuejs.press/zh/guide/markdown/align.html
      align: false,
      // 是否启用自定义属性支持
      attrs: false,
      // 是否启用图表支持 https://theme-hope.vuejs.press/zh/guide/markdown/chartjs.html
      chart: false,    
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      // 是否启用流程图支持
      flowchart: false,
      // 是否支持完整的 GFM 语法。
      gfm: false,
      imgLazyload: true,
      imgSize: true,
      include: true,
      // 是否通过 KaTeX 启用 TeX 语法支持
      katex: false,
      mark: true,
      // 是否通过 Math Jax 启用 TeX 语法支持
      mathjax: false,
      // mermaid流程图 https://mermaid.js.org/
      mermaid: true,
      // 是否启用幻灯片支持。你可以传递选项控制导入的插件和主题
      revealJs: false,
      playground: {
        presets: ["ts", "vue"],
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: false,
      vuePlayground: true,
    },

    // uncomment these if you want a pwa
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
