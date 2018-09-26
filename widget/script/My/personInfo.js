/*
  Created by hzh on 2017/8/1
*/
apiready = function(){

   var vue = new Vue({
     el:'#list',
     data:{
       userName:"",
       sex:"",
       mobilePhone:"",
       email:"",
       department:"",
       QRCodeCard:"",
     },
     created:function(){
       var that = this;
       accountId = $api.getStorage('userinf').accountId;
       UICore.showLoading("正在加载", "请稍候");
       console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=personDetail&accountId=' + accountId);
       api.ajax({
           url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=personDetail&accountId=' + accountId,
           method: 'post',
       },function(ret, err){
           api.hideProgress();
           if (ret) {
               if (ret.success) {
                 if (ret.dataList != null && ret.dataList != 'undefined') {
                   that.userName = ret.dataList.userName;
                   that.sex = ret.dataList.sex;
                   that.mobilePhone = ret.dataList.phoneNum;
                   that.email = ret.dataList.email;
                   that.department = ret.dataList.dept;
                 }
               }else{
                 alert("获取个人信息失败");
               }
           } else {
               alert("请求失败");
           }
       });

     },
     methods:{
       closeWin:function(){
         api.closeWin({
             name: 'personInfo'
         });

       },
       QRCodeCardf:function(){
         alert("暂无二维码名片");
       },
     },
     components:{
       "main-item":{
         template: "#item-element",
         props: ["actioname", "myclass"],
     }},
   });
};

PersonInfo = function(){};
PersonInfo.prototype = {

    personInfo:{},

};
