var express = require('express');
var router = express.Router();
var data = require('../models/data.json');

var ParseParameter = function(){
	this.parser = "";
}

ParseParameter.prototype = {
    setStrategy: function(parser) {
        this.parser = parser;
    },
 
    parse: function(parameter) {
        return this.parser.parse(parameter);
    }
};

var IntegerParser = function(filter){

	this.parameter = '';
	this.filter = filter;
	var self = this;

	this.parse = function(parameter){
		self.parameter = parseInt(parameter); 
	}

	this.filterBy = function(item){
		return item[self.filter] == self.parameter;
	}
}

var ArrayParser = function(filter){

	this.parameter;
	this.filter = filter;
	var self = this;

	this.parse = function(parameter){
		self.parameter = parameter.split(",");
	}

	this.filterBy = function(item){
		return self.parameter.indexOf(""+item[self.filter]) !== -1;
	}

}

var StringParser = function(filter){

	this.parameter;
	this.filter = filter;
	var self = this;

	this.parse = function(parameter){
		self.parameter = parameter;
	}	

	this.filterBy = function(item){
		return item[self.filter].indexOf(self.parameter) !== -1;
	}
}



/* GET users listing. */
router.get('/', function(req, res, next) {
	var filter = req.query.filter,
		parameter = req.query.parameter,
		parseParameter = new ParseParameter();

	if(parameter !== undefined && parameter.indexOf(",") !== -1 ){
		var arrayParser = new ArrayParser(filter);
		parseParameter.setStrategy(arrayParser);
		parseParameter.parse(parameter);

	}else if(parameter !== undefined && !isNaN(parseInt(parameter))){
		var integerParser = new IntegerParser(filter);
		parseParameter.setStrategy(integerParser);
		parseParameter.parse(parameter);

	}else if(parameter !== undefined){
		var stringParser = new StringParser(filter);
		parseParameter.setStrategy(stringParser);
		parseParameter.parse(parameter);
		
	}

	var dataFiltered;

	if(parameter !== undefined && filter !== undefined){
		dataFiltered = data.filter(parseParameter.parser.filterBy);
	}else{
		dataFiltered = data;
	}

  	res.send(dataFiltered);

});

module.exports = router;
