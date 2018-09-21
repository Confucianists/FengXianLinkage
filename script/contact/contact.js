apiready = function() {
    new Vue({
        el: "#contact_all",
        data: {

        },
        created:function(){
          this.openFrame("zzjg_frame","contact/organization.html");
        },
        methods: {
            choose_zz: function(obj) {
              $api.addCls($api.byId('zzjg'), 'active');
              $api.removeCls($api.byId('wly'), 'active');
              $api.removeCls($api.byId('qz'), 'active');

              this.openFrame("zzjg_frame","contact/organization.html");
              api.closeFrame({name: 'wly_frame'});
              api.closeFrame({name: 'qz_frame'});
            },
            choose_wl:function() {
              $api.removeCls($api.byId('zzjg'), 'active');
              $api.removeCls($api.byId('qz'), 'active');
              $api.addCls($api.byId('wly'), 'active');

              this.openFrame("wly_frame","contact/networkmans.html");
              api.closeFrame({name: 'zzjg_frame'});
              api.closeFrame({name: 'qz_frame'});
            },
            choose_qz:function() {
              $api.removeCls($api.byId('zzjg'), 'active');
              $api.removeCls($api.byId('wly'), 'active');
              $api.addCls($api.byId('qz'), 'active');

              this.openFrame("qz_frame","contact/group.html");
              api.closeFrame({name: 'wly_frame'});
              api.closeFrame({name: 'zzjg_frame'});
            },
            openFrame:function(name,urls){
              api.openFrame({
                name: name,
                url: urls,
                vScrollBarEnabled:true,
                rect: {
                  x: 0,
                  y: $api.dom('.change_header').offsetHeight + 60,
                  w: api.winWidth,
                  h: api.winHeight-$api.dom('.change_header').offsetHeight - 116
                },
                bounces:true,
                reload:true,
                pageParam:""
              });
            },
        } // methods end.
    });
}
