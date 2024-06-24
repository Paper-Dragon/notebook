import { path } from "vuepress/utils";
import { watch, FSWatcher } from "chokidar";
import fs from "fs-extra";
import { App } from "vuepress";

let jsWatcher: FSWatcher;

export default {
  name: "vuepress-plugin-copy-plus",
  
  onPrepared: (app: App) => {
    jsWatcher = watch(path.join(app.dir.source(), "/**/*.{pdf,zip,rar,tar,gz,bz2,tgz,7z,txt,py,c,cpp,h,hpp}"), {
      ignored: /(^|[\/\\])\../,
    });

    jsWatcher.on("add", (sourceFilePath) => {
      let tempFilePath = path.join(  
      app.env.isDev ? path.join(app.dir.temp(), "pages") : app.dir.dest(),
      path.relative(app.dir.source(), sourceFilePath));
      fs.copySync(sourceFilePath, tempFilePath, { overwrite: true });
    });
  },

  onGenerated: async (app: App) => {
    await jsWatcher.close();
  },
};