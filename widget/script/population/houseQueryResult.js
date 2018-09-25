/**
 * Created by kevin on 2017/7/6.
 */
apiready = function() {
    var houseQueryResultObj = new HouseQueryResult();
    var param = api.pageParam
    houseQueryResultObj.initData(JSON.stringify(param.postjson));

    new Vue({
        el: "#infos",
        data: {
            items: houseQueryResultObj.houseOwer_arr
        },
        methods: {
            choose: function(index) {
                // console.log(JSON.stringify(this.items[index]));
                UICore.sendEvent("houseOwer", (houseQueryResultObj.entity)[index])
                api.closeWin({
                    name: 'HouseQuery'
                });
                api.closeWin();
            }
        }
    })
}
HouseQueryResult = function() {};

HouseQueryResult.prototype = {
    entity: {},
    houseOwer_arr: [],
    initData: function(param) {
        var that = this;
        console.log(UICore.serviceUrl + 'mobile/mobileInterfaceForResident.shtml?act=queryResidentInfo&data=' + param);
        api.ajax({
            url: UICore.serviceUrl + 'mobile/mobileInterfaceForResident.shtml?act=queryResidentInfo&data=' + param,
            method: 'get',
        }, function(ret, err) {
            if (ret.success) {
                that.entity = ret.data;
                ret.data.forEach(function(value) {
                    that.houseOwer_arr.push({
                        name: value.houseOwner,
                        address: value.unitName + value.roomNum,
                        time: value.createTime
                    })
                })
            }

        });

    }
}
