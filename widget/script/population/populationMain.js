/**
*   Created by hzh on 2017/7/10
*/
apiready = function() {
     new Vue({
        el:"#list",
        data:{
        },
        methods:{
            create:function(){
                api.openWin({
                    name: 'population',
                    url: './population.html',
                    vScrollBarEnabled:false,
                    pageParam: {
                      name:"新增人口",
                    }
                });
            },
            query:function(){
                api.openWin({
                    name: 'populationQuery',
                    url: './populationQuery.html',
                    vScrollBarEnabled:false,
                    pageParam: {
                        name:"查询人口",
                        from:"populationQuery",
                    }
                });
            },
            closeWin: function(){
              api.closeWin();
            }
        }// methods end.
    });
}
