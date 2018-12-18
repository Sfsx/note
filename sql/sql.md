# sql

## 优化
1. 优化案例:

    原先的sql语句是：
    ```sql
    select be.*,p.* from behavior_record_sync be left join people_info_sync p on be.code = p.access_code ORDER BY be.access_time DESC limit 10
    ```
    时间是: 9.958s
    
    改进后的 sql语句：
    ```sql
    select be.*,p.* from (select * from behavior_record_sync ORDER BY access_time DESC LIMIT 10) be left join people_info_sync p on be.code = p.access_code
    ```
    时间是: 0.077s

    最终版：
    ```sql
    select be.*,p.* from 
    (
    select * from behavior_record_sync 
    where code in(
        select access_code from people_info_sync
        where people_name like '陈吉仁'
    )
    ORDER BY access_time DESC LIMIT 0,30
    ) be 
    left join people_info_sync p 
    on be.code = p.access_code
    ```

---

## mysql

### explain 

explain 命令可以查看当前sql语句如何执行，是否使用索引，有没有做全表搜索。

### mysql 索引类型

+ FULLTEXT INDEX
+ UNIQUE INDEX
+ PRIMARY KEY
+ INDEX

### mysql 全文引索

MySQL中全文索引的关键字为FULLTEXT，目前可对MyISAM表和InnoDB表的CHAR、VARCHAR、TEXT类型的列创建全文索引

match() against()  

[原文链接](https://blog.csdn.net/bbirdsky/article/details/45368897)