# Computer Graphics

## GAMES 101

Graphics And Mixed Environment Symposium
### Rasterization

光栅化流程

1. 判断像素点中心是否在三角形内部

利用向量叉乘

2. 判断被覆盖的像素的颜色

基于三角形重心坐标对三角形的顶点数据进行插值

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

phone 和 blinn-phone 的区别：

phone 是根据视角与反射光线的重合度来判断是否能看到高光（镜面反射）

blinn-phone 是判断入射向量与反射向量的半程向量（halfway vector）与平面法向量的夹角来判断是否能看到高光

共同点：

都需要计算三个分量 ambient(环境光分量)、specular(镜面反射分量)、diffuse(漫反射分量)

```glsl
// ambient 这里 0.1 是环境光系数（一般是0.1 ～ 0.2）
vec3 ambient = 0.1 * lightColor;
// diffuse
vec3 lightDir = normalize(lightPos - fragPos);
float diff = max(dot(lightDir, normal), 0.0);
vec3 diffuse = diff * lightColor;
// specular
vec3 viewDir = normalize(viewPos - fragPos);
vec3 reflectDir = reflect(-lightDir, normal);
vec3 halfwayDir = normalize(lightDir + viewDir);  
// 这里 64 是
float spec = pow(max(dot(normal, halfwayDir), 0.0), 64.0);
vec3 specular = spec * lightColor;

```

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
 
+ Radiant Intensity: radiant intensity measures the amount of radiant flux per solid angle (发光强度，光源在给定方向上，每单位**立体角**内所发出的光通量。)

  candelas（cd= lm/sr) lm 流明 sr 立体角

+ Solid angle(立体角) 在球面上的面积 $A$ 除以半径 $r$ 的平方 $A/r^2$，所以整个球的立体角就是 $4\pi$

+ Irradiance 单位面积上接收到的能量 (power per unit area)

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

### Ray Generation

### Path Tracing

#### Russian Roulette (RR)

离散概率数学期望 expect:

$$ E = P * (Lo / P) + (1-P)*0 = Lo$$

    shade(p, wo)
      Randomly choose One direction wi~pdf(w)
      Trace a ray r(p, wi)
      If ray r hit the light
        Return  L_i * f_r * cosine / pdf(wi) / P_RR
      Else If ray r hit an object at q
        Return shade(q, -wi) * f_r * cosine / pdf(wi) / P_RR

### Things we haven't covered / won't cover

+ how to sample any function?
+ Monte Carlo integration allows arbitrary pdfs
  + What's the best choice?(importance sampling)
  + 当被积函数与pdf同形状时，是最佳的 pdf
+ Do random numbers matter?
  + Yes! (low discrepancy sequences 控制随机数生成间距，使随机数没有那么密集)
+ The radiance of a pixel is the average of radiance on all paths passing through it
  + Why?(pixel recinstruction filter)
+ Is the radiance of a pixel the color of a pixel?
  + No.(gamma correction, curves, color space)

<!-- lecture 17 -->
### Materials And Apperances

Matrerial === BRDF

### Diffuse / Materials

### Diffuse materials

albedo

$$f_{r} = \frac{\rho}{\pi}$$

### Glossy material 

### Ideal reflection / refractive material

BRDF BTDF BSTF

### Fresnel Reflection / Term (菲涅尔项)

### Microfacet Material

$$ f(i, o) = \frac{F(i, h)G(i, o, h)D(h)}{4(n, i)(n,o)} $$

$F(i,h)$ 表示菲涅尔项

$G(i, o, h)$ 表示shadowing-masking term, 修正物体微表面对光线遮挡损失的能量

$D(h)$ distribution of normals 查询微表面的法线在某一个值下的分布情况

#### Normal distribution function

$$ NDF_{GGXTR}(n, h, a)= \frac{a^2}{\pi((n \cdot h)^2(a^2 - 1) + 1)^2}$$

$n$ is normal vector, $h$ is the halfway vector between the surface normal and light direction, $a$ is the surface roughness parameter

#### Geometry function

$$ G_{SchlickGGX}(n, v, k)= \frac{n \cdot v}{(n \cdot v)(1-k)+k} $$

$n$ is normal vector, $v$ is view direction vector, $k$ is a remapping fo  $a$ based on whether we're using the geometry function for either direct lighting or IBL lightng:

$$ k_{direct} = \frac{(a + 1)^2}{8} $$

$$ k_{IBL} = \frac{a^2}{2} $$

#### Fresnel equation

Fresnel-Schlick approximation

$$ F_{Schlick}(h,v,F_{0}) = F_{0} + (1 - F_{0})(1 - (h \cdot v)^5)$$

### Mesuring BRDFs

<!-- lecture 17 -->
## Advanced Topics in Rendering

### Advanced Light Transport

### Bidirectional Path Tracing (BDPT 双向路径追踪) 

优点
+ 从相机出发的第一次反射为漫反射时，比较适合双向路径追踪。
换一种说法，光源没有直接照亮场景，而是通过漫反射照亮，这种情况适合双向路径追踪

缺点：
+ 这种算法比较满比路径追踪慢

### Metropolis Light Transport(MLT)

+ A Markov Chain Monte Carlo 马尔可夫链

优点
+ 适用于复杂场景，用于寻找路径追踪的 path

缺点
+ 不知道什么时候会收敛
+ 操作是局部的，导致有的像素点收敛较快，有的像素点收敛较慢，导致图片出现“脏点”

### Photon Mapping 光子映射 

优点
+ 适合处理 caustics 场景，适合处理 Specular-Diffuse-Specular

### Instant Radiosity

多光源

### Advanced Apperances Modeling (外观建模)

### Participating Media(散射介质): Fog

### Hair Apperance

#### Jajiya-Kay Model

不够真实，只考率头发表面的散射

+ 没有考虑光线穿入头发内部，在穿出头发表皮到空气中
+ 没有考虑光线穿入头发内部，再发生反射，再穿出头发表皮到空气中

#### Marschner Model

将头发理解为带色素的玻璃柱

#### Double Cylinder Model

课程作者提出的模型

双层圆柱模型，模拟头发中的髓质

应用于《猩球崛起》《狮子王HD》

### Granular Material

### Translucent Materail

### BSSRDF 次表面反射

### Cloth

### Observations

### Detailed Material under Wave Optics

### Procedural Apperance

<!-- Lecture 19 -->
### Cameras, Lenses and Light Fields

### Field of view

### Exposure

Exposuer = time x irradiance

影响图片亮度的因素
+ Aperture size
  + F-Number 数字越小光圈越大，景深就越明显 
+ Shutter speed
  + 快门时间减短可以消除运动模糊，但会导致照片亮度变暗
  + rolling shutter
+ ISO gain

### High-Speed Photography

### Real Lens Elements Are Not Ideal - Aberrations

### Gauss' Ray Tracing Construction

### Defocuse Blur

### Compuying Circle of Confusion (CoC) Size

$$ \frac{C}{A} = \frac{|z_{s} - z_{i}|}{z_{i}} $$

$z_{s}$ 相距，像与镜片之间的距离

$z_{i}$ 焦距

$C$ Circle of Confusion (CoC) Size

$A$ 镜片直径约等于光圈大小

故在 $z_{s}$ $z_{i}$ 固定的情况下，模糊效果与镜片大小成正比

### Deptch of Field

某一个CoC的阙值内，认为其成像是不模糊的，这段成像区域记为景深，物体在这段距离内是模糊的，超出这段距离就是模糊的

<!-- Lecture 20 -->
### Light of Field

### Light Field Camera

光场照相机记录的是原本的世界在某一个像素上各个方向的光线(Radiance)，是一种真正的记录（记录了整个光场的相机），由此他可以支持后期聚焦，修改光圈，修改iso，修改相机角度

普通光学照相机，记录像素点上收到的各个方向光线叠加之后的颜色(Irradiance)

缺点：
+ 光场照相机分辨率较低，原本胶片一个像素记录一个像素，现在一个像素记录了100个方向的光线，即需要一百个胶片像素来记录原本一个像素的信息

### Linearity of Spectral Power Distributions

光谱
### Spectral Response of Human Cone Cells

S，M，L cone cells

$$S = \displaystyle \int^{}_{} r_{S}(\lambda)s(\lambda)d\lambda $$

$$M = \displaystyle \int^{}_{} r_{M}(\lambda)s(\lambda)d\lambda $$

$$L = \displaystyle \int^{}_{} r_{L}(\lambda)s(\lambda)d\lambda $$


人感知到的颜色就是 $S$ $M$ $L$ 的值，并不是光谱

不同光谱的可能积分得到一个一样结果，这种现象就叫做同色异谱

### Metamerism

### Additive Color

### Standard Color Spaces

Standardized RGB (sRGB)
 
Adobe RGB

### Gamut

### HSV Color Space(Hue-Saturation-Value)

Hue 色调

Saturation 饱和度

Light 亮度

### CIELAB Space

互补色

### CMYK

减色系统，红绿蓝混合后变黑（CMYK）

加色系统，红绿蓝混合后变白

<!-- Lecture -->
### Animation

虚拟现实，为了让人不会感到晕眩，要达到90fps

### Keyfram Animation

### Physical Simulation

### Mass Spring System 质点弹簧系统

可以描述布
### Structures from Spring

模拟布的材质

### Finite Element Method

### Particle System

可以模拟流体，个体与群体的各种模型

先模拟后渲染

### Forward Kinematics

### Inverse Kinematics

已知最后点的位置，求各个关节的位置，用梯度下降求解

### Rigging

### Motion Capture

<!-- Lecture 22 -->
### Single Particle Simulation

### Eulers methods

### Implicit Euler Method

### Runge-Kutta Families

### Rigid Body Simulation

### Fluid Simulation

### A Simple Position-Based Method

gradient descent

### Eulerian vs Lagrangian

+ LAGRANGIAN APPROACH(质点法)
+ EULERIAN APPROACH(网格法)

### finale

几何
