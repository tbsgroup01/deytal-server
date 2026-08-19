const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Client = sequelize.define("Client", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  website: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Active",
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  alt: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
});

module.exports = Client;
