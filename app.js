var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , cors = require('cors')
  , http = require('http')
  , path = require('path')
    , p3p = require('p3p');
var session = require('express-session');
var email = require('emailjs');
cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

mongoose = require('mongoose');
 //mongoose.connect('mongodb://127.0.0.1:27017/instagram-db');
 mongoose.connect('mongodb://admin:pass@dogen.mongohq.com:10010/database-1-mongo');
db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {});
Schema = mongoose.Schema;
cookieParser = require('cookie-parser');


photoscheme = new Schema ({
  Tags: [],
  Comments: [],
  PhotoContent: String,
  Username: String,
  WhoUpVoted: [],
  Time: Number,
});
photos = mongoose.model('Photosridatt', photoscheme, 'photosridatt');

userscheme = new Schema ({
  Username: String,
  Password: String,
  Name: String,
  Email: String,
  ProfilePic: String,
  Followers:[],
  Following:[]
});
usermodel = mongoose.model('Usersridatt', userscheme, 'usersridatt');


//---------------------------------------------------------------


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(cors());
 app.use( express.compress() );
app.use(express.cookieParser());


var session = require('express-session');
app.use(express.session({secret: "s32vsad3ba?32!SFadS"}));
app.use(express.cookieParser());


app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin',      "*");
    res.header('Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin');
    next();
  });

app.all('/*', p3p(p3p.recommended), function(req, res, next) {
   res.header('Access-Control-Allow-Origin',      "*");
   res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin');
  next();
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.use('/', routes);
app.use('/user', user);
//app.get('/', routes.index);
//app.get('/users', user.list);

allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin',      "*");
         res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin');
        res.header('Access-Control-Allow-Credentials', 'true');
           res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        next();
};
app.use(allowCrossDomain);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
