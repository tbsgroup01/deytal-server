const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const GalleryItem = sequelize.define("GalleryItem", {
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
    defaultValue: "Office Environment",
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: "",
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

module.exports = GalleryItem;
