const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Setting = sequelize.define("Setting", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  siteName: {
    type: DataTypes.STRING,
    defaultValue: "Deytal",
  },
  siteTitle: {
    type: DataTypes.STRING,
    defaultValue: "Deytal - Custom Website & Digital Product Development",
  },
  metaDescription: {
    type: DataTypes.TEXT,
    defaultValue: "Deytal builds high-performance custom websites, mobile applications, brand identities, and digital workflows for businesses.",
  },
  supportEmail: {
    type: DataTypes.STRING,
    defaultValue: "hello@deytal.com",
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: "+91 98765 43210",
  },
  address: {
    type: DataTypes.STRING,
    defaultValue: "New Delhi, India",
  },
  facebook: {
    type: DataTypes.STRING,
    defaultValue: "https://facebook.com/deytal",
  },
  youtube: {
    type: DataTypes.STRING,
    defaultValue: "https://youtube.com/@deytal",
  },
  linkedin: {
    type: DataTypes.STRING,
    defaultValue: "https://linkedin.com/company/deytal",
  },
  instagram: {
    type: DataTypes.STRING,
    defaultValue: "https://instagram.com/deytal",
  },
  maintenanceMode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Setting;
