var Measure = function(map,options){
	this.map = map;
	this.com = new OMAP.Com(map.config);
	this.drawLayer = null;
	this.labelLayer = null;
	this.init();
	this.activeStatus = 3;
};

Measure.prototype.init = function() {
    var sketchSymbolizers = {
        "Line": {
            strokeWidth: 3,
            strokeOpacity: 1,
            strokeColor: "red",
            strokeDashstyle: "dash"
        },
        "Polygon": {
            strokeWidth: 2,
            strokeOpacity: 1,
            strokeColor: "red",
            fillColor: "white",
            fillOpacity: 0.3
        }
    };
    var style = new OMAP.Style();
    style.addRules([
        new OMAP.Rule({symbolizer: sketchSymbolizers})
    ]);
    var styleMap = new OMAP.StyleMap({"default": style});
    
    var renderer = OMAP.Layer.Vector.prototype.renderers;

    this.lineMeasureCtrl = new OMAP.Control.Measure(
            OMAP.Handler.Path, {
                persist: true,
                immediate:true,
                handlerOptions: {
                    layerOptions: {
                        renderers: renderer,
                        styleMap: styleMap
                    }
                }
            }
     );
     this.polygonMeasureCtrl = new OMAP.Control.Measure(
            OMAP.Handler.Polygon, {
                persist: true,
                immediate:true,
                handlerOptions: {
                    layerOptions: {
                        renderers: renderer,
                        styleMap: styleMap
                    }
                }
            }
      );
     this.map.addControl(this.lineMeasureCtrl);
     this.map.addControl(this.polygonMeasureCtrl);
     var me = this;
     this.lineMeasureCtrl.events.on({
         "measure": function(evt) {
        	 me.handleLineMeasure(evt);
         },
         "measurepartial": function(evt) {
        	 me.handleLineMeasure(evt);
         }
     });
     this.polygonMeasureCtrl.events.on({
         "measure": function(evt) {
        	 me.handlePolygonMeasure(evt);
         },
         "measurepartial": function(evt) {
        	 me.handlePolygonMeasure(evt);
         }
     });
     
     this.drawLayer = new OMAP.Layer.Vector("measure_layer",{
    	 styleMap:styleMap
     });
	 this.map.addLayer(this.drawLayer);
	 
	 //初始化节点以及节点距离图层
	 var renderer = OMAP.Layer.Vector.prototype.renderers;
     
     this.labelLayer = new OMAP.Layer.Vector("nodeLayer", {
         styleMap: new OMAP.StyleMap({'default':{
             strokeColor: "#00FF00",
             strokeOpacity: 1,
             strokeWidth: 3,
             fillColor: "#FF5500",
             fillOpacity: 0.5,
             pointRadius: 5,
             pointerEvents: "visiblePainted",
             label : "${name}",
             fontColor: "${favColor}",
             fontSize: "12px",
             fontFamily: "Courier New, monospace",
             fontWeight: "bold",
             labelAlign: "${align}",
             labelXOffset: "${xOffset}",
             labelYOffset: "${yOffset}",
             labelOutlineColor: "white",
             labelOutlineWidth: 3
         }}),
         renderers: renderer
     });
     this.map.addLayer(this.labelLayer);
     
};

Measure.prototype.handleLineMeasure = function(event){
	var geom = event.geometry;
	var len = this.com.getLineDistance(geom.components);
	var tip = this.formatLength(len,1);
	if(event.type == 'measure') {
		var feature = new OMAP.Feature.Vector(geom);
		this.drawLayer.addFeatures([feature]);
    	event.object.deactivate();
    }else {
    	var pt = geom.components[geom.components.length - 1];
        var nodeFeature = new OMAP.Feature.Vector(pt);
        nodeFeature.attributes = {
            name: tip,
            favColor: 'red',
            align: "cm",
			xOffset:0,
			yOffset:10
        };
        this.labelLayer.removeAllFeatures();
    	this.labelLayer.addFeatures([nodeFeature]);
    }
};

Measure.prototype.handlePolygonMeasure = function(event) {
	var geom = event.geometry;
	var pts = geom.components[0].components;
	var area = this.com.getArea(pts);
	var tip = this.formatArea(area,1);
	if(event.type == 'measure') {
		var feature = new OMAP.Feature.Vector(geom);
		this.drawLayer.addFeatures([feature]);
    	event.object.deactivate();
    }else {
    	if(pts.length < 2){
    		return;
    	}
    	var pt = pts[pts.length - 2];
    	var nodeFeature = new OMAP.Feature.Vector(pt);
        nodeFeature.attributes = {
            name: tip,
            favColor: 'red',
            align: "cm",
			xOffset:0,
			yOffset:10
        };
        this.labelLayer.removeAllFeatures();
    	this.labelLayer.addFeatures([nodeFeature]);
    }
	if(typeof callBackArea != 'undefined' && callBackArea instanceof Function){
		callBackArea(area);
	}
};

Measure.prototype.calPolygon = function(pts) {
	var area = this.com.getArea(pts);
	var tip = this.formatArea(area,1);
	var pt = pts[pts.length - 2];
	
	var nodeFeature = new OMAP.Feature.Vector(pt);
    nodeFeature.attributes = {
        name: tip,
        favColor: 'red',
        align: "cm",
		xOffset:0,
		yOffset:10
    };
    this.labelLayer.removeAllFeatures();
	this.labelLayer.addFeatures([nodeFeature]);
//	if(typeof callBackArea != 'undefined' && callBackArea instanceof Function){
//		callBackArea(area);
//	}
	
	return tip;
};

Measure.prototype.calLine = function(pts){
	var len = this.com.getLineDistance(pts);
	var tip = this.formatLength(len,1);

	var pt = geom.components[pts.length - 1];
    var nodeFeature = new OMAP.Feature.Vector(pt);
    nodeFeature.attributes = {
        name: tip,
        favColor: 'red',
        align: "cm",
		xOffset:0,
		yOffset:10
    };
    this.labelLayer.removeAllFeatures();
	this.labelLayer.addFeatures([nodeFeature]);

	return tip;
};

Measure.prototype.formatLength = function(len,fix){
	fix = fix || 0;
	if(len >= 1000){
		return (len / 1000).toFixed(fix) + "千米";
	}else {
		return len.toFixed(fix) + "米";
	}
};

Measure.prototype.formatArea = function(area,fix){
	fix = fix || 0;
	if(area >= 1000000){
		return (area / 1000000).toFixed(fix) + "平方公里";
	}else {
		return area.toFixed(fix) + "平方米";
	}
};

Measure.prototype.active = function(type){
	if(this.lineMeasureCtrl == null || this.polygonMeasureCtrl == null){
		return;
	}
	this.labelLayer.removeAllFeatures();
	this.drawLayer.removeAllFeatures();
	if(this.activeStatus==0 && this.activeStatus==type){
		this.lineMeasureCtrl.deactivate();
		this.activeStatus=3;
	}else if(this.activeStatus==1 && this.activeStatus==type){
		this.polygonMeasureCtrl.deactivate();
		this.activeStatus=3;
	}else{
		if(type == 0){
			this.polygonMeasureCtrl.deactivate();
			this.lineMeasureCtrl.activate();
			this.activeStatus=0;
		}else if(type == 1){
			this.polygonMeasureCtrl.activate();
			this.lineMeasureCtrl.deactivate();
			this.activeStatus=1;
		}
	}
};

Measure.prototype.deactive = function(){
	if(this.lineMeasureCtrl == null || this.polygonMeasureCtrl == null){
		return;
	}
	this.polygonMeasureCtrl.deactivate();
	this.lineMeasureCtrl.deactivate();

};

Measure.prototype.clear = function(){
	if(this.labelLayer) {
		this.labelLayer.removeAllFeatures();
	}
	if(this.drawLayer) {
		this.drawLayer.removeAllFeatures();
	}
};
