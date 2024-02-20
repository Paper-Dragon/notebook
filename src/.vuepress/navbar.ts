import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",
    {
        text: "使用指南",
        icon: "book",
        link: "/note-book/"
    },
    {
        text: "免费服务",
        icon: "splotch",
        children: [
            "/free-service/tools.md",
            "/free-service/docker-hub-mirror.md",
            "/free-service/cloudflare-warp.md"
        ]
    },
    {
        text: "时间线",
        icon: "history",
        link: "/timeline/"
    },
    {
        text: "友链",
        icon: "link",
        link: "/about/friend.md",
        ariaLabel: "友链"
    },
    {
        text: "博客联盟",
        icon: "circle-nodes",
        children: [
            {
                text: "开往",
                icon: "subway",
                link: "https://www.travellings.cn/go.html",
                ariaLabel: "开往"
            },
            {
                text: "十年之约",
                icon: "https://foreverblog.cn/favicon.ico",
                link: "https://www.foreverblog.cn/go.html",
                ariaLabel: "十年之约"
            }
        ]
        
    },
    {
        text: "实时访客",
        icon: "chart-simple",
        link: "https://analytics.umami.is/share/pvHcnC9eaFEzXn99/DevOps-Book",
    },
    {
        text: "关于我",
        icon: "address-card",
        link: "/about/me.md",
        ariaLabel: "关于我"
    }
]);
