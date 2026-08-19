const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Portfolio = sequelize.define("Portfolio", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Completed",
  },
  clientName: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  technologies: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
  gallery: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
});

module.exports = Portfolio;
