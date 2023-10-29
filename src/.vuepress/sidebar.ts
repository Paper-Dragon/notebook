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
      text: "PyQt5快速上手-王铭东",
      icon: "book",
      // 是否可折叠
      collapsible: true,
      prefix: "PyQt5快速上手-王铭东/",
      link: "PyQt5快速上手-王铭东/",
      children: "structure",
    },
    "slides",
  ],
});
