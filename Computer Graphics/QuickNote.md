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

