import {sidebar} from "vuepress-theme-hope";

export default sidebar({
    "/free-service/": [
        "/",
        {
            collapsible: true,
            text: "本站免费服务",
            icon: "dollar-sign",
            //prefix: "free-service/",
            children: "structure",
        },
    ],
    "/PyQt5快速上手-王铭东/": [
        "/note-book/",
        {
            text: "PyQt5快速上手-王铭东",
            icon: "book",
            // 是否可折叠
            collapsible: true,
            children: "structure",
        },
    ],
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

    ],
});
