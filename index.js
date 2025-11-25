const express = require('express');
const passport = require('passport');
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
require('./config/passport');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session + passport
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// route handler
const Routes = require('./routes/index');
app.use('/auth', Routes.authRouter);

// error handler
app.use((err, req, res, next) => {
  console.error(err); // optional logging
  return res.status(500).json({ error: err.message || err });
});

const PORT = process.env.PORT || 8098;
app.listen(PORT, (err) => {
  if (!err) {
    console.log(`STARTED AT ${PORT}`);
  } else {
    console.log(err);
  }
});
