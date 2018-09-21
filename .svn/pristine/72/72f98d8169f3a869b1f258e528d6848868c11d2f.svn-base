/**
 * Created by kevin on 2017/7/6.
 */
apiready = function() {
  new Vue({
         el: "#list",
         data: {
             isshow: false,
             isSlideInDown: false,
             params: {},
         },
         created: function() {
             this.params = api.pageParam;
             this.openFrame();
             var container = $api.dom(".wrapper");
             $api.css(container, 'display:block');
             api.hideProgress();
         },
         methods: {
           openFrame:function() {
               api.openFrame({
                   name: 'HouseQueryForPerson',
                   url: './HouseQueryForPerson.html',
                   vScrollBarEnabled: false,
                   rect: {
                       x: 0,
                       y: $api.dom('.header').offsetHeight,
                       w: api.winWidth,
                       h: api.winHeight - $api.dom('.header').offsetHeight
                   },
                   pageParam: {
                       from: this.params.from
                   },
                   bounces: true,
                   reload: true,
               });
           },
             search:function() {
               this.isshow = true;
               UICore.sendEvent("searchHouse", true);

             },
             closeWin:function() {
               if (this.isshow == true) {
                   this.isshow = false;
                   UICore.sendEvent("searchHouse", false)
               } else {
                   api.closeWin();
               }
             }
         }
       });



    // var postjson = {};
    // var query = $api.byId('pkh_add_su');
    // $api.addEvt(query, 'click', function() {
    //     if (vue.houseowner) {
    //         postjson.pageNow = 1;
    //         postjson.residentName = vue.houseowner;
    //         postjson.address = vue.hoseaddr;
    //         api.openWin({
    //             name: 'houseQueryResult',
    //             url: './houseQueryResult.html',
    //             pageParam: {
    //                 postjson: postjson
    //             }
    //         });
    //     } else {
    //         alert("屋主姓名不能为空")
    //     }
    //
    // });
    // var vue = new Vue({
    //     el: "#list",
    //     data: {
    //         houseowner: "",
    //         hoseaddr: "",
    //     }
    // })

}
