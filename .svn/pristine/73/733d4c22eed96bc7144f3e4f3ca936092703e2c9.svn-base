window.apiready = function () {
  var vm = new Vue({
    el: "#no_end_all",
    created: function () {
      var info = $api.getStorage('userinf');
      this.accountId = info.accountId;
      this.source = api.pageParam.source;
      var eventTitle = api.pageParam.eventTitle;
      this.eventType = api.pageParam.eventType;
      if (eventTitle != null && eventTitle != '' && eventTitle != undefined) {
        this.searchParam = '&keyword=' + eventTitle
      }
      UICore.showLoading('加载中...', '稍等...');
      this.loadList();
    },
    mounted: function () {
      this.refreshHeader();
      this.loadNext();
    },
    data: {
      eventList: {
      },
      accountId: "",
      source: '',
      page: 1,
      rows: 15,
      totalPage: 0,
      refresh: false,
      showAll: false,
      searchParam: '',
      eventType: ''
    },
    methods: {
      loadList: function () {
        var url = "";
        // this.accountId = '1001001';
        // alert(this.eventType);
        if (this.source == "应急处理") {
          // alert('应急处理');
          url = UICore.serviceUrlMock + 'pc_mobile/approve_event/list_event_todo?act=todoEventList_HZ&accountId=' + this.accountId + '&pageIndex=' + this.page + '&pageSize=' + this.rows + this.searchParam
        } else if (this.source == "应急结案") {
          // alert('应急结案');
          url = UICore.serviceUrlMock + 'pc_mobile/approve_event/list_event_over?act=todoEventList_HZ&accountId=' + this.accountId + '&pageIndex=' + this.page + '&pageSize=' + this.rows + this.searchParam
        }else if (this.source == "事件公示") {
          // alert('应急结案');
          url = UICore.serviceUrlMock + 'pc_mobile/emergency_event/list_all?act=todoEventList_HZ&accountId=' + this.accountId + '&pageIndex=' + this.page + '&pageSize=' + this.rows + this.searchParam
        }
        api.ajax({
          url: url,
          // tag : 'grid',
          method: 'post'
        }, function (ret, err) {
          // alert(JSON.stringify(ret));

          if (vm.refresh) {
            api.refreshHeaderLoadDone();
          }
          api.hideProgress();
          if (ret) {
            vm.totalPage = Math.ceil(ret.pageInfo.totalCount / vm.rows);//总页数;
            if (vm.totalPage == vm.page) {
              vm.showAll = true;
            } else {
              vm.showAll = false;
            }
            if (ret.list.length > 0) {
              var eventObj = ret.list;
              if (vm.eventList.length > 0 && !vm.refresh) {
                eventObj = vm.eventList.concat(eventObj);
              }
              // alert(JSON.stringify(eventObj));
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
      eventDetail: function (myEvent) {
        myEvent.myType = "approve";
        var _this = this;
        api.openWin({
          name: 'eventDetail',
          url: './eventDetail.html',
          vScrollBarEnabled: false,
          pageParam: {
            name: myEvent,
            source: _this.source,
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
    },
    components: {
      "eventlist": {
        template: "#listTemplate",
        props: ["eventobj"]
      }
    }
  });
}
