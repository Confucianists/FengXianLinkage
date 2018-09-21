/**
*   Created by hzh on 2017/7/17
    descration：城市部件主页面js
*/
apiready = function() {

    var vue = new Vue({
        el:"#list",
        data:{

        },
        methods:{
            closeWin:function(){
                api.closeWin({
                    name: 'cityComponentMain'
                });

            },
            create:function(){
                api.openWin({
                    name: 'CityComponent',
                    url: './CityComponent.html',
                    vScrollBarEnabled: false,
                    pageParam: {

                    }
                });

            },
            query:function(){
                api.openWin({
                    name: 'cityComponentList',
                    url: './cityComponentList.html',
                    pageParam: {

                    }
                });

            },
            newUI:function(){
              api.openWin({
                  name: 'newMintUI',
                  url: './newMintUI.html',
                  pageParam: {

                  }
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
