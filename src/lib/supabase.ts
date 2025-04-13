import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL or Anon Key is missing. Please check your environment variables.",
  );
}

// Use default values for development if environment variables are not set
const url = supabaseUrl || "https://placeholder-url.supabase.co";
const key = supabaseAnonKey || "placeholder-key";

export const supabase = createClient<Database>(url, key);

// Helper function to get the current user
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Helper function to sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

// Helper function to sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

// Helper function to sign out
export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Helper function to save user profile data
export const saveUserProfile = async (userId: string, profileData: any) => {
  return await supabase
    .from("profiles")
    .upsert({
      id: userId,
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .select();
};

// Helper function to get user profile data
export const getUserProfile = async (userId: string) => {
  return await supabase.from("profiles").select("*").eq("id", userId).single();
};

// Helper function to save complete user profile data
export const saveCompleteUserProfile = async (
  userId: string,
  birthDate: Date | undefined,
  birthTime: string,
  birthLocation: string,
  zodiacSign: string,
) => {
  return await supabase
    .from("profiles")
    .upsert({
      id: userId,
      birth_date: birthDate?.toISOString(),
      birth_time: birthTime,
      birth_location: birthLocation,
      zodiac_sign: zodiacSign,
      updated_at: new Date().toISOString(),
    })
    .select();
};
