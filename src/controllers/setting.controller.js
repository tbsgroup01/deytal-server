const Setting = require("../models/Setting");

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    // If no settings record exists, create a default one
    if (!settings) {
      settings = await Setting.create({});
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = async (req, res) => {
  const {
    siteName,
    siteTitle,
    metaDescription,
    supportEmail,
    phone,
    address,
    facebook,
    youtube,
    linkedin,
    instagram,
    maintenanceMode,
    heroVideo,
    heroImage,
    heroTagline,
    heroTitle,
    heroDescription,
    heroButtonText,
    heroButtonLink,
    showHeroTextOverlay,
    showHeroIcons,
  } = req.body;

  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = new Setting();
    }

    if (siteName !== undefined) settings.siteName = siteName;
    if (siteTitle !== undefined) settings.siteTitle = siteTitle;
    if (metaDescription !== undefined) settings.metaDescription = metaDescription;
    if (supportEmail !== undefined) settings.supportEmail = supportEmail;
    if (phone !== undefined) settings.phone = phone;
    if (address !== undefined) settings.address = address;
    if (facebook !== undefined) settings.facebook = facebook;
    if (youtube !== undefined) settings.youtube = youtube;
    if (linkedin !== undefined) settings.linkedin = linkedin;
    if (instagram !== undefined) settings.instagram = instagram;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (heroVideo !== undefined) settings.heroVideo = heroVideo;
    if (heroImage !== undefined) settings.heroImage = heroImage;
    if (heroTagline !== undefined) settings.heroTagline = heroTagline;
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroDescription !== undefined) settings.heroDescription = heroDescription;
    if (heroButtonText !== undefined) settings.heroButtonText = heroButtonText;
    if (heroButtonLink !== undefined) settings.heroButtonLink = heroButtonLink;
    if (showHeroTextOverlay !== undefined) settings.showHeroTextOverlay = showHeroTextOverlay;
    if (showHeroIcons !== undefined) settings.showHeroIcons = showHeroIcons;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
