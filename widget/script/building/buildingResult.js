/**
 * Created by kevin on 2017/7/7.
 */
apiready = function() {
    var param = api.pageParam;
    buildingResultObj = new BuildingResult();
    buildingResultObj.param=param;
    console.log(JSON.stringify(param));
    //在建筑详情返回无法传递参数而我必须和在查询界面进入此列表页面一样有参则 将其先保存
    if ($api.getStorage('bquery') == "" || $api.getStorage('bquery') == undefined) {
        $api.setStorage('bquery', param);
    }else{
      param=$api.getStorage('bquery');
    }
    buildingResultObj.initData(JSON.stringify(param));
console.log(buildingResultObj.param.from);
    api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
        }
    }, function(ret, err) {
        param.building.pageNow++;
        buildingResultObj.setData(JSON.stringify(param));

    });
}
BuildingResult = function() {};

BuildingResult.prototype = {

    buildingResult_arr: [],
    param:"",
    vue: {},
    initData: function(param) {
        UICore.showLoading("列表加载中...", "请稍候");
        var that = this;
        console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=query&data=' + param);
        api.ajax({
            url: UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=query&data=' + param,
            method: 'get',
        }, function(ret, err) {
          api.hideProgress();
            if (ret.success) {
                var arrlength = 0;

                if (ret.data == "") {
                    alert("没有更多数据了")
                } else {
                    ret.data.forEach(function(value) {
                        that.buildingResult_arr.push(value);
                    });
                    console.log(that.buildingResult_arr.length);
                    that.vue = new Vue({
                        el: "#info",
                        data: {
                            items: that.buildingResult_arr,
                        },
                        created: function() {
                            var container = $api.dom(".wrapper");
                            $api.css(container, 'display:block');
                            api.hideProgress();
                        },
                        methods: {
                            choose: function(index) {
                                console.log("click:"+buildingResultObj.param.from);
                                var info = this.items[index];
                                if(buildingResultObj.param!="" || buildingResultObj.param!= undefined){
                                      if (buildingResultObj.param.from=="frompopulation") {//从人口
                                        api.sendEvent({
                                            name: 'populationr',
                                            extra: {
                                                key1:info,
                                            }
                                        });
                                        api.closeToWin({
                                          name: 'enter'
                                        });

                                      }else if (buildingResultObj.param.from=="legalPerson") {//从法人
                                          api.sendEvent({
                                              name: 'selectedBuildData',
                                              extra: {
                                                  key1:info,
                                              }
                                          });
                                          api.closeToWin({
                                              name: 'legalPerson'
                                          });
                                      }else if(buildingResultObj.param.from=="fromHouse"){//从房屋
                                          api.openWin({
                                              name: 'queryhouse',
                                              url: '../house/house.html',
                                              pageParam: {
                                                  title: "house",
                                                  name: info
                                              }
                                          });

                                      }else{
                                        api.openWin({
                                            name: 'buildingResult',
                                            url: './building.html',
                                            pageParam: {
                                                title: "buildingResult",
                                                name: info.id
                                            }
                                        });
                                      }
                                }
                            }
                        }, //methods结束
                        components: {
                            "buildingComponent": {
                                template: "#buildingInfo",
                            }
                        }
                    }); //vue结束
                }
            }else{

            }
        });
    },
    setData: function(param) {
        UICore.showLoading("列表加载中...", "请稍候");
        var that = this;
        console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=query&data=' + param);
        api.ajax({
            url: UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=query&data=' + param,
            method: 'get',
        }, function(ret, err) {
            if (ret.success) {
                var arrlength = 0;
                api.hideProgress();
                if (ret.data == "") {
                    alert("没有更多数据了")
                } else {
                    ret.data.forEach(function(value) {
                        that.buildingResult_arr.push(value);
                    });
                    that.vue.items = that.buildingResult_arr;
                }
            }
        });
    }
}
