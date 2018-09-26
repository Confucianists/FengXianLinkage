/**
 * Created by kevin on 2017/7/24.
 */
apiready = function() {
    new Vue({
            el: "#list",
            data: {
                isshow: false,
                isSlideInDown: false,
                params: {},


                buildingName: "", //建筑名称
                mapNum: "", //地图编号
                address: "", //地址
                buildingNum: "", //楼号
                layerNum: "", //所属楼层
                roomNum: "", //房号
                houseuse: "请选择", //房屋用途
                houseUseId: "",

                actualuse: "请选择", //实际用途
                actualUseId: "",
                houseUse_arr: [], //房屋性质
                actualUse_arr: [], //房屋用途
            },
            created: function() {
                this.params = api.pageParam;

                var container = $api.dom(".wrapper");
                $api.css(container, 'display:block');
                api.hideProgress();
                var that = this;
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

                  this.openFrame();





                //
                //
                // var cacheDir = api.cacheDir;
                // var that = this;
                // api.readFile({
                //     path: cacheDir + 'config.json'
                // }, function(ret, err) {
                //     if (ret.status) {
                //         var jsonData = JSON.parse(ret.data);
                //         jsonData.data.forEach(function(value) {
                //             if (value.parentKey == "ResidentHouseUse") { //房屋用途
                //                 that.houseUse_arr.push({
                //                     text: value.extendAttributeValue,
                //                     status: 'normal',
                //                     key: value.extendAttributeKey
                //                 });
                //             };
                //             if (value.parentKey == "ResidentActualUse") { //实际用途
                //                 that.actualUse_arr.push({
                //                     text: value.extendAttributeValue,
                //                     status: 'normal',
                //                     key: value.extendAttributeKey
                //                 });
                //             };
                //         }); //配置文件循环结束
                //     }
                // }); //配置文读取结束
                //
                // var container = $api.dom(".wrapper");
                // $api.css(container, 'display:block');
                // api.hideProgress();
            },
            methods: {
                openFrame: function() {
                    console.log(JSON.stringify(this.params));
                    api.openFrame({
                        name: 'HouseownerResults',
                        url: './HouseownerResults.html',
                        vScrollBarEnabled: false,
                        rect: {
                            x: 0,
                            y: $api.dom('.header').offsetHeight,
                            w: api.winWidth,
                            h: api.winHeight - $api.dom('.header').offsetHeight
                        },
                        pageParam: {
                            from: this.params.from
                        },
                        bounces: true,
                        reload: true,
                    });
                },
                query: function() {
                    console.log("hih速度daaa");
                    this.isshow = true;
                    UICore.sendEvent("searchhouseowner", true);
                },
                closeWin: function() {
                    if (this.isshow == true) {
                        this.isshow = false;
                        UICore.sendEvent("searchhouseowner", false)
                    } else {
                        api.closeWin();
                    }
                },

                // houseusef() {
                //     console.log("房屋用途");
                //     var that = this;
                //     var defaultVal = this.houseUse; //获取默认值
                //     if (defaultVal != null && defaultVal != "") {
                //         this.houseUse_arr.forEach(function(value, index, arr) {
                //             if (value.text == that.houseUse) {
                //                 arr[index].status = "selected";
                //             }
                //         })
                //     }
                //     UICore.openSelect3(this.houseUse_arr, this.houseUse, "houseUsedowner");
                //     api.addEventListener({
                //         name: 'houseUsedowner'
                //     }, function(ret, err) {
                //         if (ret) {
                //             that.houseuse = ret.value.key1;
                //             that.houseUseId = ret.value.key2;
                //         } else {
                //             alert(JSON.stringify(err));
                //         }
                //     });
                //
                // },
                //
                // actualusef() {
                //     console.log("实际用途");
                //     var that = this;
                //     var defaultVal = this.actualUse; //获取默认值
                //     if (defaultVal != null && defaultVal != "") {
                //         this.actualUse_arr.forEach(function(value, index, arr) {
                //             if (value.text == this.actualUse) {
                //                 arr[index].status = "selected";
                //             }
                //         })
                //     }
                //     UICore.openSelect3(this.actualUse_arr, this.actualUse, "actualUsedowner");
                //     api.addEventListener({
                //         name: 'actualUsedowner'
                //     }, function(ret, err) {
                //         if (ret) {
                //             that.actualuse = ret.value.key1;
                //             that.actualUseId = ret.value.key2;
                //         } else {
                //             alert(JSON.stringify(err));
                //         }
                //     });
                // },
                // buildingSearch() {
                //     var that = this;
                //     api.openWin({
                //         name: 'buildingSearch',
                //         url: '../house/QueryBuiForHouseResult.html',
                //     });
                //     api.addEventListener({
                //         name: 'buildingSearch'
                //     }, function(ret, err) {
                //         if (ret) {
                //             that.buildingName = ret.value.key1.buiName; //建筑名称
                //             that.mapNum = ret.value.key1.entityId; //地图编号
                //             that.address = ret.value.key1.address; //地址
                //             that.buildingNum = ret.value.key1.buiCode; //楼号
                //         } else {
                //             alert(JSON.stringify(err));
                //         }
                //     });
                // },
                // query() {
                //     console.log("查询");
                //     var postjson = {};
                //     var resultjson = {};
                //     postjson.pageSize = 10;
                //     postjson.pageNow = 1;
                //     postjson.data_area_code = $api.getStorage('userinf').villageOrCommunityCode;
                //     postjson.createUserGridCode = $api.getStorage('userinf').gridCode;
                //     if (this.buildingName)
                //         postjson.BUI_NAME = this.buildingName; //建筑名称
                //     if (this.address)
                //         postjson.ADDRESS = this.address; //地址
                //
                //     if (this.mapNum)
                //         postjson.EntityId = this.mapNum; //地图编号
                //
                //     if (this.buildingNum)
                //         postjson.BUI_CODE = this.buildingNum; //楼号
                //
                //     if (this.layerNum)
                //         postjson.FLOOR_NUM = this.layerNum; //所属楼层
                //
                //     if (this.roomNum)
                //         postjson.ROOM_NUM = this.roomNum; //房号
                //
                //     if (this.houseuse != "请选择")
                //         postjson.USE_TYPE = this.houseUseId; //房屋用途
                //
                //     if (this.actualuse != "请选择")
                //         postjson.ACTUAL_USE_TYPE = this.actualUseId; //房屋用途
                //
                //     resultjson.house = postjson;
                //     console.log(JSON.stringify(resultjson));
                //     api.openWin({
                //         name: 'houseownerResult',
                //         url: './houseownerResult.html',
                //         pageParam: {
                //             name: "houseownerResult",
                //             houseowner: resultjson,
                //         }
                //     });
                // },

            }, // methods end.
            components: {
                "seachhosueownerComponent": {
                    props: ['houseownertitle', 'customclass'],
                    template: "#searchhosueownerc",
                }
            },
        }) //vue end
}
