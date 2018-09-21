/**
 * Created by chenzhe on 2017/8/3.
 */

var buildId = null;
var buildName = null;
var Address = null;
var tag = "tag0";
var tagSquence = 0;
var map, layer25D;
var trans = new Transformation(45, 45, 49); // 坐标转换对象
var updateTag = function() {
    tagSquence++;
    tag = "tag" + tagSquence;
};
var mapload = function() {
    if (map) return;
    var config = new OMAP.Config({
        imagePath: UICore.mapServiceUrl+"image",
        jsPath: UICore.mapServiceUrl+"resource/js/",
        mapId: 1,
        scale: 0.353,
        hotFileLevel: 5,
        overlook: Math.PI / 4,
        rotate: Math.PI / 4
    });
    layer25D = new OMAP.Layer.NOGISLayer("25D", UICore.mapServiceUrl+"resource/", {
        isBaseLayer: true,
        transparent: true,
        defaultImage: '../script/Nogis-api/img/transparent.png',
        loadHotspot: true,
        hotspotTouch: touchHandler
    });
    var ext = new OMAP.Bounds(-56255400.354765005, -56255400.354765005, 56255400.354765005, 56255400.354765005);
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
        layers: [layer25D],
        controls: [new OMAP.Control.Navigation()]
    };
    // 初始化地图
    map = new OMAP.Map("mapDiv", mapOptions);
}

function touchHandler(e) {
    var hoverGeom = e.target;
    layer25D.hotspot.hoverlayer.removeAllFeatures();
    if (layer25D.hotspot.popup) {
        map.removePopup(layer25D.hotspot.popup);
        layer25D.hotspot.popup.destroy();
        layer25D.hotspot.popup = null;
    }
    buildId = null;
    buildName = null;
    Address = null;
    if (hoverGeom) {
        var geom = hoverGeom.geometry.clone();
        var attr = hoverGeom.attributes;
        var f = new OMAP.Feature.Vector(geom, attr, null);
        layer25D.hotspot.hoverlayer.addFeatures([f]);
        var pt = geom.getCentroid();
        var id = hoverGeom.data.id;
        var html =
            "<div style='background-color: rgba(255, 255, 255, 1);border-radius: 5px;padding: 2px 8px 2px 8px;margin-bottom: 3px;box-shadow: inset 0 0 0 rgba(0, 0, 0, .075), 2px 2px 2px 2px rgba(51, 51, 51, 0.7);white-space: nowrap;'>" +
            hoverGeom.data.name + "</div>";
        layer25D.hotspot.popup = createPop('' + id, html, pt.x, pt.y, -30, -40);
        var wgs84pt = trans.OCN2WGS84(pt.x, pt.y);
        buildId = id;
        buildName = hoverGeom.data.name;

        api.cancelAjax({
            tag: tag,
        });
        updateTag();
        api.ajax({
            url: 'http://api.map.baidu.com/geocoder/v2/',
            method: 'get',
            tag:tag,
            data: {
                values: {
                    location: wgs84pt.y+","+wgs84pt.x,
                    coordtype: 'wgs84ll',
                    output: 'json',
                    ak: "4eb424fae9e47fe4549f4846791df8b6"
                }
            }
        }, function(ret, err) {
            if (ret && ret.result) {
                Address = ret.result.formatted_address;
            } else {
                api.alert({
                    msg: JSON.stringify(err)
                });
            }
        });
    }
}

function createPop(id, html, x, y, xp, yp) {
    if (map == null || typeof(map) == 'undefined') return;
    var popup = new OMAP.Popup(id,
        new OMAP.LonLat(x, y),
        new OMAP.Size(100, 100),
        html,
        false, '', xp, yp);
    popup.setBackgroundColor("transparent");
    popup.autoSize = 1;
    //popup.padding = new OMAP.Bounds(-50,0,0,-50);
    map.addPopup(popup);
    return popup;
}
//var submit = document.getElementById("submit");
//submit.onclick = function() {
    //mapcontainer.style.display = "none";
    //buildingObj.vue.mapNum = buildId;
    //buildingObj.vue.buildingName = buildName;
    //buildingObj.vue.address = Address;

//}
//var mapcontainer = document.getElementById("mapcontainer");
//mapcontainer.style.display = "block";
//mapload();
