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

function capitalizeFirstandTrim(str) {
  str = str.trim();
  str = str.toLowerCase();
  str = str.capitalize();
  return str;
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


app.get('/checklogin', function (req, res) {
  if (req.query.Username.toLowerCase() == "admin" && req.query.Password == "pass") {
    res.send("YES");
  }
  else
    res.send("NO");
});


//--------user.js--------------------------------------------------------

app.post('/users/createaccount', function (req, res) {
     
     var userschema = {
          Username: req.body.Username.toLowerCase(),
          Password: req.body.Password,
          Name: capitalizeFirstandTrim(req.body.Name),
          Email: req.body.Email.toLowerCase(),
          ProfilePic: req.body.ProfilePic,
          Following: [],
          Followers: []
      };
   
    var newuser = new usermodel(userschema);
    
    newuser.pre('save', function(next){
      usermodel.findOne({'Username': req.body.Username}, function(err, data) {
    
        if(data == null)
            next();
        else{
            res.send('Please choose another username.');
        }
      });
    });
    
    newuser.save(function (err) {
      if (err)
          return res.send(error.message);
    
      return res.send('Account successfully created')
  
    });
});

app.get('/users/login', function (req, res) {
  var username = req.query.Username.toLowerCase();
  var password = req.query.Password;
  usermodel.findOne({'Username' :username , 'Password' : password}, function(err, data) {
    
    if (data == null){
      res.send('NO')
    }
    
    else {
      req.session.UserId = data._id;
      req.session.save();
      res.send('YES');
    }

  });

});


app.post('/users/photoupload', function (req, res) {
  usermodel.findOne({_id: req.session.UserId}, function(err, data) {
    if (data == null){
      res.send('Your session has timed out');
    }
    else {
      var photoschema = {
          PhotoContent: req.body.PhotoContent,
          Tags: [],
          Comments: [],
          WhoUpVoted: [],
          Time: req.body.Time,
          Username: data.Username 
      };  
      var firstcomment = {
          Content: req.body.Caption,
          Time: req.body.Time,
          Username: data.Username
      }
      photoschema.Comments.push(firstcomment);
      var newphoto = new photos(photoschema);
      newphoto.pre('save', function(next){  
          next();
      });
      newphoto.save(function (err) {
          if (err)
              return res.send(error.message);
          return res.send('Photo successfully uploaded!');
      });
    }
  });
});

app.get('/users/search', function(req, res){
    usermodel.find({}, function(err, data){
        var userarray = [];
        for (x=0;x<data.length;x++){
            userarray.push(data[x].Username);
        } 
        res.send(userarray);
    });
});

 
app.get('/users/amfollowing' , function (req, res) {
     var usernametofollow = req.query.UsernameToFollow;
     console.log("HEYHEYHEY");
     usermodel.findOne({_id: req.session.UserId}, function (err, data) {
          console.log(data);
          if (data != null) {
               if (data.Following.indexOf(usernametofollow) != -1)
                    res.send("1");
               else 
                    res.send("0");
          }        
          else {
               res.send("Error, user not found");
          }
     });
});

app.get('/users/followuser', function(req,res){
     usermodel.findOne({_id: req.session.UserId}, function(err, data){
          if (data == null){
               res.send("User is not logged in");
          }
          else {
               usermodel.update({_id: req.session.UserId}, {$push: {"Following" :req.query.UsernameToFollow}}, function(err, up){
                    if (up == 1) {
                         usermodel.findOne({Username: req.query.UsernameToFollow}, function(err, otherdata){
                              if (otherdata == null) {
                                   res.send("User does not exist")
                              }
                              else {
                                   usermodel.update({Username: req.query.UsernameToFollow}, {$push: {"Followers": data.Username}}, function(err, up2){
                                        if (up2 == 1){
                                             res.send("Success");
                                        }
                                        else {
                                             res.send("Failure");
                                        }
                                   });
                              }
                         });
                    }
                    else
                         res.send("Failed to update cuurent user");
               });
          }
     });
});

app.get('/users/unfollowuser', function(req,res){
  var randperson = req.query.UsernameToFollow;
  usermodel.findOne({_id: req.session.UserId}, function(err, data) {
    if (data == null){
      res.send("User not in session");
    }
    else{
      myUsername = data.Username;
      usermodel.update({_id: req.session.UserId}, {$pull: {'Following': randperson }}, function(err, up){
        if (up == 1){
          console.log("SUCCESS");
          usermodel.findOne({'Username': randperson}, function(err, data2){
            if (data2 == null){
              res.send("ERROR");
            }
            else{
              usermodel.update({'Username': randperson}, {$pull: {'Followers': myUsername}}, function(err, up1){
                if (up1 == 1){
                  res.send("SUCCESS");
                }
                else{
                  res.send("ERROR");
                }
              });
            }
          });
        }
        else{
          res.send("ERROR");
        }
      });
    }
  });
});

app.get( "/users/getinfo", function(req,res) {
  var myuser = req.query.Username;
  var myiduser = "4eb5444d39e153e60b000001";
  if ( myuser == "NA" || myuser == "undefined" || myuser == undefined || myuser == null){
    myuser = req.session.UserId;
    myiduser = req.session.UserId;
  }
  usermodel.findOne( { $or: [ { Username: myuser }, {_id: mongoose.Types.ObjectId(myiduser)} ] } , function (err, data) {
    if (data == null) 
      res.send("Error. Username or session name doesn’t exist");
    else {
      var newobj = {
        Username: data.Username,
        ProfilePic: data.ProfilePic,
        Name: data.Name,
        Followers: data.Followers,
        Following: data.Following
      };
      res.send(newobj);
    }
  });
});


app.get("/users/newsfeed", function(req, res){
    usermodel.findOne({_id:req.session.UserId}, function(err,  data){
        if(data==null){
            console.log("User is not in session");
        }
        else {
            var following = data.Following;  /// ["bob", "bob1", "bob2", "bob3", "bob4"]
            var x = []; 
            for (var i=0; i <following.length; i++){
                x.push({Username:following[i]});
            }
            photos.find({$or: x}, function (err, data2) {
                if (data2 == null){
                    res.send([]);
                }
                else{
                    var photoarray = [];
                    for (var y = 0; y < data2.length;  y++) {
                        photoarray.push(data2[y]._id);
                    }
                    res.send(photoarray);
                }
            });
        }
    });
});


//--------------------------------------------------------------------

//--------photo.js-------------------------------------------------------

app.get('/photo/isliked', function (req, res) {
      var photoid = req.query.PhotoId;
      photos.findOne({_id: photoid}, function(err, data1){
        if (data1 == null){
          res.send("Photo not found");
        }
        else{
            var foundUser = '0';
            usermodel.findOne({_id: req.session.UserId}, function(err, data2){
              console.log(err);
              console.log(data2);
              if (data2 == null){
                res.send("Not in session");
              }
              else{
                  console.log(data2);
                  for(var i = 0; i < data1.WhoUpVoted.length; i++) {
                      if (data1.WhoUpVoted[i] == data2.Username) {
                            foundUser = '1';
                      }
                  }
              }
            res.send(foundUser);
            });
        }
      });
});    

app.get('/photo/getphoto', function (req, res) {
    photos.findOne({_id: req.query.PhotoId}, function(err, data) {
        if (data == null){
            res.send('The photo does not exist');
        }
        else {
          res.send(data);
        }
    });
});

app.get('/photo/wholiked', function (req, res) {
    var photoid = req.query.PhotoId; // _id of some random photo
    usermodel.findOne({_id: req.session.UserId}, function(err, data1){
        if (data1 == null) {
            res.send('User not logged in');
        }
        else {
            photos.findOne({_id: photoid}, function(err, data2) {
                if (data2 == null) {
                    res.send('Photo does not exist');
                }
                else {
                    var str = '';
                    for (var i =0; i < data2.WhoUpVoted.length; i++) {
                        if (i != 0){
                          str += ', ';
                        }
                        if (data2.WhoUpVoted[i] == data1.Username) {
                            str += 'You';
                        } 
                        else {
                            str += '@' + data2.WhoUpVoted[i];
                        }
                    }
                    res.send(str);
                }
            }); 
        }
    })
});

app.post('/photo/newcomment', function (req, res) {
    var comment = req.body.newComment;
    var time = req.body.Time;
    var photoid = req.body.PhotoId;
    photos.findOne({_id: photoid}, function(err, data1) {
        if (data1 != null){
            usermodel.findOne({_id: req.session.UserId}, function(err, data2){
                if (data2 != null){
                    var newcomment = {
                        Content: comment,
                        Username: data2.Username,
                        Time: time
                    }
                    photos.update({_id: photoid}, {$push: {'Comments': newcomment }}, function(err, up){
                        console.log(up);
                        if (up==1){
                            res.send('Success');
                        }
                        else{
                            res.send('Error');
                        }
                    });
                }
            });
        } 
        else {
          res.send('Error: Photo not found.');
        }             

    });
});

app.post('/photo/upvotepicture', function (req, res) {
    var photoid = req.body.PhotoId;
    photos.findOne({_id: photoid}, function(err, data1) {
        if (data1 != null){
            usermodel.findOne({_id: req.session.UserId}, function(err, data2){
                if (data2 != null){
                    photos.update({_id: photoid}, {$push: {'WhoUpVoted': data2.Username }}, function(err, up){
                        console.log(up);
                        if (up==1){
                            res.send('Success');
                        }
                        else{
                            res.send('Error');
                        }
                    });
                }
            });
        } 
        else {
          res.send('Error: Photo not found.');
        }             

    });
});

app.post('/photo/unvotepicture', function (req, res) {
    var photoid = req.body.PhotoId;
    var UserId = req.session.UserId; 
    photos.findOne({_id: photoid}, function(err, data1) {
        if (data1 != null){
            usermodel.findOne({_id: UserId}, function(err, data2){
                if (data2 != null){
                    photos.update({_id: photoid}, {$pull: {'WhoUpVoted': data2.Username }}, function(err, up){
                        console.log(up);
                        if (up==1){
                            res.send('Success');
                        }
                        else{
                            res.send('Error');
                        }
                    });
                }
            });
        } 
        else {
          res.send('Error: Photo not found.');
        }             

    });
});

app.get('/photo/picsofoneperson', function(req, res){
  // It no matter what requires a Username query variable
  // If you make Username: “NA” then it will get all the posts of the current user’s sessions

    var username = req.query.Username;
    if (username == "NA" || username == "undefined" || username == undefined || username == null){
        usermodel.findOne({_id: req.session.UserId}, function(err, data2){
            if (data2 == null)
                res.send('No session variable. Please provide a valid username');
            else {
                var user = data2.Username;
                photos.find({'Username': user}, function(err, data){
                    var arr = [];
                    for ( var i = 0; i < data.length; i++){
                        arr.push( data[i]._id );
                    }
                    res.send(arr);
                });
            }
        });
    }
    else{
        photos.find({'Username': username}, function(err, data){
            if (data == null) {
                res.send('Not a valid username');
            }
            else {
                var arr = [];
                for ( var i = 0; i < data.length; i++){
                    arr.push( data[i]._id );
                }
                res.send(arr);
            }
        });
    }
});

//--------------------------------------------------------------------



module.exports = app;
