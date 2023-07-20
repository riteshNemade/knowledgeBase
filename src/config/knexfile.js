// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    }
  }

};
