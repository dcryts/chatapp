const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const app = express();
// Listen
const server = app.listen(3000, () => { console.log(`App started.`); });
// const io = require('socket.io')(server);
const io = require('./src/controllers/socketController')(server);

// Routes
const index = require('./src/routes/index')(io);
const login = require('./src/routes/login');
const register = require('./src/routes/register');
const api = require('./src/routes/api');


// Set View Engine
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// MIDDLEWARE

// Static
app.use(express.static(path.join(__dirname, 'public')));
app.use('/socket', express.static(path.join('node_modules', 'socket.io-client', 'dist')));


// body-parser: handles http POST request under req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express-session: handles session data through cookies
app.use(session({
  secret: 'okay cats',
  saveUninitialized: false,
  resave: false,
}));

// passport: handles authentication using passport-local strategy
app.use(passport.initialize());
app.use(passport.session());

// express-validator: handles validating inputs as correct formats
app.use(expressValidator({
  errorFormatter: function(param, msg, value, location) {
    return {
      param: param,
      msg: msg,
      value: value,
      location: location
    };
  }
}));

// connect-flash: handles authentication success/fail messages for passport
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', index);
app.use('/login', login);
app.use('/register', register)
app.use('/api', api);
// // Listen (NOW CALLED ABOVE FOR 'socket.io')
// app.listen(3000, () => {console.log(`App started.`)});
