const express = require('express');
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('./generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const passport = require('passport');
require('dotenv').config();

require('./config/passport');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session + passport
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient({ adapter }), {
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
app.use('/profile', Routes.profileRouter);
app.use('/user', Routes.userRouter);

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
