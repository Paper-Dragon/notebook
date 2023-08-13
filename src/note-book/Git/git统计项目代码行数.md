

# git统计项目代码行数

## 只统计项目代码的总行数

```ruby
git ls-files | xargs cat | wc -l
```

## 只查看项目文件列表

```undefined
git ls-files
```

## 统计python代码的行数

```bash
git ls-files | grep '.*\.py' | xargs cat | wc -l
```

