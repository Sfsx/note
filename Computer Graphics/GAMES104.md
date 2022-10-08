# GAMES104

## 游戏引擎导论

### DOP Data-Oriented Programming

### Lumen

### Nanite

## 引擎架构分层

### Tool Layer

用户可视化操作作界面

### Function Layer

脚本处理，机制处理

#### Dive into Tick

+ TickLogic
+ TickRender

### Resource Layer

资源文件处理，文件引擎化，转化为引擎资产

+ composite asset 次产关联
+ GUID

#### Runtime Resource Management

#### Manage Asset Life Cycle

### Core Layer

physics

thead pool

math

#### Math Efficiency
+ Single instruction, multiple data

#### Data Structure and Containers

不能直接使用 c++ STL 其内存管理比较差

需要自己实现一套数据结果

#### Memory Management

+ put data together
+ access data in order
+ allocate and de-allocate as a block

### Plaform Layer

兼容不同平台

#### Graphics API

### middleware and 3rd party Libraries

speedTree

havok

physx

## 如何构建游戏世界

所有东西都抽象为 Game Object

不同的物体仅仅只是 Game Object 组合了不同的 component

以 unity 为例子

component
+ rigbody
+ script
+ animation
+ 3rd party plugin

#### How to Build a Game World

#### Sence Management

Bounding Volume hierarchies(BVH)

## 游戏引擎中的渲染

### Projection and Resterization

### GPU

+ Single Instruction Multiple Data (SIMD)
+ Single Instruction Mutilple Threads (SIMT)

### GPU Bounds and Performance

+ Memory Bounds
+ ALU (Arithmetic-Logic Unit) Bounds
+ TMU (Texture Mapping Unit) Bounds
+ BW (Bandwidth) Bounds 通道带宽

### Rendeable object

### GPU Batch Rendering

### visibility culling

#### Potential Visibility Set (PVS)

#### GPU culling

#### Block Compression

### Cluster-Based Mesh Pipline

[Introduction to Turing Mesh Shaders](https://developer.nvidia.com/blog/introduction-turing-mesh-shaders/)

## 渲染中光和材质的数学魔法

### 渲染方程及挑战

### 基础光照解决方案

### 基于预计算的全局光照

#### Convolution Theorem

傅立叶变换压缩图片

#### Spherical Harmonics

## 参考资料

《Game Engine Architecture》
