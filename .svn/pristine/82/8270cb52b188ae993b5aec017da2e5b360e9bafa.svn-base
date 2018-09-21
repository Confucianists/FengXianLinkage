/**
 * Created by kevin on 2017/8/16.
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
            entityId: "", //地图编号
            buiAddr: "", //地址
            buiType: "", //楼号类型
            buiTypeId: "",
            buiNum: "", //楼号
            buiType_arr: [],
        },
        created: function() {
            this.params = api.pageParam;
            var postjson = {};
            postjson.pageSize = 10;
            postjson.pageNow = 1;
            postjson.data_area_code = $api.getStorage('userinf').villageOrCommunityCode;
            postjson.createUserGridCode = $api.getStorage('userinf').gridCode;
            this.resultjson.building = postjson;
            UICore.showLoading("列表加载中...", "请稍候");
            var that = this;
            console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=query&data=' + JSON.stringify(this.resultjson));
            api.ajax({
                url: UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=query&data=' + JSON.stringify(this.resultjson),
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
            <!--分隔线-->
            this.buiType_arr.push({ //楼号类型
                text: "原有楼号",
                status: 'normal',
                key: 1
            }, {
                text: "自编楼号",
                status: 'normal',
                key: 2
            });

            var container = $api.dom(".wrapper");
            $api.css(container, 'display:block');
            api.hideProgress();
        },
        mounted: function() {
            var that = this;
            api.addEventListener({
                name: 'searchBuilding'
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
                var info = this.items[index];
                if (this.params != "" || this.params != undefined) {
                    if (this.params.from == "frompopulation") { //从人口
                        UICore.sendEvent("populationr", info);
                        api.closeWin();
                    } else if (this.params.from == "legalPerson") { //从法人
                        api.sendEvent({
                            name: 'selectedBuildData',
                            extra: {
                                key1: info,
                            }
                        });
                        api.closeToWin({
                            name: 'legalPerson'
                        });
                    } else if (this.params.from == "fromHouse") { //从房屋
                        UICore.sendEvent("houseforbuilding", info);
                        api.closeWin();
                    } else {
                        api.openWin({
                            name: 'buildingResult',
                            url: './building.html',
                            pageParam: {
                                title: "buildingResult",
                                infos:info,
                                name: info.id
                            }
                        });
                    }
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
                this.resultjson.building.pageNow = 1;
                console.log("下拉刷新: " + UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=query&data=' + JSON.stringify(this.resultjson));
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=query&data=' + JSON.stringify(this.resultjson),
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
                    that.resultjson.building.pageNow++;
                    console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=query&data=' + JSON.stringify(that.resultjson));
                    api.ajax({
                        url: UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=query&data=' + JSON.stringify(that.resultjson),
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
            handleTopChange: function(status) {
                this.topStatus = status;
            },
            buiTypef: function() {
                var that = this;
                var defaultVal = this.buiType; //获取默认值
                if (defaultVal != null && defaultVal != "") {
                    buildingQueryObj.buiType_arr.forEach(function(value, index, arr) {
                        if (value.text == that.buiType) {
                            arr[index].status = "selected";
                        }
                    })
                }
                UICore.openSelect3(this.buiType_arr, this.buiType, "buiType");
                api.addEventListener({
                    name: 'buiType'
                }, function(ret, err) {
                    if (ret) {
                        that.buiType = ret.value.key1;
                        that.buiTypeId = ret.value.key2;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            query: function() {
                var postjson = {};
                var resultjson = {};
                postjson.pageSize = 10;
                postjson.pageNow = 1;
                postjson.data_area_code = $api.getStorage('userinf').villageOrCommunityCode;
                postjson.createUserGridCode = $api.getStorage('userinf').gridCode;
                if (this.buiName)
                    postjson.BUI_NAME = this.buiName; //建筑名称
                if (this.entityId)
                    postjson.ENTITYID = this.entityId; //地图编号
                if (this.buiAddr) {
                    postjson.ADDRESS = this.buiAddr;
                }

                if (this.buiType == "原有楼号") { //楼号类型
                    postjson.BUI_CODE = this.buiNum + "楼号"; //楼号
                } else if (this.buiType == "自编楼号") {
                    postjson.BUI_CUSTOM_CODE = this.buiNum + "楼号";
                }
                resultjson.building = postjson;
                var that = this;
                UICore.showLoading("列表查询中...", "请稍候");
                console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=query&data=' + JSON.stringify(resultjson));
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=query&data=' + JSON.stringify(resultjson),
                    method: 'get',
                }, function(ret, err) {
                    api.hideProgress();
                    that.isshow = false;
                    <!--清空搜索数据-->
                    that.buiName = ""; //建筑名称
                    that.entityId = ""; //地图编号
                    that.buiAddr = ""; //地址
                    that.buiType = ""; //楼号类型
                    that.buiTypeId = "";
                    that.uiNum = ""; //楼号
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
