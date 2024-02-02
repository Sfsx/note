# IOS

app icons and launch screen 

如果设置 launch Screen file 麦克风权限弹窗没有副标题导致过审问题

## unity 编译

1. 编译目标选择 UnityFramework

2. data 勾选 UnityFramework

3. Libraries/Plugins/iOS/NativeCallProxy.h 勾选 UnityFramework 并改成pubilc

4. Pruducts/UnityFramework 在文件夹展示，并复制到目标工程

5. ios 不支持自定义事件，不支持自己 new 一个 UIEvent 事件