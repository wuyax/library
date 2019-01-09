
/**
  * jflib V1.0.0
  * (c) 2018-2019
  * Copyright all contributors
  * Released under MIT license.
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.JFE = {})));
}(this, (function (exports) { 'use strict';

/**
* 打乱一个数组，让其中的值随机组成新数组。
* @memberof  util
* @param { Array } arr 数组
* @returns {Array} 
* @author 魏彬  <weibin@jusfoun.com>
 * @example
 *   JFE.util.arrShuffle([1,2,3,4,5,6]) //[3, 4, 6, 2, 5, 1]
 */

function arrShuffle(arr) {
  //
  var _arr = arr.slice(0); //存一个副本 不能直接改变原数组
  for (var i = 0; i < _arr.length; i++) {
    var j = getRandomInt(0, i);
    //临时交换变量
    var t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}

//随机返回min 到 max之间的一个任意数 +1 保证取到MAX
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var arrShuffle_1 = arrShuffle;

/**
 * 合并多个数组为一个数组。
 * @memberof  util
 * @param { Array } arr 多个数组
 * @returns {Array} 
 * @author 魏彬  <weibin@jusfoun.comxxxx>
 * @example
 *   JFE.util.arrayConcat([1,2],[3,4],[5,6]) //[1,2,3,4,5,6]
 */

function arrayConcat(args) {
  return [].concat.apply([], arguments);
}

var arrayConcat_1 = arrayConcat;

/**
* 取得数组中的最大值或者最小值。
* @memberof  util
* @param { Array } arr 数组
* @param { string } MaxOrMin 最大值还是最小值 'max' or 'min'
* @author 魏彬  <weibin@jusfoun.com>
* @returns {Number} 
 * @example
 *   const a =  JFE.util.getArrayMaxOrMin([1,2,3,4,5,6.6,0.1,'aaa'],'min')
      console.log(a) //0.1
 */

function arrayMaxOrMin(arr, MaxOrMin) {
  var newArr = [];
  arr.forEach(function (v, i) {
    if (!isNaN(v)) {
      newArr.push(v);
    }
  });

  if (Object.prototype.toString.call(newArr) == '[object Array]' && Object.keys(newArr).length) return Math[MaxOrMin].apply(null, newArr);else return false;
}

var getArrayMaxOrMin = arrayMaxOrMin;

/**
* 数组去重。
* @memberof  util
* @param { Array } arr 数组
* @returns {Array}
* @author 魏彬  <weibin@jusfoun.com>
 * @example
 * const a = [1,1,2,3,3,5,6]   
 *
 * JFE.util.unique(a) //[1,2,3,5,6]
 */

function unique(arr) {
    var n = [];
    for (var i = 0; i < arr.length; i++) {
        if (n.indexOf(arr[i]) == -1) {
            n.push(arr[i]);
        }
    }
    return n;
}

var unique_1 = unique;

/**
 * JFE脚本库，JFE.util下挂载了项目中常见的工具函数
 * @namespace util
 */

//type
/* 
export {isArray} from './type/is-array.js'
export {isDate} from './type/is-date.js'
export {isFunction} from './type/is-function.js'
export {isNumber} from './type/is-number.js'
export {isObjectEmpty} from './type/is-object-empty.js'
export {isObject} from './type/is-object.js'
export {isCharacter} from './type/is-character.js'
export {isInteger} from './type/is-Integer.js'

//check
export {checkNotNull} from './validate/checkNotNull.js'
export {checkString} from './validate/checkString.js'
export {checkPhone} from './validate/checkPhone.js'
export {checkEmail} from './validate/checkEmail.js'


//array
export {arrayMaxOrMin} from './array/getArrayMaxOrMin.js'
export {arrayUnique} from './array/unique.js'
export {arrayConcat} from './array/arrayConcat.js'
export {arrShuffle} from './array/arrShuffle.js'


//stroage
export {cookieGet} from './storage/cookieGet.js'
export {cookieSet} from './storage/cookieSet.js'
export {cookieDel} from './storage/cookieDel.js'

//common
// export {extend} from './module/extend.js'

export {classOf} from './common/classOf.js'
export {compare} from './common/compare.js'
export {extend} from './common/extend.js'
export {formatTime} from './common/formatTime.js'
export {isBrowser} from './common/isBrowser.js'
export {Random} from './common/Random.js'
export {urlArgs} from './common/urlArgs.js'
export {urlTrans} from './common/urlTrans.js'
export {strContains} from './common/strContains.js'
export {maxObj} from './common/maxObj.js'
export {excerpt} from './common/excerpt.js'
export {exitFullScreen } from './common/fullScreen.js'
export {fullScreen} from './common/fullScreen.js'
export {openWindow} from './common/openWindow.js' */

var util = {
  arrShuffle: arrShuffle_1,
  arrayConcat: arrayConcat_1,
  getArrayMaxOrMin: getArrayMaxOrMin,
  unique: unique_1
};

var util_1 = util.arrShuffle;
var util_2 = util.arrayConcat;
var util_3 = util.getArrayMaxOrMin;
var util_4 = util.unique;

exports['default'] = util;
exports.arrShuffle = util_1;
exports.arrayConcat = util_2;
exports.getArrayMaxOrMin = util_3;
exports.unique = util_4;

Object.defineProperty(exports, '__esModule', { value: true });

})));
