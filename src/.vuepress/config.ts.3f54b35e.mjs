// src/.vuepress/config.ts
import { defineUserConfig } from "vuepress";
import { cut } from "nodejs-jieba";
import { umamiAnalyticsPlugin } from "vuepress-plugin-umami-analytics";
import { searchProPlugin } from "vuepress-plugin-search-pro";

// src/.vuepress/theme.ts
import { hopeTheme } from "vuepress-theme-hope";

// src/.vuepress/navbar.ts
import { navbar } from "vuepress-theme-hope";
var navbar_default = navbar([
  "/",
  {
    text: "\u4F7F\u7528\u6307\u5357",
    icon: "book",
    link: "/note-book"
  },
  {
    text: "\u65F6\u95F4\u7EBF",
    icon: "history",
    link: "/timeline"
  },
  {
    text: "\u5B9E\u65F6\u8BBF\u5BA2",
    icon: "chart-simple",
    link: "https://analytics.umami.is/share/pvHcnC9eaFEzXn99/DevOps-Book"
  }
]);

// src/.vuepress/sidebar.ts
import { sidebar } from "vuepress-theme-hope";
var sidebar_default = sidebar({
  "/": [
    "",
    {
      text: "note-book",
      icon: "book",
      // 是否可折叠
      collapsible: true,
      prefix: "note-book/",
      link: "note-book/",
      children: "structure"
    },
    {
      text: "PyQt5\u5FEB\u901F\u4E0A\u624B-\u738B\u94ED\u4E1C",
      icon: "book",
      // 是否可折叠
      collapsible: true,
      prefix: "PyQt5\u5FEB\u901F\u4E0A\u624B-\u738B\u94ED\u4E1C/",
      link: "PyQt5\u5FEB\u901F\u4E0A\u624B-\u738B\u94ED\u4E1C/",
      children: "structure"
    },
    "slides"
  ]
});

// src/.vuepress/theme.ts
import "echarts-wordcloud";
var theme_default = hopeTheme({
  hostname: "paper-dragon.github.io",
  fullscreen: true,
  author: {
    name: "PaperDragon",
    url: "https://github.com/Paper-Dragon"
  },
  iconAssets: "fontawesome-with-brands",
  logo: "/logo.svg",
  repo: "https://github.com/Paper-Dragon/paper-dragon.github.io",
  docsDir: "src",
  docsBranch: "main",
  // navbar
  navbar: navbar_default,
  // sidebar
  sidebar: sidebar_default,
  footer: "\u9ED8\u8BA4\u9875\u811A",
  displayFooter: true,
  encrypt: {
    config: {
      "/notebook/": ["1234"]
    }
  },
  // page meta
  metaLocales: {
    editLink: "\u5728 Github \u4E0A\u7F16\u8F91\u6B64\u9875"
  },
  plugins: {
    blog: true,
    // You should generate and use your own comment service
    // comment: {
    //   provider: "Giscus",
    //   repo: "vuepress-theme-hope/giscus-discussions",
    //   repoId: "R_kgDOG_Pt2A",
    //   category: "Announcements",
    //   categoryId: "DIC_kwDOG_Pt2M4COD69",
    // },
    components: {
      // 你想使用的组件
      components: [
        // "ArtPlayer",
        // "AudioPlayer",
        // "Badge",
        // "BiliBili",
        // "CodePen",
        "PDF"
        // "Replit",
        // "Share",
        // "SiteInfo",
        // "StackBlitz",
        // "VidStack",
        // "VideoPlayer",
        // "XiGua",
        // "YouTube",
      ]
    },
    // All features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      revealJs: true,
      playground: {
        presets: ["ts", "vue"]
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended"
              };
          }
        }
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true
    }
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
  }
});

// src/.vuepress/config.ts
var config_default = defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "\u8FD0\u7EF4\u5F00\u53D1\u7EFF\u76AE\u4E66",
  description: "\u8FD0\u7EF4\u5F00\u53D1\u7EFF\u76AE\u4E66,\u653E\u7F6E\u6211\u7684\u7B14\u8BB0\u3001\u641C\u96C6\u3001\u6458\u5F55\u3001\u5B9E\u8DF5\uFF0C\u4FDD\u6301\u597D\u5947\u5FC3\u3002\u770B\u6587\u9700\u8C28\u614E\uFF0C\u540E\u679C\u5F88\u4E25\u91CD\u3002",
  theme: theme_default,
  plugins: [
    searchProPlugin({
      indexContent: true,
      worker: "search-pro-worker-XPathResult.js",
      hotReload: true,
      indexOptions: {
        tokenize: (text, fieldName) => fieldName === "id" ? [text] : cut(text, true)
      },
      // customFields: [
      //   // {
      //   //   getter: ({ frontmatter }) =>
      //   //     <string | undefined>frontmatter.category ?? null,
      //   //   formatter: "分类: $content",
      //   // },
      // ],
      autoSuggestions: false,
      suggestDelay: 60
    }),
    umamiAnalyticsPlugin({
      // options 
      id: "eecd3f56-5668-4c9e-b123-b2853b91a310",
      src: "https://analytics.umami.is/script.js"
    })
  ]
  // Enable it with pwa
  // shouldPrefetch: false,
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjLy52dWVwcmVzcy9jb25maWcudHMiLCAic3JjLy52dWVwcmVzcy90aGVtZS50cyIsICJzcmMvLnZ1ZXByZXNzL25hdmJhci50cyIsICJzcmMvLnZ1ZXByZXNzL3NpZGViYXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOi9wYXBlci1kcmFnb24uZ2l0aHViLmlvL3NyYy8udnVlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHBhcGVyLWRyYWdvbi5naXRodWIuaW9cXFxcc3JjXFxcXC52dWVwcmVzc1xcXFxjb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3BhcGVyLWRyYWdvbi5naXRodWIuaW8vc3JjLy52dWVwcmVzcy9jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVVc2VyQ29uZmlnIH0gZnJvbSBcInZ1ZXByZXNzXCI7XHJcbmltcG9ydCB7IGN1dCB9IGZyb20gXCJub2RlanMtamllYmFcIjtcclxuaW1wb3J0IHsgdW1hbWlBbmFseXRpY3NQbHVnaW4gfSBmcm9tICd2dWVwcmVzcy1wbHVnaW4tdW1hbWktYW5hbHl0aWNzJ1xyXG5pbXBvcnQgeyBzZWFyY2hQcm9QbHVnaW4gfSBmcm9tIFwidnVlcHJlc3MtcGx1Z2luLXNlYXJjaC1wcm9cIlxyXG5pbXBvcnQgdGhlbWUgZnJvbSBcIi4vdGhlbWUuanNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZVVzZXJDb25maWcoe1xyXG4gIGJhc2U6IFwiL1wiLFxyXG5cclxuICBsYW5nOiBcInpoLUNOXCIsXHJcbiAgdGl0bGU6IFwiXHU4RkQwXHU3RUY0XHU1RjAwXHU1M0QxXHU3RUZGXHU3NkFFXHU0RTY2XCIsXHJcbiAgZGVzY3JpcHRpb246IFwiXHU4RkQwXHU3RUY0XHU1RjAwXHU1M0QxXHU3RUZGXHU3NkFFXHU0RTY2LFx1NjUzRVx1N0Y2RVx1NjIxMVx1NzY4NFx1N0IxNFx1OEJCMFx1MzAwMVx1NjQxQ1x1OTZDNlx1MzAwMVx1NjQ1OFx1NUY1NVx1MzAwMVx1NUI5RVx1OERGNVx1RkYwQ1x1NEZERFx1NjMwMVx1NTk3RFx1NTk0N1x1NUZDM1x1MzAwMlx1NzcwQlx1NjU4N1x1OTcwMFx1OEMyOFx1NjE0RVx1RkYwQ1x1NTQwRVx1Njc5Q1x1NUY4OFx1NEUyNVx1OTFDRFx1MzAwMlwiLFxyXG5cclxuICB0aGVtZSxcclxuXHJcbiAgcGx1Z2luczogW1xyXG4gICAgc2VhcmNoUHJvUGx1Z2luKHtcclxuICAgICAgaW5kZXhDb250ZW50OiB0cnVlLFxyXG4gICAgICB3b3JrZXI6IFwic2VhcmNoLXByby13b3JrZXItWFBhdGhSZXN1bHQuanNcIixcclxuICAgICAgaG90UmVsb2FkOiB0cnVlLFxyXG4gICAgICBpbmRleE9wdGlvbnM6IHtcclxuICAgICAgICB0b2tlbml6ZTogKHRleHQsIGZpZWxkTmFtZSkgPT5cclxuICAgICAgICAgIGZpZWxkTmFtZSA9PT0gXCJpZFwiID8gW3RleHRdIDogY3V0KHRleHQsIHRydWUpLFxyXG4gICAgICB9LFxyXG4gICAgICAvLyBjdXN0b21GaWVsZHM6IFtcclxuICAgICAgLy8gICAvLyB7XHJcbiAgICAgIC8vICAgLy8gICBnZXR0ZXI6ICh7IGZyb250bWF0dGVyIH0pID0+XHJcbiAgICAgIC8vICAgLy8gICAgIDxzdHJpbmcgfCB1bmRlZmluZWQ+ZnJvbnRtYXR0ZXIuY2F0ZWdvcnkgPz8gbnVsbCxcclxuICAgICAgLy8gICAvLyAgIGZvcm1hdHRlcjogXCJcdTUyMDZcdTdDN0I6ICRjb250ZW50XCIsXHJcbiAgICAgIC8vICAgLy8gfSxcclxuICAgICAgLy8gXSxcclxuICAgICAgYXV0b1N1Z2dlc3Rpb25zOiBmYWxzZSxcclxuICAgICAgc3VnZ2VzdERlbGF5OiA2MCxcclxuICAgIH0pLFxyXG4gICAgdW1hbWlBbmFseXRpY3NQbHVnaW4oe1xyXG4gICAgICAvLyBvcHRpb25zIFxyXG4gICAgICBpZDogXCJlZWNkM2Y1Ni01NjY4LTRjOWUtYjEyMy1iMjg1M2I5MWEzMTBcIixcclxuICAgICAgc3JjOiBcImh0dHBzOi8vYW5hbHl0aWNzLnVtYW1pLmlzL3NjcmlwdC5qc1wiXHJcbiAgICB9KSxcclxuICBdLFxyXG5cclxuICAvLyBFbmFibGUgaXQgd2l0aCBwd2FcclxuICAvLyBzaG91bGRQcmVmZXRjaDogZmFsc2UsXHJcbn0pO1xyXG5cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOi9wYXBlci1kcmFnb24uZ2l0aHViLmlvL3NyYy8udnVlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHBhcGVyLWRyYWdvbi5naXRodWIuaW9cXFxcc3JjXFxcXC52dWVwcmVzc1xcXFx0aGVtZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovcGFwZXItZHJhZ29uLmdpdGh1Yi5pby9zcmMvLnZ1ZXByZXNzL3RoZW1lLnRzXCI7aW1wb3J0IHsgaG9wZVRoZW1lIH0gZnJvbSBcInZ1ZXByZXNzLXRoZW1lLWhvcGVcIjtcclxuaW1wb3J0IG5hdmJhciBmcm9tIFwiLi9uYXZiYXIuanNcIjtcclxuaW1wb3J0IHNpZGViYXIgZnJvbSBcIi4vc2lkZWJhci5qc1wiO1xyXG5pbXBvcnQgJ2VjaGFydHMtd29yZGNsb3VkJztcclxuZXhwb3J0IGRlZmF1bHQgaG9wZVRoZW1lKHtcclxuICBob3N0bmFtZTogXCJwYXBlci1kcmFnb24uZ2l0aHViLmlvXCIsXHJcbiAgXHJcbiAgZnVsbHNjcmVlbjogdHJ1ZSxcclxuICBcclxuICBhdXRob3I6IHtcclxuICAgIG5hbWU6IFwiUGFwZXJEcmFnb25cIixcclxuICAgIHVybDogXCJodHRwczovL2dpdGh1Yi5jb20vUGFwZXItRHJhZ29uXCIsXHJcbiAgfSxcclxuXHJcbiAgaWNvbkFzc2V0czogXCJmb250YXdlc29tZS13aXRoLWJyYW5kc1wiLFxyXG5cclxuICBsb2dvOiBcIi9sb2dvLnN2Z1wiLFxyXG5cclxuICByZXBvOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9QYXBlci1EcmFnb24vcGFwZXItZHJhZ29uLmdpdGh1Yi5pb1wiLFxyXG5cclxuICBkb2NzRGlyOiBcInNyY1wiLFxyXG5cclxuICBkb2NzQnJhbmNoOiBcIm1haW5cIixcclxuXHJcbiAgLy8gbmF2YmFyXHJcbiAgbmF2YmFyLFxyXG5cclxuICAvLyBzaWRlYmFyXHJcbiAgc2lkZWJhcixcclxuXHJcbiAgZm9vdGVyOiBcIlx1OUVEOFx1OEJBNFx1OTg3NVx1ODExQVwiLFxyXG5cclxuICBkaXNwbGF5Rm9vdGVyOiB0cnVlLFxyXG5cclxuICBlbmNyeXB0OiB7XHJcbiAgICBjb25maWc6IHtcclxuICAgICAgXCIvbm90ZWJvb2svXCI6IFtcIjEyMzRcIl0sXHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIC8vIHBhZ2UgbWV0YVxyXG4gIG1ldGFMb2NhbGVzOiB7XHJcbiAgICBlZGl0TGluazogXCJcdTU3MjggR2l0aHViIFx1NEUwQVx1N0YxNlx1OEY5MVx1NkI2NFx1OTg3NVwiLFxyXG4gIH0sXHJcblxyXG4gIHBsdWdpbnM6IHtcclxuICAgIGJsb2c6IHRydWUsXHJcbiAgICAvLyBZb3Ugc2hvdWxkIGdlbmVyYXRlIGFuZCB1c2UgeW91ciBvd24gY29tbWVudCBzZXJ2aWNlXHJcbiAgICAvLyBjb21tZW50OiB7XHJcbiAgICAvLyAgIHByb3ZpZGVyOiBcIkdpc2N1c1wiLFxyXG4gICAgLy8gICByZXBvOiBcInZ1ZXByZXNzLXRoZW1lLWhvcGUvZ2lzY3VzLWRpc2N1c3Npb25zXCIsXHJcbiAgICAvLyAgIHJlcG9JZDogXCJSX2tnRE9HX1B0MkFcIixcclxuICAgIC8vICAgY2F0ZWdvcnk6IFwiQW5ub3VuY2VtZW50c1wiLFxyXG4gICAgLy8gICBjYXRlZ29yeUlkOiBcIkRJQ19rd0RPR19QdDJNNENPRDY5XCIsXHJcbiAgICAvLyB9LFxyXG4gICAgY29tcG9uZW50czoge1xyXG4gICAgICAvLyBcdTRGNjBcdTYwRjNcdTRGN0ZcdTc1MjhcdTc2ODRcdTdFQzRcdTRFRjZcclxuICAgICAgY29tcG9uZW50czogW1xyXG4gICAgICAgIC8vIFwiQXJ0UGxheWVyXCIsXHJcbiAgICAgICAgLy8gXCJBdWRpb1BsYXllclwiLFxyXG4gICAgICAgIC8vIFwiQmFkZ2VcIixcclxuICAgICAgICAvLyBcIkJpbGlCaWxpXCIsXHJcbiAgICAgICAgLy8gXCJDb2RlUGVuXCIsXHJcbiAgICAgICAgXCJQREZcIixcclxuICAgICAgICAvLyBcIlJlcGxpdFwiLFxyXG4gICAgICAgIC8vIFwiU2hhcmVcIixcclxuICAgICAgICAvLyBcIlNpdGVJbmZvXCIsXHJcbiAgICAgICAgLy8gXCJTdGFja0JsaXR6XCIsXHJcbiAgICAgICAgLy8gXCJWaWRTdGFja1wiLFxyXG4gICAgICAgIC8vIFwiVmlkZW9QbGF5ZXJcIixcclxuICAgICAgICAvLyBcIlhpR3VhXCIsXHJcbiAgICAgICAgLy8gXCJZb3VUdWJlXCIsXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvLyBBbGwgZmVhdHVyZXMgYXJlIGVuYWJsZWQgZm9yIGRlbW8sIG9ubHkgcHJlc2VydmUgZmVhdHVyZXMgeW91IG5lZWQgaGVyZVxyXG4gICAgbWRFbmhhbmNlOiB7XHJcbiAgICAgIGFsaWduOiB0cnVlLFxyXG4gICAgICBhdHRyczogdHJ1ZSxcclxuICAgICAgY2hhcnQ6IHRydWUsXHJcbiAgICAgIGNvZGV0YWJzOiB0cnVlLFxyXG4gICAgICBkZW1vOiB0cnVlLFxyXG4gICAgICBlY2hhcnRzOiB0cnVlLFxyXG4gICAgICBmaWd1cmU6IHRydWUsXHJcbiAgICAgIGZsb3djaGFydDogdHJ1ZSxcclxuICAgICAgZ2ZtOiB0cnVlLFxyXG4gICAgICBpbWdMYXp5bG9hZDogdHJ1ZSxcclxuICAgICAgaW1nU2l6ZTogdHJ1ZSxcclxuICAgICAgaW5jbHVkZTogdHJ1ZSxcclxuICAgICAga2F0ZXg6IHRydWUsXHJcbiAgICAgIG1hcms6IHRydWUsXHJcbiAgICAgIG1lcm1haWQ6IHRydWUsXHJcbiAgICAgIHJldmVhbEpzOiB0cnVlLFxyXG4gICAgICBwbGF5Z3JvdW5kOiB7XHJcbiAgICAgICAgcHJlc2V0czogW1widHNcIiwgXCJ2dWVcIl0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHN0eWxpemU6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBtYXRjaGVyOiBcIlJlY29tbWVuZGVkXCIsXHJcbiAgICAgICAgICByZXBsYWNlcjogKHsgdGFnIH0pID0+IHtcclxuICAgICAgICAgICAgaWYgKHRhZyA9PT0gXCJlbVwiKVxyXG4gICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0YWc6IFwiQmFkZ2VcIixcclxuICAgICAgICAgICAgICAgIGF0dHJzOiB7IHR5cGU6IFwidGlwXCIgfSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiUmVjb21tZW5kZWRcIixcclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBzdWI6IHRydWUsXHJcbiAgICAgIHN1cDogdHJ1ZSxcclxuICAgICAgdGFiczogdHJ1ZSxcclxuICAgICAgdlByZTogdHJ1ZSxcclxuICAgICAgdnVlUGxheWdyb3VuZDogdHJ1ZSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gdW5jb21tZW50IHRoZXNlIGlmIHlvdSB3YW50IGEgcHdhXHJcbiAgICAvLyBwd2E6IHtcclxuICAgIC8vICAgZmF2aWNvbjogXCIvZmF2aWNvbi5pY29cIixcclxuICAgIC8vICAgY2FjaGVIVE1MOiB0cnVlLFxyXG4gICAgLy8gICBjYWNoZVBpYzogdHJ1ZSxcclxuICAgIC8vICAgYXBwZW5kQmFzZTogdHJ1ZSxcclxuICAgIC8vICAgYXBwbGU6IHtcclxuICAgIC8vICAgICBpY29uOiBcIi9hc3NldHMvaWNvbi9hcHBsZS1pY29uLTE1Mi5wbmdcIixcclxuICAgIC8vICAgICBzdGF0dXNCYXJDb2xvcjogXCJibGFja1wiLFxyXG4gICAgLy8gICB9LFxyXG4gICAgLy8gICBtc1RpbGU6IHtcclxuICAgIC8vICAgICBpbWFnZTogXCIvYXNzZXRzL2ljb24vbXMtaWNvbi0xNDQucG5nXCIsXHJcbiAgICAvLyAgICAgY29sb3I6IFwiI2ZmZmZmZlwiLFxyXG4gICAgLy8gICB9LFxyXG4gICAgLy8gICBtYW5pZmVzdDoge1xyXG4gICAgLy8gICAgIGljb25zOiBbXHJcbiAgICAvLyAgICAgICB7XHJcbiAgICAvLyAgICAgICAgIHNyYzogXCIvYXNzZXRzL2ljb24vY2hyb21lLW1hc2stNTEyLnBuZ1wiLFxyXG4gICAgLy8gICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXHJcbiAgICAvLyAgICAgICAgIHB1cnBvc2U6IFwibWFza2FibGVcIixcclxuICAgIC8vICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgIC8vICAgICAgIH0sXHJcbiAgICAvLyAgICAgICB7XHJcbiAgICAvLyAgICAgICAgIHNyYzogXCIvYXNzZXRzL2ljb24vY2hyb21lLW1hc2stMTkyLnBuZ1wiLFxyXG4gICAgLy8gICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXHJcbiAgICAvLyAgICAgICAgIHB1cnBvc2U6IFwibWFza2FibGVcIixcclxuICAgIC8vICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgIC8vICAgICAgIH0sXHJcbiAgICAvLyAgICAgICB7XHJcbiAgICAvLyAgICAgICAgIHNyYzogXCIvYXNzZXRzL2ljb24vY2hyb21lLTUxMi5wbmdcIixcclxuICAgIC8vICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgLy8gICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgLy8gICAgICAgfSxcclxuICAgIC8vICAgICAgIHtcclxuICAgIC8vICAgICAgICAgc3JjOiBcIi9hc3NldHMvaWNvbi9jaHJvbWUtMTkyLnBuZ1wiLFxyXG4gICAgLy8gICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXHJcbiAgICAvLyAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAvLyAgICAgICB9LFxyXG4gICAgLy8gICAgIF0sXHJcbiAgICAvLyAgICAgc2hvcnRjdXRzOiBbXHJcbiAgICAvLyAgICAgICB7XHJcbiAgICAvLyAgICAgICAgIG5hbWU6IFwiRGVtb1wiLFxyXG4gICAgLy8gICAgICAgICBzaG9ydF9uYW1lOiBcIkRlbW9cIixcclxuICAgIC8vICAgICAgICAgdXJsOiBcIi9kZW1vL1wiLFxyXG4gICAgLy8gICAgICAgICBpY29uczogW1xyXG4gICAgLy8gICAgICAgICAgIHtcclxuICAgIC8vICAgICAgICAgICAgIHNyYzogXCIvYXNzZXRzL2ljb24vZ3VpZGUtbWFza2FibGUucG5nXCIsXHJcbiAgICAvLyAgICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXHJcbiAgICAvLyAgICAgICAgICAgICBwdXJwb3NlOiBcIm1hc2thYmxlXCIsXHJcbiAgICAvLyAgICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgLy8gICAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgIF0sXHJcbiAgICAvLyAgICAgICB9LFxyXG4gICAgLy8gICAgIF0sXHJcbiAgICAvLyAgIH0sXHJcbiAgICAvLyB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6L3BhcGVyLWRyYWdvbi5naXRodWIuaW8vc3JjLy52dWVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxccGFwZXItZHJhZ29uLmdpdGh1Yi5pb1xcXFxzcmNcXFxcLnZ1ZXByZXNzXFxcXG5hdmJhci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovcGFwZXItZHJhZ29uLmdpdGh1Yi5pby9zcmMvLnZ1ZXByZXNzL25hdmJhci50c1wiO2ltcG9ydCB7IG5hdmJhciB9IGZyb20gXCJ2dWVwcmVzcy10aGVtZS1ob3BlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuYXZiYXIoW1xyXG4gIFwiL1wiLFxyXG4gIHtcclxuICAgIHRleHQ6IFwiXHU0RjdGXHU3NTI4XHU2MzA3XHU1MzU3XCIsXHJcbiAgICBpY29uOiBcImJvb2tcIixcclxuICAgIGxpbms6IFwiL25vdGUtYm9va1wiXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiBcIlx1NjVGNlx1OTVGNFx1N0VCRlwiLFxyXG4gICAgaWNvbjogXCJoaXN0b3J5XCIsXHJcbiAgICBsaW5rOiBcIi90aW1lbGluZVwiXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiBcIlx1NUI5RVx1NjVGNlx1OEJCRlx1NUJBMlwiLFxyXG4gICAgaWNvbjogXCJjaGFydC1zaW1wbGVcIixcclxuICAgIGxpbms6IFwiaHR0cHM6Ly9hbmFseXRpY3MudW1hbWkuaXMvc2hhcmUvcHZIY25DOWVhRkV6WG45OS9EZXZPcHMtQm9va1wiLFxyXG4gIH0sXHJcbl0pO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6L3BhcGVyLWRyYWdvbi5naXRodWIuaW8vc3JjLy52dWVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxccGFwZXItZHJhZ29uLmdpdGh1Yi5pb1xcXFxzcmNcXFxcLnZ1ZXByZXNzXFxcXHNpZGViYXIudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3BhcGVyLWRyYWdvbi5naXRodWIuaW8vc3JjLy52dWVwcmVzcy9zaWRlYmFyLnRzXCI7aW1wb3J0IHsgc2lkZWJhciB9IGZyb20gXCJ2dWVwcmVzcy10aGVtZS1ob3BlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzaWRlYmFyKHtcclxuICBcIi9cIjogW1xyXG4gICAgXCJcIixcclxuICAgIHtcclxuICAgICAgdGV4dDogXCJub3RlLWJvb2tcIixcclxuICAgICAgaWNvbjogXCJib29rXCIsXHJcbiAgICAgIC8vIFx1NjYyRlx1NTQyNlx1NTNFRlx1NjI5OFx1NTNFMFxyXG4gICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgcHJlZml4OiBcIm5vdGUtYm9vay9cIixcclxuICAgICAgbGluazogXCJub3RlLWJvb2svXCIsXHJcbiAgICAgIGNoaWxkcmVuOiBcInN0cnVjdHVyZVwiLFxyXG4gICAgfSxcclxuICAgICAge1xyXG4gICAgICB0ZXh0OiBcIlB5UXQ1XHU1RkVCXHU5MDFGXHU0RTBBXHU2MjRCLVx1NzM4Qlx1OTRFRFx1NEUxQ1wiLFxyXG4gICAgICBpY29uOiBcImJvb2tcIixcclxuICAgICAgLy8gXHU2NjJGXHU1NDI2XHU1M0VGXHU2Mjk4XHU1M0UwXHJcbiAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICBwcmVmaXg6IFwiUHlRdDVcdTVGRUJcdTkwMUZcdTRFMEFcdTYyNEItXHU3MzhCXHU5NEVEXHU0RTFDL1wiLFxyXG4gICAgICBsaW5rOiBcIlB5UXQ1XHU1RkVCXHU5MDFGXHU0RTBBXHU2MjRCLVx1NzM4Qlx1OTRFRFx1NEUxQy9cIixcclxuICAgICAgY2hpbGRyZW46IFwic3RydWN0dXJlXCIsXHJcbiAgICB9LFxyXG4gICAgXCJzbGlkZXNcIixcclxuICBdLFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrUyxTQUFTLHdCQUF3QjtBQUNuVSxTQUFTLFdBQVc7QUFDcEIsU0FBUyw0QkFBNEI7QUFDckMsU0FBUyx1QkFBdUI7OztBQ0hnUSxTQUFTLGlCQUFpQjs7O0FDQXhCLFNBQVMsY0FBYztBQUV6VCxJQUFPLGlCQUFRLE9BQU87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
