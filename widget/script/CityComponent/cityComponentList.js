
apiready = function() {

    new Vue({
            el: "#list",
            isshow: false,
            isSlideInDown: false,
            data: {
                params: {}
            },
            created: function() {
                //this.params = api.pageParam;
                this.openFrame();
            },
            methods: {
                openFrame:function() {
                    //console.log(JSON.stringify(this.params));
                    api.openFrame({
                        name: 'cityComponentListResult',
                        url: './cityComponentListResult.html',
                        vScrollBarEnabled: false,
                        rect: {
                            x: 0,
                            y: $api.dom('.header').offsetHeight,
                            w: api.winWidth,
                            h: api.winHeight - $api.dom('.header').offsetHeight
                        },
                        bounces: true,
                        reload: true,
                    });
                },
                search: function() {
                    this.isshow = true;
                    UICore.sendEvent("searchCityComponent", true);
                },
                closeWin:function() {
                    api.closeWin();
                }
            } //methods end
        }) //vue end
}
