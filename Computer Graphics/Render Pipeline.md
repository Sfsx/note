# 渲染管线

## 空间坐标

为了将坐标从一个坐标系转换到另一个坐标系，我们需要多个变换矩阵，其中最重要的几个分别是 模型矩阵，视图矩阵，投影矩阵三个矩阵

这里坐标系统又有 局部坐标系、世界坐标系，视图坐标系、裁剪坐标系以及屏幕空间

具体转换过程：

1. 局部坐标系是对象相对于原点的坐标
2. 局部坐标通过模型变换转换为世界坐标，主要目的就是将模型放置到场景中合适的位置上，模型变换主要包括平移，旋转，缩放
3. 世界坐标通过视图变换转换为视图坐标