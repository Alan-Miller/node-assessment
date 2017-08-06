/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
  REQUIREMENTS
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var express = require('express');
var bodyParser = require('body-parser');
var users = require('./users.json');



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
  APP
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var app = express();

app.use(bodyParser.json());



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
  ENDPOINTS
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// #1 get all users
// app.get('/api/users', function(req, res) {
//   res.status(200).json(users);
// });

// #2 get by language
app.get('/api/users', function(req, res) {
  if (Object.keys(req.query).length > 0) {
    var usersByLanguage = users.filter(function(value) {
      return value.language === req.query.language;
    });
    res.status(200).json(usersByLanguage);
  }
  else res.status(200).json(users);
});

// #3 get by privilege
app.get('/api/users/:privilege', function(req, res) {
  var usersByPrivilege = users.filter(function(value) {
    return value.type === req.params.privilege;
  });
  res.status(200).json(usersByPrivilege);
});

// #4 get by id
app.get('/api/users/id/:id', function(req, res) {
  var userById = users.filter(function(value) {
    return value.id === Number(req.params.id);
  });
  if (!userById.length) res.status(404).send('Not found');
  else res.status(200).json(userById);
});

// #5 post new user
app.post('/api/users', function(req, res) {
  var allIds = users.map(function(value) {
    return value.id;
  });
  var newId = Math.max.apply(null, allIds) + 1; // add 1 to highest current id
  var newUser = req.body;
  newUser.id = newId;
  res.status(200).json(newUser);
});

// #6 post new admin
app.post('/api/users/:privilege', function(req, res) {
  var allIds = users.map(function(value) {
    return value.id;
  });
  var newId = Math.max.apply(null, allIds) + 1; // add 1 to highest current id
  req.body.id = newId;
  var newUser = req.body;
  newUser.type = req.params.privilege;
  res.status(200).json(newUser);
});

// #7 put language
app.put('/api/users/language/:id', function(req, res) {
  var user = users.filter(function(value) {
    return value.id === Number(req.params.id);
  });
  if (!user.length) {
    res.status(404).send('Not found');
  }
  else {
    user[0].language = req.body.language;
    res.status(200).json(user);
  }
});

// #8 put favorite
app.put('/api/users/forums/:id', function(req, res) {
  var user = users.filter(function(value) {
    return value.id === Number(req.params.id);
  });
  if (Array.isArray(user[0].favorites)) {
    user[0].favorites.push(req.body.add);
    res.status(200).json(user);
  }
  else {
    user[0].favorites[0] = req.body.add;
    res.status(200).json(user);
  }
});

// #9 delete favorite
app.delete('/api/users/forums/:id', function(req, res) {
  var user = users.filter(function(value) {
    return value.id === Number(req.params.id);
  });
  if (!user.length) {
    res.status(404).send('Not found');
  }
  else {
    var indexOfFav = user[0].favorites.indexOf(req.query.favorite);
    user[0].favorites.splice(indexOfFav, 1);
    res.status(200).json(user);
  }
});

// #10 delete user
app.delete('/api/users/:id', function(req, res) {
  var allIds = users.map(function(value) {
    return value.id;
  });
  if (allIds.indexOf(Number(req.params.id)) != -1) {
    var user = users.filter(function(value) {
      return value.id == Number(req.params.id);
    });
    var indexOfUser = users.indexOf(user[0]);
    users.splice(indexOfUser, 1);
    res.status(200).json(users);
  }
  else res.status(404).send('Not found');

});

// #11 get all users
app.get('/api/users', function(req, res) {
  // var usersByQuery = [];
  if (req.query.age) {
    users = users.filter(function(value) {
      return value.age === Number(req.query.age);
    });
  }
  if (req.query.language) {
    users = users.filter(function(value) {
      return value.language === req.query.language;
    });
  }
  if (req.query.city) {
    users = users.filter(function(value) {
      return value.city === req.query.city;
    });
  }
  if (req.query.state) {
    users = users.filter(function(value) {
      return value.state === req.query.state;
    });
  }
  if (req.query.gender) {
    users = users.filter(function(value) {
      return value.gender === req.query.gender;
    });
  }
  res.status(200).json(users);
});


// #12 put user properties by id
app.put('/api/users/:id', function(req, res) {
  var user = users.filter(function(value) {
    return value.id === Number(req.params.id);
  });
  for (var key in user[0]) {
    var prop = key;
    if (req.body[prop]) {
      user[0][key] = req.body[prop];
    }
  }
  res.status(200).json(user[0]);
});






/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
  LISTEN IN ON PORT
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var port = 3000;
app.listen(port, function() {
  console.log('Listening now on port ' + port + '!');
});



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*
  EXPORT
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
module.exports = app;
