import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signOut, getUserProfile, saveUserProfile } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import ProfileSetup from "./ProfileSetup";
import { Loader2 } from "lucide-react";

interface SettingsProps {
  onBack?: () => void;
  userId?: string;
}

const Settings: React.FC<SettingsProps> = ({ onBack = () => {}, userId }) => {
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile data if userId is provided
  useEffect(() => {
    if (userId) {
      const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await getUserProfile(userId);
          if (error) throw error;

          if (data) {
            setUserProfile(data);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setError("Failed to load your profile data");
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [userId]);

  const handleSignOut = async () => {
    await signOut();
    // Redirect to home page after sign out
    navigate("/");
    window.location.reload(); // Force reload to clear any cached state
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleProfileUpdate = (updatedData: any) => {
    // Refresh the page to show updated data
    window.location.reload();
  };

  // If showing edit profile, render the ProfileSetup component
  if (showEditProfile) {
    return (
      <ProfileSetup
        userId={userId}
        initialData={{
          birthDate: userProfile?.birth_date
            ? new Date(userProfile.birth_date)
            : undefined,
          birthTime: userProfile?.birth_time || "",
          birthLocation: userProfile?.birth_location || "",
          zodiacSign: userProfile?.zodiac_sign,
        }}
        isEditing={true}
        onComplete={handleProfileUpdate}
        onCancel={() => setShowEditProfile(false)}
      />
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-indigo-900 to-purple-900 text-white shadow-xl border-0">
        <CardContent className="flex items-center justify-center py-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-300" />
            <p className="text-lg">Loading your settings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-indigo-900 to-purple-900 text-white shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Settings</CardTitle>
        <CardDescription className="text-purple-200">
          Manage your account and preferences
        </CardDescription>
        {error && (
          <div className="mt-2 p-2 bg-red-900/50 text-red-200 rounded-md text-sm">
            {error}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Profile</h3>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal bg-purple-800/30 border-purple-600 hover:bg-purple-700/50"
            onClick={handleEditProfile}
          >
            Edit Birth Details
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Account</h3>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal bg-purple-800/30 border-purple-600 hover:bg-purple-700/50"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Preferences</h3>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal bg-purple-800/30 border-purple-600 hover:bg-purple-700/50"
            onClick={() => {}}
            disabled
          >
            Notification Settings (Coming Soon)
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal bg-purple-800/30 border-purple-600 hover:bg-purple-700/50"
            onClick={() => {}}
            disabled
          >
            Theme Settings (Coming Soon)
          </Button>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={onBack}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white"
        >
          Back to Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Settings;
