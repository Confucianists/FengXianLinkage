/* Created by hzh on 2017/8/2
*/
apiready = function(){

    //校验输入
    function checkValue(){
       if (vue.currentPsw == "" || vue.currentPsw == "undefined"
                || vue.currentPsw == null) {
          api.toast({
              msg: '当前密码为空',
              duration: 2000,
              location: 'bottom'
          });
          return false;
       }
       if (vue.newPsw1 == "" || vue.newPsw1 == "undefined"
                || vue.newPsw1 == null) {
          api.toast({
              msg: '新密码为空',
              duration: 2000,
              location: 'bottom'
          });
          return false;
       }
       if (vue.newPsw2 == "" || vue.newPsw2 == "undefined"
                || vue.newPsw2 == null) {
          api.toast({
              msg: '新密码为空',
              duration: 2000,
              location: 'bottom'
          });
          return false;
       }
       if (vue.newPsw1 != vue.newPsw2) {
         api.toast({
             msg: '新密码不一致',
             duration: 2000,
             location: 'bottom'
         });
         return false;
       }
       return true;
    }

    var vue = new Vue({
        el:"#list",
        data:{
          currentPsw:"",
          newPsw1:"",
          newPsw2:"",
        },
        methods:{
          closeWin:function(){
              api.closeWin({
                  name: 'modifyPassword'
              });

          },
          submit:function(){
              if (checkValue()) {
                  UICore.showLoading("正在提交", "请稍候");
                  accountId = $api.getStorage('userinf').accountId;
                  console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=modifyPassword&accountId=' + accountId + '&oldPassword=' + this.currentPsw + '&newPassword=' + this.newPsw1);
                  api.ajax({
                      url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=modifyPassword&accountId=' + accountId + '&oldPassword=' + this.currentPsw + '&newPassword=' + this.newPsw1,
                      method: 'post',
                  },function(ret, err){
                      api.hideProgress();
                      if (ret) {
                          if (ret.success) {
                            api.toast({
                                msg: '修改成功',
                                duration: 2000,
                                global: 'true',
                                location: 'bottom'
                            });
                            api.closeWin();
                            this.currentPsw = "";
                            this.newPsw1 = "";
                            this.newPsw2 = "";
                          }else{
                            alert(ret.errorInfo);
                          }
                      } else {
                          alert("修改失败");
                      }
                  });

              }
          },
        },
        components:{
          "main-item":{
             template:"#item-element",
             props: ["actioname", "myclass"],
          }
        }
    });
};
