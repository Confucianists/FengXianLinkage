/**
* Created by hzh in 2017/7/27
*/
apiready = function(){

    mQueryObj = new QueryFeelingDaily();
    mQueryObj.initData();
    mQueryObj.loadData();

    api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
        }
    }, function(ret, err) {
        mQueryObj.queryParam.pageNow++;
        //上拉加载
        mQueryObj.pullLoadData();
    });


};

QueryFeelingDaily = function(){};
QueryFeelingDaily.prototype = {

    queryParam:{},//查询参数
    result_arr:[],//查询结果

    vue:{},

    initData:function(){
      this.queryParam.pageSize = 10;
      this.queryParam.pageNow = 1;
      this.queryParam.userName = $api.getStorage('userinf').accountName;
      this.queryParam.accountId = $api.getStorage('userinf').accountId;
    },
    loadData:function(){
      UICore.showLoading("正在加载", "请稍等");
      console.log(UICore.serviceUrl + 'mobile/mobilePeopleLog.shtml?act=getPeopleLogByAccount&data=' + JSON.stringify(this.queryParam));
      api.ajax({
          url:UICore.serviceUrl + 'mobile/mobilePeopleLog.shtml?act=getPeopleLogByAccount&data=' + JSON.stringify(this.queryParam) ,
          method: 'post',
      },function(ret, err){
          api.hideProgress();
          if (ret) {
              console.log(JSON.stringify( ret ));
              if (ret.success) {
                  mQueryObj.result_arr = ret.data;
                  mQueryObj.vue = new Vue({
                    el:"#info",
                    data:{
                      items:mQueryObj.result_arr,
                    },
                    methods:{
                      closeWin:function(){
                        api.closeWin({
                            name: 'FeelingDailyResult'
                        });

                      },
                      choose:function(index){
                        var info = this.items[index];
                        console.log("点击item部件:"+JSON.stringify(info));
                        api.openWin({
                            name: 'newFeelingDaily',
                            url: './newFeelingDaily.html',
                            pageParam: {
                                status:"isBrownse",
                                data: info,
                                queryParam:mQueryObj.queryParam,//保存查询参数，用于重新加载页面时使用
                            }
                        });
                      },
                    },
                  });
              }else{
                alert(ret.errorinfo);
              }
          } else {
              alert( JSON.stringify( err ) );
          }
      });

    },
    pullLoadData:function(param){
        UICore.showLoading("正在加载", "请稍等");
        console.log(UICore.serviceUrl + 'mobile/mobilePeopleLog.shtml?act=getPeopleLogByAccount&data=' + JSON.stringify(mQueryObj.queryParam));
        api.ajax({
            url:UICore.serviceUrl + 'mobile/mobilePeopleLog.shtml?act=getPeopleLogByAccount&data=' + JSON.stringify(mQueryObj.queryParam) ,
            method: 'post',
        },function(ret, err){
            api.hideProgress();
            if (ret.success) {
              if (ret.data == "") {
                  api.toast({
                      msg: '数据为空',
                      duration: 2000,
                      location: 'bottom'
                  });
              } else {
                ret.data.forEach(function(value) {
                    mQueryObj.result_arr.push(value);
                });
              }
            }
        });
    }
};
