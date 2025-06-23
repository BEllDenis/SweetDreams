const mongoose = require('mongoose');
let conn = null;

async function connectToDB() {
  if (conn) return conn;

  conn = mongoose.connect('mongodb://admin:k5w5zc_qcWYn5a8@51.250.108.238:27017/SweetDreams', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // можете добавить poolSize или serverSelectionTimeoutMS
  })
  .then(() => mongoose);

  await conn;
  console.log('DB connected');
  return conn;
}

module.exports = connectToDB;
