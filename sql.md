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