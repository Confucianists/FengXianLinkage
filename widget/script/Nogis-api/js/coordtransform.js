var Transformation = function(ag1, ag2,zone) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
	this.pi = 3.14159265358979;
	this.angle1 = ag1 || 45;
	this.angle2 = ag2 || 45;
	this.zone = zone || 49;
	this.rotate = ag1 * this.pi / 180;
	this.overlook = ag2 * this.pi / 180;
	this.cps = [{sp:{x:7665927.7654916,y:4655360.3929787},tp:{x:108.70222963693,y:34.315080799379}},
				{sp:{x:7672345.5666501,y:4662727.1166699},tp:{x:108.6895159662,y:34.355313934603}},
				{sp:{x:7773779.6851671,y:4815833.9231449},tp:{x:108.33161432856,y:35.112320667961}}];
	
	//计算参数
	this.caculatParamFromUTMCP = function(o1,o2,t1,t2){
		var o1Utm = this.toUTMPattern(o1.x,o1.y);
		var o2Utm = this.toUTMPattern(o2.x,o2.y);
		//A Ox + B = tx
		//C oy + D = ty
		var A = (t2.x - t1.x) / (o2Utm.x - o1Utm.x);
		var B = t1.x - A * o1Utm.x;
		
		var B1 = t2.x - A * o2Utm.x;

		var C = (t2.y - t1.y) / (o2Utm.y - o1Utm.y);
		var D = t1.y - C * o1Utm.y;
		var D1 = t2.y - C * o2Utm.y;
		var param2UTM = {A:A,B:B,C:C,D:D};

		var o1Utm = this.toUTMPattern(o1.x,o1.y);
		var o2Utm = this.toUTMPattern(o2.x,o2.y);
		//A Ox + B = tx
		//C oy + D = ty
		var A = (o2Utm.x - o1Utm.x) / (t2.x - t1.x);
		var B = o1Utm.x - A * t1.x;

		var C = (o2Utm.y - o1Utm.y) / (t2.y - t1.y);
		var D =  o1Utm.y - C * t1.y;
		var param2OCN = {A:A,B:B,C:C,D:D};
		return {param2UTM:param2UTM,param2OCN:param2OCN};
	};

	//计算参数
	this.caculatParamFromWGS84CP = function(o1,o2,w1,w2){
		var o1Utm = this.toUTMPattern(o1.x,o1.y);
		var o2Utm = this.toUTMPattern(o2.x,o2.y);

		
		var t1 = this.LatLonToUTMXY(this.DegToRad (w1.y),this.DegToRad (w1.x));
		var t2 = this.LatLonToUTMXY(this.DegToRad (w2.y),this.DegToRad (w2.x));
		//A Ox + B = tx
		//C oy + D = ty
		var A = (t2.x - t1.x) / (o2Utm.x - o1Utm.x);
		var B = t1.x - A * o1Utm.x;
		

		var C = (t2.y - t1.y) / (o2Utm.y - o1Utm.y);
		var D = t1.y - C * o1Utm.y;
		var param2UTM = {A:A,B:B,C:C,D:D};

		var o1Utm = this.toUTMPattern(o1.x,o1.y);
		var o2Utm = this.toUTMPattern(o2.x,o2.y);

		//A Ox + B = tx
		//C oy + D = ty
		var A = (o2Utm.x - o1Utm.x) / (t2.x - t1.x);
		var B = o1Utm.x - A * t1.x;

		var C = (o2Utm.y - o1Utm.y) / (t2.y - t1.y);
		var D =  o1Utm.y - C * t1.y;
		var param2OCN = {A:A,B:B,C:C,D:D};
		return {param2UTM:param2UTM,param2OCN:param2OCN};
	};

	this.param2UTM = {
		A : 0.37774826565013436,
		B : -507.34927261358825,
		C : 0.37708212724898393,
		D : 7.471885571721941
	};

	this.param2OCN = {
		A : 2.6472656288147918,
		B : 1343.0882911941735,
		C : 2.65194218377714,
		D : -19.81500853970647
	};
	
	//动态设置参数
	this.setParams = function(x,y,type) {
		var dis1,dis2;
		dis1 = dis2 = Number.MAX_VALUE;
		var cp1,cp2;
		cp1 = cp2 = null;
		for(var i=0;i<this.cps.length;i++) {
			var cp = this.cps[i];
			var pt = cp[type];
			var dis = Math.sqrt((pt.x - x)*(pt.x - x) + (pt.y - y)*(pt.y - y));
			if(dis < dis1) {
				if(dis1 < dis2) {
					dis2 = dis1;
					cp2 = cp1;
				}
				
				dis1 = dis;
				cp1 = cp;
				
			}else if(dis < dis2) {
				dis2 = dis;
				cp2 = cp;
			}
		}

		if(cp1 == null || cp2 == null) {
			alert('无法获取最近两个控制点！');
			return;
		}

		var param = this.caculatParamFromWGS84CP(cp1.sp,cp2.sp,cp1.tp,cp2.tp);
		this.param2UTM = param.param2UTM;
		this.param2OCN = param.param2OCN;
	};

	this.setControlPoints = function(ctrls) {
		this.cps = ctrls;
	};

	this.toUTMPattern = function(x, y) {
		var y1 = y;
		if(Math.abs(this.overlook) > 0.00001) {
			y1 = y / Math.sin(this.overlook);
		}
		var x1 = Math.cos(this.rotate) * x - Math.sin(this.rotate) * y1;
			
		y1 = Math.cos(this.rotate) * y1 + Math.sin(this.rotate) * x;
		return {
			x : x1,
			y : y1
		};
	};

	this.toOcnPattern = function(x, y) {
		var x1 = Math.cos(-this.rotate) * x - Math.sin(-this.rotate) * y;

		var y1 = Math.cos(-this.rotate) * y + Math.sin(-this.rotate) * x;
		
		if(Math.abs(this.overlook) > 0.00001) {
			y1 = y1 * Math.sin(this.overlook);
		}
		return {
			x : x1,
			y : y1
		};
	};
	
	this.OCN2WGS84 = function(ox,oy) {
		this.setParams(ox,oy,'sp');

		var utm = this.OCN2UTM(ox, oy);
		var wgs84 = this.UTMXYToLatLon(utm.x,utm.y);
		return wgs84;
	};
	
	this.WGS842OCN = function(x,y) {
		this.setParams(x,y,'tp');
		var utm = this.LatLonToUTMXY(this.DegToRad (y),this.DegToRad (x));
		var ocn = this.UTM2OCN(utm.x,utm.y);
		return ocn;
	};
	
	this.OCN2UTM = function(ox,oy) {
		this.setParams(ox,oy,'sp');

		var A = this.param2UTM.A;
		var B = this.param2UTM.B;
		var C = this.param2UTM.C;
		var D = this.param2UTM.D;
		//旋转成标准的
		var o1Utm = this.toUTMPattern(ox,oy);
		//o1Utm.y = -1 * o1Utm.y;
		var xx = A * o1Utm.x + B;
		var yy = C * o1Utm.y + D;
		return {x:xx,y:yy};
	};

	this.UTM2OCN = function(ux,uy) {

		var A = this.param2OCN.A;
		var B = this.param2OCN.B;
		var C = this.param2OCN.C;
		var D = this.param2OCN.D;
		
		
		var outmx = A * ux + B;
		var outmy = C * uy + D;
		//outmy = -1 * outmy;
		var ocn = this.toOcnPattern(outmx,outmy);
		return ocn;
	};
	
	//UTM 《-》 WGS84 

	
	this.sm_a = 6378137.0;
	this.sm_b = 6356752.314;
	this.sm_EccSquared = 6.69437999013e-03;
	this.UTMScaleFactor = 0.9996;

	this.DegToRad = function(deg) {
		return (deg / 180.0 * this.pi);
	};

	this.RadToDeg = function(rad) {
		return (rad / this.pi * 180.0);
	};

	this.ArcLengthOfMeridian = function(phi) {
		var alpha, beta, gamma, delta, epsilon, n;
		var result;

		/* Precalculate n */
		n = (this.sm_a - this.sm_b) / (this.sm_a + this.sm_b);

		/* Precalculate alpha */
		alpha = ((this.sm_a + this.sm_b) / 2.0)
				* (1.0 + (Math.pow(n, 2.0) / 4.0) + (Math.pow(n, 4.0) / 64.0));

		/* Precalculate beta */
		beta = (-3.0 * n / 2.0) + (9.0 * Math.pow(n, 3.0) / 16.0)
				+ (-3.0 * Math.pow(n, 5.0) / 32.0);

		/* Precalculate gamma */
		gamma = (15.0 * Math.pow(n, 2.0) / 16.0)
				+ (-15.0 * Math.pow(n, 4.0) / 32.0);

		/* Precalculate delta */
		delta = (-35.0 * Math.pow(n, 3.0) / 48.0)
				+ (105.0 * Math.pow(n, 5.0) / 256.0);

		/* Precalculate epsilon */
		epsilon = (315.0 * Math.pow(n, 4.0) / 512.0);

		/* Now calculate the sum of the series and return */
		result = alpha
				* (phi + (beta * Math.sin(2.0 * phi))
						+ (gamma * Math.sin(4.0 * phi))
						+ (delta * Math.sin(6.0 * phi)) + (epsilon * Math
						.sin(8.0 * phi)));

		return result;
	}

	this.UTMCentralMeridian = function(zone) {
		var cmeridian;

		cmeridian = this.DegToRad(-183.0 + (zone * 6.0));

		return cmeridian;
	}

	this.FootpointLatitude = function(y) {
		var y_, alpha_, beta_, gamma_, delta_, epsilon_, n;
		var result;

		/* Precalculate n (Eq. 10.18) */
		n = (this.sm_a - this.sm_b) / (this.sm_a + this.sm_b);

		/* Precalculate alpha_ (Eq. 10.22) */
		/* (Same as alpha in Eq. 10.17) */
		alpha_ = ((this.sm_a + this.sm_b) / 2.0)
				* (1 + (Math.pow(n, 2.0) / 4) + (Math.pow(n, 4.0) / 64));

		/* Precalculate y_ (Eq. 10.23) */
		y_ = y / alpha_;

		/* Precalculate beta_ (Eq. 10.22) */
		beta_ = (3.0 * n / 2.0) + (-27.0 * Math.pow(n, 3.0) / 32.0)
				+ (269.0 * Math.pow(n, 5.0) / 512.0);

		/* Precalculate gamma_ (Eq. 10.22) */
		gamma_ = (21.0 * Math.pow(n, 2.0) / 16.0)
				+ (-55.0 * Math.pow(n, 4.0) / 32.0);

		/* Precalculate delta_ (Eq. 10.22) */
		delta_ = (151.0 * Math.pow(n, 3.0) / 96.0)
				+ (-417.0 * Math.pow(n, 5.0) / 128.0);

		/* Precalculate epsilon_ (Eq. 10.22) */
		epsilon_ = (1097.0 * Math.pow(n, 4.0) / 512.0);

		/* Now calculate the sum of the series (Eq. 10.21) */
		result = y_ + (beta_ * Math.sin(2.0 * y_))
				+ (gamma_ * Math.sin(4.0 * y_)) + (delta_ * Math.sin(6.0 * y_))
				+ (epsilon_ * Math.sin(8.0 * y_));

		return result;
	}

	 this.MapLatLonToXY = function(phi, lambda, lambda0, xy) {
		var N, nu2, ep2, t, t2, l;
		var l3coef, l4coef, l5coef, l6coef, l7coef, l8coef;
		var tmp;

		/* Precalculate ep2 */
		ep2 = (Math.pow(this.sm_a, 2.0) - Math.pow(this.sm_b, 2.0)) / Math.pow(this.sm_b, 2.0);

		/* Precalculate nu2 */
		nu2 = ep2 * Math.pow(Math.cos(phi), 2.0);

		/* Precalculate N */
		N = Math.pow(this.sm_a, 2.0) / (this.sm_b * Math.sqrt(1 + nu2));

		/* Precalculate t */
		t = Math.tan(phi);
		t2 = t * t;
		tmp = (t2 * t2 * t2) - Math.pow(t, 6.0);

		/* Precalculate l */
		l = lambda - lambda0;

		/* Precalculate coefficients for l**n in the equations below
		   so a normal human being can read the expressions for easting
		   and northing
		   -- l**1 and l**2 have coefficients of 1.0 */
		l3coef = 1.0 - t2 + nu2;

		l4coef = 5.0 - t2 + 9 * nu2 + 4.0 * (nu2 * nu2);

		l5coef = 5.0 - 18.0 * t2 + (t2 * t2) + 14.0 * nu2 - 58.0 * t2 * nu2;

		l6coef = 61.0 - 58.0 * t2 + (t2 * t2) + 270.0 * nu2 - 330.0 * t2 * nu2;

		l7coef = 61.0 - 479.0 * t2 + 179.0 * (t2 * t2) - (t2 * t2 * t2);

		l8coef = 1385.0 - 3111.0 * t2 + 543.0 * (t2 * t2) - (t2 * t2 * t2);

		/* Calculate easting (x) */
		xy[0] = N
				* Math.cos(phi)
				* l
				+ (N / 6.0 * Math.pow(Math.cos(phi), 3.0) * l3coef * Math.pow(
						l, 3.0))
				+ (N / 120.0 * Math.pow(Math.cos(phi), 5.0) * l5coef * Math
						.pow(l, 5.0))
				+ (N / 5040.0 * Math.pow(Math.cos(phi), 7.0) * l7coef * Math
						.pow(l, 7.0));

		/* Calculate northing (y) */
		xy[1] = this.ArcLengthOfMeridian(phi)
				+ (t / 2.0 * N * Math.pow(Math.cos(phi), 2.0) * Math
						.pow(l, 2.0))
				+ (t / 24.0 * N * Math.pow(Math.cos(phi), 4.0) * l4coef * Math
						.pow(l, 4.0))
				+ (t / 720.0 * N * Math.pow(Math.cos(phi), 6.0) * l6coef * Math
						.pow(l, 6.0))
				+ (t / 40320.0 * N * Math.pow(Math.cos(phi), 8.0) * l8coef * Math
						.pow(l, 8.0));

		return;
	}

	this.MapXYToLatLon = function(x, y, lambda0, philambda) {
		var phif, Nf, Nfpow, nuf2, ep2, tf, tf2, tf4, cf;
		var x1frac, x2frac, x3frac, x4frac, x5frac, x6frac, x7frac, x8frac;
		var x2poly, x3poly, x4poly, x5poly, x6poly, x7poly, x8poly;

		/* Get the value of phif, the footpoint latitude. */
		phif = this.FootpointLatitude(y);

		/* Precalculate ep2 */
		ep2 = (Math.pow(this.sm_a, 2.0) - Math.pow(this.sm_b, 2.0)) / Math.pow(this.sm_b, 2.0);

		/* Precalculate cos (phif) */
		cf = Math.cos(phif);

		/* Precalculate nuf2 */
		nuf2 = ep2 * Math.pow(cf, 2.0);

		/* Precalculate Nf and initialize Nfpow */
		Nf = Math.pow(this.sm_a, 2.0) / (this.sm_b * Math.sqrt(1 + nuf2));
		Nfpow = Nf;

		/* Precalculate tf */
		tf = Math.tan(phif);
		tf2 = tf * tf;
		tf4 = tf2 * tf2;

		/* Precalculate fractional coefficients for x**n in the equations
		   below to simplify the expressions for latitude and longitude. */
		x1frac = 1.0 / (Nfpow * cf);

		Nfpow *= Nf; /* now equals Nf**2) */
		x2frac = tf / (2.0 * Nfpow);

		Nfpow *= Nf; /* now equals Nf**3) */
		x3frac = 1.0 / (6.0 * Nfpow * cf);

		Nfpow *= Nf; /* now equals Nf**4) */
		x4frac = tf / (24.0 * Nfpow);

		Nfpow *= Nf; /* now equals Nf**5) */
		x5frac = 1.0 / (120.0 * Nfpow * cf);

		Nfpow *= Nf; /* now equals Nf**6) */
		x6frac = tf / (720.0 * Nfpow);

		Nfpow *= Nf; /* now equals Nf**7) */
		x7frac = 1.0 / (5040.0 * Nfpow * cf);

		Nfpow *= Nf; /* now equals Nf**8) */
		x8frac = tf / (40320.0 * Nfpow);

		/* Precalculate polynomial coefficients for x**n.
		   -- x**1 does not have a polynomial coefficient. */
		x2poly = -1.0 - nuf2;

		x3poly = -1.0 - 2 * tf2 - nuf2;

		x4poly = 5.0 + 3.0 * tf2 + 6.0 * nuf2 - 6.0 * tf2 * nuf2 - 3.0
				* (nuf2 * nuf2) - 9.0 * tf2 * (nuf2 * nuf2);

		x5poly = 5.0 + 28.0 * tf2 + 24.0 * tf4 + 6.0 * nuf2 + 8.0 * tf2 * nuf2;

		x6poly = -61.0 - 90.0 * tf2 - 45.0 * tf4 - 107.0 * nuf2 + 162.0 * tf2
				* nuf2;

		x7poly = -61.0 - 662.0 * tf2 - 1320.0 * tf4 - 720.0 * (tf4 * tf2);

		x8poly = 1385.0 + 3633.0 * tf2 + 4095.0 * tf4 + 1575 * (tf4 * tf2);

		/* Calculate latitude */
		philambda[0] = phif + x2frac * x2poly * (x * x) + x4frac * x4poly
				* Math.pow(x, 4.0) + x6frac * x6poly * Math.pow(x, 6.0)
				+ x8frac * x8poly * Math.pow(x, 8.0);

		/* Calculate longitude */
		philambda[1] = lambda0 + x1frac * x + x3frac * x3poly
				* Math.pow(x, 3.0) + x5frac * x5poly * Math.pow(x, 5.0)
				+ x7frac * x7poly * Math.pow(x, 7.0);

		return;
	}

	this.LatLonToUTMXY = function(lat, lon) {
		var xy = new Array(2);
		this.MapLatLonToXY(lat, lon, this.UTMCentralMeridian(this.zone), xy);
		
		/* Adjust easting and northing for UTM system. */
		xy[0] = xy[0] * this.UTMScaleFactor + 500000.0;
		xy[1] = xy[1] * this.UTMScaleFactor;
		if (xy[1] < 0.0)
			xy[1] = xy[1] + 10000000.0;

		return {
			x : xy[0],
			y : xy[1]
		};
	};

	this.UTMXYToLatLon = function(x, y, zone, southhemi) {
		southhemi = southhemi || false;
		zone = zone || this.zone;
		var latlon = new Array(2);
		var cmeridian;

		x -= 500000.0;
		x /= this.UTMScaleFactor;

		if (southhemi)
			y -= 10000000.0;

		y /= this.UTMScaleFactor;

		cmeridian = this.UTMCentralMeridian(zone);
		this.MapXYToLatLon(x, y, cmeridian, latlon);
		var lon = this.RadToDeg(latlon[1]);
		var lat = this.RadToDeg(latlon[0]);
		return {
			x : lon,
			y : lat
		};
	};
	//84转百度
    this.wgs84tobd09 = function(lng, lat) {
            var gcj02 = wgs84togcj02(lng, lat);
            return gcj02tobd09(gcj02.x, gcj02.y);
        }
        //百度转84
    this.bd09towgs84 = function(lng, lat) {
        var gcj02 = bd09togcj02(lng, lat);
        return gcj02towgs84(gcj02.x, gcj02.y);
    }


    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lon
     * @param bd_lat
     * @returns {*[]}
     */
    function bd09togcj02(bd_lon, bd_lat) {
        var x = bd_lon - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return {
            x: gg_lng,
            y: gg_lat
        };
    }

    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    function gcj02tobd09(lng, lat) {
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return {
            x: gg_lng,
            y: gg_lat
        };
    }

    /**
     * WGS84转GCj02
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    function wgs84togcj02(lng, lat) {
        if (out_of_china(lng, lat)) {
            return {
                x: lng,
                y: lat
            };
        } else {
            var dlat = transformlat(lng - 105.0, lat - 35.0);
            var dlng = transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * Math.PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * Math.PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * Math.PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return {
                x: mglng,
                y: mglat
            };
        }
    }

    /**
     * GCJ02 转换为 WGS84
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    function gcj02towgs84(lng, lat) {
        if (out_of_china(lng, lat)) {
            return {
                x: lng,
                y: lat
            };
        } else {
            var dlat = transformlat(lng - 105.0, lat - 35.0);
            var dlng = transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * Math.PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * Math.PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * Math.PI);
            mglat = lat + dlat;
            mglng = lng + dlng;
            return {
                x: lng * 2 - mglng,
                y: lat * 2 - mglat
            };
        }
    }

    function transformlat(lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * Math.PI) + 40.0 * Math.sin(lat / 3.0 * Math.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * Math.PI) + 320 * Math.sin(lat * Math.PI / 30.0)) * 2.0 / 3.0;
        return ret
    }

    function transformlng(lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * Math.PI) + 40.0 * Math.sin(lng / 3.0 * Math.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * Math.PI) + 300.0 * Math.sin(lng / 30.0 * Math.PI)) * 2.0 / 3.0;
        return ret
    }

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    function out_of_china(lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    }
};
