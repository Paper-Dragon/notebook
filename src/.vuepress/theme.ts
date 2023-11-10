import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "paper-dragon.github.io",
  
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

  encrypt: {
    config: {
      "/notebook/": ["1234"],
    },
  },

  // page meta
  metaLocales: {
    editLink: "在 Github 上编辑此页",
  },

  plugins: {
    blog: true,
    // You should generate and use your own comment service
    comment: {
      provider: "Giscus",
      repo: "Paper-Dragon/paper-dragon.github.io",
      repoId: "R_kgDOKGpjZw",
      category: "blog",
      categoryId: "DIC_kwDOKGpjZ84CauNO",
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
        // "VidStack",
        // "VideoPlayer",
        // "XiGua",
        // "YouTube",
      ],
    },


    // All features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: false,
      card: true,
      chart: false,
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: false,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: false,
      mark: true,
      mermaid: false,
      revealJs: true,
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
      vPre: true,
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
