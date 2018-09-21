/**
 * Created by kevin on 2017/8/18.
 */
apiready = function() {
    var vue = new Vue({
        el: "#all_con",
        data: {
            items: [],
            isshow: false,
            isSlideInDown: false,
            isSlideInUp: false,
            resultjson: {},
            params: "",

            buiName: "", //建筑名称
            buiNum: "", //楼号
            unit: "", //单元(梯/区)
            roomNum: "", //房号
        },
        created: function() {
            this.params = api.pageParam;
            var postjson = {};
            postjson.pageSize = 10;
            postjson.pageNow = 1;
            postjson.data_area_code = $api.getStorage('userinf').dataAreaCode;
            postjson.createUserGridCode = $api.getStorage('userinf').gridCode;
            this.resultjson.house = postjson;
            UICore.showLoading("列表加载中...", "请稍候");
            var that = this;
            console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForHouse.shtml?act=query&data=' + JSON.stringify(this.resultjson));
            api.ajax({
                url: UICore.serviceUrl + 'mobile/mobileInterfaceForHouse.shtml?act=query&data=' + JSON.stringify(this.resultjson),
                method: 'get',
            }, function(ret, err) {
                api.hideProgress();
                if (ret.success) {
                    if (ret.data == "") {
                        alert("没有更多数据了")
                    } else {
                        ret.data.forEach(function(value) {
                            that.items.push(value);
                        });
                    }
                } else {
                    alert(JSON.stringify(ret.errorinfo))
                }
            });
            var container = $api.dom(".wrapper");
            $api.css(container, 'display:block');
            api.hideProgress();
        },
        mounted: function() {
            var that = this;
            api.addEventListener({
                name: 'searchHouse'
            }, function(ret, err) {
                if (ret) {
                    if (ret.value.key1 == true) {
                        that.isshow = true;
                        that.isSlideInDown = true;
                    } else {
                        that.isshow = false;
                        that.isSlideInDown = false;
                    }

                } else {
                    alert(JSON.stringify(err));
                }
            });
            this.refreshHeader();
            that.loadBottom();
        },
        methods: {
            cover_close: function() {
                this.isshow = false;
            },
            choose: function(index) {
              console.log("click:" + this.params.from);
              var info = this.items[index];
              if(this.params.from=="legalPerson"){
                api.sendEvent({
                    name: 'selectedHouse',
                    extra: {
                        key1: info
                    }
                });

                api.closeWin();
              }else{
                api.openWin({
                    name: 'house',
                    url: './house.html',
                    vScrollBarEnabled:false,
                    pageParam: {
                        title: "houseResult",
                        infos: info
                    }
                });
              }
            },
            refreshHeader: function() {
                var that = this;
                api.setRefreshHeaderInfo({
                    visible: true,
                    loadingImg: 'widget://image/loading_more.gif',
                    bgColor: '#ccc',
                    textColor: '#fff',
                    textUp: '松开刷新...',
                    showTime: true
                }, function(ret, err) {
                    // 这里写重新渲染页面的方法
                    that.loadList();
                });
            },
            loadList: function() {
                var that = this;
                this.resultjson.house.pageNow = 1;
                console.log("下拉刷新: " + UICore.serviceUrl + 'mobile/mobileInterfaceForHouse.shtml?act=query&data=' + JSON.stringify(this.resultjson));
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForHouse.shtml?act=query&data=' + JSON.stringify(this.resultjson),
                    method: 'get',
                }, function(ret, err) {
                    api.refreshHeaderLoadDone();
                    if (ret.success) {
                        if (ret.data == "") {
                            alert("没有更多数据了")
                        } else {
                            // 清空原有数据
                            that.items.splice(0, that.items.length);
                            ret.data.forEach(function(value) {
                                that.items.push(value);
                            });
                        }
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            loadBottom: function() { //上拉加载
                var that = this;
                api.addEventListener({
                    name: 'scrolltobottom',
                    extra: {
                        threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
                    }
                }, function(ret, err) {
                    UICore.showLoading('加载中...', '稍等...');
                    that.resultjson.house.pageNow++;
                    console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForHouse.shtml?act=query&data=' + JSON.stringify(that.resultjson));
                    api.ajax({
                        url: UICore.serviceUrl + 'mobile/mobileInterfaceForHouse.shtml?act=query&data=' + JSON.stringify(that.resultjson),
                        method: 'get',
                    }, function(ret, err) {
                        api.hideProgress();
                        if (ret.success) {
                            var arrlength = 0;
                            if (ret.data == "") {
                                alert("没有更多数据了")
                            } else {
                                ret.data.forEach(function(value) {
                                    that.items.push(value);
                                });
                            }
                        } else {
                            alert(JSON.stringify(ret.errorinfo))
                        }
                    });
                });
            },
            query:function() {
                var postjson = {};
                var resultjson = {};
                var postjson = {};
                postjson.pageSize = 10;
                postjson.pageNow = 1;
                postjson.data_area_code =$api.getStorage('userinf').dataAreaCode;
                postjson.createUserGridCode = $api.getStorage('userinf').gridCode;
                if (this.buiName)
                    postjson.BUI_NAME = this.buiName; //建筑名称

                if (this.mapNum)
                    postjson.BUI_CODE = this.mapNum; //楼号

                if (this.unit)
                    postjson.UNIT = this.unit;

                if (this.roomNum)
                    postjson.HOUSE_NUM = this.roomNum;

                var resultjson = {};
                resultjson.house = postjson;
                console.log(JSON.stringify(resultjson));
                var that = this;
                UICore.showLoading("列表查询中...", "请稍候");
                console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForHouse.shtml?act=query&data=' + JSON.stringify(resultjson));
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForHouse.shtml?act=query&data=' + JSON.stringify(resultjson),
                    method: 'get',
                }, function(ret, err) {
                    api.hideProgress();
                    that.isshow = false;
                    <!--清空搜索数据-->
                    that.buiName = ""; //建筑名称
                    that.buiNum = ""; //楼号
                    that.unit = ""; //单元(梯/区)
                    that.roomNum = ""; //房号
                    <!--清空搜索数据-->
                    if (ret.success) {
                        that.items.splice(0, that.items.length);
                        if (ret.data == "") {
                            alert("没有更多数据了")
                        } else {
                            ret.data.forEach(function(value) {
                                that.items.push(value);
                            });
                        }
                    } else {
                        alert(JSON.stringify(ret.errorinfo))
                    }
                });
            },
        } // methods end.

    });

}
