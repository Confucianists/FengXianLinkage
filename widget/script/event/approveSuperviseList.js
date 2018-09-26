window.apiready = function () {
  var vm = new Vue({
    el: "#no_end_all",
    mixins: [mixBase],
    created: function () {
      var info = $api.getStorage('userinf');
      this.accountId = info.accountId;
      UICore.showLoading('加载中...', '稍等...');
      this.loadList();
      var that = this;
      api.addEventListener({
        name: 'backRefresh'
      }, function (ret, err) {
        that.refresh = true;
        that.page = 1
        that.loadList();
      });
    },
    mounted: function () {
      this.refreshHeader();
      this.loadNext();
    },
    data: {
      eventList: {
      },
      visible: false,
      accountId: "",
      page: 1,
      rows: 15,
      totalPage: 0,
      refresh: false,
      showAll: false,
      searchParam: '',
      eventType: '',
      eventId: '',
      tokenValidate: true
    },
    methods: {
      loadList: function () {
        var url = UICore.serviceUrl
          + 'subsystem/businessSearch/loadAllDBEvent?'
          + 'pageIndex=' + this.page
          + '&pageSize=' + this.rows
          + '&token=' + window.localStorage.getItem('token')
          + '&startdate=' + api.pageParam.startdate
          + '&enddate=' + api.pageParam.enddate;
        console.log(url);
        api.ajax({
          url: url,
          method: 'post'
        }, function (re, err) {
          // var ret = re.list;
          if (re.code == '201') {
            vm.refreshToken('loadList', {});
            return false;
          }
          if (vm.refresh) {
            api.refreshHeaderLoadDone();
          }
          api.hideProgress();
          if (re.pageInfo) {
            vm.totalPage = Math.ceil(re.pageInfo.totalCount / vm.rows);//总页数;
            if (vm.totalPage == vm.page) {
              vm.showAll = true;
            } else {
              vm.showAll = false;
            }
            if (re.list.length > 0) {
              var eventObj = re.list;
              if (vm.eventList.length > 0 && !vm.refresh) {
                eventObj = vm.eventList.concat(eventObj);
              }
              vm.$set(vm.$data, "eventList", eventObj)
            }
          }
          vm.refresh = false;
        });
      },
      refreshHeader: function () {
        api.setRefreshHeaderInfo({
          visible: true,
          loadingImg: 'widget://image/loading_more.gif',
          bgColor: '#ccc',
          textColor: '#fff',
          textUp: '松开刷新...',
          showTime: true
        }, function (ret, err) {
          // 这里写重新渲染页面的方法
          vm.refresh = true;
          vm.page = 1
          vm.loadList();
        });
      },
      loadNext: function () {
        api.addEventListener({
          name: 'scrolltobottom',
          extra: {
            threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
          }
        }, function (ret, err) {
          vm.page = vm.page + 1;
          if (vm.page <= vm.totalPage) {
            UICore.showLoading('加载中...', '稍等...');
            vm.loadList();
          }
        });
      },
      // 事件督办
      supervise: function (e) {
        this.$refs.supervisesub.refresh();
        this.visible = true;
        this.eventId = e.eventId;
      },
      // 时间督办sure
      sure: function (r) {
        var token = window.localStorage.getItem('token');
        var url = UICore.serviceUrl
          + '/subsystem/businessStart/supervisionsubmit?'
          + 'eventId=' + this.eventId
          + '&handleType=' + r.handleType
          + '&news=' + r.news
          + '&message=' + r.message
          + '&comment=' + r.comment
          + '&token=' + token;
        // 提交JSON数据
        UICore.showLoading('督办中..', '请稍后...');
        api.ajax({
          url: url,
          method: 'post'
        }, function (ret, err) {
          api.hideProgress();
          if (ret) {
            if (ret.code == '201') {
              vm.refreshToken('sure', r);
            } else if (ret.success == true) {
              api.hideProgress();
              api.toast({
                msg: '督办成功',
                duration: 2000,
                location: 'bottom'
              });
              // 这里写重新渲染页面的方法
              vm.refresh = true;
              vm.page = 1;
              vm.loadList();
            }
          } else {
            api.alert({ msg: JSON.stringify(err) });
          }
        });
      },
      eventDetail: function (myEvent) {
        myEvent.myType = "approve";
        var _this = this;
        api.openWin({
          name: 'eventDetail',
          url: './eventDetail.html',
          vScrollBarEnabled: false,
          pageParam: {
            name: myEvent,
            type: _this.eventType
          }
        });
        api.addEventListener({
          name: 'submitEventSuccess'
        }, function (ret, err) {
          // _this.refresh = true;
          // _this.page = 1
          // _this.loadList();
          var myid = ret.value.key1;
          var tempArr = _this.eventList;
          for (var i = 0; i < _this.eventList.length; i++) {
            if (_this.eventList[i].id == myid) {
              tempArr.splice(i, 1);
              break;
            }
          }
          vm.$set(vm.$data, "eventList", tempArr);
        });
      }
    }
  });
}
