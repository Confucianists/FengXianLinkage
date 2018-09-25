/**
 * Created by kevin on 2017/7/24.
 */
 apiready = function() {
     var vue = new Vue({
         el: "#list",
         methods: {
             create: function() {
                //  api.openWin({
                //      name: 'houseownerCreate',
                //      url: './searchBuildingForHouseowner.html',
                //      pageParam: {
                //          from: 'fromHouseownerCreate'
                //      }
                //  });
                 api.openWin({
                     name: 'houseownerCreate',
                     url: './houseowner.html',
                     vScrollBarEnabled:false,
                     pageParam: {
                       infos:"新增户籍"
                     }
                 });
             },
             query: function() {
                 api.openWin({
                     name: 'searchhouseowner',
                     url: './searchhouseowner.html',
                     vScrollBarEnabled:false,
                     pageParam: {
                        infos:"查询户籍",
                         from: 'houseownerQuery'
                     }
                 });

             },
             closeWin:function(){
               api.closeWin();

             }
         }, // methods end.
         components:{
           "houseownerEnterance": {
               props: ['accesstitle'],
               template: "#access",
           }
         }
     });

 }
