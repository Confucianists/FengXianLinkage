/**
 * Created by kevin on 2017/7/5.
 */
apiready = function() {
    var param = api.pageParam;
    var num = parseInt(param.number); //长度
    var unit = param.editUnitObj;
    var unit_arr = new Array(num);
    console.log(JSON.stringify(unit));
    if ((JSON.stringify(unit)) != "{}") {
      for (var i = 0; i < unit.length; i++) {
        console.log(i);
          unit_arr[i] = {
                  id: i + 1,
                  unitName: i + 1 + "单元"
              }
              // unit_arr[i]=i+"单元"
      };
    } else {
        for (var i = 0; i < unit_arr.length; i++) {
            console.log(i);
            unit_arr[i] = {
                    id: i + 1,
                    unitName: i + 1 + "单元"
                }
                // unit_arr[i]=i+"单元"
        };
    }
  console.log(JSON.stringify(unit_arr));

    var sunmit = $api.byId('pkh_add_su');
    $api.addEvt(sunmit, 'click', function() {
        UICore.sendEvent("unitlist", vue.items);
        api.closeWin();

    });


    var vue = new Vue({
        el: "#list",
        data: {
            unit: "",
            items: unit_arr,
        },
        methods: {
            addunit: function() {
                var that = this;
                var hasName = false;
                this.items.forEach(function(value, index) {

                    if (value.unitName == that.unit + "单元") {
                        alert("单元/梯/区重复");
                        hasName = true;
                    }
                })
                if (!hasName) {
                    num = num + 1;
                    this.items.push({
                        id: num,
                        unitName: this.unit + "单元"
                    });
                }
                this.unit = "";
            },
            del: function(index) {
                var that = this;
                api.confirm({
                    title: '警告',
                    msg: '是否删除该数据',
                    buttons: ['确定', '取消']
                }, function(ret, err) {
                    if (ret) {
                        var i = ret.buttonIndex;
                        if (i == 1) {
                            that.items.splice(index, 1);
                        }
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            }
        }
    })
}
