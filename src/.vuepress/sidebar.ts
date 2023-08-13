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
    "slides",
  ],
});
