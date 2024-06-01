# IOS

app icons and launch screen 

如果设置 launch Screen file 麦克风权限弹窗没有副标题导致过审问题

## unity 编译

1. 编译目标选择 UnityFramework

2. data 勾选 UnityFramework

3. Libraries/Plugins/iOS/NativeCallProxy.h 勾选 UnityFramework 并改成pubilc

4. Pruducts/UnityFramework 在文件夹展示，并复制到目标工程

5. ios 不支持自定义事件，不支持自己 new 一个 UIEvent 事件

## ios native

### AVAudioPlayer

AVAPlayer/AVAudioPlayer 对象需要放在类的属性上，否则不会播放

### CoreHaptics

ios 震动系统

设计师可以用 [haptrix](https://www.haptrix.com/) 工具进行编辑，再生成配置文件，最后工程同学导入配置文件

### ios 推送测试eee

https://icloud.developer.apple.com/dashboard/notifications


### ios 生命周期回调

ios 14 后优先使用 scenedelegate

ios 14 前优先使用 appdelegate

兼容情况两者都得添加相关逻辑