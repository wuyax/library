﻿/**
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
 * 默认先读取本地图表数据
 */
var localChartDataName = 'chartData.json';

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
    init: function (params) {

        if (!params || !params.container || !params.id) {
            console.log("参数有误");
            return null;
        }

        //图表容器
        var $container = $.type(params.container) == "string" ?
            $("#" + params.container) : $(params.container);
        if ($container.length == 0) {
            console.log("图表容器" + params.container + "不存在");
            return null;
        }

        var myChart = echarts.init($container[0]);

        if (params.use) {
            myChart.setOption(params.option, true);
        } else {
            _getOption(params.id, true,function (_option) {
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
    getOption: function (_id) {

        return _getOption(_id, false);
    },
    asyncGetOption: function (_id, _callback) {

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
            })
            if (option) {
                if (_callback) _callback(option);
                else return option;
            }
        }
        return _ajaxOption(_id, _isAsync, _callback);
    } catch (e) {
        console.log("getOption", e.message);
        if (_callback) _callback(null);
        else return null;
    }
}

function _ajaxOption(_id, _isAsync, _callback) {

    var _result;
    $.ajax({ //获取图表option
        type: 'GET',
        async: _isAsync,
        url: serviceHost + '/api/chart/GetChart?id=' + _id,
        success: function (result) {
            if (_callback) _callback(result.json);
            _result = result.json;
        },
        error: function (e) {
            console.log("ajaxOption", e.message);
            if (_callback) _callback(null);
        }
    });
    return _result;
}


 module.exports = charts