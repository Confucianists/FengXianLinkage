/**
 * Created by kevin on 2017/7/4.
 */
apiready = function() {
  new Vue({
    el:"#list",
    data:{},
    methods:{
      submit:function(){
        console.log("ss");
        var value={};
        value.key1=buildId;
        value.key2=buildName;
        value.key3=Address;
        api.sendEvent({
            name: 'mapinfo',
            extra: value
        });
      },
      closeWin: function(){
        api.closeWin();
      }
    }
  });
  var that = this;
  //console.log("地图编号大店");
  //console.log(mapcontainer.style.display);
  mapcontainer.style.display = "block";
  mapload();
}
