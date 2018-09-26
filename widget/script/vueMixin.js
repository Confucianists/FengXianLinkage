// 上传组件
var apiUpload = Vue.extend({
  template: '<div>' +
    '<div class="ev_pls_all">' +

    // 照片
    '<div class="ev_photo_all">' +
    '<div class="ev_hui_cen"></div>' +
    '<div class="ev_pls" @click="showItem(1)">' +
    '<label>照片</label><div class="ev_pls_img photo"></div>' +
    '</div>' +
    '<div class="ev_atlas" id="imgAdd">' +
    '<div class="ev_atlas_one" v-for="(imgpath,index) in imgarray.imgpathsUpload" >' +
    '<img v-show="!flag" :src="icon.icon_del || icon_del" @click="deleteImgUpload(imgpath)" />' +
    '<img @click="openImgUpload(imgpath);" :src="backUrl(imgpath)" />' +
    '</div>' +
    '<div class="ev_atlas_one" v-for="(imgpath,index) in imgarray.imgpaths" >' +
    '<img v-show="!flag" :src="icon.icon_del || icon_del" @click="deleteImg(imgpath,imgarray.imgnum)" />' +
    '<img @click="openImg(imgpath);" :src="imgpath" />' +
    '</div>' +
    '</div>' +
    '</div>' +

    // 视频
    '<div class="ev_photo_all">' +
    '<div class="ev_hui_cen"></div>' +
    '<div class="ev_pls" @click="showItem(2)">' +
    '<label>视频</label><div class="ev_pls_img video"></div>' +
    '</div>' +
    '<div class="ev_videos" id="videoAdd">' +

    '<div class="ev_videos_one" v-for="(videopath,index) in imgarray.videopathsUpload" >' +
    '<img v-show="!flag" :src="icon.icon_del || icon_del" @click="deleteVideoUpload(videopath)" />' +
    '<img @click="openVideoUpload(videopath);" :src="icon.video" />' +
    '</div>' +

    '<div class="ev_videos_one" v-for="(videopath,index) in imgarray.videopaths" >' +
    '<img v-show="!flag" :src="icon.icon_del || icon_del" @click="deleteVideo(videopath,imgarray.videonum)" />' +
    '<img @click="openVideo(videopath);" :src="icon.video" />' +
    '</div>' +

    '</div>' +
    '</div>' +

    // 录音
    '<div class="ev_photo_all">' +
    '<div class="ev_hui_cen"></div>' +
    '<div class="ev_pls" @click="startRecord">' +
    '<label>{{recordName || "录音"}}</label><div class="ev_pls_img video"></div>' +
    '</div>' +
    '<div class="ev_videos" id="videoAdd">' +

    '<div class="ev_videos_one" v-for="(filepath,index) in imgarray.soundRecords" >' +
    '<img v-show="!flag" :src="icon.icon_del || icon_del" @click="deleteFile(imgarray.soundRecords, filepath)" />' +
    '<img @click="startPlay(filepath)" :src="icon.record" />' +
    '</div>' +

    '</div>' +
    '</div>' +

    // 文件
    '<div class="ev_photo_all">' +
    '<div class="ev_hui_cen"></div>' +
    '<div class="ev_pls" @click="chooseFile">' +
    '<label>文件</label><div class="ev_pls_img video"></div>' +
    '</div>' +
    '<div class="ev_videos" id="videoAdd">' +
    '<div class="ev_videos_one" v-for="(filepath,index) in imgarray.filepaths" >' +
    '<img v-show="!flag" :src="icon.icon_del || icon_del" @click="deleteFile(imgarray.filepaths, filepath)" />' +
    '<img @click="openFile(filepath)" :src="icon.file" />' +
    '</div>' +
    '</div>' +
    '</div>' +


    '</div>' +
    '<div style="position:fixed;top:0;left:0;width: 100%;background: rgba(0,0,0,.5);height: 100%;z-index: 10;" v-if="myshow.bgshow"></div>' +
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

    '<ul id="img_video" v-show="videoflag">' +
    '<li @click="startRecord();" v-if="!recordFlag"><a href="javascript:void(0);">录音</a></li>' +
    '<li @click="stopRecord();"><a href="javascript:void(0);">停止录音</a></li>' +
    '<li class="cancelli" @click="cancleRecord"><a href="javascript:void(0);">取消</a></li>' +
    '</ul>' +

    '</div>' +
    '</div>',
  data: function () {
    return {
      myshow: { //控制父组件和子组件部分DIV的显示和隐藏
        camerashow: false,
        videoshow: false,
        bgshow: false,
        submitDiv: false,
        zcover: false,
        ev_next_step: false
      },
      videoflag: false,
      // 录音中的flag
      recordFlag: false,
      recordName: "录音",
      // 地址id集合
      attachAll: []
    }
  },
  props: ['imgarray', 'flag', 'icon_del', 'icon'],
  methods: {
    // 选择文件
    chooseFile: function () {
      var vm = this;
      var selectFile = api.require('selectFile');
      selectFile.open(function (ret, err) {
        if (ret.status) {
          vm.imgarray.filepaths.push(ret.path);
          vm.imgarray.filenum++;
        } else {
          alert('选择文件不存在');
        }
      });
    },
    // 展示录音
    showRecord: function () {
      var vm = this;
      api.actionSheet({
        title: '选择附件',
        cancelTitle: '取消',
        buttons: ['录音', '停止录音']
      }, function (ret, err) {
        var index = ret.buttonIndex;
        if (index == 1) {
          // 拍照
          vm.startRecord();
        } else if (index == 2) {
          // 从本地选择
          vm.stopRecord();
        }
      });
    },
    cancleRecord: function () {
      this.videoflag = false;
      this.myshow.bgshow = false;
      this.recordFlag = false;
      api.stopRecord();
      api.hideProgress();
    },
    // 开始录音
    startRecord: function () {
      if (!this.recordFlag) {
        this.recordFlag = true;
        this.recordName = "停止录音";
        api.showProgress({
          title: '录音中...',
          modal: false
        });
        var timestamp = (new Date()).valueOf();
        api.startRecord({
          path: 'fs://' + timestamp + '.amr'
        });
      } else {
        this.stopRecord();
        this.recordFlag = false;
        this.recordName = "录音";
      }
    },
    // 结束录音
    stopRecord: function () {
      this.recordFlag = false;
      var vm = this;
      api.stopRecord(function (ret, err) {
        if (ret) {
          var path = ret.path;
          var duration = ret.duration;
          vm.imgarray.soundRecords.push(path);
          vm.cancleRecord();
          api.hideProgress();
          api.toast({
            msg: '录音完成',
            duration: 2000,
            location: 'bottom'
          });
        }
      });
    },
    // 播放录音
    startPlay: function (path) {
      api.showProgress({
        title: '录音播放中...',
        modal: false
      });
      api.startPlay({
        path: path
      }, function (ret, err) {
        if (ret) {
          api.hideProgress();
          api.toast({
            msg: '播放完成',
            duration: 2000,
            location: 'bottom'
          });
        } else {
          alert(JSON.stringify(err));
        }
      });
    },
    backUrl: function (url) {
      var head = url.substring(0, 4);
      if (head == 'http') {
        return url;
      } else if (head == 'uplo' || head == '/upl') {
        return UICore.serviceUrl + url;
      } else {
        return url;
      }
    },
    //显示附件选择DIV
    showItem: function (type) {
      var vm = this;
      if (this.flag) {
        return false;
      }
      if (type == 2) {
        api.actionSheet({
          title: '选择附件',
          cancelTitle: '取消',
          buttons: ['视频', '从本地选择']
        }, function (ret, err) {
          var index = ret.buttonIndex;
          if (index == 1) {
            // 视频
            vm.camera_video();
          } else if (index == 2) {
            // 从本地选择
            vm.getVideo();
          }
        });
      } else if (type == 1) {
        api.actionSheet({
          title: '选择附件',
          cancelTitle: '取消',
          buttons: ['拍照', '从本地选择']
        }, function (ret, err) {
          var index = ret.buttonIndex;
          if (index == 1) {
            // 拍照
            vm.camera_img();
          } else if (index == 2) {
            // 从本地选择
            vm.getImg();
          }
        });
      }
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
      var imgindex = this.findIndex(this.imgarray.imgpaths, pathtemp);
      var imageBrowser = api.require('imageBrowser');

      imageBrowser.openImages({
        imageUrls: this.imgarray.imgpaths,
        showList: false,
        activeIndex: imgindex,
        tapClose: true
      });
    },
    //预览图片
    openImgUpload: function (pathtemp) {
      var head = pathtemp.substring(0, 4);
      if (head == 'uplo' || head == '/upl') {
        pathtemp = UICore.serviceUrl + pathtemp;
      }
      var imageBrowser = api.require('imageBrowser');
      imageBrowser.openImages({
        imageUrls: [pathtemp],
        showList: false,
        activeIndex: 0,
        tapClose: true
      });
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
    // 删除已经上传好的图片
    deleteImgUpload: function (pathtemp) {
      var mycomponent = this;
      api.confirm({
        title: '提示',
        msg: '确定要删除图片吗？',
        buttons: ['确定', '取消']
      }, function (ret, err) {
        var buttonIndex = ret.buttonIndex;
        if (buttonIndex == 1) {
          mycomponent.removeByValue(mycomponent.imgarray.imgpathsUpload, pathtemp);
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
    },
    //录视频
    camera_video: function () {
      this.closeItem();
      var mycomponent = this;
      var imageFilter = api.require('imageFilter');
      api.getPicture({
        sourceType: 'camera',
        mediaValue: 'video',
        destinationType: 'url',
        allowEdit: true,
        saveToPhotoAlbum: false
      }, function (ret, err) {
        if (ret) {
          var videoPath = ret.data;
          if (videoPath != "") {
            mycomponent.imgarray.videopaths.push(videoPath);
            mycomponent.imgarray.videonum++;
          }

        } else {
          alert(JSON.stringify(err));
        }

      });
    },
    //选择手机中的视频
    getVideo: function () {
      this.closeItem();
      var mycomponent = this;
      var imageFilter = api.require('imageFilter');
      var UIMediaScanner = api.require('UIMediaScanner');
      UIMediaScanner.open({
        type: 'video',
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
            for (var i = 0; i < ret.list.length; i++) {
              var videoPath = ret.list[i].path;
              mycomponent.imgarray.videopaths.push(videoPath);
              mycomponent.imgarray.videonum++;
            }
          }
        }
      });

    },
    //预览视频,调用手机应用打开视频
    openVideo: function (videopath) {
      api.openVideo({
        url: videopath
      });
    },
    openVideoUpload: function (videopath) {
      var url = videopath;
      var head = videopath.substring(0, 4);
      if (head == 'uplo' || head == '/upl') {
        url = UICore.serviceUrl + videopath;
      }
      api.openVideo({
        url: url
      });
    },
    //删除视频
    deleteVideo: function (videopath, index) {
      var mycomponent = this;
      api.confirm({
        title: '提示',
        msg: '确定要删除视频吗？',
        buttons: ['确定', '取消']
      }, function (ret, err) {
        var buttonIndex = ret.buttonIndex;
        if (buttonIndex == 1) {
          mycomponent.removeByValue(mycomponent.imgarray.videopaths, videopath);
        }
      });
    },
    // 删除下载视频
    deleteVideoUpload: function (videopath) {
      var mycomponent = this;
      api.confirm({
        title: '提示',
        msg: '确定要删除视频吗？',
        buttons: ['确定', '取消']
      }, function (ret, err) {
        var buttonIndex = ret.buttonIndex;
        if (buttonIndex == 1) {
          mycomponent.removeByValue(mycomponent.imgarray.videopathsUpload, videopath);
        }
      });
    },
    // 删除文件
    deleteFile: function (arr, filepath) {
      var vm = this;
      api.confirm({
        title: '提示',
        msg: '确定要删除该附件吗？',
        buttons: ['确定', '取消']
      }, function (ret, err) {
        var buttonIndex = ret.buttonIndex;
        if (buttonIndex == 1) {
          vm.removeByValue(arr, filepath);
        }
      });
    },
    // 打开文件
    openFile: function (filepath) {
      alert(filepath);
    }
  }
});

// 混入上传组件
var upload = {
  data: {
    // 图片
    imgarray: {
      imgpaths: [], //图片地址存放数组
      videopaths: [], //视频地址存放数组
      filepaths: [],
      soundRecords: [],
      imgpathsUpload: [],
      videopathsUpload: [],
      filespathsUpload: [],
      soundRecordUpload: [],
      imgnum: 0, //图片全局索引
      videonum: 0, //视频全局索引,
      filenum: 0, // 文件的全局索引
      soundRecordnum: 0 // 录音的全局索引
    },
  },
  components: {
    'api-upload': apiUpload
  },
  created: function () {

  },
  methods: {
    //上传附件
    uploadAttach: function (cb, url) {
      var imgarray = [];
      imgarray = imgarray.concat(this.imgarray.imgpaths);
      imgarray = imgarray.concat(this.imgarray.videopaths);
      imgarray = imgarray.concat(this.imgarray.filepaths);
      imgarray = imgarray.concat(this.imgarray.soundRecords);
      var mycomponent = this;
      var upUrl = UICore.serviceUrl + 'mobile/mobileWf.shtml?act=uploadAttach_HZ&loginId=' + this.accountId + '&workId=' + this.alltag.wf_flowInstanceId + '&nodeId=' + this.alltag.wf_activityId;
      if (url) {
        upUrl = url;
      }
      if (imgarray.length > 0) {
        UICore.showLoading('上传附件中...', '稍等...');
        api.ajax({
          url: upUrl,
          method: 'post',
          tag: 'grid',
          data: {
            files: {
              file: imgarray
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
    },
    //上传附件(待我审批，网格员核查事件中，需要上传2张以上照片才允许提交)
    uploadAttachForEventDetail: function (cb, url) {
      var data_area_code = $api.getStorage('userinf').dataAreaCode;
      if (data_area_code.length >= 15 && this.imgarray.imgpaths.length < 2) {
        api.alert({
          msg: '请上传2张及以上图片'
        });
        return;
      }
      if(this.wf_wfComments==''){
        api.alert({
          msg: '请填写审批意见'
        });
        return;
      }
      var imgarray = [];
      imgarray = imgarray.concat(this.imgarray.imgpaths);
      imgarray = imgarray.concat(this.imgarray.videopaths);
      imgarray = imgarray.concat(this.imgarray.filepaths);
      imgarray = imgarray.concat(this.imgarray.soundRecords);
      var mycomponent = this;
      var upUrl = UICore.serviceUrl + 'mobile/mobileWf.shtml?act=uploadAttach_HZ&loginId=' + this.accountId + '&workId=' + this.alltag.wf_flowInstanceId + '&nodeId=' + this.alltag.wf_activityId;
      if (url) {
        upUrl = url;
      }
      if (imgarray.length > 0) {
        UICore.showLoading('上传附件中...', '稍等...');
        api.ajax({
          url: upUrl,
          method: 'post',
          tag: 'grid',
          data: {
            files: {
              file: imgarray
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
    },
    //上传帮扶记录的附件
    uploadAttachForHelpRecord: function (cb) {
      this.imgarray.imgpaths = this.imgarray.imgpaths.concat(this.imgarray.videopaths);
      this.imgarray.imgpaths = this.imgarray.imgpaths.concat(this.imgarray.videopaths);
      var mycomponent = this;
      if (this.imgarray.imgpaths.length > 0) {
        UICore.showLoading('上传附件中...', '稍等...');
        api.ajax({
          url: UICore.serviceUrl + 'mobile/MobileSpecialHelpRecord.shtml?act=uploadAttach_ZZ&loginId=' + $api.getStorage('userinf').accountId + '&type=1',
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
              mycomponent.handleBackPicturl(function (r) {
                cb && cb(r);
              }, ret.Object, ret.data)
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
        mycomponent.handleBackPicturl(function (r) {
          cb && cb(r);
        }, '', '');
      }
    },
    // 处理附件
    handleAttach: function (url, id) {
      var arrUrl = url.split(',');
      var idArr = id.split(',');
      for (var i = 0, len = arrUrl.length; i < len; i++) {
        var attribute = arrUrl[i].substring(arrUrl[i].lastIndexOf('.') + 1, arrUrl[i].length);
        if (attribute === 'jpg' || attribute === 'png' || attribute === 'webp' || attribute === 'jpeg' || attribute === "gif" || attribute === 'bmp') {
          this.imgarray.imgpathsUpload.push(arrUrl[i]);
        } else {
          this.imgarray.videopathsUpload.push(arrUrl[i]);
        }
        this.attachAll.push({
          url: arrUrl[i],
          id: idArr[i]
        });
      }
    },
    // 处理返回的数据
    handleBackPicturl: function (cb, url, id) {
      var urlAll = '';
      var idAll = '';
      for (var j = 0, length = this.attachAll.length; j < length; j++) {
        for (var i = 0, len = this.imgarray.imgpathsUpload.length; i < len; i++) {
          if (this.attachAll[j].url == this.imgarray.imgpathsUpload[i]) {
            urlAll = urlAll + ',' + this.attachAll[j].url;
            idAll = idAll + ',' + this.attachAll[j].id;
          }
        }
        for (var i = 0, len = this.imgarray.videopathsUpload.length; i < len; i++) {
          if (this.attachAll[j].url == this.imgarray.videopathsUpload[i]) {
            urlAll = urlAll + ',' + this.attachAll[j].url;
            idAll = idAll + ',' + this.attachAll[j].id;
          }
        }
      }
      urlAll = url + urlAll;
      idAll = id + idAll;
      cb && cb({
        data: idAll,
        Object: urlAll
      });
    }
  },
};




// 列表组件
var listTemplate = Vue.extend({
  template: '<div class="no_end_list">' +
    '<div class="no_end_left">' +
    '<div class="no_end_left_img" v-if="!set"><img :src="isOutTime(eventobj.isTimeOut, eventobj.nodeLimitTime)"></div>' +
    '<div class="no_end_left_img" v-if="eventobj.handleFlag == 1"><img src="../../image/smIcon/flag_red.png"></div>' +
    '<div class="no_end_left_txt">{{eventobj.eventTitle}}</div>' +
    '</div>' +
    '<div class="no_end_right">' +
    '<p>{{eventobj.sponsorName}}</p>' +
    '<p>{{eventobj.reportTime}}</p>' +
    '</div>' +
    '</div>',
  props: ["eventobj", 'set'],
  data: function () {
    return {

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

// overflow: hidden
//   text-overflow: ellipsis
//   white-space: nowrap
//   word-wrap: break-word
//   word-break: break-all
// 督办列表组件
var listTemplateSupervise = Vue.extend({
  template: '<div class="no_end_list" style="min-height: 50px;">' +
    '<div class="no_end_left"  @click="sentDetail">' +
    '<div class="no_end_left_img" v-if="!set"><img :src="isOutTime(eventobj.isTimeOut, eventobj.nodeLimitTime)"></div>' +
    '<div class="no_end_left_img" v-if="eventobj.handleFlag == 1"><img src="../../image/smIcon/flag_red.png"></div>' +
    '<div class="no_end_left_txt">{{eventobj.eventTitle}}</div>' +
    '</div>' +
    '<div class="no_end_right" @click="sentDetail">' +
    '<p style="width: 95px;height: 13px;line-height: 13px;overflow: hidden;text-overflow: ellipsis; white-space: nowrap;word-wrap: break-word;word-break: break-all;">{{eventobj.sponsorName}}</p>' +
    '<p style="line-height: 10px;">{{eventobj.reportTime}}</p>' +
    '</div>' +
    '<div style="width: 50px;overflow: hidden;">' +
    '<div @click="sendSupervise" style="font-size: 10px;margin: 15px 15px 0 0;padding: 0 5px 0 5px;background: #2C61C8;color: #fff;border-radius: 4px;height: 25px !important;line-height: 25px;">督办</div>' +
    '</div>' +
    '</div>',
  props: ["eventobj", 'set'],
  data: function () {
    return {

    }
  },
  methods: {
    // 推送点击详情事件
    sentDetail: function () {
      this.$emit('sent', this.eventobj);
    },
    // 推送事件督办
    sendSupervise: function () {
      this.$emit('supervise', this.eventobj);
    },
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

// 督办提交组件
var subSupervise = Vue.extend({
  template: '<div class="js_dialog" v-if="visible" style="opacity: 1;">' +

    '<div class="weui-mask"></div>' +

    '<div class="weui-dialog weui-skin_android">' +

    '<div class="weui-dialog__bd" style="padding: 0 !important;max-height: 330px;overflow: auto;">' +

    '<div class="weui-cells weui-cells_radio" style="margin-top: 0;">' +
    '<div class="weui-cells__title" >督办类型：</div>' +
    '<label class="weui-cell weui-check__label" for="x11">' +
    '<div class="weui-cell__bd">' +
    '<p>当前处理人</p>' +
    '</div>' +
    '<div class="weui-cell__ft">' +
    '<input type="radio" value="1" v-model="handleType" class="weui-check" name="radio1" id="x11">' +
    '<span class="weui-icon-checked"></span>' +
    '</div>' +
    '</label>' +
    '<label class="weui-cell weui-check__label" for="x12">' +

    '<div class="weui-cell__bd">' +
    '<p>整条事件</p>' +
    '</div>' +
    '<div class="weui-cell__ft">' +
    '<input type="radio"  value="2" v-model="handleType" name="radio1" class="weui-check" id="x12">' +
    '<span class="weui-icon-checked"></span>' +
    '</div>' +
    '</label>' +

    '<div class="weui-cell weui-cell_switch">' +
    '<div class="weui-cell__bd">是否推送消息</div>' +
    '<div class="weui-cell__ft">' +
    '<input class="weui-switch" type="checkbox" v-model="news">' +
    '</div>' +
    '</div>' +

    '<div class="weui-cell weui-cell_switch">' +
    '<div class="weui-cell__bd">是否发送短信</div>' +
    '<div class="weui-cell__ft">' +
    '<input class="weui-switch" type="checkbox" v-model="message">' +
    '</div>' +
    '</div>' +

    '<div class="weui-cell">' +
    '<div class="weui-cell__bd">' +
    '<textarea class="weui-textarea" placeholder="请输入督办内容" v-model="comment" rows="2"></textarea>' +
    '</div>' +
    '</div>' +

    '</div>' +


    '</div>' +

    '<div class="weui-dialog__ft" style="padding: 0px 15px 5px 5px;">' +
    '<a href="javascript:void(0);" class="weui-dialog__btn weui-dialog__btn_default" @click="close">取消</a>' +
    '<a href="javascript:void(0);" class="weui-dialog__btn weui-dialog__btn_primary" @click="send">确定</a>' +
    '</div>' +

    '</div>' +
    '</div>',
  props: ["visible"],
  data: function () {
    return {
      // 是否推送消息（1：是，2：否）
      news: true,
      // 是否发送短信（1：是，2：否）	
      message: true,
      // 督办内容
      comment: '',
      // 督办类型（1：当前处理人，2：整条事件）
      handleType: 1
    }
  },
  methods: {
    // 关闭弹出层
    close: function () {
      this.$emit('update:visible', false);
    },
    // 刷新数据
    refresh: function () {
      this.news = true;
      this.message = true;
      this.comment = '';
      this.handleType = 1;
    },
    // 传递数据
    send: function () {
      if (this.comment == '') {
        api.toast({
          msg: '请填写督办内容',
          duration: 2000,
          location: 'bottom'
        });
        return false;
      }
      this.$emit('send', {
        handleType: this.handleType,
        message: this.message ? 1 : 2,
        news: this.news ? 1 : 2,
        comment: this.comment
      })
      this.close();
    }
  }
});

// list组件
var mixBase = {
  components: {
    'list-event': listTemplate,
    'list-event-supervise': listTemplateSupervise,
    'sub-supervise': subSupervise
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
    // token失败，重新获取token
    refreshToken: function (r, data) {
      var that = this;
      var user = $api.getStorage('username');
      var pwd = $api.getStorage('password');
      api.ajax({
        url: UICore.serviceUrl2() + "mobile/mobileInterface.shtml?act=loginFace&passWord=" + pwd + "&userName=" + user,
        method: 'get',
        timeout: 30,
      }, function (reta, erra) {
        if (reta) {
          if (reta.success == "true") {
            window.localStorage.setItem('token', reta.Data[0].token);
            that[r](data);
          } else {
            api.toast({
              msg: '获取token失败',
              duration: 2000,
              location: 'bottom'
            });
          }
        } else {
          api.toast({
            msg: '获取token失败',
            duration: 2000,
            location: 'bottom'
          });
        }
      });
    }
  }
};

// 表单填写
var ocnForm = Vue.extend({
  template: '<div>' +
    '<div  v-for="(item, index) in show" :key="index">' +

    '<div class="er_templ" v-if="isDateInput(item)">' +
    '<div class="er_templ_in">' +
    '<div class="er_lable">{{item.text}}</div>' +
    '<div :class="getClass(item.type)">' +
    '<input  type="text" v-model="f[item.value]" @click="selectItem(item)" readonly="readonly" :placeholder="getPlaceholder(item.validate, true)"/>' +
    '</div>' +
    '</div>' +
    '</div>' +

    '<div class="er_templ" v-if="isSelectInput(item)">' +
    '<div class="er_templ_in">' +
    '<div class="er_lable">{{item.text}}</div>' +
    '<div :class="getClass(item.type)">' +
    '<input  type="text" v-model="item.valueName" @click="selectItem(item)" readonly="readonly" :placeholder="getPlaceholder(item.validate, true)" />' +
    '</div>' +
    '</div>' +
    '</div>' +

    '<div class="er_templ" v-if="isAddress(item)">' +
    '<div class="er_templ_in">' +
    '<div class="er_lable">{{item.text}}</div>' +
    '<div :class="getClass(item.type)">' +
    '<input  type="text" v-model="f[item.value]" @click="goMap(item)" readonly="readonly" :placeholder="getPlaceholder(item.validate, true)" />' +
    '</div>' +
    '</div>' +
    '</div>' +

    '<div class="er_templ" v-if="isStringInput(item)">' +
    '<div class="er_templ_in">' +
    '<div class="er_lable">{{item.text}}</div>' +
    '<div :class="getClass(item.type)">' +
    '<input v-if="isStringInput(item)" type="text" v-model="f[item.value]" :placeholder="getPlaceholder(item.validate)" :readonly="flag" />' +
    '</div>' +
    '</div>' +
    '</div>' +

    '</div>' +
    '</div>',
  props: ['f', 'show', 'flag', 'set'],
  data: function () {
    return {
      // 单选
      radio: 'radio',
      // 多选
      checkbox: 'checkbox',
      // 选择日期,
      date: 'date',
      validateIndex: 0
    }
  },
  created: function () {
    var that = this;
    api.addEventListener({
      name: 'mapMarkXy'
    }, function (ret, err) {
      if (ret) {
        api.closeWin({
          name: 'mapMark'
        });
        that.f.coordinate = ret.value.xy;
      } else {
        alert(JSON.stringify(err));
      }
    });
  },
  methods: {
    // 判断date and 是否是动态变化的表单
    isDateInput(item) {
      if (item.type == 'date') {
        if (item.optionsValue) {
          return (this.f[item.optionsValue] == item.optionsId);
        } else {
          return true
        }
      } else {
        return false;
      }
    },
    // 判断选择
    isSelectInput(item) {
      if (item.type == 'radio' || item.type == 'checkbox') {
        if (item.optionsValue) {
          return (this.f[item.optionsValue] == item.optionsId);
        } else {
          return true
        }
      } else {
        return false;
      }
    },
    // 判断string
    isStringInput(item) {
      if (item.type == 'string' || item.type == 'mobile' || item.type == 'certificate' || item.type == 'tel') {
        if (item.optionsValue) {
          return (this.f[item.optionsValue] == item.optionsId);
        } else {
          return true
        }
      } else {
        return false;
      }
    },
    // 判断地图
    isAddress(item) {
      if (item.type == 'adressMark') {
        return true;
      } else {
        return false;
      }
    },
    // 跳转地图
    goMap: function (item) {
      var that = this;
      if (item.type == 'adressMark') {
        api.openWin({
          name: 'mapMark',
          url: './../../map/mapMark.html',
          pageParam: {
            flag: that.flag,
            xy: that.f.coordinate
          }
        });
      }
    },
    // 判断是选填还是必填
    getPlaceholder: function (validate, flag) {
      var name = '请输入-';
      if (flag) {
        name = '请选择-';
      }
      var type = '选填';
      if (validate) {
        type = '必填';
      }
      return name + type;
    },
    // 动态css
    getClass: function (type) {
      if (type == 'radio' || type == 'checkbox' || type == 'date' || type == "adressMark") {
        return 'bg_j pk_mem_input';
      } else {
        return 'pk_mem_input_all';
      }
    },
    // 选择方法
    selectItem(item) {
      if (this.flag) {
        return false;
      }
      if (item.type == 'date') {
        this.chooseDate(item);
      } else if (item.type == 'radio') {
        this.chooseRadio(item);
      } else if (item.type == 'checkbox') {
        this.chooseCheckBox(item);
      }
    },
    // 多选
    chooseCheckBox(item) {
      if (item.options.length > 0) {
        var that = this;
        if (item.valueName != null && item.valueName != "") {
          var temp_arr = item.valueName.split(' ');
          if (temp_arr != null && temp_arr.length > 0) {
            for (var i = 0; i < temp_arr.length; i++) {
              item.options.forEach(function (value, index, arr) {
                if (value.text == temp_arr[i]) {
                  arr[index].status = "selected";
                }
              })
            }
          }
        }
        UICore.openSelectmulti(item.options, null, "checkBox");
        api.addEventListener({
          name: 'checkBox'
        }, function (ret, err) {
          if (ret) {
            // alert(JSON.stringify(ret));
            item.valueName = ''; //先清空
            that.f[item.value] = ''; //先清空
            ret.value.key1.forEach(function (value, index, arr) {
              item.valueName += arr[index].text + ' ';
              that.f[item.value] += ',' + arr[index].key;
            });
          } else {
            alert(JSON.stringify(err));
          }
        });
      } else {
        api.toast({
          msg: '数据字典未配置',
          duration: 2000,
          location: 'bottom'
        });
      }
    },
    // 单选
    chooseRadio(item) {
      if (item.options.length > 0) {
        var that = this;
        if (that.f[item.value] != null && that.f[item.value] != "") {
          item.options.forEach(function (value, index, arr) {
            if (value.key == that.f[item.value]) {
              arr[index].status = "selected";
            } else {
              arr[index].status = "normal";
            }
          })
        };
        UICore.openSelect3(item.options, null, "radio");
        api.addEventListener({
          name: 'radio'
        }, function (ret, err) {
          if (ret) {
            item.valueName = ret.value.key1;
            that.f[item.value] = ret.value.key2;
            // 参与自动计算的单选（用于吸毒人员的 综合评价 字段）
            if (item.value == 'denialDetection' || item.value == 'leaveCenter' || item.value == 'drugAbuse' || item.value == 'educationInform' || item.value == 'leavelInform' || item.value == 'drugRehabilitation' || item.value == 'skill' || item.value == 'marryRelationship' || item.value == 'friendRelationship' || item.value == 'neighBourhood' || item.value == 'economicSource' || item.value == 'houseConditions' || item.value == 'employability' || item.value == 'mentalHealth') {
              that.f.overallEval = Math.floor((parseInt(that.f.denialDetection == '' ? '0' : that.f.denialDetection) + parseInt(that.f.leaveCenter == '' ? '0' : that.f.leaveCenter) + parseInt(that.f.drugAbuse == '' ? '0' : that.f.drugAbuse) + parseInt(that.f.educationInform == '' ? '0' : that.f.educationInform) + parseInt(that.f.leavelInform == '' ? '0' : that.f.leavelInform) + parseInt(that.f.drugRehabilitation == '' ? '0' : that.f.drugRehabilitation) + parseInt(that.f.skill == '' ? '0' : that.f.skill) + parseInt(that.f.marryRelationship == '' ? '0' : that.f.marryRelationship) + parseInt(that.f.friendRelationship == '' ? '0' : that.f.friendRelationship) + parseInt(that.f.neighBourhood == '' ? '0' : that.f.neighBourhood) + parseInt(that.f.economicSource == '' ? '0' : that.f.economicSource) + parseInt(that.f.houseConditions == '' ? '0' : that.f.houseConditions) + parseInt(that.f.employability == '' ? '0' : that.f.employability) + parseInt(that.f.mentalHealth == '' ? '0' : that.f.mentalHealth)) / 5);
            }
          } else {
            alert(JSON.stringify(err));
          }
        });
      } else {
        api.toast({
          msg: '数据字典未配置',
          duration: 2000,
          location: 'bottom'
        });
      }
    },
    // 选择时间
    chooseDate: function (item) { //出生日期
      var that = this;
      UICore.openTimeComponent2(this.date);
      api.addEventListener({
        name: 'buildingTime'
      }, function (ret, err) {
        if (ret) {
          if (that.set.dateFlag === 'yearMouth') {
            var dateArr = ret.value.key1.split('-');
            var date = dateArr[0] + '-' + dateArr[1];
            that.f[item.value] = date;
          } else {
            that.f[item.value] = ret.value.key1;
          }
        } else {
          alert(JSON.stringify(err));
        }
      });
    },
    // 验证器
    validate: function (flag, cb) {
      var that = this;
      !flag && (this.validateIndex = 0);
      // if (this.show[this.validateIndex].validate) {
      //   if(this.f[this.show[this.validateIndex].value] == ''){
      //     api.toast({
      //       msg: this.show[this.validateIndex].text + '不能为空！',
      //       duration: 2000,
      //       location: 'bottom'
      //     });
      //   }else if(this.setData[this.i].type == 'certificate'){

      //   }
      // } else {
      //   if (this.validateIndex < this.show.length - 1) {
      //     this.validateIndex++;
      //     this.validate(true);
      //   } else {
      //     this.$emit('submit', this.f);
      //   }
      // }
      if (this.show[this.validateIndex].validate && this.f[this.show[this.validateIndex].value] == '') {
        api.toast({
          msg: this.show[this.validateIndex].text + '不能为空！',
          duration: 2000,
          location: 'bottom'
        });
      } else {
        if (this.validateIndex < this.show.length - 1) {
          this.validateIndex++;
          this.validate(true);
        } else {
          this.$emit('submit', this.f);
        }
      }
    }
  }
});

// 混入表单组件
var ocnFormMix = {
  components: {
    'ocn-form': ocnForm
  },
  created: function () {
    // this.param = api.pageParam;
    // this.accountId = $api.getStorage('userinf').accountId;
    var that = this;
    setTimeout(function () {
      api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: "数据字典",
        text: "正在配置中...",
        modal: false
      });
      // 加载数据字典的数据
      that.addDictionary(function () {
        api.hideProgress();
      });
    }, 1000);
  },
  methods: {
    // 关闭页面
    closeWin: function () {
      api.closeWin();
    },
    // 加载数据字典
    addDictionary: function (cb) {
      var that = this;
      this.show.forEach(function (v) {
        if (v.dictionary) {
          var jsonData = JSON.parse($api.getStorage('settingdata'));
          jsonData.data.forEach(function (value) {
            if (value.parentKey == v.dictionary) {
              v.options.push({
                text: value.extendAttributeValue,
                status: 'normal',
                key: value.extendAttributeKey
              });
            }
          });
        }
      });
      cb && cb();
      this.reSetDictionary();
    },
    // 判断f里面的值，放入数据字典里
    reSetDictionary: function () {
      var that = this;
      this.show.forEach(function (v) {
        if (that.f[v.value] && v.type == 'radio') {
          v.options.forEach(function (value) {
            if (value.key == that.f[v.value]) {
              v.valueName = value.text;
            }
          });
        } else if (that.f[v.value] && v.type == 'checkbox') {
          var arr = that.f[v.value].split(',');
          arr.forEach(function (cbValue) {
            v.options.forEach(function (value) {
              if (value.key == cbValue) {
                v.valueName += value.text + ' ';
              }
            });
          });
        }
      });
    }
  }
}