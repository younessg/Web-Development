var Roll = {
	firstRoll: 0,
	secondRoll: 0,
	total: 0,
	
	setFirstRoll : function(value)
	{
		this.firstRoll = value;
	},
	
	setSecondRoll : function(value)
	{
		this.secondRoll = value;
	},
	
	getFirstRoll : function()
	{
		return this.firstRoll;
	},
	
	getSecondRoll : function()
	{
		return this.secondRoll;
	},
	
	setTotal : function(value){
		this.total = value;
	},
	
	getTotal : function(){
		return parseInt(this.firstRoll) + parseInt(this.secondRoll);
	}
}