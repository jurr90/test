var express      = require('express');     
var bodyParser   = require('body-parser');
var User         = require('./model/user').User;
var Moderator    = require('./model/moderator').Moderator;
var expressJwt   = require('express-jwt');
var jwt          = require('jsonwebtoken');
var app          = express();

app.use('/api', expressJwt({secret: 'shhhhh'}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/app')).listen(8080);

//Авторизиция
app.post('/authenticate', function (req, res) {
    Moderator.findOne({name: req.body.username}, function(err, moder) {
        console.log(moder)
        if (!(req.body.username === moder.name && req.body.password === moder.pass)) {
            res.send(401);
            return;
        }
        var token = jwt.sign({ foo: 'bar' }, 'shhhhh', { expiresInMinutes: 60*5 });
        moder.token = token;
        return res.json({ token: token });
    });
});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.statusCode = 401;
        res.send({ error: 'invalid token' });
    }
});

app.get('/api/restricted', function (req, res) {
    res.send(true)
});

//Регистрация
app.post('/registr', function(req, res) {
    console.log(req.body)
    var moderator = new Moderator({
        name: req.body.username,
        pass: req.body.password,
        token: 0
    })

    moderator.save(function (err) {
        console.log(err)
        if (!err) {
            return res.send({ status: 'OK'});
        } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
        }
    })
})



//Работа с Angular
app.get('/user', function(req, res) {
	return User.find(function (err, articles) {
        if (!err) {
            return res.send(articles);
        } else {
            res.statusCode = 500;
            return res.send({ error: 'Server error' });
        }
    });
})

app.post('/user', function (req, res) {
	var user = new User({
		name: req.body.name,
		age: req.body.age,
		email: req.body.email
	})

	user.save(function (err) {
        if (!err) {
            return res.send({ status: 'OK'});
        } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
        }
    });
});

app.get('/user/:id', function (req, res) {
    return User.findById(req.params.id, function (err, article) {
        if(!article) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', article:article });
        } else {
            res.statusCode = 500;
            return res.send({ error: 'Server error' });
        }
    });
});

app.put('/user/:id', function (req, res){
    return User.findById(req.params.id, function (err, article) {
        if(!article) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        
        article.name = req.body.name,
        article.age = req.body.age,
        article.email = req.body.email

        return article.save(function (err) {
            if (!err) {
                return res.send({ status: 'OK'});
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
        });
    });    
});

app.delete('/user/:id', function (req, res){
    return User.findById(req.params.id, function (err, article) {
        if(!article) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return article.remove(function (err) {
            if (!err) {
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                return res.send({ error: 'Server error' });
            }
        });
    });
});

console.log('Server running on port 8080');