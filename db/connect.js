const mongoose = require("mongoose");

function connectDb(uri) {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectDb;
