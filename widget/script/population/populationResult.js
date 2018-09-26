/**
 * Created by kevin on 2017/7/1.
 */
apiready = function() {
    var param = api.pageParam
    QueryResultObj = new QueryResult();
    QueryResultObj.from = param.from;
    QueryResultObj.loadData(param.json);

    api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
        }
    }, function(ret, err) {
        param.json.population.pageNow++;
        QueryResultObj.setData(param.json);

    });
}
QueryResult = function() {};
QueryResult.prototype = {
    from: "",
    vue: {},
    list:[],
    loadData: function(postJson) { //加载数据并初始化
        UICore.showLoading('正在查询...', '请稍后...');
        var that = this;
        api.ajax({
            url: UICore.serviceUrl + 'mobile/mobileInterfaceForPopulation.shtml?act=query&data=' + JSON.stringify(postJson),
            method: 'get',
        }, function(ret, err) { //请求成功
            api.hideProgress();
            if (ret.success) {
                if (ret.data == "") { //如果返回 这提示没有更多数据
                    alert("没有更多数据了")
                } else {
                    ret.data.forEach(function(value) { //由于性别是显示key 则换成对应的男女
                        if (value.sex == 1) {
                            value.sex = "男";
                        } else {
                            value.sex = "女";
                        }
                    });
                    ret.data.forEach(function(value){//请求成功
                      that.list.push(value);
                    });
                    that.vue = new Vue({
                        el: "#infos",
                        created: function() {
                            var container = $api.dom(".container");
                            $api.css(container, 'display:block');
                        },
                        data: {
                            items: that.list
                        },
                        methods: {
                            choosePersoal: function(index) {
                                var info = this.items[index];
                                console.log("populationResult : " + that.from);
                                if (that.from == 'propertyOwner') {
                                    UICore.sendEvent("propertyOwner", info);
                                    api.closeWin({
                                        name: 'propertyOwner'
                                    });
                                    api.closeWin();


                                }else if (that.from == "cityComponent") {
                                    api.sendEvent({
                                        name: 'cityComponent',
                                        extra: {
                                            data: info,
                                        }
                                    });

                                    api.closeToWin({
                                        name: 'CityComponent',
                                    });

                                } else {
                                    api.openWin({
                                        name: 'populationResult',
                                        url: '../population/population.html',
                                        pageParam: {
                                            name: info,
                                            from:"populationQuery"
                                        }
                                    });
                                }

                            }
                        }
                    }); //vue结束
                }

            } else {
                alert(JSON.stringify(err));
            }
        });
    },
    setData: function(postJson) { //加载数据分页
        UICore.showLoading('正在查询...', '请稍后...');
        var that = this;
        api.ajax({
            url: UICore.serviceUrl + 'mobile/mobileInterfaceForPopulation.shtml?act=query&data=' + JSON.stringify(postJson),
            method: 'get',
        }, function(ret, err) {
            api.hideProgress();
            if (ret.success) {
                var list = [];
                if (ret.data == "") {
                    alert("没有更多数据了")
                } else {
                    ret.data.forEach(function(value) {
                        if (value.sex == 1) {
                            value.sex = "男";
                        } else {
                            value.sex = "女";
                        }
                    });
                    ret.data.forEach(function(value){//请求成功
                      that.list.push(value);
                    })
                    that.vue.items =  that.list;
                }

            } else {
                alert(JSON.stringify(err));
            }
        });
    }
}
