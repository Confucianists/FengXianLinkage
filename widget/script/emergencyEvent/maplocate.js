/**
 * Created by chenzhe on 2017/8/3.
 */
var map, layer25D;
var trans = new Transformation(45, 45, 49); // 坐标转换对象
var mapload = function() {
    if (map) return;
    var touchFlag = 0;
    var defaultStyle = new OMAP.Style({
        graphicWidth: 25,
        graphicHeight: 35,
        graphicXOffset: -12.5,
        graphicYOffset: -35,
        pointRadius: 4,
        strokeWidth: 3,
        strokeOpacity: 1,
        strokeColor: "#00FF00",
        fillColor: "#ffcc66",
        fillOpacity: 1,
        externalGraphic: "../../image/map/locate.png"
    });
    var config = new OMAP.Config({
        imagePath: "http://61.185.20.73:58888/image",
        jsPath: "http://61.185.20.73:58888/resource/js/",
        mapId: 1,
        scale: 0.353,
        hotFileLevel: 5,
        overlook: Math.PI / 4,
        rotate: Math.PI / 4
    });
    layer25D = new OMAP.Layer.NOGISLayer("25D", "http://61.185.20.73:58888/resource/", {
        isBaseLayer: false,
        transparent: true,
        defaultImage: '../script/Nogis-api/img/transparent.png',
        loadHotspot: false
    });
    var ext = new OMAP.Bounds(-56255400.354765005, -56255400.354765005, 56255400.354765005, 56255400.354765005);
    var layerYX = new OMAP.Layer.NOGISLayer("YX", "http://61.185.20.73:58888/resource/yx", {
        isBaseLayer: true,
        defaultImage: '../script/Nogis-api/img/nopic.jpg',
        loadHotspot: false
    });
    // 地图配置
    var mapOptions = {
        extent: ext,
        center: [7663518.5383787, 4661344.4169003],
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
        layers: [layer25D, layerYX],
        controls: [new OMAP.Control.Navigation()]
    };
    // 初始化地图
    map = new OMAP.Map("mapDiv", mapOptions);
    var showLayer25D = new OMAP.Layer.Vector("标注图层", {
        styleMap: new OMAP.StyleMap({
            'default': defaultStyle
        }),
    });
    map.addLayer(showLayer25D);
    map.events.register("moveend", map, function() {
        var center = map.getCenter();
        loacte(center.lon, center.lat, showLayer25D);
    });
    var bMap = api.require('baiduLocation');
    bMap.getLocation({
        accuracy: '100m',
        autoStop: true,
        filter: 1
    }, function(ret, err) {
        if (ret.status) {
            var point = trans.bd09towgs84(ret.longitude, ret.latitude);
            point = trans.WGS842OCN(point.x, point.y);
            alert(point.x+","+point.y);
            //map.setCenter([point.x, point.y],map.getZoom());
        } else {
            alert(err.code);
        }
    });
}
var loacte = function(x, y, showLayer) {
    showLayer.removeAllFeatures();
    localCoordinate = null;
    var coord = {
        lon: x,
        lat: y
    }
    localCoordinate = coord;
    var geometry = new OMAP.Geometry.Point(coord.lon, coord.lat);
    var feature = new OMAP.Feature.Vector(geometry);
    showLayer.addFeatures([feature]);
}
var localCoordinate;
//var submit = document.getElementById("submit");
submit.onclick = function() {
        mapcontainer.style.display = "none";
        var coordinate = "";
        var wgs84location = "";
        if (localCoordinate) {
            coordinate = localCoordinate.lon + "," + localCoordinate.lat;
            var pt = trans.OCN2WGS84(localCoordinate.lon, localCoordinate.lat);
            //pt = trans.wgs84tobd09(pt.x, pt.y);
            wgs84location = pt.y + "," + pt.x;
        }
        api.sendEvent({
            name: ("mapSelect"),
            extra: {
                coordinate: coordinate,
                wgs84location: wgs84location
            }
        });
    }
    //var mapcontainer = document.getElementById("mapcontainer");
    //mapcontainer.style.display = "block";
    //mapload();
