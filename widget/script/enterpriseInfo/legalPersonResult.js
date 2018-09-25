/**
* Created by hzh in 2017/7/12
*/
apiready = function(){
    var param = api.pageParam;
    legalPersonResultObj = new LegalPersonResult();
    legalPersonResultObj.param = param.data;
    legalPersonResultObj.from = param.from;

    legalPersonResultObj.initData(JSON.stringify(param.data));
    // api.addEventListener({
    //     name: 'scrolltobottom',
    //     extra: {
    //         threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
    //     }
    // }, function(ret, err) {
    //     legalPersonResultObj.param.enterprise.pageNow++;
    //     //上拉加载
    //     legalPersonResultObj.loadData(JSON.stringify(legalPersonResultObj.param));
    // });
    // api.addEventListener({
    //     name: 'refreshResultList'
    // }, function(ret, err){
    //     console.log(JSON.stringify(ret));
    //     if( ret ){
    //         legalPersonResultObj.queryResult_arr = [];
    //          legalPersonResultObj.initData(JSON.stringify(ret.queryParam));
    //     }else{
    //          alert( JSON.stringify( err ) );
    //     }
    // });

};

LegalPersonResult = function(){};
LegalPersonResult.prototype = {
    queryResult_arr:[],//查询结果
    param:"",//查询条件
    from:"",//从哪里跳转进来
    vue: {},

    initData:function(param){
        UICore.showLoading("列表加载中...", "请稍候");
        var that = this;
        console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForEnterprise.shtml?act=query&data=' + param);
        api.ajax({
            url: UICore.serviceUrl + 'mobile/mobileInterfaceForEnterprise.shtml?act=query&data=' + param,
            method: 'get',
        },function(ret, err){
            api.hideProgress();
            if (ret.success) {
                //console.log(JSON.stringify( ret ));
                if (ret.data == "") {
                    api.toast({
                        msg: '数据为空',
                        duration: 2000,
                        location: 'bottom'
                    });
                } else {
                    that.queryResult_arr = [];
                    ret.data.forEach(function(value) {
                        var unitPropertiesId = value.unitProperties;
                        if (unitPropertiesId == 1) {
                            value.unitProperties = "国家行政企业";
                        }
                        if (unitPropertiesId == 2) {
                            value.unitProperties = "公私合作企业";
                        }
                        if (unitPropertiesId == 3) {
                            value.unitProperties = "中外合资企业";
                        }
                        if (unitPropertiesId == 4) {
                            value.unitProperties = "社会组织机构";
                        }
                        if (unitPropertiesId == 5) {
                            value.unitProperties = "国际组织机构";
                        }
                        if (unitPropertiesId == 6) {
                            value.unitProperties = "外资企业";
                        }
                        if (unitPropertiesId == 7) {
                            value.unitProperties = "私营企业";
                        }
                        if (unitPropertiesId == 8) {
                            value.unitProperties = "集体企业";
                        }
                        if (unitPropertiesId == 9) {
                            value.unitProperties = "国防军事企业";
                        }
                        if (unitPropertiesId == 10) {
                            value.unitProperties = "其它";
                        }
                        that.queryResult_arr.push(value);
                    });

                    that.vue = new Vue({
                       el: "#info",
                       data: {
                           items: that.queryResult_arr,
                           topStatus:"",//列表控件状态
                           allLoaded:false,
                       },
                       created:function(){
                           var container = $api.dom(".wrapper");
                           $api.css(container, 'display:block');
                       },
                       methods:{
                           closeWin:function(){
                               api.closeWin({
                                   name: 'legalPersonQueryResult'
                               });
                           },
                           choose:function(index){
                                console.log("from: " + JSON.stringify(legalPersonResultObj.from));
                                var info = this.items[index];
                                if (legalPersonResultObj.from == "legalPersonQuery") {
                                    console.log("点击item企业:"+JSON.stringify(info));
                                    // 从企业查询跳转
                                    api.openWin({
                                        name: 'legalPerson',
                                        url: './legalPerson.html',
                                        pageParam: {
                                            status:"isBrownse",
                                            data: info,
                                            queryParam:legalPersonResultObj.param,//保存查询参数，用于重新加载页面时使用
                                        }
                                    });
                                }else if (legalPersonResultObj.from == "cityComponent") {
                                    api.sendEvent({
                                        name: 'cityComponentQueryResult',
                                        extra: {
                                            data: info,
                                        }
                                    });
                                    api.closeToWin({
                                        name: 'CityComponent',
                                    });

                                }
                           },
                           loadTop:function(){
                             var that = this;
                             legalPersonResultObj.param.enterprise.pageNow = 1;
                             that.allLoaded = false;
                             console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForEnterprise.shtml?act=query&data=' + JSON.stringify(legalPersonResultObj.param));
                             api.ajax({
                                 url: UICore.serviceUrl + 'mobile/mobileInterfaceForEnterprise.shtml?act=query&data=' + JSON.stringify(legalPersonResultObj.param),
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
                                       legalPersonResultObj.queryResult_arr.splice(1,legalPersonResultObj.queryResult_arr.length);
                                       ret.data.forEach(function(value) {
                                           var unitPropertiesId = value.unitProperties;
                                           if (unitPropertiesId == 1) {
                                               value.unitProperties = "国家行政企业";
                                           }
                                           if (unitPropertiesId == 2) {
                                               value.unitProperties = "公私合作企业";
                                           }
                                           if (unitPropertiesId == 3) {
                                               value.unitProperties = "中外合资企业";
                                           }
                                           if (unitPropertiesId == 4) {
                                               value.unitProperties = "社会组织机构";
                                           }
                                           if (unitPropertiesId == 5) {
                                               value.unitProperties = "国际组织机构";
                                           }
                                           if (unitPropertiesId == 6) {
                                               value.unitProperties = "外资企业";
                                           }
                                           if (unitPropertiesId == 7) {
                                               value.unitProperties = "私营企业";
                                           }
                                           if (unitPropertiesId == 8) {
                                               value.unitProperties = "集体企业";
                                           }
                                           if (unitPropertiesId == 9) {
                                               value.unitProperties = "国防军事企业";
                                           }
                                           if (unitPropertiesId == 10) {
                                               value.unitProperties = "其它";
                                           }
                                           legalPersonResultObj.queryResult_arr.push(value);
                                           that.$refs.loadmore.onTopLoaded();
                                       });

                                     }
                                 } else {
                                     alert( JSON.stringify( err ) );
                                 }
                             });
                           },
                           loadBottom:function(){
                             console.log("上拉加载");
                             legalPersonResultObj.param.enterprise.pageNow++;
                             var that = this;
                             console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForEnterprise.shtml?act=query&data=' + param);
                             api.ajax({
                                 url: UICore.serviceUrl + 'mobile/mobileInterfaceForEnterprise.shtml?act=query&data=' + JSON.stringify(legalPersonResultObj.param),
                                 method: 'get',
                             },function(ret, err){
                                 api.hideProgress();
                                 if (ret.success) {
                                     //console.log(JSON.stringify( ret ));
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
                                           var unitPropertiesId = value.unitProperties;
                                           if (unitPropertiesId == 1) {
                                               value.unitProperties = "国家行政企业";
                                           }
                                           if (unitPropertiesId == 2) {
                                               value.unitProperties = "公私合作企业";
                                           }
                                           if (unitPropertiesId == 3) {
                                               value.unitProperties = "中外合资企业";
                                           }
                                           if (unitPropertiesId == 4) {
                                               value.unitProperties = "社会组织机构";
                                           }
                                           if (unitPropertiesId == 5) {
                                               value.unitProperties = "国际组织机构";
                                           }
                                           if (unitPropertiesId == 6) {
                                               value.unitProperties = "外资企业";
                                           }
                                           if (unitPropertiesId == 7) {
                                               value.unitProperties = "私营企业";
                                           }
                                           if (unitPropertiesId == 8) {
                                               value.unitProperties = "集体企业";
                                           }
                                           if (unitPropertiesId == 9) {
                                               value.unitProperties = "国防军事企业";
                                           }
                                           if (unitPropertiesId == 10) {
                                               value.unitProperties = "其它";
                                           }
                                           legalPersonResultObj.queryResult_arr.push(value);
                                           that.$refs.loadmore.onBottomLoaded();
                                       });

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
                    });// vue 结束

                }
            } else {
                alert( JSON.stringify( err ) );
            }
        });

    },
    loadData:function(param){


    },
};
