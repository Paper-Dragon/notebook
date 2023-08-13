import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "使用指南",
    icon: "book",
    link: "/note-book"
  },
  {
    text: "时间线",
    icon: "history",
    link: "/timeline"
  },
  {
    text: "实时访客",
    icon: "chart-simple",
    link: "https://analytics.umami.is/share/pvHcnC9eaFEzXn99/DevOps-Book",
  },
]);
