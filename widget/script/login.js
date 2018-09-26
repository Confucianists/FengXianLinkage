apiready = function () {
  // 卸载原有报名：
  api.appInstalled({
    appBundle: 'com.ocn.twzm'
  }, function (ret, err) {
    if (ret.installed) {
      //应用已安装
      api.uninstallApp({
        packageName: 'com.ocn.twzm'
      });
    }
  });
  var user = new Vue({
    el: '#dcontent',
    data: {
      checked: false,
      content: {
        username: '',
        password: '',
        checkpwd: true,
        checkuser: true
      }
    },
    created: function () {
      this.content.username = $api.getStorage('username');
      this.content.password = $api.getStorage('password');
      if (this.content.password) {
        this.checked = true;
      }
    },
    methods: {
      // 跳转页面
      jumpPage: function (name, url) {
        (name && url) && UICore.openWindown(name, url, url);
      },
      login: function (e) {
        var that = this;
        if (this.content.checkpwd && this.content.checkuser) {
          var user = this.content.username;
          var pwd = this.content.password;
          if (this.checked) {
            $api.setStorage('username', user);
            $api.setStorage('password', pwd);
          } else {
            $api.rmStorage('username');
            $api.rmStorage('password');
          }
          UICore.showLoading('正在登录...', '请稍后...');
          $('.backgroundcover').show();
          console.log(UICore.serviceUrl + "mobile/mobileInterface.shtml?act=loginFace&passWord=" + pwd + "&userName=" + user);
          api.ajax({
            url: UICore.serviceUrl2() + "mobile/mobileInterface.shtml?act=loginFace&passWord=" + pwd + "&userName=" + user,
            method: 'get',
            timeout: 30,
          }, function (reta, erra) {
            api.hideProgress();
            $('.backgroundcover').hide();
            if (reta) {
              if (reta.success == "true") {
                window.localStorage.setItem('token', reta.Data[0].token);
                $api.setStorage('userData', reta.Data[0]);
                $api.setStorage('userinf', reta.accu[0]);
                //判断是否有配置文件
                var isHasConfig = api.getPrefs({
                  sync: true,
                  key: 'isHasConfig'
                });
                //如果没有则下载配置文件
                if (!isHasConfig) {
                  UICore.showLoading('正在下载配置文件...', '请稍后...');
                  api.ajax({
                    url: UICore.serviceUrl2() + "/mobile/mobileDynaTable.shtml?act=selectConfigureTableNew",
                    method: 'get'
                  }, function (reta, err) {
                    api.hideProgress();
                    if (reta.success) {
                      $api.setStorage('settingdata', JSON.stringify(reta));
                      api.setPrefs({
                        key: 'isHasConfig',
                        value: true
                      });
                      //打开新界面
                      api.openWin({
                        name: 'home',
                        url: '../index.html',
                        pageParam: {
                          name: 'home'
                        }
                      })
                      //如果配置文件下载失败
                    } else {
                      
                      alert(JSON.stringify(reta));
                      alert(reta.ErrorInfo)
                    }
                  }); //ajax方法结尾
                  //如果已经有配置文件则直接进入
                } else {
                  api.openWin({
                    name: 'home',
                    url: '../index.html',
                    pageParam: {
                      name: 'home'
                    }
                  });
                }
                //登录失败提醒
              } else {
                that.content.password = "";
                alert(reta.ErrorInfo)
              }
            } else {
              if (erra.body) {
                api.alert({ msg: '连接失败' });
              } else {
                alert(JSON.stringify(erra));
              }
            }

          });
        }

      },
      checkpwd: function () {
        if (this.content.password == '') {
          alert("密码为空")
        } else {
          this.content.checkpwd = true;
        }
      },
      checkuser: function () {
        if (this.content.username == '') {
          alert("用户名为空")
        } else {
          this.content.checkuser = true;
        }
      }
    }
  });
}
