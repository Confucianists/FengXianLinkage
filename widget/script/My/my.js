/*
  Created by hzh on 2017/7/731
*/
apiready = function () {
  var vue = new Vue({
    el: "#list",
    data: {},
    methods: {
      personInfo: function () {
        api.openWin({
          name: 'personInfo',
          url: './personInfo.html',
        });

      },
      updatePassword: function () {
        api.openWin({
          name: 'modifyPassword',
          url: './modifyPassword.html',
        });
      },
      clearCache: function () {
        var dialogBox = api.require('dialogBox');
        dialogBox.alert({
          texts: {
            title: "提示",
            content: "确定要清除本地缓存吗？",
            leftBtnTitle: '取消',
            rightBtnTitle: '确认'
          },
          styles: {
            bg: '#fff',
            w: 300,
            title: {
              marginT: 20,
              icon: '',
              iconSize: 40,
              titleSize: 14,
              titleColor: '#000'
            },
            content: {
              color: '#000',
              size: 14
            },
            left: {
              marginB: 7,
              marginL: 20,
              w: 130,
              h: 35,
              corner: 2,
              bg: '#87CEFA',
              size: 12
            },
            right: {
              marginB: 7,
              marginL: 10,
              w: 130,
              h: 35,
              corner: 2,
              bg: '#87CEFA',
              size: 12
            }
          }
        }, function (ret) {
          var dialogBox = api.require('dialogBox');
          dialogBox.close({
            dialogName: 'alert'
          });
          if (ret.eventType == 'right') {
            alert("暂无缓存");

          }
        });
      },
      // 跳转页面
      jumpPage: function (name, url) {
        (name && url) && UICore.openWindown(name, url, url);
      },
      checkVersion: function () {
        var mam = api.require('mam');
        mam.checkUpdate(function (ret, err) {
          // alert(JSON.stringify(ret));
          if (ret && ret.result) {
            var result = ret.result;
            if (result.update == true && result.closed == false) {
              var str = '新版本型号:' + result.version + ';更新提示语:' + result.updateTip + ';下载地址:' + result.source + ';发布时间:' + result.time;
              api.confirm({
                title: '有新的版本,是否下载并安装 ',
                msg: str,
                buttons: ['确定', '取消']
              }, function (ret, err) {
                if (ret.buttonIndex == 1) {
                  if (api.systemType == "android") {
                    api.download({
                      url: result.source,
                      report: true
                    }, function (ret, err) {
                      if (ret && 0 == ret.state) {/* 下载进度 */
                        api.toast({
                          msg: "正在下载应用" + ret.percent + "%",
                          duration: 2000
                        });
                      }
                      if (ret && 1 == ret.state) {/* 下载完成 */
                        var savePath = ret.savePath;
                        api.installApp({
                          appUri: savePath
                        });
                      }
                    });
                  }
                  if (api.systemType == "ios") {
                    api.installApp({
                      appUri: result.source
                    });
                  }
                }
              });
            } else {
              api.alert({
                msg: "暂无更新"
              });
            }
          } else {
            api.alert({
              msg: err.msg || '暂无更新'
            });
          }
        });
      },
      updateConfigure: function () {
        var dialogBox = api.require('dialogBox');
        dialogBox.alert({
          texts: {
            title: "提示",
            content: "确定要更新配置文件吗？",
            leftBtnTitle: '取消',
            rightBtnTitle: '确认'
          },
          styles: {
            bg: '#fff',
            w: 300,
            title: {
              marginT: 20,
              icon: '',
              iconSize: 40,
              titleSize: 14,
              titleColor: '#000'
            },
            content: {
              color: '#000',
              size: 14
            },
            left: {
              marginB: 7,
              marginL: 20,
              w: 130,
              h: 35,
              corner: 2,
              bg: '#87CEFA',
              size: 12
            },
            right: {
              marginB: 7,
              marginL: 10,
              w: 130,
              h: 35,
              corner: 2,
              bg: '#87CEFA',
              size: 12
            }
          }
        }, function (ret) {
          var dialogBox = api.require('dialogBox');
          dialogBox.close({
            dialogName: 'alert'
          });
          if (ret.eventType == 'right') {
            UICore.showLoading('正在下载配置文件...', '请稍后...');
            api.ajax({
              url: UICore.serviceUrl + "mobile/mobileDynaTable.shtml?act=selectConfigureTableNew",
              method: 'get'
            }, function (reta, err) {
              // alert(JSON.stringify(reta));
              api.hideProgress();
              if (reta.success) {
                //如果下载成功则写入文件
                var cacheDir = api.cacheDir;
                api.writeFile({
                  path: cacheDir + 'config.json',
                  data: JSON.stringify(reta),
                  append: false,
                }, function (ret, err) {
                  if (ret.status) {
                    $api.setStorage('settingdata', JSON.stringify(reta))
                    //记录写入成功标记
                    api.setPrefs({
                      key: 'isHasConfig',
                      value: true
                    });
                    api.toast({
                      msg: '更新完成',
                      duration: 3000,
                      location: 'bottom'
                    });
                  } else {
                    alert("缓存本地失败")
                  }
                });
              } else {
                alert("下载失败");
              }
            });
          }
        });

      },

    },
    components: {
      "main-item": {
        template: "#item-element",
        props: ["actioname", "myclass"],

      }
    },
  });
};
