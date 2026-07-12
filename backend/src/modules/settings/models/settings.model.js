const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  email: {
    type: String,
    default: ''
  },
  emailPassword: {
    type: String,
    default: ''
  },
  purchaseNotifications: {
    type: Boolean,
    default: false
  },
  lowStockNotifications: {
    type: Boolean,
    default: false
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true
});

// Singleton pattern - only one settings document should exist
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
