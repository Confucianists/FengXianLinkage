window.apiready=function(){
    var vm = new Vue({
      el:"#no_end_all",
      created:function(){
        var info = $api.getStorage('userinf');
        this.accountId=info.accountId;
        var eventTitle = api.pageParam.eventTitle;
        this.eventType = api.pageParam.eventType;
        if(eventTitle!=null&&eventTitle!=''&&eventTitle!=undefined){
          this.searchParam = '&eventTitle='+eventTitle
        }
        UICore.showLoading('加载中...','稍等...');
        this.loadList();
      },
      mounted:function(){
        this.refreshHeader();
        this.loadNext();
      },
      data:{
        eventList:{
        },
        accountId:"",
        page:1,
        rows:15,
        totalPage:0,
        refresh:false,
        showAll:false,
        searchParam:'',
        eventType:''
      },
      methods:{
        loadList:function(){
          var url = "";
          if(this.eventType=="notEnd"){
            url = UICore.serviceUrl+'mobile/mobileWf.shtml?act=notEndEventList_HZ&loginId='+this.accountId+'&page='+this.page+'&rows='+this.rows+this.searchParam
          }else{
            url = UICore.serviceUrl+'mobile/mobileWf.shtml?act=endEventList_HZ&loginId='+this.accountId+'&page='+this.page+'&rows='+this.rows+this.searchParam
          }
          console.log(url);
          api.ajax({
            url : url,
            tag : 'grid',
            method : 'get'
          }, function(ret, err) {
            if (vm.refresh) {
              api.refreshHeaderLoadDone();
            }
            api.hideProgress();
            if(ret){
              vm.totalPage = Math.ceil(ret.total/vm.rows);//总页数;
              if(vm.totalPage==vm.page){
                vm.showAll = true;
              }else{
                vm.showAll = false;
              }
              if(ret.rows.length>0){
                var eventObj = ret.rows;
                if(vm.eventList.length>0&&!vm.refresh){
                  eventObj = vm.eventList.concat(eventObj);
                }


                vm.$set(vm.$data,"eventList",eventObj)
              }
            }
            vm.refresh=false;
          });
        },
        refreshHeader: function() {
          api.setRefreshHeaderInfo({
              visible: true,
              loadingImg: 'widget://image/loading_more.gif',
              bgColor: '#ccc',
              textColor: '#fff',
              textUp: '松开刷新...',
              showTime: true
          }, function(ret, err) {
              // 这里写重新渲染页面的方法
              vm.refresh = true;
              vm.page = 1
              vm.loadList();
          });
        },
        loadNext: function() {
          api.addEventListener({
              name: 'scrolltobottom',
              extra: {
                  threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
              }
          }, function(ret, err) {
            vm.page = vm.page + 1;
            if (vm.page <= vm.totalPage) {
              UICore.showLoading('加载中...','稍等...');
                vm.loadList();
            }

          });
        },
        eventDetail:function(myEvent){
          api.openWin({
              name: 'eventDetail',
              url: './eventDetail.html',
              vScrollBarEnabled:false,
              pageParam: {
                  name: myEvent
              }
          });
        }
      },
      components:{
        "eventlist":{
          template:"#listTemplate",
          props:["eventobj"]
        }
      }
    });
}
