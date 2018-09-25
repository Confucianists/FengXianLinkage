window.apiready = function () {
  var vm = new Vue({
    el: "#app",
    mixins: [upload],
    created: function () {
      var eventObj = api.pageParam.name;
      var eventType = api.pageParam.type;
      this.eventInfo=eventObj;
      if (eventType && eventType == "notEnd") {
        this.isEdit = true;
      }
      this.eventTitle = eventObj.eventTitle;
      this.serialNum = eventObj.serialNum;

      //this.emergency = eventObj.emergency;
      this.id = eventObj.id;

      var info = $api.getStorage('userinf');
      this.accountId = info.accountId;

      var setting = $api.getStorage('settingdata');
      var settingdata = JSON.parse(setting);
      for (var j = 0; j < settingdata.data.length; j++) {
        if ("emergency" == settingdata.data[j].parentKey && settingdata.data[j].extendAttributeKey == eventObj.emergency) {
          this.emergency = settingdata.data[j].extendAttributeValue;
        }
      }
      this.loadFlow();
      if (eventObj.myType == "approve") {
        this.getForm();
      }
    },
    data: {
      eventInfo:{},
      eventTitle: '',
      serialNum: '',
      emergency: '',
      accountId: '',
      wf_wfComments: '',
      id: '',
      isEdit: false,
      flows: {
      },
      show: {           //控制父组件和子组件部分DIV的显示和隐藏
        submitDiv: false,
        zcover: false,
        ev_next_step: false,
        routeDiv:false,
      },
      steps: {       //下一步执行节点所有集合

      },
      alltag: {

      },
      route_arr:[]
    },
    methods: {
      loadFlow: function () {
        var _self = this;
        console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=viewOpinion_HZ&workId=' + this.id);
        UICore.showLoading('加载中...', '稍等...');
        var url = UICore.serviceUrl + 'mobile/mobileWf.shtml?act=viewOpinion_HZ&workId=' + this.id;
        var url2 = 'http://61.160.70.170:18186/mobile/mobileWf.shtml?act=editEvent_HZ&state=VIEW&loginId=7a8a8f3947ed85e50147ed8bae0e0000&workId=HZ28825e63de63940163f36ffdca079a';
        api.ajax({
          url: url,
          tag: 'grid',
          method: 'get'
        }, function (ret, err) {
          // alert(JSON.stringify(ret));
          if (ret) {
            // for (var i = 0, len = ret.length; i++; i < len) {
            //   ret.
            // }
            // ret[0].attachList.push({
            //   uploadPath: 'http://61.160.70.170:18186/upload/withoutCode/20180620/20180620161853869.3gp'
            // });

            vm.$set(vm.$data, "flows", ret);
            // _self.isEdit = true;
          }
          api.hideProgress();
        });
      },
      closeWin: function () {
        api.sendEvent({
          name: 'backRefresh'
        });
        api.closeWin();
      },
      formDetail: function (id) {
        api.openWin({
          name: 'formDetail',
          url: './detailForm.html',
          vScrollBarEnabled: false,
          pageParam: {
            name: this.id
          }
        });

      },
      getForm: function () {
        console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=editEvent_HZ&state=VIEW&loginId=' + this.accountId + '&workId=' + this.id);
        api.ajax({
          url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=editEvent_HZ&state=VIEW&loginId=' + this.accountId + '&workId=' + this.id,
          tag: 'grid',
          method: 'get'
        }, function (ret, err) {
          if (ret) {
            var data = ret;
            for (var column in data) {
              if (data[column].column_label == "hidden") {
                if (data[column].column_name == "wf_flowInstanceId") {
                  //不能用this，此处this指向的是此回调函数
                  vm.$set(vm.alltag, "flowInstanceId", data[column].default_value);
                }
                if (data[column].column_name == "wf_activityId") {
                  vm.$set(vm.alltag, "activityId", data[column].default_value);
                }
                vm.$set(vm.alltag, data[column].column_name, data[column].default_value);
              } else {
                //var json = {default_value:data[column].default_value,is_not_null:data[column].is_not_null}
                vm.$set(vm.alltag, data[column].column_key, data[column].default_value);
              }
            }
            api.hideProgress();
          } else {
            alert(JSON.stringify(err));
          }
        });

      },
      subButtonClick: function () {
        this.show.zcover = true;
        this.show.submitDiv = true;

      },
      closeNextExecutor: function () {
        // this.show.zcover = false;
        // this.show.submitDiv = false;
        this.uploadAttaches()
      },
      uploadAttaches:function(){
        var self = this;
        this.uploadAttach(function (r) {
            self.selectOrsubmit();
        });
      },
      selectOrsubmit:function() {
          this.alltag.wf_eventId=this.eventInfo.eventId;
          var self = this;
          UICore.showLoading('加载中...', '请稍等...');
          this.alltag.wf_wfComments = this.wf_wfComments;
          console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=submitEvent_HZ&sign=submit&seclectId=&accountId=' + this.accountId + '&eventType=' + this.eventInfo.classifyId);
          api.ajax({
              url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=submitEvent_HZ&sign=submit&seclectId=&accountId=' + this.accountId + '&eventType=' + this.eventInfo.classifyId,
              method: 'post',
              tag: 'grid',
              data: {
                  values: {
                      "data": JSON.stringify(this.alltag)
                  }
              }
          }, function(ret, err) {
              api.hideProgress();
              if (ret) {
                // alert(JSON.stringify(ret))
                // alert(JSON.stringify(ret));
                  if (ret.success == "true") {
                      self.flag = ret.flag
                      self.route_arr = eval('(' + decodeURIComponent(ret.Data) + ')');
                      if (ret.flag == "1") {
                          self.alltag.chooseType = self.route_arr[0].chooseType;
                          self.show.routeDiv = true;
                          self.show.submitDiv = false;
                      } else if (ret.flag == "2") {
                          self.alltag.seclectId = self.route_arr[0].doSelectType;
                          self.jumpToPerson(-1);
                      } else {
                          api.toast({
                              msg: '上报成功',
                              duration: 2000,
                              global: 'true',
                              location: 'bottom'
                          });
                          self.closeWin();
                      }
                  }

              } else {
                  alert(JSON.stringify(err));
              }
          });
      },
      choose: function(item, index) {
          this.alltag.wf_nextActivityId = item.activityId;
          this.alltag.wf_nextActivityName = item.convertName;
          this.alltag.seclectId = item.doSelectType;
          this.jumpToPerson(index);
      },
      jumpToPerson: function(index) {
          var mycomponent = this;
          UICore.showLoading('获取中...', '请稍等...');
          console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=submitEvent_HZ&sign=submit&seclectId=' + this.alltag.seclectId + '&accountId=' + this.accountId + '&eventType=' + this.eventTypeId);
          api.ajax({
              url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=submitEvent_HZ&sign=submit&seclectId=' + this.alltag.seclectId + '&accountId=' + this.accountId + '&eventType=' + this.eventTypeId,
              tag: 'grid',
              method: 'post',
              data: {
                  values: {
                      "data": JSON.stringify(this.alltag)
                  }
              }
          }, function(ret, erra) {
              api.hideProgress();
              if (ret.success == "true") {
                  if (ret.flag == "3") {
                      api.toast({
                          msg: '上报成功',
                          duration: 2000,
                          global: 'true',
                          location: 'bottom'
                      });
                      mycomponent.closeWin();
                  } else {
                      var jsondata = eval('(' + decodeURIComponent(ret.Data) + ')');
                      // alert(jsondata[0].chooseType);
                      mycomponent.isPerson = jsondata[0].personList.length > 0;
                      mycomponent.isDept = jsondata[0].deptList.length > 0;
                      api.openWin({
                          name: 'choose_person',
                          url: './choose_person.html',
                          pageParam: {
                              name: ret,
                              index: index
                          }
                      });
                  }

              } else {
                  alert(ret.ErrorInfo);
              }
              //监听选择人员页面点击人员后触发
              api.addEventListener({
                  name: 'personClick'
              }, function(ret, err) {
                  mycomponent.alltag.wf_nextExecutorId = ret.value.key1;
                  mycomponent.alltag.wf_nextExecutor = ret.value.key2;
                  mycomponent.alltag.chooseType = ret.value.chooseType;
                  // mycomponent.show.submitDiv = false;
                  // mycomponent.alltag.wf_nextExecutorId = ret.value.key1;
                  // mycomponent.alltag.wf_nextExecutor = ret.value.key2;
                  //mycomponent.submitForm();
                  // mycomponent.uploadAttach();

                  mycomponent.submitFormNew();
              });
          });
      },
      submitFormNew:function(){
        var _this = this;
        UICore.showLoading('提交表单中...', '请稍等...');
        this.alltag.wf_wfComments = this.wf_wfComments;
        this.alltag.wf_status = 'EDIT';
        console.log(JSON.stringify(this.alltag));
        var url = '';
        if (this.isDept) {
          url = UICore.serviceUrl + 'mobile/mobileWf.shtml?act=submitEvent_HZ&sign=submitOrgs&accountId=' + _this.accountId + '&workId=' + _this.alltag.flowInstanceId + '&seclectId=' + _this.alltag.seclectId;
        } else {
          url = UICore.serviceUrl + 'mobile/mobileWf.shtml?act=submitEvent_HZ&sign=submit&accountId=' + _this.accountId + '&workId=' + _this.alltag.flowInstanceId + '&seclectId=' + _this.alltag.seclectId;
        }
        // alert(url);
        api.ajax({
          url:url,
          method: 'post',
          tag: 'grid',
          data: {
            values: { "data": JSON.stringify(_this.alltag) }
          }
        }, function (ret, err) {
          api.hideProgress();

          if (ret) {
            if (ret.success == "true") {
              api.toast({
                msg: '上报成功',
                duration: 2000,
                global: 'true',
                location: 'bottom'
              });
              api.sendEvent({
                name: 'submitEventSuccess',
                extra: {
                  key1: _this.id,
                }
              });
              _this.closeWin();
            } else {
              _this.alltag.wf_nextExecutorId = "";
              _this.alltag.wf_nextExecutor = "";
              alert(ret.ErrorInfo);
            }
          } else {
            _this.alltag.wf_nextExecutorId = "";
            _this.alltag.wf_nextExecutor = "";
            api.alert({ msg: JSON.stringify(err) });
          }
        });
      },
      closeNextStep: function () {
        this.show.zcover = false;
        this.show.ev_next_step = false;
      },
      //点击下一步执行人
      nextExecutorClick: function () {
        var mycomponent = this;
        UICore.showLoading('获取节点中...', '请稍等...');
        console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=getActivitySelect_HZ&state=isEdit&accountId=' + this.accountId + '&workId=' + this.id);
        api.ajax({
          url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=getActivitySelect_HZ&state=isEdit&accountId=' + this.accountId + '&workId=' + this.id,
          method: 'get',
          tag: 'grid'
        }, function (ret, err) {
          api.hideProgress();
          if (ret) {
            mycomponent.steps = ret;
            console.log(JSON.stringify(mycomponent.steps));
          } else {
            alert(JSON.stringify(err));
          }
        });
        this.show.submitDiv = false;
        this.show.ev_next_step = true;
      },
      //点击一个节点触发
      selectPerson: function (activityId, doSelectType) {
        this.alltag.wf_nextActivityId = activityId;
        this.alltag.selectId = doSelectType;
        if (activityId.indexOf("End") > -1) {
          this.show.ev_next_step = false;
          this.show.zcover = false;
          this.submitForm();
        } else {
          var mycomponent = this;
          UICore.showLoading('获取人员中...', '请稍等...');
          api.ajax({
            url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=selectActorsTree_HZ&state=isNew&nodeId=' + activityId + '&accountId=' + this.accountId + '&workId=' + this.id + '&seclectId=' + doSelectType,
            tag: 'grid',
            method: 'get'
          }, function (ret, erra) {
            api.hideProgress();
            //监听选择人员页面点击人员后触发
            api.addEventListener({
              name: 'personClick'
            }, function (ret, err) {
              mycomponent.show.ev_next_step = false;
              mycomponent.show.zcover = false;
              mycomponent.alltag.wf_nextExecutorId = ret.value.key1;
              mycomponent.alltag.wf_nextExecutor = ret.value.key2;
              mycomponent.submitForm();
              //mycomponent.uploadAttach();
            });
            api.openWin({
              name: 'choose_person',
              url: './choose_person.html',
              pageParam: {
                name: ret
              }
            });

          });
        }

      },
      //提交表单
      submitForm: function () {
        this.alltag.wf_wfComments = this.wf_wfComments;
        this.alltag.wf_status = 'EDIT';
        var _this = this;
        console.log(JSON.stringify(this.alltag));
        this.uploadAttach(function (r) {
          // alert(r.data);
          UICore.showLoading('提交表单中...', '请稍等...');
          api.ajax({
            url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=submitEvent_HZ&accountId=' + _this.accountId + '&workId=' + _this.alltag.flowInstanceId + '&seclectId=' + _this.alltag.selectId,
            method: 'post',
            tag: 'grid',
            data: {
              values: { "data": JSON.stringify(_this.alltag) }
            }
          }, function (ret, err) {
            api.hideProgress();
            if (ret) {
              if (ret.success == true) {
                api.toast({
                  msg: '上报成功',
                  duration: 2000,
                  global: 'true',
                  location: 'bottom'
                });
                api.sendEvent({
                  name: 'submitEventSuccess',
                  extra: {
                    key1: _this.id,
                  }
                });
                _this.closeWin();
              } else {
                alert(ret.ErrorInfo);
              }
            } else {
              api.alert({ msg: JSON.stringify(err) });
            }
          });
        });
      },
    },
    components: {
      "flow-detail": {
        template: "#detail",
        props: ["myflow"],
        data: function () {
          return {
            UICore: {
              serviceUrl: UICore.serviceUrl
            }
          }
        },
        components: {
          "flow-person": {
            template: "#person",
            props: ["myflow"]
          },
          "flow-content": {
            template: "#content",
            props: ["myflow"],
            data: function () {
              return {
                imgpaths: [],
                UICore: {
                  serviceUrl: UICore.serviceUrl
                }
              }
            },
            methods: {
              openImg: function (pathtemp) {
                var attribute = pathtemp.substring(pathtemp.lastIndexOf('.') + 1, pathtemp.length);
                if (attribute === 'jpg' || attribute === 'png' || attribute === 'webp' || attribute === 'jpeg' || attribute === "gif" || attribute === 'bmp') {
                  var imgindex = this.findIndex(this.imgpaths, pathtemp);
                  var imageBrowser = api.require('imageBrowser');
                  //imgpaths.push('http://192.168.2.198:5888/upload/withoutCode/20170109/00.jpg');
                  imageBrowser.openImages({
                    imageUrls: this.imgpaths,
                    showList: false,
                    activeIndex: imgindex,
                    tapClose: true
                  });
                } else {
                  api.openVideo({
                    url: pathtemp
                  });
                }
              },
              getSrc: function (pathtemp) {
                var attribute = pathtemp.substring(pathtemp.lastIndexOf('.') + 1, pathtemp.length);
                if (attribute === 'jpg' || attribute === 'png' || attribute === 'webp' || attribute === 'jpeg' || attribute === "gif" || attribute === 'bmp') {
                  return pathtemp;
                } else {
                  return '../../image/video.jpg';
                }
              },
              findIndex: function (arr, val) {
                for (var i = 0; i < arr.length; i++) {
                  if (arr[i] == val) {
                    return i;
                    break;
                  }
                }
              }
            },
            directives: {
              imgpath: {
                bind: function (el, binding, vnode) {
                  vnode.context.imgpaths.push(binding.value)
                }
              }
            }
          }
        }
      }
    }
  });
}
