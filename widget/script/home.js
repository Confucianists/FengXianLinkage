/**
 * Created by kevin on 2017/6/22.
 */
apiready = function () {
    var urls;
    new Vue({
        el: '#home',
        data: {},
        created: function () {
            UICore.showLoading('初始化中...');
            var all_h = $api.getStorage('main_h');
            var offset = $api.offset($api.dom(".logoimg"));
            var top_h = offset.h;
            var content_h = 'height:' + (parseInt(all_h) - parseInt(top_h)) + "px";
            //$api.css($api.dom(".content"), content_h);

            var offset_con = $api.offset($api.dom(".logoimg"));
            var w_all = offset_con.w;

            var cur_w = w_all - 3;
            
            /*计算功能通用盒子的长度*/
            var cur_w = 'width:' + (Math.floor(cur_w / 4)) + "px;height:" + (Math.floor(cur_w / 4)) + "px";
            //var cur_h = 'height:'+(Math.floor(cur_w/4))+"px";

            var mytest = $api.domAll(".temp_cur");
            for (var a in mytest) {
                $api.css(mytest[a], cur_w);
            }

            $api.css($api.dom(".content"), "display:block");
        },
        mounted: function () {
            this.settingdata();
        },
        methods: {
            rkxx: function () { //人口信息
                api.openWin({
                    name: 'populationMain',
                    url: '../html/population/populationMain.html',
                });
            },
            frxx: function () { //法人信息
                api.openWin({
                    name: 'legalPersonMain',
                    url: '../html/legalPerson/legalPersonMain.html',
                });

            },
            ldxx: function () { //楼栋信息
                api.openWin({
                    name: 'buildingMain',
                    url: '../html/building/buildingMain.html',
                });
            },
            fwxx: function () { //房屋信息
                api.openWin({
                    name: 'houseMain',
                    url: '../html/house/houseMain.html',
                });
            },
            fhxx: function () {
                api.openWin({
                    name: 'houseownerMain',
                    url: '../html/houseowner/houseownerMain.html',
                });
            },
            csbj: function () { //城市部件
                api.openWin({
                    name: 'cityComponentMain',
                    url: '../html/CityComponent/cityComponentMain.html',
                });
            },
            sjsb: function () { //事件上报
                urls = '../html/event/eventType.html';
                UICore.openWindown("事件上报", urls, '../html/event/eventType.html');
            },
            sjsp: function () { //事件审批
                api.openWin({
                    name: 'eventApprove',
                    url: '../html/event/eventApprove.html',
                });
            },
            sjdb: function () { //事件督办
                api.openWin({
                    name: 'eventSupervise',
                    url: '../html/event/eventSupervise.html',
                });
            },
            wfqd: function () { //我发起的
                api.openWin({
                    name: 'my_event',
                    url: '../html/event/my_event.html',
                });
            },
            areaEvent: function () {
                api.openWin({
                    name: 'my_event',
                    url: '../html/event/areaEvent.html',
                });
            },
            // 跳转页面
            jumpPage: function (name, url) {
                (name && url) && UICore.openWindown(name, url, url);
            },
            xzrz: function () { //新增日志
                //UICore.openWindown("新增日志", "rkxx");
                api.openWin({
                    name: 'newFeelingDaily',
                    vScrollBarEnabled: false,
                    url: '../html/FeelingDaily/newFeelingDaily.html',
                });
            },
            rzcx: function () { //日志查询
                //UICore.openWindown("日志查询", "rkxx");
                api.openWin({
                    name: 'FeelingDailyResult',
                    vScrollBarEnabled: false,
                    url: '../html/FeelingDaily/conditionLogList.html',

                });

            },
            tzgg: function () { //通知公告
                //UICore.openWindown("通知公告", "rkxx");
                api.openWin({
                    name: 'noticeList',
                    url: '../html/Notice/noticeList.html',
                });
            },
            wxgzh: function () { //微信公众号
                api.openWin({
                    name: 'webchatImg',
                    url: './webchatImg.html',
                });
            },
            settingdata: function () {
                var settingdata = $api.getStorage('settingdata');
                if (settingdata == null || settingdata == "" || settingdata == undefined) {
                    api.readFile({
                        path: api.cacheDir + 'config.json'
                    }, function (ret, err) {
                        if (ret) {
                            if (ret.status) {
                                //var jsonData = JSON.parse(ret.data);
                                $api.setStorage('settingdata', ret.data)
                            } else {
                                alert("读取失败");
                            }
                        } else {
                            alert(JSON.stringify(err))
                        }
                    });
                }
                api.hideProgress();
            }


        }
    });
}
