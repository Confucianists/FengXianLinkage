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
          params: {enterprise:{pageSize:10,pageNow:1}},
          totalCount : 0,
          refresh:false,
          unitProperties_arr:[],

          enterpriseName: "", //单位名称
          organizationCode: "", //机构代码
          enterpriseProperties: "", //单位性质
          enterprisePropertiesId:""
      },
      created:function(){
        var info = $api.getStorage('userinf');
        this.accountId = info.accountId;
        this.loadList();
        this.loadBottom();
        this.refreshHeader();
        this.initSelectData();
        var _self = this;
        api.addEventListener({
            name: 'searchLegalPerson'
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
          initSelectData:function(){
            var _self = this;
            var jsonData = JSON.parse($api.getStorage('settingdata'));
            if (jsonData != "") {
              jsonData.data.forEach(function(value) {
                  if (value.parentKey == "UnitProperties") { //单体性质
                    _self.unitProperties_arr.push({
                      text: value.extendAttributeValue,
                      status: 'normal',
                      key: value.extendAttributeKey
                    })
                  }
              });
            }
          },
          loadList:function(){
            UICore.showLoading('加载数据中...', '请稍等...');
            this.params.enterprise.unitName = this.enterpriseName;
            this.params.enterprise.organizationCode = this.organizationCode;
            this.params.enterprise.unitProperties = this.enterprisePropertiesId;
            console.log(JSON.stringify(this.params));
            var _self = this;
            console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForEnterprise.shtml?act=query&accountId='+this.accountId+'&data=' + JSON.stringify(this.params));
            api.ajax({
                url: UICore.serviceUrl + 'mobile/mobileInterfaceForEnterprise.shtml?act=query&accountId='+this.accountId+'&data=' + JSON.stringify(this.params),
                method: 'get',
            },function(ret, err){
                api.refreshHeaderLoadDone();
                api.hideProgress();

                if(_self.refresh){
                  _self.items = [];
                  _self.refresh = false;
                }
                if(_self.params.enterprise.pageNow==1){
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
                if(_self.params.enterprise.pageNow<_self.totalCount){
                    _self.params.enterprise.pageNow++;
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
                _self.params.enterprise.pageNow = 1;
                _self.loadList();

            });
          },
          dwxz:function(){
            for(var num in this.unitProperties_arr){
                if(this.unitProperties_arr[num].key == this.enterprisePropertiesId){
                    this.unitProperties_arr[num].status = 'selected';
                }
            }
            UICore.openSelect3(this.unitProperties_arr, this.enterpriseProperties, "enterpriseProperties");
            var _self = this;
            api.addEventListener({
                name: 'enterpriseProperties'
            }, function(ret, err) {
                if (ret) {
                    console.log(JSON.stringify(ret.value));
                    _self.enterpriseProperties = ret.value.key1;
                    _self.enterprisePropertiesId = ret.value.key2;
                } else {
                    alert(JSON.stringify(err));
                }
            });
          },
          cover_close: function() {
              this.isshow = false;
          },
          query:function(){
              this.isshow = false;
              this.params.enterprise.pageNow=1;
              this.loadList();
          },
          choose:function(info){
            if (api.pageParam.from == "legalPersonList") {
                // 从企业查询跳转
                api.openWin({
                    name: 'legalPerson',
                    url: './legalPerson.html',
                    vScrollBarEnabled:'false',
                    pageParam: {
                        status:"isBrownse",
                        data: info
                    }
                });
            }else if (api.pageParam.from == "cityComponent") {
                api.sendEvent({
                    name: 'cityComponentQueryResult',
                    extra: {
                        data: info,
                    }
                });
                api.closeWin();

            }
          }
      },
      filters:{
          substringDate:function(value){
              return value?value.substring(0,10):"";
          }
      }
    });
}
