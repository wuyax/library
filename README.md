# 前端脚本库
## 使用
### 安装
浏览器环境：
```
// 完整引入
<script src="jfe.umd.min.js"></script>
```
```
// 按需引入
<script src="jfe.util.umd.min.js"></script>
```
通过 npm：
```
$ npm install jflib --save
```
在组件中引入
```
// 按需引入
import {util} from 'jflib'
// 使用
let arr = [3,4,4,33,4,3,4]
util.unique(arr) // [3,4,33]

// 完整引入
import JFE from 'jflib'
// 使用
let arr = [3,4,4,33,4,3,4]
JEF.util.unique(arr) // [3,4,33]
```

## JFE.util
常用工具包 如：数组，字符串，类型判断，验证等

## JFE.charts
图表工具包，如：echarts,d3,等图表 

## JFE.vsual (开发中...)
可视化组件包，如：3D地图，星云效果等
