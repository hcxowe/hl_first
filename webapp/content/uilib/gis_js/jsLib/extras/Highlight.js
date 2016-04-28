/**
 * 
 */



dojo.provide("extras.Highlight");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare("extras.Highlight",[dijit._Widget, dijit._Templated],{
	map: null,
	mode: "off",
	coords: null,
	screenCoords: null,
	_frameIndex: 0,
	_framesAdvancing: true,
	_interval: null,
	templateString: "<div class='highlight'></div>",
	constructor:function(params)
	{
		var folderUrl = selfUrl+"/themes/default/images/highlight/";
		this.animationFrameUrls = [
			"url(" + folderUrl + "glow000.png)",
			"url(" + folderUrl + "glow010.png)",
			"url(" + folderUrl + "glow020.png)",
			"url(" + folderUrl + "glow030.png)",
			"url(" + folderUrl + "glow040.png)",
			"url(" + folderUrl + "glow050.png)",
			"url(" + folderUrl + "glow060.png)",
			"url(" + folderUrl + "glow070.png)",
			"url(" + folderUrl + "glow080.png)",
			"url(" + folderUrl + "glow090.png)",
			"url(" + folderUrl + "glow100.png)"
		];
		// for IE
		this.ringImageUrl = "url(" + folderUrl + "ring.png)";
	},
	postCreate: function() {
		if (this.map) {
			dojo.connect(this.map, "onExtentChange", this, "extentChangeHandler");
			dojo.connect(this.map, "onPan", this, "panHandler");
		}
		
		// Preload animation images
		if (!dojo.isIE) {
			dojo.style(this.domNode, "visibility", "hidden");
			this.setMode("flashing");
			setTimeout(dojo.hitch(this, function() {
				this.setMode("off");
				dojo.style(this.domNode, "visibility", "visible");
			}), 1000);
		}
	},
	setCoords: function(/*esri.geometry.Point*/ mapPoint) {
		if (mapPoint) {
			this.coords = mapPoint;
			this.screenCoords = this.map.toScreen(mapPoint);
			this._locate(this.screenCoords);
		}
	},
	extentChangeHandler: function(extent, delta, levelChange, lod) {
		if (this.coords) {
			this.screenCoords = this.map.toScreen(this.coords);
		}
		this._locate(this.screenCoords);
	},
	panHandler: function(extent, delta) {
		if (this.screenCoords) {
			var sp = new esri.geometry.Point();
			sp.x = this.screenCoords.x + delta.x;
			sp.y = this.screenCoords.y + delta.y;
		}
		this._locate(sp);
	},
	_locate: function(/*esri.geometry.Point*/ loc) {
		if (loc) {
			dojo.style(this.domNode, {top: loc.y + "px", left: loc.x + "px"});
		}
	},
	setMode: function(/*String*/ mode) {
		mode = mode.toLowerCase();
		if (mode && mode !== this.mode) {
			if (this.interval) {
				clearInterval(this.interval);
				this.interval = null;
			}
			
			if (mode === "flashing") {
				//if (dojo.isIE) {
					//dojo.style(this.domNode, "backgroundImage", this.ringImageUrl);
				//}
				//else {
					this._frameIndex = 0;
					this.interval = setInterval(dojo.hitch(this, "advanceFrame"), 100);
					this.updateAnimation();
				//}
				this.mode = mode;
			}
			else {
				dojo.style(this.domNode, "backgroundImage", "");
				this.mode = "off"
			}
		}
	},
	advanceFrame: function() {
		try {
			if (this._framesAdvancing) {
				if (this._frameIndex < this.animationFrameUrls.length -1) {
					this._frameIndex++;
				}
				else {
					this._framesAdvancing = false;
				}
			}
			else {
				if (this._frameIndex > 0) {
					this._frameIndex--;
				}
				else {
					this._framesAdvancing = true;
				}
			}
			this.updateAnimation();
		}
		catch (err) {
			console.error("Error advancing highlight animation", err);
		}
	},
	
	updateAnimation: function() {
		dojo.style(this.domNode, "backgroundImage", this.animationFrameUrls[this._frameIndex]);
	}
});