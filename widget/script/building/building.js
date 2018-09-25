/**
 * Created by kevin on 2017/7/4.
 */
apiready = function() {
    new Vue({
        el: "#list",
        data: {
            isNew: true, //是否是新增
            isBrowser: false, //是否是浏览模式
            isClick: false,
            params: {}, //传参

            idz: "", //编辑提交时所需id
            data_area_codez: "", //编辑提交时所需data_area_code
            codez: "", //编辑提交时所需code
            villageOrCommunityCodz: "", //编辑提交时所需villageOrCommunityCode
            unitArray: [], //编辑单元点击后返回的数组
            editUnitObj: {}, //编辑单元对象
            expandjson: {}, //扩展信息json
            expandstr: "", //表单预览数据
            edited:false,
            buildingType_arr: [], //楼号类型
            unit_arr: [], //单元(梯/区)
            monomerBuilding_arr: [], //单体楼
            housingSource_arr: [], //房屋来源
            ownershipType_arr: [], //权属类型
            structureType_arr: [], //结构类型
            inType_arr: [], //入住类型
            constructionApplications_arr: [], //建筑用途
            architecturalNature_arr: [], //建筑性质
            buildingtypes_arr: [], //建筑类型
            expandTab_arr: [], //扩展信息

            address: "", //地址
            buildingName: "", //建筑名称
            buildingType: "", //楼号类型
            buildingNum: "", //楼号
            mapNum: "", //地图编号
            unit: "", //单元(梯/区)
            editUnit: "", //编辑单元
            propertyOwner: "", //产权人
            monomerBuilding: "", //单体楼
            housingSource: "", //房屋来源
            ownershipType: "", //权属类型
            structureType: "", //结构类型
            inType: "", //入住类型
            constructionApplications: "", //建筑用途
            architecturalNature: "", //建筑性质
            buildingtypes: "", //建筑类型
            buildingStorey: "", //建筑层数
            buildingHeight: "", //建筑高度
            durableYears: "", //使用年限
            floorArea: "", //占地面积
            coveredArea: "", //建筑面积
            buildingTime: "", //建筑时间
            manager: "", //物业管理
            principal: "", //负责人
            contactNumber: "", //联系电话

            // expands: buildingObj.expandTab_arr,
        },
        beforeCreate: function() {
            UICore.showLoading("正在加载中...", "请稍候");
        },
        created: function() {
            var param = api.pageParam;
            console.log(JSON.stringify(param));
            var that = this; //保存指针供回调使用
            if (param && param.title == "buildingResult") {
                this.isBrowser = true;
                this.isClick = this.isBrowser
                this.isNew = false;
                this.params = param.infos;
                $api.text($api.byId('pkh_add_su'), '编辑');
                $api.text($api.byId('titlename'), '编辑建筑');

            } else { //新增  新增房户 则建筑信息不可编辑
                this.params = param.infos;
            };

            this.buildingType_arr.push({ //楼号类型
                text: "原有楼号",
                status: 'normal',
                key: 1
            }, {
                text: "自编楼号",
                status: 'normal',
                key: 2
            });
            this.unit_arr.push({ //单元(梯/区)
                text: "多单元",
                status: 'normal',
                key: 1
            }, {
                text: "自编",
                status: 'normal',
                key: 2
            });
            var jsonData = JSON.parse($api.getStorage('settingdata'));
            jsonData.data.forEach(function(value) {
                if (value.parentKey == "BD_Basic_BDSingle") { //单体楼
                    that.monomerBuilding_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "BD_Basic_BDSour") { //房屋来源
                    that.housingSource_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "BD_Basic_BDOwnerType") { //权属类型
                    that.ownershipType_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "BD_Basic_BDStruType") { //结构类型
                    that.structureType_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "BD_Basic_BDLivType") { //入住类型
                    that.inType_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "BD_Basic_BDUse") { //建筑用途
                    that.constructionApplications_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "BD_Basic_BDProperty") { //建筑性质
                    that.architecturalNature_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "BD_Basic_BDType") { //建筑类型
                    that.buildingtypes_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
            }); //配置文件循环结束
            if (this.isBrowser) {
                console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=getBuildingInfo&data={buiId:' + param.name + '}');
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=getBuildingInfo&data={buiId:' + param.name + '}',
                    method: 'get',
                }, function(ret, err) {
                    if (ret) {
                        if (ret.success) {
                          console.log(JSON.stringify(ret.data));
                            that.idz = ret.data.id;
                            that.data_area_codez = ret.data.dataAreaCode;

                            that.codez = ret.data.code; // 建筑编号隐藏,新建由后台自动生成，再次编辑需要传给后台
                            that.villageOrCommunityCodez = ret.data.village;


                            that.address = ret.data.address; //地址
                            that.buildingName = ret.data.buiName; //建筑名称
                            if(ret.data.buiCode){
                              that.buildingType_arr[0].status = "selected";
                              that.buildingType = that.buildingType_arr[0].text;
                              that.buildingNum=ret.data.buiCode;
                            }else{
                              that.buildingType_arr[1].status = "selected";
                              that.buildingType = that.buildingType_arr[1].text;
                              that.buildingNum=ret.data.buiCustomCode
                            }
                            // var index = parseInt(ret.data.buiType);
                            // if (!isNaN(index)) {
                            //     that.buildingType_arr[index - 1].status = "selected";
                            //     that.vue.buildingType = that.buildingType_arr[index - 1].text;
                            // };//楼号类型

                            // if(param.name.buiType){
                            //   if (param.name.buiType== "原有楼号") { //楼号类型

                            // if ((ret.data.buiCode).indexOf("号楼") > -1) {
                            //     that.buildingNum = (ret.data.buiCode).substring(0, (ret.data.buiCode).length - 2); //楼号
                            // } else {
                            //     that.buildingNum = ret.data.buiCode; //楼号
                            // }
                            //   } else if (vue.buildingType == "自编楼号") {
                            //       vue.buildingNum=param.name.name.bui_custom_code;
                            //   }
                            // }

                            that.mapNum = ret.data.entityId; //地图编号

                            that.editUnit = ret.data.unitList.length; //编辑单元数量
                            that.editUnitObj = ret.data.unitList; //编辑单元对象

                            that.propertyOwner = ret.data.owner; //产权人

                            var index = parseInt(ret.data.whetherSingle);
                            if (!isNaN(index)) {
                                that.monomerBuilding_arr[index - 1].status = "selected";
                                that.monomerBuilding = that.monomerBuilding_arr[index - 1].text;
                            }; //单体楼
                            var index = parseInt(ret.data.housingSource);
                            if (!isNaN(index)) {
                                that.housingSource_arr[index - 1].status = "selected";
                                that.housingSource = that.housingSource_arr[index - 1].text;
                            }; //房屋来源
                            var index = parseInt(ret.data.ownershipType);
                            if (!isNaN(index)) {
                                that.ownershipType_arr[index - 1].status = "selected";
                                that.ownershipType = that.ownershipType_arr[index - 1].text;
                            }; //权属类型
                            var index = parseInt(ret.data.structureType);
                            if (!isNaN(index)) {
                                that.structureType_arr[index - 1].status = "selected";
                                that.structureType = that.structureType_arr[index - 1].text;
                            }; //结构类型
                            var index = parseInt(ret.data.livingType);
                            if (!isNaN(index)) {
                                that.inType_arr[index - 1].status = "selected";
                                that.inType = that.inType_arr[index - 1].text;
                            }; //入住类型
                            var index = parseInt(ret.data.housingSource);
                            if (!isNaN(index)) {
                                that.housingSource_arr[index - 1].status = "selected";
                                that.housingSource = that.housingSource_arr[index - 1].text;
                            }; //房屋来源
                            var index = parseInt(ret.data.purpose);
                            if (!isNaN(index)) {
                                console.log(index);
                                console.log(JSON.stringify(that.constructionApplications_arr));
                                that.constructionApplications_arr[index - 1].status = "selected";
                                that.constructionApplications = that.constructionApplications_arr[index - 1].text;
                            }; //建筑用途
                            var index = parseInt(ret.data.property);
                            if (!isNaN(index)) {
                                that.architecturalNature_arr[index - 1].status = "selected";
                                that.architecturalNature = that.architecturalNature_arr[index - 1].text;
                            } //建筑性质
                            var index = parseInt(ret.data.buiType);
                            if (!isNaN(index)) {
                                that.buildingtypes_arr[index - 1].status = "selected";
                                that.buildingtypes = that.buildingtypes_arr[index - 1].text;
                            } //建筑类型

                            that.buildingStorey = ret.data.layer;
                            that.buildingHeight = ret.data.height;
                            that.durableYears = ret.data.serviceLife;
                            that.floorArea = ret.data.coverArea;
                            that.coveredArea = ret.data.buiArea;
                            that.buildingTime = ret.data.completedTime;
                            that.manager = ret.data.management;
                            that.principal = ret.data.contacts;
                            that.contactNumber = ret.data.contactInfo;
                        }
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            };

            <!--获取扩展信息开始-->
            console.log(UICore.serviceUrl + 'mobile/mobileDataCollection.shtml?act=getDynaBaseTab&data={baseKey:JZXX}');
            api.ajax({
                url: UICore.serviceUrl + 'mobile/mobileDataCollection.shtml?act=getDynaBaseTab&data={baseKey:JZXX}',
                method: 'get',
            }, function(ret, err) {
                if (ret.success) {
                    ret.data.forEach(function(value) {
                        that.expandTab_arr.push({
                            name: value.name,
                            english_name: value.english_name
                        });
                    });
                } else {
                    alert(JSON.stringify(err));
                }
            });
            <!--获取扩展信息结束-->
            api.hideProgress();
        },
        computed: {
            userName: function() {
                var userName = $api.getStorage('userinf').userName;
                if (userName) {
                    return this.principal = userName;
                } else {
                    return this.principal = "";
                }
            }

        },
        methods: {
            buildingTypef: function() { //楼号类型
                console.log("楼号类型");
                var that = this;
                if (!this.isBrowser) {
                    var defaultVal = this.buildingType; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.buildingType_arr.forEach(function(value, index, arr) {
                            if (value.text == that.buildingType) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.buildingType_arr, this.buildingType, "buildingType");
                    api.addEventListener({
                        name: 'buildingType'
                    }, function(ret, err) {
                        if (ret) {
                            that.buildingType = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                } //if语句结束
            },
            mapNumf: function() { //地图编号
                console.log("地图编号");
                var that = this;
                api.openWin({
                    name: 'buildingmap',
                    url: './buildingmap.html',
                });

                // var that = this;
                // console.log(mapcontainer.style.display);
                // mapcontainer.style.display = "block";
                // console.log("地图编号大店");
                // mapload();
                api.addEventListener({
                    name: 'mapinfo'
                }, function(ret, err) {
                    if (ret) {
                      api.closeWin({
                        name: 'buildingmap'
                      });
                        that.mapNum = ret.value.key1;
                        that.buildingName = ret.value.key2;
                        that.address = ret.value.key3;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });

            },
            unitf: function() { //单元(梯/区)
                console.log("单元(梯/区)");
                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.unit; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.unit_arr.forEach(function(value, index, arr) {
                            if (value.text == that.unit) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.unit_arr, this.unit, "unit");
                    api.addEventListener({
                        name: 'unit'
                    }, function(ret, err) {
                        if (ret) {
                            that.unit = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            editUnitf: function() { //编辑单元
                var num = this.editUnit;
                var that = this;
                console.log("编辑单元");
                if (num != "") {
                    api.openWin({
                        name: 'units',
                        url: './units.html',
                        pageParam: {
                            number: num,
                            isBrowser: that.isBrowser,
                            editUnitObj: that.editUnitObj

                        }
                    });
                    api.addEventListener({
                        name: 'unitlist'
                    }, function(ret, err) {
                        if (ret) {
                            that.editUnit = ret.value.key1.length;
                            that.unitArray = ret.value.key1;
                            console.log(JSON.stringify(that.unitArray));
                            // alert(JSON.stringify(ret.value.key1));
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                } else {
                    alert("请输入单元");
                }
            },
            propertyOwnerf: function() { //产权人
                console.log("产权人");
                var that = this;
                if (!this.isBrowser) {
                    api.openWin({
                        name: 'propertyOwner',
                        url: '../population/populationQuery.html',
                        pageParam: {
                            from: "propertyOwner"
                        }
                    });
                    api.addEventListener({
                        name: 'propertyOwner'
                    }, function(ret, err) {
                        if (ret) {
                            that.propertyOwner = ret.value.key1.name
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            monomerBuildingf: function() { //单体楼
                console.log("单体楼");
                var that = this;
                if (!this.isBrowser) {
                    var defaultVal = this.monomerBuilding; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.monomerBuilding_arr.forEach(function(value, index, arr) {
                            if (value.text == that.monomerBuilding) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.monomerBuilding_arr, this.monomerBuilding, "monomerBuilding");
                    api.addEventListener({
                        name: 'monomerBuilding'
                    }, function(ret, err) {
                        if (ret) {
                            that.monomerBuilding = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            housingSourcef: function() { //房屋来源
                console.log("房屋来源");
                var that = this;
                var defaultVal = this.housingSource; //获取默认值
                if (!this.isBrowser) {
                    if (defaultVal != null && defaultVal != "") {
                        this.housingSource_arr.forEach(function(value, index, arr) {
                            if (value.text == that.housingSource) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.housingSource_arr, this.housingSource, "housingSource");
                    api.addEventListener({
                        name: 'housingSource'
                    }, function(ret, err) {
                        if (ret) {
                            that.housingSource = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            ownershipTypef: function() { //权属类型
                console.log("权属类型");
                var that = this;
                if (!this.isBrowser) {
                    var defaultVal = this.ownershipType; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.ownershipType_arr.forEach(function(value, index, arr) {
                            if (value.text == that.ownershipType) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.ownershipType_arr, this.ownershipType, "ownershipType");
                    api.addEventListener({
                        name: 'ownershipType'
                    }, function(ret, err) {
                        if (ret) {
                            that.ownershipType = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            structureTypef: function() { //结构类型
                console.log("结构类型");
                var that = this;
                if (!this.isBrowser) {
                    var defaultVal = this.structureType; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.structureType_arr.forEach(function(value, index, arr) {
                            if (value.text == that.structureType) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.structureType_arr, this.structureType, "structureType");
                    api.addEventListener({
                        name: 'structureType'
                    }, function(ret, err) {
                        if (ret) {
                            that.structureType = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            inTypef: function() { //入住类型
                console.log("入住类型");
                var that = this;
                if (!this.isBrowser) {
                    var defaultVal = this.inType; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.inType_arr.forEach(function(value, index, arr) {
                            if (value.text == that.inType) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.inType_arr, this.inType, "inType");
                    api.addEventListener({
                        name: 'inType'
                    }, function(ret, err) {
                        if (ret) {
                            that.inType = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            constructionApplicationsf: function() { //建筑用途
                console.log("建筑用途");
                var that = this;
                if (!this.isBrowser) {
                    var defaultVal = this.constructionApplications; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.constructionApplications_arr.forEach(function(value, index, arr) {
                            if (value.text == that.constructionApplications) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.constructionApplications_arr, this.constructionApplications, "constructionApplications");
                    api.addEventListener({
                        name: 'constructionApplications'
                    }, function(ret, err) {
                        if (ret) {
                            that.constructionApplications = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            architecturalNaturef: function() { //建筑性质
                console.log("建筑性质");
                var that = this;
                if (!this.isBrowser) {
                    var defaultVal = this.architecturalNature; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.architecturalNature_arr.forEach(function(value, index, arr) {
                            if (value.text == that.architecturalNature) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    console.log(defaultVal);
                    UICore.openSelect3(this.architecturalNature_arr, this.architecturalNature, "architecturalNature");
                    api.addEventListener({
                        name: 'architecturalNature'
                    }, function(ret, err) {
                        if (ret) {
                            that.architecturalNature = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            buildingtypesf: function() { //建筑类型
                console.log("建筑类型");
                var that = this;
                if (!this.isBrowser) {
                    var defaultVal = this.buildingtypes; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.buildingtypes_arr.forEach(function(value, index, arr) {
                            if (value.text == that.buildingtypes) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.buildingtypes_arr, this.buildingtypes, "buildingtypes");
                    api.addEventListener({
                        name: 'buildingtypes'
                    }, function(ret, err) {
                        if (ret) {
                            that.buildingtypes = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            buildingTimef: function() { //建筑时间
                console.log("建筑时间");
                var that = this;
                if (!this.isBrowser) {
                    UICore.openTimeComponent2(this.buildingTime);
                    api.addEventListener({
                        name: 'buildingTime'
                    }, function(ret, err) {
                        if (ret) {
                            that.buildingTime = ret.value.key1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            expandselect: function(index, english_name, title) {

              var expandParams = this.params.extendAtt;
              console.log(expandParams)
              var that = this;
              if (this.expandstr != ""&&this.isNew) {
                  api.openWin({
                      name: 'dynamic',
                      url: '../dynamic.html',
                      pageParam: {
                          title: title,
                          name: english_name,
                          isNew:this.isNew,
                          id: this.id,
                          isBrowser: this.isBrowser,
                          attr: "{"+this.expandstr.substring(0,this.expandstr.length-1)+"}"
                      }
                  });
              }else if(!this.isNew&&this.edited){
                api.openWin({
                    name: 'dynamic',
                    url: '../dynamic.html',
                    pageParam: {
                        title: title,
                        name: english_name,
                        isNew:this.isNew,
                        edited:true,
                        id: this.id,
                        isBrowser: this.isBrowser,
                        attr: JSON.stringify(this.expandjson)
                    }
                });
              } else {
                  api.openWin({
                      name: 'dynamic',
                      url: '../dynamic.html',
                      pageParam: {
                          title: title,
                          name: english_name,
                          isNew:this.isNew,
                          id: this.id,
                          isBrowser: this.isBrowser,
                          attr: expandParams
                      }
                  });
              }

              api.addEventListener({
                  name: 'population_json'
              }, function(ret, err) {
                if(!that.isNew){
                  that.expandjson=ret.value.key;
                  that.edited=ret.value.key2
                }else{
                    that.doExpand(ret.value.key,index)
                }
              });
            }, //动态表单选择结束
            doExpand:function(value,index) {
                var s = JSON.stringify(value);
                var json = eval('(' + s + ')');
                for (var key in json) { //上个页面的json
                    var t=JSON.stringify(json[key])
                    this.expandstr += t.substring(1,t.length-1)+",";
                }
                this.expandjson=eval('(' + "{"+this.expandstr.substring(0,this.expandstr.length-1)+"}" + ')');
                  console.log(JSON.stringify(this.expandjson))
            },
            submit: function() {
                console.log("提交");
                var that = this;
                if (this.isBrowser) {
                    this.isBrowser = false;
                    this.isClick = this.isBrowser;
                    $api.text($api.byId('pkh_add_su'), '提交');
                } else {
                    var postjson = {}; //提交postjson
                    var reslutjson = {}; //最终整合真正提交的json

                    var unitjson = {}; //编辑单元的json
                    var commonjson = {}; //其他信息
                    var reslutjson = {}; //最终提交的json
                    var unitjson_arr = [];
                    if (!this.isNew) {
                        postjson.id = this.idz;
                        postjson.data_area_code = $api.getStorage('userinf').dataAreaCode;
                        if (this.codez)
                            postjson.CODE = this.codez; // 建筑编号隐藏,新建由后台自动生成，再次编辑需要传给后台
                    } else {
                        postjson.data_area_code = $api.getStorage('userinf').dataAreaCode;
                        postjson.VillageOrCommunityCode = $api.getStorage('userinf').villageOrCommunityCode;
                    }
                    postjson.GRIDID = $api.getStorage('userinf').gridCode;
                    postjson.Village = $api.getStorage('userinf').villageOrCommunityCode;
                    postjson.gridCode = $api.getStorage('userinf').gridCode;
                    postjson.District = $api.getStorage('userinf').countyCode;
                    postjson.Town = $api.getStorage('userinf').streetOrTownCode;


                    postjson.ADDRESS = this.address; //地址
                    postjson.BUI_NAME = this.buildingName; //建筑名称
                    if (this.buildingType) {
                        if (this.buildingType == "原有楼号") { //楼号类型
                            postjson.BUI_CODE = this.buildingNum; //楼号
                        } else if (this.buildingType == "自编楼号") {
                            postjson.BUI_CUSTOM_CODE = this.buildingNum;
                        }
                    }
                    // else {
                    //     alert("请选择楼号类型");
                    //     // unitArray = []; //编辑单元点击后返回的数组
                    //     postjson = {}; //建筑json
                    //     unitjson = {}; //编辑单元的json
                    //     commonjson = {}; //其他信息
                    //     this.expendjson = {}; //扩展信息json 422行
                    //     reslutjson = {}; //最终提交的json
                    //     return;
                    // }

                    postjson.ENTITYID = this.mapNum; //地图编号
                    postjson.owner = this.propertyOwner; // 产权人（屋主）
                    postjson.LAYER = this.buildingStorey; // 建筑层数
                    postjson.height = this.buildingHeight; // 建筑高度
                    postjson.serviceLife = this.durableYears; //使用年限
                    postjson.COVER_AREA = this.floorArea; // 占地面积
                    postjson.BUI_AREA = this.coveredArea; // 建筑面积
                    postjson.COMPLETED_TIME = this.buildingTime; // 建成时间
                    postjson.MANAGEMENT = this.manager; // 物业管理
                    postjson.CONTACTS = this.principal; // 采集人
                    postjson.CONTACT_INFO = this.contactNumber; // 联系电话
                    postjson.photo = "";


                    if (this.monomerBuilding) {
                        this.monomerBuilding_arr.forEach(function(value) {
                            if (that.monomerBuilding == value.text) {
                                postjson.whetherSingle = value.key; // 单体楼
                            }
                        })
                    }


                    if (this.housingSource) {
                        this.housingSource_arr.forEach(function(value) {
                            if (that.housingSource == value.text) {
                                postjson.housingSource = value.key; // 房屋来源
                            }
                        })
                    }

                    if (this.ownershipType) {
                        this.ownershipType_arr.forEach(function(value) {
                            if (that.ownershipType == value.text) {
                                postjson.ownershipType = value.key; // 权属类型
                            }
                        })
                    }
                    if (this.structureType) {
                        this.structureType_arr.forEach(function(value) {
                            if (that.structureType == value.text) {
                                postjson.structureType = value.key; // 结构类型
                            }
                        })
                    }
                    if (this.inType) {
                        this.inType_arr.forEach(function(value) {
                            if (that.inType == value.text) {
                                postjson.livingType = value.key; // 入住类型
                            }
                        })
                    }

                    if (this.constructionApplications) {
                        this.constructionApplications_arr.forEach(function(value) {
                            if (that.constructionApplications == value.text) {
                                postjson.PURPOSE = value.key; // 建筑用途
                            }
                        })
                    } else {
                        postjson.PURPOSE = "";
                    }

                    if (this.architecturalNature) {
                        this.architecturalNature_arr.forEach(function(value) {
                            if (that.architecturalNature == value.text) {
                                postjson.PROPERTY = value.key; // 建筑性质
                            }
                        })
                    } else {
                        postjson.PROPERTY = "";
                    }

                    if (this.buildingtypes) {
                        this.buildingtypes_arr.forEach(function(value) {
                            if (that.buildingtypes == value.text) {
                                postjson.BUI_TYPE = value.key; // 建筑类型
                            }
                        })
                    } else {
                        postjson.BUI_TYPE = "";
                    }

                    postjson.dataSource = 2;
                    console.log(JSON.stringify(this.unitArray));

                    if (this.unitArray.length > 0) { //点击了编辑单元后返回
                        this.unitArray.forEach(function(value, index) {
                            unitjson[index] = value.unitName;
                        });
                    } else {
                        var num = parseInt(this.editUnit)
                        for (var i = 0; i < num; i++) {
                            unitjson[i + 1] = i + 1 + "单元";
                        }
                    }
                    for (i in unitjson) {
                        var s = {};
                        s[i] = unitjson[i];
                        unitjson_arr.push(s)
                    }

                    postjson.UNIT = unitjson_arr; //

                    commonjson.createUserId = $api.getStorage('userinf').accountId;

                    reslutjson.common = commonjson;

                      reslutjson.expand = this.expandjson;
                    reslutjson.Building = postjson;
                    var json = JSON.stringify(reslutjson)
                    console.log(json);
                    console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=edit&data=' + json);
                    api.ajax({
                        url: UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=edit&data=' + json,
                        method: 'get',
                    }, function(ret, err) {
                        if (ret) {
                            console.log(JSON.stringify(ret));
                            if (ret.success) {
                              api.toast({
                                  msg: '保存成功',
                                  duration: 3000,
                                  location: 'bottom'
                              });
                                api.closeWin();
                            } else {
                                alert(ret.errorinfo);
                            }
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });

                }
            },
            closeWin: function() {
                api.closeWin();
            }
        },
        components: {
            "buildingComponent": {
                props: ['buildingtitle', 'myclass'],
                template: "#buildingInfo",
            }
        }
    });

}
