const express = require('express');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const cors = require('cors');
const mongoose = require('mongoose');
const { mongodb, port, isProduction } = require('./config');

function main () {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  mongoose.connect(mongodb, {
    useNewUrlParser: true,
    useCreateIndex: true
  });

  if (!isProduction) {
    app.use(errorhandler());
    mongoose.set('debug', true);

    // Show error stack trace in development env.
    app.use((err, req, res, next) => {
      console.log(err.stack);
    });
  } else {
    app.use(cors());
  }

  require('./models/user');
  require('./models/article');

  // Production error handler
  // no stacktraces leaked to user.
  app.use((err, req, res, next) => {
    const { status = 500, message: error } = err;

    res.status(status);
    res.json({ error });
  });

  app.use(require('./routes'));
  app.listen(port, () => console.log('Server running.'))
}

main();
