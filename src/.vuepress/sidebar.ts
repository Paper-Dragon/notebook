import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "note-book",
      icon: "book",
      // 是否可折叠
      collapsible: true,
      prefix: "note-book/",
      link: "note-book/",
      children: "structure",
    },
    {
      text: "1--Linux云计算运维",
      icon: "book",
      // 是否可折叠
      collapsible: true,
      prefix: "1--Linux云计算运维/",
      link: "1--Linux云计算运维/",
      children: "structure",
    },
    "slides",
  ],
});
