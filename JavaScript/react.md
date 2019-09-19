# react

## 无状态组件与有状态组件

### 无状态组件特性

+ 不需要显示声明this关键字，在ES6的类声明中往往需要将函数的this关键字绑定到当前作用域，而因为函数式声明的特性，我们不需要再强制绑定
+ 便于测试
+ 性能高

### 写法对比

有状态组件：

```js
export default class CusImg extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.style}>
        <img src={this.props.imgurl}/>
        <text className={this.props.textStyle}>
          {this.props.text}
        </text>
      </div>
    );
  }
}

CusImg.propTypes = {
};
```

无状态组件：

```js
const CusImg = (props) => (
  <div>
    <div className={props.style}>
    <img src={props.imgurl}/>
    <text className={props.textStyle}>  
      {props.text}
    </text>
  </div>
)
```

### 性能对比

再讲性能对比之前先讲一下无状态组件的调用方式。

第一种

```js
# app.js
import React, { Component, PropTypes } from 'react';

import styles from '../css/app.css'
import CusImg from './cusimg'

export default class App extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className={styles.haha}>
        <CusImg
          style={styles.root}
          textStyle={styles.textStyle}
          imgurl={require('../imgs/qcord.png')}
          text="二维码" />
      </div>
    );
  }
}
```

第二种 （直接当成函数调用）

```js
# app.js

render() {
  return (
    <div className={styles.haha}>
      {CusImg({
        style:styles.root ,
        textStyle:styles.textStyle,
        imgurl:require('../imgs/qcord.png'),
        text:"二维码"
      })}
    </div>
  );
}
```

第一种调用方式与使用有状态组件的性能差不多，第二种调用方式能够显著提高。

+ [17、React系列之--无状态组件你真的知道吗](https://juejin.im/entry/59a980306fb9a02485103d0b)
