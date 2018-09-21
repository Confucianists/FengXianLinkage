
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
                        name: 'legalPersonListResult',
                        url: './legalPersonListResult.html',
                        vScrollBarEnabled: false,
                        rect: {
                            x: 0,
                            y: $api.dom('.header').offsetHeight,
                            w: api.winWidth,
                            h: api.winHeight - $api.dom('.header').offsetHeight
                        },
                        pageParam: {
                            from: api.pageParam.from
                        },
                        bounces: true,
                        reload: true,
                    });
                },
                search: function() {
                    this.isshow = true;
                    UICore.sendEvent("searchLegalPerson", true);
                },
                closeWin:function() {
                    if (this.isshow == true) {
                        this.isshow = false;
                        UICore.sendEvent("searchLegalPerson", false)
                    } else {
                        api.closeWin();
                    }
                }
            } //methods end
        }) //vue end
}
