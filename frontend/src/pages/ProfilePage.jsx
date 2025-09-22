import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { 
  User, 
  Phone, 
  MapPin, 
  Camera, 
  Edit2, 
  Save, 
  X,
  Heart,
  DollarSign,
  Award,
  Mail
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';

import apiService from '../services';

const Profile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState('');

  // Fetch profile data
  const { data: profile, isLoading: loading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => apiService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user causes
  const { data: userCauses } = useQuery({
    queryKey: ['user-causes'],
    queryFn: () => apiService.getUserCauses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user donation statistics
  const { data: donationStats } = useQuery({
    queryKey: ['user-donation-stats'],
    queryFn: () => apiService.getDonationStatistics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updateData) => apiService.updateProfile(updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      alert('Profile updated successfully!');
    },
    onError: (error) => {
      console.error('Error saving profile:', error);
      alert('Failed to update profile. Please try again.');
    },
  });

  // Stats
  const [userStats, setUserStats] = useState({
    totalDonations: 0,
    totalCauses: 0,
    totalRaised: 0,
    joinDate: null
  });

  // Initialize form when profile data loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.user.first_name);
      setLastName(profile.user.last_name);
      setEmail(profile.user.email);
      setBio(profile.bio || '');
      setPhone(profile.phone_number || '');
      setAddress(profile.address || '');
      setPicturePreview(profile.profile_picture || '');
      
      // Set real user stats from API data
      const totalRaised = userCauses?.results?.reduce((sum, cause) => sum + (cause.current_amount || 0), 0) || 0;
      setUserStats({
        totalDonations: donationStats?.total_amount || 0,
        totalCauses: userCauses?.count || 0,
        totalRaised: totalRaised,
        joinDate: new Date(profile.date_joined || Date.now())
      });
    }
  }, [profile, userCauses, donationStats]);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => setPicturePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const updateData = {
      bio,
      phone_number: phone,
      address,
      profile_picture: profilePicture
    };
    
    updateProfileMutation.mutate(updateData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    if (profile) {
      setFirstName(profile.user.first_name);
      setLastName(profile.user.last_name);
      setBio(profile.bio || '');
      setPhone(profile.phone_number || '');
      setAddress(profile.address || '');
      setPicturePreview(profile.profile_picture || '');
      setProfilePicture(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={picturePreview} alt="Profile" />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePictureChange}
                      className="hidden"
                      id="profile-picture"
                    />
                    <Label
                      htmlFor="profile-picture"
                      className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer hover:bg-secondary/80 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                      Change Photo
                    </Label>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{firstName} {lastName}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Member since {userStats.joinDate?.toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Profile Actions */}
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                      <Edit2 className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={updateProfileMutation.isPending} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="p-2 bg-red-100 rounded-full">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userStats.totalDonations}</p>
                <p className="text-sm text-muted-foreground">Total Donations</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="p-2 bg-blue-100 rounded-full">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userStats.totalCauses}</p>
                <p className="text-sm text-muted-foreground">Causes Supported</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${userStats.totalRaised.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Raised</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details Form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">Contact support to change your email</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isEditing}
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isEditing}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={4}
                  placeholder="Tell others about yourself..."
                />
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Heart className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Donated $50 to Clean Water Initiative</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Award className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Created Education for All cause</p>
                  <p className="text-sm text-muted-foreground">1 week ago</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Heart className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Donated $25 to Animal Rescue Fund</p>
                  <p className="text-sm text-muted-foreground">2 weeks ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => navigate('/causes/create')}>
                Create New Cause
              </Button>
              <Button variant="outline" onClick={() => navigate('/causes')}>
                Browse Causes
              </Button>
              <Button variant="outline" onClick={() => navigate('/donations')}>
                View Donations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;