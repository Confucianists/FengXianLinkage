/**
* Created by hzh in 2017/7/20
*/
apiready = function(){
    var param = api.pageParam;
    cityComponentResultObj = new CityComponentResult();
    cityComponentResultObj.param = param.data;

    cityComponentResultObj.initData(JSON.stringify(param.data));

};

CityComponentResult = function(){};
CityComponentResult.prototype = {
    queryResult_arr:[],//查询结果
    param:"",//查询条件

    vue:{},
    initData:function(param){
        UICore.showLoading("列表加载中", "请稍候");
        var that = this;
        console.log("刷新: " + UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=query&data=' + param);
        api.ajax({
            url: UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=query&data=' + param,
            method: 'get',
        },function(ret, err){
            api.hideProgress();
            if (ret.success) {
                console.log(JSON.stringify( ret ));
                if (ret.data == "") {
                    api.toast({
                        msg: '数据为空',
                        duration: 2000,
                        location: 'bottom'
                    });
                } else {
                  cityComponentResultObj.queryResult_arr = [];
                  ret.data.forEach(function(value) {
                      cityComponentResultObj.queryResult_arr.push(value);
                  });

                  cityComponentResultObj.vue = new Vue({
                     el: "#info",
                     data: {
                         items: cityComponentResultObj.queryResult_arr,
                         topStatus:"",//列表控件状态
                         allLoaded:false,
                     },
                     methods:{
                         choose:function(index){
                              var info = cityComponentResultObj.queryResult_arr[index];
                              console.log("点击item部件:"+JSON.stringify(info));
                              api.openWin({
                                  name: 'CityComponent',
                                  url: './CityComponent.html',
                                  pageParam: {
                                      status:"isBrownse",
                                      data: info,
                                      queryParam:cityComponentResultObj.param,//保存查询参数，用于重新加载页面时使用
                                  }
                              });

                         },
                         closeWin:function(){
                            api.closeWin({
                                name: 'cityComponentQueryResult'
                            });

                         },
                         loadTop:function(){
                           // 下拉刷新
                           var that = this;
                           cityComponentResultObj.param.citycomponent.pageNow = 1;
                           that.allLoaded = false;
                           console.log("下拉刷新: " + UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=query&data=' + JSON.stringify(cityComponentResultObj.param));
                           api.ajax({
                               url: UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=query&data=' + JSON.stringify(cityComponentResultObj.param),
                               method: 'get',
                           },function(ret, err){
                               if (ret.success) {
                                   //console.log(JSON.stringify( ret ));
                                   if (ret.data == "") {
                                       api.toast({
                                           msg: '数据为空',
                                           duration: 2000,
                                           location: 'bottom'
                                       });
                                   } else {
                                     // 清空原有数据
                                     cityComponentResultObj.queryResult_arr.splice(1,cityComponentResultObj.queryResult_arr.length);
                                     ret.data.forEach(function(value) {
                                         cityComponentResultObj.queryResult_arr.push(value);
                                     });
                                     that.$refs.loadmore.onTopLoaded();
                                   }
                               } else {
                                   alert( JSON.stringify( err ) );
                               }
                           });

                         },
                         loadBottom:function(){
                           console.log("上拉加载");
                           cityComponentResultObj.param.citycomponent.pageNow++;
                           var that = this;
                           api.ajax({
                               url: UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=query&data=' + JSON.stringify(cityComponentResultObj.param),
                               method: 'get',
                           },function(ret, err){
                               api.hideProgress();
                              // console.log(JSON.stringify( ret ));
                               if (ret.success) {
                                 if (ret.data == "") {
                                     api.toast({
                                         msg: '数据已全部加载',
                                         duration: 2000,
                                         location: 'bottom'
                                     });
                                     that.allLoaded = true;// 若数据已全部获取完毕
                                     that.$refs.loadmore.onBottomLoaded();
                                 } else {
                                   ret.data.forEach(function(value) {
                                       cityComponentResultObj.queryResult_arr.push(value);
                                   });
                                   that.$refs.loadmore.onBottomLoaded();
                                 }

                               } else {
                                   alert( JSON.stringify( err ) );
                               }
                           });
                         },
                         handleTopChange: function (status) {
                              this.topStatus = status;
                          },
                     }
                  });
                }
            } else {
                alert( JSON.stringify( err ) );
            }
        });

    },

};
