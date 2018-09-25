window.apiready=function(){
  var vm = new Vue({
    el:"#app",
    data:{
      formdata:{},  //表单数据存放属性
      settingdata:{}, //配置文件存放属性
      accountId:'',
      workId:''
    },
    created:function(){
      var info = $api.getStorage('userinf');
      this.accountId=info.accountId;
      console.log(api.pageParam.name);
      this.workId = api.pageParam.name;
      UICore.showLoading('加载中...','稍等...');
      this.getForm();
    },
    methods:{
      getForm:function(){
        console.log(UICore.serviceUrl+'mobile/mobileWf.shtml?act=editEvent_HZ&state=VIEW&loginId='+this.accountId+'&workId=' + this.workId);
        api.ajax({
          url : UICore.serviceUrl+'mobile/mobileWf.shtml?act=editEvent_HZ&state=VIEW&loginId='+this.accountId+'&workId=' + this.workId,
          tag : 'grid',
          method : 'get'
        }, function(ret, err) {
          if (ret) {
            var data = ret;
            var setting = $api.getStorage('settingdata');
            var settingdata = JSON.parse(setting);
            for(var column in data){
              if(data[column].column_label=="select"||data[column].column_label=="radio"||data[column].column_label=="checkbox"){
                if(data[column].default_value!=""&&data[column].default_value!=null){
                  var tempValue = data[column].default_value.split(",");
                  data[column].default_value = "";
                  for (var j = 0; j < settingdata.data.length; j++) {
                      for(temp in tempValue){
                        if (data[column].english_name == settingdata.data[j].parentKey && settingdata.data[j].extendAttributeKey == tempValue[temp]) {
                            if(data[column].default_value==""){
                              data[column].default_value = data[column].default_value + settingdata.data[j].extendAttributeValue;
                            }else{
                              data[column].default_value = data[column].default_value + ","+settingdata.data[j].extendAttributeValue;
                            }

                        }
                      }

                  }
                }

              }
            }

            //必须用$set,这样才会触发VUE重新渲染，直接赋值不会触发
            vm.$set(vm.$data,"formdata",data);
            api.hideProgress();
          }else{
            alert(JSON.stringify(err));
          }
        });

      },
      closeWin:function(){
        api.closeWin();
      }
    },
    components:{
      //动态表单元素组件
      "myelement":{
          template:"#item-element",
          props:['param','myclass']   //param是元素标题,myclass是其他一个DIV的样式
      }
    }
  })
}
