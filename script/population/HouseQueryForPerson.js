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
            postjson:{},
            houseowner: "", //屋主姓名
            hoseaddr: "", //房屋地址
        },
        created: function() {
            this.params = api.pageParam;
            this.postjson.pageSize = 10;
            this.postjson.pageNow = 1;
            this.postjson.data_area_code = $api.getStorage('userinf').villageOrCommunityCode;
            this.postjson.createUserGridCode = $api.getStorage('userinf').gridCode;
            this.resultjson.house = this.postjson;
            UICore.showLoading("列表加载中...", "请稍候");
            var that = this;
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
                var s= this.params.from
                var info = this.items[index];
                  console.log(s);
                if (s =='propertyOwner') { //产权人

                    UICore.sendEvent("propertyOwner", info);
                    api.closeWin({
                        name: 'propertyOwner'
                    });
                    api.closeWin();

                } else if (this.from == "cityComponent") {
                    api.sendEvent({
                        name: 'cityComponent',
                        extra: {
                            data: info,
                        }
                    });

                    api.closeToWin({
                        name: 'CityComponent',
                    });

                } else if (this.params.from == "houseOwer") {//人口信息关联房屋
                    UICore.sendEvent("houseOwer", info)
                    api.closeWin({
                        name: 'HouseQuery'
                    });
                    api.closeWin();

                } else {
                    api.openWin({
                        name: 'populationResult',
                        url: '../population/population.html',
                        pageParam: {
                            name: info
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
                this.postjson.pageNow = 1;
                console.log("下拉刷新: " + UICore.serviceUrl + 'mobile/mobileInterfaceForResident.shtml?act=queryResidentInfo&data=' + JSON.stringify(this.postjson));
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForResident.shtml?act=queryResidentInfo&data=' + JSON.stringify(this.postjson),
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
                    that.postjson.pageNow++;
                    console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForResident.shtml?act=queryResidentInfo&data=' + JSON.stringify(that.postjson));
                    api.ajax({
                        url: UICore.serviceUrl + 'mobile/mobileInterfaceForResident.shtml?act=queryResidentInfo&data=' + JSON.stringify(that.postjson),
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
                });
            },
            query:function() {
                var resultjson = {};
                this.postjson.pageSize = 10;
                this.postjson.pageNow = 1;
                this.postjson.data_area_code = $api.getStorage('userinf').villageOrCommunityCode;
                this.postjson.createUserGridCode = $api.getStorage('userinf').gridCode;

                if (this.houseowner) { //屋主姓名
                    this.postjson.residentName = this.houseowner;
                };
                if (this.hoseaddr) { //房屋地址
                    this.postjson.address = this.hoseaddr;
                };

                // console.log(JSON.stringify(resultjson));
                var that = this;
                UICore.showLoading("列表查询中...", "请稍候");
                console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForResident.shtml?act=queryResidentInfo&data=' + JSON.stringify(this.postjson));
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForResident.shtml?act=queryResidentInfo&data=' + JSON.stringify(this.postjson),
                    method: 'get',
                }, function(ret, err) {
                    api.hideProgress();
                    that.isshow = false;
                    <!--清空搜索数据-->
                    that.houseowner = ""; //屋主姓名
                    that.hoseaddr = ""; //房屋地址
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
