// 上传组件
var apiUpload = Vue.extend({
  template: '<div><div class="ev_pls_all">' +
    '<div class="ev_photo_all">' +
    '<div class="ev_hui_cen"></div>' +
    '<div class="ev_pls" @click="showItem()">' +
    '<label>照片</label><div class="ev_pls_img photo"></div>' +
    '</div>' +
    '<div class="ev_atlas" id="imgAdd">' +
    '<div class="ev_atlas_one" v-for="(imgpath,index) in imgarray.imgpaths" >' +
    '<img src="../../image/icon_del.png" @click="deleteImg(imgpath,imgarray.imgnum)" />' +
    '<img @click="openImg(imgpath);" :src="imgpath" />' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="hideBg" style="position:fixed;" v-if="myshow.bgshow"></div>' +
    '<div class="tele-item white-bg">' +
    '<ul id="img_video" v-show="myshow.camerashow">' +
    '<li @click="camera_img();"><a href="javascript:void(0);">拍照</a></li>' +
    '<li @click="getImg();"><a href="javascript:void(0);">从本地选择</a></li>' +
    '<li class="cancelli" @click="closeItem();"><a href="javascript:void(0);">取消</a></li>' +
    '</ul>' +
    '<ul id="img_video" v-show="myshow.videoshow">' +
    '<li @click="camera_video();"><a href="javascript:void(0);">视频</a></li>' +
    '<li @click="getVideo();"><a href="javascript:void(0);">从本地选择</a></li>' +
    '<li class="cancelli" @click="closeItem();"><a href="javascript:void(0);">取消</a></li>' +
    '</ul>' +
    '</div>' +
    '</div>',
  props: {
    imgarray: {
      type: Object,
      default: {
        imgpaths: [], //图片地址存放数组
        videopaths: [], //视频地址存放数组
        imgnum: 0, //图片全局索引
        videonum: 0 //视频全局索引
      }
    }
  },
  data: function () {
    return {
      myshow: { //控制父组件和子组件部分DIV的显示和隐藏
        camerashow: false,
        videoshow: false,
        bgshow: false,
        submitDiv: false,
        zcover: false,
        ev_next_step: false
      }
    }
  },
  methods: {
    //显示附件选择DIV
    showItem: function (type) {
      this.myshow.camerashow = true;
      this.myshow.bgshow = true;
    },
    //关闭附件选择DIV
    closeItem: function () {
      this.myshow.videoshow = false;
      this.myshow.camerashow = false;
      this.myshow.bgshow = false;
    },
    //拍照
    camera_img: function () {
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
      }, function (ret, err) {
        if (ret) {
          var imgpath = ret.data;
          if (imgpath != "") {
            imageFilter.getAttr({
              path: imgpath
            }, function (ret, err) {
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
                }, function (ret, err) {
                  if (ret.status) {
                    var pathtemp = api.fsDir + "/test/0" + mycomponent.imgarray.imgnum + ".jpg";
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
    getImg: function () {
      this.closeItem();
      this.imgtemps = [];
      var mycomponent = this;
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
        scrollToBottom: {
          intervalTime: -1,
          anim: false
        },
        exchange: true,
        rotation: true
      }, function (ret) {
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
          }, function (ret, err) {
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
              }, function (ret, err) {
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
          mycomponent.imgarray.imgpaths = mycomponent.imgarray.imgpaths.concat(mycomponent.imgtemps);
          //$("#imgAdd").append(tempimgp);
        }
      }
    },
    //预览图片
    openImg: function (pathtemp) {
      var attribute = pathtemp.substring(pathtemp.lastIndexOf('.') + 1, pathtemp.length);
      if (attribute === 'jpg' || attribute === 'png' || attribute === 'webp' || attribute === 'jpeg' || attribute === "gif" || attribute === 'bmp') {
        var imgindex = this.findIndex(this.imgarray.imgpaths, pathtemp);
        var imageBrowser = api.require('imageBrowser');
        imageBrowser.openImages({
          imageUrls: this.imgarray.imgpaths,
          showList: false,
          activeIndex: imgindex,
          tapClose: true
        });
      } else {
        api.openVideo({
          url: pathtemp
        });
      }
    },
    getSrc: function (pathtemp) {
      var attribute = pathtemp.substring(pathtemp.lastIndexOf('.') + 1, pathtemp.length);
      if (attribute === 'jpg' || attribute === 'png' || attribute === 'webp' || attribute === 'jpeg' || attribute === "gif" || attribute === 'bmp') {
        return pathtemp;
      } else {
        return '../../image/video.jpg';
      }
    },
    //获取图片索引，正确找到图片组中的对应的图片
    findIndex: function (arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
          return i;
          break;
        }
      }
    },
    // 删除图片
    deleteImg: function (pathtemp, index) {
      var mycomponent = this;
      api.confirm({
        title: '提示',
        msg: '确定要删除图片吗？',
        buttons: ['确定', '取消']
      }, function (ret, err) {
        var buttonIndex = ret.buttonIndex;
        if (buttonIndex == 1) {
          mycomponent.removeByValue(mycomponent.imgarray.imgpaths, pathtemp);
        }
      });
    },
    // 从图片数组中删除
    removeByValue: function (arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
          arr.splice(i, 1);
          break;
        }
      }
    }
  }
});

// 混入上传组件
var upload = {
  data: function () {
    return {
      // 图片
      imgarray: {
        imgpaths: [], //图片地址存放数组
        videopaths: [], //视频地址存放数组
        imgnum: 0, //图片全局索引
        videonum: 0 //视频全局索引
      }
    }
  },
  components: {
    'api-upload': apiUpload
  },
  methods: {
    //上传附件
    uploadAttach: function (cb) {
      this.imgarray.imgpaths = this.imgarray.imgpaths.concat(this.imgarray.videopaths);
      var mycomponent = this;
      if (this.imgarray.imgpaths.length > 0) {
        UICore.showLoading('上传附件中...', '稍等...');
        api.ajax({
          url: UICore.serviceUrl + 'mobile/mobileWf.shtml?act=uploadAttach_HZ&loginId=' + this.accountId + '&workId=' + this.alltag.flowInstanceId + '&nodeId=' + this.alltag.activityId,
          method: 'post',
          tag: 'grid',
          data: {
            files: {
              file: this.imgarray.imgpaths
            }
          }
        }, function (ret, err) {
          api.hideProgress();
          if (ret) {
            if (ret.success == true) {
              // mycomponent.submitForm();
              cb && cb(ret);
            } else {

            }
          } else {
            api.hideProgress();
            api.alert({
              msg: JSON.stringify(err)
            });
          }
        });
      } else {
        cb && cb();
      }
    }
  }
};

// 列表组件
var listTemplate = Vue.extend({
  template: '<div class="no_end_list">' +
    '<div class="no_end_left">' +
    '<div class="no_end_left_img" v-if="!set"><img :src="isOutTime(eventobj.isTimeOut, eventobj.nodeLimitTime)"></div>' +
    '<div class="no_end_left_txt">{{eventobj.eventTitle}}</div>' +
    '</div>' +
    '<div class="no_end_right">' +
    '<p>{{eventobj.sponsorName}}</p>' +
    '<p>{{eventobj.reportTime}}</p>' +
    '</div>' +
    '</div>',
  props: ["eventobj", 'set'],
  data: function(){
    return{

    }
  },
  methods: {
    // 判断事件有没有超时
    isOutTime: function (isTimeOut, nodeLimitTime) {
      if (isTimeOut == '1') {
        // 超时
        return '../../image/smIcon/1.png';
      } else if (+nodeLimitTime >= 24) {
        // 正常
        return '../../image/smIcon/3.png';
      } else {
        return '../../image/smIcon/2.png';
      }
    }
  }
});

// list组件
var mixBase = {
  components: {
    'list-event': listTemplate
  },
  methods: {
    // 解析经纬度变成地址
    anaAddress: function (n, v, index) {
      var _this = this;
      if (n == '发生地点' && v) {
        var arr = v.split(',');
        var coordTran2 = new Transformation2(45, 45, 49);
        var xxyy = coordTran2.OCN2WGS84(Number(arr[0]), Number(arr[1]));
        var myxy = coordTran2.wgs84tobd09(xxyy.x, xxyy.y);
        var arrAddress = '';
        api.ajax({
          url: 'http://api.map.baidu.com/geocoder/v2/',
          method: 'get',
          data: {
            values: {
              location: myxy.y + ',' + myxy.x,
              output: 'json',
              ak: "4eb424fae9e47fe4549f4846791df8b6"
            }
          }
        }, function (ret, err) {
          if (ret && ret.result) {
            _this.formdata[index].default_value = ret.result.formatted_address;
          } else {
            // api.alert({
            //   msg: JSON.stringify(err)
            // });
          }
        });
        return arrAddress;
      } else {
        return v;
      }
    },
  }
};