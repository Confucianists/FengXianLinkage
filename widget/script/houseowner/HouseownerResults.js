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

            buildingName: "", //建筑名称
            mapNum: "", //地图编号
            address: "", //地址
            buildingNum: "", //楼号
            layerNum: "", //所属楼层
            roomNum: "", //房号
            houseuse: "", //房屋用途
            houseUseId: "",

            actualuse: "", //实际用途
            actualUseId: "",

            houseUse_arr: [], //房屋性质
            actualUse_arr: [], //房屋用途
        },
        created: function() {
            <!--初始化数据-->
            var that = this;
            var jsonData = JSON.parse($api.getStorage('settingdata'));
            jsonData.data.forEach(function(value) {
                if (value.parentKey == "ResidentHouseUse") { //房屋用途
                    that.houseUse_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "ResidentActualUse") { //实际用途
                    that.actualUse_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
            }); //配置文件循环结束
            <!--初始化数据end-->

            var postjson = {};
            this.params = api.pageParam;

            postjson.pageSize = 10;
            postjson.pageNow = 1;
            postjson.data_area_code = $api.getStorage('userinf').villageOrCommunityCode;
            postjson.createUserGridCode = $api.getStorage('userinf').gridCode;
            this.resultjson.house = postjson;
            UICore.showLoading("列表加载中...", "请稍候");
            console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForNewResident.shtml?act=query&data=' + JSON.stringify(this.resultjson));
            api.ajax({
                url: UICore.serviceUrl + 'mobile/mobileInterfaceForNewResident.shtml?act=query&data=' + JSON.stringify(this.resultjson),
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
                name: 'searchhouseowner'
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
                console.log(JSON.stringify(info));
                api.openWin({
                    name: 'houseowner',
                    url: './houseowner.html',
                    vScrollBarEnabled:false,
                    pageParam: {
                        title: this.params.from,
                        infos: info
                    }
                });
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
                console.log("下拉刷新: " + UICore.serviceUrl + 'mobile/mobileInterfaceForNewResident.shtml?act=query&data=' + JSON.stringify(this.resultjson));
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForNewResident.shtml?act=query&data=' + JSON.stringify(this.resultjson),
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
                    that.resultjson.house.pageNow++;
                    UICore.showLoading('加载中...', '稍等...');
                    console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForNewResident.shtml?act=query&data=' + JSON.stringify(that.resultjson));
                    api.ajax({
                        url: UICore.serviceUrl + 'mobile/mobileInterfaceForNewResident.shtml?act=query&data=' + JSON.stringify(that.resultjson),
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
            houseusef:function() {
                console.log("房屋用途");
                var that = this;
                var defaultVal = this.houseUse; //获取默认值
                if (defaultVal != null && defaultVal != "") {
                    this.houseUse_arr.forEach(function(value, index, arr) {
                        if (value.text == that.houseUse) {
                            arr[index].status = "selected";
                        }
                    })
                }
                UICore.openSelect3(this.houseUse_arr, this.houseUse, "houseUsedowner");
                api.addEventListener({
                    name: 'houseUsedowner'
                }, function(ret, err) {
                    if (ret) {
                        that.houseuse = ret.value.key1;
                        that.houseUseId = ret.value.key2;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });

            },
            actualusef:function() {
                console.log("实际用途");
                var that = this;
                var defaultVal = this.actualUse; //获取默认值
                if (defaultVal != null && defaultVal != "") {
                    this.actualUse_arr.forEach(function(value, index, arr) {
                        if (value.text == this.actualUse) {
                            arr[index].status = "selected";
                        }
                    })
                }
                UICore.openSelect3(this.actualUse_arr, this.actualUse, "actualUsedowner");
                api.addEventListener({
                    name: 'actualUsedowner'
                }, function(ret, err) {
                    if (ret) {
                        that.actualuse = ret.value.key1;
                        that.actualUseId = ret.value.key2;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            query:function() {
                console.log("查询");
                var postjson = {};
                var resultjson = {};
                postjson.pageSize = 10;
                postjson.pageNow = 1;
                postjson.data_area_code = $api.getStorage('userinf').villageOrCommunityCode;
                postjson.createUserGridCode = $api.getStorage('userinf').gridCode;
                if (this.buildingName)
                    postjson.BUI_NAME = this.buildingName; //建筑名称
                if (this.address)
                    postjson.ADDRESS = this.address; //地址

                if (this.mapNum)
                    postjson.EntityId = this.mapNum; //地图编号

                if (this.buildingNum)
                    postjson.BUI_CODE = this.buildingNum; //楼号

                if (this.layerNum)
                    postjson.FLOOR_NUM = this.layerNum; //所属楼层

                if (this.roomNum)
                    postjson.ROOM_NUM = this.roomNum; //房号

                if (this.houseuse)
                    postjson.USE_TYPE = this.houseUseId; //房屋用途

                if (this.actualuse)
                    postjson.ACTUAL_USE_TYPE = this.actualUseId; //房屋用途

                resultjson.house = postjson;

                console.log(JSON.stringify(resultjson));
                var that = this;
                UICore.showLoading("列表查询中...", "请稍候");
                console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForNewResident.shtml?act=query&data=' + JSON.stringify(resultjson));
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForNewResident.shtml?act=query&data=' + JSON.stringify(resultjson),
                    method: 'get',
                }, function(ret, err) {
                    api.hideProgress();
                    that.isshow = false;
                    <!--清空搜索数据-->
                    that.buildingName = ""; //建筑名称
                    that.mapNum = ""; //地图编号
                    that.address = ""; //地址
                    that.buildingNum = ""; //楼号
                    that.layerNum = ""; //所属楼层
                    that.roomNum = ""; //房号
                    that.houseuse = ""; //房屋用途
                    that.houseUseId = "";

                    that.actualuse = ""; //实际用途
                    that.actualUseId = "";
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
