var express = require('express');
var app = express();
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
     res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin');
    next();
  });


var session = require('express-session');
app.use(express.session({secret: "s32vsad3ba?32!SFadS"}));
app.use(express.cookieParser());
//-----------------------------------------------------------------------------------------------------------------------


app.get('/zav/:omg', function(req, res) {
  res.send("HEY " + req.params.omg)
});

app.get('/redirect', function(req,res) {
  res.send("One Moment<script>alert('Sorry! Something happened. Please try to login again. BTW im guessing your a mac user???'); window.history.back();</script>")
});
app.get('/name/:name', function(req, res){
    req.session.value = req.params.name;
      req.session.save(); 
    res.send("<a id='OMGOMGOMG' href='/name'>GO</a>");
});
app.get('/name', function(req, res){
    res.send(req.session.value);
});
app.get('/logout', function(req,res ) {
	req.session.destroy();
	res.send("Session destroyed");
});

app.get('/backward', function (req, res) {
  var name = req.query.MyString;
  var str= "";
  for (var x = name.length - 1; x >= 0; x--) {
    str += name[x];
  }
  res.send(str);
});

app.get('/checklogin', function (req, res) {
  if (req.query.Username.toLowerCase() == "admin" && req.query.Password == "pass") {
    res.send("YES");
  }
  else
    res.send("NO");
});

module.exports = app;
