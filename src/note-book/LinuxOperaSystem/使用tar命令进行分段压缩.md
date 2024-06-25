# 使用tar命令进行分段压缩

很多时候，我们在进行大量小文件传输的时候，速度非常不理想。于是找到了分段压缩在传输的方法。

在 CentOS 7 上，你可以使用 tar 命令来对文件进行分段压缩、解压缩

## 步骤 1：压缩文件并分段

假设要压缩名为 largefile 的文件夹，并将其分割成每个 1GB 的小文件。

```bash
tar -cv largefile/ | split -b 1G - largefile.tar.gz.
```

这条命令做了以下几件事情：

- `tar -cv largefile/`：将 largefile 文件夹打包成一个 tar 文件，并将过程显示在终端中。
- `split -b 1G - largefile.tar.gz.`：通过管道将 tar 文件传送给 split 命令，使用 `-b 1G` 参数将数据按照 1GB 的大小进行分割，并以 `largefile.tar.gz.` 为前缀生成分段文件。

## 步骤 2：传输分段压缩文件

使用 scp 命令将分割后的文件传输到目标机器：

```bash
scp -r largefile.tar.gz.* user@remote:/path/to/destination/
```

传输所有以 `largefile.tar.gz.` 开头的分段文件到目标机器的指定路径。

## 步骤 3：在目标机器上合并并解压

在目标机器上，将分段文件合并并解压：

```bash
cat largefile.tar.gz.* | tar -xzvf -
```

- `cat largefile.tar.gz.*`：将所有以 `largefile.tar.gz.` 开头的分段文件内容输出到 STDOUT。
- `tar -xzvf -`：通过管道将 STDOUT 的内容传送给 tar 命令进行解压缩。
- `-xzvf` 参数用于解压缩并显示过程中的详细信息。

通过这些步骤，可以在 CentOS 7 上使用 tar 命令将大文件分段压缩、传输和解压缩，实现文件的高效传输和处理。