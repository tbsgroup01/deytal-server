const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const TeamMember = sequelize.define("TeamMember", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
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

module.exports = TeamMember;
