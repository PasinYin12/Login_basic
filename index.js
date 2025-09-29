require('dotenv').config(); // Load environment variables

const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');

// Controllers
const indexController = require('./controllers/indexController');
const loginController = require('./controllers/loginController');
const registerController = require('./controllers/registerController');
const storeUserController = require('./controllers/storeUserController');
const loginUserController = require('./controllers/loginUserController');
const logoutController = require('./controllers/logoutController');
const homeController = require('./controllers/homeController');

// Middleware
const redirectIfAuth = require('./middleware/redirectIfAuth');
const authMiddleware = require('./middleware/authMiddleware');

// MongoDB connection (secured via .env)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

app.use(flash());

// Make session data available to views
app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  res.locals.loggedIn = !!req.session.userId;
  res.locals.messages = req.flash();
  next();
});

// Helmet security headers
app.use(helmet());

// View engine
app.set('view engine', 'ejs');

// Routes
app.get('/', indexController);
app.get('/home', authMiddleware, homeController);
app.get('/login', redirectIfAuth, loginController);
app.get('/register', redirectIfAuth, registerController);
app.post('/user/register', redirectIfAuth, storeUserController);
app.post('/user/login', redirectIfAuth, loginUserController);
app.get('/logout', logoutController);

// Optional: Debug route (remove in production)
if (process.env.NODE_ENV !== 'production') {
  app.get('/session-check', (req, res) => {
    res.json({
      sessionID: req.sessionID,
      userId: req.session.userId,
      sessionData: req.session
    });
  });
}

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
