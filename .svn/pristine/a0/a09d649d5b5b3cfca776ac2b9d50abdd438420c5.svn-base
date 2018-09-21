apiready = function() {
    var vue = new Vue({
        el: "#network_all",
        data: {
          items:[],
          page:1,
          rows:20,
          totalPage:0,
          refresh:false,
          showAll:false,
          showinfo:'暂无数据'
        },
        created:function(){
          UICore.showLoading('数据加载中...');
          this.loadList();
        },
        mounted:function(){
          this.refreshHeader();
          this.loadNext();
        },
        methods: {
            loadList:function(){
              var url = 'http://192.168.2.117:8080/mobile/mobileWf.shtml?act=gridPersonList&page='+this.page+'&rows='+this.rows+'&accountId=7a8a8f3947ed85e50147ed8bae0e0000'
              api.ajax({
                url : url,
                tag : 'grid',
                method : 'get'
              }, function(reta, err) {
                api.hideProgress();
                if(reta){
                  if (vue.refresh) {
                    vue.items = [];
                    api.refreshHeaderLoadDone();
                  }
                  if(reta.success==true){
                    vue.totalPage = Math.ceil(reta.totalNum/vue.rows);//总页数;
                    if(null != reta.dataList && reta.dataList.length > 0) {
                      vue.items = vue.items.concat(reta.dataList);

                      if(vue.totalPage == vue.page){
                        vue.showAll = true;
                        vue.showinfo = "已加载全部";
                      } else {
                        vue.showAll = false;
                      }

                      $api.css($api.dom('.loadover'),'display:block');
                    } else {
                      vue.showAll = true;
                      vue.showinfo = "暂无数据";
                    }
                  } else {
        						api.alert({
        							msg : "数据加载异常"
        						});
        					}
                } else {
        					api.alert({
        						msg : JSON.stringify(err)
        					});
        				}
                vue.refresh = false;
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
                  vue.refresh = true;
                  vue.page = 1
                  vue.loadList();
              });
            },
            loadNext: function() {
              api.addEventListener({
                  name: 'scrolltobottom',
                  extra: {
                      threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
                  }
              }, function(ret, err) {
                vue.page = vue.page + 1;
                if (vue.page <= vue.totalPage) {
                  UICore.showLoading('加载中...','稍等...');
                    vue.loadList();
                }
              });
            },
            tel_play:function(tel) {
              if(UICore.checkTel("",tel)){//号码  验证正确
                api.call({
                    type: 'tel_prompt',
                    number: tel
                });
              }
            }
        } // methods end.
    });
}
