
NoticeList = function(){};
NoticeList.prototype = {
  listResult_arr:[],
  pageNow:1,
  rows:10,
  vue:{},

  initData:function(){
    var that = this;
    accountId = $api.getStorage('userinf').accountId;
    UICore.showLoading("正在加载", "请稍等");
    console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=messageList&accountId=' + accountId + '&type=1&page='+ that.pageNow +'&rows=' + that.rows);
    api.ajax({
        url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=messageList&accountId=' + accountId + '&type=1&page='+ that.pageNow +'&rows=' + that.rows,
        method: 'post',
    },function(ret, err){
        api.hideProgress();
        if (ret) {
          console.log("通知公告: " + JSON.stringify(ret));
          if (ret.success) {
            that.listResult_arr = ret.dataList;
            that.vue = new Vue({
              el:"#info",
              data:{
                items:that.listResult_arr,
              },
              methods:{
                  closeWin:function(){
                    api.closeWin({
                        name: 'noticeList'
                    });
                  },
                  choose:function(index){
                      alert("需求不明，后续进行完善");
                  },
              },
            });
          }else{
            api.toast({
                msg: '请求失败',
                duration: 2000,
                location: 'bottom'
            });

          }
        } else {
            alert("请求数据失败");
        }
    });
  },
  pullLoadData:function(){
    var that = this;
    accountId = $api.getStorage('userinf').accountId;
    UICore.showLoading("正在加载", "请稍等");
    console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=messageList&accountId=' + accountId + '&type=1&page='+ that.pageNow +'&rows=' + that.rows);
    api.ajax({
        url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=messageList&accountId=' + accountId + '&type=1&page='+ that.pageNow +'&rows=' + that.rows,
        method: 'post',
    },function(ret, err){
        api.hideProgress();
        if (ret) {
          console.log("通知公告: " + JSON.stringify(ret));
          if (ret.success) {
            that.listResult_arr = ret.dataList;
            that.vue = new Vue({
              el:"#info",
              data:{
                items:that.listResult_arr,
              },
              methods:{
                  closeWin:function(){
                    api.closeWin({
                        name: 'noticeList'
                    });
                  },
                  choose:function(index){
                      alert("需求不明，后续进行完善");
                  },
              },
            });
          }else{
            api.toast({
                msg: '请求失败',
                duration: 2000,
                location: 'bottom'
            });

          }
        } else {
            alert("请求数据失败");
        }
    });
  },
};

apiready = function(){

    noticeListObj = new NoticeList();
    noticeListObj.initData();
    api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
        }
    }, function(ret, err) {
        noticeListObj.pageNow++;
        noticeListObj.pullLoadData();
    });
};
