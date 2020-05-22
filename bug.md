# bug

## 使用 import() 在生产环境无法找到模块 code：MODULE_NOT_FOUND

如果代码被 webpack 打包，那么代码中的 `import(foo)` 就会报错，因为

[Dynamic expressions in import()
](https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import)

## redis keys 正则匹配操作引起性能问题

redis 是单线程的，其所有操作都是源自的，不会因为并发产生数据异常

1. 线上 redis 禁止使用 Key 正则匹配操作

    redis 是单线程处理，在现实 Key 数量较多时，keys 正则匹配效率极低（时间复杂度为 O(N)），该命令一旦执行会严重阻塞线程导致，其他请求无法正常处理，在高QPS情况下会直接造成 Redis 服务崩溃！

    可以使用 scan 命令，或者将正则表达式作为 key，将其模糊匹配结果作为 value，当作是一条记录存放在 redis 中。

2. 冷热数据分离，不要将所有数据全部放到 redis 中
3. 不同的业务数据要分开存储
4. 存储的 Key 一定要设置超时时间
5. 对于必须要存储的大文本数据一定要压缩后存储

    对于大文本（>500kb）

## webpack 打包内存分配失败

node 存在内存限制，32 位系统 0.7 gb，64 位系统 1.5 gb，当引用所需内存超出时就会导致内存分配失败，错误日志如下

```log
<--- Last few GCs --->

[16772:00000000003C8F40] 13003561 ms: Mark-sweep 1366.3 (1417.9) -> 1362.5 (1416.8) MB, 764.6 / 0.1 ms  (average mu = 0.092, current mu = 0.016) allocation failure scavenge might not succeed
[16772:00000000003C8F40] 13003623 ms: Scavenge 1363.6 (1416.8) -> 1363.4 (1417.3) MB, 57.8 / 0.0 ms  (average mu = 0.092, current mu =
0.016) allocation failure


<--- JS stacktrace --->

==== JS stack trace =========================================

    0: ExitFrame [pc: 000001B78F25C5C1]
Security context: 0x01dc93e9e6e9 <JSObject>
    1: substr [000001DC93E8E361](this=0x033c8272d591 <String[321]: ,CAA0B,SAACC,GAAD,CAAMC,EAAN,CAAa,CACrCA,IAAMA,GAAGC,QAAT,EAAqBD,GAAGC,QAAH,CAAYC,KAAZ,CAAkBH,KAAOA,IAAII,OAAX,EAAsBJ,GAAxC,CAArB,CACD,CAFD,CAIA,2BAEA,GAAMK,OAAQ,GAAItD,IAAJ,CAAQ,CACpB2C,GAAI,MADgB,CAEpBnB,aAFoB,CAGpB+B,WAAY,CAAEhD,OAAF,CAHQ,CAIpBiD,OAAQ,yBAAKC,GAAE,KAAF,CAAL,EAJY,CAAR,CAAd...

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
 1: 000000013FB4C6AA v8::internal::GCIdleTimeHandler::GCIdleTimeHandler+4506
 2: 000000013FB27416 node::MakeCallback+4534
 3: 000000013FB27D90 node_module_register+2032
 4: 000000013FE4189E v8::internal::FatalProcessOutOfMemory+846
 5: 000000013FE417CF v8::internal::FatalProcessOutOfMemory+639
 6: 0000000140027F94 v8::internal::Heap::MaxHeapGrowingFactor+9620
 7: 000000014001EF76 v8::internal::ScavengeJob::operator=+24550
 8: 000000014001D5CC v8::internal::ScavengeJob::operator=+17980
 9: 0000000140026317 v8::internal::Heap::MaxHeapGrowingFactor+2327
10: 0000000140026396 v8::internal::Heap::MaxHeapGrowingFactor+2454
11: 0000000140150637 v8::internal::Factory::NewFillerObject+55
12: 00000001401CD826 v8::internal::operator<<+73494
13: 000001B78F25C5C1
```

解决办法给 node 分配更大的内存。启动参数添加 `--max_old_space_size=8192` 给 node 设置更大的老生代内存空间。

参考链接

[Angular 7/8 FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory](https://github.com/angular/angular-cli/issues/13734)

## webpack

需要用到 `mini-css-extract-plugin` 需要特别注意 `package.json` 中的 `sideEffect` 字段中要添加 `"*.css"` 否则 css 文件会被当作是可以优化的 tree shaking，被 webpack 忽略

如果是 vue 文件那样 style 写在 vue 文件中，那么 `"*.vue"` 也需要添加

[Doesn't extract when in production mode](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/275)

## mysql 日志文件占用磁盘空间

配置日志文件的过期时间

清除 binlog

```mysql
flush logs; # 清除所有的logs
purge binary logs to 'binlog.xxxx'; # 清除在某个日志之前的日志信息
```

设置日志过期时间

```mysql
show variables like '%expire%';
set global binlog_expire_logs_seconds=259200
```

[MySQL 8.0.12 binlog参数binlog_expire_logs_seconds](https://blog.csdn.net/vkingnew/article/details/81953350)

## mysql 磁盘碎片整理

mysql碎片化整理
当您的库中删除了大量的数据后，您可能会发现数据文件尺寸并没有减小。这是因为删除操作后在数据文件中留下碎片所致，每当MySQL从你的列表中删除了一行内容，该段空间就会被留空。而在一段时间内的大量删除操作，会使这种留空的空间变得比存储列表内容所使用的空间更大

如果开启了独享表空间，即每张表都有ibdfile。这个时候如果删除了大量的行，索引会重组并且会释放相应的空间因此不必优化
由于共享表空间所有表的数据与索引都存放于ibddata1文件中，随着数据量的增长会导致该文件越来越大。超过10G的时候查询速度就非常慢，因此在编译的时候最好开启独享表空间。因为mysql默认是关闭了独享表空间，可以在mysql服务器中设置innodb_file_per_table 来开启独享表空间

查看某个表所占空间，以及碎片大小。

```sql
select table_name,engine,table_rows,data_length+index_length length,DATA_FREE from information_schema.tables where TABLE_SCHEMA='spiderslocal';
```

注意:如果是共享表空间的话， `data_free` 表示共享表空间的大小而非数据的大小。如果是独享表空间才是该表的剩余空间。
显示表状态：

```sql
show table status like 'table.name';
```

所以需要使用 optimize table 对表进行碎片整理：

```sql
optimize table table.name;
```

对于 myisam 引擎可以直接使用

```sql
optimize table table.name;
```

但是 innodb 引擎时，会报 “Table does not support optimize, doing recreate + analyze instead”，则使用以下两条命令来进行碎片整理：

```sql
alter table icbcmall ENGINE = 'InnoDB';
analyze table icbcmall;
```
