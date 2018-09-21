/**
 * Created by kevin on 2017/7/24.
 */
apiready = function() {

    new Vue({
        el: "#list",
        data: {
            isNew: true, //是否是新增
            isBrowser: false, //是否是浏览模式
            submitoredit: "提交",
            isClick: false,
            params: {}, //传参

            neworedit: "",
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
            houseowner: "", //户主
            housetype: "", //户类型
            housetypeId: "",
            isneedhelp: "", //是否需要帮助
            isneedhelpId: "",
            houseMembers: 0,

            members: "", //传过来的户成员信息
            idz:"",
            relation_arr: [], //列表中户成员关系
            memberinfo_arr: [], //户成员列表
            expandTab_arr: [], //扩展信息
            memberjson: [],
            buildingUnit_arr: [], //建筑中唯一需要填写单元/去 下拉框
            houseUse_arr: [], //房屋用途下拉框数据
            actualUse_arr: [], //实际用途下拉框数据
            housetype_arr: [], //户类型下拉框数据
            isneedhelp_arr: [], //是否需要帮扶下拉框数据
            buildingUnit_arr: [], //单元列表
            delResidentId_arr:[],
            expandjson: {},
            expandstr: "", //表单预览数据
            edit:false,//是否是通过查询到该页面
            edited: false,
            houseid: "",
            extendAtt: "",
        },
        beforeCreate: function() {
            UICore.showLoading("信息加载中...", "请稍候");
        },
        created: function() {
            var param = api.pageParam;
            var that = this; //保存指针供回调使用
            if (param && param.title == "houseownerQuery") { //查询/编辑``
                // console.log(JSON.stringify(param));
                this.isBrowser = true;
                this.isClick = this.isBrowser
                this.isNew = false;
                this.params = param.infos;
                $api.text($api.byId('pkh_add_su'), '编辑');
            }
            console.log(JSON.stringify(this.params));
            var jsonData = JSON.parse($api.getStorage('settingdata'));
            jsonData.data.forEach(function(value) {
                if (value.parentKey == "ResidentRelationship") { //户成员关系
                    that.relation_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
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
                if (value.parentKey == "ResidentType") { //户类型
                    that.housetype_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
                if (value.parentKey == "ResidentNeedHelp") { //是否需要帮扶
                    that.isneedhelp_arr.push({
                        text: value.extendAttributeValue,
                        status: 'normal',
                        key: value.extendAttributeKey
                    });
                };
            });
            if (that.isBrowser) { //在浏览状态下 显示数据
                this.buildingName = this.params.buiName; //建筑名称
                this.unit = this.params.unitName; //单元(梯/区)
                var buildingID = this.params.buiID;
                var houseID = this.params.houseid;
                var residentID = this.params.residentId;
                UICore.showLoading("详情加载中...", "请稍候");
                console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForNewResident.shtml?act=getResidentInfo&data={buiId:' + buildingID + ',houseid:' + houseID + ',residentId:' + residentID + '}');
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobileInterfaceForNewResident.shtml?act=getResidentInfo&data={buiId:' + buildingID + ',houseid:' + houseID + ',residentId:' + residentID + '}',
                    method: 'get',
                }, function(ret, err) {
                  api.hideProgress();
                    if (ret.success) {
                        console.log(JSON.stringify(ret));
                        var houseinfo = ret.data.house;
                        var housememberinfo = ret.data.houseMember;
                        var houseownerinfo = ret.data.resident;
                        that.idz=houseownerinfo.id;
                        that.extendAtt = houseownerinfo.extendAtt;
                        ret.data.unitList.forEach(function(value) {
                            if (value.unitName == that.unit) {
                                that.unitId = value.id;
                            }
                            that.buildingUnit_arr.push({
                                text: value.unitName,
                                status: 'normal',
                                key: value.id,
                            });
                        });

                        that.layer = houseinfo.floorNum; //所属楼层
                        that.houseNum = houseinfo.roomNum; //房号
                        that.houseArea = houseinfo.area; //面积
                        var index = parseInt(houseinfo.useType);
                        if (!isNaN(index) && index < 6) {
                            that.houseUse_arr[index - 1].status = "selected";
                            that.houseUse = that.houseUse_arr[index - 1].text;
                        }; //房屋用途

                        var index = parseInt(houseinfo.actualUseType);
                        if (!isNaN(index) && index < 6) {
                            that.actualUse_arr[index - 1].status = "selected";
                            that.actualUse = that.actualUse_arr[index - 1].text;
                        }; //实际用途


                        var index = parseInt(houseownerinfo.residentType);
                        if (!isNaN(index)) {
                            that.housetype_arr[index].status = "selected";
                            that.housetype = that.housetype_arr[index].text;
                        }; //户类别

                        var index = parseInt(houseownerinfo.isNeedHelp);
                        if (!isNaN(index)) {
                            that.isneedhelp_arr[index].status = "selected";
                            that.isneedhelp = that.isneedhelp_arr[index].text;
                        }; //是否需要帮扶
                        that.houseowner = houseownerinfo.houseOwner;
                        that.houseMembers = housememberinfo.length;

                        var relationship = "";
                        if (housememberinfo.length > 0) {
                            housememberinfo.forEach(function(value, index) {

                                that.relation_arr.forEach(function(value1, index1, arr) {

                                    if (value1.key == value.population.relation) {

                                        relationship = arr[index1].text;

                                        that.memberinfo_arr.push({
                                            name: value.population.name,
                                            idCard: value.population.idNumber,
                                            relation: relationship
                                        }); //户成员列表
                                    } //接口只传递key数值 通过数值找到relation_arr当前的text
                                }); //遍历户成员下拉列表的数组
                            });
                            that.memberjson=housememberinfo;
                            that.edit=true;
                        }
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            }
            <!--获取扩展信息开始-->
            api.ajax({
                url: UICore.serviceUrl + 'mobile/mobileDataCollection.shtml?act=getDynaBaseTab&data={baseKey:JMHXX}',
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
            initbuihouse:function(infos) {
                var index = parseInt(infos.useType);
                if (!isNaN(index) && index < 6) {
                    this.houseUse_arr[index - 1].status = "selected";
                    this.houseUse = this.houseUse_arr[index - 1].text;
                }; //房屋用途
                var index = parseInt(infos.actualUseType);
                if (!isNaN(index)) {
                    this.actualUse_arr[index - 1].status = "selected";
                    this.actualUse = this.actualUse_arr[index - 1].text;
                }; //实际用途
            },
            buildingf: function() {
                if (!this.isBrowser) { //在浏览状态下 显示数据
                var that = this;
                api.openWin({
                    name: 'houseownerBuilding',
                    url: './searchBuildingForHouseowner.html',
                    vScrollBarEnabled:false,
                    pageParam: {}
                });
                api.addEventListener({
                    name: 'houseownerforbuilding'
                }, function(ret, err) {
                    if (ret) {
                        var buiInfo = ret.value.key1;
                        console.log(JSON.stringify(buiInfo));
                        that.initbuihouse(buiInfo);
                        that.buildingName = buiInfo.buiName; //建筑名称
                        that.unit = buiInfo.unitName; //单元(梯/区)
                        that.layer = buiInfo.floorNum; //所属楼层
                        that.houseid = buiInfo.houseid;
                        that.houseNum = buiInfo.roomNum; //房号
                        that.houseArea = buiInfo.area; //房屋面积
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
              }
            },
            housetypef: function() { //户类型
                console.log("户类型");
                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.housetype; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.housetype_arr.forEach(function(value, index, arr) {
                            if (value.text == that.housetype) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.housetype_arr, this.housetype, "housetype");
                    api.addEventListener({
                        name: 'housetype'
                    }, function(ret, err) {
                        if (ret) {
                            that.housetype = ret.value.key1;
                            that.housetypeId = ret.value.key2 - 1;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            isneedhelpf: function() {
                console.log("是否需要帮扶");
                if (!this.isBrowser) {
                    var that = this;
                    var defaultVal = this.isneedhelp; //获取默认值
                    if (defaultVal != null && defaultVal != "") {
                        this.isneedhelp_arr.forEach(function(value, index, arr) {
                            if (value.text == that.isneedhelp) {
                                arr[index].status = "selected";
                            }
                        })
                    }
                    UICore.openSelect3(this.isneedhelp_arr, this.isneedhelp, "isneedhelp");
                    api.addEventListener({
                        name: 'isneedhelp'
                    }, function(ret, err) {
                        if (ret) {
                            that.isneedhelp = ret.value.key1;
                            that.isneedhelpId = ret.value.key2;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            edits: function(item) {
                for (var i = 0; i < this.memberinfo_arr.length; i++) {
                    if (this.memberinfo_arr[i] == item) {
                      console.log(JSON.stringify(this.memberjson[i]));
                        api.openWin({
                            name: 'addHouseMember',
                            url: './addHouseMember.html',
                            vScrollBarEnabled:false,
                            pageParam: {
                                from: "addHouseMemberedit",
                                name: this.memberjson[i],
                                index: i
                            }
                        });
                    }
                }
            },
            del: function(item) {
                var that = this;
                api.confirm({
                        title: '提醒',
                        msg: '是否删除该条信息',
                        buttons: ['确定', '取消']
                    },
                    function(ret, err) {
                        var index = ret.buttonIndex;
                        if (index == 1) {
                            for (var i = 0; i < that.memberinfo_arr.length; i++) {
                                if (that.memberinfo_arr[i] == item) {
                                  console.log(JSON.stringify(that.memberjson[i]));
                                    that.delResidentId_arr.push(that.memberjson[i].population.id)
                                    that.memberinfo_arr.splice(i, 1);
                                    that.memberjson.splice(i, 1);
                                    that.houseMembers = that.houseMembers - 1;
                                }
                            }
                        }
                    });
            },
            addMenber: function() {
                if (!this.isBrowser) { //在浏览状态下 显示数据
                    var that = this;
                    api.openWin({
                        name: 'addHouseMember',
                        url: './addHouseMember.html',
                        vScrollBarEnabled:false,
                        pageParam: {
                            name: '新增户成员',
                            edit:this.edit
                        }
                    });
                    api.addEventListener({
                        name: 'houseMenberResult'
                    }, function(ret, err) {
                        if (ret) {
                            console.log(JSON.stringify(ret.value.key2));
                            var index= parseInt(ret.value.key2);
                            if (ret.value.key2 != undefined&& !isNaN(index)) {
                                this.members = ret.value.key1;
                                var memberinfo = ret.value.key1.population;
                                var relationkey = parseInt(memberinfo.relation);
                                var relationship = "";0000
                                if (relationkey > -1) {
                                    that.relation_arr.forEach(function(value, index, arr) {
                                        if (value.key == relationkey) {
                                            relationship = arr[index].text;
                                        }
                                    });
                                };
                                that.memberinfo_arr.splice(index,1,{
                                    name: memberinfo.name,
                                    idCard: memberinfo.idNumber,
                                    relation: relationship
                                });
                                // that.memberjson.splice(0, that.memberjson.length)
                                that.memberjson.splice(index,1,ret.value.key1);
                                that.houseMembers = that.memberinfo_arr.length;
                            } else {
                                this.members = ret.value.key1;
                                var memberinfo = ret.value.key1.population;
                                var relationkey = parseInt(memberinfo.relation);
                                var relationship = "";
                                if (relationkey > -1) {
                                    that.relation_arr.forEach(function(value, index, arr) {
                                        if (value.key == relationkey) {
                                            relationship = arr[index].text;
                                        }
                                    });
                                };
                                that.memberinfo_arr.push({
                                    name: memberinfo.name,
                                    idCard: memberinfo.idNumber,
                                    relation: relationship
                                });
                                // that.memberjson.splice(0, that.memberjson.length)
                                that.memberjson.push(ret.value.key1);
                                that.houseMembers = that.memberinfo_arr.length;
                            }
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                }
            },
            expandselect: function(index, english_name, title) {
                var expandParams = this.extendAtt;
                console.log(expandParams)
                var that = this;
                if (this.expandstr != "" && this.isNew) {
                    api.openWin({
                        name: 'dynamic',
                        url: '../dynamic.html',
                        vScrollBarEnabled:false,
                        pageParam: {
                            title: title,
                            name: english_name,
                            isNew: this.isNew,
                            id: this.id,
                            isBrowser: this.isBrowser,
                            attr: "{" + this.expandstr.substring(0, this.expandstr.length - 1) + "}"
                        }
                    });
                } else if (!this.isNew && this.edited) {
                    api.openWin({
                        name: 'dynamic',
                        url: '../dynamic.html',
                        vScrollBarEnabled:false,
                        pageParam: {
                            title: title,
                            name: english_name,
                            isNew: this.isNew,
                            edited: true,
                            id: this.id,
                            isBrowser: this.isBrowser,
                            attr: JSON.stringify(this.expandjson)
                        }
                    });
                } else {
                    console.log(JSON.stringify(expandParams));
                    api.openWin({
                        name: 'dynamic',
                        url: '../dynamic.html',
                        vScrollBarEnabled:false,
                        pageParam: {
                            title: title,
                            name: english_name,
                            isNew: this.isNew,
                            id: this.id,
                            isBrowser: this.isBrowser,
                            attr: expandParams
                        }
                    });
                }

                api.addEventListener({
                    name: 'population_json'
                }, function(ret, err) {
                    if (!that.isNew) {
                        that.expandjson = ret.value.key;
                        that.edited = ret.value.key2
                    } else {
                        that.doExpand(ret.value.key, index)
                    }
                });
            }, //动态表单选择结束
            doExpand:function(value, index) {
                var s = JSON.stringify(value);
                var json = eval('(' + s + ')');
                for (var key in json) { //上个页面的json
                    var t = JSON.stringify(json[key])
                    this.expandstr += t.substring(1, t.length - 1) + ",";
                }
                this.expandjson = eval('(' + "{" + this.expandstr.substring(0, this.expandstr.length - 1) + "}" + ')');
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
                    /* 基本户主信息 */

                    if (!this.isNew) {
                        postjson.id = this.idz;
                        postjson.data_area_code = $api.getStorage('userinf').dataAreaCode
                        postjson.houseid = this.params.houseid
                    } else {
                        postjson.data_area_code = $api.getStorage('userinf').dataAreaCode;
                        postjson.houseid = this.houseid
                    }
                    if (this.houseowner)
                        postjson.HOUSE_OWNER = this.houseowner; //户主

                    postjson.RESIDENT_TYPE = this.housetypeId; // 户类别

                    // if(postjson.delResidentId)
                    postjson.delResidentId = this.delResidentId_arr.join(","); // 需要删除的id

                    postjson.IS_NEED_HELP = this.isneedhelpId; //所属楼层
                    postjson.dataSource = 2; //
                    reslutjson.resident = postjson;
                    /* 扩展信息 */
                    if (this.expandjson)
                        reslutjson.expand = this.expandjson;
                    /* 其它信息 */
                    var otherjson = {};
                    otherjson.createUserId = $api.getStorage('userinf').accountId;
                    reslutjson.common = otherjson;

                    /* 成员信息 */
                    if (this.memberjson.length > 0)
                        reslutjson.member = this.memberjson
                    var json = JSON.stringify(reslutjson)
                    console.log(json);
                    UICore.showLoading("数据提交中...", "请稍候");
                    console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForNewResident.shtml?act=edit&data=' + json);
                    api.ajax({
                        url: UICore.serviceUrl + 'mobile/mobileInterfaceForNewResident.shtml?act=edit&data=' + json,
                        method: 'get',
                    }, function(ret, err) {
                      api.hideProgress();
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
            "houseownerComponent": {
                props: ['houseownertitle', 'myclass'],
                template: "#houseownerInfo",
            },
            "houseownerMember": {
                template: "#addhouseMember",
            }
        }
    });
}
