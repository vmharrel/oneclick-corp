(function (kinnek) {
	var Ktrack = function (){
		this.visitDict = {};
		this.ktrackSession = _ktrackSession;
		this.user = _ktrackUser;
		this.unlocked = true;
		this.debug = function(output){
			if (typeof _ktrackDebug !== 'undefined' && _ktrackDebug)
				console.log(output);
		};
		this.set = function (params){
			var self = this;
			if (typeof params !== 'undefined' && this.unlocked){
				for (var key in params) {
					if (params.hasOwnProperty(key)) {
						this.visitDict[key] = params[key];
					}
				}
			}
			// this.debug(self.visitDict);
		};
		this.reset = function(){
			this.visitDict = {};
			this.unlocked = true;
		};
		this.push = function (visitTypeCode,tagString, visitDict,callbackFunction){
			var self = this;
			if (window.kinnek.user_authenticated && !window.kinnek.preventTracking){
				if (this.unlocked){
					var jsDate = new Date();
					var clientDate = jsDate.getFullYear() + '-' + (jsDate.getMonth() + 1) + '-' + jsDate.getDate() + ' ' + jsDate.getHours() + ':' + jsDate.getMinutes() + ':' + jsDate.getSeconds();
					if (typeof $ == 'undefined'){
						self.debug("ERROR: JQUERY not found!");
					} else if (typeof JSON == 'undefined'){
						self.debug("ERROR: JSON not found!");
					} else if (typeof this.ktrackSession == 'undefined' || this.ktrackSession == null){
						self.debug("ERROR: no ktrack session variable");
					} else {
						if (typeof visitDict !== 'undefined')
							this.set(visitDict);
						if (typeof tagString !== 'undefined' && typeof visitTypeCode !== 'undefined'){
							var postData = {
								tagString: this.user + " " + tagString, 
								visitTypeCode: visitTypeCode, 
								useUrl: encodeURIComponent(window.location.pathname + location.search + window.location.hash),
								ktrackSession: this.ktrackSession,
								visitDict: JSON.stringify(this.visitDict),
								clientDate: clientDate,
				 	 		};
				 	 		if (visitTypeCode == "QUOTE_FOLLOWUP" || visitTypeCode == "SENT_MESSAGE")
				 	 			postData.sendEmail = 1;
				 	 		self.debug("submitting: ");
				 	 		self.debug(postData);
				 	 		$.post('/post/record_page_visit/', postData, function(returnData){
								var data = $.parseJSON(returnData);
								if (typeof data !== 'undefined' && data !== null && typeof data.success !== 'undefined' && data.success){
									//reset visitDict
									self.visitDict = {};
								} else {
									self.debug("ERROR: PVR AJAX Failed!");
								}
								if (typeof callbackFunction !== 'undefined'){
									callbackFunction(data);
								}
							});
						}
					}
				} else {
					self.debug("locked while attempting to push: "+ visitTypeCode);
				}
			} else {
				// user not logged in. can't track
			}
	 	};
	 	this.page = function(code, param1, param2){
	 		if (typeof window.analytics !== 'undefined'){
		 		if (typeof param1 == "string" && typeof param2 == "object"){
		 			window.analytics.page(code,param1,param2);
		 		} else if (typeof param1 == "object"){
		 			window.analytics.page(code,param1);
		 		}
		 	}
	 	};
	 	this.track = function(code, properties){
	 		if (typeof code == "string" && typeof window.analytics !== 'undefined' && typeof window.analytics.track == "function"){
		 		if (typeof properties == "undefined")
		 				properties = {};
		 		if (!properties.hasOwnProperty('url'))
		 			properties.url = window.location.href;
		 		window.analytics.track(code,properties);
		 	}
	 	}
	}
	kinnek.ktrack = new Ktrack();
})( window.kinnek = window.kinnek || {})
