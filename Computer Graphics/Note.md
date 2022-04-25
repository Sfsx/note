# Computer Graphics

## Rasterization

### Triangles

### Aliasing 走样

1. 摩尔纹
2. 锯齿

函数的变化太快以至于采样速度跟不上

#### 傅立叶级数

任何函数都可以展开为三角函数级数

$$ S_n(x) = \frac {A_0} {2} + \sum_{n=1}^N \left( a_n cos\left(\frac{2\pi nx}{P}\right) + b_n sin\left(\frac{2\pi nx}{P}\right) \right)$$


#### 傅立叶变换

+ 对图像做傅立叶变换后
  + 将低频信号过滤，将剩余高频信号做逆傅立叶变换，则能够得到图像中图形的边界
  + 将高频信号过滤，将剩余低频信号做逆傅立叶变换，将会得到一个边界模糊的图形，也就是css filter 变换 

属于数字图像处理，但目前数字图像处理更多是使用人工智能

#### 卷积

数学卷积比较复杂

图形学的运用比较简单

其实模糊处理

#### 采样

采样就是重复原始信号的频普

#### 总结

+ Time Domain 时域 -> Frequency Domain 频域

+ 对图像卷积，过滤高频信号，也就是人们说的模糊操作后的图像，经过傅立叶变换，得到频域会缩减

+ 频域越大，在采样频率一定时，容易重叠，重叠即走样。模糊操作后，频域缩减，采样就不容易发生走样。从而降低锯齿

+ 模糊操作：对于空间给定的渲染区域。以像素单位的方块为过滤器，将图形切割，在对每一个像素点内的颜色取均值。

### MSAA 抗锯齿

### FXAA Fast Approximate AA

### TAA Temporal AA

### Super Resolution / Super Sampling

+ DLSS (Deep Learning Super Sampling) 低分辨率采样，但是需要显示高分辨率的图像，这就需要猜测空白地方应该填充什么颜色，这里就需要用到深度学习，训练模型进行猜测。将不足的地方进行填充

## Shading 着色

### Painter's Algorithm 画家算法

画家算法，用远到近的顺序开始绘制。但在某些绘制的画面，远近是相互交叠的，比如莫比乌斯环，无法远近排序

### Z-Buffer

记录各个像素的深度

### Diffuse Reflection 漫反射

$l$ 表示光线入射向量，$n$ 表示平面法线的向量，$n \cdot l$ 表示入射角与法线的余弦， $I$ 表示光源能量，$k_d$ 表示漫反射系数, $$v$$ 表示视角向量

$$L_d = k_d(I/r^2)max(0, n \cdot l)$$

漫反射各个角度去看颜色都一样，所以上式子与视角向量$$v$$无关

### Specular Term (Blinn-Phone Reflection) 高光

当视角与镜面反射方向比较接近的时候，才能看到高光。$h$ 表示 $l$ 与 $v$ 的角平分线向量 $h$，$n \cdot h$ 表示入射角向量与$l$ 与 $v$ 的角平分线向量的余弦，$p$ 系数在 100 ～ 200 之间

$$ L_s = k_s(I/r^2)max(0, n \cdot h)^p $$

### Shading Frequencies 着色频率

## Graphics Pipeline (Real-time Rendering)渲染管线(实时渲染管线)

http://shadertoy.com/view/ld3Gz2

## GPU

由于着色操作是一个固定的方法，对画面中所有像素点都适用，所以很适合并行计算。GPU 的单核性能虽然比 CPU 差，但是并行计算的能力远强于 CPU。这点也是为了渲染特别设计的，所以其每秒浮点运算值比 CPU 高


## Texture Mapping 纹理映射

将几何物体的表面张开到二维空间的一张图片上，几何物体上的每一个点，都在二维空间存在一个对应的一个点。这个映射关系就是纹理映射。生活中具体例子可以参考地球仪与世界地图
 
## Texture Magnigication 纹理放大

低分辨率的纹理，在最后成像时会出现锯齿

### Linear Gradient 线性插值
 
### Bicubic Interpolation 双三次插值

高分辨率的纹理，在最后成像时会发生走样

### Range Query

屏幕上不同的像素在纹理上覆盖的大小是不一样的（透视投影，近大远小）

#### Mipmap

缩小纹理的分辨率

但 Mipmap 只能查询正方形范围内的差值，如果不是正方形就会出现 overblur (过度模糊)

#### Anisotropic Filteri 各向异性过滤

## Application Of Texture

## No “bset” Representation - Geometry is Hard

### Constructive Solid Geometry (Implicit)

### Fractals

### Distance Function

计算动画中间过程的形态，比如两个水滴融合的过程

## Explicit Geometry

### Point Cloud (Explicit)

点云 -> 一堆点 -> 渲染

### Polygen Mesh (Explicit)

三角形模拟

### Bezier Curve 贝赛尔曲线

#### de Casteljau Algirithm

伯恩斯坦基底多项式

### Other types of splines 样条

B-splines

### Bezier Sufaces 贝塞尔曲面

## Subdivision 曲面细分

### Loop Subdivision 鲁普细分

只能作用于三角形面

### Catmull-Clark Subdivision

能做用于任何形状的平面

## Shadows

### Shadows mapping

#### Hard Shadows

#### Soft Shadows

## Ray Tracing

<!-- lecture 13 -->

### Whitted style ray tracing

因为Blinn-Phong这种局部模型无法处理全局效果！即 Blinn-Phong 模型仅仅考虑的直接光源，而实际空间中充斥着各种漫反射而产生的间接光源

特点：

+ Always perform **specular** reflections
+ **Stop** bouncing at diffuse surfaces

### moller trumbore algorithm

光线与三角形求交

$$\vec{O} + t\vec{D} = (1- b_0-b_1)\vec{P}_0+b_1\vec{P}_1+b_2\vec{P}_2$$

判断点是否在三角形内 $\vec{P}_0$ $\vec{P}_1$ $\vec{P}_2$ 为三角形三个顶点和 $\vec{O}$ $\vec{D}$ 都是三维向量。三个未知数，三个方程线性代数齐次方程组

### bounding volumes

包围盒检测，光线与包围盒求交，包围盒的6个面为轴平面

<!-- lecture 14 -->
### KD-Tree Pre-Processing

原理有点类似二叉查找树，是将包围盒做二分。缺点：存在一个三角形占用两个包围盒，需要重复计算。

### Object Partitions & Bonuding Volume Hierarchy

这里是将包围盒内的三角形划分，求划分好三角形集合的包围盒，这时包围盒可能相交，没有关系。

### Basic radiometry 辐射度量学

路径追踪的基础定义

+ Radinat energy 光能，

  单位 Joule 焦耳 或 lm·s

+ Radiant flux 光通量，单位时间内由光源所发出或由被照物所吸收的总光能

  单位 Watt 瓦特(说明和物理上的功有点类似，都是用瓦特做单位)或 lumens 流明
 
+ Radiant Intensity 发光强度，光源在给定方向上，每单位**立体角**内所发出的光通量。

  candelas（cd= lm/sr) lm 流明 sr 立体角

  立体角 在球面上的面积 $A$ 除以半径 $r$ 的平方 $A/r^2$，所以整个球的立体角就是 $4\pi$

+ Irradiance 单位面积上接收到的能量

+ Radiance 单位面积上，每单位立体角，发射的能量。将每个立体角积分起来就是 Irradiance

+ Exiting Radiance 单位面积在某一个方向 $$ 辐射的能量

<!-- lecture 15 -->
### Bidirectinoal Reflectance Distribution Function 双向反射分布函数（BRDF）

单位面积，在某一个立体角接受到入射光反射到某一个立体角的反射光的比例

### The Reflection Equation 反射方程

$L_r(p, \omega_r) = \displaystyle \int^{}_{H^2} f_r(p, \omega_i \to \omega_r)L_i(p, \omega_i)cos\theta_id\omega_i$

### The Rendering Equation 渲染方程

$L_o(p, \omega_o) = L_e(p, \omega_o) + \displaystyle \int^{}_{\Omega^+} L_i(p, \omega_i)f_r(p, \omega_i, \omega_o)(n \cdot \omega_i)d\omega_i$

$L_e(p, \omega_o)$ 为改点自己发的光

$L_i(p, \omega_i)$ 为 BRDF 函数

$\displaystyle \int^{}_{\Omega^+} L_i(p, \omega_i)f_r(p, \omega_i, \omega_o)(n \cdot \omega_i)d\omega_i$ 

为对四面八方反射过来的光线进行积分

$n \cdot \omega_i$ = $cos\theta_i$ 其中 $n$ 为法线向量与 $\omega_i$ 向量的点乘

### Linear Operator Equation

$l(u) = e(u) \displaystyle \int^{}_{}l(v)K(u,v)dv$

经过复杂数学转行（...）算子简写得：

$L = E + KL$

### Global illumination

$L = E + EK + EK^2 + EK^3 + ...$

推导过程

$$
\begin{align}
L =& E + KL \\
IL- KL =& E \\
(I - K)L =& E \\
L =& (I - K)^{-1}E \\
Binomial & Theorem \\
L =& (I + K + K^2 + K^3 + ...)E \\
L =& E + KE + K^{2}E + K^{3}E + ...
\end{align}
$$

### Probability review

Probability Density Function

$ Xi \sim p(x) $

Conditions on $p(x)$: $p(x) > 0 $ and $\displaystyle \int^{}_{} p(x) dx = 1$

#### Random Variables

<!-- lecture 16 -->
### Monte Carlo Integration 蒙特卡洛积分

不定积分的一种特殊计算方式

$$ F_{N} = \frac {b - a} {N} \sum_{n=1}^N f(X_{i}) $$

$$ \displaystyle \int^{}_{} f(x)dx = \frac {1} {N} \sum_{i=1}^N \frac {f(X_{i})} {p(X_{i})} $$

Probability Density Function $ Xi \sim p(x) $

### Path Tracing

### Whitted-Style Ray Tracing is Wrong

为了解决 whitted-style ray tracing 只做镜面反射，而且对于漫反射不做处理

