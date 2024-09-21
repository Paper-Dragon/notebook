import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
// import {cut} from "nodejs-jieba";

export default hopeTheme({
  hostname: "https://www.geekery.cn",

  fullscreen: true,

  author: {
    name: "PaperDragon",
    url: "https://github.com/Paper-Dragon",
    email: "2678885646@qq.com"
  },

  iconAssets: "fontawesome-with-brands",

  logo: "/logo.svg",

  repo: "https://github.com/Paper-Dragon/notebook",

  docsDir: "src",

  docsBranch: "main",

  darkmode: "disable",

  print: true,

  // navbar
  navbar,

  // sidebar
  sidebar,

  //footer: "主题使用 <a href=\"https://theme-hope.vuejs.press/zh/\">VuePress Theme Hope</a> | <a href=\"https://mister-hope.com/about/site.html\" target=\"_blank\">关于网站</a>",
  footer: "运维开发绿皮书",
  copyright: "copyleft 2023-至今 PaperDragon",
  displayFooter: true,

  encrypt: {
    config: {
      "/note-book/Security/": ["paperdragon666"],
    },
  },

  blog: {
    timeline: "红了樱桃，绿了芭蕉"
  },

  // page meta
  metaLocales: {
    editLink: "在 Github 上编辑此页",
  },

  plugins: {
    blog: true,
    comment: {
      provider: "Waline",
      serverURL: "https://comment.geekery.cn/",
      // 为文章增加表情互动功能，设置为 true 提供默认表情，也可以通过设置表情地址数组来自定义表情图片，最大支持 8 个表情。
      reaction: true,
      // 评论列表排序方式。可选值: 'latest', 'oldest', 'hottest'
      commentSorting: "latest",
      // 评论者相关属性。可选值: 'nick', 'mail', 'link',
      // 默认值: ['nick', 'mail', 'link']
      meta: ['nick', 'mail', 'link'],
      // 设置必填项，默认匿名，可选值:
      requiredMeta: ['nick', 'mail'],
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
      // 是否启用流程图支持
      flowchart: false,
      // 是否支持完整的 GFM 语法。
      gfm: false,
      // 是否启用 Markdown 导入支持。你可以传入一个函数进行路径解析。
      include: false,

      mark: false,
      // mermaid流程图 https://mermaid.js.org/
      mermaid: true,
      // 是否启用幻灯片支持。你可以传递选项控制导入的插件和主题
      revealJs: false,


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
      sub: false,
      sup: false,
      tabs: true,
      vPre: false,
      vuePlayground: false,
    },
    linksCheck: true,
    components: {
      // 你想使用的组件
      components: [
        // "ArtPlayer",
        // "Badge",
        // "BiliBili",
        // "CodePen",
        //"FontIcon",
        "PDF",
        // "Share",
        // "StackBlitz",
        // "VPBanner",
        "VPCard",
        "VidStack",
        "SiteInfo"
        // "XiGua",
      ],
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
