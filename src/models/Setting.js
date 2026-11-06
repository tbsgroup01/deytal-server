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
  heroVideo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  heroImage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  heroTagline: {
    type: DataTypes.STRING,
    defaultValue: "IDEAS | TECHNOLOGY | GROWTH",
  },
  heroTitle: {
    type: DataTypes.TEXT,
    defaultValue: "We Build Digital Experiences That Drive Real Growth",
  },
  heroDescription: {
    type: DataTypes.TEXT,
    defaultValue: "From modern websites to powerful digital marketing and custom software solutions, we help businesses grow, scale and succeed in the digital world.",
  },
  heroButtonText: {
    type: DataTypes.STRING,
    defaultValue: "Get Started",
  },
  heroButtonLink: {
    type: DataTypes.STRING,
    defaultValue: "/contact",
  },
  showHeroTextOverlay: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  showHeroIcons: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  popupEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  popupCode: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
});

module.exports = Setting;
