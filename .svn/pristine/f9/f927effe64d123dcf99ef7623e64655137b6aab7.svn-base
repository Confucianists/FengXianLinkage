window.apiready = function() {
    var vue = new Vue({
      el: "#all_con",
      data: {
          accountId:"",
          items: [],
          isshow: false,
          isSlideInDown: false,
          isSlideInUp: false,
          resultjson: {},
          params: {pageSize:10,pageNow:1},
          totalCount : 0,
          refresh:false,

          deptName: "", //部件名称
      },
      created:function(){
        var info = $api.getStorage('userinf');
        this.accountId = info.accountId;
        this.params.accountId = this.accountId;
        this.loadList();
        this.loadBottom();
        this.refreshHeader();
        var _self = this;
        api.addEventListener({
            name: 'searchDept'
        }, function(ret, err) {
            if (ret) {
                if (ret.value.key1 == true) {
                    _self.isshow = true;
                    _self.isSlideInDown = true;
                } else {
                    _self.isshow = false;
                    _self.isSlideInDown = false;
                }

            } else {
                alert(JSON.stringify(err));
            }
        });
      },
      methods:{
          loadList:function(){
            UICore.showLoading('加载数据中...', '请稍等...');
            this.params.deptName = this.deptName;
            console.log(JSON.stringify(this.params));
            var _self = this;
            console.log(UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getDeptList&data=' + JSON.stringify(this.params));
            api.ajax({
                url: UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getDeptList&data=' + JSON.stringify(this.params),
                method: 'get',
            },function(ret, err){
                api.refreshHeaderLoadDone();
                api.hideProgress();

                if(_self.refresh){
                  _self.items = [];
                  _self.refresh = false;
                }
                if(_self.params.pageNow==1){
                  _self.items = [];
                }
                if(ret){
                    if(ret.success){
                        _self.totalCount = ret.totalPageCount;
                        if(ret.data){
                          _self.items = _self.items.concat(ret.data);
                        }

                        // for(var num in ret.data){
                        //     _self.items.push(ret.data[num])
                        // }
                    }else{
                        alert(ret.errorinfo);
                    }
                }else{
                    alert(JSON.stringify(err))
                }
            });
          },
          loadBottom: function() {
            var _self = this;
            api.addEventListener({
                name: 'scrolltobottom',
                extra: {
                    threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
                }
            }, function(ret, err) {
                if(_self.params.pageNow<_self.totalCount){
                    _self.params.pageNow++;
                    _self.loadList();
                }

            });

          },
          refreshHeader:function(){
            var _self = this;
            api.setRefreshHeaderInfo({
                visible: true,
                loadingImg: 'widget://image/loading_more.gif',
                bgColor: '#ccc',
                textColor: '#fff',
                textUp: '松开刷新...',
                showTime: true
            }, function(ret, err) {
                // 这里写重新渲染页面的方法
                _self.refresh = true;
                _self.params.pageNow = 1;
                _self.loadList();

            });
          },
          cover_close: function() {
              this.isshow = false;
          },
          query:function(){
              this.isshow = false;
              this.params.pageNow=1;
              this.loadList();
          },
          choose:function(info){
            api.sendEvent({
                name: 'cityComponentQueryDept',
                extra: {
                    data: info,
                }
            });
            api.closeWin();
          }
      },
      filters:{
          substringDate:function(value){
              return value?value.substring(0,10):"";
          }
      }
    });
}
