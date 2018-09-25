/* created by hzh on 2017/7/25
  民情日志js
*/

FeelingDaily = function(){};
FeelingDaily.prototype = {
  mStatus:"isNew",
  queryParam:{},
  formJSON:{},

  imgNum:0,//图片数量
  imgPaths: [],//存放附件图片路径

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

     }],

  deleteImg:function(path,index){
      console.log("删除选中图片");
      api.confirm({
        title : '提示',
        msg : '确定要删除图片吗？',
        buttons : ['确定', '取消']
      }, function(ret, err) {
        var buttonIndex = ret.buttonIndex;
        if(buttonIndex==1){
          mFeelingDaily.removeByValue(mFeelingDaily.imgPaths,path);//从数组中删除对应的数据
          $api.remove($api.dom("#imgWrap"+index));//从布局中删除对应的图片视图

        }
      });
  },
  openImg:function(path){
    var imgindex = this.findIndex(mFeelingDaily.imgPaths,path);
    var imageBrowser = api.require('imageBrowser');

    imageBrowser.openImages({
      imageUrls : mFeelingDaily.imgPaths,
      showList : false,
      activeIndex : imgindex,
      tapClose : true
    });
  },
  removeByValue:function(arr, val) {
    for(var i=0; i<arr.length; i++) {
      if(arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  },
  findIndex:function(arr, val){
    for(var i=0; i<arr.length; i++) {
      if(arr[i] == val) {
        return i;
        break;
      }
    }
  },

};
apiready = function(){
  var  param = api.pageParam;

  mFeelingDaily = new FeelingDaily();
  if (param != "" && param != null && param != 'undefined') {
    mFeelingDaily.mStatus = param.status;
    mFeelingDaily.queryParam = param.queryParam;
    mFeelingDaily.formJSON = param.data;

  }

   var vue = new Vue({
      el:"#list",
      data:{
        isClick: false, //标记是否可以编辑, false表示不绑定，可以编辑；true表示绑定，不可编辑
        personName:"",//受访对象姓名
        personCode:"",//证件号码
        serviceTypeID:"",
        serviceType:"",//服务类型
        unit:"",//单位
        staff:"",//工作人员
        serviceTime:"",//服务时间
        booker:"",//登记人
        descriration:"",//内容描述
      },
      created:function(){
         console.log("载入后");
         if (mFeelingDaily.mStatus == "isBrownse") {
           $api.css($api.dom("#pkh_add_su"), 'display:none');

           var that = this;
           that.isClick = "true";
           that.personName = mFeelingDaily.formJSON.populationId;//受访对象姓名
           that.personCode= mFeelingDaily.formJSON.certificateNum;//证件号码
           mFeelingDaily.serviceType_arr.forEach(function(value,index,arr){
             if (arr[index].key == mFeelingDaily.formJSON.serviceType) {
               that.serviceTypeID= arr[index].key;
               that.serviceType= arr[index].text;//服务类型
             }
           });
           that.unit= mFeelingDaily.formJSON.enterpriseId;//单位
           that.staff= mFeelingDaily.formJSON.workerId;//工作人员
           that.serviceTime= mFeelingDaily.formJSON.serviceTime;//服务时间
           that.booker= mFeelingDaily.formJSON.registerId;//登记人
           that.descriration= mFeelingDaily.formJSON.content;//内容描述
         }
      },
      methods:{
          closeWin:function(){
            api.closeWin({
                name: 'newFeelingDaily'
            });
          },
          submit:function(){
              var that = this;
              alert(mFeelingDaily.mStatus)
              if (mFeelingDaily.mStatus == "isNew") {
                  alert(11)
                  UICore.showLoading("正在提交", "请稍等");
                  var submitJson = {};
                  submitJson.populationId = that.personName;
                  submitJson.certificateNum = that.personCode;
                  submitJson.serviceType = that.serviceTypeID;
                  submitJson.serviceTime = that.serviceTime;
                  submitJson.enterpriseId = that.unit;
                  submitJson.workerId = that.staff;
                  submitJson.registerId = that.booker;
                  submitJson.content = that.descriration;
                  submitJson.data_area_code = $api.getStorage('userinf').gridCode;
                  submitJson.CREATE_USER = $api.getStorage('userinf').accountId;

                  console.log(UICore.serviceUrl + 'mobile/mobilePeopleLog.shtml?act=postPeopleLog&data=' + JSON.stringify(submitJson));
                  api.ajax({
                      url: UICore.serviceUrl + 'mobile/mobilePeopleLog.shtml?act=postPeopleLog&data=' + JSON.stringify(submitJson),
                      method: 'post',

                  },function(ret, err){
                      api.hideProgress();
                      if (ret) {
                          if (ret.success) {
                            api.closeWin({
                                name: 'newFeelingDaily'
                            });

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
              var that = this;
              if (!that.isClick) {
                var defaultVal = that.serviceType; //获取默认值
                if (defaultVal != null && defaultVal != "") {
                    mFeelingDaily.serviceType_arr.forEach(function(value, index, arr) {
                        if (value.text == that.serviceType) {
                            arr[index].status = "selected";
                        }
                    });
                }
                UICore.openSelect3(mFeelingDaily.serviceType_arr, that.serviceType, "serviceType");
                api.addEventListener({
                    name: 'serviceType'
                }, function(ret, err) {
                    if (ret) {
                        console.log(JSON.stringify(ret.value.key1));
                        that.serviceType = ret.value.key1;
                        that.serviceTypeID = ret.value.key2;

                    } else {
                        alert(JSON.stringify(err));
                    }
                });
              }
          },
          serviceTimef:function(){
            var that = this;
            if (!that.isClick) {
                UICore.openTimeComponent2(that.serviceTime);
                api.addEventListener({
                    name: 'buildingTime' //广播接收key，已写死。
                }, function(ret, err) {
                    if (ret) {
                        that.serviceTime = ret.value.key1;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            }
          },
          showItem:function(type){
              var that = this;
              if (!that.isClick) {
                if (type == "img") {
                  console.log("显示附件item项");
                  $api.css($api.dom(".tele-item"),'display:block;');
                  $api.css($api.dom(".hideBg"),'display:block;');

                }
              }
          },
          hideItem:function(){
              console.log("点击灰色区域隐藏附件item项");
              $api.css($api.dom(".hideBg"),'display:none;');
              $api.css($api.dom(".tele-item"),'display:none;');
          },
          cameraImg:function(){
            //alert("拍照");
            var that = this;
            that.hideItem();
            var imageFilter = api.require('imageFilter');
            api.getPicture({
                sourceType: 'camera',
                encodingType: 'jpg',
                mediaValue: 'pic',
                destinationType: 'url',
                allowEdit: true,
                quality: 50,
                saveToPhotoAlbum: false,
            }, function(ret, err){
                if(ret){
                     var imgpath = ret.data;//获取照片路径
                     console.log(JSON.stringify(imgpath));
                     if (imgpath != "") {
                        imageFilter.getAttr({
                            path: imgpath,
                        }, function(ret, err){
                            if( ret.status ){
                              var tempwidth = ret.width;
                              var tempheight = ret.height;
                              var bili = tempwidth / tempheight;
                              var height = 1200;
                              var width = height * bili;
                              imageFilter.compress({
                                  img: imgpath,
                                  isClarityimg: false,
                                  quality: 1,
                                  size: {
                                    w : width,
                                    h : height
                                  },
                                  save: {
                                    album : false,
                                    imgPath : "fs://ocnAttach_Img/FeelingDaily/",
                                    imgName : '0' + mFeelingDaily.imgNum + '.jpg'
                                  },
                              }, function(ret, err){
                                  if( ret.status ){
                                      var pathtemp = api.fsDir + "/ocnAttach_Img/FeelingDaily/0" + mFeelingDaily.imgNum + ".jpg";
                                      var imgp = '<div class="ev_atlas_one" id="imgWrap' + mFeelingDaily.imgNum + '">';
                                      imgp = imgp + '<img src="../../image/icon_del.png" onclick="mFeelingDaily.deleteImg(\'' + pathtemp + '\',\'' + mFeelingDaily.imgNum + '\')" />  ';
                                      imgp = imgp + "<img src='" + api.fsDir + "/ocnAttach_Img/FeelingDaily/0" + mFeelingDaily.imgNum + ".jpg" + "' onclick='mFeelingDaily.openImg(\"" + pathtemp + "\")'/></div>";
                                      mFeelingDaily.imgNum++;
                                      mFeelingDaily.imgPaths.push(api.fsDir + "/ocnAttach_Img/FeelingDaily/0" + mFeelingDaily.imgNum + ".jpg");
                                      $api.append($api.dom("#imgAdd"),imgp);
                                  }else{
                                      alert( JSON.stringify( err ) );
                                  }
                              });

                            }else{
                                alert( JSON.stringify( err ) );
                            }
                        });

                     }
                }else{
                     alert(JSON.stringify(err));
                }
            });
          },
          localImg:function(){
            //alert("选择相册");
            var that = this;
            that.hideItem();
            var imageFilter = api.require('imageFilter');
            var UIMediaScanner = api.require('UIMediaScanner');
            UIMediaScanner.open({
                type: 'picture',
                column: 4,
                classify: true,
                max: 4,
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
                scrollToBottom:{
                   intervalTime: -1,
                   anim: false
                },
                exchange: true,
                rotation: false,
            }, function( ret ){
                if( ret ){
                    if (ret.eventType == "confirm") {
                        tempimgp = "";
                        // 遍历返回的数组
                        loadImg(ret.list,mFeelingDaily.imgNum,tempimgp);
                    }
                }else{
                   alert(JSON.stringify(ret));
                }
            });
            function loadImg(list, num, tempimgp) {
                if (list.length > 0) {
                  var imgpath = "";
                  if(api.systemType=="ios"){
                    imgpath = list[0].thumbPath;
                  }
                  if(api.systemType=="android"){
                    imgpath = list[0].path;
                  }
                  imageFilter.getAttr({
                      path: imgpath,
                  }, function(ret, err){
                      if( ret.status ){
                        var tempwidth = ret.width;
                        var tempheight = ret.height;
                        var bili = tempwidth / tempheight;
                        var width = 0;
                        var height = 1200
                        if(height>tempheight){
                          height = tempheight
                          width = tempwidth
                        }else{
                          height = 1200;
                          width = height * bili;
                        }
                        if(width>tempwidth){
                          height = tempheight
                          width = tempwidth
                        }
                        imageFilter.compress({
                            img: imgpath,
                            isClarityimg: false,
                            quality: 1,
                            size: {
                              w : width,
                              h : height
                            },
                            save: {
                              album : false,
                              imgPath : "fs://ocnAttach_Img/FeelingDaily/",
                              imgName : '0' + num + '.jpg'
                            },
                        }, function(ret, err){
                            if( ret.status ){
                                var pathtemp = api.fsDir + "/ocnAttach_Img/FeelingDaily/0" + num + ".jpg";
                                tempimgp = tempimgp + '<div class="ev_atlas_one" id="imgWrap' + num + '">';
                                tempimgp = tempimgp + '<img src="../../image/icon_del.png" onclick="mFeelingDaily.deleteImg(\'' + pathtemp + '\',\'' + num + '\')" />  ';
                                tempimgp = tempimgp + "<img src='" + api.fsDir + "/ocnAttach_Img/FeelingDaily/0" + num + ".jpg" + "' onclick='mFeelingDaily.openImg(\"" + pathtemp + "\")'/></div>";
                                mFeelingDaily.imgPaths.push(api.fsDir + "/ocnAttach_Img/FeelingDaily/0" + num + ".jpg");
                                mFeelingDaily.imgNum++;
                                list.splice(0, 1);
                                loadImg(list, mFeelingDaily.imgNum, tempimgp);//遍历数组
                            }else{
                                alert( JSON.stringify( err ) );
                            }
                        });

                      }else{
                          alert( JSON.stringify( err ) );
                      }
                  });

                }else{
                    $api.append($api.dom("#imgAdd"),tempimgp);
                }
            }// loadImg end.
          },
          cancelli:function(){
              var that = this;
              this.hideItem();
          },
      },
      components:{"form-item":{
          template:"#item-element", //模版内容
          props:["titlename","myclass"],
          methods:{
          },
        }
      },
   });
};
