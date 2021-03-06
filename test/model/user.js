var mongoose = require('../libs/mongoose'),
	Schema = mongoose.Schema;

var User = new Schema({
	name: {
		type: String,
		required: true
	},
	age: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	}
})

exports.User = mongoose.model('User', User)