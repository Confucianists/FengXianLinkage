/**
*   create by hzh on 2017/7/17
    城市部件表单js
*/
apiready = function() {

    var param = api.pageParam;

    mCityComponent = new CityComponent();
    if (param != "" && param != "undefined") {
        mCityComponent.mStatus = param.status;
        if (mCityComponent.mStatus == "isBrownse") {
          mCityComponent.vue.isClick = true;//不可编辑
          mCityComponent.queryParam = param.queryParam;
          mCityComponent.infoJSON = param.data;
        }
    }

    mCityComponent.initSelectData();
    mCityComponent.bindView();

    if (mCityComponent.mStatus == "isNew") {
      mCityComponent.vue.componentGirdCode = $api.getStorage('userinf').villageOrCommunityCode;
    }

    if (mCityComponent.mStatus == "isBrownse") {
      $api.text($api.byId('pkh_add_su'), '编辑');
      mCityComponent.vue.isClick = true;
      mCityComponent.setDataToView();
    }


};

CityComponent = function() {};
CityComponent.prototype = {

    mStatus: "isNew", //表示当前状态，isNew表示新增，isEdit表示编辑，isBrowse表示浏览
    queryParam:"",//查询参数，编辑提交时刷新界面使用
    infoJSON:{},//编辑查看时的数据

    componentType_arr: [], //部件类型
    componentSecondType_arr: [], //部件子类型
    componentStatus_arr: [], //部件状态
    maintenanceType_arr: [], //维护类型
    maintenanceWay_arr: [], //维护方式

    imgPaths: [],//存放附件图片路径
    imgNum: 0,//附件图片的数量

    vue: {}, //Vue对象

    initSelectData: function() {
        UICore.showLoading("正在初始化数据", "请稍等");
        var that = this;

        that.getSpinnerValue("CityComponent_ComponentType",that.componentType_arr);//部件类型
        that.getSpinnerValue2("CityComponent_ComponentStatue",that.componentStatus_arr);//部件状态
        that.getSpinnerValue2("CityComponent_MaintenanceType",that.maintenanceType_arr);//维护类型
        that.getSpinnerValue2("CityComponent_MaintenanceMode",that.maintenanceWay_arr);//维护方式
        if (that.mStatus == "isNew") {
          that.getLocation();
        }
        api.hideProgress();
    },
    getSpinnerValue:function(key,dataArr){
        var that = this;
        console.log("获取下拉条数据 : " + key);
        console.log(UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getSysCategoryByCode&code=' + key);
        api.ajax({
            url: UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getSysCategoryByCode&code=' + key,
            method: 'get',
        },function(ret, err){
            if (ret) {
                console.log(JSON.stringify( ret ) );
                if(ret.success){
                  var jsonData = ret.data;
                  if (jsonData != "") {
                      jsonData.forEach(function(value) {
                          dataArr.push({
                            text: value.extendAttributeValue,
                            status: 'normal',
                            key: value.extendAttributeKey
                          });
                      });

                  } else {
                      alert("初始化失败，数据为空");
                  }
                }
            }
        });
    },
    getSpinnerValue2:function(key,dataArr){
        console.log("获取下拉条数据 : " + key);
        console.log(UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getSysAttributeByCode&code=' + key);
        api.ajax({
            url: UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getSysAttributeByCode&code=' + key,
            method: 'get',
        },function(ret, err){
            if (ret) {
                console.log(JSON.stringify( ret ) );
                if(ret.success){
                  var jsonData = ret.data;
                  if (jsonData != "") {
                      jsonData.forEach(function(value) {
                          dataArr.push({
                            text: value.extendAttributeValue,
                            status: 'normal',
                            key: value.extendAttributeKey
                          });
                      });
                  } else {
                      alert("初始化失败，数据为空");
                  }
                }
            }
        });
    },
    setDataToView:function(){
        var that = this;
        console.log("城市部件详情：  " + JSON.stringify(that.infoJSON));
        that.vue.componentName = that.infoJSON.componentName;
        that.vue.componentCode = that.infoJSON.componentCode;
        that.vue.initialInvestigationTime = that.infoJSON.initialInvestigationTime;
        that.vue.changeInvestigationTime = that.infoJSON.changeInvestigationTime;
        that.vue.componentGirdCode = that.infoJSON.code;
        that.vue.chargeDeparmentID = that.infoJSON.departmentId;
        that.vue.chargeDeparment = that.infoJSON.departmentName;
        that.vue.chargeDeparmentCode = that.infoJSON.departmentCode;
        that.vue.ownershipUnitID = that.infoJSON.ownershipUnitId;
        that.vue.ownershipUnit = that.infoJSON.ownershipUnitName;
        that.vue.ownershipUnitCode = that.infoJSON.ownershipUnitCode;
        that.vue.maintenanceUnitID = that.infoJSON.maintenanceUnitId;
        that.vue.maintenanceUnit = that.infoJSON.maintenanceUnitName;
        that.vue.maintenanceUnitCode = that.infoJSON.maintenanceUnitCode;
        that.vue.maintenancePersonID = that.infoJSON.maintainerId;
        that.vue.maintenancePerson = that.infoJSON.maintainerName;
        that.vue.maintenancePersonPhone = that.infoJSON.maintainerPhone;
        that.vue.maintenanceTime = that.infoJSON.maintenanceTime;
        that.vue.locationGPS = that.infoJSON.flat + "," +that.infoJSON.lnglat;
        that.vue.remark = that.infoJSON.remark;

        console.log("城市部件类型：  " + JSON.stringify(mCityComponent.componentType_arr));
        mCityComponent.componentType_arr.forEach(function(value,index,arr){
          if (arr[index].key == mCityComponent.infoJSON.componentType) {
            mCityComponent.vue.componentType = arr[index].text;
            mCityComponent.vue.componentTypeID = arr[index].key;
            arr[index].status = "selected";
          }
        });
    },
    bindView: function() {
        this.vue = new Vue({
            el: "#list",
            data: {
                isClick: false, //标记是否可以编辑, false表示不绑定，可以编辑；true表示绑定，不可编辑
                componentName: "", //部件名称
                componentCode: "", //部件编码
                componentTypeID: "",
                componentType: "", //部件类型
                componentSecondTypeID: "",
                componentSecondType: "", //部件子类型
                initialInvestigationTime: "", //初始调查时间
                changeInvestigationTime: "", //变更调查时间
                componentStatusID: "",
                componentStatus: "", //部件状态
                componentGirdCode: "", //网格编号
                chargeDeparmentID: "",
                chargeDeparment: "", //主管部门
                chargeDeparmentCode: "", //部门编码
                ownershipUnitID: "",
                ownershipUnit: "", //权属单位
                ownershipUnitCode: "", //权属单位编码
                maintenanceUnitID: "",
                maintenanceUnit: "", //维护单位
                maintenanceUnitCode: "", //维护单位编码
                maintenancePersonID: "",
                maintenancePerson: "", //维护人员
                maintenancePersonPhone: "", //维护人电话
                maintenanceTypeID: "",
                maintenanceType: "", //维护类型
                maintenanceWayID: "",
                maintenanceWay: "", //维护方式
                maintenanceTime: "", //维护时间
                locationGPS: "", //定位坐标
                remark: "", //备注

            },
            methods: {
              closeWin:function(){
                api.closeWin({
                    name: 'CityComponent'
                });

              },
              submit:function(){
                if (mCityComponent.mStatus == "isBrownse") {
                    $api.text($api.dom("#pkh_add_su"), '提交');
                    mCityComponent.vue.isClick = false;
                    mCityComponent.mStatus = 'isEdit';
                }else{
                  if (mCityComponent.checkValue()) {
                    // UICore.showLoading("上传附件中","请稍侯");
                    // console.log(UICore.serviceUrl+'mobile/mobileNewAttachment.shtml?act=uploadNewAttachment&recordID=' +'&accountId=' + $api.getStorage('userinf').accountId);
                    // console.log("imgPaht: " + JSON.stringify(mCityComponent.imgPaths));
                    // api.ajax({
                    //     url:UICore.serviceUrl+'mobile/mobileNewAttachment.shtml?act=uploadNewAttachment&recordID=' +'&accountId=' + $api.getStorage('userinf').accountId ,
                    //     method: 'post',
                    //     data: {
                    //       files : {
                    //         file : mCityComponent.imgPaths,
                    //       }
                    //     }
                    // },function(ret, err){
                    //     api.hideProgress();
                    //     if (ret) {
                    //         //submitForm();
                    //     } else {
                    //         alert( "附件上传失败" );
                    //     }
                    // });
                    mCityComponent.submitForm();
                  }
                }
              },
                componentTypef: function() {
                    console.log("部件类型");
                    var that = this;
                    if (!that.isClick) {
                        var defaultVal = that.componentType; //获取默认值
                        if (defaultVal != null && defaultVal != "") {
                            mCityComponent.componentType_arr.forEach(function(value, index, arr) {
                                if (value.text == that.componentType) {
                                    arr[index].status = "selected";
                                }
                            });
                        }

                        UICore.openSelect3(mCityComponent.componentType_arr, that.componentType, "componentType");
                        api.addEventListener({
                            name: 'componentType'
                        }, function(ret, err) {
                            if (ret) {
                                console.log(JSON.stringify(ret.value.key1));
                                that.componentType = ret.value.key1;
                                that.componentTypeID = ret.value.key2;
                                mCityComponent.componentSecondType_arr = [];
                                that.componentSecondType = "";
                                that.componentSecondTypeID = "";
                                mCityComponent.getSpinnerValue(ret.value.key2,mCityComponent.componentSecondType_arr);
                            } else {
                                alert(JSON.stringify(err));
                            }
                        });
                    }
                },
                componentSecondTypef: function() {
                      console.log("部件子类型");
                      var that = this;
                      if (!that.isClick) {
                          var defaultVal = that.componentSecondType; //获取默认值
                          if (defaultVal != null && defaultVal != "") {
                              mCityComponent.componentSecondType_arr.forEach(function(value, index, arr) {
                                  if (value.text == that.componentSecondType) {
                                      arr[index].status = "selected";
                                  }
                              });
                          }

                          UICore.openSelect3(mCityComponent.componentSecondType_arr, that.componentSecondType, "componentSecondType");
                          api.addEventListener({
                              name: 'componentSecondType'
                          }, function(ret, err) {
                              if (ret) {
                                  console.log(JSON.stringify(ret.value.key1));
                                  that.componentSecondType = ret.value.key1;
                                  that.componentSecondTypeID = ret.value.key2;
                              } else {
                                  alert(JSON.stringify(err));
                              }
                          });
                      }
                },
                componentCreateTimef: function() {
                    console.log("初始调查时间");
                    var that = this;
                    if (!that.isClick) {
                        UICore.openTimeComponent2(that.initialInvestigationTime);
                        api.addEventListener({
                            name: 'buildingTime' //广播接收key，已写死。
                        }, function(ret, err) {
                            if (ret) {
                                that.initialInvestigationTime = ret.value.key1;
                            } else {
                                alert(JSON.stringify(err));
                            }
                        });
                    }
                },
                componentUpdateTimef: function() {
                    console.log("变更调查时间");
                    var that = this;
                    if (!that.isClick) {
                        UICore.openTimeComponent2(that.changeInvestigationTime);
                        api.addEventListener({
                            name: 'buildingTime' //广播接收key，已写死。
                        }, function(ret, err) {
                            if (ret) {
                                that.changeInvestigationTime = ret.value.key1;
                            } else {
                                alert(JSON.stringify(err));
                            }
                        });
                    }
                },
                componentStatusf: function() {
                  console.log("部件状态");
                  var that = this;
                  if (!that.isClick) {
                      var defaultVal = that.componentStatus; //获取默认值
                      if (defaultVal != null && defaultVal != "") {
                          mCityComponent.componentStatus_arr.forEach(function(value, index, arr) {
                              if (value.text == that.componentStatus) {
                                  arr[index].status = "selected";
                              }
                          });
                      }

                      UICore.openSelect3(mCityComponent.componentStatus_arr, that.componentStatus, "componentStatus");
                      api.addEventListener({
                          name: 'componentStatus'
                      }, function(ret, err) {
                          if (ret) {
                              console.log(JSON.stringify(ret.value.key1));
                              that.componentStatus = ret.value.key1;
                              that.componentStatusID = ret.value.key2;
                          } else {
                              alert(JSON.stringify(err));
                          }
                      });
                  }
                },

                chargeDeparmentf: function() {
                    // 查询企业
                    console.log("主管部门");
                    var that = this;
                    if (!that.isClick) {
                      api.openWin({
                        name: 'legalPersonQuery',
                        url: '../legalPerson/legalPersonQuery.html',
                        pageParam: {
                          from: 'cityComponent'
                        }
                      });
                      api.addEventListener({
                        name: 'cityComponentQueryResult'
                      }, function(ret, err) {
                        if (ret) {
                          console.log("选择的企业item JSON： " + JSON.stringify(ret));
                          that.chargeDeparmentID = ret.value.data.id;
                          that.chargeDeparment = ret.value.data.unitName;
                          that.chargeDeparmentCode = ret.value.data.organizationCode;
                        } else {
                          alert(JSON.stringify(err));
                        }
                      });
                    }
                },
                ownershipUnitf: function() {
                    // 查询企业
                    console.log("权属单位");
                    var that = this;
                    if (!that.isClick) {
                      api.openWin({
                        name: 'legalPersonQuery',
                        url: '../legalPerson/legalPersonQuery.html',
                        pageParam: {
                          from: 'cityComponent'
                        }
                      });
                      api.addEventListener({
                        name: 'cityComponentQueryResult'
                      }, function(ret, err) {
                        if (ret) {
                          console.log("选择的企业item JSON： " + JSON.stringify(ret));
                          that.ownershipUnitID = ret.value.data.id;
                          that.ownershipUnit = ret.value.data.unitName;
                          that.ownershipUnitCode = ret.value.data.organizationCode;
                        } else {
                          alert(JSON.stringify(err));
                        }
                      });

                    }
                },
                maintenanceUnitf: function() {
                    // 查询企业
                    console.log("维护单位");
                    var that = this;
                    if (!that.isClick) {
                      api.openWin({
                        name: 'legalPersonQuery',
                        url: '../legalPerson/legalPersonQuery.html',
                        pageParam: {
                          from: 'cityComponent'
                        }
                      });
                      api.addEventListener({
                        name: 'cityComponentQueryResult'
                      }, function(ret, err) {
                        if (ret) {
                          console.log("选择的企业item JSON： " + JSON.stringify(ret));
                          that.maintenanceUnitID = ret.value.data.id;
                          that.maintenanceUnit = ret.value.data.unitName;
                          that.maintenanceUnitCode = ret.value.data.organizationCode;
                        } else {
                          alert(JSON.stringify(err));
                        }
                      });

                    }
                },
                maintenanceTypef: function() {
                  console.log("维护类型");
                  var that = this;
                  if (!that.isClick) {
                      var defaultVal = that.maintenanceType; //获取默认值
                      if (defaultVal != null && defaultVal != "") {
                          mCityComponent.maintenanceType_arr.forEach(function(value, index, arr) {
                              if (value.text == that.maintenanceType) {
                                  arr[index].status = "selected";
                              }
                          });
                      }

                      UICore.openSelect3(mCityComponent.maintenanceType_arr, that.maintenanceType, "maintenanceType");
                      api.addEventListener({
                          name: 'maintenanceType'
                      }, function(ret, err) {
                          if (ret) {
                              console.log(JSON.stringify(ret.value.key1));
                              that.maintenanceType = ret.value.key1;
                              that.maintenanceTypeID = ret.value.key2;
                          } else {
                              alert(JSON.stringify(err));
                          }
                      });
                  }
                },
                maintenanceWayf: function() {
                  console.log("维护方式");
                  var that = this;
                  if (!that.isClick) {
                      var defaultVal = that.maintenanceWay; //获取默认值
                      if (defaultVal != null && defaultVal != "") {
                          mCityComponent.maintenanceWay_arr.forEach(function(value, index, arr) {
                              if (value.text == that.maintenanceWay) {
                                  arr[index].status = "selected";
                              }
                          });
                      }

                      UICore.openSelect3(mCityComponent.maintenanceWay_arr, that.maintenanceWay, "maintenanceWay");
                      api.addEventListener({
                          name: 'maintenanceWay'
                      }, function(ret, err) {
                          if (ret) {
                              console.log(JSON.stringify(ret.value.key1));
                              that.maintenanceWay = ret.value.key1;
                              that.maintenanceWayID = ret.value.key2;
                          } else {
                              alert(JSON.stringify(err));
                          }
                      });
                  }
                },
                maintenanceTimef: function() {
                    console.log("维护时间");
                    var that = this;
                    if (!that.isClick) {
                        UICore.openTimeComponent2(that.maintenanceTime);
                        api.addEventListener({
                            name: 'buildingTime' //广播接收key，已写死。
                        }, function(ret, err) {
                            if (ret) {
                                that.maintenanceTime = ret.value.key1;
                            } else {
                                alert(JSON.stringify(err));
                            }
                        });
                    }
                },
                selectMaintenancePerson: function() {
                    var that = this;
                    console.log("维护人员");
                    api.openWin({
                        name: 'populationQuery',
                        url: '../population/populationQuery.html',
                        pageParam: {
                            from: "cityComponent",
                        }
                    });
                    api.addEventListener({
                        name: 'cityComponent'
                    }, function(ret, err) {
                        if (ret) {
                            //console.log("维护人员JSON： " + JSON.stringify(ret));
                            var personJson = ret.value.data;
                            that.maintenancePersonID = personJson.id;
                            that.maintenancePerson = personJson.name;
                            that.maintenancePersonPhone = personJson.telephone;

                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                },
                showItem:function(type){
                    if (type == "img") {
                      console.log("显示附件item项");
                      $api.css($api.dom(".tele-item"),'display:block;');
                      $api.css($api.dom(".hideBg"),'display:block;');

                    }
                },
                hideItem:function(){
                    console.log("点击灰色区域隐藏附件item项");
                    $api.css($api.dom(".hideBg"),'display:none;');
                		$api.css($api.dom(".tele-item"),'display:none;');
                },
                cameraImg:function(){
                  //alert("拍照");
                  mCityComponent.vue.hideItem();
                  var imageFilter = api.require('imageFilter');
                  api.getPicture({
                      sourceType: 'camera',
                      encodingType: 'jpg',
                      mediaValue: 'pic',
                      destinationType: 'url',
                      allowEdit: true,
                      quality: 50,
                      saveToPhotoAlbum: false,
                  }, function(ret, err){
                      if(ret){
                           var imgpath = ret.data;//获取照片路径
                           console.log(JSON.stringify(imgpath));
                           if (imgpath != "") {
                              imageFilter.getAttr({
                                  path: imgpath,
                              }, function(ret, err){
                                  if( ret.status ){
                                    var tempwidth = ret.width;
                                    var tempheight = ret.height;
                                    var bili = tempwidth / tempheight;
                                    var height = 1200;
                                    var width = height * bili;
                                    imageFilter.compress({
                                        img: imgpath,
                                        isClarityimg: false,
                                        quality: 1,
                                        size: {
                                          w : width,
                                          h : height
                                        },
                                        save: {
                                          album : false,
                                          imgPath : "fs://ocnAttach_Img/cityComponent/",
                                          imgName : '0' + mCityComponent.imgNum + '.jpg'
                                        },
                                    }, function(ret, err){
                                        if( ret.status ){
                                            var pathtemp = api.fsDir + "/ocnAttach_Img/cityComponent/0" + mCityComponent.imgNum + ".jpg";
                                            var imgp = '<div class="ev_atlas_one" id="imgWrap' + mCityComponent.imgNum + '">';
                                            imgp = imgp + '<img src="../../image/icon_del.png" onclick="mCityComponent.deleteImg(\'' + pathtemp + '\',\'' + mCityComponent.imgNum + '\')" />  ';
                                            imgp = imgp + "<img src='" + api.fsDir + "/ocnAttach_Img/cityComponent/0" + mCityComponent.imgNum + ".jpg" + "' onclick='mCityComponent.openImg(\"" + pathtemp + "\")'/></div>";
                                            mCityComponent.imgNum++;
                                            mCityComponent.imgPaths.push(api.fsDir + "/ocnAttach_Img/cityComponent/0" + mCityComponent.imgNum + ".jpg");
                                            $api.append($api.dom("#imgAdd"),imgp);
                                        }else{
                                            alert( JSON.stringify( err ) );
                                        }
                                    });

                                  }else{
                                      alert( JSON.stringify( err ) );
                                  }
                              });

                           }
                      }else{
                           alert(JSON.stringify(err));
                      }
                  });
                },
                localImg:function(){
                  //alert("选择相册");
                  mCityComponent.vue.hideItem();
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
                      scrollToBottom:{
                         intervalTime: -1,
                         anim: false
                      },
                      exchange: true,
                      rotation: false,
                  }, function( ret ){
                      if( ret ){
                          if (ret.eventType == "confirm") {
                              tempimgp = "";
                              // 遍历返回的数组
                              loadImg(ret.list,mCityComponent.imgNum,tempimgp);
                          }
                      }else{
                         alert(JSON.stringify(ret));
                      }
                  });
                  function loadImg(list, num, tempimgp) {
                      if (list.length > 0) {
                        var imgpath = "";
                        if(api.systemType=="ios"){
                          imgpath = list[0].thumbPath;
                        }
                        if(api.systemType=="android"){
                          imgpath = list[0].path;
                        }
                        imageFilter.getAttr({
                            path: imgpath,
                        }, function(ret, err){
                            if( ret.status ){
                              var tempwidth = ret.width;
                              var tempheight = ret.height;
                              var bili = tempwidth / tempheight;
                              var width = 0;
                              var height = 1200
                              if(height>tempheight){
                                height = tempheight
                                width = tempwidth
                              }else{
                                height = 1200;
                                width = height * bili;
                              }
                              if(width>tempwidth){
                                height = tempheight
                                width = tempwidth
                              }
                              imageFilter.compress({
                                  img: imgpath,
                                  isClarityimg: false,
                                  quality: 1,
                                  size: {
                                    w : width,
                                    h : height
                                  },
                                  save: {
                                    album : false,
                                    imgPath : "fs://ocnAttach_Img/cityComponent/",
                                    imgName : '0' + num + '.jpg'
                                  },
                              }, function(ret, err){
                                  if( ret.status ){
                                      var pathtemp = api.fsDir + "/ocnAttach_Img/cityComponent/0" + num + ".jpg";
                                      tempimgp = tempimgp + '<div class="ev_atlas_one" id="imgWrap' + num + '">';
                                      tempimgp = tempimgp + '<img src="../../image/icon_del.png" onclick="mCityComponent.deleteImg(\'' + pathtemp + '\',\'' + num + '\')" />  ';
                                      tempimgp = tempimgp + "<img src='" + api.fsDir + "/ocnAttach_Img/cityComponent/0" + num + ".jpg" + "' onclick='mCityComponent.openImg(\"" + pathtemp + "\")'/></div>";
                                      mCityComponent.imgPaths.push(api.fsDir + "/ocnAttach_Img/cityComponent/0" + num + ".jpg");
                                      mCityComponent.imgNum++;
                                      list.splice(0, 1);
                                      loadImg(list, mCityComponent.imgNum, tempimgp);//遍历数组
                                  }else{
                                      alert( JSON.stringify( err ) );
                                  }
                              });

                            }else{
                                alert( JSON.stringify( err ) );
                            }
                        });

                      }else{
                          $api.append($api.dom("#imgAdd"),tempimgp);
                      }
                  }// loadImg end.
                },
                cancelli:function(){
                    mCityComponent.vue.hideItem();
                },

            },
            components:{"form-item":{
                template:"#item-element", //模版内容
                props:["titlename","myclass"],
                methods:{
                },
              }
            },
        });
    },
    submitForm:function(){
      var formInfoJson = {}; //表单json
      var submitJson = {}; //提交的json
      UICore.showLoading("上传表单数据中","请稍侯");
      if (mCityComponent.mStatus == "isNew") {
          formInfoJson.id = ""; //新增时传空，编辑时传已有的id
      }else if (mCityComponent.mStatus == "isEdit"){
          formInfoJson.id = mCityComponent.infoJSON.id;
      }
      formInfoJson.componentName = mCityComponent.vue.componentName;
      formInfoJson.componentCode = mCityComponent.vue.componentCode;
      formInfoJson.componentType = mCityComponent.vue.componentTypeID;
      formInfoJson.componentSubType = mCityComponent.vue.componentSecondTypeID;
      formInfoJson.componentStatue = mCityComponent.vue.componentStatusID;
      formInfoJson.initialInvestigationTime = mCityComponent.vue.initialInvestigationTime;
      formInfoJson.changeInvestigationTime = mCityComponent.vue.changeInvestigationTime;
      formInfoJson.departmentId = mCityComponent.vue.chargeDeparmentID;
      formInfoJson.ownershipUnitId = mCityComponent.vue.ownershipUnitID;
      formInfoJson.maintenanceUnitId = mCityComponent.vue.componentName;
      formInfoJson.maintainerId = mCityComponent.vue.maintenancePersonID;
      formInfoJson.maintainerName = mCityComponent.vue.maintenancePerson;
      formInfoJson.maintainerPhone = mCityComponent.vue.maintenancePersonPhone;
      formInfoJson.maintenanceMode = mCityComponent.vue.maintenanceWayID;
      formInfoJson.maintenanceType = mCityComponent.vue.maintenanceTypeID;
      formInfoJson.maintenanceTime = mCityComponent.vue.maintenanceTime;
      formInfoJson.lnglat = mCityComponent.vue.locationGPS;
      formInfoJson.remark = mCityComponent.vue.remark;
      formInfoJson.extendAtt = {};
      formInfoJson.data_area_code = mCityComponent.vue.componentGirdCode;

      submitJson.citycomponent = formInfoJson;

      console.log(UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=edit&data=' + JSON.stringify(submitJson));
      api.ajax({
          url: UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=edit&data=' + JSON.stringify(submitJson),
          method: 'get',
      }, function(ret, err) {
          api.hideProgress();
          if (ret) {
              console.log(JSON.stringify(ret));
              if (ret.success) {
                  api.toast({
                      msg: '提交成功',
                      duration: 2000,
                      location: 'bottom'
                  });
                  if(mCityComponent.mStatus == "isEdit"){
                    api.sendEvent({
                      name: 'refreshResultList',
                      extra: {
                        queryParam: mCityComponent.queryParam,
                      }
                    });
                  }
                  api.closeWin();
              } else {
                  alert(ret.errorinfo);
              }
          } else {
              alert(JSON.stringify(err));
          }
      });
    },
    deleteImg:function(path,index){
        console.log("删除选中图片");
        api.confirm({
    			title : '提示',
    			msg : '确定要删除图片吗？',
    			buttons : ['确定', '取消']
    		}, function(ret, err) {
    			var buttonIndex = ret.buttonIndex;
    			if(buttonIndex==1){
    				mCityComponent.removeByValue(mCityComponent.imgPaths,path);//从数组中删除对应的数据
            $api.remove($api.dom("#imgWrap"+index));//从布局中删除对应的图片视图

    			}
    		});
    },
    openImg:function(path){
      var imgindex = this.findIndex(mCityComponent.imgPaths,path);
      var imageBrowser = api.require('imageBrowser');

      imageBrowser.openImages({
        imageUrls : mCityComponent.imgPaths,
        showList : false,
        activeIndex : imgindex,
        tapClose : true
      });
    },
    removeByValue:function(arr, val) {
  	  for(var i=0; i<arr.length; i++) {
  	    if(arr[i] == val) {
  	      arr.splice(i, 1);
  	      break;
  	    }
  	  }
  	},
    findIndex:function(arr, val){
  	  for(var i=0; i<arr.length; i++) {
  	    if(arr[i] == val) {
  	      return i;
  	      break;
  	    }
  	  }
  	},
    getLocation:function() {
      var that = this;
  		var baiduLocation = api.require('baiduLocation');
  		baiduLocation.startLocation({
  			accuracy : '10m',
  			filter : 5,
  			autoStop : true,
  		}, function(ret, err) {
  			if (ret.status) {
          console.log("location GPS:  " +  JSON.stringify(ret));
  				var latitude = ret.latitude;// 纬度，浮点数，范围为90 ~ -90
  				var longitude = ret.longitude// 经度，浮点数，范围为180 ~ -180。
  				var accuracy = ret.accuracy;// 位置精度
  				// var gcj02 = bd09togcj02(longitude,latitude);
  				// var wgs84 = gcj02towgs84(gcj02[0],gcj02[1]);
  				// var url_ = new SnCal().getAddrByLatLonUrl(wgs84[1], wgs84[0]);
  				// doGetByloadScript(url_);
          that.vue.locationGPS = latitude + "," + longitude;
  			} else {
  				alert("定位失败");
  			}
  		});
  	},
    checkValue: function() {
        return true;
    },


};
