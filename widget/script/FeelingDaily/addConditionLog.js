window.apiready = function(){
    new Vue({
      el:"#list",
      data:{
        formJSON:{},
        mStatus:"isNew",
        isClick: false, //标记是否可以编辑, false表示不绑定，可以编辑；true表示绑定，不可编辑
        id:"",
        personName:"",//受访对象姓名
        personCode:"",//证件号码
        serviceTypeID:"",
        serviceType:"",//服务类型
        unit:"",//单位
        staff:"",//工作人员
        serviceTime:"",//服务时间
        booker:"",//登记人
        descriration:"",//内容描述
        serviceType_arr:[
          {
           text: "服务",
           status: 'normal',
           key: 0
          },
          {
            text: "民情",
            status: 'normal',
            key: 1
          },
          {
            text: "民意",
            status: 'normal',
            key: 2

           }
         ],
         imgarr: {
             imgpaths: [], //图片地址存放数组
             videopaths: [], //视频地址存放数组
             imgnum: 0, //图片全局索引
             videonum: 0, //视频全局索引
             attachmentId:"",//附件ID
             attachmentIdPathJson:{}
         },
         show: { //控制父组件和子组件部分DIV的显示和隐藏
             camerashow: false,
             videoshow: false,
             bgshow: false
         }
      },
      created:function(){
        var  param = api.pageParam;
        console.log(JSON.stringify(param));
        if (param != "" && param != null && param != 'undefined') {
          if(param.status){
            this.mStatus = param.status;
          }

          this.queryParam = param.queryParam;
          this.formJSON = param.data;

        }
        if (this.mStatus == "isBrownse") {
          $api.text($api.byId('pkh_add_su'), '编辑');
          $api.text($api.byId('logTitle'), '编辑日志');

          var _self = this;
          _self.isClick = "true";
          _self.id = _self.formJSON.id;
          _self.personName = _self.formJSON.populationId;//受访对象姓名
          _self.personCode= _self.formJSON.certificateNum;//证件号码
          this.serviceType_arr.forEach(function(value,index,arr){
            if (arr[index].key == _self.formJSON.serviceType) {
              _self.serviceTypeID= arr[index].key;
              _self.serviceType= arr[index].text;//服务类型
            }
          });
          _self.unit= _self.formJSON.enterpriseId;//单位
          _self.staff= _self.formJSON.workerId;//工作人员
          if(_self.formJSON.serviceTime){
            _self.serviceTime= _self.formJSON.serviceTime.substring(0,10);//服务时间
          }
          _self.booker= _self.formJSON.registerId;//登记人
          _self.descriration= _self.formJSON.content;//内容描述
          //_self.imgarr.attachmentId = _self.formJSON.attachmentId;
          if(_self.formJSON.attachmentId){
            var idArr = _self.formJSON.attachmentId.split(",");
            var pathArr = _self.formJSON.uploadPath.split(",");
            for(var num in idArr){
              _self.imgarr.attachmentIdPathJson[idArr[num]] =UICore.serviceUrl+pathArr[num];
              _self.imgarr.imgpaths.push(UICore.serviceUrl+pathArr[num]);
            }
          }
        }else{
          $api.text($api.byId('logTitle'), '新增日志');
        }
      },
      methods:{
        closeWin:function(){
          api.closeWin();
        },
        checkValue:function(){
          return true;
        },
        uploadAttach:function(){
          if (this.mStatus == "isBrownse") {
              $api.text($api.byId('pkh_add_su'), '提交');
              this.mStatus = "isEdit";
              this.isClick = false;
              return;
          }
          if (this.checkValue()) {

            for(var myjson in this.imgarr.attachmentIdPathJson){
              if(this.imgarr.attachmentId==""){
                this.imgarr.attachmentId += myjson;
              }else{
                this.imgarr.attachmentId += ","+myjson;
              }
            }
            console.log(JSON.stringify(this.imgarr.imgpaths));
            if(this.imgarr.imgpaths.length>0){
              var isUpload = false;
              for(var num in this.imgarr.imgpaths){
                if(this.imgarr.imgpaths[num].indexOf("http")==-1){
                  isUpload = true;
                  break;
                }
              }
              if(isUpload){
                UICore.showLoading("上传附件中","请稍侯");
                console.log(UICore.serviceUrl+'mobile/mobileWf.shtml?act=uploadAttachment&accountId=' + $api.getStorage('userinf').accountId);
                console.log("imgPaht: " + JSON.stringify(this.imgarr.imgpaths));
                var _self = this;
                api.ajax({
                    url:UICore.serviceUrl + 'mobile/mobileWf.shtml?act=uploadAttachment&accountId=' + $api.getStorage('userinf').accountId ,
                    method: 'post',
                    data: {
                      files : {
                        file : this.imgarr.imgpaths,
                      }
                    }
                },function(ret, err){
                    api.hideProgress();
                    if (ret) {
                        if(ret.success){
                          console.log(ret.data);
                          if(_self.imgarr.attachmentId==""){
                            _self.imgarr.attachmentId += ret.data;
                          }else{
                            _self.imgarr.attachmentId += ","+ret.data;
                          }

                          _self.submit();
                        }else{
                          alert("附件上传失败")
                        }

                    } else {
                        alert( JSON.stringify(err));
                    }
                });
              }else{
                this.submit();
              }

            }else{
              this.submit();
            }
          }
        },
        submit:function(){
            var _self = this;
            if (_self.mStatus == "isNew"||_self.mStatus == "isEdit") {
                UICore.showLoading("正在提交", "请稍等");
                var submitJson = {};
                if(_self.id){
                  submitJson.id = _self.id;
                }
                submitJson.populationId = _self.personName;
                submitJson.certificateNum = _self.personCode;
                submitJson.serviceType = _self.serviceTypeID;
                submitJson.serviceTime = _self.serviceTime;
                submitJson.enterpriseId = _self.unit;
                submitJson.workerId = _self.staff;
                submitJson.registerId = _self.booker;
                submitJson.content = _self.descriration;
                submitJson.data_area_code = $api.getStorage('userinf').gridCode;
                submitJson.CREATE_USER = $api.getStorage('userinf').accountId;
                submitJson.attachmentId = _self.imgarr.attachmentId;

                console.log(UICore.serviceUrl + 'mobile/mobilePeopleLog.shtml?act=postPeopleLog&data=' + JSON.stringify(submitJson));
                api.ajax({
                    url: UICore.serviceUrl + 'mobile/mobilePeopleLog.shtml?act=postPeopleLog&data=' + JSON.stringify(submitJson),
                    method: 'post',

                },function(ret, err){
                    api.hideProgress();
                    if (ret) {
                        if (ret.success) {
                          api.toast({
                              msg: '提交成功',
                              duration: 2000,
                              global: 'true',
                              location: 'bottom'
                          });
                          api.closeWin();

                        }else{
                           alert( ret.errorinfo);
                        }
                    } else {
                        alert( JSON.stringify( err ) );
                    }
                });

            }
        },
        serviceTypef:function(){
            var _self = this;
            if (!_self.isClick) {
              var defaultVal = _self.serviceType; //获取默认值
              if (defaultVal != null && defaultVal != "") {
                  _self.serviceType_arr.forEach(function(value, index, arr) {
                      if (value.text == _self.serviceType) {
                          arr[index].status = "selected";
                      }
                  });
              }
              UICore.openSelect3(_self.serviceType_arr, _self.serviceType, "serviceType");
              api.addEventListener({
                  name: 'serviceType'
              }, function(ret, err) {
                  if (ret) {
                      console.log(JSON.stringify(ret.value.key1));
                      _self.serviceType = ret.value.key1;
                      _self.serviceTypeID = ret.value.key2;

                  } else {
                      alert(JSON.stringify(err));
                  }
              });
            }
        },
        serviceTimef:function(){
          var _self = this;
          if (!_self.isClick) {
              UICore.openTimeComponent2(_self.serviceTime,_self.serviceTime);
              api.addEventListener({
                  name: 'buildingTime' //广播接收key，已写死。
              }, function(ret, err) {
                  if (ret) {
                      _self.serviceTime = ret.value.key1;
                  } else {
                      alert(JSON.stringify(err));
                  }
              });
          }
        },
      },
      components:{
        "form-item":{
          template:"#item-element", //模版内容
          props:["titlename","myclass"],
          methods:{
          },
        },
        //附件上传组件
        'attach-comp': {
            template: "#attach-template",
            props: ['myshow', 'imgarray','isclick'], //一个指向父组件中的show，一个指向父组件中的imgarr,必须指向含有子属性的值，VUE2.0子组件只能修改父组件属性中的子属性值
            data: function() {
                return {
                    imgtemps: [] //图片地址临时存放，为了选择多个图片时候一起显示出来，因为要递归压缩图片，如果不存，会一张一张的显示图片
                }
            },
            methods: {
                //显示附件选择DIV
                showItem: function(type) {
                    if(!this.isclick){
                      if (type == 'video') {
                          this.myshow.videoshow = true;
                          this.myshow.bgshow = true;
                      } else if (type == 'photo') {
                          this.myshow.camerashow = true;
                          this.myshow.bgshow = true;
                      }
                    }

                },
                //关闭附件选择DIV
                closeItem: function() {
                    this.myshow.videoshow = false;
                    this.myshow.camerashow = false;
                    this.myshow.bgshow = false;
                },
                //拍照
                camera_img: function() {
                    this.closeItem();
                    var mycomponent = this;
                    var imageFilter = api.require('imageFilter');
                    api.getPicture({
                        sourceType: 'camera',
                        encodingType: 'jpg',
                        mediaValue: 'pic',
                        destinationType: 'url',
                        allowEdit: true,
                        quality: 50,
                        saveToPhotoAlbum: false
                    }, function(ret, err) {
                        if (ret) {
                            var imgpath = ret.data;
                            if (imgpath != "") {
                                imageFilter.getAttr({
                                    path: imgpath
                                }, function(ret, err) {
                                    if (ret.status) {
                                        var tempwidth = ret.width;
                                        var tempheight = ret.height;
                                        var bili = tempwidth / tempheight;
                                        var height = 1200;
                                        var width = height * bili;
                                        //图片压缩
                                        imageFilter.compress({
                                            img: imgpath,
                                            quality: 1,
                                            size: {
                                                w: width,
                                                h: height
                                            },
                                            save: {
                                                album: false,
                                                imgPath: "fs://test/",
                                                imgName: '0' + mycomponent.imgarray.imgnum + '.jpg'
                                            }
                                        }, function(ret, err) {
                                            if (ret.status) {
                                                var pathtemp = api.fsDir + "/test/0" + mycomponent.imgarray.imgnum + ".jpg";
                                                //mycomponent.imgarray.imgpaths.splice(0,mycomponent.imgarray.imgpaths.length)
                                                mycomponent.imgarray.imgpaths.push(pathtemp);
                                                mycomponent.imgarray.imgnum++;
                                            } else {
                                                alert(JSON.stringify(err));
                                            }
                                        });
                                    } else {
                                        alert(JSON.stringify(err));
                                    }
                                });
                            }

                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                },
                //选择相册中的图片
                getImg: function() {
                    this.closeItem();
                    this.imgtemps = [];
                    var mycomponent = this;
                    var imageFilter = api.require('imageFilter');
                    var UIMediaScanner = api.require('UIMediaScanner');
                    UIMediaScanner.open({
                        type: 'picture',
                        column: 4,
                        classify: true,
                        max: 8,
                        sort: {
                            key: 'time',
                            order: 'desc'
                        },
                        texts: {
                            stateText: '已选择*项',
                            cancelText: '取消',
                            finishText: '完成'
                        },
                        styles: {
                            bg: '#fff',
                            mark: {
                                icon: '',
                                position: 'bottom_left',
                                size: 20
                            },
                            nav: {
                                bg: '#eee',
                                stateColor: '#000',
                                stateSize: 18,
                                cancelBg: 'rgba(0,0,0,0)',
                                cancelColor: '#000',
                                cancelSize: 18,
                                finishBg: 'rgba(0,0,0,0)',
                                finishColor: '#000',
                                finishSize: 18
                            }
                        },
                        scrollToBottom: {
                            intervalTime: -1,
                            anim: false
                        },
                        exchange: true,
                        rotation: true
                    }, function(ret) {
                        if (ret) {
                            if (ret.eventType != "cancel") {
                                tempimgp = "";
                                loadImg(ret.list, mycomponent.imgarray.imgnum, tempimgp);
                            }
                        }
                    });

                    function loadImg(list, num, tempimgp) {
                        if (list.length > 0) {
                            var imgpath = "";
                            if (api.systemType == "ios") {
                                imgpath = list[0].thumbPath;
                            }
                            if (api.systemType == "android") {
                                imgpath = list[0].path;
                            }
                            imageFilter.getAttr({
                                path: imgpath
                            }, function(ret, err) {
                                if (ret.status) {
                                    var tempwidth = ret.width;
                                    var tempheight = ret.height;
                                    var bili = tempwidth / tempheight;
                                    var width = 0;
                                    var height = 1200
                                    if (height > tempheight) {
                                        height = tempheight
                                        width = tempwidth
                                    } else {
                                        height = 1200;
                                        width = height * bili;
                                    }
                                    if (width > tempwidth) {
                                        height = tempheight
                                        width = tempwidth
                                    }
                                    imageFilter.compress({
                                        img: imgpath,
                                        quality: 1,
                                        size: {
                                            w: width,
                                            h: height
                                        },
                                        save: {
                                            album: false,
                                            imgPath: "fs://test/",
                                            imgName: '0' + num + '.jpg'
                                        }
                                    }, function(ret, err) {
                                        if (ret.status) {
                                            var pathtemp = api.fsDir + "/test/0" + num + ".jpg";
                                            mycomponent.imgtemps.push(pathtemp)
                                                //mycomponent.imgarray.imgpaths.push(pathtemp);
                                            mycomponent.imgarray.imgnum++;
                                            list.splice(0, 1)
                                            loadImg(list, mycomponent.imgarray.imgnum, tempimgp);
                                        } else {
                                            alert(JSON.stringify(err));
                                        }
                                    });
                                } else {
                                    alert(JSON.stringify(err));
                                }
                            });
                        } else {
                            //mycomponent.imgarray.imgpaths.splice(0,mycomponent.imgarray.imgpaths.length);
                            mycomponent.imgarray.imgpaths = mycomponent.imgarray.imgpaths.concat(mycomponent.imgtemps);
                            //$("#imgAdd").append(tempimgp);
                        }
                    }
                },
                //预览图片
                openImg: function(pathtemp) {
                    var imgindex = this.findIndex(this.imgarray.imgpaths, pathtemp);
                    var imageBrowser = api.require('imageBrowser');

                    imageBrowser.openImages({
                        imageUrls: this.imgarray.imgpaths,
                        showList: false,
                        activeIndex: imgindex,
                        tapClose: true
                    });
                },
                //获取图片索引，正确找到图片组中的对应的图片
                findIndex: function(arr, val) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] == val) {
                            return i;
                            break;
                        }
                    }
                },
                //删除图片
                deleteImg: function(pathtemp, index) {
                    if(!this.isclick){
                      var mycomponent = this;
                      api.confirm({
                          title: '提示',
                          msg: '确定要删除图片吗？',
                          buttons: ['确定', '取消']
                      }, function(ret, err) {
                          var buttonIndex = ret.buttonIndex;
                          if (buttonIndex == 1) {
                              mycomponent.removeByValue(mycomponent.imgarray.imgpaths, pathtemp);
                          }
                      });
                    }

                },
                //从图片数组中删除
                removeByValue: function(arr, val) {
                    console.log(JSON.stringify(this.imgarray.attachmentIdPathJson));
                    // if(this.imgarray.attachmentIdPathJson.hasOwnProperty(val)){
                    //   delete this.imgarray.attachmentIdPathJson[myjson];
                    // }
                    for(var myjson in this.imgarray.attachmentIdPathJson){
                      if(this.imgarray.attachmentIdPathJson[myjson]==val){
                        delete this.imgarray.attachmentIdPathJson[myjson];
                        break;
                      }
                    }
                    console.log(JSON.stringify(this.imgarray.attachmentIdPathJson));
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] == val) {
                            arr.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
      }
    })
}
