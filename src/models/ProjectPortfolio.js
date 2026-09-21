const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ProjectPortfolio = sequelize.define("ProjectPortfolio", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = ProjectPortfolio;
