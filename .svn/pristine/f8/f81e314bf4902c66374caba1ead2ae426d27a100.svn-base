/**
 * Created by kevin on 2017/7/17.
 */
apiready = function() {
    console.log("dee");
    var vue = new Vue({
        el: "#list",
        data: {

        },
        methods: {
            create: function() {
                api.openWin({
                    name: 'houseCreate',
                    url: './house.html',
                    vScrollBarEnabled:false,
                    pageParam: {
                      infos:"新增房屋"
                    }
                });
            },
            query: function() {
                api.openWin({
                    name: 'houseQuery',
                    url: './queryhouse.html',
                    pageParam: {
                        infos:"查询建筑",
                    }
                });

            },
            closeWin:function() {
                api.closeWin();
            }
        } // methods end.
    });

}
