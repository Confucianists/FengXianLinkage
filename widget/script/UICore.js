(function (window) {
  var mockFlag = false;
  // var serviceUrl = "http://61.160.70.170:18186/";
  // var serviceUrl = "http://61.160.70.170:8888/";
  // var serviceUrl = "http://10.63.48.168:58888/";
  // var serviceUrl = "http://10.63.32.89:57777/";
  var serviceUrl = "http://10.63.48.168/"
  // var serviceUrl = "http://192.168.1.11:8080/";
  var serviceUrlSet = window.localStorage.getItem('ipBp2');
  if(!serviceUrlSet){
    window.localStorage.setItem('ipBp2', serviceUrl);
    serviceUrlSet = serviceUrl;
  }
  // alert(serviceUrlSet);
  UICore = function () {};
  UICore.prototype = {
    serviceUrl: serviceUrlSet,
    serviceUrl2: function(){
      var serviceUrlSet2 = window.localStorage.getItem('ipBp2');
      if(!serviceUrlSet2){
        window.localStorage.setItem('ipBp2', serviceUrl);
        serviceUrlSet2 = serviceUrl;
      }
      return serviceUrlSet2;
    },
    mapServiceUrl: "http://61.185.20.73:58888/",
    serviceUrlMock: mockFlag ? 'http://192.168.1.207:3000/' : serviceUrlSet,
    flowId: "TEST",
    changeIp: function(url, cb){
      window.localStorage.setItem('ipBp2', url);
      window.UICore.serviceUrl = url;
      cb && cb();
    },
    showLoading: function (title, text) {
      api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: title,
        text: text,
        modal: false
      });
    },
    openTime: function (vm, column_key, defaultTime, cb) {
      var w_this = this;
      var time = "";
      if (defaultTime != null && defaultTime != "" && !(typeof (defaultTime) == 'undefined')) {
        time = defaultTime;
      } else {
        time = this.getnowtime();
      }
      api.openPicker({
        type: 'date_time',
        date: time,
        title: '选择时间'
      }, function (ret, err) {
        if ('' != ret && null != ret && undefined != ret) {
          var check_time = ret.year + "-" + w_this.padleft0(ret.month) + "-" + w_this.padleft0(ret.day);
          if (vm) {
            vm.alltag[column_key] = check_time;
          }
          cb && cb(check_time);
        } else {
          alert(JSON.stringify(err));
        }
      });
    },
    openTimeComponent: function (obj, defaultTime) {
      var w_this = this;
      var time = "";
      if (defaultTime != null && defaultTime != "" && !(typeof (defaultTime) == 'undefined')) {
        time = defaultTime;
      } else {
        time = this.getnowtime();
      }
      api.openPicker({
        type: 'date_time',
        date: time,
        title: '选择时间'
      }, function (ret, err) {
        if ('' != ret && null != ret && undefined != ret) {
          var check_time = ret.year + "-" + w_this.padleft0(ret.month) + "-" + w_this.padleft0(ret.day);
          obj.value = check_time;
          obj.key = 0;
        } else {
          alert(JSON.stringify(err));
        }
      });
    },
    openTimeComponent2: function (obj, defaultTime) {
      var w_this = this;
      var time = "";
      if (defaultTime != null && defaultTime != "" && !(typeof (defaultTime) == 'undefined')) {
        time = defaultTime;
      } else {
        time = this.getnowtime();
      }
      api.openPicker({
        type: 'date_time',
        date: time,
        title: '选择时间'
      }, function (ret, err) {
        if ('' != ret && null != ret && undefined != ret) {
          var check_time = ret.year + "-" + w_this.padleft0(ret.month) + "-" + w_this.padleft0(ret.day);
          obj = check_time;
          UICore.sendEvent("buildingTime", obj);

        } else {
          alert(JSON.stringify(err));
        }
      });
    },
    getnowtime: function () {
      var nowtime = new Date();
      var year = nowtime.getFullYear();
      var month = this.padleft0(nowtime.getMonth() + 1);
      var day = this.padleft0(nowtime.getDate());
      var hour = this.padleft0(nowtime.getHours());
      var minute = this.padleft0(nowtime.getMinutes());
      var second = this.padleft0(nowtime.getSeconds());
      return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    },
    padleft0: function (obj) {
      return obj.toString().replace(/^[0-9]{1}$/, "0" + obj);
    },
    sendEvent: function (name, key, id) {
      api.sendEvent({
        name: name,
        extra: {
          key1: key,
          key2: id,
        }
      });
    },
    checkPhone: function (phone) {
      if (!(/^1[34578]\d{9}$/.test(phone))) {
        alert("手机号码有误，请重填");
        return false;
      } else {
        return true;
      }
    },
    closeWin: function (name) {
      api.closeWin({
        name: name
      });

    },
    downSetting: function () {
      api.ajax({
        url: this.serviceUrl + 'mobile/mobileDynaTable.shtml?act=selectConfigureTableNew',
        method: 'get'
      }, function (ret, err) {
        if (ret) {
          $api.setStorage('settingdata', JSON.stringify(ret));
        }
      });
    },
    openSelect: function (itemArray, myObj, eventName, alltag, column_key, cb) {
      var UIMultiSelector = api.require('UIMultiSelector');
      UIMultiSelector.open({
        rect: {
          h: 244
        },
        text: {
          title: '',
          leftBtn: '取消',
          rightBtn: '确定',
          selectAll: 'ALL'
        },
        max: 0,
        singleSelection: true,
        styles: {
          mask: 'rgba(0,0,0,0.5)',
          title: {
            bg: '#F5F5F5',
            color: '#000000',
            size: 16,
            h: 44
          },
          leftButton: {
            bg: '#E0E0E0',
            w: 80,
            h: 35,
            marginT: 5,
            marginL: 8,
            color: '#969696',
            size: 14
          },
          rightButton: {
            bg: '#FFD40D',
            w: 80,
            h: 35,
            marginT: 5,
            marginR: 8,
            color: '#969696',
            size: 14
          },
          item: {
            h: 35,
            bg: '#ffffff',
            bgActive: 'rgb(43,213,166)',
            bgHighlight: 'rgb(238,17,150)',
            color: 'rgb(22,112,233)',
            active: 'rgb(201,118,126)',
            highlight: 'rgb(255,255,0)',
            size: 14,
            lineColor: 'rgb(78,57,255)',
            textAlign: 'center'
          },
          icon: {
            w: 0,
            h: 0,
            marginT: 11,
            marginH: 8,
            bg: '#fff',
            align: 'right'
          }
        },
        animation: true,
        items: itemArray
      }, function (ret, err) {
        if (ret) {
          if (ret.eventType == "clickRight") {
            if (ret.items.length > 0) {
              itemArray.forEach(function (value) {
                value.status = "normal"
              });
              var key = ret.items[0].key;
              var text = ret.items[0].text;
              cb && cb(ret.items[0]);
              if (myObj) {
                myObj.value = text;
                myObj.key = key;
                myObj.status = "selected";
                myObj.num = key - 1;
              }
              if (eventName != null && eventName != "" && !(typeof (eventName) == "undefined")) {
                UICore.sendEvent(eventName, myObj);
              }
              if (alltag != null && alltag != "" && !(typeof (alltag) == "undefined")) {
                alltag[column_key] = key;
              }

              //户籍相关
              if (ret.items[0].city) {
                myObj.arr = ret.items[0].city;
                myObj.code = ret.items[0].code;
              }
            }
            UIMultiSelector.close();
          } else if (ret.eventType == "clickLeft") {
            UIMultiSelector.close();
          } else if (ret.eventType == "clickMask") {
            UIMultiSelector.close();
          }

        } else {
          alert(JSON.stringify(err));
        }
      });
    },
    openCheckBox: function (itemArray, myObj, eventName, alltag, column_key, cb) {
      var UIMultiSelector = api.require('UIMultiSelector');
      UIMultiSelector.open({
        rect: {
          h: 244
        },
        text: {
          title: '',
          leftBtn: '取消',
          rightBtn: '确定',
          selectAll: '全选'
        },
        max: 0,
        singleSelection: false,
        styles: {
          mask: 'rgba(0,0,0,0.5)',
          title: {
            bg: '#F5F5F5',
            color: '#000000',
            size: 16,
            h: 44
          },
          leftButton: {
            bg: '#E0E0E0',
            w: 80,
            h: 35,
            marginT: 5,
            marginL: 8,
            color: '#969696',
            size: 14
          },
          rightButton: {
            bg: '#FFD40D',
            w: 80,
            h: 35,
            marginT: 5,
            marginR: 8,
            color: '#969696',
            size: 14
          },
          item: {
            h: 35,
            bg: '#ffffff',
            bgActive: 'rgb(43,213,166)',
            bgHighlight: 'rgb(238,17,150)',
            color: 'rgb(22,112,233)',
            active: 'rgb(201,118,126)',
            highlight: 'rgb(255,255,0)',
            size: 14,
            lineColor: 'rgb(78,57,255)',
            textAlign: 'center'
          },
          icon: {
            w: 20,
            h: 20,
            marginT: 11,
            marginH: 8,
            bg: '#EFEFEF',
            bgActive: '#FFCE44',              //（可选项）字符串类型；已选中图标的背景，支持 rgb、rgba、#、img；默认：bg
            bgHighlight: '#FFCE44',           //（可选项）字符串类型；选项的高亮背景，支持 rgb、rgba、#、img；默认：bg
            align: 'left'
          }
        },
        animation: true,
        items: itemArray
      }, function (ret, err) {
        if (ret) {
          if (ret.eventType == "clickRight") {
            if (ret.items.length > 0) {
              var key = "";
              var text = "";
              for (var item in ret.items) {
                if (key == "") {
                  key = key + ret.items[item].key;
                } else {
                  key = key + "," + ret.items[item].key;
                }
                if (text == "") {
                  text = text + ret.items[item].text;
                } else {
                  text = text + "," + ret.items[item].text;
                }
              }
              if (myObj) {
                myObj.value = text;
                myObj.key = key;
              }
              cb && cb({
                key: key,
                text: text
              }, ret.items);
              if (eventName != null && eventName != "" && !(typeof (eventName) == "undefined")) {
                UICore.sendEvent(eventName, myObj);
              }
              if (alltag != null && alltag != "" && !(typeof (alltag) == "undefined")) {
                alltag[column_key] = key;
              }

            } else {
              myObj.value = "";
              myObj.key = "";
              if (alltag != null && alltag != "" && !(typeof (alltag) == "undefined")) {
                alltag[column_key] = "";
              }
            }
            UIMultiSelector.close();
          } else if (ret.eventType == "clickLeft") {
            UIMultiSelector.close();
          } else if (ret.eventType == "clickMask") {
            UIMultiSelector.close();
          }

        } else {
          alert(JSON.stringify(err));
        }
      });
    },
    //第一个参数输入标题，第二个参数输入路径，第三个参数具体路径（urls在某个相同的路径时）
    openWindown: function (name, urls, page, page1) {
      api.openWin({
        name: "enter",
        url: urls,
        vScrollBarEnabled: false,
        pageParam: {
          name: name,
          page: page == null ? '' : page,
          page1: page1 == null ? '' : page1
        }
      });
    },
    openSelect2: function (itemArray, myObj, eventName) { //原来模板(不适用)
      var UIMultiSelector = api.require('UIMultiSelector');
      UIMultiSelector.open({
        rect: {
          h: 244
        },
        text: {
          title: '',
          leftBtn: '取消',
          rightBtn: '确定',
          selectAll: 'ALL'
        },
        max: 0,
        singleSelection: true,
        styles: {
          mask: 'rgba(0,0,0,0.5)',
          title: {
            bg: '#F5F5F5',
            color: '#000000',
            size: 16,
            h: 44
          },
          leftButton: {
            bg: '#E0E0E0',
            w: 80,
            h: 35,
            marginT: 5,
            marginL: 8,
            color: '#969696',
            size: 14
          },
          rightButton: {
            bg: '#FFD40D',
            w: 80,
            h: 35,
            marginT: 5,
            marginR: 8,
            color: '#969696',
            size: 14
          },
          item: {
            h: 35,
            bg: '#ffffff',
            bgActive: 'rgb(43,213,166)',
            bgHighlight: 'rgb(238,17,150)',
            color: 'rgb(22,112,233)',
            active: 'rgb(201,118,126)',
            highlight: 'rgb(255,255,0)',
            size: 14,
            lineColor: 'rgb(78,57,255)',
            textAlign: 'center'
          },
          icon: {
            w: 0,
            h: 0,
            marginT: 11,
            marginH: 8,
            bg: '#fff',
            align: 'right'
          }
        },
        animation: true,
        items: itemArray
      }, function (ret, err) {
        if (ret) {
          if (ret.eventType == "clickRight") {
            if (ret.items.length > 0) {
              var key = ret.items[0].key;
              var text = ret.items[0].text;

              $api.val(myObj, text);
              $api.attr(myObj, 'name', key);

              if (eventName != null && eventName != "" && !(typeof (eventName) == "undefined")) {
                UICore.sendEvent(eventName, key);
              }
            } else {
              myObj.val("");
              myObj.attr("name", "");
            }

            UIMultiSelector.close();
          } else if (ret.eventType == "clickLeft") {
            UIMultiSelector.close();
          } else if (ret.eventType == "clickMask") {
            UIMultiSelector.close();
          }

        } else {
          alert(JSON.stringify(err));
        }
      });
    },
    openSelect3: function (itemArray, myObj, eventName) {
      var UIMultiSelector = api.require('UIMultiSelector');
      UIMultiSelector.open({
        rect: {
          h: 244
        },
        text: {
          title: '',
          leftBtn: '取消',
          rightBtn: '确定',
          selectAll: 'ALL'
        },
        max: 0,
        singleSelection: true,
        styles: {
          mask: 'rgba(0,0,0,0.5)',
          title: {
            bg: '#F5F5F5',
            color: '#000000',
            size: 16,
            h: 44
          },
          leftButton: {
            bg: '#E0E0E0',
            w: 80,
            h: 35,
            marginT: 5,
            marginL: 8,
            color: '#969696',
            size: 14
          },
          rightButton: {
            bg: '#FFD40D',
            w: 80,
            h: 35,
            marginT: 5,
            marginR: 8,
            color: '#969696',
            size: 14
          },
          item: {
            h: 35,
            bg: '#ffffff',
            bgActive: 'rgb(43,213,166)',
            bgHighlight: 'rgb(238,17,150)',
            color: 'rgb(22,112,233)',
            active: 'rgb(201,118,126)',
            highlight: 'rgb(255,255,0)',
            size: 14,
            lineColor: 'rgb(78,57,255)',
            textAlign: 'center'
          },
          icon: {
            w: 0,
            h: 0,
            marginT: 11,
            marginH: 8,
            bg: '#fff',
            align: 'right'
          }
        },
        animation: true,
        items: itemArray
      }, function (ret, err) {
        if (ret) {
          if (ret.eventType == "clickRight") {
            if (ret.items.length > 0) {
              itemArray.forEach(function (value) {
                value.status = "normal"
              });
              var key = ret.items[0].key;
              var text = ret.items[0].text;
              myObj = text;
              if (eventName != null && eventName != "" && !(typeof (eventName) == "undefined")) {
                UICore.sendEvent(eventName, myObj, key);
              }
            } else {
              myObj = "";
              if (eventName != null && eventName != "" && !(typeof (eventName) == "undefined")) {
                UICore.sendEvent(eventName, myObj, "");
              }
            }

            UIMultiSelector.close();
          } else if (ret.eventType == "clickLeft") {
            UIMultiSelector.close();
          } else if (ret.eventType == "clickMask") {
            UIMultiSelector.close();
          }

        } else {
          alert(JSON.stringify(err));
        }
      });
    },
    openSelectmulti: function (itemArray, myObj, eventName) {
      console.log(JSON.stringify(itemArray));
      var UIMultiSelector = api.require('UIMultiSelector');
      UIMultiSelector.open({
        rect: {
          h: 244
        },
        text: {
          title: '',
          leftBtn: '取消',
          rightBtn: '确定',
          selectAll: 'ALL'
        },
        max: 0,
        singleSelection: false,
        styles: {
          mask: 'rgba(0,0,0,0.5)',
          title: {
            bg: '#F5F5F5',
            color: '#000000',
            size: 16,
            h: 44
          },
          leftButton: {
            bg: '#E0E0E0',
            w: 80,
            h: 35,
            marginT: 5,
            marginL: 8,
            color: '#969696',
            size: 14
          },
          rightButton: {
            bg: '#FFD40D',
            w: 80,
            h: 35,
            marginT: 5,
            marginR: 8,
            color: '#969696',
            size: 14
          },
          item: {
            h: 35,
            bg: '#ffffff',
            bgActive: 'rgb(43,213,166)',
            bgHighlight: 'rgb(238,17,150)',
            color: 'rgb(22,112,233)',
            active: 'rgb(201,118,126)',
            highlight: 'rgb(255,255,0)',
            size: 14,
            lineColor: 'rgb(78,57,255)',
            textAlign: 'center'
          },
          icon: {
            w: 0,
            h: 0,
            marginT: 11,
            marginH: 8,
            bg: '#fff',
            align: 'right'
          }
        },
        animation: true,
        items: itemArray
      }, function (ret, err) {
        if (ret) {
          if (ret.eventType == "clickRight") {
            if (ret.items.length > 0) {
              itemArray.forEach(function (value) {
                value.status = "normal"
              });
              var selected = [];
              ret.items.forEach(function (value) {
                selected.push(value);
              });
              if (eventName != null && eventName != "" && !(typeof (eventName) == "undefined")) {
                UICore.sendEvent(eventName, selected);
              }
            } else {
              myObj.text = "";
            }

            UIMultiSelector.close();
          } else if (ret.eventType == "clickLeft") {
            UIMultiSelector.close();
          } else if (ret.eventType == "clickMask") {
            UIMultiSelector.close();
          }

        } else {
          alert(JSON.stringify(err));
        }
      });
    },
    checkTel: function (name, value) {//联系电话的验证
      if (value.indexOf("-") != -1) {//固定电话
        if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,8}$/.test(value)) {
          UICore.toast_info(name, '联系电话格式不正确!');
          return false;
        }
      } else {//手机号码
        if (!(/^1[34578]\d{9}$/.test(value))) {
          UICore.toast_info(name, '联系电话格式不正确!');
          return false;
        }
      }
      return true;
    },
  }
  window.UICore = new UICore();

})(window)
