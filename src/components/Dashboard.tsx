import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { getUserProfile } from "@/lib/supabase";
import Settings from "./Settings";
import ProfileSetup from "./ProfileSetup";
import {
  Sun,
  Moon,
  Star,
  Calendar,
  Users,
  Settings as SettingsIcon,
  RefreshCw,
  Loader2,
} from "lucide-react";
import ForecastView from "./ForecastView";
import CompatibilityTool from "./CompatibilityTool";

interface DashboardProps {
  userName?: string;
  zodiacSign?: string;
  birthDate?: string;
  birthTime?: string;
  birthLocation?: string;
  userId?: string;
  userProfile?: any;
}

const Dashboard: React.FC<DashboardProps> = ({
  userName = "User",
  zodiacSign = "Libra",
  birthDate = "October 7, 1990",
  birthTime = "8:30 AM",
  birthLocation = "New York, NY",
  userId,
  userProfile: initialUserProfile,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Fetch user profile data from Supabase if userId is provided
  useEffect(() => {
    if (userId && !initialUserProfile) {
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
  }, [userId, initialUserProfile]);

  // Use data from userProfile if available
  const profileData = userProfile
    ? {
        zodiacSign: userProfile.zodiac_sign || zodiacSign,
        birthDate: userProfile.birth_date
          ? new Date(userProfile.birth_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : birthDate,
        birthTime: userProfile.birth_time || birthTime,
        birthLocation: userProfile.birth_location || birthLocation,
      }
    : {
        zodiacSign,
        birthDate,
        birthTime,
        birthLocation,
      };

  // Zodiac sign data with descriptions and elements
  const zodiacData = {
    Aries: {
      element: "Fire",
      ruling: "Mars",
      traits: "Bold, ambitious, independent",
    },
    Taurus: {
      element: "Earth",
      ruling: "Venus",
      traits: "Patient, reliable, stubborn",
    },
    Gemini: {
      element: "Air",
      ruling: "Mercury",
      traits: "Curious, adaptable, expressive",
    },
    Cancer: {
      element: "Water",
      ruling: "Moon",
      traits: "Intuitive, emotional, protective",
    },
    Leo: {
      element: "Fire",
      ruling: "Sun",
      traits: "Creative, passionate, generous",
    },
    Virgo: {
      element: "Earth",
      ruling: "Mercury",
      traits: "Analytical, practical, perfectionist",
    },
    Libra: {
      element: "Air",
      ruling: "Venus",
      traits: "Diplomatic, fair-minded, social",
    },
    Scorpio: {
      element: "Water",
      ruling: "Pluto",
      traits: "Passionate, determined, mysterious",
    },
    Sagittarius: {
      element: "Fire",
      ruling: "Jupiter",
      traits: "Optimistic, adventurous, honest",
    },
    Capricorn: {
      element: "Earth",
      ruling: "Saturn",
      traits: "Disciplined, responsible, ambitious",
    },
    Aquarius: {
      element: "Air",
      ruling: "Uranus",
      traits: "Progressive, original, independent",
    },
    Pisces: {
      element: "Water",
      ruling: "Neptune",
      traits: "Compassionate, artistic, intuitive",
    },
  };

  // Get current sign data or default to Libra
  const currentSignData =
    zodiacData[profileData.zodiacSign as keyof typeof zodiacData] ||
    zodiacData.Libra;

  // Handle edit profile button click
  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  // Handle settings button click
  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  // Handle profile update
  const handleProfileUpdate = (updatedData: any) => {
    // Refresh the page to show updated data
    window.location.reload();
  };

  // If showing settings or edit profile, render those components instead
  if (showSettings) {
    return <Settings onBack={() => setShowSettings(false)} userId={userId} />;
  }

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-300" />
          <p className="text-xl">Loading your cosmic profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto bg-black/30 border-none text-white">
          <CardHeader>
            <CardTitle>Error Loading Profile</CardTitle>
            <CardDescription className="text-purple-200">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold">✨ AstroHero</div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
            <SettingsIcon className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
              alt={userName}
            />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{userName}</div>
            <div className="text-sm text-gray-300">
              {profileData.zodiacSign}
            </div>
          </div>
        </div>
      </header>
      {/* Main Navigation */}
      <Tabs
        defaultValue="overview"
        className="mb-8 text-[#8a8686]"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto bg-black/20">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
          <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
          <TabsTrigger value="chart">Birth Chart</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent
          value="overview"
          className="mt-6 flex items-end justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Zodiac Sign Card */}
              <Card className="bg-black/30 border-none text-white col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    Your Zodiac Sign
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Based on your birth details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl">
                      {getZodiacSymbol(profileData.zodiacSign)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        {profileData.zodiacSign}
                      </h3>
                      <p className="text-gray-300 mt-1">
                        {currentSignData.traits}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-400">Element</p>
                          <p className="font-medium">
                            {currentSignData.element}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Ruling Planet</p>
                          <p className="font-medium">
                            {currentSignData.ruling}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Birth Details Card */}
              <Card className="bg-black/30 border-none text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    Birth Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Date</p>
                      <p className="font-medium">{profileData.birthDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Time</p>
                      <p className="font-medium">{profileData.birthTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="font-medium">{profileData.birthLocation}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={handleEditProfile}
                    >
                      Edit Details
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Horoscope Preview */}
              <Card className="bg-black/30 border-none text-white col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-yellow-400" />
                    Today's Horoscope
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Today is a great day for {profileData.zodiacSign}! Your
                    ruling planet {currentSignData.ruling} is aligned favorably,
                    bringing positive energy to your endeavors. Focus on your
                    strengths and embrace new opportunities that come your way.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Love</p>
                      <div className="text-pink-400 text-lg">★★★★☆</div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Career</p>
                      <div className="text-blue-400 text-lg">★★★★★</div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Health</p>
                      <div className="text-green-400 text-lg">★★★☆☆</div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Money</p>
                      <div className="text-yellow-400 text-lg">★★★★☆</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-6"
                    onClick={() => setActiveTab("forecasts")}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    View Full Forecast
                  </Button>
                </CardContent>
              </Card>

              {/* Compatibility Preview */}
              <Card className="bg-black/30 border-none text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    Compatibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Discover how your sign connects with others in love,
                    friendship, and work.
                  </p>
                  <div className="flex justify-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                      {getZodiacSymbol(profileData.zodiacSign)}
                    </div>
                    <div className="flex items-center">
                      <Separator className="w-8" />
                      <div className="mx-2 text-pink-400">❤</div>
                      <Separator className="w-8" />
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-xl">
                      {getZodiacSymbol("Aquarius")}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setActiveTab("compatibility")}
                  >
                    Check Compatibility
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        {/* Forecasts Tab Content */}
        <TabsContent value="forecasts" className="mt-6">
          <ForecastView zodiacSign={profileData.zodiacSign} />
        </TabsContent>

        {/* Compatibility Tab Content */}
        <TabsContent value="compatibility" className="mt-6">
          <CompatibilityTool userZodiacSign={profileData.zodiacSign} />
        </TabsContent>

        {/* Birth Chart Tab Content */}
        <TabsContent value="chart" className="mt-6">
          <Card className="bg-black/30 border-none text-white">
            <CardHeader>
              <CardTitle>Your Birth Chart</CardTitle>
              <CardDescription className="text-gray-300">
                A detailed map of the sky at the moment you were born
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square max-w-xl mx-auto relative rounded-full border-2 border-gray-700 p-4 bg-black/50">
                {/* Placeholder for birth chart visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3/4 w-3/4 rounded-full border border-gray-700 flex items-center justify-center">
                    <div className="h-1/2 w-1/2 rounded-full border border-gray-700 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                        {getZodiacSymbol(profileData.zodiacSign)}
                      </div>
                    </div>
                  </div>
                  {/* Placeholder for planets */}
                  {generatePlanetPlaceholders()}
                </div>
              </div>
              <p className="text-center mt-6 text-gray-300">
                This is a simplified representation of your birth chart. For a
                detailed analysis, consult with an astrologer.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to get zodiac symbol
function getZodiacSymbol(sign: string): string {
  const symbols: Record<string, string> = {
    Aries: "♈",
    Taurus: "♉",
    Gemini: "♊",
    Cancer: "♋",
    Leo: "♌",
    Virgo: "♍",
    Libra: "♎",
    Scorpio: "♏",
    Sagittarius: "♐",
    Capricorn: "♑",
    Aquarius: "♒",
    Pisces: "♓",
  };
  return symbols[sign] || "★";
}

// Helper function to generate planet placeholders for the birth chart
function generatePlanetPlaceholders() {
  const planets = [
    {
      name: "Sun",
      symbol: "☉",
      color: "from-yellow-500 to-orange-500",
      position: { top: "20%", left: "75%" },
    },
    {
      name: "Moon",
      symbol: "☽",
      color: "from-blue-300 to-purple-300",
      position: { top: "70%", left: "30%" },
    },
    {
      name: "Mercury",
      symbol: "☿",
      color: "from-gray-400 to-gray-600",
      position: { top: "30%", left: "25%" },
    },
    {
      name: "Venus",
      symbol: "♀",
      color: "from-pink-400 to-pink-600",
      position: { top: "80%", left: "60%" },
    },
    {
      name: "Mars",
      symbol: "♂",
      color: "from-red-500 to-red-700",
      position: { top: "40%", left: "80%" },
    },
    {
      name: "Jupiter",
      symbol: "♃",
      color: "from-purple-500 to-indigo-500",
      position: { top: "15%", left: "40%" },
    },
    {
      name: "Saturn",
      symbol: "♄",
      color: "from-gray-600 to-gray-800",
      position: { top: "60%", left: "75%" },
    },
  ];

  return planets.map((planet, index) => (
    <div
      key={index}
      className={`absolute h-8 w-8 rounded-full bg-gradient-to-br ${planet.color} flex items-center justify-center text-sm font-bold`}
      style={{ top: planet.position.top, left: planet.position.left }}
      title={planet.name}
    >
      {planet.symbol}
    </div>
  ));
}

export default Dashboard;
