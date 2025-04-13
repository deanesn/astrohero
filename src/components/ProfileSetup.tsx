import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { saveUserProfile, getUserProfile } from "@/lib/supabase";
import {
  CalendarIcon,
  Clock,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
} from "lucide-react";

interface ProfileSetupProps {
  onComplete?: (userData: UserData) => void;
  userId?: string;
  initialData?: UserData;
  isEditing?: boolean;
  onCancel?: () => void;
}

interface UserData {
  birthDate: Date | undefined;
  birthTime: string;
  birthLocation: string;
  zodiacSign?: string;
}

const ProfileSetup = ({
  onComplete = () => {},
  userId,
  initialData,
  isEditing = false,
  onCancel = () => {},
}: ProfileSetupProps) => {
  const [step, setStep] = useState(isEditing ? 2 : 1);
  const [userData, setUserData] = useState<UserData>(
    initialData || {
      birthDate: undefined,
      birthTime: "",
      birthLocation: "",
    },
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data if userId is provided and we don't have initialData
  useEffect(() => {
    if (userId && !initialData && !isEditing) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await getUserProfile(userId);
          if (error) throw error;

          if (data) {
            // Convert string date back to Date object
            const birthDate = data.birth_date
              ? new Date(data.birth_date)
              : undefined;

            const profileData = {
              birthDate,
              birthTime: data.birth_time || "",
              birthLocation: data.birth_location || "",
              zodiacSign: data.zodiac_sign,
            };

            setUserData(profileData);

            // Skip to dashboard if we already have data
            onComplete(profileData);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load your profile. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId, initialData, isEditing, onComplete]);

  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([
    "New York, USA",
    "London, UK",
    "Tokyo, Japan",
    "Paris, France",
    "Sydney, Australia",
  ]);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (userId) {
        setIsLoading(true);
        setError(null);

        try {
          // Determine zodiac sign based on birth date
          const zodiacSign = getZodiacSign(userData.birthDate);
          const updatedUserData = { ...userData, zodiacSign };

          // Save to Supabase
          const { error } = await saveUserProfile(userId, {
            birth_date: userData.birthDate?.toISOString(),
            birth_time: userData.birthTime,
            birth_location: userData.birthLocation,
            zodiac_sign: zodiacSign,
          });

          if (error) throw error;

          // Call onComplete with the updated data
          onComplete(updatedUserData);
        } catch (err) {
          console.error("Error saving profile:", err);
          setError("Failed to save your profile. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
        // If no userId, just call onComplete (local storage fallback)
        onComplete(userData);
      }
    }
  };

  // Helper function to determine zodiac sign based on birth date
  const getZodiacSign = (birthDate: Date | undefined): string => {
    if (!birthDate) return "";

    const month = birthDate.getMonth() + 1; // getMonth() returns 0-11
    const day = birthDate.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
      return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
      return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
      return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
      return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
      return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
      return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
      return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
      return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
      return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
      return "Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20))
      return "Pisces";

    return "";
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (isEditing) {
      onCancel();
    }
  };

  const handleLocationSearch = (query: string) => {
    setUserData({ ...userData, birthLocation: query });
    // In a real app, this would call an API for location autocomplete
    if (query.length > 2) {
      const filtered = [
        `${query} City, Country`,
        `${query} Town, State`,
        `${query} Village, Region`,
      ];
      setLocationSuggestions(filtered);
    }
  };

  const handleSelectLocation = (location: string) => {
    setUserData({ ...userData, birthLocation: location });
    setLocationSuggestions([]);
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return true; // Welcome screen is always complete
      case 2:
        return !!userData.birthDate;
      case 3:
        return !!userData.birthTime;
      case 4:
        return !!userData.birthLocation;
      default:
        return false;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-indigo-900 to-purple-900 text-white shadow-xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {isEditing ? "Edit Your Profile" : "Your Cosmic Journey"}
        </CardTitle>
        <CardDescription className="text-purple-200">
          {step === 1 && "Welcome to your personalized horoscope experience"}
          {step === 2 && "When were you born?"}
          {step === 3 && "What time were you born?"}
          {step === 4 && "Where were you born?"}
        </CardDescription>
        <Progress value={progress} className="h-2 mt-4 bg-purple-800" />
        {error && (
          <div className="mt-4 p-2 bg-red-900/50 text-red-200 rounded-md text-sm">
            {error}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[300px] flex flex-col justify-center"
        >
          {step === 1 && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80"
                  alt="Cosmic background"
                  className="w-40 h-40 rounded-full object-cover border-4 border-purple-500"
                />
              </div>
              <p className="text-purple-200">
                To create your personalized horoscope, we need a few details
                about your birth. Your cosmic journey begins with these stars
                that were present at your arrival.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label htmlFor="birthDate">Select your birth date</Label>
              <div className="flex flex-col space-y-2">
                <Input
                  id="birthDateInput"
                  type="date"
                  value={
                    userData.birthDate
                      ? format(userData.birthDate, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : undefined;
                    setUserData({ ...userData, birthDate: date });
                  }}
                  className="bg-purple-800/30 border-purple-600 text-white placeholder:text-purple-400"
                  placeholder="YYYY-MM-DD"
                />
                <div className="text-sm text-purple-300">
                  Or use the calendar:
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-purple-800/30 border-purple-600 hover:bg-purple-700/50"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {userData.birthDate ? (
                        format(userData.birthDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-indigo-950 border-purple-600">
                    <Calendar
                      mode="single"
                      selected={userData.birthDate}
                      onSelect={(date) =>
                        setUserData({ ...userData, birthDate: date })
                      }
                      initialFocus
                      className="text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Label htmlFor="birthTime">
                Enter your birth time (if known)
              </Label>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-300" />
                <Input
                  id="birthTime"
                  type="time"
                  value={userData.birthTime}
                  onChange={(e) =>
                    setUserData({ ...userData, birthTime: e.target.value })
                  }
                  className="bg-purple-800/30 border-purple-600 text-white placeholder:text-purple-400"
                  placeholder="Select time"
                />
              </div>
              <p className="text-sm text-purple-300 mt-2">
                The more precise your birth time, the more accurate your
                horoscope will be.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Label htmlFor="birthLocation">Enter your birth location</Label>
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-purple-300" />
                  <Input
                    id="birthLocation"
                    type="text"
                    value={userData.birthLocation}
                    onChange={(e) => handleLocationSearch(e.target.value)}
                    className="bg-purple-800/30 border-purple-600 text-white placeholder:text-purple-400"
                    placeholder="City, Country"
                  />
                </div>

                {locationSuggestions.length > 0 && userData.birthLocation && (
                  <div className="absolute z-10 w-full mt-1 bg-indigo-950 border border-purple-600 rounded-md shadow-lg max-h-60 overflow-auto">
                    {locationSuggestions.map((location, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 cursor-pointer hover:bg-purple-800/50 text-purple-200"
                        onClick={() => handleSelectLocation(location)}
                      >
                        {location}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={step === 1 && !isEditing}
          className="text-purple-200 hover:text-white hover:bg-purple-800/50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {isEditing && step === 1 ? "Cancel" : "Back"}
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isStepComplete() || isLoading}
          className="bg-purple-600 hover:bg-purple-500 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Saving..." : "Processing..."}
            </>
          ) : step === totalSteps ? (
            <>
              {isEditing ? "Save Changes" : "Complete"}{" "}
              <Check className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSetup;
