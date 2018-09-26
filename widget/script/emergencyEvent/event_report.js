var selectData = {};
var eventCradeArray = [];
window.apiready = function () {
  UICore.showLoading('加载表单中...', '请稍等...');

  var vm = new Vue({
    el: "#app",
    mixins: [upload],
    created: function () { //VUE创建后执行，数据创建成功，页面渲染之前
      var info = $api.getStorage('userinf');
      this.accountId = info.accountId;
      this.f.accountId = info.accountId;
      this.f.eventUpPersonId = info.accountId;
      this.f.eventUpPersonName = info.accountName;
      // 获取数据字典的配置文件
      this.settingFile();
      this.getLocation();

      // 获取当前时间
      var date = new Date();
      var year = date.getFullYear().toString();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      var hour = date.getHours().toString();
      var minute = date.getMinutes().toString();
      this.f.date = year + '-' + (month[1] ? month : '0' + month) + '-' + (day[1] ? day : '0' + day);
      this.f.time = (hour[1] ? hour : '0' + hour) + ':' + (minute[1] ? minute : '0' + minute);

      this.f.endShow = '1';
      this.f.endShowStr = '是';
    },
    mounted: function () { //VUE渲染成功后执行
      //document.getElementById("app").style.display = 'block';
      //this.$refs.app
    },
    data: {
      icon: {
        icon_del: '../../image/icon_del.png',
        video: '../../image/video.jpg',
        file: '../../image/file.png',
        record: '../../image/record.png'
      },
      // 应急事件的配置
      f: {
        accountId: '',
        // 应急事件标题
        title: '',
        // 应急事件内容
        content: '',
        // 应急事件等级(数据字典（emergencyGrade）)
        eventGrade: '',
        eventGradeName: '',
        // 需要通知的部门(根据等级查询出来的，并支持下拉重新勾选)
        noticeDepartment: '',
        noticeDepartmentStr: '',
        departmentArray: [],
        // 是否进行短信推送（1：是 2：否 ）
        msgPush: '1',
        msgStr: '是',
        isSendMessage: [{
          text: '是',
          status: 'normal',
          key: '1'
        }, {
          text: '否',
          status: 'normal',
          key: '2'
        }],
        // 事件上报人员主键
        eventUpPersonId: '',
        // 事件上报人员名称
        eventUpPersonName: '',
        // 事件发生时间
        eventHappenTime: '',
        date: '',
        time: '',
        // 事件发生地点
        eventHappenAddress: '',
        // 事件上报来源（1 : pc端 2：手机端）
        eventUpResource: 2,
        xy: '',
        // 坐标x
        x: '',
        // 坐标y
        y: '',
        // 结束后是否公示（1：是 2：否）
        endShow: '',
        endShowStr: '',
        isEndShow: [{
          text: '是',
          status: 'normal',
          key: '1'
        }, {
          text: '否',
          status: 'normal',
          key: '2'
        }],
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

            var latitude = ret.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = ret.longitude // 经度，浮点数，范围为180 ~ -180。
            var accuracy = ret.accuracy; // 位置精度
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
          timeout: 30,
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
      // 配置等级
      setGrade: function () {
        var key = 'emergencyGrade';
        for (var j = 0; j < selectData.data.length; j++) {
          if (key == selectData.data[j].parentKey) {
            eventCradeArray.push({
              text: selectData.data[j].extendAttributeValue,
              status: 'normal',
              key: selectData.data[j].extendAttributeKey
            });
          }
        }
        // alert(JSON.stringify(eventCradeArray));
        if (eventCradeArray.length == 0) {
          alert('数据字典里没有key为' + key + '的数据');
        } else {
          this.f.eventGrade = eventCradeArray[0].key;
          this.f.eventGradeName = eventCradeArray[0].text;
          this.getDepartments(this.f.eventGrade);
        }

      },
      //获取配置文件 传说中的数据字典吗？
      settingFile: function () {
        selectData = JSON.parse($api.getStorage('settingdata'));
        this.setGrade();
      },
      //点击提交按钮
      subButtonClick: function () {



        if (this.f.title == '') {
          alert('应急事件标题没有填写。');
          return false;
        }
        if (this.f.content == '') {
          alert('应急事件内容没有填写。');
          return false;
        }
        if (this.f.eventGrade == '') {
          alert('应急事件等级没有选择。');
          return false;
        }
        if (this.f.eventGrade == '') {
          alert('应急事件等级没有选择。');
          return false;
        }
        if (this.f.msgPush == '') {
          alert('请选择是否进行短信推送');
          return false;
        }
        if (this.f.date == '') {
          alert('请选择事件发生日期');
          return false;
        }
        if (this.f.time == '') {
          alert('请选择事件发生时间');
          return false;
        }
        this.f.eventHappenTime = this.f.date + ' ' + this.f.time;
        if (this.f.endShow == '') {
          alert('请选择结束后是否公示');
          return false;
        }
        var _self = this;
        // this.show.zcover = true;
        // this.show.submitDiv = true;
        // 提交附件
        this.uploadAttach2(function (list) {
          if (list.length > 0) {
            for (var i = 0, len = list.length; i < len; i++) {
              _self.f.attachIds = _self.f.attachIds + ',' + list[i].id;
            }
            _self.submitForm();
          } else {
            _self.submitForm();
          }
        })
      },
      //提交表单
      submitForm: function () {

        // alert(JSON.stringify(this.f));

        UICore.showLoading('提交表单中...', '请稍等...');
        api.ajax({
          url: UICore.serviceUrl + 'pc_mobile/emergency_event/save',
          method: 'post',
          timeout: 30,
          data: {
            values: {
              title: this.f.title,
              content: this.f.content,
              eventGrade: this.f.eventGrade,
              noticeDepartment: this.f.noticeDepartment,
              msgPush: this.f.msgPush,
              eventUpPersonId: this.f.eventUpPersonId,
              eventUpPersonName: this.f.eventUpPersonName,
              eventHappenTime: this.f.eventHappenTime + ':00',
              eventHappenAddress: this.f.eventHappenAddress,
              eventUpResource: this.f.eventUpResource,
              x: this.f.x,
              y: this.f.y,
              endShow: this.f.endShow,
              attachIds: this.f.attachIds
            }
          }
        }, function (ret, err) {
          //alert('ret为：'+JSON.stringify(ret));
          api.hideProgress();
          if (ret) {
            if (ret.success == true) {
              api.toast({
                msg: '上报成功',
                duration: 2000,
                global: 'true',
                location: 'bottom'
              });
              api.closeWin();
            } else {
              alert(ret.message);
            }
          } else {
            api.alert({
              msg: '上报失败'
            });
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
            timeout: 30,
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
      openEmergencyTime: function (r) {
        var _self = this;
        if (r == 'date') {
          UICore.openTime(null, null, null, function (date) {
            _self.f.date = date;
          });
        } else {
          api.openPicker({
            type: 'time',
            title: '选择时间'
          }, function (ret, err) {
            if ('' != ret && null != ret && undefined != ret) {
              _self.f.time = String(ret.hour) + ':' + String(ret.minute);
              //  alert(JSON.stringify(ret));
            } else {
              alert(JSON.stringify(err));
            }
          });
        }
      },
      // 打开应急事件等级
      openSelectEmergencyLevel: function () {
        var _self = this;
        var itemArray = eventCradeArray;
        // alert(JSON.stringify());
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
        var dataAreaCode=$api.getStorage('userinf').dataAreaCode;
        api.ajax({
          url: UICore.serviceUrlMock + 'pc_mobile/plan_bank/list_departments?grade=' + grade+'&dataAreaCode='+dataAreaCode,
          method: 'post',
          timeout: 30
        }, function (ret, err) {
          // alert(JSON.stringify(ret));
          var text = '';
          var key = '';
          if (ret.list && ret.list.length > 0) {
            for (var i = 0, len = ret.list.length; i < len; i++) {
              ret.list[i].text = ret.list[i].regionName + '-' + ret.list[i].deptName;
              if (ret.list[i].checked == 1) {
                ret.list[i].status = 'selected';
              }
              ret.list[i].key = ret.list[i].deptId;
              if (i == 0) {
                text = ret.list[i].text;
                key = ret.list[i].key;
              } else {
                text = text + ',' + ret.list[i].text;
                key = key + ',' + ret.list[i].key;
              }
            }
            var itemArray = ret.list;
            // alert(text);
            _self.f.departmentArray = itemArray;
            _self.f.noticeDepartmentStr = text;
            _self.f.noticeDepartment = key;
          } else {
            _self.f.noticeDepartmentStr = '';
            _self.f.noticeDepartment = '';
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
            vm.f.noticeDepartment = rStr.key;
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
        //alert(english_name);
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
            timeout: 30,
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
          tag: 'grid',
          timeout: 30
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
          method: 'get',
          timeout: 30
        }, function (ret, erra) {
          api.hideProgress();
          //监听选择人员页面点击人员后触发
          api.addEventListener({
            name: 'personClick'
          }, function (ret, err) {
            // alert(123);
            mycomponent.show.ev_next_step = false;
            mycomponent.show.zcover = false;
            mycomponent.alltag.wf_nextExecutorId = ret.value.key1;
            mycomponent.alltag.wf_nextExecutor = ret.value.key2;
            //mycomponent.submitForm();
            mycomponent.uploadAttach2();
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
      uploadAttach2: function (cb) {
        var url = UICore.serviceUrl + 'pc_mobile/emergency_event/emergency_upload_attach?act=uploadAttach_HZ&loginId=' + this.accountId + '&accountName=' + this.f.eventUpPersonName + '&workId=' + this.alltag.flowInstanceId + '&nodeId=' + this.alltag.activityId;
        this.uploadAttach(function (ret) {
          if (ret) {
            cb && cb(ret.list);
          } else {
            cb && cb([]);
            api.hideProgress();
            // api.alert({
            //   msg: JSON.stringify(err)
            // });
          }
        }, url);
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
        props: ['myshow', 'imgarray'], //一个指向父组件中的show，一个指向父组件中的imgarr,必须指向含有子属性的值，VUE2.0子组件只能修改父组件属性中的子属性值
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