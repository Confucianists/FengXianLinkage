/**
 * Created by kevin on 2017/7/6.
 */
apiready = function() {
    propertyOwnerObj = new PropertyOwner();
    propertyOwnerObj.initSelectData();
    var query = $api.byId('pkh_add_su');
    var queryJson = {};
    var postJson = {};
    $api.addEvt(query, 'click', function() {
        queryJson.pageSize = 15;
        queryJson.pageNow = 1;
        if (vue.name)
            queryJson.name = vue.name;
        if (vue.idcard)
            queryJson.cardid = vue.idcard;
        if (vue.sex)
            queryJson.sex = vue.sex;
        queryJson.createUserGridCode = $api.getStorage('userinf').gridCode;
        1;
        postJson.population = queryJson;
        // console.log(JSON.stringify(postJson));
        api.openWin({
            name: 'populationResult',
            url: '../population/populationResult.html',
            pageParam: {
                from:'propertyOwner',
                json: postJson
            }
        });
    });


    var vue = new Vue({
        el: "#list",
        data: {
            buildingName: "",
            name: "",
            idcard: "",
            sex: "",
        },
        methods: {
            choose: function() {
                console.log("性别");
                var that = this;
                var defaultVal = this.sex; //获取默认值
                if (defaultVal != null && defaultVal != "") {
                    propertyOwnerObj.sex_arr.forEach(function(value, index, arr) {
                        if (value.text == that.sex) {
                            arr[index].status = "selected";
                        }
                    })
                }
                UICore.openSelect3(propertyOwnerObj.sex_arr, this.sex, "sex");
                api.addEventListener({
                    name: 'sex'
                }, function(ret, err) {
                    if (ret) {
                        that.sex = ret.value.key1;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            }
        }
    })
}
PropertyOwner = function() {};

PropertyOwner.prototype = {
    sex_arr: [],
    initSelectData: function() {
        this.sex_arr.push({ //楼号类型
            text: "男",
            status: 'normal',
            key: 1
        }, {
            text: "女",
            status: 'normal',
            key: 2
        });
    }
}
