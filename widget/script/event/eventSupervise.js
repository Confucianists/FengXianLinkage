window.apiready = function () {

  var vm = new Vue({
    el: "#app",
    data: {
      eventTitle: '',
      startdate: '',
      enddate: '',
      eventType: 'notEnd',
      notEndStyle: 'border-bottom:2px solid blue',
      endStyle: 'border-bottom:0px'
    },
    created: function () {
      this.openFrame();
    },
    methods: {
      // 选择时间
      pickerDate: function (v, str) {
        api.openPicker({
          type: 'date',
          title: str || '选择时间'
        }, function (ret, err) {
          if (ret) {
            vm[v] = ret.year + '-' + (ret.month >= 10 ? ret.month: '0' + ret.month) + '-' + (ret.day >= 10 ? ret.day : '0' + ret.day);
          } else {
            alert(JSON.stringify(err));
          }
        });
      },
      closeWin: function () {
        api.closeWin();
      },
      serachEvent: function () {
        this.openFrame();
      },
      openFrame: function () {
        var serach = {
          startdate: this.startdate,
          enddate: this.enddate
        }
        api.openFrame({
          name: 'approveSuperviseList',
          url: './approveSuperviseList.html',
          vScrollBarEnabled: false,
          rect: {
            x: 0,
            y: $api.dom('.header_top').offsetHeight,
            w: api.winWidth,
            h: api.winHeight - $api.dom('.header_top').offsetHeight - 31
          },
          bounces: true,
          reload: true,
          pageParam: serach
        });
      }
    }
  });
}
