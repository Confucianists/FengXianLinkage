// 地图选择 打点
var xy = null;
var object = null;
var tag = "tag0";
var tagSquence = 0;
var map, layer25D;
var trans = new Transformation(45, 45, 49); // 坐标转换对象
var updateTag = function () {
  tagSquence++;
  tag = "tag" + tagSquence;
};
var mapload = function () {
  if (map) return;
  var config = new OMAP.Config({
    imagePath: UICore.mapServiceUrl + "image",
    jsPath: UICore.mapServiceUrl + "resource/js/",
    mapId: 1,
    scale: 0.353,
    hotFileLevel: 5,
    overlook: Math.PI / 4,
    rotate: Math.PI / 4
  });
  layer25D = new OMAP.Layer.NOGISLayer("25D", UICore.mapServiceUrl + "resource/", {
    isBaseLayer: true,
    transparent: true,
    defaultImage: '../script/Nogis-api/img/transparent.png',
    loadHotspot: false,
    hotspotTouch: null
  });
  var ext = new OMAP.Bounds(-56255400.354765005, -56255400.354765005, 56255400.354765005, 56255400.354765005);
  // 地图配置
  var mapOptions = {
    extent: ext,
    center: UICore.mapCenter,
    zoom: 4,
    config: config,
    resolutions: [
      107.29866095498084608,
      53.64933047749042304,
      26.82466523874521152,
      13.41233261937260576,
      6.70616630968630288,
      3.35308315484315144,
      1.67654157742157572,
      0.83827078871078786,
      0.41913539435539393
    ],
    numZoomLevels: 9,
    layers: [layer25D],
    controls: [new OMAP.Control.Navigation()]
  };
  // 初始化地图
  map = new OMAP.Map("mapDiv", mapOptions);
  if(api.pageParam.flag){
    if(api.pageParam.xy){
      var arrXy = api.pageParam.xy.split(',');
      init_addTagging(arrXy[0], arrXy[1]);
    }
  }else{
    if(api.pageParam.xy){
      var arrXy = api.pageParam.xy.split(',');
      init_markTool(arrXy[0], arrXy[1]);
    }else{
      init_markTool();
    }
  }
}

// 画标注
function init_markTool(x, y) {
  var pointLayer;
  var pointDrawHandler;
  var pointStyle = {
    pointRadius: 0
  }
  var markers = new OMAP.Layer.Markers("Markers");
  map.addLayer(markers);
  if (x) {
    var markerkk = new OMAP.Marker(new OMAP.LonLat(x, y), null);
    markers.clearMarkers();
    markers.addMarker(markerkk);
  }
  function drawMark() {
    if (pointLayer == null) {
      pointLayer = new OMAP.Layer.Vector("pointLayer", {
        style: pointStyle
      });
      map.addLayer(pointLayer);
    }
    if (pointDrawHandler == null) {
      pointDrawHandler = new OMAP.Control.DrawFeature(pointLayer,
        OMAP.Handler.Point);
      this.map.addControl(pointDrawHandler);
      var me = this;
      // 在地图点击完成后事件
      pointDrawHandler.events.on({
        "featureadded": function (eventArgs) {
          var size = new OMAP.Size(21, 25);
          // alert(eventArgs.feature.geometry.x);
          var marker = new OMAP.Marker(new OMAP.LonLat(
            eventArgs.feature.geometry.x,
            eventArgs.feature.geometry.y), null);
          markers.clearMarkers();
          markers.addMarker(marker);
          xy = eventArgs.feature.geometry.x + ',' + eventArgs.feature.geometry.y;
        }
      });
    }
    pointDrawHandler.activate();
  }
  drawMark();
}

// 打上标注
function init_addTagging(x, y) {
  var markers = new OMAP.Layer.Markers("Markers");
  map.addLayer(markers);
  var marker = new OMAP.Marker(new OMAP.LonLat(x, y));
  markers.addMarker(marker);
}

apiready = function () {
  new Vue({
    el: "#list",
    data: {
      flag: api.pageParam.flag
    },
    methods: {
      submit: function () {
        if (!xy) {
          api.toast({
            msg: '请打点',
            duration: 3000,
            global: 'true',
            location: 'bottom'
          });
          return false;
        }
        api.sendEvent({
          name: 'mapMarkXy',
          extra: {
            xy: xy
          }
        });
      },
      closeWin: function () {
        api.closeWin();
      }
    }
  });
  var that = this;
  mapcontainer.style.display = "block";
  mapload();
}


