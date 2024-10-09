import { path } from "vuepress/utils";
import { watch, FSWatcher } from "chokidar";
import fs from "fs-extra";
import { App } from "vuepress";
import pathLib from "path";  // 用 pathLib 作为 path 的别名避免冲突

let jsWatcher: FSWatcher;

// 递归函数，用于遍历目录并返回所有符合条件的文件
const getFilesRecursively = (dir, filePattern, excludeDir) => {
  let results = [];

  // 读取目录
  const list = fs.readdirSync(dir, { withFileTypes: true });
  
  list.forEach(file => {
    const filePath = pathLib.join(dir, file.name);
    
    // 如果是目录，且不在排除目录中，继续递归
    if (file.isDirectory() && !filePath.includes(excludeDir)) {
      results = results.concat(getFilesRecursively(filePath, filePattern, excludeDir));
    } 
    // 如果是文件且符合条件，添加到结果中
    else if (file.isFile() && filePattern.test(filePath)) {
      results.push(filePath);
    }
  });

  return results;
};

export default {
  name: "vuepress-plugin-copy-plus",

  onPrepared: (app: App) => {
    console.log("\nCopy Plus Plugin initialized.");
    console.log("\nRunning in Dev Server?:", app.env.isDev);

    const watchPath = `${app.dir.source()}/**/*.{pdf,zip,rar,tar,gz,bz2,tgz,7z,txt,py,c,cpp,h,hpp,sh,mp4,otf,ttf}`;
    console.log("Watching files at path:", watchPath);

    if (!fs.existsSync(app.dir.source())) {
      console.error("Source directory does not exist:", app.dir.source());
      return;
    }

    if (app.env.isDev) {
      jsWatcher = watch(watchPath, {
        ignored: [
          /(^|[\/\\])\../,        // 忽略隐藏文件
          `${app.dir.source()}/.vuepress/**/*`,  // 忽略 .vuepress 目录及其子目录
        ],
        persistent: true,         // 保持监听器在 dev server 中持续运行
        followSymlinks: true      // 跟随符号链接
      });

      jsWatcher.on("add", (sourceFilePath) => {
        console.log("File added event triggered for:", sourceFilePath);

        if (!fs.existsSync(sourceFilePath)) {
          console.error("File does not exist:", sourceFilePath);
          return;
        }

        let tempFilePath = pathLib.join(
          app.dir.temp(), "pages", // 开发模式使用临时目录
          pathLib.relative(app.dir.source(), sourceFilePath)
        );

        console.log("Copying file from:", sourceFilePath, "to:", tempFilePath);

        const targetDir = pathLib.dirname(tempFilePath);
        if (!fs.existsSync(targetDir)) {
          console.log("Creating target directory:", targetDir);
          fs.mkdirpSync(targetDir);
        }

        try {
          fs.copySync(sourceFilePath, tempFilePath, { overwrite: true });
          console.log("File copied successfully.");
        } catch (error) {
          console.error("Error copying file:", error);
        }
      });

      jsWatcher.on("error", (error) => {
        console.error("Watcher error:", error);
      });

      jsWatcher.on("ready", () => {
        console.log("Watcher is ready and monitoring files.");
      });
    }
  },

  onGenerated: async (app: App) => {
    console.log("Build process finished, starting file copy...");

    const sourceDir = app.dir.source();
    const destDir = app.dir.dest();

    // 匹配文件的正则表达式
    const filePattern = /\.(pdf|zip|rar|tar|gz|bz2|tgz|7z|txt|py|c|cpp|h|hpp|sh|mp4|ttf|otf|ttc)$/;
    console.log("Copying files with pattern:", filePattern);

    // 使用递归函数查找所有符合条件的文件
    const filesToCopy = getFilesRecursively(sourceDir, filePattern, '.vuepress');

    // 逐个复制文件
    filesToCopy.forEach((sourceFilePath) => {
      const destFilePath = pathLib.join(destDir, pathLib.relative(sourceDir, sourceFilePath)); // 正确的构建目标目录
      console.log(`Copying from ${sourceFilePath} to ${destFilePath}`);

      const targetDir = pathLib.dirname(destFilePath);
      if (!fs.existsSync(targetDir)) {
        console.log("Creating directory:", targetDir);
        fs.mkdirpSync(targetDir);
      }

      try {
        fs.copySync(sourceFilePath, destFilePath, { overwrite: true });
        console.log("File copied successfully.");
      } catch (error) {
        console.error("Error copying file:", error);
      }
    });

    if (app.env.isDev) {
      console.log("Closing file watcher...");
      try {
        await jsWatcher.close();
        console.log("Watcher closed successfully.");
      } catch (error) {
        console.error("Error closing watcher:", error);
      }
    }

    console.log("File copy process complete.");
  },
};
