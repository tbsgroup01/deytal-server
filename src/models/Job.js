const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Engineering",
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Full Time",
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Noida",
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "1-3 Years",
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Best in Industry",
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue("skills");
      if (!rawValue) return [];
      try {
        return JSON.parse(rawValue);
      } catch (e) {
        return typeof rawValue === "string" ? rawValue.split(",").map((s) => s.trim()) : [];
      }
    },
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue("skills", JSON.stringify(value));
      } else if (typeof value === "string") {
        this.setDataValue("skills", JSON.stringify(value.split(",").map((s) => s.trim())));
      } else {
        this.setDataValue("skills", JSON.stringify([]));
      }
    },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Active",
  },
});

module.exports = Job;
