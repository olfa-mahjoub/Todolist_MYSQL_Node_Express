/* Exporting the database configuration to the server.js file. */
module.exports = {
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
