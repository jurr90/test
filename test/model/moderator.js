var crypto = require('crypto');

var mongoose = require('../libs/mongoose'),
	Schema = mongoose.Schema;

var Moderator = new Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	pass: {
		type: String,
		required: true,
	},
	token: {
		type: String,
		required: true,
	}
})


exports.Moderator = mongoose.model('Moderator', Moderator)