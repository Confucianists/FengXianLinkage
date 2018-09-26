/**
 * Created by kevin on 2017/7/20.
 */
apiready = function() {
   new Vue({
        el: "#list",
        data: {
        },
        methods: {
            create: function() {
                api.openWin({
                    name: 'buildingCreate',
                    pageParam: {
                      infos:"新增建筑",
                    },
                    url: '../building/building.html',
                    vScrollBarEnabled:false,
                });
            },
            query: function() {
                api.openWin({
                    name: 'buildingQuery',
                    url: './buildingQuery.html',
                    pageParam: {
                      infos:"查询建筑",
                      from:'buildingEnter'
                    }
                });
            },
            closeWin: function(){
              api.closeWin();
            }
        } // methods end.
    });

}
