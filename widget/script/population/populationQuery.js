/**
 * Created by kevin on 2017/7/18.
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
                   name: 'PopulationResults',
                   url: './PopulationResults.html',
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

     }) //vue end




    // var pageFrom = api.pageParam.from;//标记从哪个页面跳转到本页面
    //
    // var sex_arr = [{
    //     text: '男',
    //     status: 'normal',
    //     key: 1
    // }, {
    //     text: '女',
    //     status: 'normal',
    //     key: 2
    // }];
    // $api.addEvt($api.byId('selectSex'), 'click', function() {
    //     UICore.openSelect2(sex_arr, $api.byId('querySex'));
    // });
    //
    // var queryJson = {};
    // var postJson = {};
    // var submit = $api.byId('query');
    //
    // $api.addEvt(submit, 'click', function() {
    //     var queryBuilding = $api.val($api.byId('queryBuilding'));
    //     var queryName = $api.val($api.byId('queryName'));
    //     var queryIds = $api.val($api.byId('queryIds'));
    //     var querySex = $api.attr($api.byId('querySex'), 'name');
    //     var gridCode = $api.getStorage('userinf').gridCode;
    //     queryJson.pageSize = 15;
    //     queryJson.pageNow = 1;
    //     if (queryName) {
    //         queryJson.name = queryName;
    //     };
    //     if (queryIds) {
    //         queryJson.cardid = queryIds;
    //     };
    //     if (querySex) {
    //         queryJson.sex = querySex;
    //     };
    //     if (gridCode) {
    //         queryJson.createUserGridCode = gridCode;
    //     };
    //     postJson.population = queryJson;
    //     api.openWin({
    //         name: 'populationResult',
    //         url: '../population/populationResult.html',
    //         pageParam: {
    //             json: postJson,
    //             from:pageFrom,
    //         }
    //     });
    // });
    // //返回到主界面
    // api.addEventListener({
    //     name: 'keyback'
    // }, function(ret, err) {
    //     if (ret) {
    //         api.closeWin({
    //             name: 'enter'
    //         });
    //
    //
    //     } else {
    //         alert(JSON.stringify(err));
    //     }
    // }); //返回主界面结束
    // var el = $api.byId('closeWin');
    // $api.addEvt(el, 'click', function() {
    //     api.closeWin({
    //         name: 'enter'
    //     });
    // });
}
