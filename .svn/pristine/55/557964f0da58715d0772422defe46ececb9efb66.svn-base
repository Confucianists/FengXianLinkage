var selectData = {};
window.apiready = function () {
  UICore.showLoading('加载表单中...', '请稍等...');

  var vm = new Vue({
    el: "#app",
    created: function () { //VUE创建后执行，数据创建成功，页面渲染之前
      var eventObj = api.pageParam.name;
      var eventType = api.pageParam.type;
      this.source = api.pageParam.source;
      if (eventType && eventType == "notEnd") {
        this.isEdit = true;
      }
      this.eventTitle = eventObj.title;
      this.serialNum = eventObj.serialNum;
      //this.emergency = eventObj.emergency;
      this.id = eventObj.id;
      var info = $api.getStorage('userinf');
      // info.accountId = '1001001';
      // alert(JSON.stringify(info));
      this.accountId = info.accountId;
      this.eventUpPersonId = info.accountId;
      this.eventUpPersonName = info.accountName;
      this.f.approvePersonId = info.accountId;
      this.f.approvePersonName = info.accountName;
      this.f.emergencyEventId = eventObj.id;
      // 获取数据字典的配置文件
      this.settingFile();
      this.getLocation();
      // 查询事件详情
      this.loadFlow();
      // 查询部门详情
      this.getDepartmentsMsg();
    },
    mounted: function () { //VUE渲染成功后执行
      //document.getElementById("app").style.display = 'block';
      //this.$refs.app
    },
    data: {
      // 部门意见事件列表
      departmentList: [],
      eventTitle: '',
      serialNum: '',
      isEdit: '',
      source: '',
      f2: {},
      show2: { //控制父组件和子组件部分DIV的显示和隐藏
        camerashow: false,
        videoshow: false,
        bgshow: false,
        submitDiv: false,
        zcover: false,
        ev_next_step: false
      },
      imgarr2: {
        imgpaths: [], //图片地址存放数组
        videopaths: [], //视频地址存放数组
        imgnum: 0, //图片全局索引
        videonum: 0 //视频全局索引
      },
      // 应急事件的配置
      f: {
        // 审批部门
        approveDepartment: '',
        // 审批人员姓名
        approvePersonName: '',
        // 审批人员主键
        approvePersonId: '',
        // 审批意见
        approveMsg: '',
        // 事件审批状态（1：代办  2：办结）
        approveStatus: '1',
        // 审批审批来源（1：pc端  2：手机端）
        approveResource: '2',
        // 应急事件主键
        emergencyEventId: '',
        // 附件
        attachIds: '',
        myshow: {
          bgshow: true,
          camerashow: true,
          videoshow: true
        },
        imgarray: {}
      },
      flowId: "",
      eventTypeId: "",
      formdata: {}, //表单数据存放属性
      settingdata: {}, //配置文件存放属性
      accountId: '',
      show: { //控制父组件和子组件部分DIV的显示和隐藏
        camerashow: false,
        videoshow: false,
        bgshow: false,
        submitDiv: false,
        zcover: false,
        ev_next_step: false
      },
      imgarr: {
        imgpaths: [], //图片地址存放数组
        videopaths: [], //视频地址存放数组
        imgnum: 0, //图片全局索引
        videonum: 0 //视频全局索引
      },
      alltag: { //动态表单所有元素和部分接口用到的参数存放处，事件提交传此属性
      },
      locationKey: "",
      locationName: "",
      steps: { //下一步执行节点所有集合

      }
    },
    methods: {
      showflag: function (index) {
        this.departmentList[index].flag = !this.departmentList[index].flag;
      },
      // 删减内容
      reduceMsg: function (approveMsg) {
        if (approveMsg.length > 6) {
          return approveMsg.substring(0, 5) + '…'
        } else {
          return approveMsg;
        }
      },
      // 获取部门意见
      getDepartmentsMsg: function () {
        var _self = this;
        api.ajax({
          url: UICore.serviceUrlMock + 'pc_mobile/approve_event/list_approve_event_details?eventId=' + this.id,
          method: 'post'
        }, function (ret, err) {
          // alert(JSON.stringify(ret));
          if (ret && ret.list.length > 0) {
            // _self.classEnclosure(ret.object.attachIds);
            for (var i = 0, len = ret.list.length; i < len; i++) {
              var imgarr = {
                imgpaths: [], //图片地址存放数组
                videopaths: [], //视频地址存放数组
                imgnum: 0, //图片全局索引
                videonum: 0 //视频全局索引
              };
              var str = ret.list[i].attachAddress;
              if (str != '') {
                var arr = str.split(',');
                // alert(JSON.stringify(arr))
                for (var j = 0, lens = arr.length; j < lens; j++) {
                  var url = arr[j];
                  if (url.length > 0) {
                    var attribute = url.substring(url.lastIndexOf('.') + 1, url.length);
                    if (attribute === 'jpg' || attribute === 'png' || attribute === 'webp' || attribute === 'jpeg' || attribute === "gif" || attribute === 'bmp') {
                      imgarr.imgpaths.push(UICore.serviceUrlMock + url);
                    } else {
                      imgarr.videopaths.push(UICore.serviceUrlMock + url);
                    }
                  }
                }
                // alert(JSON.stringify(this.imgarr2))
              }
              ret.list[i].show2 = { //控制父组件和子组件部分DIV的显示和隐藏
                camerashow: false,
                videoshow: false,
                bgshow: false,
                submitDiv: false,
                zcover: false,
                ev_next_step: false
              };
              ret.list[i].imgarr = imgarr;
              ret.list[i].flag = false;
            }
            vm.$set(vm.$data, "departmentList", ret.list);
          }
        });
      },
      // 分类附件
      classEnclosure: function (str) {
        if (str != '') {
          var arr = str.split(',');
          // alert(JSON.stringify(arr))
          for (var i = 0, len = arr.length; i < len; i++) {
            var url = arr[i];
            if (url.length > 0) {
              var attribute = url.substring(url.lastIndexOf('.') + 1, url.length);
              if (attribute === 'jpg' || attribute === 'png' || attribute === 'webp' || attribute === 'jpeg' || attribute === "gif" || attribute === 'bmp') {
                // alert(UICore.serviceUrlMock + url);
                this.imgarr2.imgpaths.push(UICore.serviceUrlMock + url);
              } else {
                // alert(UICore.serviceUrlMock + url);
                this.imgarr2.videopaths.push(UICore.serviceUrlMock + url);
              }
            }

          }
          // alert(JSON.stringify(this.imgarr2))
        }
      },
      // 初始化加载详情数据
      loadFlow: function () {
        var _self = this;
        UICore.showLoading('加载中...', '稍等...');
        api.ajax({
          url: UICore.serviceUrlMock + 'pc_mobile/emergency_event/get_detail?id=' + this.id,
          method: 'post'
        }, function (ret, err) {
          if (ret) {
            _self.classEnclosure(ret.object.attachAddress);
            vm.$set(vm.$data, "f2", ret.object);
          }
          api.hideProgress();
        });
      },
      getLocation: function () {
        var _self = this;
        var baiduLocation = api.require('baiduLocation');
        baiduLocation.startLocation({
          accuracy: '10m',
          filter: 5,
          autoStop: true,
        }, function (ret, err) {
          if (ret.status) {
            console.log("location GPS:  " + JSON.stringify(ret));

            var latitude = ret.latitude;// 纬度，浮点数，范围为90 ~ -90
            var longitude = ret.longitude// 经度，浮点数，范围为180 ~ -180。
            var accuracy = ret.accuracy;// 位置精度
            // var gcj02 = bd09togcj02(longitude,latitude);
            // var wgs84 = gcj02towgs84(gcj02[0],gcj02[1]);
            // var url_ = new SnCal().getAddrByLatLonUrl(wgs84[1], wgs84[0]);
            // doGetByloadScript(url_);
            var coordTran2 = new Transformation2(45, 45, 49);
            var myxy = coordTran2.bd09towgs84(longitude, latitude)
            console.log(JSON.stringify(myxy));
            var loc = coordTran2.WGS842OCN(myxy.x, myxy.y);
            _self.f.xy = loc.x + "," + loc.y;
            _self.f.x = loc.x;
            _self.f.y = loc.y;
            // _self.alltag[_self.locationKey] = loc.x + "," + loc.y;
            _self.getAddressName(latitude + "," + longitude);
          } else {
            alert("定位失败");
          }
        });
      },
      getAddressName: function (mylocation) {
        var _self = this;
        api.ajax({
          url: 'http://api.map.baidu.com/geocoder/v2/',
          method: 'get',
          data: {
            values: {
              location: mylocation,
              output: 'json',
              ak: "4eb424fae9e47fe4549f4846791df8b6"
            }
          }
        }, function (ret, err) {
          if (ret && ret.result) {
            _self.locationName = ret.result.formatted_address;
            _self.f.eventHappenAddress = ret.result.formatted_address;
            //_self.$refs.addressName[0].value = ret.result.formatted_address;
          } else {
            api.alert({
              msg: JSON.stringify(err)
            });
          }
        });
      },
      //获取配置文件 传说中的数据字典吗？
      settingFile: function () {
        selectData = JSON.parse($api.getStorage('settingdata'));
      },
      //点击提交按钮
      subButtonClick: function () {
        // 先判断有没有 gridId， 再判断dataAreaCode 存在且为15位
        // gridId=8abfb0286067555901608637756c38e1
        // dataAreaCode=610402001015001
        if(this.imgarr2.imgpaths.length<2){
          alert('必须上传至少两张图片');
          return false;
        }
        // alert(JSON.stringify(this.imgarr2));
        // // this.uploadAttach();
        if (this.f.approveMsg == '') {
          alert('审批意见没有填写。');
          return false;
        }
        // if (this.f.content == '') {
        //   alert('应急事件内容没有填写。');
        //   return false;
        // }
        // if (this.f.eventGrade == '') {
        //   alert('应急事件等级没有选择。');
        //   return false;
        // }
        // if (this.f.eventGrade == '') {
        //   alert('应急事件等级没有选择。');
        //   return false;
        // }
        // if (this.f.msgPush == '') {
        //   alert('请选择是否进行短信推送');
        //   return false;
        // }
        // if (this.f.eventHappenTime == '') {
        //   alert('请选择上报时间');
        //   return false;
        // }
        // if (this.f.endShow == '') {
        //   alert('请选择结束后是否公示');
        //   return false;
        // }
        var _self = this;
        this.uploadAttach(function (list) {
          if (list.length > 0) {
            for (var i = 0, len = list.length; i < len; i++) {
              _self.f.attachIds = _self.f.attachIds + ',' + list[i].id;
            }
            _self.submitForm();
          } else {
            _self.submitForm();
          }
        })
        // this.show.zcover = true;
        // this.show.submitDiv = true;

      },
      //提交表单
      submitForm: function () {

        // alert(JSON.stringify(this.f));
        UICore.showLoading('提交表单中...', '请稍等...');
        api.ajax({
          url: UICore.serviceUrl + 'pc_mobile/approve_event/edit',
          method: 'post',
          tag: 'grid',
          data: {
            values: {
              approvePersonId: this.f.approvePersonId,
              approvePersonName: this.f.approvePersonName,
              approveMsg: this.f.approveMsg,
              approveStatus: this.f.approveStatus,
              approveResource: this.f.approveResource,
              emergencyEventId: this.f.emergencyEventId,
              attachIds: this.f.attachIds
            }
          }
        }, function (ret, err) {
          api.hideProgress();
          if (ret) {
            if (ret.success == true) {
              api.toast({
                msg: '审批成功',
                duration: 2000,
                global: 'true',
                location: 'bottom'
              });
              api.closeWin();
            } else {
              alert(ret.ErrorInfo);
            }
          } else {
            api.toast({
              msg: '审批失败',
              duration: 2000,
              global: 'true',
              location: 'bottom'
            });
            api.closeWin();
          }
        });
      },
      //打开事件组件
      openTime: function (column_key) {
        var defaultTime = this.alltag[column_key];
        UICore.openTime(this, column_key, defaultTime)
      },
      // 事件发生地点
      openEmergencyMap: function () {
        return false;
        mapcontainer.style.display = "block";
        mapload();
        var _this = this;
        api.addEventListener({
          name: 'mapSelect'
        }, function (ret, err) {
          console.log(JSON.stringify(ret));
          // alert(ret.value.coordinate);
          api.ajax({
            url: 'http://api.map.baidu.com/geocoder/v2/',
            method: 'get',
            data: {
              values: {
                location: ret.value.wgs84location,
                coordtype: 'wgs84ll',
                output: 'json',
                ak: "4eb424fae9e47fe4549f4846791df8b6"
              }
            }
          }, function (ret, err) {
            if (ret && ret.result) {
              _this.$refs.addressName[0].value = ret.result.formatted_address;
            } else {
              api.alert({
                msg: JSON.stringify(err)
              });
            }
          });
        });
      },
      //事件发生时间
      openEmergencyTime: function () {
        var _self = this;
        UICore.openTime(null, null, null, function (date) {
          _self.f.eventHappenTime = date;
        });
      },
      // 打开应急事件等级
      openSelectEmergencyLevel: function () {
        var key = 'emergency';
        var _self = this;
        var itemArray = [];
        for (var j = 0; j < selectData.data.length; j++) {
          if (key == selectData.data[j].parentKey) {
            itemArray.push({
              text: selectData.data[j].extendAttributeValue,
              status: 'normal',
              key: selectData.data[j].extendAttributeKey
            });
          }
        }
        if (_self.f.eventGrade != null && _self.f.eventGrade != "" && _self.f.eventGrade != undefined) {
          for (var item in itemArray) {
            if (itemArray[item].key == _self.f.eventGrade) {
              itemArray[item].status = 'selected';
            }
          }
        }
        // console.log(this.alltag[column_key]);
        UICore.openSelect(itemArray, null, null, null, null, function (arr) {
          _self.f.eventGrade = arr.key;
          _self.f.eventGradeName = arr.text;
          _self.getDepartments(arr.key);
        });
      },
      //是否需要短信推送？
      openSelectMessage: function () {
        var itemArray = this.f.isSendMessage;
        var _self = this;
        UICore.openSelect(itemArray, null, null, null, null, function (arr) {
          _self.f.msgPush = arr.key;
          _self.f.msgStr = arr.text;
          if (_self.f.msgPush != null && _self.f.msgPush != "" && _self.f.msgPush != undefined) {
            for (var item in _self.f.isSendMessage) {
              if (_self.f.isSendMessage[item].key == _self.f.msgPush) {
                _self.f.isSendMessage[item].status = 'selected';
              }
            }
          }
        });
      },
      // 结束后是否需要公示？
      openSelectEndShow: function () {
        // endShow: '',
        // endShowStr: '',
        // isEndShow
        var itemArray = this.f.isEndShow;
        var _self = this;
        UICore.openSelect(itemArray, null, null, null, null, function (arr) {
          _self.f.endShow = arr.key;
          _self.f.endShowStr = arr.text;
          if (_self.f.endShow != null && _self.f.endShow != "" && _self.f.endShow != undefined) {
            for (var item in _self.f.isEndShow) {
              if (_self.f.isEndShow[item].key == _self.f.endShow) {
                _self.f.isEndShow[item].status = 'selected';
              }
            }
          }
        });
      },
      // 查询需要开发通知的部门
      getDepartments: function (grade) {
        var _self = this;
        api.ajax({
          url: UICore.serviceUrlMock + 'pc_mobile/plan_manage/list_departments?grade=' + grade,
          method: 'get'
        }, function (ret, err) {
          // alert(JSON.stringify(ret));
          if (ret.list && ret.list.length > 0) {
            for (var i = 0, len = ret.list.length; i < len; i++) {
              ret.list[i].text = ret.list[i].name;
              ret.list[i].status = 'normal';
              ret.list[i].key = ret.list[i].id;
            }
            var itemArray = ret.list;
            _self.f.departmentArray = itemArray;
            _self.f.noticeDepartmentStr = '';
            _self.f.noticeDepartment = '';
          } else {
            alert('部门数据获取失败');
          }
        });
      },
      // 打开需要通知的部门
      openCheckBoxDepartments: function (obj, english_name, column_key) {
        var vm = this;
        var arr = this.f.departmentArray;
        if (arr.length > 0) {
          UICore.openCheckBox(arr, null, "", null, null, function (rStr, rArr) {
            vm.f.noticeDepartmentStr = rStr.text;
            // alert(JSON.stringify(rStr));
            // alert(JSON.stringify(rArr));
            for (var i = 0, len = rArr.length; i < len; i++) {
              for (var j = 0, lens = vm.f.departmentArray.length; j < lens; j++) {
                // alert('rArr[i].key => ' + rArr[i].key + '||' + 'vm.f.departmentArray[j].key => ' + vm.f.departmentArray[j].key);
                if (rArr[i].key == vm.f.departmentArray[j].key) {
                  vm.f.departmentArray[j].status = 'selected';
                }
              }
            }
          });
        } else {
          api.alert({
            msg: '请先选择应急事件等级'
          });
        }

      },
      //打开下拉框（单选）
      openSelect: function (obj, english_name, column_key) {

        //用$refs获取组件中的DOM元素
        var selectVal = this.$refs[english_name][0].key;
        alert(english_name);
        var itemArray = [];
        for (var j = 0; j < selectData.data.length; j++) {
          if (english_name == selectData.data[j].parentKey) {
            itemArray.push({
              text: selectData.data[j].extendAttributeValue,
              status: 'normal',
              key: selectData.data[j].extendAttributeKey
            });
          }
        }
        if (selectVal != null && selectVal != "" && selectVal != undefined) {
          for (var item in itemArray) {
            if (itemArray[item].key == selectVal) {
              itemArray[item].status = 'selected';
            }
          }
        }
        console.log(this.alltag[column_key]);
        // alert(JSON.stringify(itemArray));

        UICore.openSelect(itemArray, this.$refs[english_name][0], "", this.alltag, column_key)
      },
      //打开下拉框（多选）
      openCheckBox: function (obj, english_name, column_key) {
        var selectVal = this.$refs[english_name][0].key;
        var itemArray = [];
        for (var j = 0; j < selectData.data.length; j++) {
          if (english_name == selectData.data[j].parentKey) {
            itemArray.push({
              text: selectData.data[j].extendAttributeValue,
              status: 'normal',
              key: selectData.data[j].extendAttributeKey
            });
          }
        }
        if (selectVal != null && selectVal != "" && selectVal != undefined) {
          var selectArr = selectVal.split(",")
          for (var item in itemArray) {
            for (var select in selectArr) {
              if (itemArray[item].key == selectArr[select]) {
                itemArray[item].status = 'selected';
              }
            }
          }
        }
        UICore.openCheckBox(itemArray, this.$refs[english_name][0], "", this.alltag, column_key);
      },
      openMap: function (column_key) {
        return false;
        mapcontainer.style.display = "block";
        mapload();
        var _this = this;
        api.addEventListener({
          name: 'mapSelect'
        }, function (ret, err) {
          console.log(JSON.stringify(ret));
          _this.alltag[column_key] = ret.value.coordinate;
          api.ajax({
            url: 'http://api.map.baidu.com/geocoder/v2/',
            method: 'get',
            data: {
              values: {
                location: ret.value.wgs84location,
                coordtype: 'wgs84ll',
                output: 'json',
                ak: "4eb424fae9e47fe4549f4846791df8b6"
              }
            }
          }, function (ret, err) {
            if (ret && ret.result) {
              _this.$refs.addressName[0].value = ret.result.formatted_address;
            } else {
              api.alert({
                msg: JSON.stringify(err)
              });
            }
          });
        });
      },
      closeSubmitDiv: function () {
        this.show.submitDiv = false;
        this.show.ev_next_step = false;
      },
      //点击下一步执行人
      nextExecutorClick: function () {
        var mycomponent = this;
        UICore.showLoading('获取节点中...', '请稍等...');
        console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=getActivitySelect_HZ&state=isNew&accountId=' + this.accountId + '&workId=' + this.alltag.flowInstanceId);
        api.ajax({
          url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=getActivitySelect_HZ&state=isNew&accountId=' + this.accountId + '&workId=' + this.alltag.flowInstanceId,
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
        var mycomponent = this;
        UICore.showLoading('获取人员中...', '请稍等...');
        console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=selectActorsTree_HZ&state=isNew&nodeId=' + activityId + '&accountId=' + this.accountId + '&workId=' + this.alltag.flowInstanceId + '&seclectId=' + doSelectType);
        api.ajax({
          url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=selectActorsTree_HZ&state=isNew&nodeId=' + activityId + '&accountId=' + this.accountId + '&workId=' + this.alltag.flowInstanceId + '&seclectId=' + doSelectType,
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
            //mycomponent.submitForm();
            mycomponent.uploadAttach();
          });
          api.openWin({
            name: 'choose_person',
            url: './choose_person.html',
            pageParam: {
              name: ret
            }
          });

        });
      },
      //上传附件
      uploadAttach: function (cb) {
        var imgpaths = this.imgarr.imgpaths.concat(this.imgarr.videopaths);
        // var mycomponent = this;
        // alert(imgpaths);
        if (imgpaths.length > 0) {
          UICore.showLoading('上传附件中...', '稍等...');
          api.ajax({
            url: UICore.serviceUrl + 'pc_mobile/emergency_event/emergency_upload_attach?act=uploadAttach_HZ&loginId=' + this.accountId + '&accountName=' + this.f.approvePersonName + '&workId=' + this.alltag.flowInstanceId + '&nodeId=' + this.alltag.activityId,
            method: 'post',
            tag: 'grid',
            data: {
              files: {
                file: imgpaths
              }
            }
          }, function (ret, err) {
            // alert(JSON.stringify(ret));
            if (ret) {
              if (ret.success == true) {
                cb && cb(ret.list);
              } else {
                api.hideProgress();
                api.alert({
                  msg: JSON.stringify(err)
                });
              }
            } else {
              api.hideProgress();
              api.alert({
                msg: JSON.stringify(err)
              });
            }
          });
        } else {
          cb && cb([]);
        }
      },
      closeWin: function () {
        api.closeWin();
      }
    },
    //模板组件
    components: {
      //附件上传组件
      'attach-comp': {
        template: "#attach-template",
        props: ['myshow', 'imgarray', 'flag'], //一个指向父组件中的show，一个指向父组件中的imgarr,必须指向含有子属性的值，VUE2.0子组件只能修改父组件属性中的子属性值
        data: function () {
          return {
            imgtemps: [] //图片地址临时存放，为了选择多个图片时候一起显示出来，因为要递归压缩图片，如果不存，会一张一张的显示图片
          }
        },
        methods: {
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
          //关闭附件选择DIV
          closeItem: function () {
            this.myshow.videoshow = false;
            this.myshow.camerashow = false;
            this.myshow.bgshow = false;
          },
          //拍照
          camera_img: function () {
            this.closeItem();
            var mycomponent = this;
            var imageFilter = api.require('imageFilter');
            api.getPicture({
              sourceType: 'camera',
              encodingType: 'jpg',
              mediaValue: 'pic',
              destinationType: 'url',
              allowEdit: true,
              quality: 50,
              saveToPhotoAlbum: false
            }, function (ret, err) {
              if (ret) {
                var imgpath = ret.data;
                if (imgpath != "") {
                  imageFilter.getAttr({
                    path: imgpath
                  }, function (ret, err) {
                    if (ret.status) {
                      var tempwidth = ret.width;
                      var tempheight = ret.height;
                      var bili = tempwidth / tempheight;
                      var height = 1200;
                      var width = height * bili;
                      //图片压缩
                      imageFilter.compress({
                        img: imgpath,
                        quality: 1,
                        size: {
                          w: width,
                          h: height
                        },
                        save: {
                          album: false,
                          imgPath: "fs://test/",
                          imgName: '0' + mycomponent.imgarray.imgnum + '.jpg'
                        }
                      }, function (ret, err) {
                        if (ret.status) {
                          var pathtemp = api.fsDir + "/test/0" + mycomponent.imgarray.imgnum + ".jpg";
                          mycomponent.imgarray.imgpaths.push(pathtemp);
                          mycomponent.imgarray.imgnum++;
                        } else {
                          alert(JSON.stringify(err));
                        }
                      });
                    } else {
                      alert(JSON.stringify(err));
                    }
                  });
                }

              } else {
                alert(JSON.stringify(err));
              }
            });
          },
          //选择相册中的图片
          getImg: function () {
            this.closeItem();
            this.imgtemps = [];
            var mycomponent = this;
            var imageFilter = api.require('imageFilter');
            var UIMediaScanner = api.require('UIMediaScanner');
            UIMediaScanner.open({
              type: 'picture',
              column: 4,
              classify: true,
              max: 4,
              sort: {
                key: 'time',
                order: 'desc'
              },
              texts: {
                stateText: '已选择*项',
                cancelText: '取消',
                finishText: '完成'
              },
              styles: {
                bg: '#fff',
                mark: {
                  icon: '',
                  position: 'bottom_left',
                  size: 20
                },
                nav: {
                  bg: '#eee',
                  stateColor: '#000',
                  stateSize: 18,
                  cancelBg: 'rgba(0,0,0,0)',
                  cancelColor: '#000',
                  cancelSize: 18,
                  finishBg: 'rgba(0,0,0,0)',
                  finishColor: '#000',
                  finishSize: 18
                }
              },
              scrollToBottom: {
                intervalTime: -1,
                anim: false
              },
              exchange: true,
              rotation: true
            }, function (ret) {
              if (ret) {
                if (ret.eventType != "cancel") {
                  tempimgp = "";
                  loadImg(ret.list, mycomponent.imgarray.imgnum, tempimgp);
                }
              }
            });

            function loadImg(list, num, tempimgp) {
              if (list.length > 0) {
                var imgpath = "";
                if (api.systemType == "ios") {
                  imgpath = list[0].thumbPath;
                }
                if (api.systemType == "android") {
                  imgpath = list[0].path;
                }
                imageFilter.getAttr({
                  path: imgpath
                }, function (ret, err) {
                  if (ret.status) {
                    var tempwidth = ret.width;
                    var tempheight = ret.height;
                    var bili = tempwidth / tempheight;
                    var width = 0;
                    var height = 1200
                    if (height > tempheight) {
                      height = tempheight
                      width = tempwidth
                    } else {
                      height = 1200;
                      width = height * bili;
                    }
                    if (width > tempwidth) {
                      height = tempheight
                      width = tempwidth
                    }
                    imageFilter.compress({
                      img: imgpath,
                      quality: 1,
                      size: {
                        w: width,
                        h: height
                      },
                      save: {
                        album: false,
                        imgPath: "fs://test/",
                        imgName: '0' + num + '.jpg'
                      }
                    }, function (ret, err) {
                      if (ret.status) {
                        var pathtemp = api.fsDir + "/test/0" + num + ".jpg";
                        mycomponent.imgtemps.push(pathtemp)
                        //mycomponent.imgarray.imgpaths.push(pathtemp);
                        mycomponent.imgarray.imgnum++;
                        list.splice(0, 1)
                        loadImg(list, mycomponent.imgarray.imgnum, tempimgp);
                      } else {
                        alert(JSON.stringify(err));
                      }
                    });
                  } else {
                    alert(JSON.stringify(err));
                  }
                });
              } else {
                mycomponent.imgarray.imgpaths = mycomponent.imgarray.imgpaths.concat(mycomponent.imgtemps);
                //$("#imgAdd").append(tempimgp);
              }
            }
          },
          //预览图片
          openImg: function (pathtemp) {
            var imgindex = this.findIndex(this.imgarray.imgpaths, pathtemp);
            var imageBrowser = api.require('imageBrowser');

            imageBrowser.openImages({
              imageUrls: this.imgarray.imgpaths,
              showList: false,
              activeIndex: imgindex,
              tapClose: true
            });
          },
          //获取图片索引，正确找到图片组中的对应的图片
          findIndex: function (arr, val) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] == val) {
                return i;
                break;
              }
            }
          },
          //删除图片
          deleteImg: function (pathtemp, index) {
            var mycomponent = this;
            api.confirm({
              title: '提示',
              msg: '确定要删除图片吗？',
              buttons: ['确定', '取消']
            }, function (ret, err) {
              var buttonIndex = ret.buttonIndex;
              if (buttonIndex == 1) {
                mycomponent.removeByValue(mycomponent.imgarray.imgpaths, pathtemp);
              }
            });
          },
          //从图片数组中删除
          removeByValue: function (arr, val) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] == val) {
                arr.splice(i, 1);
                break;
              }
            }
          },
          //录视频
          camera_video: function () {
            this.closeItem();
            var mycomponent = this;
            var imageFilter = api.require('imageFilter');
            api.getPicture({
              sourceType: 'camera',
              mediaValue: 'video',
              destinationType: 'url',
              allowEdit: true,
              saveToPhotoAlbum: false
            }, function (ret, err) {
              if (ret) {
                var videoPath = ret.data;
                if (videoPath != "") {
                  mycomponent.imgarray.videopaths.push(videoPath);
                  mycomponent.imgarray.videonum++;
                }

              } else {
                alert(JSON.stringify(err));
              }

            });
          },
          //选择手机中的视频
          getVideo: function () {
            this.closeItem();
            var mycomponent = this;
            var imageFilter = api.require('imageFilter');
            var UIMediaScanner = api.require('UIMediaScanner');
            UIMediaScanner.open({
              type: 'video',
              column: 4,
              classify: true,
              max: 4,
              sort: {
                key: 'time',
                order: 'desc'
              },
              texts: {
                stateText: '已选择*项',
                cancelText: '取消',
                finishText: '完成'
              },
              styles: {
                bg: '#fff',
                mark: {
                  icon: '',
                  position: 'bottom_left',
                  size: 20
                },
                nav: {
                  bg: '#eee',
                  stateColor: '#000',
                  stateSize: 18,
                  cancelBg: 'rgba(0,0,0,0)',
                  cancelColor: '#000',
                  cancelSize: 18,
                  finishBg: 'rgba(0,0,0,0)',
                  finishColor: '#000',
                  finishSize: 18
                }
              },
              scrollToBottom: {
                intervalTime: -1,
                anim: false
              },
              exchange: true,
              rotation: true
            }, function (ret) {
              if (ret) {
                if (ret.eventType != "cancel") {
                  for (var i = 0; i < ret.list.length; i++) {
                    var videoPath = ret.list[i].path;
                    mycomponent.imgarray.videopaths.push(videoPath);
                    mycomponent.imgarray.videonum++;
                  }
                }

              }
            });

          },
          //预览视频,调用手机应用打开视频
          openVideo: function (videopath) {
            api.openVideo({
              url: videopath
            });
          },
          //删除视频
          deleteVideo: function (videopath, index) {
            var mycomponent = this;
            api.confirm({
              title: '提示',
              msg: '确定要删除视频吗？',
              buttons: ['确定', '取消']
            }, function (ret, err) {
              var buttonIndex = ret.buttonIndex;
              if (buttonIndex == 1) {
                mycomponent.removeByValue(mycomponent.imgarray.videopaths, videopath);
              }
            });

          },
        }
      },
      //动态表单元素组件
      "myelement": {
        template: "#item-element",
        props: ['param', 'myclass'] //param是元素标题,myclass是其他一个DIV的样式
      }
    }
  });


}
