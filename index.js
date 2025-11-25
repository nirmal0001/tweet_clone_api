const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// route handler
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
