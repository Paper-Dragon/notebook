import { defineEchartsConfig } from "vuepress-plugin-md-enhance/client";

defineEchartsConfig({
    setup: async () => {
        await import('echarts-wordcloud');
    },
});

export default {};