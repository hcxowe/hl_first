/**
 * 地图信息显示框
 */
dojo.provide("AG.MicMap.gis.widget.InfoWindow");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._Container");
dojo.declare("AG.MicMap.gis.widget.InfoWindow", [dijit._Widget, dijit._Templated, dijit._Container], {
    isContainer: true,
	//templatePath: dojo.moduleUrl("AG.MicMap", "gis/widget/templates/InfoWindow.html"),
    templateString: '<div id="${id}.infowindow" class="infowindow" dojoAttachPoint="_infowindow"><div style="position: absolute; left: -16px; top: 0;" dojoAttachPoint="_tipHandler"><img width="23" height="26" src="themes/default/img/infowindow/images/tip.png"></div><table class="table" border="0" cellpadding="0" cellspacing="0"><tr><td class="leftTop">&nbsp;</td><td class="centerTop" valign="bottom" align="bottom"><b dojoAttachPoint="_title" style="vertical-align:bottom">${title}</b></td><td class="centerTop" valign="bottom" align="right"><img style="vertical-align:bottom;cursor:pointer;" title="\u5173\u95ed" dojoattachevent="onclick:hideWindow" width="17" height="16" src="themes/default/img/infowindow/infoclose.png"></td><td class="rightTop">&nbsp;</td></tr><tr><td class="leftCenter">&nbsp;</td><td colspan="2" class="centerCenter" dojoAttachPoint="_content">&nbsp;</td><td class="rightCenter">&nbsp;</td></tr><tr><td class="leftBottom">&nbsp;</td><td colspan="2" class="centerBottom">&nbsp;</td><td class="rightBottom">&nbsp;</td></tr></table></div>',
    lonlat: null,
    isbindMap: false,
	id:null,
	feature : null,
    title: "信息显示",
    startup: function(){
//		this._gisObject = objgis;
        this.hide();
		this._infoOnresizeHandler = dojo.connect(this._infowindow,'onresize',this,function(){
			if(!this.lonlat){
				return;
			}
			var g = this._map.getViewPortPxFromLonLat(this.lonlat);
			dojo.style(this._tipHandler,{
				top : (dojo.coords(this._infowindow).h / 2 - 20) + 'px'
			})
			dojo.style(this._infowindow,{
				left : (g.x + 17) + 'px',
				top : (g.y - dojo.coords(this._infowindow).h / 2 + 9) + 'px'
			})
		})
    },
    show: function(lonlat){
		this.bindMap(this._map);
//		var lonlat = new AG.MicMap.LonLat(parseFloat(lon),parseFloat(lat));
		this.lonlat = lonlat;
		if(!this.lonlat){
			return;
		}
		var g = this._map.getViewPortPxFromLonLat(lonlat);
		dojo.style(this.domNode,'display','')
		if(dojo.coords(this._infowindow).h != 0){
			dojo.style(this._tipHandler,{
				top : (dojo.coords(this._infowindow).h / 2 - 20)+ 'px'
			})
			dojo.style(this._infowindow,{
				left : (g.x + 17) + 'px',
				top : (g.y - dojo.coords(this._infowindow).h / 2 + 9) + 'px'
			})
		}
//        this.isShowing = true;
    },
	isShow : function(){
		return this.domNode.style.display == 'none' ? false : true;
	},
	getHeight : function(){
		return dojo.coords(this._infowindow).h;
	},
	bindMap : function(map){
		if(this.isbindMap){
			return;
		}
		this._map = map;
		map.events.on({
			'flashstart' : this.hide,
			'move' : this.showInfoWindow,
			'moveend' : this.showInfoWindow,
			scope : this
		})
		this.isbindMap = true;
	},
	unBindMap : function(){
		if(this._map && this.isbindMap){
			this._map.events.un({
				'flashstart' : this.hide,
				'move' : this.showInfoWindow,
				'moveend' : this.showInfoWindow,
				scope : this
			})
		}
		this.isbindMap = false;
	},
	showInfoWindow : function(){
		this.show(this.lonlat);
	},
    hide: function(){
		dojo.style(this.domNode,'display','none')
//        this.isShowing = false;
//		this.setContent('');
//		this.unBindMap();
    },
	hideWindow : function(){
		this.hide();
		this.setContent('');
		this.unBindMap();
	},
    showContent: function(){
		dojo.style(this._content,'display','')
		dojo.style(this._border,'display','')
        this.isContentShowing = true;
    },
    move: function(_815){
        dojo.style(this._infowindow, {
            left: _815.x + "px",
            top: _815.y + "px"
        });
    },
    setTitle: function(title){
        this._title.innerHTML = title;
    },
	setId:function(_id){
		this.id = _id;
	},
    setContent: function(content){
        if (dojo.isString(content)) {
            this._content.innerHTML = content;
        }
        else {
            dojox.xml.parser.replaceChildren(this._content, content);
        }
    },
	setFeature: function(f){
		this.feature = f;
	},
    onShow: function(){
    },
    onHide: function(){
    },
	destroy : function(){
		if(this._infoOnresizeHandler){
			dojo.disconnect(this._infoOnresizeHandler)
		}
		this.hideWindow();
		this.domNode.parentNode.removeChild(this.domNode);
	}
});