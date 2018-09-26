window.apiready = function() {
    var _componentType = [];
    var _componentStatus = [];
    var vue = new Vue({
      el: "#all_con",
      data: {
          accountId:"",
          items: [],
          isshow: false,
          isSlideInDown: false,
          isSlideInUp: false,
          resultjson: {},
          params: {citycomponent:{pageSize:10,pageNow:1}},
          totalCount : 0,
          refresh:false,

          componentName: "", //部件名称
          componentType:"",
          componentTypeId:"",
          componentType_arr: [], //部件类型
          componentSecondType:"",
          componentSecondType_arr: [], //部件子类型
      },
      created:function(){
        var info = $api.getStorage('userinf');
        this.accountId = info.accountId;
        this.initSelectData();
        this.loadBottom();
        this.refreshHeader();
        this.loadList();
        var _self = this;
        api.addEventListener({
            name: 'searchCityComponent'
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
            //this.getSpinnerValue("CityComponent_ComponentType",this.componentType_arr);//部件类型
            //this.getSpinnerValue2("CityComponent_ComponentStatue",this.componentStatus_arr);//部件状态
            this.loadStatus();
            var _self = this;
            api.ajax({
                url:  UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getSysCategoryByCode&code=CityComponent_ComponentType',
                method: 'get',
            },function(ret, err){
                if (ret) {
                    console.log(JSON.stringify( ret ) );
                    if(ret.success){
                      var jsonData = ret.data;
                      if (jsonData != "") {
                          jsonData.forEach(function(value) {
                              _self.componentType_arr.push({
                                text: value.extendAttributeValue,
                                status: 'normal',
                                key: value.extendAttributeKey
                              });
                              _componentType.push({
                                text: value.extendAttributeValue,
                                status: 'normal',
                                key: value.extendAttributeKey
                              });
                          });

                      } else {
                          alert("初始化失败，数据为空");
                      }
                    }
                }

            });
          },
          getSpinnerValue:function(key,dataArr){
              var _self = this;
              console.log("获取下拉条数据 : " + key);
              console.log(UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getSysCategoryByCode&code=' + key);
              api.ajax({
                  url: UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getSysCategoryByCode&code=' + key,
                  method: 'get',
              },function(ret, err){
                  if (ret) {
                      console.log(JSON.stringify( ret ) );
                      if(ret.success){
                        var jsonData = ret.data;
                        if (jsonData != "") {
                            jsonData.forEach(function(value) {
                                dataArr.push({
                                  text: value.extendAttributeValue,
                                  status: 'normal',
                                  key: value.extendAttributeKey
                                });
                            });

                        } else {
                            alert("初始化失败，数据为空");
                        }
                      }
                  }
              });
          },
          loadStatus:function(){
            var _self = this;
            api.ajax({
                url: UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getSysAttributeByCode&code=CityComponent_ComponentStatue',
                method: 'get',
            },function(ret, err){
                if (ret) {
                    console.log(JSON.stringify( ret ) );
                    if(ret.success){
                      var jsonData = ret.data;
                      if (jsonData != "") {
                          jsonData.forEach(function(value) {
                              _componentStatus.push({
                                text: value.extendAttributeValue,
                                status: 'normal',
                                key: value.extendAttributeKey
                              });
                          });
                          console.log(JSON.stringify(_componentStatus));
                      } else {
                          alert("初始化失败，数据为空");
                      }
                    }
                }
            });
          },
          loadList:function(){
            UICore.showLoading('加载数据中...', '请稍等...');
            this.params.citycomponent.componentName = this.componentName;
            this.params.citycomponent.componentType = this.componentTypeId;
            this.params.citycomponent.componentSubType = this.componentSecondTypeID;
            console.log(JSON.stringify(this.params));
            var _self = this;
            console.log( UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=query&accountId='+this.accountId+'&data=' + JSON.stringify(this.params));
            api.ajax({
                url: UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=query&accountId='+this.accountId+'&data=' + JSON.stringify(this.params),
                method: 'get',
            },function(ret, err){
                api.refreshHeaderLoadDone();
                api.hideProgress();

                if(_self.refresh){
                  _self.items = [];
                  _self.refresh = false;
                }
                if(_self.params.citycomponent.pageNow==1){
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
                if(_self.params.citycomponent.pageNow<_self.totalCount){
                    _self.params.citycomponent.pageNow++;
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
                _self.params.citycomponent.pageNow = 1;
                _self.loadList();

            });
          },
          componentTypeC:function(){
            for(var num in this.componentType_arr){
                if(this.componentType_arr[num].key == this.componentTypeId){
                    this.componentType_arr[num].status = 'selected';
                }
            }
            UICore.openSelect3(this.componentType_arr, this.componentType, "componentType");
            var _self = this;
            api.addEventListener({
                name: 'componentType'
            }, function(ret, err) {
                if (ret) {
                    console.log(JSON.stringify(ret.value));
                    _self.componentType = ret.value.key1;
                    _self.componentTypeId = ret.value.key2;
                    _self.componentSecondType_arr = [];
                    _self.componentSecondType = "";
                    _self.componentSecondTypeID = "";
                    _self.getSpinnerValue(ret.value.key2,_self.componentSecondType_arr);
                } else {
                    alert(JSON.stringify(err));
                }
            });
          },
          componentSecondTypef: function() {
                console.log("部件子类型");
                var _self = this;
                var defaultVal = _self.componentSecondType; //获取默认值
                if (defaultVal != null && defaultVal != "") {
                    _self.componentSecondType_arr.forEach(function(value, index, arr) {
                        if (value.text == _self.componentSecondType) {
                            arr[index].status = "selected";
                        }
                    });
                }

                UICore.openSelect3(_self.componentSecondType_arr, _self.componentSecondType, "componentSecondType");
                api.addEventListener({
                    name: 'componentSecondType'
                }, function(ret, err) {
                    if (ret) {
                        console.log(JSON.stringify(ret.value.key1));
                        _self.componentSecondType = ret.value.key1;
                        _self.componentSecondTypeID = ret.value.key2;
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
              this.params.citycomponent.pageNow=1;
              this.loadList();
          },
          choose:function(info){
            api.openWin({
                name: 'cityComponent',
                url: './CityComponent.html',
                vScrollBarEnabled:'false',
                pageParam: {
                    status:"isBrownse",
                    data: info
                }
            });
          }
      },
      filters:{
          substringDate:function(value){
              return value?value.substring(0,10):"";
          },
          componentTypeFilter:function(value){
              for(var num in _componentType){
                if(_componentType[num].key==value){
                  return _componentType[num].text;
                }
              }
          },
          componentStatus:function(value){
            for(var num in _componentStatus){
              if(_componentStatus[num].key==value){
                return _componentStatus[num].text;
              }
            }
          }
      }
    });
}
