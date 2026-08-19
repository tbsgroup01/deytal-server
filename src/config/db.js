const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "deytal_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, // Toggle to console.log for query debugging
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Database Connected successfully via Sequelize ORM.");
  } catch (error) {
    console.error(`MySQL Connection Error: ${error.message}`);
    console.warn("Server is running without a database connection. Requests requiring database access will fail.");
  }
};

module.exports = { sequelize, connectDB };
