window.apiready = function () {
  var vm = new Vue({
    el: "#app",
    created: function () {
      var eventObj = api.pageParam.name;
      var eventType = api.pageParam.type;
      if (eventType && eventType == "notEnd") {
        this.isEdit = true;
      }
      this.eventTitle = eventObj.title;
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
        // this.getForm();
      }
    },
    data: {
      eventTitle: '',
      serialNum: '',
      emergency: '',
      accountId: '',
      wf_wfComments: '',
      id: '',
      isEdit: false,
      // 详情信息
      f: {},
      flows: {

      },
      videos:[],
      pics: [],
      show: {           //控制父组件和子组件部分DIV的显示和隐藏
        submitDiv: false,
        zcover: false,
        ev_next_step: false
      },
      steps: {       //下一步执行节点所有集合

      },
      alltag: {

      },
      // 附件
      attachIds: '',
      myshow: {
        bgshow: true,
        camerashow: true,
        videoshow: true
      },
      imgarray: {
        
      }
    },
    methods: {
      //预览图片
      openImg: function (url) {
        var imageBrowser = api.require('imageBrowser');
        imageBrowser.openImages({
          imageUrls: url,
          showList: false,
          activeIndex: 0,
          tapClose: true
        });
      },
      //预览视频,调用手机应用打开视频
      openVideo: function (videopath) {
        api.openVideo({
          url: videopath
        });
      },
      //显示附件选择DIV
      showItem: function (type) {
        if (type == 'video') {
          this.myshow.videoshow = true;
          this.myshow.bgshow = true;
        } else if (type == 'photo') {
          this.myshow.camerashow = true;
          this.myshow.bgshow = true;
        }
      },
      // 分类附件
      classEnclosure: function(str){
        if(str != ''){
          var arr = str.split(',');
          for(var i = 0, len = arr.length; i < len;i++){
            var url = arr[i];
            var attribute = url.substring(url.lastIndexOf('.') + 1, url.length);
            if(attribute === 'jpg'){
              this.pics.push(url);
            }else{
              this.videos.push(url)
            }
          }
        }
      },
      // 初始化加载详情数据
      loadFlow: function () {
        var _self = this;
        UICore.showLoading('加载中...', '稍等...');
        api.ajax({
          url: UICore.serviceUrlMock + 'pc_mobile/emergency_event/get_detail?id=' + this.id,
          method: 'get'
        }, function (ret, err) {
          if (ret) {
            _self.classEnclosure(ret.object.attachIds);
            vm.$set(vm.$data, "f", ret.object);
          }
          api.hideProgress();
        });
      },
      closeWin: function () {
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
        console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=editEvent_HZ&state=VIEW&loginId=' + this.accountId+'&accountId=' +this.accountId + '&workId=' + this.id);
        api.ajax({
          url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=editEvent_HZ&state=VIEW&loginId=' + this.accountId+'&accountId=' +this.accountId + '&workId=' + this.id,
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
        this.show.zcover = false;
        this.show.submitDiv = false;
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
              console.log(JSON.stringify(ret));
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
        UICore.showLoading('提交表单中...', '请稍等...');
        api.ajax({
          url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=submitEvent_HZ&accountId=' + this.accountId + '&workId=' + this.alltag.flowInstanceId + '&seclectId=' + this.alltag.selectId,
          method: 'post',
          tag: 'grid',
          data: {
            values: { "data": JSON.stringify(this.alltag) }
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
              api.closeWin();
            } else {
              alert(ret.ErrorInfo);
            }
          } else {
            api.alert({ msg: JSON.stringify(err) });
          }
        });
      },
    },
    components: {
      "flow-detail": {
        template: "#detail",
        props: ["myflow"],
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
                imgpaths: []
              }
            },
            methods: {
              openImg: function (pathtemp) {
                var imgindex = this.findIndex(this.imgpaths, pathtemp);
                var imageBrowser = api.require('imageBrowser');
                //imgpaths.push('http://192.168.2.198:5888/upload/withoutCode/20170109/00.jpg');
                imageBrowser.openImages({
                  imageUrls: this.imgpaths,
                  showList: false,
                  activeIndex: imgindex,
                  tapClose: true
                });
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
    },
    
  });
}
