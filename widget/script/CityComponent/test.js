window.apiready = function(){
  new Vue({
      el: "#list",
      data: {
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

          imgarr: {
              imgpaths: [], //图片地址存放数组
              videopaths: [], //视频地址存放数组
              imgnum: 0, //图片全局索引
              videonum: 0, //视频全局索引
              attachmentId:"",//附件ID
          },
          show: { //控制父组件和子组件部分DIV的显示和隐藏
              camerashow: false,
              videoshow: false,
              bgshow: false
          },

      },
      created:function(){
        var param = api.pageParam;
        if (param != "" && param != "undefined") {
            if(param.status){
              this.mStatus = param.status;
            }

            if (this.mStatus == "isBrownse") {
              this.isClick = true;//不可编辑
              this.queryParam = param.queryParam;
              this.infoJSON = param.data;
            }
        }

        this.initSelectData();

        if (this.mStatus == "isNew") {
          this.componentGirdCode = $api.getStorage('userinf').dataAreaCode;
        }

        if (this.mStatus == "isBrownse") {
          $api.text($api.byId('pkh_add_su'), '编辑');
          this.isClick = true;
          this.setDataToView();
        }
      },
      methods: {
        initSelectData:function(){
          UICore.showLoading("正在初始化数据", "请稍等");

          this.getSpinnerValue("CityComponent_ComponentType",this.componentType_arr);//部件类型
          this.getSpinnerValue2("CityComponent_ComponentStatue",this.componentStatus_arr);//部件状态
          this.getSpinnerValue2("CityComponent_MaintenanceType",this.maintenanceType_arr);//维护类型
          this.getSpinnerValue2("CityComponent_MaintenanceMode",this.maintenanceWay_arr);//维护方式
          if (this.mStatus == "isNew") {
            this.getLocation();
          }
          api.hideProgress();
        },
        getSpinnerValue:function(key,dataArr){
            var _self = this;
            console.log("获取下拉条数据 : " + key);
            console.log(UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getSysCategoryByCode&code=' + key);
            api.ajax({
                url: UICore.serviceUrl + 'mobile/MobileCityComponent.shtml?act=getSysCategoryByCode&code=' + key,
                method: 'get',
            },function(ret, err){
                if (ret) {
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
                          if(key=="CityComponent_ComponentType"){
                            console.log("城市部件类型：  " + JSON.stringify(_self.componentType_arr));
                            _self.componentType_arr.forEach(function(value,index,arr){
                              if (arr[index].key == _self.infoJSON.componentType) {
                                _self.componentType = arr[index].text;
                                _self.componentTypeID = arr[index].key;
                                arr[index].status = "selected";
                                _self.getSpinnerValue(arr[index].key,_self.componentSecondType_arr);
                              }
                            });
                          }else{
                            _self.componentSecondType_arr.forEach(function(value,index,arr){
                              if (arr[index].key == _self.infoJSON.componentSubType) {
                                _self.componentSecondType = arr[index].text;
                                _self.componentSecondTypeID = arr[index].key;
                                arr[index].status = "selected";
                              }
                            });
                          }


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
            var _self = this;
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
                          if(key=="CityComponent_ComponentStatue"){
                            console.log("城市部件状态：  " + JSON.stringify(_self.componentStatus_arr));
                            _self.componentStatus_arr.forEach(function(value,index,arr){
                              if (arr[index].key == _self.infoJSON.componentStatue) {
                                _self.componentStatus = arr[index].text;
                                _self.componentStatusID = arr[index].key;
                                arr[index].status = "selected";
                              }
                            });
                          }
                          if(key=="CityComponent_MaintenanceType"){
                            console.log("城市部件维护类型：  " + JSON.stringify(_self.maintenanceType_arr));
                            _self.maintenanceType_arr.forEach(function(value,index,arr){
                              if (arr[index].key == _self.infoJSON.maintenanceType) {
                                _self.maintenanceType = arr[index].text;
                                _self.maintenanceTypeID = arr[index].key;
                                arr[index].status = "selected";
                              }
                            });
                          }
                          if(key=="CityComponent_MaintenanceMode"){
                            console.log("城市部件维护方式：  " + JSON.stringify(_self.maintenanceWay_arr));
                            _self.maintenanceWay_arr.forEach(function(value,index,arr){
                              if (arr[index].key == _self.infoJSON.maintenanceMode) {
                                _self.maintenanceWay = arr[index].text;
                                _self.maintenanceWayID = arr[index].key;
                                arr[index].status = "selected";
                              }
                            });
                          }
                      } else {
                          alert("初始化失败，数据为空");
                      }
                    }
                }
            });
        },
        setDataToView:function(){
            var _self = this;
            console.log("城市部件详情：  " + JSON.stringify(this.infoJSON));
            this.componentName = this.infoJSON.componentName;
            this.componentCode = this.infoJSON.componentCode;
            this.initialInvestigationTime = this.infoJSON.initialInvestigationTime;
            this.changeInvestigationTime = this.infoJSON.changeInvestigationTime;
            this.componentGirdCode = this.infoJSON.dataAreaCode;
            this.chargeDeparmentID = this.infoJSON.departmentId;
            this.chargeDeparment = this.infoJSON.departmentName;
            this.chargeDeparmentCode = this.infoJSON.departmentCode;
            this.ownershipUnitID = this.infoJSON.ownershipUnitId;
            this.ownershipUnit = this.infoJSON.ownershipUnitName;
            this.ownershipUnitCode = this.infoJSON.ownershipUnitCode;
            this.maintenanceUnitID = this.infoJSON.maintenanceUnitId;
            this.maintenanceUnit = this.infoJSON.maintenanceUnitName;
            this.maintenanceUnitCode = this.infoJSON.maintenanceUnitCode;
            this.maintenancePersonID = this.infoJSON.maintainerId;
            this.maintenancePerson = this.infoJSON.maintainerName;
            this.maintenancePersonPhone = this.infoJSON.maintainerPhone;
            this.maintenanceTime = this.infoJSON.maintenanceTime;
            this.locationGPS = this.infoJSON.lnglat;
            this.remark = this.infoJSON.remark;
            this.imgarr.attachmentId = this.infoJSON.attachmentId;
            if(this.imgarr.attachmentId){
              this.imgarr.imgpaths.push(UICore.serviceUrl+this.infoJSON.uploadPath)
            }


        },
        closeWin:function(){
          api.closeWin();

        },
        submitForm:function(){
          var formInfoJson = {}; //表单json
          var submitJson = {}; //提交的json
          UICore.showLoading("上传表单数据中","请稍侯");
          if (this.mStatus == "isNew") {
              formInfoJson.id = ""; //新增时传空，编辑时传已有的id
          }else if (this.mStatus == "isEdit"){
              formInfoJson.id = this.infoJSON.id;
          }
          formInfoJson.componentName = this.componentName;
          formInfoJson.componentCode = this.componentCode;
          formInfoJson.componentType = this.componentTypeID;
          formInfoJson.componentSubType = this.componentSecondTypeID;
          formInfoJson.componentStatue = this.componentStatusID;
          formInfoJson.initialInvestigationTime = this.initialInvestigationTime;
          formInfoJson.changeInvestigationTime = this.changeInvestigationTime;
          formInfoJson.departmentId = this.chargeDeparmentID;
          formInfoJson.ownershipUnitId = this.ownershipUnitID;
          formInfoJson.maintenanceUnitId = this.maintenanceUnitID;
          formInfoJson.maintainerId = this.maintenancePersonID;
          formInfoJson.maintainerName = this.maintenancePerson;
          formInfoJson.maintainerPhone = this.maintenancePersonPhone;
          formInfoJson.maintenanceMode = this.maintenanceWayID;
          formInfoJson.maintenanceType = this.maintenanceTypeID;
          formInfoJson.maintenanceTime = this.maintenanceTime;
          formInfoJson.lnglat = this.locationGPS;
          formInfoJson.remark = this.remark;
          formInfoJson.extendAtt = {};
          formInfoJson.data_area_code = this.componentGirdCode;
          formInfoJson.attachmentId = this.imgarr.attachmentId;

          submitJson.citycomponent = formInfoJson;

          var _self = this;
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
                          global: 'true',
                          location: 'bottom'
                      });
                      if(_self.mStatus == "isEdit"){
                        api.sendEvent({
                          name: 'refreshResultList',
                          extra: {
                            queryParam: _self.queryParam,
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
            var _self = this;
            api.confirm({
        			title : '提示',
        			msg : '确定要删除图片吗？',
        			buttons : ['确定', '取消']
        		}, function(ret, err) {
        			var buttonIndex = ret.buttonIndex;
        			if(buttonIndex==1){
        				_self.removeByValue(_self.imgPaths,path);//从数组中删除对应的数据
                $api.remove($api.dom("#imgWrap"+index));//从布局中删除对应的图片视图

        			}
        		});
        },
        openImg:function(path){
          var imgindex = this.findIndex(this.imgPaths,path);
          var imageBrowser = api.require('imageBrowser');

          imageBrowser.openImages({
            imageUrls : this.imgPaths,
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
          var _self = this;
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
              _self.locationGPS = longitude + "," + latitude;
      			} else {
      				alert("定位失败");
      			}
      		});
      	},
        checkValue: function() {
            return true;
        },
        submit:function(){
          if (this.mStatus == "isBrownse") {
              $api.text($api.dom("#pkh_add_su"), '提交');
              this.isClick = false;
              this.mStatus = 'isEdit';
          }else{
            if (this.checkValue()) {
              UICore.showLoading("上传附件中","请稍侯");
              if(this.imgarr.imgpaths.length>0&&!(this.imgarr.imgpaths[0].indexOf("http")>-1)){
                console.log(UICore.serviceUrl+'mobile/mobileWf.shtml?act=uploadAttachment&accountId=' + $api.getStorage('userinf').accountId);
                console.log("imgPaht: " + JSON.stringify(this.imgarr.imgpaths));
                var _self = this;
                api.ajax({
                    url:UICore.serviceUrl + 'mobile/mobileWf.shtml?act=uploadAttachment&accountId=' + $api.getStorage('userinf').accountId ,
                    method: 'post',
                    data: {
                      files : {
                        file : this.imgarr.imgpaths,
                      }
                    }
                },function(ret, err){
                    api.hideProgress();
                    if (ret) {
                        if(ret.success){
                          _self.imgarr.attachmentId = ret.data;
                        }
                        _self.submitForm();
                    } else {
                        alert( "附件上传失败" );
                    }
                });
              }else{
                this.submitForm();
              }


            }
          }
        },
          componentTypef: function() {
              console.log("部件类型");
              var _self = this;
              if (!_self.isClick) {
                  var defaultVal = _self.componentType; //获取默认值
                  if (defaultVal != null && defaultVal != "") {
                      _self.componentType_arr.forEach(function(value, index, arr) {
                          if (value.text == _self.componentType) {
                              arr[index].status = "selected";
                          }
                      });
                  }else{
                    _self.componentType_arr.forEach(function(value, index, arr) {
                        arr[index].status = "normal";
                    });
                  }

                  UICore.openSelect3(_self.componentType_arr, _self.componentType, "componentType");
                  api.addEventListener({
                      name: 'componentType'
                  }, function(ret, err) {
                      if (ret) {
                          console.log(JSON.stringify(ret.value.key1));
                          _self.componentType = ret.value.key1;
                          _self.componentTypeID = ret.value.key2;
                          _self.componentSecondType_arr = [];
                          _self.componentSecondType = "";
                          _self.componentSecondTypeID = "";
                          _self.getSpinnerValue(ret.value.key2,_self.componentSecondType_arr);
                      } else {
                          alert(JSON.stringify(err));
                      }
                  });
              }
          },
          componentSecondTypef: function() {
                console.log("部件子类型");
                var _self = this;
                if (!_self.isClick) {
                    var defaultVal = _self.componentSecondType; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        _self.componentSecondType_arr.forEach(function(value, index, arr) {
                            if (value.text == _self.componentSecondType) {
                                arr[index].status = "selected";
                            }
                        });
                    }else{
                      _self.componentSecondType_arr.forEach(function(value, index, arr) {
                          arr[index].status = "normal";
                      });
                    }

                    UICore.openSelect3(_self.componentSecondType_arr, _self.componentSecondType, "componentSecondType");
                    api.addEventListener({
                        name: 'componentSecondType'
                    }, function(ret, err) {
                        if (ret) {
                            console.log(JSON.stringify(ret.value.key1));
                            _self.componentSecondType = ret.value.key1;
                            _self.componentSecondTypeID = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
          },
          componentCreateTimef: function() {
              console.log("初始调查时间");
              var _self = this;
              if (!_self.isClick) {
                  UICore.openTimeComponent2(_self.initialInvestigationTime,_self.initialInvestigationTime);
                  api.addEventListener({
                      name: 'buildingTime' //广播接收key，已写死。
                  }, function(ret, err) {
                      if (ret) {
                          _self.initialInvestigationTime = ret.value.key1;
                      } else {
                          alert(JSON.stringify(err));
                      }
                  });
              }
          },
          componentUpdateTimef: function() {
              console.log("变更调查时间");
              var _self = this;
              if (!_self.isClick) {
                  UICore.openTimeComponent2(_self.changeInvestigationTime,_self.changeInvestigationTime);
                  api.addEventListener({
                      name: 'buildingTime' //广播接收key，已写死。
                  }, function(ret, err) {
                      if (ret) {
                          _self.changeInvestigationTime = ret.value.key1;
                      } else {
                          alert(JSON.stringify(err));
                      }
                  });
              }
          },
          componentStatusf: function() {
            console.log("部件状态");
            var _self = this;
            if (!_self.isClick) {
                var defaultVal = _self.componentStatus; //获取默认值
                if (defaultVal != null && defaultVal != "") {
                    _self.componentStatus_arr.forEach(function(value, index, arr) {
                        if (value.text == _self.componentStatus) {
                            arr[index].status = "selected";
                        }
                    });
                }else{
                  _self.componentStatus_arr.forEach(function(value, index, arr) {
                      arr[index].status = "normal";
                  });
                }

                UICore.openSelect3(_self.componentStatus_arr, _self.componentStatus, "componentStatus");
                api.addEventListener({
                    name: 'componentStatus'
                }, function(ret, err) {
                    if (ret) {
                        console.log(JSON.stringify(ret.value.key1));
                        _self.componentStatus = ret.value.key1;
                        _self.componentStatusID = ret.value.key2;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            }
          },

          chargeDeparmentf: function() {
              // 查询企业
              console.log("主管部门");
              var _self = this;
              if (!_self.isClick) {
                api.openWin({
                  name: 'deptList',
                  url: './deptList.html',
                  pageParam: {
                    from: 'cityComponent'
                  }
                });
                api.addEventListener({
                  name: 'cityComponentQueryDept'
                }, function(ret, err) {
                  if (ret) {
                    console.log("选择的企业item JSON： " + JSON.stringify(ret));
                    _self.chargeDeparmentID = ret.value.data.id;
                    _self.chargeDeparment = ret.value.data.deptName;
                    _self.chargeDeparmentCode = ret.value.data.deptCode;
                  } else {
                    alert(JSON.stringify(err));
                  }
                });
              }
          },
          ownershipUnitf: function() {
              // 查询企业
              console.log("权属单位");
              var _self = this;
              if (!_self.isClick) {
                api.openWin({
                  name: 'legalPersonQuery',
                  url: '../legalPerson/legalPersonList.html',
                  pageParam: {
                    from: 'cityComponent'
                  }
                });
                api.addEventListener({
                  name: 'cityComponentQueryResult'
                }, function(ret, err) {
                  if (ret) {
                    console.log("选择的企业item JSON： " + JSON.stringify(ret));
                    _self.ownershipUnitID = ret.value.data.id;
                    _self.ownershipUnit = ret.value.data.unitName;
                    _self.ownershipUnitCode = ret.value.data.organizationCode;
                  } else {
                    alert(JSON.stringify(err));
                  }
                });

              }
          },
          maintenanceUnitf: function() {
              // 查询企业
              console.log("维护单位");
              var _self = this;
              if (!_self.isClick) {
                api.openWin({
                  name: 'legalPersonQuery',
                  url: '../legalPerson/legalPersonList.html',
                  pageParam: {
                    from: 'cityComponent'
                  }
                });
                api.addEventListener({
                  name: 'cityComponentQueryResult'
                }, function(ret, err) {
                  if (ret) {
                    console.log("选择的企业item JSON： " + JSON.stringify(ret));
                    _self.maintenanceUnitID = ret.value.data.id;
                    _self.maintenanceUnit = ret.value.data.unitName;
                    _self.maintenanceUnitCode = ret.value.data.organizationCode;
                  } else {
                    alert(JSON.stringify(err));
                  }
                });

              }
          },
          maintenanceTypef: function() {
            console.log("维护类型");
            var _self = this;
            if (!_self.isClick) {
                var defaultVal = _self.maintenanceType; //获取默认值
                if (defaultVal != null && defaultVal != "") {
                    _self.maintenanceType_arr.forEach(function(value, index, arr) {
                        if (value.text == _self.maintenanceType) {
                            arr[index].status = "selected";
                        }
                    });
                }else{
                  _self.maintenanceType_arr.forEach(function(value, index, arr) {
                      arr[index].status = "normal";
                  });
                }

                UICore.openSelect3(_self.maintenanceType_arr, _self.maintenanceType, "maintenanceType");
                api.addEventListener({
                    name: 'maintenanceType'
                }, function(ret, err) {
                    if (ret) {
                        console.log(JSON.stringify(ret.value.key1));
                        _self.maintenanceType = ret.value.key1;
                        _self.maintenanceTypeID = ret.value.key2;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            }
          },
          maintenanceWayf: function() {
            console.log("维护方式");
            var _self = this;
            if (!_self.isClick) {
                var defaultVal = _self.maintenanceWay; //获取默认值
                if (defaultVal != null && defaultVal != "") {
                    _self.maintenanceWay_arr.forEach(function(value, index, arr) {
                        if (value.text == _self.maintenanceWay) {
                            arr[index].status = "selected";
                        }
                    });
                }else{
                  _self.maintenanceWay_arr.forEach(function(value, index, arr) {
                      arr[index].status = "normal";
                  });
                }

                UICore.openSelect3(_self.maintenanceWay_arr, _self.maintenanceWay, "maintenanceWay");
                api.addEventListener({
                    name: 'maintenanceWay'
                }, function(ret, err) {
                    if (ret) {
                        console.log(JSON.stringify(ret.value.key1));
                        _self.maintenanceWay = ret.value.key1;
                        _self.maintenanceWayID = ret.value.key2;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            }
          },
          maintenanceTimef: function() {
              console.log("维护时间");
              var _self = this;
              if (!_self.isClick) {
                  UICore.openTimeComponent2(_self.maintenanceTime,_self.maintenanceTime);
                  api.addEventListener({
                      name: 'buildingTime' //广播接收key，已写死。
                  }, function(ret, err) {
                      if (ret) {
                          _self.maintenanceTime = ret.value.key1;
                      } else {
                          alert(JSON.stringify(err));
                      }
                  });
              }
          },
          selectMaintenancePerson: function() {
              var _self = this;
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
                      _self.maintenancePersonID = personJson.id;
                      _self.maintenancePerson = personJson.name;
                      _self.maintenancePersonPhone = personJson.telephone;

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
          cancelli:function(){
              this.hideItem();
          },

      },
      components:{
        "form-item":{
          template:"#item-element", //模版内容
          props:["titlename","myclass"],
          methods:{
          },
        },
        //附件上传组件
        'attach-comp': {
            template: "#attach-template",
            props: ['myshow', 'imgarray'], //一个指向父组件中的show，一个指向父组件中的imgarr,必须指向含有子属性的值，VUE2.0子组件只能修改父组件属性中的子属性值
            data: function() {
                return {
                    imgtemps: [] //图片地址临时存放，为了选择多个图片时候一起显示出来，因为要递归压缩图片，如果不存，会一张一张的显示图片
                }
            },
            methods: {
                //显示附件选择DIV
                showItem: function(type) {
                    if (type == 'video') {
                        this.myshow.videoshow = true;
                        this.myshow.bgshow = true;
                    } else if (type == 'photo') {
                        this.myshow.camerashow = true;
                        this.myshow.bgshow = true;
                    }
                },
                //关闭附件选择DIV
                closeItem: function() {
                    this.myshow.videoshow = false;
                    this.myshow.camerashow = false;
                    this.myshow.bgshow = false;
                },
                //拍照
                camera_img: function() {
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
                    }, function(ret, err) {
                        if (ret) {
                            var imgpath = ret.data;
                            if (imgpath != "") {
                                imageFilter.getAttr({
                                    path: imgpath
                                }, function(ret, err) {
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
                                        }, function(ret, err) {
                                            if (ret.status) {
                                                var pathtemp = api.fsDir + "/test/0" + mycomponent.imgarray.imgnum + ".jpg";
                                                mycomponent.imgarray.imgpaths.splice(0,mycomponent.imgarray.imgpaths.length)
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
                getImg: function() {
                    this.closeItem();
                    this.imgtemps = [];
                    var mycomponent = this;
                    var imageFilter = api.require('imageFilter');
                    var UIMediaScanner = api.require('UIMediaScanner');
                    UIMediaScanner.open({
                        type: 'picture',
                        column: 4,
                        classify: true,
                        max: 1,
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
                    }, function(ret) {
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
                            }, function(ret, err) {
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
                                    }, function(ret, err) {
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
                            mycomponent.imgarray.imgpaths.splice(0,mycomponent.imgarray.imgpaths.length);
                            mycomponent.imgarray.imgpaths = mycomponent.imgarray.imgpaths.concat(mycomponent.imgtemps);
                            //$("#imgAdd").append(tempimgp);
                        }
                    }
                },
                //预览图片
                openImg: function(pathtemp) {
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
                findIndex: function(arr, val) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] == val) {
                            return i;
                            break;
                        }
                    }
                },
                //删除图片
                deleteImg: function(pathtemp, index) {
                    var mycomponent = this;
                    api.confirm({
                        title: '提示',
                        msg: '确定要删除图片吗？',
                        buttons: ['确定', '取消']
                    }, function(ret, err) {
                        var buttonIndex = ret.buttonIndex;
                        if (buttonIndex == 1) {
                            mycomponent.removeByValue(mycomponent.imgarray.imgpaths, pathtemp);
                        }
                    });
                },
                //从图片数组中删除
                removeByValue: function(arr, val) {
                    this.imgarray.attachmentId = "";
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] == val) {
                            arr.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        },
      },
      computed:{
          initialInvestigationTime_computed:function(){
            return this.initialInvestigationTime?this.initialInvestigationTime.substring(0,10):"";
          },
          changeInvestigationTime_computed:function(){
            return this.changeInvestigationTime?this.changeInvestigationTime.substring(0,10):"";
          },
          maintenanceTime_computed:function(){
            return this.maintenanceTime?this.maintenanceTime.substring(0,10):"";
          }

      },
  });
}
