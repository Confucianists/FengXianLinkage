/**
 * Created by chenze on 2017/08/01.
 */

apiready = function() {
    var map, currentMap;
    var map0, map1, layer25D, showLayer25D, showLayerTdt;
    var trans = new Transformation(45, 45, 49); // 坐标转换对象
    var defaultStyle = new OMAP.Style({
        pointRadius: 4,
        strokeWidth: 3,
        strokeOpacity: 1,
        strokeColor: "#00FF00",
        fillColor: "#ffcc66",
        fillOpacity: 0.3
    });

    function mapLoader() {
        if (map0) return;
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
            isBaseLayer: false,
            transparent: true,
            defaultImage: '../script/Nogis-api/img/transparent.png',
            loadHotspot: true,
            hotspotTouch: touchHandler
        });
        var layerYX = new OMAP.Layer.NOGISLayer("YX", UICore.mapServiceUrl+"resource/yx", {
            isBaseLayer: true,
            defaultImage: '../script/Nogis-api/img/nopic.jpg',
            loadHotspot: false
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
            layers: [layer25D, layerYX],
            controls: [new OMAP.Control.Navigation()]
        };
        // 初始化地图
        map0 = new OMAP.Map("mapDiv", mapOptions);
        var showLayer25D = new OMAP.Layer.Vector("标注图层", {
            styleMap: new OMAP.StyleMap({
                'default': defaultStyle
            }),
        });
        map0.addLayer(showLayer25D);
        map0.showLayer = showLayer25D;
        map0.setLayerIndex(layer25D, 0);
        map0.setLayerIndex(showLayer25D, 1);
        switchHots("first");
    }

    function touchHandler(e) {
        var hoverGeom = e.target;
        layer25D.hotspot.hoverlayer.removeAllFeatures();
        if (layer25D.hotspot.popup) {
            map.removePopup(layer25D.hotspot.popup);
            layer25D.hotspot.popup.destroy();
            layer25D.hotspot.popup = null;
        }
        if (hoverGeom) {
            var geom = hoverGeom.geometry.clone();
            var attr = hoverGeom.attributes;
            var f = new OMAP.Feature.Vector(geom, attr, null);
            layer25D.hotspot.hoverlayer.addFeatures([f]);
            var pt = geom.getCentroid();
            var id = hoverGeom.data.id;
            var html = "<div style='background-color: rgba(255, 255, 255, 1);border-radius: 5px;padding: 2px 8px 2px 8px;margin-bottom: 3px;box-shadow: inset 0 0 0 rgba(0, 0, 0, .075), 2px 2px 2px 2px rgba(51, 51, 51, 0.7);white-space: nowrap;'>" + hoverGeom.data.name + "</div>";
            layer25D.hotspot.popup = createPop('' + id, html, pt.x, pt.y, -30, -40);
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
    /**
     * 初始化矢量图
     */
    function initMap1() {
        if (map1) return;
        var mirrorUrls = ["http://t0.tianditu.com/DataServer",
            "http://t1.tianditu.com/DataServer",
            "http://t2.tianditu.com/DataServer",
            "http://t3.tianditu.com/DataServer",
            "http://t4.tianditu.com/DataServer",
            "http://t5.tianditu.com/DataServer",
            "http://t6.tianditu.com/DataServer"
        ];
        var maxExt = (new OMAP.Bounds(-180, -90, 180, 90));
        var vectorLayerGJ = new OMAP.Layer.TDTLayer("Vec", "/maptile", {
            mapType: 'vec_c',
            topLevel: 1,
            bottomLevel: 18,
            visibility: true,
            isBaseLayer: true,
            maxExtent: maxExt,
            mirrorUrls: mirrorUrls
        });
        var vecLabelLayerGJ = new OMAP.Layer.TDTLayer("vecLabel", "/maptile", {
            mapType: 'cva_c',
            topLevel: 1,
            bottomLevel: 18,
            visibility: true,
            isBaseLayer: false,
            maxExtent: maxExt,
            mirrorUrls: mirrorUrls
        });
        var mapOptions = {
            zoom: 10,
            numZoomLevels: 18,
            fallThrough: true,
            layers: [vecLabelLayerGJ, vectorLayerGJ],
            center: [129.51454, 42.90780],
            controls: [new OMAP.Control.TouchNavigation()]
        };
        // 初始化地图
        map1 = new OMAP.Map("mapDiv1", mapOptions);
        showLayerTdt = new OMAP.Layer.Vector("标注图层", {
            styleMap: new OMAP.StyleMap({
                'default': defaultStyle
            }),
        });
        map1.addLayer(showLayerTdt);
        map1.showLayer = showLayerTdt;
        //map1.setLayerIndex(showLayerTdt, 0);
    }

    function switchMap() {
        if(document.getElementById("mapSwitch").style.backgroundImage.indexOf("btn_map_on")>-1){
          document.getElementById("mapSwitch").style.backgroundImage="url(../image/map/btn_map_off.png)";
        }else{
          document.getElementById("mapSwitch").style.backgroundImage="url(../image/map/btn_map_on.png)";
        }

        var zoomNum;
        if (currentMap == 0) {
            mapDiv.style.display = "none";
            mapDiv1.style.display = "block";
            if (map.getZoom() >= 7) {
                zoomNum = 17;
            } else {
                zoomNum = map.getZoom() + 11;
            }
            var ctr = map.getCenter();
            initMap1();
            var wgs84 = trans.OCN2WGS84(ctr.lon, ctr.lat);
            map1.setCenter([wgs84.x, wgs84.y], zoomNum);
            map = map1;
            currentMap = 1;
        } else if (currentMap == 1) {
            mapDiv.style.display = "block";
            mapDiv1.style.display = "none";
            if (map.getZoom() <= 12) {
                zoomNum = 0;
            } else {
                zoomNum = map.getZoom() - 11;
            }
            var ctr = map.getCenter();
            var ocn = trans.WGS842OCN(ctr.lon, ctr.lat);
            // 初始化OCN2.5D地图
            mapLoader();
            map0.setCenter([ocn.x, ocn.y], zoomNum);
            map = map0;
            currentMap = 0;
        }
    }
    var bMap = api.require('baiduLocation');
    var navigation = function(sx, sy, tx, ty) {
        api.ajax({
            url: 'http://api.map.baidu.com/direction/v2/transit',
            method: 'get',
            data: {
                values: {
                    origin: sy + ',' + sx,
                    destination: ty + ',' + tx,
                    coord_type: 'wgs84',
                    ak: "4eb424fae9e47fe4549f4846791df8b6"
                }
            }
        }, function(ret, err) {
            if (ret&&ret.result) {
                var routes = ret.result.routes;
                var route = null;
                var minDistance = 0;
                for (var i = 0; i < routes.length; i++) {
                    if (minDistance == 0 || routes[i].distance < minDistance) {
                        route = routes[i];
                        minDistance = routes[i].distance;
                    }
                }
                if (route) {
                    var points = [];
                    for (var i = 0; i < route.steps.length; i++) {
                        var step = route.steps[i][0];
                        var path = getpath(step.path);
                        points.push(step.start_location);
                        Array.prototype.push.apply(points, path);
                        points.push(step.end_location);
                    }
                    for (var i = 0; i < points.length; i++) {
                        points[i] = trans.bd09towgs84(points[i].lng, points[i].lat);
                    }
                    if (currentMap == 0) {
                        for (var i = 0; i < points.length; i++) {
                            points[i] = trans.WGS842OCN(points[i].x, points[i].y);
                        }
                    }
                    drawRouteLine(points);
                    var last=points[points.length-1];
                    map.setCenter([last.x,last.y],map.getZoom());
                }
            } else {
                api.alert({
                    msg: JSON.stringify(err)
                });
            }
        });
    }

    function getpath(path) {
        var r = /^(-?\d+)(\.\d+)?$/
        var paths = path.split(";");
        var points = [];
        for (var i = 0; i < paths.length; i++) {
            var coordinate = paths[i].split(",");
            if (coordinate.length == 2 && r.test(coordinate[0]) && r.test(coordinate[1])) {
                points.push({
                    lng: coordinate[0],
                    lat: coordinate[1]
                })
            }
        }
        return points;
    }

    function drawRouteLine(points) {
        map.showLayer.removeAllFeatures();
        var pts = [];
        for (var i = 0; i < points.length; i++) {
            var pt = new OMAP.Geometry.Point(points[i].x, points[i].y);
            pts.push(pt);
        }
        var geometry = new OMAP.Geometry.LineString(pts);
        var feature = new OMAP.Feature.Vector(geometry);
        map.showLayer.addFeatures([feature]);
    }

    var routes = function() {
        var sx, sy, tx, ty;
        sx = s_x.value;
        sy = s_y.value;
        tx = t_x.value;
        ty = t_y.value;
        //api.alert(sx + "," + sy + "," + tx + "," + ty);
        navigation(sx, sy, tx, ty);
    }


    function located() {
        bMap.getLocation({
            accuracy: '100m',
            autoStop: true,
            filter: 1
        }, function(ret, err) {
            if (ret.status) {
                var point = trans.bd09towgs84(ret.longitude, ret.latitude);
                if (currentMap == 0) {
                    point = trans.WGS842OCN(point.x, point.y);
                }
                alert(point.x+","+point.y);
                //map.setCenter([point.x, point.y],map.getZoom());
            } else {
                alert(err.code);
            }
        });
    }

    function switchHots(flag) {
        if(flag!="first"){
          if(document.getElementById("hotspot").style.backgroundImage.indexOf("btn_hotspot_on")>-1){
            document.getElementById("hotspot").style.backgroundImage="url(../image/map/btn_hotspot_off.png)";
          }else{
            document.getElementById("hotspot").style.backgroundImage="url(../image/map/btn_hotspot_on.png)";
          }
        }

        layer25D.hotspot.setVisible(!layer25D.hotspot.visible);
        layer25D.hotspot.visible = !layer25D.hotspot.visible;
        layer25D.hotspot.isHovered = false;
        if (layer25D.hotspot.popup) {
            map.removePopup(layer25D.hotspot.popup);
            layer25D.hotspot.popup.destroy();
            layer25D.hotspot.popup = null;
        }
    }


/*
    ///////////测试用
    /////////////////////////////////////////////////////////////////
    var mapSwitch = document.getElementById("mapSwitch");
    var locate = document.getElementById("locate");
    var hotspot = document.getElementById("hotspot");
    var navi = document.getElementById("navi");
    var s_x = document.getElementById("s_x");
    var s_y = document.getElementById("s_y");
    var t_x = document.getElementById("t_x");
    var t_y = document.getElementById("t_y");

    function test(ret) {
        var routes = ret.result.routes;
        var route = null;
        var minDistance = 0;
        for (var i = 0; i < routes.length; i++) {
            if (minDistance == 0 || routes[i].distance < minDistance) {
                route = routes[i];
                minDistance = routes[i].distance;
            }
        }
        if (route) {
            var points = [];
            for (var i = 0; i < route.steps.length; i++) {
                var step = route.steps[i][0];
                var path = getpath(step.path);
                points.push(step.start_location);
                Array.prototype.push.apply(points, path);
                points.push(step.end_location);
            }
            for (var i = 0; i < points.length; i++) {
                points[i] = trans.bd09towgs84(points[i].lng, points[i].lat);
            }
            if (currentMap == 0) {
                for (var i = 0; i < points.length; i++) {
                    points[i] = trans.WGS842OCN(points[i].x, points[i].y);
                }
            }
            drawRouteLine(points);
        }
    }
    //////////////////////////////////////////////////////////////////////////////
*/
    mapLoader();
    map = map0;
    currentMap = 0;
    mapSwitch.onclick = switchMap; //地图切换
    locate.onclick = located; //定位
    hotspot.onclick = switchHots; //热区开关
    //navi.onclick = routes; //路径导航
}
