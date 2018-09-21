/**
 * Created by kevin on 2017/7/4.
 */
apiready = function() {

    new Vue({
            el: "#list",
            data: {
                isshow: false,
                isSlideInDown: false,
                params: {},
                buiName: "", //建筑名称
                entityId: "", //地图编号
                buiAddr: "", //地址
                buiType: "", //楼号类型
                buiTypeId: "",
                buiNum: "", //楼号
                buiType_arr: [],
            },
            created: function() {
                this.params = api.pageParam;
                this.openFrame();
            },
            methods: {
                openFrame:function() {
                    console.log(JSON.stringify(this.params));
                    api.openFrame({
                        name: 'QueryBuiForHouseResult',
                        url: './QueryBuiForHouseResult.html',
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
                search: function() {
                    this.isshow = true;
                    UICore.sendEvent("searchBuilding", true);
                },
                closeWin:function() {
                    if (this.isshow == true) {
                        this.isshow = false;
                        UICore.sendEvent("searchBuilding", false)
                    } else {
                        api.closeWin();
                    }
                }
            } //methods end
        }) //vue end
}
