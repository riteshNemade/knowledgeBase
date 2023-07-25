  /** Knex/SQL database config*/
  require('dotenv').config();
  const knex = require('knex');
  const config = require('./knexfile');
  const environment = process.env.NODE_ENV || 'development';
  const knexInstance = knex(config[environment]);

  /*MongoDB/Mongoose NoSQL database config */
  const mongoose= require('mongoose');
  const URL=process.env.MONGO_URL;
  
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  console.log(URL)
  mongoose.connect(URL,mongooseOptions)
  .then(() => {
      console.log('Connected to the database successfully!');
    })
    .catch((error) => {
      console.error('Error connecting to the database:', error);
    });



  module.exports = {
      db: knexInstance,
      mongoose: mongoose
  };


