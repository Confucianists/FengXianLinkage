var selectData = {};
window.apiready = function () {
  UICore.showLoading('加载表单中...', '请稍等...');

  //页面头部通用组件
  // new Vue({
  //     el: "#header",
  //     components: {
  //         "header-comp": function(resolve, reject) {
  //             api.readFile({
  //                 path: 'widget://html/component/headertop.html'
  //             }, function(ret, err) {
  //                 console.log(1111111111111);
  //                 if (ret) {
  //                     resolve({
  //                         template: ret.data,
  //                         data: function() {
  //                             return {
  //                                 title: "事件上报"
  //                             }
  //                         },
  //                         methods: {
  //                             closeWin: function() {
  //                                 api.closeWin();
  //                             }
  //                         }
  //                     });
  //                 } else {
  //                     alert(JSON.stringify(err));
  //                 }
  //             });
  //         }
  //     }
  // })

  var vm = new Vue({
    el: "#app",
    created: function () { //VUE创建后执行，数据创建成功，页面渲染之前
      var info = $api.getStorage('userinf');
      this.accountId = info.accountId;
      this.flowId = api.pageParam.flowId;
      this.eventTypeId = api.pageParam.eventTypeId;
      this.settingFile();
      this.getForm(); //加载表单接口
    },
    mounted: function () { //VUE渲染成功后执行
      //document.getElementById("app").style.display = 'block';
      //this.$refs.app
    },
    data: {
      flowId: "",
      eventTypeId: "",
      formdata: {}, //表单数据存放属性
      settingdata: {}, //配置文件存放属性
      accountId: '',
      btnFlag: false,
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

      },
      isPerson: false,
      isDept: false,
      route_arr: [],
      flag: ""
    },
    methods: {
      getForm: function () {
        console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=addEvent_HZ&flowId=' + this.flowId + '&accountId=' + this.accountId);
        var _self = this;
        api.ajax({
          url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=addEvent_HZ&flowId=' + this.flowId + '&accountId=' + this.accountId,
          tag: 'grid',
          method: 'get'
        }, function (ret, err) {
          if (ret) {
            if (ret.success == "true") {
              var data = eval('(' + decodeURIComponent(ret.Data) + ')');
              for (var column in data) {
                if (data[column].column_label == "hidden") {
                  // if (data[column].column_name == "wf_flowInstanceId") {
                  //     //不能用this，此处this指向的是此回调函数
                  //
                  //     vm.$set(vm.alltag, "flowInstanceId", data[column].default_value);
                  //     continue;
                  // }
                  // if (data[column].column_name == "wf_activityId") {
                  //     vm.$set(vm.alltag, "wf_activityId", data[column].default_value);
                  //     continue;
                  // }
                  if (data[column].column_name == "trackId") {
                    vm.$set(vm.alltag, "wf_trackId", data[column].default_value);
                    continue;
                  }
                  if (data[column].column_name == "表单编号") {
                    vm.$set(vm.alltag, "wf_formId", data[column].default_value);
                    continue;
                  }
                  vm.$set(vm.alltag, data[column].column_name, data[column].default_value);
                } else {
                  if (data[column].column_label == "text" && data[column].id == "coordinateId") {
                    _self.locationKey = data[column].column_key;
                  }
                  // 事件来源
                  if (data[column].english_name == "EventSources") {
                    data[column].default_value = 1;
                  }
                  //var json = {default_value:data[column].default_value,is_not_null:data[column].is_not_null}

                  vm.$set(vm.alltag, data[column].column_key, data[column].default_value);
                }


              }
              //必须用$set,这样才会触发VUE重新渲染，直接赋值不会触发
              // vm.$set(vm.$data, "formdata", data);

              var info = [];
              for (var i = 0; i < data.length; i++) {
                if (data[i].column_label == "text" && data[i].id == "coordinateId") {
                  continue
                } else {
                  info.push(data[i])
                }
              }
              vm.$set(vm.$data, "formdata", info);

              vm.$nextTick(function () {
                if (this.$refs.EventSources) {
                  this.$refs.EventSources[0].value = '移动端';
                  this.$refs.EventSources[0].key = 1;
                  this.$refs.EventSources[0].status = "selected";
                  this.$refs.EventSources[0].num = 0;
                }

                vm.getLocation();
              });

              api.hideProgress();
            } else {
              alert("加载表单数据失败");
            }
          } else {
            alert(JSON.stringify(err));
          }
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
            _self.alltag[_self.locationKey] = loc.x + "," + loc.y;
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
            //_self.$refs.addressName[0].value = ret.result.formatted_address;
          } else {
            api.alert({
              msg: JSON.stringify(err)
            });
          }
        });
      },
      //获取配置文件
      settingFile: function () {
        selectData = JSON.parse($api.getStorage('settingdata'));
        // api.readFile({
        //     path: api.cacheDir + 'config.json'
        // }, function(ret, err) {
        //     if (ret) {
        //         if (ret.status) {
        //             var jsonData = JSON.parse(ret.data);
        //             vm.$set(vm.$data, "settingdata", jsonData);
        //         } else {
        //             alert("读取失败");
        //         }
        //     } else {
        //         alert(JSON.stringify(err))
        //     }
        // });
      },
      //点击提交按钮
      subButtonClick: function () {
        if (this.checkNotNull()) {
          this.uploadAttach()
        }
      },
      selectOrsubmit: function () {
        var self = this;
        UICore.showLoading('提交表单中...', '请稍等...');
        console.log(UICore.serviceUrl + 'mobile/mobileWf.shtml?act=submitEvent_HZ&sign=submit&seclectId=&accountId=' + this.accountId + '&eventType=' + this.eventTypeId);
        api.ajax({
          url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=submitEvent_HZ&sign=submit&seclectId=&accountId=' + this.accountId + '&eventType=' + this.eventTypeId,
          method: 'post',
          tag: 'grid',
          data: {
            values: {
              "data": JSON.stringify(this.alltag)
            }
          }
        }, function (ret, err) {
          api.hideProgress();
          if (ret) {
            if (ret.success == "true") {
              self.flag = ret.flag
              self.route_arr = eval('(' + decodeURIComponent(ret.Data) + ')');
              if (ret.flag == "1") {
                self.alltag.chooseType = self.route_arr.chooseType;
                self.show.zcover = true;
                self.show.submitDiv = true;
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
                api.closeWin();
              }
            }

          } else {
            alert(JSON.stringify(err));
          }
        });
      },

      //检查必填项
      checkNotNull: function () {
        for (var mykey in this.alltag) {
          for (var formkey in this.formdata) {
            if (mykey == this.formdata[formkey].column_key) {
              if (this.formdata[formkey].is_not_null == true && this.alltag[mykey] == "" && this.formdata[formkey].column_label != "file") {
                alert("有必填项（"+this.formdata[formkey].column_name+"）没有填写");
                return false;
              }
            }
          }

        }
        if (this.imgarr.imgpaths.length < 2) {
          alert("必须上传至少2张图片");
          return false
        }
        return true;
      },
      choose: function (item, index) {
        this.alltag.wf_nextActivityId = item.activityId;
        this.alltag.wf_nextActivityName = item.convertName;
        this.alltag.seclectId = item.doSelectType;
        this.jumpToPerson(index);
      },
      jumpToPerson: function (index) {
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
        }, function (ret, erra) {
          api.hideProgress();
          if (ret.success == "true") {
            if (ret.flag == "3") {
              api.toast({
                msg: '上报成功',
                duration: 2000,
                global: 'true',
                location: 'bottom'
              });
              api.closeWin();
            } else {
              var jsondata = eval('(' + decodeURIComponent(ret.Data) + ')');
              mycomponent.isPerson = jsondata[0].personList.length > 0;
              mycomponent.isDept = jsondata[0].deptList.length > 0;
              // alert(JSON.stringify(jsondata));
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
          }, function (ret, err) {
            mycomponent.alltag.wf_nextExecutorId = ret.value.key1;
            mycomponent.alltag.wf_nextExecutor = ret.value.key2;
            mycomponent.alltag.chooseType = ret.value.chooseType;
            // alert(ret.value.chooseType);
            // mycomponent.show.submitDiv = false;
            // mycomponent.alltag.wf_nextExecutorId = ret.value.key1;
            // mycomponent.alltag.wf_nextExecutor = ret.value.key2;
            //mycomponent.submitForm();
            // mycomponent.uploadAttach();

            mycomponent.submitFormNew();
          });
        });
      },
      submitFormNew: function () {
        console.log(JSON.stringify(this.alltag));
        var self = this;
        UICore.showLoading('提交表单中...', '请稍等...');
        var url;
        // isPerson:false,
        if (this.isDept) {
          url = UICore.serviceUrl + 'mobile/mobileWf.shtml?act=submitEvent_HZ&sign=submitOrgs&accountId=' + this.accountId + '&seclectId=' + this.alltag.seclectId + '&eventType=' + this.eventTypeId;
        } else {
          url = UICore.serviceUrl + 'mobile/mobileWf.shtml?act=submitEvent_HZ&sign=submit&accountId=' + this.accountId + '&seclectId=' + this.alltag.seclectId + '&eventType=' + this.eventTypeId;
        }
        // alert(url);
        api.ajax({
          url: url,
          method: 'post',
          tag: 'grid',
          data: {
            values: {
              "data": JSON.stringify(this.alltag)
            }
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
              self.show.submitDiv = false;
              api.closeWin();
            } else {
              self.alltag.wf_nextExecutorId = "";
              self.alltag.wf_nextExecutor = "";
              alert(ret.ErrorInfo);
            }
          } else {
            self.alltag.wf_nextExecutorId = "";
            self.alltag.wf_nextExecutor = "";
            api.alert({
              msg: JSON.stringify(err)
            });
          }
        });
      },
      //提交表单
      submitForm: function () {
        console.log(JSON.stringify(this.alltag));
        UICore.showLoading('提交表单中...', '请稍等...');
        api.ajax({
          url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=submitEvent_HZ&accountId=' + this.accountId + '&workId=' + this.alltag.flowInstanceId + '&seclectId=' + this.alltag.selectId + '&eventType=' + this.eventTypeId,
          method: 'post',
          tag: 'grid',
          data: {
            values: {
              "data": JSON.stringify(this.alltag)
            }
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
              api.closeWin();
            } else {
              alert(ret.ErrorInfo);
            }
          } else {
            api.alert({
              msg: JSON.stringify(err)
            });
          }
        });
      },
      //打开事件组件
      openTime: function (column_key) {
        var defaultTime = this.alltag[column_key];
        UICore.openTime(this, column_key, defaultTime)
      },
      //打开下拉框（单选）
      openSelect: function (obj, english_name, column_key) {
        //用$refs获取组件中的DOM元素
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
          for (var item in itemArray) {
            if (itemArray[item].key == selectVal) {
              itemArray[item].status = 'selected';
            }
          }
        }
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
            mycomponent.alltag.chooseType = ret.value.chooseType;
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
      uploadAttach: function () {
        this.imgarr.imgpaths = this.imgarr.imgpaths.concat(this.imgarr.videopaths);
        var mycomponent = this;
        console.log(JSON.stringify(this.alltag));
        if (this.imgarr.imgpaths.length > 0) {
          UICore.showLoading('上传附件中...', '稍等...');
          api.ajax({
            url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=uploadAttach_HZ&loginId=' + this.accountId+'&accountId=' +this.accountId + '&workId=' + this.alltag.wf_flowInstanceId + '&nodeId=' + this.alltag.wf_activityId,
            method: 'post',
            tag: 'grid',
            data: {
              files: {
                file: this.imgarr.imgpaths
              }
            }
          }, function (ret, err) {
            console.log(JSON.stringify(ret));
            if (ret) {
              if (ret.success == true) {
                // mycomponent.submitForm();
                // mycomponent.submitFormNew();
                mycomponent.selectOrsubmit();
              } else {

              }
            } else {
              api.hideProgress();
              api.alert({
                msg: JSON.stringify(err)
              });
            }
          });
        } else {
          // this.submitForm();
          mycomponent.selectOrsubmit();
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
