# 快速笔记

## GPU pipeline rendering

### Classic graphics cards

1. Application
2. Geometry
    > 1. Definitions
    > 2. The World Coordinate System
    > 3. Camera Transformation
    > 4. Projection
    > 5. Lighting
    > 6. Cilpping
    > 7. Window-Viewport transfromation
3. Rasterization
4. screen

### Modern graphics cards

Modern graphics cards use a freely programmable, shader-controlled pipeline, which allows direct access to individual processing steps. To relieve the main processor, additional processing steps have been moved to the pipeline and the GPU.

<img src="https://upload.wikimedia.org/wikipedia/commons/9/95/3D-Pipeline.svg" style="background: white;">

### Graphics Pipeline

base on GAMES 101

![alt Graphics Pipeline](../image/Graphics-Pipeline.png)

### OpenGL Graphics Pipeline

<img src="https://www.khronos.org/opengl/wiki_opengl/images/RenderingPipeline.png" style="background: white;">

1. Vertex Specification
    1. Vertex Rendering
2. Vertex Processing
    1. Vertex Shader
    2. Tessellation
    3. Geometry Shader
3. Vertex Post-Processing
    1. Transfrom Feedback
    2. Primitive assembly
    3. Clipping
    4. Face Culling
4. Rasterization
5. Fragment Processing
7. Per-Sample Operations

#### 参考资料
[rendering_pipeling_overview](https://www.khronos.org/opengl/wiki/Rendering_Pipeline_Overview)

### Vulkan Graphics Pipeline

<img src="https://vulkan-tutorial.com/images/vulkan_simplified_pipeline.svg" style="background: white;">

#### 参考资料
[vulkan_Graphics_pipeline_basic](https://vulkan-tutorial.com/Drawing_a_triangle/Graphics_pipeline_basics/Introduction)

## geometry shader
---

+ points: when drawing GL_POINTS primitives (1).
+ lines: when drawing GL_LINES or GL_LINE_STRIP (2).
+ lines_adjacency: GL_LINES_ADJACENCY or GL_LINE_STRIP_ADJACENCY (4).
+ triangles: GL_TRIANGLES, GL_TRIANGLE_STRIP or GL_TRIANGLE_FAN (3).
+ triangles_adjacency : GL_TRIANGLES_ADJACENCY or + GL_TRIANGLE_STRIP_ADJACENCY (6).

## Shadow Map Antialiasing
---

### Percentage-Closer Filtering

#### box filtering （领近采样）

将阴影四周9个fragment的颜色相加求均值即为当前的阴影颜色。

效果一般，只能减轻这种锯齿，但由于还是每个fragment单一颜色，还是会有锯齿存在。并且在类似栏杆物体的具有间隙的阴影会糊成一片

#### bilinear interpolation（双线性插值）

// tood

#### Poisson Disk

### Percentage Closer Soft Shadows


### 参考文献

[实时阴影技术总结](https://zhuanlan.zhihu.com/p/45805097)

## Cascaded Shadow Maps

## NormalMap
---

将法线存入在纹理图片会导致，纹理图片显示蓝色，这是用于物体表面法线默认为 z 轴，故大部分法线也是朝向 z 轴及(0, 0, 1)这种坐标转换为 grb 三个分量，刚好 b 分量为 1 即为蓝色

也是由于这个原因法线默认朝 z 轴，那么当表面法线朝向改变时，纹理的坐标是不变的，这个时候需要一个切线矩阵，将光线变换到切线空间，就能与 z 轴朝向的法线进行计算，得到更真实的光照效果

这里的切线矩阵，实际就是表面（三角形）的一个正交矩阵，通过计算的到的三个分量，有可能不正交（这里计算过程略）。这个时候需要施密特正交化(Gram-Schmidt process)，将向量转换为正交向量

## euler angle
---
<div style="">

$$ R_z(\alpha) = \begin{bmatrix} cos\alpha & -sin\alpha & 0 \\ sin\alpha & cos\alpha & 0 \\ 0 & 0 & 1 \\ \end{bmatrix} $$

$$ R_x(\alpha) = \begin{bmatrix} cos\alpha & -sin\alpha & 0 \\ sin\alpha & cos\alpha & 0 \\ 0 & 0 & 1 \\ \end{bmatrix} $$

$$ R_z(\alpha) = \begin{bmatrix} cos\alpha & -sin\alpha & 0 \\ sin\alpha & cos\alpha & 0 \\ 0 & 0 & 1 \\ \end{bmatrix} $$

</div>

## Order Independent Transparency 顺序无关透明度
---
### Depth Peeling 深度剥离

出自 NVIDIA，其核心

### 参考文献

[Depth Peeling in NVDIA](https://developer.download.nvidia.com/assets/gamedev/docs/OrderIndependentTransparency.pdf)

### Per-Pixel Linked Lists

## gamma correct 伽马校正
---
### 什么是Linear、Gamma、sRGB和伽马校正？

而历史上最早的显示器(阴极射线管)显示图像的时候，电压增加一倍，亮度并不跟着增加一倍。即输出亮度和电压并不是成线性关系的，而是呈亮度增加量等于电压增加量的2.2次幂的非线性关系：

$$ l = u^{2.2} $$

这种非线性关系与人眼所感知的亮度正好匹配，人眼感知到的亮度变化却不是线性的，而是在暗的地方有更多的细节。换句话说，我们应该用更大的数据范围来存暗色，用较小的数据范围来存亮色

![](https://learnopengl-cn.github.io/img/05/02/gamma_correction_brightness.png)

在数学上，伽马校正是一个约0.45的幂运算（和上面的2.2次幂互为逆运算）：

$$ c_{o} = c_{i}^{\frac{1}{2.2}} $$

经过0.45幂运算，再由显示器经过2.2次幂输出，最后的颜色就和实际物理空间的一致了。

**最后，什么是sRGB呢**？1996年，微软和惠普一起开发了一种标准sRGB色彩空间。这种标准得到许多业界厂商的支持。**sRGB对应的是Gamma0.45所在的空间**。

### 统一到线性空间

1. 将SRGB纹理移除伽马矫正
2. 在线性空间进行光照计算，得到正确的颜色
3. shader 在输出颜色时，对颜色进行gamma correct，其实回到Gamma0.45所在的空间
4. 显示器经过 2.2 次幂输出，最后屏幕上显示的颜色又回到线性空间

### 参考文献

[Gamma、Linear、sRGB 和Unity Color Space，你真懂了吗？](https://zhuanlan.zhihu.com/p/66558476)

## Cook–Torrance model

In 1982, Robert Cook and Kenneth Torrance published a reflectance model that more accurately represented the physical reality of light reflectance than the Phong and Blinn-Phong models.

### The Rendering Equation

$L_o(p, \omega_o) = L_e(p, \omega_o) + \displaystyle \int^{}_{\Omega^+} L_i(p, \omega_i)f_r(p, \omega_i, \omega_o)(n \cdot \omega_i)d\omega_i$

$L_e(p, \omega_o)$ 为该点 $p$ 自己发的光，单位时间内 $p$ 点发的光向  $\omega_o$ 方向贡献的 radiance

$f_r(p, \omega_i, \omega_o)$ 为 BRDF 函数，表示点 $p$，在 $\omega_i$ 方向入射的光，反射到 $\omega_o$ 方向的 radiance

$L_i(p, \omega_i)$ 表示单位时间内 $p$ 点接受 $\omega_i$ 方向的 radiance

$(n \cdot \omega_i)$ 表示 $\omega_i$ 方向的光，由于角度带来的衰减 

$\displaystyle \int^{}_{\Omega^+} L_i(p, \omega_i)f_r(p, \omega_i, \omega_o)(n \cdot \omega_i)d\omega_i$ 为对四面八方反射过来的光线进行积分


### Cook-Torrance Equation

$$ f_{r} = k_{d}f_{lambert} + k_{s}f_{cook-torrance} $$

$k_d$ 入射光线能量中折射部分的比率, $k_s$ 入射光线能量中反射部分的比率，由能量守恒定律可知 $k_d + k_s = 1$

$$f_{lambert} = \frac{c}{\pi}$$

$f_{lambert}$代表漫反射部分，$c$ 是可以是一个单通道的反射率（albedo）在[0, 1]之间的一个数；也可以是三通道的，RGB；也可以是光谱

$$f_{cook-torrance} = \frac{DFG}{4(\omega_o \cdot n)(\omega_i \cdot n)} $$

其中 $F$ 为菲涅尔项(Fresnel equation), $D$ 为法线分布函数(Normal Distribution function)，$G$ 为几何函数(Geometry funciton), $f_{cook-torrance}$ 代表镜面反射部分

### Fresnel equation

菲涅尔效应：

物体在不同角度观察下，表面反射率是不一样的。简单的讲，视线垂直于表面时，反射较弱，当视线与法线的夹角越大，反射越明显。

![](https://s2.ax1x.com/2020/02/21/3nUA4s.png)

菲涅尔函数就是用来描述我们改变不同的入射角时光线发生反射与光线发生折射的比率

s偏振：

<img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/6b92746c5ddf76cd0560b4798438aa7efc04f009" style="background: white;">

p偏振：

<img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/269fc0d8deb5f59f0349c28ad15504fc8ed44aff" style="background: white;">

菲涅尔方程中用到的变量

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Fresnel.svg/2880px-Fresnel.svg.png" style="width: 300px;">

由于菲涅尔函数比较复杂这里我们计算的时候用 Fresnel-Schlick 来近似

$$ F_{Schlick}(h, v, F_0) = F_0 + (1 - F_0)(1 - (h \cdot v))^5$$

这里需要注意的是要满足菲涅尔方程光线一定是**从折射率低的介质射入折射率高的介质**

### 参考资料

[菲涅耳方程](https://zh.m.wikipedia.org/zh-hans/%E8%8F%B2%E6%B6%85%E8%80%B3%E6%96%B9%E7%A8%8B)