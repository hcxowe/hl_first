/**
 * 地图工具类
 */

dojo.provide("extras.utils.MapUtil");

dojo.declare("extras.utils.MapUtil",null,{
	constructor:function()
	{
		
	},
	getMouseEvent: function(o, areaItemState,overfunction, outfunction){
		if(dojo.isIE){
			o.onmouseenter = function(){
				if (overfunction) {
                    overfunction();
                }
			}
			o.onmouseleave = function(){
				if (outfunction) {
                    outfunction();
                }
			}
		}else{
			var ing = false;
	        o.onmouseover = function(){
	            if (!ing) {
	                ing = true;
	                if (overfunction) {
	                    overfunction();
	                }
	            }
	        }
	        
	        o.onmouseout = function(){
				var coords = dojo.coords(o);
	            var wc = this, e = window.event || e, x = document.body.scrollLeft + e.clientX, y = document.body.scrollTop + e.clientY;
				var $x = $y = 0;
				do {
					$x += wc.offsetLeft;
					$y += wc.offsetTop;
				} while ((wc = wc.offsetParent) && wc.tagName != "BODY");
				var p = { x : $x, y : $y };
	            if (x <= p.x || x >= (p.x + coords.w) || y <= p.y || y >= (p.y + coords.h)) {
	                ing = false;
	                if (outfunction) {
	                    outfunction();
	                }
	            }
	        };
		}
    },
    getMouseEvents: function(o,overfunction, outfunction){
		if(dojo.isIE){
			o.onmouseenter = function(){
				if (overfunction) {
                    overfunction();
                }
			};
			o.onmouseleave = function(){
				if (outfunction) {
                    outfunction();
                }
			}
		}else{
			var ing = false;
	        o.onmouseover = function(){
	            if (!ing) {
	                ing = true;
	                if (overfunction) {
	                    overfunction();
	                }
	            }
	        }
	        
	        o.onmouseout = function(){
				var coords = dojo.coords(o);
	            var wc = this, e = window.event || e, x = document.body.scrollLeft + e.clientX, y = document.body.scrollTop + e.clientY;
				var $x = $y = 0;
				do {
					$x += wc.offsetLeft;
					$y += wc.offsetTop;
				} while ((wc = wc.offsetParent) && wc.tagName != "BODY");
				var p = { x : $x, y : $y };
	            if (x <= p.x || x >= (p.x + coords.w) || y <= p.y || y >= (p.y + coords.h)) {
	                ing = false;
	                if (outfunction) {
	                    outfunction();
	                }
	            }
	        };
		}
    },
    /**
	 * 模拟滚动条向上滚动
	 * @param {Object} scrollObject	滚动实体
	 */
	scrollObjectUp : function (scrollObject,intervalTime){
		if(!scrollObject){
			return;
		}
		//div高度
		var scrollHeight = this.clearScrollInterval(scrollObject);
		this.scrollUp = window.setInterval(dojo.hitch(this,function(){
			if (this.scrollStep > 0) {
				scrollObject.scrollTop = this.scrollStep - 1;
				this.scrollStep = this.scrollStep - 1;
			}
			else {
				this.clearScrollInterval();
				this.scrollStep = scrollObject.scrollTop;
			}
		}), intervalTime == null ? 10 : parseInt(intervalTime))
	},
	scrollObjectNextUp : function(scrollObject){
		if(!scrollObject){
			return;
		}
		var scrollHeight = this.clearScrollInterval(scrollObject);
		var height = scrollObject.scrollTop - scrollHeight;
		this.scrollStep = scrollObject.scrollTop = height > 0 ? height : 0;
	},
	/**
	 * 模拟滚动条向下滚动
	 * @param {Object} scrollObject	滚动实体
	 */
	scrollObjectDown : function (scrollObject,intervalTime){
		if(!scrollObject){
			return;
		}
		var scrollHeight = this.clearScrollInterval(scrollObject);
		this.scrollDown = window.setInterval(dojo.hitch(this,function(){
			if (this.scrollStep < scrollHeight) {
				scrollObject.scrollTop = this.scrollStep + 1;
				this.scrollStep = this.scrollStep + 1;
			}
			else {
				//window.clearInterval(this.scrollUp);
				//window.clearInterval(this.scrollDown);
				this.scrollStep = scrollObject.scrollTop;
			}
		}), intervalTime == null ? 10 : parseInt(intervalTime));
	},
	scrollObjectNextDown : function(scrollObject){
		if(!scrollObject){
			return;
		}
		var scrollHeight = this.clearScrollInterval(scrollObject);
		var height = scrollObject.scrollTop + scrollHeight;
		this.scrollStep = scrollObject.scrollTop = dojo.coords(scrollObject).h < height ? dojo.coords(scrollObject).h : height;
	},
	/**
	 * 清除滚动计时器
	 */
	clearScrollInterval : function(scrollObject){
		if(this.scrollUp){
			window.clearInterval(this.scrollUp);
			this.scrollUp = null;
		}
		if(this.scrollDown){
			window.clearInterval(this.scrollDown);
			this.scrollDown = null;
		}
		if(scrollObject){
			//div高度
			var height = dojo.coords(scrollObject).h
			var scrollHeight = scrollObject.scrollHeight - height;
			return scrollHeight;
		}
	}
});


dojo.mixin(extras.utils.MapUtil,
  (function() {
    var earthRad = 6378137, // in meters
        PI = 3.14159265358979323846264338327950288,
        degPerRad = 57.295779513082320,
        radPerDeg =  0.017453292519943,
        //webMercatorSR = new esri.SpatialReference({ wkid:102100 }),
        //geographicSR = new esri.SpatialReference({ wkid:4326 }),
        floor = Math.floor,
        log = Math.log,
        sin = Math.sin,
        exp = Math.exp,
        atan = Math.atan;

    //lon/lat to web mercator conversion
    function radToDeg(rad) {
      return rad * degPerRad;
    }

    function degToRad(deg) {
      return deg * radPerDeg;
    }

    function lngLatToXY(lng, lat) {
      var lat_rad = degToRad(lat);
      return [degToRad(lng) * earthRad, earthRad/2.0 * log( (1.0 + sin(lat_rad)) / (1.0 - sin(lat_rad)) )];
    }
    
    function xyToLngLat(x, y, isLinear) {
      var lng_deg = radToDeg(x / earthRad);

      if (isLinear){
        return [lng_deg, radToDeg((PI / 2) - (2 * atan(exp(-1.0 * y / earthRad))))];
      }
      return [lng_deg - (floor((lng_deg + 180) / 360) * 360), radToDeg((PI / 2) - (2 * atan(exp(-1.0 * y / earthRad))))];
    }
    
    function convert(geom, func, sr, isLinear) {
      if (geom instanceof esri.geometry.Point) {
        var pt = func(geom.x, geom.y, isLinear);
        return new esri.geometry.Point(pt[0], pt[1], new esri.SpatialReference(sr));
      }
      else if (geom instanceof esri.geometry.Extent) {
        var min = func(geom.xmin, geom.ymin, isLinear),
            max = func(geom.xmax, geom.ymax, isLinear);
        return new esri.geometry.Extent(min[0], min[1], max[0], max[1], new esri.SpatialReference(sr));
      }
      else if (geom instanceof esri.geometry.Polyline || geom instanceof esri.geometry.Polygon) {
        var isPline = geom instanceof esri.geometry.Polyline,
            iRings = isPline ? geom.paths : geom.rings,
            oRings = [], oRing;

        dojo.forEach(iRings, function(iRing) {
          oRings.push(oRing = []);
          dojo.forEach(iRing, function(iPt) {
            oRing.push(func(iPt[0], iPt[1], isLinear));
          });
        });
        
        if (isPline) {
          return new esri.geometry.Polyline({ paths:oRings, spatialReference:sr });
        }
        else {
          return new esri.geometry.Polygon({ rings:oRings, spatialReference:sr });
        }
      }
      else if (geom instanceof esri.geometry.Multipoint) {
        var oPts = [];
        dojo.forEach(geom.points, function(iPt) {
          oPts.push(func(iPt[0], iPt[1], isLinear));
        });
        return new esri.geometry.Multipoint({ points:oPts, spatialReference:sr });
      }
    }

    //for scale calculation
    var inchesPerMeter = 39.37,
        decDegToMeters = 20015077.0 / 180.0,
        ecd = esri.config.defaults,
        lookup = esri.WKIDUnitConversion;

    return {
      //xyToLngLat, geographicSR
      geographicToWebMercator: function(geom) {
        return convert(geom, lngLatToXY, { wkid:102100 });
      },
      
      //lngLatToXY, webMercatorSR
      webMercatorToGeographic: function(geom, isLinear) {
        return convert(geom, xyToLngLat, { wkid:4326 }, isLinear);
      },

      //scale calculation
      getScale: function(map) {
        var extent, width, wkid, wkt;
        
        if (arguments.length > 1) { // backward compatibility for method signature
          extent = arguments[0];
          width = arguments[1];
          wkid = arguments[2];
        }
        else {
          extent = map.extent;
          width = map.width;
          
          var sr = map.spatialReference;
          if (sr) {
            wkid = sr.wkid;
            wkt = sr.wkt;
          }
        }
        
        var unitValue;
        
        if (wkid) {
          unitValue = lookup.values[lookup[wkid]];
        }
        else if ( wkt && (wkt.search(/^PROJCS/i) !== -1) ) {
          var result = /UNIT\[([^\]]+)\]\]$/i.exec(wkt);
          if (result && result[1]) {
            unitValue = parseFloat(result[1].split(",")[1]);
          }
        }
        // else assumed to be in degrees
        
        return esri.geometry._getScale(extent, width, unitValue);
      },
      
      _getScale: function(extent, mapWd, unitValue) {
        return (extent.getWidth() / mapWd) * (unitValue || decDegToMeters) * inchesPerMeter * ecd.screenDPI;
      },
      
      getExtentForScale: function(map, scale) {
        var wkid, wkt, sr = map.spatialReference;
        if (sr) {
          wkid = sr.wkid;
          wkt = sr.wkt;
        }

        var unitValue;
        
        if (wkid) {
          unitValue = lookup.values[lookup[wkid]];
        }
        else if ( wkt && (wkt.search(/^PROJCS/i) !== -1) ) {
          var result = /UNIT\[([^\]]+)\]\]$/i.exec(wkt);
          if (result && result[1]) {
            unitValue = parseFloat(result[1].split(",")[1]);
          }
        }
        // else assumed to be in degrees
        
        return esri.geometry._getExtentForScale(map.extent, map.width, unitValue, scale, true);
      },

      _getExtentForScale: function(extent, mapWd, wkid, scale, /*internal*/ wkidIsUnitValue) {
        var unitValue;
        if (wkidIsUnitValue) {
          unitValue = wkid;
        }
        else {
          unitValue = lookup.values[lookup[wkid]];
        }
        
        return extent.expand(((scale * mapWd) / ((unitValue || decDegToMeters) * inchesPerMeter * ecd.screenDPI)) / extent.getWidth());
      }
    };
  }()),{
	
});
