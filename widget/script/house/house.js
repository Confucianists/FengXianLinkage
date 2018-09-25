/**
 * Created by kevin on 2017/7/13.
 */
apiready = function() {

    new Vue({
        el: "#list",
        data: {
            isNew: true, //是否是新增
            isBrowser: false, //是否是浏览模式
            isClick: false,
            params: {}, //传参

            buildingName: "", //建筑名称
            unit: "", //单元(梯/区)
            unitId: "",
            layer: "", //所属楼层
            houseNum: "", //房号
            houseUse: "", //房屋用途
            houseUseId: "",
            actualUse: "", //实际用途
            actualUseId: "",
            houseArea: "", //房屋面积
            expandTab_arr: [], //扩展信息

            buildingUnit_arr: [], //建筑中唯一需要填写单元/去 下拉框
            houseUse_arr: [], //房屋用途下拉框数据
            actualUse_arr: [], //实际用途下拉框数据
            expandjson: {},
            expandstr: "", //表单预览数据
            edited:false,
        },
        beforeCreate: function() {
            UICore.showLoading("信息加载中...", "请稍候");
        },
        created: function() {
            var param = api.pageParam;
            var that = this; //保存指针供回调使用
            if (param && param.title == "houseResult") { //查询/编辑``
                this.isBrowser = true;
                this.isClick = this.isBrowser;
                this.isNew = false;
                this.params = param.infos;
                $api.text($api.byId('pkh_add_su'), '编辑');
            } //新增  新增时初始化建筑信息 且 建筑信息不可编辑 可编辑的都是部分房屋信息
            var jsonData = JSON.parse($api.getStorage('settingdata'));
            jsonData.data.forEach(function(value) {
                if (value.parentKey == "ResidentHouseUse") { //房屋用途
                    that.houseUse_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "ResidentActualUse") { //实际用途
                    that.actualUse_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
            }); //配置文件循环结束
            if (that.isBrowser) { //在浏览状态下 显示数据
                that.buildingName = that.params.buiName; //建筑名称
                that.unit = that.params.unitName; ////单元(梯/区)
                that.layer = that.params.floorNum; //所属楼层
                that.houseNum = that.params.roomNum; //房号
                that.houseArea = that.params.area; //建筑名称
                that.unitId=that.params.unitId
                console.log(JSON.stringify(that.params));
                // that.initBuiInfo(buiInfo.id);
                var index = parseInt(that.params.useType);
                if (!isNaN(index) && index < 6) {
                    that.houseUse_arr[index - 1].status = "selected";
                    that.houseUse = that.houseUse_arr[index - 1].text;
                }; //房屋用途
                var index = parseInt(that.params.actualUseType);
                if (!isNaN(index)) {
                    that.actualUse_arr[index - 1].status = "selected";
                    that.actualUse = that.actualUse_arr[index - 1].text;
                }; //实际用途
            } else { //ret.status
            };
            <!--获取扩展信息开始-->
            api.ajax({
                url: UICore.serviceUrl + 'mobile/mobileDataCollection.shtml?act=getDynaBaseTab&data={baseKey:FWXX}',
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
        methods: {
            initBuiInfo: function(buildId) {
                var that = this;
                <!--获取建筑信息开始-->
                console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=getBuildingInfo&data={buiId:' + buildId + '}');
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForBuilding.shtml?act=getBuildingInfo&data={buiId:' + buildId + '}',
                    method: 'get',
                }, function(ret, err) {
                    if (ret.success) {
                        console.log(JSON.stringify(ret.data));
                        ret.data.unitList.forEach(function(value) {
                            that.buildingUnit_arr.push({
                                text: value.unitName,
                                status: 'normal',
                                key: value.id,
                            });
                        });
                        ret.data.entityId
                    } else {
                        //alert( "加载建筑单元失败!" );
                        api.toast({
                            msg: '加载建筑单元失败!',
                            duration: 2000,
                            location: 'bottom'
                        });

                    }
                });
                <!--获取建筑信息结束-->
            },
            buildingf: function() {
                if (!this.isBrowser) {
                    var that = this;
                    api.openWin({
                        name: 'buildingQuery',
                        url: '../building/buildingQuery.html',
                        vScrollBarEnabled:false,
                        pageParam: {
                            from: 'fromHouse'
                        }
                    });
                    api.addEventListener({
                        name: 'houseforbuilding'
                    }, function(ret, err) {
                        if (ret) {
                            var buiInfo = ret.value.key1;
                              console.log(JSON.stringify(buiInfo));
                            that.buildingName = buiInfo.buiName; //建筑名称
                            that.initBuiInfo(buiInfo.id);
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }

            },
            unitf: function() {
                console.log("单元(梯/区)");
                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.unit; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.buildingUnit_arr.forEach(function(value, index, arr) {
                            if (value.text == that.unit) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.buildingUnit_arr, this.buildingType, "united");
                    api.addEventListener({
                        name: 'united'
                    }, function(ret, err) {
                        if (ret) {
                            that.unit = ret.value.key1;
                            that.unitId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            houseUsef: function() {
                console.log("房屋用途");
                if (!this.isBrowser) {
                    console.log(JSON.stringify(this.houseUse_arr));
                    var that = this;
                    var defaultVal = this.houseUse; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.houseUse_arr.forEach(function(value, index, arr) {
                            if (value.text == that.houseUse) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.houseUse_arr, this.houseUse, "houseUsed");
                    api.addEventListener({
                        name: 'houseUsed'
                    }, function(ret, err) {
                        if (ret) {
                            that.houseUse = ret.value.key1;
                            that.houseUseId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            actualUsef: function() {
                console.log("实际用途");
                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.actualUse; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.actualUse_arr.forEach(function(value, index, arr) {
                            if (value.text == this.actualUse) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.actualUse_arr, this.actualUse, "actualUsed");
                    api.addEventListener({
                        name: 'actualUsed'
                    }, function(ret, err) {
                        if (ret) {
                            that.actualUse = ret.value.key1;
                            that.actualUseId = ret.value.key2;
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
                      vScrollBarEnabled:false,
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
                    vScrollBarEnabled:false,
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
                      vScrollBarEnabled:false,
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









                // var id = this.id;
                // // var expandParams = this.param.name.extendAtt;
                // var that = this;
                // api.openWin({
                //     name: 'dynamic',
                //     url: '../dynamic.html',
                //     pageParam: {
                //         title: title,
                //         name: english_name,
                //         id: id,
                //         isBrowser: this.isBrowser
                //     }
                // });
                // api.addEventListener({
                //     name: 'population_json'
                // }, function(ret, err) {
                //     // console.log(JSON.stringify(ret.value.key));
                //     Object.assign(that.expendjson, ret.value.key)
                //         // that.expendjson = ret.value.key;
                //     console.log(JSON.stringify(that.expendjson));
                //
                // });
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
                if (this.isBrowser) {
                    $api.text($api.byId('pkh_add_su'), '提交');
                    this.isBrowser = false;
                    this.isClick = this.isBrowser;
                } else {
                    var postjson = {}; //提交postjson
                    var reslutjson = {}; //最终整合真正提交的json
                    /* 基本房屋信息 */
                    postjson.ENTITYID = this.params.entityId;
                    postjson.GRIDID = this.params.gridId;
                    if (!this.isNew) {
                        postjson.houseid = this.params.houseid
                        postjson.data_area_code = $api.getStorage('userinf').dataAreaCode
                    } else {
                        postjson.data_area_code =$api.getStorage('userinf').dataAreaCode;
                    }
                    if (this.unitId)
                        postjson.unitId = this.unitId; //单元值
                    if (this.unit)
                        postjson.unitNum = this.unit; //单元名
                    if (this.layer)
                        postjson.floorNum = this.layer; //所属楼层
                    if (this.houseNum)
                        postjson.roomNum = this.houseNum; //房号
                    if (this.houseUseId)
                        postjson.useType = this.houseUseId; //房屋用途
                    if (this.actualUseId)
                        postjson.actualUseType = this.actualUseId; //
                    postjson.area = this.houseArea; //
                    postjson.dataSource = 2; //

                    reslutjson.house = postjson;

                    /* 扩展信息 */
                    if (this.expandjson)
                        reslutjson.expand = this.expandjson;
                    /* 其它信息 */
                    var otherjson = {};
                    otherjson.createUserId = $api.getStorage('userinf').accountId;
                    reslutjson.common = otherjson;

                    var json = JSON.stringify(reslutjson)

                    console.log(json);
                    console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForHouse.shtml?act=edit&data=' + json);
                    api.ajax({
                        url: UICore.serviceUrl + 'mobile/mobileInterfaceForHouse.shtml?act=edit&data=' + json,
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
            "houseComponent": {
                props: ['hosetitle', 'myclass'],
                template: "#houseInfo",
            }
        }
    });
}
