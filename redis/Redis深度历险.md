# Redis深度历险

## 第1篇 基础和应用

### 1.1 授人以鱼不如授人以渔

### 1.2 万丈高楼平地起——Redis基础数据结构

#### string(字符串)

Redis 的字符串是动态字符串，是可以修改的字符串，内部结构的实现类似于 c++ 的 vector，采用预分配冗余空间的方式来减少内存的频繁分配。当字符串的长读小于 1MB 时，扩容为加倍现有空间，超出时扩容为增加 1MB，最大长读为 512MB

1. 键值对
2. 批量键值对
3. 过期和 set 命令扩展

#### list(列表)

Redis 的列表相当于 c++ 的 list，插入删除时间复杂度为 O(1)，但是索引时间复杂度为 O(n)

1. 队列
2. 栈
3. 快速列表

    再深入研就，你会发现 Redis 底层存储不是一个简单的 list，而是称之为“快速链表”(quicklist)的一个结构

    **当元素较少时**，会使用一块连续的内存，使用压缩链表(ziplist)数据结构存储。**当数据量较多时**，改用 quicklist 存储，即 `list<ziplist>`。因为普通链表需要附加空间指针，浪费内存空间，还会加重内存的碎片化。所以 Redis 将 list 和 ziplist 组合成了 quicklist 来使用。

#### hash(字典)

Redis 的字典相当于 c++ 中的 hashmap 即数组与链表的二维结构。第一维 hash 的数组位置碰撞时，就会将碰撞的元素使用链表串接起来。但 redis 的字典的值只能是**字符串**。redis 在 rehash 采用渐进的方式。

hash 移除最后一个元素之后，该数据结构自动被回收。hash 与 string 相比，hash 消耗的内存更多

#### set(集合)

Redis 的集合相当于 c++ 的 set，它内部的键值是无序的

#### zset(有序列表)

类似于 Java 的 SortedSet，除了 set 的基本功能外还可以给 value 赋予一个 score 用于排序。内部实现为跳跃列表

### 1.3 千帆竞发——分布式锁

设置锁并添加超时时间，防止死锁

```shell
> set lock:codehole true ex 5 nx
OK
...  do something
> del lock:codehole
```

### 1.4 延时队列

`blpop/brpop`

### 1.5 节衣缩食——位图

位图不是特殊的数据结构，他的内容其实就是普通的字符串，也就是 byte 数组，将普通字符串的 ASCII 存入 byte 数组。通过使用 `get/set`、 `getbit/setbit`、`bitfield`

### 1.6 四两拨千斤——HyperLogLog

用于解决统计问题，能够提供不精确的统计数据，例如页面 uv 访问量

低位连续零位的最大长读 K 来估算随机数的数量 N。

### 1.7 层峦叠嶂——布隆过滤器

不怎么精确的 set 结构，优点在于空间消耗小。当布隆过滤器说某个值存在的时候，这个值可能不存在；当它说某个值不存在的时候，那就肯定不存在。

向布隆过滤器添加 key 时，会使用多个 hash 函数对 key 进行 hash 得出一个整数索引值，然后对位数组长度进行取模运算得到一个位置，每个 hash 函数都会得到一个不同的位置。再把为数组的这几个位置都置为 1，就完成 add 操作。进行验证是否存在时，也是通过相同的计算，查看计算得到的位置是否都为 1，是则存在（这个时候并不能说这个 key 一定存在，因为都为 1 可能是由其他 key 的 hash 位置导致的），不是则不存在。

### 1.8 断尾求生——简单限流

利用 zset 的 score 值，设置为毫秒时间戳，然后通过 zremrangebyscore 取出给定时间范围的 key

### 1.9 一毛不拔——漏斗限流

redis-cell

设置一个固定值作为漏斗的大小，然后每次有流量进入，判断漏斗是否已满，满了丢弃，没满继则添加。另一端，消费者不断消费漏斗中的数据。

### 1.10 近水楼台——GeoHash

用于统计附件的人。原始的办法是遍历所有元素由已知的经纬度坐标通过勾股定理计算得到距离，再将所有距离进行排序，可想而知当数据量足够庞大的时候这个计算量是非常庞大的。

GeoHash 算法将二维的经纬度坐标映射到一维的整数，这样所有元素都将挂载到一条线上，就可以直观比较距离。

介绍 GeoHash 算法中的二刀法，将地球看成一个正方形二维平面 $\{ y \in[-90^\circ, 90^\circ], x \in [-180^\circ, 180^\circ] \}$，通过二刀切割成4个小正方形，如果纬度范围 $[-90^\circ, 0^\circ)$ 用二进制0代表，$(0^\circ, 90^\circ]$ 用二进制1代表，经度范围$[-180^\circ, 0^\circ)$ 用二进制0代表，$(0^\circ, 180^\circ]$用二进制1代表，那么地球可以分成如下4个部分

![二分法](https://upload-images.jianshu.io/upload_images/2095550-db91c295ed2c0c99.png?imageMogr2/auto-orient/strip|imageView2/2/w/337/format/webp)

如果在小块范围内递归对半划分呢？

![二分法](https://upload-images.jianshu.io/upload_images/2095550-d86dc182d102451b.png?imageMogr2/auto-orient/strip|imageView2/2/w/341/format/webp)

可以看到，划分的区域更多了，也更精确了

+ GeoHash 用一个字符串表示经纬度两个坐标，在数据库中可以实现一列上应用索引
+ GeoHash 表示的不是一个点，而是一个矩形区域
+ GeoHash 编码前缀可以表示各大的矩形区域，例如 wx4g0ec1 它的前缀 wx4g0e 表示包含编码 wx4g0ec1 在内的更大区域，这个特性可以用于附近地点搜索。

### 1.11 大海捞针——scan

时间复杂度为 O(n)，分布进行，不会阻塞线程（redis 单线程）

避免设置的 key 值过大，这会导致数据迁移时，由于 key 太大，需要申请一块较大的内存，导致卡顿。删除过程中，大块内存被一次性回收，造成卡顿。可以通过以下命令检查

```bash
> redis-cli -h 127.0.0.1 -p 6379 --bigkeys -i 0.1
```

## 第2篇 原理篇

### 2.1 鞭辟入里——线程IO模型

单线程 非阻塞IO 时间轮询，其事件轮询使用 epoll(linux) 和 kqueue(FreeBSD 和 macosx)，指令队列，响应队列，定时任务最小堆

### 2.2 交头接耳——通信协议

redis 作者认为数据库系统的瓶颈一般不在于网络流量，而在于数据库自身内部逻辑上，所以即使 redis 使用了浪费流量的文本协议，依然可以拥有极高的访问性能。

RESP 是 redis 序列化协议（redis serialization protocal）的简写

### 2.3 未雨绸缪——持久化
