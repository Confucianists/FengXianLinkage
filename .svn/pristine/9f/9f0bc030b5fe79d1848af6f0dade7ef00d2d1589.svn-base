/**
 * Created by kevin on 2017/6/28.
 */
apiready = function() {
    var jsonData = {};
    new Vue({
        el: '#table',
        data: {
            name: "", //标题
            isBrowser: false, //是否是查询
            isNew: true,
            english_name: "",
            items: [],
            saved: "", //是否查询选择编辑或者保存
            param: {},
            newjson: {},
            tableid: null,
            edited: false,
            // jsonData: [],
            postjson: {},
            expandjson: {},
        },
        created: function() {
            UICore.showLoading("列表加载中...", "请稍候")
            this.param = api.pageParam;
            this.isNew = this.param.isNew;
            console.log(this.isNew);
            this.edited = this.param.edited
            this.english_name = this.param.name;
            this.name = this.param.title;
            this.isBrowser = this.param.isBrowser;
            if (this.param.id) {
                this.tableid = this.param.id;
            }
            if (this.isBrowser) {
                this.saved = "编辑"

            } else {
                this.saved = "保存"
            }
            this.initData(); //如果param.id不为空这不是新增而是编辑或查看
        },
        methods: {
            initData: function() {
                var that = this;
                console.log(UICore.serviceUrl + "mobile/mobileDataCollection.shtml?act=getAllDynaTabItemsByTabKey&data={baseKey:" + this.english_name + ",tableid:" + this.tableid + ",requestclass:population}");
                api.ajax({ //获取动态表单
                        url: UICore.serviceUrl + "mobile/mobileDataCollection.shtml?act=getAllDynaTabItemsByTabKey&data={baseKey:" + this.english_name + ",tableid:" + this.tableid + ",requestclass:population}",
                        method: 'get',
                    }, function(ret, err) {
                        if (ret.success) {
                            api.hideProgress();
                            ret.data.forEach(function(value) {
                                    value.value = "",
                                        value.status = 'normal',
                                        value.key = -1,
                                        value.num = -1
                                }) //添加属性这样可以直接作为vue的数据源即初始化数据源
                            that.items = ret.data;
                            jsonData = JSON.parse($api.getStorage('settingdata'));
                            if (that.param.attr) {
                                that.initEditData(that.param.attr);
                            }
                        } else { //ret.success失败
                            alert(JSON.stringify(err));
                        }
                    }) //ajax end

            },
            initEditData: function(param) {
                var that = this;
                var configData = jsonData.data; //配置文件
                console.log(param);
                var s = param.replace(/\//g, '');
                var arr = [];
                var json = eval('(' + param + ')');
                console.log(JSON.stringify(json));
                console.log(param);
                var reg = new RegExp('"', "g");
                param = param.replace(reg, "");
                this.items.forEach(function(value) { //循环判断查询信息
                  configData.forEach(function(values) { //循环配置文件获取key对应的值
                      if (values.parentKey == value.column_key) {
                          var myJsonArr = {};
                          myJsonArr[values.parentKey] = {
                              key1: values.extendAttributeKey,
                              key2: values.extendAttributeValue,
                              key3: values.parentKey
                          };
                          arr.push(myJsonArr);
                      }
                  });

                    for (var key in json) { //上个页面的json
                        if (value.dyna_option_type_id == "" && key == value.column_key) {
                            value.key = json[key]; //获取key值(传过来就是key
                        }
                        if (value.dyna_option_type_id == key) {
                            if (json[key] != "" && (value.column_label == "select")) {
                                value.key = json[key]; //获取key值(传过来就是key)
                                value.num = value.key - 1;
                            }
                            if (value.dyna_option_type_id == key && value.column_label == "checkbox" &&
                                json[key] != "") {
                                if (that.edited || that.isNew) {
                                    value.key = json[key];
                                } else {
                                    var arrj = [];
                                    arrj = param.substring(1, param.length - 1).split(",")
                                    console.log(JSON.stringify(arrj));
                                    var arrkeys = [];
                                    var arrnums = [];
                                    value.key = "";
                                    value.num = "";
                                    for (var n = 0; n < arrj.length; n++) {
                                        if (key == arrj[n].split(":")[0].replace("\"", "").replace("\"", "")) {
                                            var i = parseInt(arrj[n].split(":")[1].replace("\"", "").replace("\"", ""))
                                            arrkeys.push(i);
                                            arrnums.push(i - 1);
                                        }
                                    }
                                    value.key = arrkeys.join(",");
                                    value.num = arrnums.join(",");
                                }
                                if (value.key != -1) {
                                    var arrkey = [];
                                    var arrvalue = [];
                                    if ((value.key).charAt(value.key.length - 1) == ",") {
                                        arrkey = value.key.substring(0, value.key.length - 2).split(',')
                                    } else {
                                        arrkey = value.key.split(',')
                                    }
                                    var myvalue = "";
                                    for(var num in arrkey){
                                      for(var ar in arr){
                                        if(arr[ar][key]&&arrkey[num]==arr[ar][key].key1){
                                          if(myvalue==""){
                                            myvalue += arr[ar][key].key2;
                                          }else{
                                            myvalue += ","+ arr[ar][key].key2;
                                          }
                                        }
                                      }
                                    }
                                    value.value = myvalue;
                                }

                            }
                        }
                        if (value.dyna_option_type_id == "" &&
                            value.column_label == "text" &&
                            value.column_key == key) {
                            value.value = json[key];
                        }
                        arr.forEach(function(v) {
                            if(v[key]){
                              if (v[key].key1 == value.key) {
                                  value.value = v[key].key2
                              }
                            }

                        })

                    } //上个页面的json end

                });
            },

            select: function(index) { //操作表单事件
                var this_ = this;

                if (jsonData) {
                    if (!this.isBrowser) {
                        this.edited = true;
                        var defaultVal = this.items[index].value; //获取默认值
                        var defaultKey = this.items[index].key;
                        console.log(this.items[index].value);
                        console.log(this.items[index].key);
                        var selectkey = this.items[index].dyna_option_type_id;
                        var selectkeyradio = this.items[index].column_key;
                        var configData = jsonData.data; //配置文件
                        var datas = [];
                        configData.forEach(function(value) { //循环判断配置文件对选择框赋值
                            if (value.parentKey == selectkey && selectkey != "") {
                                datas.push({
                                    text: value.extendAttributeValue,
                                    status: 'normal',
                                    key: value.extendAttributeKey
                                }); //选择框赋值结束
                            } else {
                                if (value.parentKey == selectkeyradio) {
                                    datas.push({
                                        text: value.extendAttributeValue,
                                        status: 'normal',
                                        key: value.extendAttributeKey
                                    }); //选择框赋值结束
                                }
                            }
                        }); //遍历配置文件结束
                        if (defaultVal != null && defaultVal != "" &&
                            this_.tableid == null && this.items[index].column_type != "Date" &&
                            this.items[index].column_label != "checkbox") { //有待查证tableid
                            if (this.items[index].column_label == "radio") {
                                datas[this.items[index].key].status = "selected"; //有默认值更新其选择框状态
                            } else {
                                datas[this.items[index].num].status = "selected"; //有默认值更新其选择框状态
                            }

                        }
                        if (this.items[index].column_type == "Date") { //日历则打开日历选择框
                            UICore.openTimeComponent(this.items[index])

                        }
                        if (this.items[index].column_label == "checkbox") {
                            console.log(defaultKey);
                            if (defaultKey != -1) {
                                if (defaultKey.charAt(defaultKey.length - 1) == ",") {
                                    defaultKey = defaultKey.substring(0, defaultKey.length - 1)
                                }
                                console.log(defaultKey);
                                if (defaultKey != -1 || defaultKey != "-1") {
                                    var key_arr = defaultKey.split(",");
                                    console.log(JSON.stringify(key_arr));

                                    for (var i = 0; i < key_arr.length; i++) {
                                        if (key_arr[i] != "" && key_arr[i] != -1) {
                                            datas[key_arr[i] - 1].status = "selected"
                                        }

                                    }
                                }
                            }
                            UICore.openSelectmulti(datas, this.items[index], "checkbox", true); //否则打开一般选择框
                            var keys = [];
                            var values = [];
                            api.addEventListener({
                                name: 'checkbox'
                            }, function(ret, err) {
                                if (ret) {
                                    ret.value.key1.forEach(function(value) {
                                        keys.push(value.key);
                                        values.push(value.text);
                                    });
                                    this_.items[index].key = keys.join(",");
                                    this_.items[index].value = values.join(",");
                                } else {
                                    alert(JSON.stringify(err));
                                }
                            });

                        } else {
                            UICore.openSelect(datas, this.items[index]); //否则打开一般选择框

                        }
                    } //this.isBrowser end
                } //jsondata end

            }, //选择事件结束
            closeWin: function() {
                api.closeWin();
            }, //关闭事件结束
            save: function() {
                    var that = this;
                    if (this.saved == "编辑") { //如果是查询界面
                        this.saved = "保存";
                        this.isBrowser = false;
                    } else { //新增或者可编辑时
                        if (this.isNew) {
                            this.items.forEach(function(value, index) { //循环遍历数据源
                                if (value.column_label == "select" || value.column_label == "radio") { //类型为选择时获取key
                                    that.postjson[value.column_key] = value.key;
                                } else if (value.column_label == "text") { //类型为文本是获取value
                                    that.postjson[value.column_key] = value.value;
                                } else if (value.column_label == "checkbox") {
                                    that.postjson[value.column_key] = value.key;
                                }
                            });
                            this.expandjson[this.english_name] = this.postjson
                        } else {
                            var newjson = eval('(' + that.param.attr + ')');
                            this.items.forEach(function(value, index) { //循环遍历数据源
                                if (value.column_label == "select" || value.column_label == "radio") { //类型为选择时获取key
                                    var s = that.items[index].column_key;
                                    newjson[s] = value.key;
                                } else if (value.column_label == "text") { //类型为文本是获取value
                                    var s = that.items[index].column_key;
                                    newjson[s] = value.value;
                                } else if (value.column_label == "checkbox") {
                                    var s = that.items[index].column_key;
                                    newjson[s] = value.key;
                                }
                            });
                            this.expandjson = newjson;
                        }
                        console.log(JSON.stringify(this.expandjson));
                        api.sendEvent({ //发送广播给上个界面
                            name: 'population_json',
                            extra: {
                                key: this.expandjson,
                                key2: this.edited
                            }
                        }); //发送事件结束
                        api.closeWin(); //关闭当前页面
                    }
                } //保存事件结束
        }
    });









    //     UICore.showLoading("列表加载中...", "请稍候")
    //     dynamicObj = new Dynamic();
    //
    //     var param = api.pageParam;
    //     var s = param.attr
    //     dynamicObj.english_name = param.name;
    //     dynamicObj.title = param.title;
    //     dynamicObj.isBrowser = param.isBrowser
    //     if (dynamicObj.isBrowser) {
    //         dynamicObj.saved = "编辑"
    //     } else {
    //         dynamicObj.saved = "保存"
    //     }
    //     dynamicObj.initData(param.id); //如果param.id不为空这不是新增而是编辑或查看
    // }
    // Dynamic = function() {};
    // Dynamic.prototype = {
    //     isBrowser: false,
    //     saved: "",
    //     title: "",
    //     english_name: "",
    //     tableid: null,
    //     jsonData: [],
    //     dynamic_arr: [],
    //     postjson: {},
    //     expandjson: {},
    //     initData: function(peopleId) {
    //         if (peopleId) {
    //             this.tableid = peopleId;
    //         }
    //         var that = this;
    //         console.log(UICore.serviceUrl + "mobile/mobileDataCollection.shtml?act=getAllDynaTabItemsByTabKey&data={baseKey:" + this.english_name + ",tableid:" + this.tableid + ",requestclass:population}");
    //         api.ajax({ //获取动态表单
    //             url: UICore.serviceUrl + "mobile/mobileDataCollection.shtml?act=getAllDynaTabItemsByTabKey&data={baseKey:" + this.english_name + ",tableid:" + this.tableid + ",requestclass:population}",
    //             method: 'get',
    //         }, function(ret, err) {
    //             if (ret.success) {
    //                 ret.data.forEach(function(value) {
    //                         value.value = "",
    //                             value.status = 'normal',
    //                             value.key = -1,
    //                             value.num = -1
    //                     }) //添加属性这样可以直接作为vue的数据源
    //                 that.dynamic_arr = ret.data;
    //                 var cacheDir = api.cacheDir; //获取配置文件
    //                 api.readFile({ //读取配置文件信息
    //                     path: cacheDir + 'config.json'
    //                 }, function(ret, err) {
    //                     if (ret.status) { //读取成功
    //                         that.jsonData = JSON.parse(ret.data);
    //                         if (that.tableid && that.isBrowser) { //此存在即为查看或者编辑页面
    //                             that.jsonData.data.forEach(function(value1, index) {
    //                                 that.dynamic_arr.forEach(function(value) { //双重循环判断查询信息
    //                                     if (value.dyna_option_type_id == value1.parentKey && value.defaultValue == value1.extendAttributeKey) {
    //                                         value.value = value1.extendAttributeValue;
    //                                         value.key = value1.defaultValue;
    //                                         value.num = value.key - 1;
    //                                     }
    //                                 });
    //                             }); //双重循环结束
    //                         } //tableid判断结束
    //                     }
    //                 }); //读取配置文件结束
    //                 new Vue({
    //                     el: '#table',
    //                     data: {
    //                         name: that.title, //标题
    //                         isBrowser: that.isBrowser, //是否是查询
    //                         items: that.dynamic_arr,
    //                         saved: that.saved, //是否查询选择编辑或者保存
    //                     },
    //                     created: function() {
    //                         var container = $api.dom(".container");
    //                         $api.css(container, 'display:block');
    //                         api.hideProgress();
    //                     },
    //                     methods: {
    //                         select: function(index) { //操作表单事件
    //                             var this_ = this;
    //                             if (that.jsonData) {
    //                                 if (!this.isBrowser) {
    //                                     var defaultVal = this.items[index].value; //获取默认值
    //                                     var defaultKey = this.items[index].key;
    //
    //                                     var selectkey = this.items[index].dyna_option_type_id;
    //                                     var configData = that.jsonData.data; //配置文件
    //                                     var datas = [];
    //                                     configData.forEach(function(value) { //循环判断配置文件对选择框赋值
    //                                         if (value.parentKey == selectkey) {
    //                                             datas.push({
    //                                                 text: value.extendAttributeValue,
    //                                                 status: 'normal',
    //                                                 key: value.extendAttributeKey
    //                                             }); //选择框赋值结束
    //                                         }
    //                                     }); //遍历配置文件结束
    //                                     if (defaultVal != null && defaultVal != "" && that.tableid == null) //有待查证tableid
    //
    //                                         datas[this.items[index].num].status = "selected"; //有默认值更新其选择框状态
    //
    //                                     if (this.items[index].column_type == "Date") { //日历则打开日历选择框
    //
    //                                         UICore.openTimeComponent(this.items[index])
    //
    //                                     } else if (this.items[index].column_label == "checkbox") {
    //                                         if (defaultKey != -1) {
    //                                             var key_arr = defaultKey.split(",");
    //                                             for (var i = 0; i < key_arr.length; i++) {
    //                                                 datas[key_arr[i] - 1].status = "selected"
    //                                             }
    //
    //                                         }
    //                                         UICore.openSelectmulti(datas, this.items[index], "checkbox", true); //否则打开一般选择框
    //                                         var keys = [];
    //                                         api.addEventListener({
    //                                             name: 'checkbox'
    //                                         }, function(ret, err) {
    //                                             if (ret) {
    //                                                 console.log(JSON.stringify(ret.value.key1));
    //                                                 ret.value.key1.forEach(function(value) {
    //                                                     keys.push(value.key);
    //                                                 });
    //                                                 this_.items[index].key = keys.join(",");
    //                                             } else {
    //                                                 alert(JSON.stringify(err));
    //                                             }
    //                                         });
    //
    //                                     } else {
    //                                         UICore.openSelect(datas, this.items[index]); //否则打开一般选择框
    //                                     }
    //                                 }
    //                             }
    //                         }, //选择事件结束
    //                         closeWin: function() {
    //                             api.closeWin({
    //                                 name: 'dynamic'
    //                             });
    //                         }, //关闭事件结束
    //                         save: function() {
    //                                 if (this.isBrowser) { //如果是查询界面
    //                                     this.saved = "保存";
    //                                     this.isBrowser = false;
    //                                 } else { //新增或者可编辑时
    //                                     console.log("fdsssdd");
    //                                     this.items.forEach(function(value, index) { //循环遍历数据源
    //                                         if (value.column_label == "select") { //类型为选择时获取key
    //                                             that.postjson[value.column_key] = value.key;
    //                                         } else if (value.column_label == "text") { //类型为文本是获取value
    //                                             that.postjson[value.column_key] = value.value;
    //                                         } else if (value.column_label == "checkbox") {
    //                                             that.postjson[value.column_key] = value.key;
    //                                         }
    //                                     });
    //                                     that.expandjson[that.english_name] = that.postjson
    //                                     console.log(JSON.stringify(that.expandjson));
    //                                     api.sendEvent({ //发送广播给上个界面
    //                                         name: 'population_json',
    //                                         extra: {
    //                                             key: that.expandjson
    //                                         }
    //                                     }); //发送事件结束
    //                                     api.closeWin({
    //                                         name: 'dynamic'
    //                                     }); //关闭当前页面
    //                                 }
    //                             } //保存事件结束
    //                     }
    //                 }); //vue对象结束
    //             } else {
    //                 api.hideProgress();
    //                 alert(JSON.stringify(err));
    //             }
    //         });
    //
    //     }
}
