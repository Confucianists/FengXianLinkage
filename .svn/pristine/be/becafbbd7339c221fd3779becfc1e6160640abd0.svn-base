/**
 * Created by kevin on 2017/7/24.
 */
apiready = function() {

    new Vue({
            el: "#list",
            data: {
                isshow: false,
                isSlideInDown: false,
                params: {},

                buildingName: "", //建筑名称
                layerNum: "", //楼号
                unitName: "", //单元(梯/区)
                roomNum: "", //房号
                houseowner: "", //户主

            },
            created: function() {
                this.params = api.pageParam;
                this.openFrame();
            },
            methods: {
                openFrame: function() {
                    console.log(JSON.stringify(this.params));
                    api.openFrame({
                        name: 'searchBuiForHoseownerResult',
                        url: './searchBuiForHoseownerResult.html',
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
                query: function() {
                  console.log("ssss");
                    this.isshow = true;
                    UICore.sendEvent("searchBuiforHouseowner", true);
                },
                closeWin: function() {
                    if (this.isshow == true) {
                        this.isshow = false;
                        UICore.sendEvent("searchhouseowner", false)
                    } else {
                        api.closeWin();
                    }

                }
            }, // methods end.
            components: {
                "hosueownerComponent": {
                    props: ['houseownertitle'],
                    template: "#hosueownerc",
                }
            }

        }) //vue end
}
