import { defineEChartsConfig  } from "vuepress-plugin-md-enhance/client";

defineEChartsConfig({
    setup: async () => {
        await import('echarts-wordcloud');
    },
});

export default {};