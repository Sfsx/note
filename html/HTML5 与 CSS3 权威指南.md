# HTML5 与 CSS3 权威指南

## 第1章 Web 变迁

### 1.1 迎接新的 Web 时代

### 1.2 HTML5 深受欢迎的理由

### 1.3 可以放心使用 HTML5 的三个理由

### 1.4 HTML5 要解决的三个问题

## 第2章 HTML5 与 HTML4 的区别

### 2.1 语法改变

### 2.2 新增的元素和废除的元素

#### 2.2.1 新增结构元素

+ section
  + 不要将 section 元素设置样式的页面 容器，因为那是div的工作
  + 如果 article 元素、aside 元素或 nav 元素更符合情况，不要使用setion 元素
  + 不要为没有标题的内容区块使用 section 元素
+ article
+ aside
+ header
+ footer
+ nav
+ figure

#### 2.2.2 新增其他元素

+ video
+ audio
+ embed
+ mark
+ progress
+ meter
+ time
+ ruby
+ rt
+ rp
+ wbr
+ canvas
+ command
+ details
+ datalist
+ keygen
+ output
+ source
+ menu
+ dialog

### 2.3 新增的属性喝废除的属性

### 2.4 全局属性

### 2.5 新增事件

## 第3章 HTML5 的结构

### 3.1 新增主体结构元素

### 3.2 新增非主体结构元素

### 3.3 HTML5 中网页结构

#### 3.3.1 HTML5 中的大纲

#### 3.3.2 大纲编排规则

#### 3.3.3 对新结构元素使用样式

## 第4章 表达及其他新增和改良元素

+ HTML5 新增的表单内元素可以使用的属性及其使用方法
+ HTML5 新增表单元素及其使用方法
+ HTML5 中新增的关于表单内元素内容的有效性验证方法，包括属性验证、显示验证以及取消验证
+ HTML5 中除了表单元素以外，在页面上新增及改良的元素以及他们的使用方法

### 4.1 新增元素与属性

+ form
+ formaction
+ formmethod
+ formenctype
  + application/x-www-from-urlencoded
  + multipart/form-data
  + text/plain
+ formtarget
+ autofocus
+ required
+ labels 表单验证提示
+ control
+ placeholder
+ select list
+ autocomplete
+ pattern
+ selectionDirection
+ indeteminate

### 4.2 表单验证

novalidate 属性

### 4.3 增强的页面元素

#### 4.3.13 增强的 script 元素

async 属性与 defer 属性。

当 script 元素添加这两个属性时，在浏览器发出下载脚本文件的请求，开始脚本文件的下载工作后，立即执行页面的加载工作。

async 表示加载完成后立即触发。当脚本文件下载完成后立即触发 onload 事件，哪个 script 先加载完成，先触发。

defer 表示页面全部加载完成后再触发。按照 html 文档中的排序依次触发

## 第5章 绘制图形

### 5.1 canvas 元素的基础知识

### 5.2 使用路劲

### 5.3 绘制渐变图形

### 5.4 绘制变形图形

### 5.5 给图形绘制阴影

### 5.6 使用图像

### 5.7 图像图形组合混合

### 5.8 绘制文字

## 第6章 多媒体相关 API

### 6.1 多媒体播放

### 6.2 对视频和音频添加字幕

## 第7章 History API

## 第8章 本地存储
