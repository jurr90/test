var mongoose = require('mongoose');
// var config = require('../config/config');

mongoose.connect('mongodb://localhost/test');

module.exports = mongoose;