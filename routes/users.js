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

var IntegerParser = function(){
	this.parse = function(parameter){
		return parseInt(parameter); 
	}
}



/* GET users listing. */
router.get('/', function(req, res, next) {
	var filter = req.query.filter,
		parameter = req.query.parameter,
		parseParameter = new ParseParameter(),
		integerParser = new IntegerParser();

	parseParameter.setStrategy(integerParser);

	var parameterParsed = parseParameter.parse(parameter);

	console.log(typeof parameterParsed, parameterParsed, isNaN(parameterParsed));

	if(isNaN(parameterParsed)){
		parameterParsed = parameter;	
	}

	console.log(typeof parameterParsed);

	var dataFiltered = data.filter(function(item){
		return item[filter] === parameterParsed;
	});

  	res.send(dataFiltered);

});

module.exports = router;
