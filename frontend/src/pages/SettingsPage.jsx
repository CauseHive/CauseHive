import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  User,
  Bell,
  Shield,
  Lock,
  Trash2,
  Save,
  Sun,
  Wallet,
  Download,
  Moon,
  AlertTriangle,
} from 'lucide-react';

import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    displayName: 'John Doe',
    publicProfile: true,
    showDonations: true,
    showCauses: true
  });
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    donationAlerts: true,
    causeUpdates: true,
    weeklyDigest: true,
    marketingEmails: false,
    smsNotifications: false
  });
  
  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    donationHistory: 'friends',
    contactInfo: 'private'
  });
  
  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30'
  });
  
  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'en',
    currency: 'USD',
    timezone: 'America/New_York'
  });
  
  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    defaultPaymentMethod: 'card',
    savePaymentInfo: true,
    autoReceipts: true
  });

  const handleSaveSettings = async (section) => {
    setSaving(true);
    try {
      // Replace with actual API call
      const settingsData = {
        profile: profileSettings,
        notifications: notificationSettings,
        privacy: privacySettings,
        security: securitySettings,
        appearance: appearanceSettings,
        payment: paymentSettings
      };
      
      console.log(`Saving ${section} settings:`, settingsData[section]);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Replace with actual API call
        console.log('Deleting account...');
        alert('Account deletion initiated. You will receive an email with further instructions.');
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  const exportData = () => {
    // Replace with actual data export
    const userData = {
      profile: profileSettings,
      notifications: notificationSettings,
      privacy: privacySettings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'causehive-user-data.json';
    link.click();
  };

  const navigationItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'payment', label: 'Payment', icon: Wallet }
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            type="text"
            value={profileSettings.displayName}
            onChange={(e) => setProfileSettings({...profileSettings, displayName: e.target.value})}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="publicProfile"
            checked={profileSettings.publicProfile}
            onCheckedChange={(checked) => setProfileSettings({...profileSettings, publicProfile: checked})}
          />
          <Label htmlFor="publicProfile" className="text-sm font-normal">
            Public Profile
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Allow others to view your profile</p>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="showDonations"
            checked={profileSettings.showDonations}
            onCheckedChange={(checked) => setProfileSettings({...profileSettings, showDonations: checked})}
          />
          <Label htmlFor="showDonations" className="text-sm font-normal">
            Show Donations
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Display your donation history on your profile</p>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="showCauses"
            checked={profileSettings.showCauses}
            onCheckedChange={(checked) => setProfileSettings({...profileSettings, showCauses: checked})}
          />
          <Label htmlFor="showCauses" className="text-sm font-normal">
            Show Created Causes
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Display causes you've created on your profile</p>
      </div>

      <Button onClick={() => handleSaveSettings('profile')} disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? 'Saving...' : 'Save Profile Settings'}
      </Button>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="emailNotifications"
            checked={notificationSettings.emailNotifications}
            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
          />
          <Label htmlFor="emailNotifications" className="text-sm font-normal">
            Email Notifications
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Receive important updates via email</p>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="pushNotifications"
            checked={notificationSettings.pushNotifications}
            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
          />
          <Label htmlFor="pushNotifications" className="text-sm font-normal">
            Push Notifications
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Receive browser notifications</p>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="donationAlerts"
            checked={notificationSettings.donationAlerts}
            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, donationAlerts: checked})}
          />
          <Label htmlFor="donationAlerts" className="text-sm font-normal">
            Donation Alerts
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Get notified when someone donates to your causes</p>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="causeUpdates"
            checked={notificationSettings.causeUpdates}
            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, causeUpdates: checked})}
          />
          <Label htmlFor="causeUpdates" className="text-sm font-normal">
            Cause Updates
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Receive updates from causes you support</p>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="weeklyDigest"
            checked={notificationSettings.weeklyDigest}
            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyDigest: checked})}
          />
          <Label htmlFor="weeklyDigest" className="text-sm font-normal">
            Weekly Digest
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Weekly summary of your activity and recommended causes</p>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="marketingEmails"
            checked={notificationSettings.marketingEmails}
            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingEmails: checked})}
          />
          <Label htmlFor="marketingEmails" className="text-sm font-normal">
            Marketing Emails
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Receive promotional content and news</p>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="smsNotifications"
            checked={notificationSettings.smsNotifications}
            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
          />
          <Label htmlFor="smsNotifications" className="text-sm font-normal">
            SMS Notifications
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Receive text messages for urgent updates</p>
      </div>

      <Button onClick={() => handleSaveSettings('notifications')} disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? 'Saving...' : 'Save Notification Settings'}
      </Button>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profileVisibility">Profile Visibility</Label>
          <select
            id="profileVisibility"
            value={privacySettings.profileVisibility}
            onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="public">Public - Anyone can view</option>
            <option value="registered">Registered Users Only</option>
            <option value="private">Private - Only You</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="donationHistory">Donation History Visibility</Label>
          <select
            id="donationHistory"
            value={privacySettings.donationHistory}
            onChange={(e) => setPrivacySettings({...privacySettings, donationHistory: e.target.value})}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactInfo">Contact Information</Label>
          <select
            id="contactInfo"
            value={privacySettings.contactInfo}
            onChange={(e) => setPrivacySettings({...privacySettings, contactInfo: e.target.value})}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <Button onClick={() => handleSaveSettings('privacy')} disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? 'Saving...' : 'Save Privacy Settings'}
      </Button>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="twoFactorAuth"
            checked={securitySettings.twoFactorAuth}
            onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
          />
          <Label htmlFor="twoFactorAuth" className="text-sm font-normal">
            Two-Factor Authentication
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="loginAlerts"
            checked={securitySettings.loginAlerts}
            onCheckedChange={(checked) => setSecuritySettings({...securitySettings, loginAlerts: checked})}
          />
          <Label htmlFor="loginAlerts" className="text-sm font-normal">
            Login Alerts
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Get notified of new logins to your account</p>

        <div className="space-y-2">
          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
          <select
            id="sessionTimeout"
            value={securitySettings.sessionTimeout}
            onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Account Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Login History
          </Button>
        </div>
      </div>

      <Button onClick={() => handleSaveSettings('security')} disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? 'Saving...' : 'Save Security Settings'}
      </Button>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Appearance & Language</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label>Theme</Label>
          <RadioGroup
            value={appearanceSettings.theme}
            onValueChange={(value) => setAppearanceSettings({...appearanceSettings, theme: value})}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                <Sun className="h-4 w-4" />
                Light
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                <Moon className="h-4 w-4" />
                Dark
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <select
            id="language"
            value={appearanceSettings.language}
            onChange={(e) => setAppearanceSettings({...appearanceSettings, language: e.target.value})}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            value={appearanceSettings.currency}
            onChange={(e) => setAppearanceSettings({...appearanceSettings, currency: e.target.value})}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <select
            id="timezone"
            value={appearanceSettings.timezone}
            onChange={(e) => setAppearanceSettings({...appearanceSettings, timezone: e.target.value})}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
          </select>
        </div>
      </div>

      <Button onClick={() => handleSaveSettings('appearance')} disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? 'Saving...' : 'Save Appearance Settings'}
      </Button>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Payment Settings</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="defaultPaymentMethod">Default Payment Method</Label>
          <select
            id="defaultPaymentMethod"
            value={paymentSettings.defaultPaymentMethod}
            onChange={(e) => setPaymentSettings({...paymentSettings, defaultPaymentMethod: e.target.value})}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="card">Credit/Debit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="savePaymentInfo"
            checked={paymentSettings.savePaymentInfo}
            onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, savePaymentInfo: checked})}
          />
          <Label htmlFor="savePaymentInfo" className="text-sm font-normal">
            Save Payment Information
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Securely store payment methods for faster checkout</p>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="autoReceipts"
            checked={paymentSettings.autoReceipts}
            onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, autoReceipts: checked})}
          />
          <Label htmlFor="autoReceipts" className="text-sm font-normal">
            Automatic Receipts
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">Automatically email receipts for donations</p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Saved Payment Methods</h3>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">•••• •••• •••• 1234</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
              <Button variant="outline" size="sm">
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
        <Button variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          Add New Payment Method
        </Button>
      </div>

      <Button onClick={() => handleSaveSettings('payment')} disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? 'Saving...' : 'Save Payment Settings'}
      </Button>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSettings();
      case 'notifications': return renderNotificationSettings();
      case 'privacy': return renderPrivacySettings();
      case 'security': return renderSecuritySettings();
      case 'appearance': return renderAppearanceSettings();
      case 'payment': return renderPaymentSettings();
      default: return renderProfileSettings();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {navigationItems.map(item => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection(item.id)}
                    >
                      <IconComponent className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {renderSection()}

              {/* Data & Account Section */}
              {activeSection === 'security' && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Data & Account</h3>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={exportData}>
                        <Download className="mr-2 h-4 w-4" />
                        Export My Data
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>

                    {showDeleteConfirm && (
                      <Alert className="border-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <p className="font-medium">Delete Account</p>
                            <p>This action cannot be undone. All your data will be permanently deleted.</p>
                            <div className="flex gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDeleteConfirm(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteAccount}
                              >
                                Delete Account
                              </Button>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;