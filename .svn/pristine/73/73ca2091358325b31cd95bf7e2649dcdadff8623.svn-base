/**
 * Created by kevin on 2017/6/23.
 */
apiready=function (){
  var param=api.pageParam;
  console.log(JSON.stringify(param));
  console.log((param.name).length);
  var name = (param.name).length==2?param.name:(param.name).substring(2,4);

  var url="";
  var url1="";
  if ($api.getStorage('url') == "" || $api.getStorage('url') == undefined) {
    $api.setStorage('url',{"page":param.page,"page1":param.page1});
    url=param.page;
    url1=param.page1;

  }else{
    url=$api.getStorage('url').page;
    url1=$api.getStorage('url').page1;
    console.log(url);
    console.log(url1);
  }
    new Vue({
        el:'#enterance',
        data:{
            creation:'新增'+name,
            query:'查询'+name,
            page:url,
            page1:url1
        },
        created:function(){
          var container = $api.dom(".container");
          $api.css(container, 'display:block');

        },
        methods:{
          create:function(){
            console.log(this.page);
            UICore.openWindown(this.creation,this.page)
          },
          querys:function(){
              console.log(this.page1);
              UICore.openWindown(this.query,this.page1)
          }
        }
    });
}
