const Settings = require('../../modules/settings/models/settings.model');

class EmailService {
  constructor() {
    this.nodemailer = null;
  }

  async loadNodemailer() {
    if (this.nodemailer) return this.nodemailer;
    
    try {
      this.nodemailer = require('nodemailer');
      return this.nodemailer;
    } catch (error) {
      console.error('nodemailer not installed. Run: npm install nodemailer');
      return null;
    }
  }

  async getTransporter() {
    const nodemailer = await this.loadNodemailer();
    if (!nodemailer) return null;

    const settings = await Settings.getSettings();
    
    if (!settings.email || !settings.emailPassword) {
      console.error('Email settings not configured');
      return null;
    }

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: settings.email,
        pass: settings.emailPassword
      }
    });
  }

  async sendPurchaseNotification(vehicle, customerName = 'Customer') {
    const settings = await Settings.getSettings();
    
    if (!settings.purchaseNotifications) {
      return;
    }

    const transporter = await this.getTransporter();
    if (!transporter) return;

    const mailOptions = {
      from: settings.email,
      to: settings.email,
      subject: `New Vehicle Purchase - ${vehicle.make} ${vehicle.model}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e293b;">Vehicle Purchase Notification</h2>
          <p>A customer has just purchased a vehicle from your inventory.</p>
          
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">Vehicle Details</h3>
            <p><strong>Make:</strong> ${vehicle.make}</p>
            <p><strong>Model:</strong> ${vehicle.model}</p>
            <p><strong>Year:</strong> ${vehicle.year}</p>
            <p><strong>Category:</strong> ${vehicle.category}</p>
            <p><strong>Price:</strong> $${vehicle.price.toLocaleString()}</p>
            <p><strong>Remaining Stock:</strong> ${vehicle.quantity}</p>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            This is an automated notification from Prestige Motors Admin Console.
          </p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Purchase notification email sent successfully');
    } catch (error) {
      console.error('Error sending purchase notification:', error.message);
    }
  }

  async sendLowStockNotification(vehicle) {
    const settings = await Settings.getSettings();
    
    if (!settings.lowStockNotifications) {
      return;
    }

    if (vehicle.quantity >= settings.lowStockThreshold) {
      return;
    }

    const transporter = await this.getTransporter();
    if (!transporter) return;

    const mailOptions = {
      from: settings.email,
      to: settings.email,
      subject: `Low Stock Alert - ${vehicle.make} ${vehicle.model}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626;">Low Stock Alert</h2>
          <p>A vehicle in your inventory has fallen below the low stock threshold.</p>
          
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="color: #991b1b; margin-top: 0;">Vehicle Details</h3>
            <p><strong>Make:</strong> ${vehicle.make}</p>
            <p><strong>Model:</strong> ${vehicle.model}</p>
            <p><strong>Year:</strong> ${vehicle.year}</p>
            <p><strong>Current Stock:</strong> ${vehicle.quantity}</p>
            <p><strong>Threshold:</strong> ${settings.lowStockThreshold}</p>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            Please consider restocking this vehicle soon.
          </p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Low stock notification email sent successfully');
    } catch (error) {
      console.error('Error sending low stock notification:', error.message);
    }
  }
}

module.exports = new EmailService();
