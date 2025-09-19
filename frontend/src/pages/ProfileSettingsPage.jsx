import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileSettingsPage.module.css';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import { useToast } from '../components/Toast/ToastProvider';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  Trash2, 
  Bell, 
  Shield, 
  Wallet,
  Edit2,
  X
} from 'lucide-react';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const toast = useToast();
  
  // Personal Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [picture, setPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState('');
  
  // Account Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [donationReceipts, setDonationReceipts] = useState(true);
  const [causeUpdates, setCauseUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Withdrawal/Payment Settings
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  
  // UI States
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiService.getProfile();
        // Personal info
        setFirstName(data.user?.first_name || data.first_name || '');
        setLastName(data.user?.last_name || data.last_name || '');
        setEmail(data.user?.email || data.email || '');
        setBio(data.bio || '');
        setPhone(data.phone_number || '');
        setAddress(data.address || '');
        setPicturePreview(data.profile_picture || '');
        
        // Withdrawal info
        if (data.withdrawal_address) {
          const withdrawalData = typeof data.withdrawal_address === 'string' 
            ? JSON.parse(data.withdrawal_address) 
            : data.withdrawal_address;
          setBankName(withdrawalData.bank_name || '');
          setAccountNumber(withdrawalData.account_number || '');
          setAccountName(withdrawalData.account_name || '');
          setWithdrawalMethod(withdrawalData.method || 'bank');
        }
      } catch (error) {
        toast.error('Failed to load profile data');
      }
    };
    
    loadProfile();
  }, [toast]);

  // Handle profile picture change
  const handlePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPicture(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPicturePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save personal information
  const savePersonalInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiService.updateProfile({ 
        bio, 
        phone_number: phone, 
        address, 
        profile_picture: picture 
      });
      toast.success('Personal information updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Save withdrawal information
  const saveWithdrawalInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const withdrawalData = {
        method: withdrawalMethod,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName
      };
      
      await apiService.updateProfile({ 
        withdrawal_address: withdrawalData 
      });
      toast.success('Payment information updated successfully!');
    } catch (error) {
      toast.error(`Failed to update payment info: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    try {
      await apiService.delete('/api/user/profile/delete');
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (error) {
      toast.error(`Failed to delete account: ${error.message}`);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Account Settings</h1>
          <p className={styles.subtitle}>Manage your profile, preferences, and account security</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        <button 
          className={`${styles.tab} ${activeTab === 'personal' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          <User size={20} />
          Personal Info
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'notifications' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={20} />
          Notifications
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'payment' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          <Wallet size={20} />
          Payment Info
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'security' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={20} />
          Security
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
              <button 
                className={styles.editBtn}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X size={20} /> : <Edit2 size={20} />}
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <form onSubmit={savePersonalInfo} className={styles.form}>
              {/* Profile Picture */}
              <div className={styles.profilePictureSection}>
                <div className={styles.profilePicture}>
                  {picturePreview ? (
                    <img src={picturePreview} alt="Profile" className={styles.profileImg} />
                  ) : (
                    <div className={styles.profilePlaceholder}>
                      <User size={40} />
                    </div>
                  )}
                  {isEditing && (
                    <label className={styles.pictureUploadBtn}>
                      <Camera size={16} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePictureChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
                <div className={styles.profileInfo}>
                  <h3>{firstName} {lastName}</h3>
                  <p>{email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <User size={16} />
                    First Name
                  </label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <User size={16} />
                    Last Name
                  </label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEditing}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    disabled 
                    className={`${styles.input} ${styles.disabled}`}
                  />
                  <small className={styles.helpText}>Contact support to change your email</small>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing}
                    className={styles.input}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>
                    <MapPin size={16} />
                    Address
                  </label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={!isEditing}
                    className={styles.input}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>
                    Bio
                  </label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={!isEditing}
                    className={styles.textarea}
                    rows={4}
                    placeholder="Tell others about yourself..."
                  />
                </div>
              </div>

              {isEditing && (
                <div className={styles.formActions}>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className={styles.saveBtn}
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Notification Preferences</h2>
            </div>

            <div className={styles.notificationSettings}>
              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h3>Email Notifications</h3>
                  <p>Receive general updates via email</p>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h3>Donation Receipts</h3>
                  <p>Get emailed receipts for your donations</p>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={donationReceipts}
                    onChange={(e) => setDonationReceipts(e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h3>Cause Updates</h3>
                  <p>Receive updates from causes you've supported</p>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={causeUpdates}
                    onChange={(e) => setCauseUpdates(e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h3>Marketing Emails</h3>
                  <p>Receive promotional content and news</p>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={marketingEmails}
                    onChange={(e) => setMarketingEmails(e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Payment Information Tab */}
        {activeTab === 'payment' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Payment Information</h2>
              <p className={styles.sectionDescription}>
                Set up your withdrawal preferences for receiving donations
              </p>
            </div>

            <form onSubmit={saveWithdrawalInfo} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Withdrawal Method</label>
                <select 
                  value={withdrawalMethod}
                  onChange={(e) => setWithdrawalMethod(e.target.value)}
                  className={styles.select}
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              {withdrawalMethod === 'bank' && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Bank Name</label>
                    <input 
                      type="text" 
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className={styles.input}
                      placeholder="Enter your bank name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Account Number</label>
                    <input 
                      type="text" 
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className={styles.input}
                      placeholder="Enter your account number"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Account Name</label>
                    <input 
                      type="text" 
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className={styles.input}
                      placeholder="Enter account holder name"
                    />
                  </div>
                </>
              )}

              <div className={styles.formActions}>
                <button 
                  type="submit" 
                  disabled={saving}
                  className={styles.saveBtn}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Payment Info'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Security Settings</h2>
            </div>

            <div className={styles.securityActions}>
              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <h3>Change Password</h3>
                  <p>Update your account password</p>
                </div>
                <button className={styles.securityBtn}>
                  Change Password
                </button>
              </div>

              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button className={styles.securityBtn}>
                  Enable 2FA
                </button>
              </div>

              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <h3>Login Activity</h3>
                  <p>View recent login activity</p>
                </div>
                <button className={styles.securityBtn}>
                  View Activity
                </button>
              </div>

              <div className={styles.dangerZone}>
                <h3>Danger Zone</h3>
                <div className={styles.securityItem}>
                  <div className={styles.securityInfo}>
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account and all associated data</p>
                  </div>
                  <button 
                    className={styles.dangerBtn}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 size={16} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Delete Account</h3>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmDeleteBtn}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;

