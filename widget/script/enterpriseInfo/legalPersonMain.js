/**
*   Created by hzh on 2017/7/10
*/
apiready = function() {

    var vue = new Vue({
        el:"#list",
        data:{

        },
        methods:{
          create:function(){
              api.openWin({
                  name: 'legalPerson',
                  url: './legalPerson.html',
                  vScrollBarEnabled:'false',
                  pageParam: {

                  }
              });

          },
          query:function(){
              api.openWin({
                  name: 'legalPersonList',
                  url: './legalPersonList.html',
                  pageParam: {
                      from:"legalPersonList",
                  }
              });

          },
          closeWin:function(){
              api.closeWin({
                  name: 'legalPersonMain'
              });

          },

        },// methods end.
        components:{"main-item":{
            template:"#item-element", //模版内容
            props:["actioname","myclass"],
            methods:{
            },
          }
        },
    });

}
