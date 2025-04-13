import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProfileSetup from "./ProfileSetup";
import Dashboard from "./Dashboard";
import { supabase, getCurrentUser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface UserProfile {
  birthDate: Date | null;
  birthTime: string;
  birthLocation: string;
  zodiacSign?: string;
}

interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
}

const Home = () => {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    birthDate: null,
    birthTime: "",
    birthLocation: "",
    zodiacSign: "",
  });
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Check for authenticated user and profile data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for authenticated user
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user || null;

        setAuthState({
          user,
          session,
          loading: false,
        });

        if (user) {
          // If user is authenticated, we'll get their profile from Supabase in the Dashboard component
          setIsFirstTimeUser(false);
        } else {
          // If no authenticated user, fall back to localStorage
          const savedProfile = localStorage.getItem("horoscopeUserProfile");
          if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            // Convert string date back to Date object
            if (profile.birthDate) {
              profile.birthDate = new Date(profile.birthDate);
            }
            setUserProfile(profile);
            setIsFirstTimeUser(false);
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        setAuthState({
          user: null,
          session: null,
          loading: false,
        });

        // Fall back to localStorage if auth fails
        const savedProfile = localStorage.getItem("horoscopeUserProfile");
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          if (profile.birthDate) {
            profile.birthDate = new Date(profile.birthDate);
          }
          setUserProfile(profile);
          setIsFirstTimeUser(false);
        }
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user || null;
        setAuthState({
          user,
          session,
          loading: false,
        });

        if (user) {
          setIsFirstTimeUser(false);
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      // Login successful
      setShowLogin(false);
      setLoginEmail("");
      setLoginPassword("");
    } catch (error: any) {
      console.error("Login error:", error);
      setAuthError(error.message || "Failed to login");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      // Signup successful
      setAuthError("Check your email for the confirmation link");
    } catch (error: any) {
      console.error("Signup error:", error);
      setAuthError(error.message || "Failed to sign up");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleProfileComplete = (profile: UserProfile) => {
    // If user is authenticated, profile is saved to Supabase in the ProfileSetup component
    // For non-authenticated users, save to localStorage as fallback
    if (!authState.user) {
      // Determine zodiac sign based on birth date
      const zodiacSign = getZodiacSign(profile.birthDate);
      const updatedProfile = { ...profile, zodiacSign };

      // Save profile to localStorage
      localStorage.setItem(
        "horoscopeUserProfile",
        JSON.stringify(updatedProfile),
      );

      setUserProfile(updatedProfile);
    }

    setIsFirstTimeUser(false);
  };

  // Helper function to determine zodiac sign based on birth date
  const getZodiacSign = (birthDate: Date | null): string => {
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

  // Background with cosmic theme
  const backgroundStyle = {
    backgroundImage:
      "linear-gradient(to bottom right, #0f172a, #1e293b, #334155)",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
  };

  return (
    <div
      className="min-h-screen w-full bg-background text-foreground"
      style={backgroundStyle}
    >
      <div className="stars-overlay absolute inset-0 z-0 opacity-30">
        {/* Constellation pattern overlay */}
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-white">
            AstroHero
          </h1>
          <p className="text-lg text-center mb-12 text-gray-300 max-w-2xl">
            Discover your personalized astrological journey based on your unique
            celestial blueprint.
          </p>

          {authState.loading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-purple-300 mb-4" />
              <p className="text-xl text-white">
                Loading your cosmic profile...
              </p>
            </div>
          ) : showLogin ? (
            <div className="w-full max-w-md mx-auto bg-gradient-to-br from-indigo-900 to-purple-900 text-white shadow-xl border-0 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Access Your Cosmic Profile
              </h2>

              {authError && (
                <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md text-sm">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full p-2 rounded bg-purple-800/30 border border-purple-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full p-2 rounded bg-purple-800/30 border border-purple-600 text-white"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-500"
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleSignup}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500"
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>

                <div className="text-center pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowLogin(false)}
                    className="text-purple-200 hover:text-white hover:bg-purple-800/50"
                  >
                    Continue Without Account
                  </Button>
                </div>
              </form>
            </div>
          ) : isFirstTimeUser ? (
            <div className="space-y-6 w-full max-w-md">
              <div className="flex justify-end w-full">
                {!authState.user && (
                  <Button
                    variant="outline"
                    onClick={() => setShowLogin(true)}
                    className="bg-purple-800/30 border-purple-600 text-white hover:bg-purple-700/50"
                  >
                    Sign In
                  </Button>
                )}
              </div>
              <ProfileSetup
                onComplete={handleProfileComplete}
                userId={authState.user?.id}
              />
            </div>
          ) : (
            <Dashboard userProfile={userProfile} userId={authState.user?.id} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
