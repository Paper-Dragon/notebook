# 查看 Mysql 数据量大小

以MB为单位统计，查询当前全部数据库的数据量大小。 


data_length：数据大小
index_length：索引大小

```bash
SELECT table_schema "Data Base Name",
    sum( data_length + index_length ) / 1024 / 1024 "Data Base Size in MB"
FROM information_schema.TABLES
```