## 解决模型内存占用过高

Try using [glTF-Transform CLI](https://gltf-transform.dev/cli) to run:
```
gltf-transform inspect my-model.glb
```
This will print the memory use of each mesh and texture in the model. The usual cause of this issue is that PNG and JPEG textures become fully uncompressed in GPU memory. The only way to avoid that is to reduce the resolution of the textures (unpack to separated .gltf, resize textures, repack to .glb), or to compress them using KTX2/Basis. glTF-Transform or gltfpack can do the KTX2/Basis compression for you, but it sometimes requires some tuning of the compression parameters to avoid compression artifacts.

## 骨骼动画

### Skeleton

#### bones

The array of bones. Note this is a copy of the original array, not a reference, so you can modify the original array without effecting this one.

一个骨骼数组，这是一份原始骨骼的深拷贝，非引用拷贝

#### matrixWorld 即姿态

每一个 `Bone` 都有一个 `matrixWorld`，如果我们把每个 `Bone` 局部空间中的原点 (0, 0, 0) 通过自己的 `matrixWorld` 进行转换，就会把这些“原点”转换为世界空间中的点，然后，根据 `Bone` 的父子关系进行“连线”，最后，我们就得到了 `SkeletonHelper` 的绘制结果。（*这一段也是 `SkeletonHelper` 的实现原理*）

#### boneInverses

An array of Matrix4s that represent the inverse of the matrixWorld of the individual bones.

代表每一个 `Bone` 的世界矩阵的逆矩阵，即上述矩阵的逆矩阵。

#### pose()

Returns the skeleton to the base pose.

由于 `boneInverses` 存储的为初使姿态的逆矩阵，故 `boneInverses` 的逆矩阵就是初使的 `matrixWorld`

$$
MatrixWorld_{child} = MatrixWorld_{parent} \times MatrixLocal_{child}
$$ 

参考文章:

这是一个链接 [骨骼原理及源码](https://juejin.cn/post/7178435523835330620)。