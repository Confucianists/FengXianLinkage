apiready = function() {
    var vue = new Vue({
        el: "#organ_all",
        data: {
          items:[],
          page:1,
          rows:20,
          totalPage:0,
          refresh:false,
          showAll:false,
          main_show:true,
          ttyy:0,
          on_once:0,//是否已经执行过一次了
          showinfo:'暂无数据',
          details:[],
          depage:1,
          derows:20,
          detotalPage:0,
          derefresh:false,
          deshowAll:false,
          deshowinfo:'暂无数据',
          scolltopH:0//滚动条高度
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
              var url = 'http://192.168.2.117:8080/mobile/mobileWf.shtml?act=deptList&%20page='+this.page+'&rows='+this.rows+'&accountId=7a8a8f3947ed85e50147ed8bae0e0000'
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
                    } else {
                      vue.showAll = true;
                      vue.showinfo = "暂无数据";
                    }
                    $api.css($api.dom('.loadover'),'display:block');
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
                  if(vue.main_show){//组织架构  主要列表存在  加载  主要的
                    vue.refresh = true;
                    vue.page = 1
                    vue.loadList();
                  } else {
                    vue.derefresh = true;
                    vue.depage = 1
                    vue.loadDetailList();
                  }

              });
            },
            loadNext: function() {
              api.addEventListener({
                  name: 'scrolltobottom',
                  extra: {
                      threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
                  }
              }, function(ret, err) {
              if(vue.main_show){//组织架构  主要列表存在  加载  主要的
                vue.page = vue.page + 1;
                vue.ttyy = 1;
                if (vue.page <= vue.totalPage) {
                  UICore.showLoading('加载中...','稍等...');
                  vue.loadList();
                }
              } else {
                if(vue.ttyy != 1) {
                  vue.depage = vue.depage + 1;
                  if (vue.depage <= vue.detotalPage) {
                    UICore.showLoading('加载中...','稍等...');
                    vue.loadDetailList();
                  }
                }
              }
              });
            },
            organ_detail: function(id,title) {
              vue.main_show = false;
              vue.details = [];
              vue.depage = 1;
              $api.css($api.dom('.organ_detail'),'display:block');
              vue.scolltopH = vue.getScrollTop();
              vue.loadDetailList();

            },
            loadDetailList:function(){
              var url = 'http://192.168.2.117:8080/mobile/mobileWf.shtml?act=gridPersonList&page='+this.depage+'&rows='+this.derows+'&accountId=7a8a8f3947ed85e50147ed8bae0e0000'
              api.ajax({
                url : url,
                tag : 'grid',
                method : 'get'
              }, function(reta, err) {
                api.hideProgress();
                if(reta){
                  if (vue.derefresh) {
                    vue.details = [];
                    api.refreshHeaderLoadDone();
                  }
                  if(reta.success==true){
                    vue.detotalPage = Math.ceil(reta.totalNum/vue.derows);//总页数;
                    if(null != reta.dataList && reta.dataList.length > 0) {
                      vue.details = vue.details.concat(reta.dataList);

                      if(vue.detotalPage == vue.depage){
                        vue.deshowAll = true;
                        vue.deshowinfo = "已加载全部";
                      } else {
                        vue.deshowAll = false;
                      }

                      $api.css($api.dom('.deloadover'),'display:block');
                    } else {
                      vue.deshowAll = true;
                      vue.deshowinfo = "暂无数据";
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
                vue.derefresh = false;
                vue.ttyy = 0;
              });
            },
            getScrollTop:function() {//获取滚动条  距离顶部的高度
                var scrollPos;
                if (window.pageYOffset) {
                  scrollPos = window.pageYOffset;
                } else if (document.compatMode && document.compatMode != 'BackCompat') {
                  scrollPos = document.documentElement.scrollTop;
                } else if (document.body) {
                  scrollPos = document.body.scrollTop;
                }
                return scrollPos;
            },
            to_main:function() {
              vue.main_show = true;
              vue.page = 1;
              vue.depage = 1;
              vue.ttyy = 1;
              $api.css($api.dom('.organ_detail'),'display:none');
              document.getElementsByTagName('body')[0].scrollTop = 1000;
            }
        } // methods end.
    });
}
