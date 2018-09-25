window.apiready = function () {
  var personObj = api.pageParam;
  var index = personObj.index;
  var personJson = personObj.name;
  var jsondata = eval('(' + decodeURIComponent(personJson.Data) + ')');
  var list = [];
  if (jsondata[0].deptList.length > 0) {
    list = jsondata[0].deptList
  } else if (jsondata[0].personList.length > 0) {
    list = jsondata[0].personList
  }
  var vm = new Vue({
    el: "#app",
    data: {
      personList: list,
      id: '',
      name: '',
      chooseArr: [],
      // 2是多选，1是单选
      chooseType: jsondata[0].chooseType
    },
    methods: {
      // 选择
      personClick: function (id, name) {
        if (this.chooseType != '2') {
          if (this.id == id) {
            this.id = '';
            this.name = '';
          } else {
            this.id = id;
            this.name = name;
          }
        } else {
          var flag = true;
          this.chooseArr.forEach(function (e, i) {
            if (e.id == id) {
              flag = false;
              vm.chooseArr.splice(i, 1);
            }
          });
          flag && this.chooseArr.push({
            id: id,
            name: name
          });
        }
      },
      // 判断isClass
      isClass: function (id) {
        if (this.chooseType != '2') {
          if (this.id == id) {
            return 'liper';
          } else {
            return '';
          }
        } else {
          var className = '';
          this.chooseArr.forEach(function (e, i) {
            if (e.id == id) {
              className = 'liper';
            }
          });
          return className;
        }
      },
      subButtonClick: function (id, name) {
        if (this.chooseType != '2') {
          if (this.id == '') {
            api.toast({
              msg: '请先选择人员或部门',
              duration: 2000,
              location: 'bottom'
            });
            return false;
          }
        } else {
          if (this.chooseArr.length > 0) {
            this.chooseArr.forEach(function (e, i) {
              if (vm.id == '') {
                vm.id = e.id;
                vm.name = e.name;
              } else {
                vm.id = vm.id + ',' + e.id;
                vm.name = vm.name + ',' + e.name;
              }
            });
          } else {
            api.toast({
              msg: '请先选择人员或部门',
              duration: 2000,
              location: 'bottom'
            });
            return false;
          }
        }
        var that = this;
        api.sendEvent({
          name: 'personClick',
          extra: {
            key1: that.id,
            key2: that.name,
            chooseType: jsondata[0].chooseType
          }
        });
        api.closeWin();
      }
    },
    components: {
      "header-comp": function (resolve, reject) {
        api.readFile({
          path: 'widget://html/component/headertop.html'
        }, function (ret, err) {
          if (ret) {
            resolve({
              template: ret.data,
              data: function () {
                return {
                  title: "选择上报"
                }
              },
              methods: {
                closeWin: function () {
                  api.closeWin();
                }
              }
            });
          } else {
            alert(JSON.stringify(err));
          }
        });
      }
    }
  })
}
