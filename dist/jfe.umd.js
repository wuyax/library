
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
 * 图表引擎
 * Created by jusfoun-fe.github.io on 2016/05/14.
 * @author 李猛 <limeng@jusfoun.com>, 朱润亚 <zry@jusfoun.com>
 * @version v1.6.3
 * @module charts
 */
/**
 * 图表服务器
 */
var serviceHost = 'http://img.9cfcf.com';
/**
 * charts 图表库
 * @example
 * JFE.chart.charts.init({container:domElement,id:chartId})
 * @see {@link http://img.9cfcf.com/help.html?id=1393&type=scatter|npm包使用说明}
 *
 */
var charts = {
    localData: null,
    /**
     * 初始化图表到容器
     *
     */
    init: function init(params) {
        if (!params || !params.container || !params.id) {
            console.log("参数有误");
            return null;
        }
        //图表容器
        var $container = $.type(params.container) == "string" ? $("#" + params.container) : $(params.container);
        if ($container.length == 0) {
            console.log("图表容器" + params.container + "不存在");
            return null;
        }
        var myChart = echarts.init($container[0]);
        if (params.use) {
            myChart.setOption(params.option, true);
        } else {
            _getOption(params.id, true, function (_option) {
                if (!_option) {
                    console.log("获取图表id=" + params.id + " 的数据失败");
                    return;
                }
                eval(_option);
                if (params.option) option = $.extend(true, option, params.option);
                myChart.setOption(option, true);
            });
        }
        return myChart;
    },
    getOption: function getOption(_id) {
        return _getOption(_id, false);
    },
    asyncGetOption: function asyncGetOption(_id, _callback) {
        _getOption(_id, true, function (_option) {
            if (_option) eval(_option);
            _callback(option || null);
        });
    }
};
// try {
//     $.ajax({ //获取本地图表数据
//         type: 'GET',
//         url: localChartDataName,
//         success: function (data) {
//             charts.localData = eval(data);
//         },
//         error: function (e) {
//         },
//         async: false
//     });
// } catch (e) {
//     console.log(e);
// }
function _getOption(_id, _isAsync, _callback) {
    try {
        if (charts.localData) {
            var option;
            $.each(charts.localData, function () {
                if (this.id == _id) {
                    option = this.json;
                    return;
                }
            });
            if (option) {
                if (_callback) _callback(option);else return option;
            }
        }
        return _ajaxOption(_id, _isAsync, _callback);
    } catch (e) {
        console.log("getOption", e.message);
        if (_callback) _callback(null);else return null;
    }
}
function _ajaxOption(_id, _isAsync, _callback) {
    var _result;
    $.ajax({ //获取图表option
        type: 'GET',
        async: _isAsync,
        url: serviceHost + '/api/chart/GetChart?id=' + _id,
        success: function success(result) {
            if (_callback) _callback(result.json);
            _result = result.json;
        },
        error: function error(e) {
            console.log("ajaxOption", e.message);
            if (_callback) _callback(null);
        }
    });
    return _result;
}
var charts_1 = charts;

/**
 * JFE的图表库，提供了一些项目中常用图表。
 * <br>
 *  - {@link module:charts|charts 图表}
 * <iframe src='http://img.9cfcf.com/' style='width:100%;height:800px;border:0'></iframe>
 *  <br>
 *  {@link http://img.9cfcf.com/|全屏演示}
 * @namespace chart
 */
var chart = { charts: charts_1 };

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

// import * as chart  from './chart/index.js';
// import * as visual  from './visual/index.js';
// import * as util from './util/index.js';
/**
 * 脚本库代码要求
 * 1.耦合性低-不依赖第三方库
 * 2.兼容性强-支持主流浏览器
 * 3.容错性强-不应外部调用及传参导致内部报错
 * 4.通用性广-基本每个项目都经常可以用到
 * 5.易用性高-符合开发习惯，减少学习成本
 */
/**
 * 是否开启调试模式,默认false
 * @type {boolean}
 * @example
 * console.log('生成环境无法打印')
 * JFE.debug = true
 * console.log('调试模式可以打印')
 */
// 环境变量-调试模式
var debug = true;
// 兼容性代码， 小于ie9适配
window.console = window.console || function () {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {};
    return c;
}();
// 重写console.log 调试模式启用日志输出
console.log = function (log) {
    return function () {
        if (debug) try {
            log.apply(console, arguments);
        } catch (e) {}
    };
}(console.log);
/**
 * 浏览器判断
 */
var Browser = function Browser() {
    var _window = window || {};
    var _navigator = navigator || {};
    return function (userAgent) {
        var u = userAgent || _navigator.userAgent;
        var _this = this;
        var match = {
            //内核
            'Trident': u.indexOf('Trident') > -1 || u.indexOf('NET CLR') > -1,
            'Presto': u.indexOf('Presto') > -1,
            'WebKit': u.indexOf('AppleWebKit') > -1,
            'Gecko': u.indexOf('Gecko/') > -1,
            //浏览器
            'Safari': u.indexOf('Safari') > -1,
            'Chrome': u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1,
            'IE': u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
            'Edge': u.indexOf('Edge') > -1,
            'Firefox': u.indexOf('Firefox') > -1 || u.indexOf('FxiOS') > -1,
            'Firefox Focus': u.indexOf('Focus') > -1,
            'Chromium': u.indexOf('Chromium') > -1,
            'Opera': u.indexOf('Opera') > -1 || u.indexOf('OPR') > -1,
            'Vivaldi': u.indexOf('Vivaldi') > -1,
            'Yandex': u.indexOf('YaBrowser') > -1,
            'Kindle': u.indexOf('Kindle') > -1 || u.indexOf('Silk/') > -1,
            '360': u.indexOf('QihooBrowser') > -1,
            '360EE': u.indexOf('360EE') > -1,
            '360SE': u.indexOf('360SE') > -1,
            'UC': u.indexOf('UC') > -1 || u.indexOf(' UBrowser') > -1,
            'QQBrowser': u.indexOf('QQBrowser') > -1,
            'QQ': u.indexOf('QQ/') > -1,
            'Baidu': u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1,
            'Maxthon': u.indexOf('Maxthon') > -1,
            'Sogou': u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1,
            'LBBROWSER': u.indexOf('LBBROWSER') > -1,
            '2345Explorer': u.indexOf('2345Explorer') > -1,
            'TheWorld': u.indexOf('TheWorld') > -1,
            'XiaoMi': u.indexOf('MiuiBrowser') > -1,
            'Quark': u.indexOf('Quark') > -1,
            'Qiyu': u.indexOf('Qiyu') > -1,
            'Wechat': u.indexOf('MicroMessenger') > -1,
            'Taobao': u.indexOf('AliApp(TB') > -1,
            'Alipay': u.indexOf('AliApp(AP') > -1,
            'Weibo': u.indexOf('Weibo') > -1,
            'Douban': u.indexOf('com.douban.frodo') > -1,
            'Suning': u.indexOf('SNEBUY-APP') > -1,
            'iQiYi': u.indexOf('IqiyiApp') > -1,
            //系统或平台
            'Windows': u.indexOf('Windows') > -1,
            'Linux': u.indexOf('Linux') > -1 || u.indexOf('X11') > -1,
            'Mac OS': u.indexOf('Macintosh') > -1,
            'Android': u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
            'Ubuntu': u.indexOf('Ubuntu') > -1,
            'FreeBSD': u.indexOf('FreeBSD') > -1,
            'Debian': u.indexOf('Debian') > -1,
            'Windows Phone': u.indexOf('IEMobile') > -1 || u.indexOf('Windows Phone') > -1,
            'BlackBerry': u.indexOf('BlackBerry') > -1 || u.indexOf('RIM') > -1,
            'MeeGo': u.indexOf('MeeGo') > -1,
            'Symbian': u.indexOf('Symbian') > -1,
            'iOS': u.indexOf('like Mac OS X') > -1,
            'Chrome OS': u.indexOf('CrOS') > -1,
            'WebOS': u.indexOf('hpwOS') > -1,
            //设备
            'Mobile': u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1,
            'Tablet': u.indexOf('Tablet') > -1 || u.indexOf('Pad') > -1 || u.indexOf('Nexus 7') > -1
        };
        //修正
        if (match['Mobile']) {
            match['Mobile'] = !(u.indexOf('iPad') > -1);
        } else if (_window.showModalDialog && _window.chrome) {
            var isSE = false;
            for (var i = 0, l = navigator.mimeTypes.length; i < l; i++) {
                if (navigator.mimeTypes[i]['type'] == 'application/gameplugin') {
                    isSE = true;
                    break;
                }
            }
            if (isSE) {
                match['360SE'] = true;
            } else {
                match['360EE'] = true;
            }
        }
        //基本信息
        var hash = {
            engine: ['WebKit', 'Trident', 'Gecko', 'Presto'],
            browser: ['Safari', 'Chrome', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Kindle', '360', '360SE', '360EE', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'LBBROWSER', '2345Explorer', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi'],
            os: ['Windows', 'Linux', 'Mac OS', 'Android', 'Ubuntu', 'FreeBSD', 'Debian', 'iOS', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'Chrome OS', 'WebOS'],
            device: ['Mobile', 'Tablet']
        };
        _this.device = 'PC';
        _this.language = function () {
            var g = _navigator.browserLanguage || _navigator.language;
            var arr = g.split('-');
            if (arr[1]) {
                arr[1] = arr[1].toUpperCase();
            }
            return arr.join('_');
        }();
        for (var s in hash) {
            for (var i = 0; i < hash[s].length; i++) {
                var value = hash[s][i];
                if (match[value]) {
                    _this[s] = value;
                }
            }
        }
        //系统版本信息
        var osVersion = {
            'Windows': function Windows() {
                var v = u.replace(/^.*Windows NT ([\d.]+);.*$/, '$1');
                var hash = {
                    '6.4': '10',
                    '6.3': '8.1',
                    '6.2': '8',
                    '6.1': '7',
                    '6.0': 'Vista',
                    '5.2': 'XP',
                    '5.1': 'XP',
                    '5.0': '2000'
                };
                return hash[v] || v;
            },
            'Android': function Android() {
                return u.replace(/^.*Android ([\d.]+);.*$/, '$1');
            },
            'iOS': function iOS() {
                return u.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.');
            },
            'Debian': function Debian() {
                return u.replace(/^.*Debian\/([\d.]+).*$/, '$1');
            },
            'Windows Phone': function WindowsPhone() {
                return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2');
            },
            'Mac OS': function MacOS() {
                return u.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.');
            },
            'WebOS': function WebOS() {
                return u.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1');
            }
        };
        _this.osVersion = '';
        if (osVersion[_this.os]) {
            _this.osVersion = osVersion[_this.os]();
            if (_this.osVersion == u) {
                _this.osVersion = '';
            }
        }
        //浏览器版本信息
        var version = {
            'Safari': function Safari() {
                return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
            },
            'Chrome': function Chrome() {
                return u.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1');
            },
            'IE': function IE() {
                return u.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1');
            },
            'Edge': function Edge() {
                return u.replace(/^.*Edge\/([\d.]+).*$/, '$1');
            },
            'Firefox': function Firefox() {
                return u.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1');
            },
            'Firefox Focus': function FirefoxFocus() {
                return u.replace(/^.*Focus\/([\d.]+).*$/, '$1');
            },
            'Chromium': function Chromium() {
                return u.replace(/^.*Chromium\/([\d.]+).*$/, '$1');
            },
            'Opera': function Opera() {
                return u.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1');
            },
            'Vivaldi': function Vivaldi() {
                return u.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1');
            },
            'Yandex': function Yandex() {
                return u.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1');
            },
            'Kindle': function Kindle() {
                return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
            },
            '360': function _() {
                return u.replace(/^.*QihooBrowser\/([\d.]+).*$/, '$1');
            },
            '360SE': function SE() {
                var hash = { '55': '9.1', '45': '8.1', '42': '8.0', '31': '7.0', '21': '6.3' };
                var chrome_vision = navigator.userAgent.replace(/^.*Chrome\/([\d]+).*$/, '$1');
                return hash[chrome_vision] || '';
            },
            '360EE': function EE() {
                var hash = { '63': '9.5', '55': '9.0', '50': '8.7', '30': '7.5' };
                var chrome_vision = navigator.userAgent.replace(/^.*Chrome\/([\d]+).*$/, '$1');
                return hash[chrome_vision] || '';
            },
            'Maxthon': function Maxthon() {
                return u.replace(/^.*Maxthon\/([\d.]+).*$/, '$1');
            },
            'QQBrowser': function QQBrowser() {
                return u.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1');
            },
            'QQ': function QQ() {
                return u.replace(/^.*QQ\/([\d.]+).*$/, '$1');
            },
            'Baidu': function Baidu() {
                return u.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/, '$1');
            },
            'UC': function UC() {
                return u.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1');
            },
            'Sogou': function Sogou() {
                return u.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1');
            },
            '2345Explorer': function Explorer() {
                return u.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1');
            },
            'TheWorld': function TheWorld() {
                return u.replace(/^.*TheWorld ([\d.]+).*$/, '$1');
            },
            'XiaoMi': function XiaoMi() {
                return u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1');
            },
            'Quark': function Quark() {
                return u.replace(/^.*Quark\/([\d.]+).*$/, '$1');
            },
            'Qiyu': function Qiyu() {
                return u.replace(/^.*Qiyu\/([\d.]+).*$/, '$1');
            },
            'Wechat': function Wechat() {
                return u.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1');
            },
            'Taobao': function Taobao() {
                return u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1');
            },
            'Alipay': function Alipay() {
                return u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1');
            },
            'Weibo': function Weibo() {
                return u.replace(/^.*weibo__([\d.]+).*$/, '$1');
            },
            'Douban': function Douban() {
                return u.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1');
            },
            'Suning': function Suning() {
                return u.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1');
            },
            'iQiYi': function iQiYi() {
                return u.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1');
            }
        };
        _this.version = '';
        if (version[_this.browser]) {
            _this.version = version[_this.browser]();
            if (_this.version == u) {
                _this.version = '';
            }
        }
        //修正
        if (_this.browser == 'Edge') {
            _this.engine = 'EdgeHTML';
        } else if (_this.browser == 'Chrome' && parseInt(_this.version) > 27) {
            _this.engine = 'Blink';
        } else if (_this.browser == 'Opera' && parseInt(_this.version) > 12) {
            _this.engine = 'Blink';
        } else if (_this.browser == 'Yandex') {
            _this.engine = 'Blink';
        }
    };
};
//浏览器判断
var browser;
var bs;
browser = bs = { init: Browser() };
bs.init();
var src = {
    //命名空间
    util: util, chart: chart,
    //环境变量与一级对象
    debug: debug,
    browser: browser, bs: bs
};
var src_1 = src.util;
var src_2 = src.chart;
var src_3 = src.debug;
var src_4 = src.browser;
var src_5 = src.bs;

exports['default'] = src;
exports.util = src_1;
exports.chart = src_2;
exports.debug = src_3;
exports.browser = src_4;
exports.bs = src_5;

Object.defineProperty(exports, '__esModule', { value: true });

})));
