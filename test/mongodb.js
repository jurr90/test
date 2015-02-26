var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var User = mongoose.model('User', { name: String,
age: String,
email: String
 });

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
	if (err) // ...
	console.log('meow');
});

