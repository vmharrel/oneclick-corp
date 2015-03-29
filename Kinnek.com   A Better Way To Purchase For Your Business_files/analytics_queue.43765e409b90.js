function AnalyticsQueue (){
	this.queue = [];
	this.index = 0;
	this.done = true;
}
AnalyticsQueue.prototype={
	constructor: AnalyticsQueue,
	add: function(item){
		this.queue.push(item);
	},
	release: function(){
		this.index = 0;
		if (this.queue.length > 0){
			this.done = false;
			this.step();
		}
	},
	nextStep:function(){
		this.index += 1;
		if (this.queue.length >= this.index + 1){
			this.step()
		} else {
			this.done = true;
			if (typeof jQuery !== 'undefined')
				$(window).trigger("kinnek.analytics.done");
		}
	},
	step:function(){
		var self = this;
		var currentQueueItem = this.queue[this.index];
		// console.log("analytics STEP " + this.index + " - " + currentQueueItem[0]);
		if (typeof currentQueueItem[0] !== 'undefined'){
			switch (currentQueueItem[0]){
				case "identify": 
					window.analytics.identify(currentQueueItem[1],currentQueueItem[2] || {}, function(data){
						self.nextStep();
					});
					break;
				case "page": 
					window.analytics.page(currentQueueItem[1],currentQueueItem[2] || {}, currentQueueItem[3] || {}, function(data){
						self.nextStep();
					});
					break;
				case "track": 
					window.analytics.track(currentQueueItem[1],currentQueueItem[2] || {}, function(data){
						self.nextStep();
					});
					break;
				default: 
					console.log("invalid action" + currentQueueItem[0]);
			}
		}
	}
}