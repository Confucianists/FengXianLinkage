/*
  created by hzh on 2017/7/20
*/
CityComponentQuery = function(){};
CityComponentQuery.prototype = {

    queryJson:{},//查询参数

    componentType_arr: [], //部件类型
    componentSecondType_arr: [], //部件子类型

    initSelectData:function(){

      var that = this;
      that.getSpinnerValue("CityComponent_ComponentType",that.componentType_arr);//部件类型
    },
    getSpinnerValue:function(key,dataArr){
        UICore.showLoading("正在加载数据", "请稍等");
        console.log("获取下拉条数据 : " + key);
        console.log(UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getSysCategoryByCode&code=' + key);
        api.ajax({
            url: UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getSysCategoryByCode&code=' + key,
            method: 'get',
        },function(ret, err){
            api.hideProgress();
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
};

apiready = function(){

    mCityComponentQuery = new CityComponentQuery();
    mCityComponentQuery.initSelectData();

    var vue = new Vue({
        el:"#list",
        data:{
            componentTypeID:"",
            componentType:"请选择",
            componentSecondTypeID:"",
            componentSecondType:"请选择",
        },
        methods:{
          closeWin:function(){
              api.closeWin({
                  name: 'CityComponentQuery'
              });

          },
          queryFunc:function(){
            var that = this;
            if (that.componentTypeID == "" && that.componentSecondTypeID) {
               api.toast({
                   msg: '请选择查询条件',
                   duration: 2000,
                   location: 'bottom'
               });
               return;
            }
            mCityComponentQuery.queryJson.pageSize = 10;
            mCityComponentQuery.queryJson.pageNow = 1;
            mCityComponentQuery.queryJson.componentType = that.componentTypeID;
            mCityComponentQuery.queryJson.componentSubType = that.componentSecondTypeID;
            var sumbitJson = {};
            sumbitJson.citycomponent = mCityComponentQuery.queryJson;

            api.openWin({
                name: 'cityComponentQueryResult',
                url: './cityComponentQueryResult.html',
                pageParam: {
                    data:sumbitJson,
                }
            });


          },
          componentTypef:function(){
            console.log("部件类型");
            var that = this;
            var defaultVal = that.componentType; //获取默认值
            if (defaultVal != null && defaultVal != "") {
                mCityComponentQuery.componentType_arr.forEach(function(value, index, arr) {
                    if (value.text == that.componentType) {
                        arr[index].status = "selected";
                    }
                });
            }

            UICore.openSelect3(mCityComponentQuery.componentType_arr, that.componentType, "componentType");
            api.addEventListener({
                name: 'componentType'
            }, function(ret, err) {
                if (ret) {
                    console.log(JSON.stringify(ret.value.key1));
                    that.componentType = ret.value.key1;
                    that.componentTypeID = ret.value.key2;
                    mCityComponentQuery.componentSecondType_arr = [];
                    that.componentSecondType = "";
                    that.componentSecondTypeID = "";
                    mCityComponentQuery.getSpinnerValue(ret.value.key2,mCityComponentQuery.componentSecondType_arr);
                } else {
                    alert(JSON.stringify(err));
                }
            });

          },
          componentSecondTypef:function(){
            console.log("部件子类型");
            var that = this;
            if (!that.isClick) {
                var defaultVal = that.componentSecondType; //获取默认值
                if (defaultVal != null && defaultVal != "") {
                    mCityComponentQuery.componentSecondType_arr.forEach(function(value, index, arr) {
                        if (value.text == that.componentSecondType) {
                            arr[index].status = "selected";
                        }
                    });
                }

                UICore.openSelect3(mCityComponentQuery.componentSecondType_arr, that.componentSecondType, "componentSecondType");
                api.addEventListener({
                    name: 'componentSecondType'
                }, function(ret, err) {
                    if (ret) {
                        console.log(JSON.stringify(ret.value.key1));
                        that.componentSecondType = ret.value.key1;
                        that.componentSecondTypeID = ret.value.key2;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            }
          },
        },
        components:{"main-item":{
            template:"#item-element", //模版内容
            props:["actioname","myclass"],
            methods:{
            },
          }
        },


    });
};
