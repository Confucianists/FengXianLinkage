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
            accountId:"",
            buiName: "", //建筑名称
            name: "", //姓名
            identity: "", //身份证
            sex: "", //性别
            sexId: "",
            sex_arr: [],
        },
        created: function() {
            this.sex_arr = [{
                text: '男',
                status: 'normal',
                key: 1
            }, {
                text: '女',
                status: 'normal',
                key: 2
            }];

            this.params = api.pageParam;
            console.log(JSON.stringify(this.params));
            var postjson = {};
            postjson.pageSize = 10;
            postjson.pageNow = 1;
            postjson.data_area_code = $api.getStorage('userinf').villageOrCommunityCode;
            postjson.createUserGridCode = $api.getStorage('userinf').gridCode;
            this.resultjson.population = postjson;
            this.accountId=$api.getStorage('userinf').accountId;
            UICore.showLoading("列表加载中...", "请稍候");
            var that = this;
            console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForPopulation.shtml?&accountId='+this.accountId+'&act=query&data=' + JSON.stringify(this.resultjson));
            api.ajax({
                url: UICore.serviceUrl + 'mobile/mobileInterfaceForPopulation.shtml?&accountId='+this.accountId+'&act=query&data=' + JSON.stringify(this.resultjson),
                method: 'get',
            }, function(ret, err) {
                api.hideProgress();
                if (ret.success) {
                    if (ret.data == "") {
                        alert("没有更多数据了")
                    } else {
                      ret.data.forEach(function(value) { //由于性别是显示key 则换成对应的男女
                          if (value.sex == 1) {
                              value.sex = "男";
                          } else {
                              value.sex = "女";
                          }
                      });
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
                var info = this.items[index];
                if (this.params.from == 'propertyOwner') {//产权人
                    UICore.sendEvent("propertyOwner", info);
                    api.closeWin({
                        name: 'propertyOwner'
                    });
                    api.closeWin();

                }else if (this.from == "cityComponent") {
                    api.sendEvent({
                        name: 'cityComponent',
                        extra: {
                            data: info,
                        }
                    });
                    api.closeToWin({
                        name: 'CityComponent',
                    });
                }else if(this.params.from == "addHouseMemberPopulation"){
                  UICore.sendEvent("addHouseMember", info);
                  api.closeWin();
                } else {
                    api.openWin({
                        name: 'populationResult',
                        url: '../population/population.html',
                        vScrollBarEnabled:false,
                        pageParam: {
                            from:"populationQuery",
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
                this.resultjson.population.pageNow = 1;
                console.log("下拉刷新: " + UICore.serviceUrl + 'mobile/mobileInterfaceForPopulation.shtml?accountId='+this.accountId+'&act=query&data=' + JSON.stringify(this.resultjson));
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForPopulation.shtml?accountId='+this.accountId+'&act=query&data=' + JSON.stringify(this.resultjson),
                    method: 'get',
                }, function(ret, err) {
                    api.refreshHeaderLoadDone();
                    if (ret.success) {
                        if (ret.data == "") {
                            alert("没有更多数据了")
                        } else {
                          ret.data.forEach(function(value) { //由于性别是显示key 则换成对应的男女
                              if (value.sex == 1) {
                                  value.sex = "男";
                              } else {
                                  value.sex = "女";
                              }
                          });
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
                    that.resultjson.population.pageNow++;
                    console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForPopulation.shtml?accountId='+that.accountId+'&act=query&data=' + JSON.stringify(that.resultjson));
                    api.ajax({
                        url: UICore.serviceUrl + 'mobile/mobileInterfaceForPopulation.shtml?accountId='+that.accountId+'&act=query&data=' + JSON.stringify(that.resultjson),
                        method: 'get',
                    }, function(ret, err) {
                        api.hideProgress();
                        if (ret.success) {
                            if (ret.data == "") {
                                alert("没有更多数据了")
                            } else {
                              ret.data.forEach(function(value) { //由于性别是显示key 则换成对应的男女
                                  if (value.sex == 1) {
                                      value.sex = "男";
                                  } else {
                                      value.sex = "女";
                                  }
                              });
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
            sexf:function() {
                var that = this;
                var defaultVal = this.sex; //获取默认值
                if (defaultVal != null && defaultVal != "") {
                    this.sex_arr.forEach(function(value, index, arr) {
                        if (value.text == that.sex) {
                            arr[index].status = "selected";
                        }
                    })
                }
                UICore.openSelect3(this.sex_arr, this.sex, "population");
                api.addEventListener({
                    name: 'population'
                }, function(ret, err) {
                    if (ret) {
                        that.sex = ret.value.key1;
                        that.sexId = ret.value.key2;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            query:function() {
                var postjson = {};
                var resultjson = {};
                postjson.pageSize = 10;
                postjson.pageNow = 1;
                postjson.data_area_code = $api.getStorage('userinf').villageOrCommunityCode;
                postjson.createUserGridCode = $api.getStorage('userinf').gridCode;
                if (this.name) { //姓名
                    postjson.name = this.name;
                };
                if (this.identity) { //身份证
                    postjson.cardid = this.identity;
                };
                if (this.sex) { //性别
                    postjson.sex = this.sexId;
                };

                resultjson.population = postjson;

                console.log(JSON.stringify(resultjson));
                var that = this;
                UICore.showLoading("列表查询中...", "请稍候");
                console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForPopulation.shtml?accountId='+this.accountId+'&act=query&data=' + JSON.stringify(resultjson));
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForPopulation.shtml?accountId='+this.accountId+'&act=query&data=' + JSON.stringify(resultjson),
                    method: 'get',
                }, function(ret, err) {
                    api.hideProgress();
                    that.isshow = false;
                    <!--清空搜索数据-->
                    that.buiName = ""; //建筑名称
                    that.name = ""; //姓名
                    that.identity = ""; //身份证
                    that.sex = ""; //性别
                    that.sexId = "";
                    <!--清空搜索数据-->
                    if (ret.success) {
                        that.items.splice(0, that.items.length);
                        if (ret.data == "") {
                            alert("没有更多数据了")
                        } else {
                          ret.data.forEach(function(value) { //由于性别是显示key 则换成对应的男女
                              if (value.sex == 1) {
                                  value.sex = "男";
                              } else {
                                  value.sex = "女";
                              }
                          });
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
