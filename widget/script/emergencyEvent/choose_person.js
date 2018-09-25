window.apiready=function(){
    var personObj = api.pageParam;
    personJson = personObj.name
    var vm = new Vue({
      el:"#app",
      data:{
        personList:personJson
      },
      methods:{
        personClick:function(id,name){
          api.sendEvent({
          	name: 'personClick',
          	extra: {
              key1: id,
              key2: name
          	}
      		});
      		api.closeWin();
        }
      },
      components:{
        "header-comp":function(resolve, reject){
          api.readFile({
              path: 'widget://html/component/headertop.html'
          }, function(ret, err){
              if( ret ){
                   resolve({
                     template: ret.data,
                     data:function(){
                       return {title:"选择上报"}
                     },
                     methods:{
                       closeWin:function(){
                         api.closeWin();
                       }
                     }
                   });
              }else{
                alert(JSON.stringify(err));
              }
          });
        }
      }
    })
}
