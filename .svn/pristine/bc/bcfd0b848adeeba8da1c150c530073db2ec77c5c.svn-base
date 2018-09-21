window.apiready=function(){

  var vm = new Vue({
      el:"#app",
      data:{
        source: '',
        eventTitle:'',
        eventType:'notEnd',
        notEndStyle:'border-bottom:2px solid blue',
        endStyle:'border-bottom:0px'
      },
      created:function(){
        this.source = api.pageParam.name;
        this.openFrame();
        // alert(JSON.stringify(api.pageParam));
        
      },
      methods:{
        closeWin:function(){
          api.closeWin();
        },
        serachEvent:function(){
          // this.openFrame();
        },
        openFrame:function(){
          var _self = this;
          var serach = {eventTitle:this.eventTitle,eventType:this.eventType, source: this.source}
          api.openFrame({
            name: 'approveList',
            url: './approveList.html',
            vScrollBarEnabled:false,
            rect: {
              x: 0,
              y: $api.dom('.header_top').offsetHeight,
              w: api.winWidth,
              h: api.winHeight-$api.dom('.header_top').offsetHeight
            },
            bounces:true,
            reload:true,
            pageParam:serach
          });
        },
        notEndEventList:function(){
          this.eventType = 'notEnd';
          this.notEndStyle='border-bottom:2px solid blue';
          this.endStyle='border-bottom:0px';
          this.openFrame();
        },
        endEventList:function(){
          this.notEndStyle='border-bottom:0px';
          this.endStyle='border-bottom:2px solid blue';
          this.eventType = 'end';
          this.openFrame();
        }
      }
  });
}
