/**
*   Created by hzh on 2017/7/10
*/
apiready = function() {
    var param = api.pageParam;
    legalPersonQueryObj = new LegalPersonQuery();
    if (param != null && param != "" && param != 'undefined') {
        if (param.from != "" && param.from != "undefined") {
            legalPersonQueryObj.from = param.from;
        }
    }

    var vue = new Vue({
        el:"#list",
        data:{
            enterpriseName:"",  //单位名称
            organizationCode:"",//组织机构代码
            enterprisePropertiesId:"",
            enterpriseProperties:"请选择",//单位性质

        },
        created:function(){
          legalPersonQueryObj.initSelectData();
        },
        methods:{
            closeWin:function(){
                api.closeWin({
                    name: 'legalPersonQuery'
                });
            },
            submit:function(){
              legalPersonQueryObj.queryJson.pageSize = 10;
              legalPersonQueryObj.queryJson.pageNow = 1;
              legalPersonQueryObj.queryJson.data_area_code = $api.getStorage('userinf').gridCode;
              legalPersonQueryObj.queryJson.createUserGridCode=$api.getStorage('userinf').gridCode;
              legalPersonQueryObj.queryJson.unitName = this.enterpriseName;
              legalPersonQueryObj.queryJson.organizationCode = this.organizationCode;
              legalPersonQueryObj.queryJson.unitProperties = this.enterprisePropertiesId;

              var resultJson = {};
              resultJson.enterprise = legalPersonQueryObj.queryJson;
              api.openWin({
                  name: 'legalPersonQueryResult',
                  url: './legalPersonQueryResult.html',
                  pageParam: {
                      data:resultJson,
                      from:legalPersonQueryObj.from,
                  }
              });
            },
            enterprisePropertiesf:function(){
                console.log("单位性质");
                var that = this;
                var defaultVal = this.enterpriseProperties; //获取默认值
                if (defaultVal != null && defaultVal != "") {
                    legalPersonQueryObj.unitProperties_arr.forEach(function(value,index,arr){
                        if (value.text == this.enterpriseProperties) {
                            arr[index].status = "selected";
                        }
                    });
                }

                UICore.openSelect3(legalPersonQueryObj.unitProperties_arr, this.enterpriseProperties, "enterpriseProperties");
                api.addEventListener({
                    name: 'enterpriseProperties'
                }, function(ret, err) {
                    if (ret) {
                        console.log(JSON.stringify(ret.value.key1));
                        that.enterpriseProperties = ret.value.key1;
                        that.enterprisePropertiesId = ret.value.key2;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },

        },// methods end.
        components:{
          "input-item":{
            template:"#item-input", //模版内容
            props:["titlename","myclass"],
            methods:{
            },
          },


        },

    });

}

LegalPersonQuery = function(){};
LegalPersonQuery.prototype = {
    from:"legalPersonQuery",//表示从哪里跳转进入企业查询界面，默认表示从法人信息，“查询法人”功能进入
    queryJson: {},//查询参数
    unitProperties_arr:[],//单位性质

    // 初始化下拉条数据
    initSelectData:function(){
        console.log("initSelectData");
        var that = this;
        var cacheDir = api.cacheDir;
        api.readFile({
            path: cacheDir + 'config.json'
        }, function(ret, err){
            if(ret.status){
              var jsonData = JSON.parse(ret.data);
              if (jsonData != "") {
                jsonData.data.forEach(function(value) {
                    if (value.parentKey == "UnitProperties") { //单体性质
                      that.unitProperties_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                      })
                    }

                })
              }else{
                alert("初始化失败，数据为空");
              }
            }else{
              alert(err.msg);
            }

        });

    }
}
