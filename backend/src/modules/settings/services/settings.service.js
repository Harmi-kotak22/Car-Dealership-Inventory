const Settings = require('../models/settings.model');

class SettingsService {
  async getSettings() {
    return await Settings.getSettings();
  }

  async updateSettings(data) {
    const settings = await Settings.getSettings();
    
    if (data.email !== undefined) settings.email = data.email;
    if (data.emailPassword !== undefined) settings.emailPassword = data.emailPassword;
    if (data.purchaseNotifications !== undefined) settings.purchaseNotifications = data.purchaseNotifications;
    if (data.lowStockNotifications !== undefined) settings.lowStockNotifications = data.lowStockNotifications;
    if (data.lowStockThreshold !== undefined) settings.lowStockThreshold = data.lowStockThreshold;
    
    return await settings.save();
  }
}

module.exports = new SettingsService();
