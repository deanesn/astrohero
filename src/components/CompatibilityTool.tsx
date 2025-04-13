import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Star, Sparkles, ArrowRight, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompatibilityToolProps {
  userZodiacSign?: string;
  onSaveResult?: (result: CompatibilityResult) => void;
}

interface CompatibilityResult {
  userSign: string;
  partnerSign: string;
  overallScore: number;
  loveScore: number;
  friendshipScore: number;
  workScore: number;
  description: string;
}

const zodiacSigns = [
  { name: "Aries", dates: "Mar 21 - Apr 19", element: "Fire" },
  { name: "Taurus", dates: "Apr 20 - May 20", element: "Earth" },
  { name: "Gemini", dates: "May 21 - Jun 20", element: "Air" },
  { name: "Cancer", dates: "Jun 21 - Jul 22", element: "Water" },
  { name: "Leo", dates: "Jul 23 - Aug 22", element: "Fire" },
  { name: "Virgo", dates: "Aug 23 - Sep 22", element: "Earth" },
  { name: "Libra", dates: "Sep 23 - Oct 22", element: "Air" },
  { name: "Scorpio", dates: "Oct 23 - Nov 21", element: "Water" },
  { name: "Sagittarius", dates: "Nov 22 - Dec 21", element: "Fire" },
  { name: "Capricorn", dates: "Dec 22 - Jan 19", element: "Earth" },
  { name: "Aquarius", dates: "Jan 20 - Feb 18", element: "Air" },
  { name: "Pisces", dates: "Feb 19 - Mar 20", element: "Water" },
];

const CompatibilityTool: React.FC<CompatibilityToolProps> = ({
  userZodiacSign = "Aries",
  onSaveResult = () => {},
}) => {
  const [userSign, setUserSign] = useState<string>(userZodiacSign);
  const [partnerSign, setPartnerSign] = useState<string>("Libra");
  const [activeTab, setActiveTab] = useState<string>("love");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [compatibilityResult, setCompatibilityResult] =
    useState<CompatibilityResult | null>(null);

  // Mock compatibility calculation - in a real app, this would call an API
  const calculateCompatibility = () => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const result: CompatibilityResult = {
        userSign,
        partnerSign,
        overallScore: Math.floor(Math.random() * 40) + 60, // 60-100 range
        loveScore: Math.floor(Math.random() * 100),
        friendshipScore: Math.floor(Math.random() * 100),
        workScore: Math.floor(Math.random() * 100),
        description: `${userSign} and ${partnerSign} have a ${activeTab === "love" ? "romantic" : activeTab === "friendship" ? "friendly" : "professional"} connection that balances ${userSign}'s ${getUserElement(userSign)} energy with ${partnerSign}'s ${getUserElement(partnerSign)} nature. This creates a dynamic relationship with both challenges and harmonious moments.`,
      };

      setCompatibilityResult(result);
      setIsLoading(false);
    }, 1500);
  };

  const getUserElement = (sign: string): string => {
    const zodiacSign = zodiacSigns.find((s) => s.name === sign);
    return zodiacSign ? zodiacSign.element : "Unknown";
  };

  const handleSaveResult = () => {
    if (compatibilityResult) {
      onSaveResult(compatibilityResult);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const renderStars = (score: number) => {
    const fullStars = Math.floor(score / 20);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${i < fullStars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />,
      );
    }

    return <div className="flex space-x-1">{stars}</div>;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-background">
      <Card className="w-full overflow-hidden border-2 border-purple-100 dark:border-purple-900 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
        <CardHeader className="text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <CardTitle className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-pink-300" />
            Zodiac Compatibility Matcher
            <Heart className="h-6 w-6 text-pink-300" />
          </CardTitle>
          <CardDescription className="text-indigo-100 mt-2">
            Discover how your stars align with others across love, friendship,
            and work
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <label className="text-sm font-medium">Your Zodiac Sign</label>
              <Select value={userSign} onValueChange={setUserSign}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your sign" />
                </SelectTrigger>
                <SelectContent>
                  {zodiacSigns.map((sign) => (
                    <SelectItem key={sign.name} value={sign.name}>
                      {sign.name} ({sign.dates})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Element:{" "}
                <Badge variant="outline">{getUserElement(userSign)}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">
                Partner's Zodiac Sign
              </label>
              <Select value={partnerSign} onValueChange={setPartnerSign}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select partner's sign" />
                </SelectTrigger>
                <SelectContent>
                  {zodiacSigns.map((sign) => (
                    <SelectItem key={sign.name} value={sign.name}>
                      {sign.name} ({sign.dates})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Element:{" "}
                <Badge variant="outline">{getUserElement(partnerSign)}</Badge>
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="love" className="flex items-center gap-2">
                <Heart className="h-4 w-4" /> Love
              </TabsTrigger>
              <TabsTrigger
                value="friendship"
                className="flex items-center gap-2"
              >
                <Star className="h-4 w-4" /> Friendship
              </TabsTrigger>
              <TabsTrigger value="work" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Work
              </TabsTrigger>
            </TabsList>

            <Button
              onClick={calculateCompatibility}
              className="w-full py-6 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Calculating Compatibility...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Check Compatibility <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </Tabs>

          {compatibilityResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 p-6 rounded-lg bg-white/50 dark:bg-black/20 border border-purple-100 dark:border-purple-800"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">
                  {userSign} & {partnerSign} Compatibility
                </h3>
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="text-4xl font-bold">
                    <span
                      className={getScoreColor(
                        compatibilityResult.overallScore,
                      )}
                    >
                      {compatibilityResult.overallScore}%
                    </span>
                  </div>
                  {renderStars(compatibilityResult.overallScore)}
                </div>
                <p className="text-muted-foreground">
                  {compatibilityResult.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-sm font-medium mb-1">Love</div>
                  <div className="text-xl font-bold mb-1">
                    <span
                      className={getScoreColor(compatibilityResult.loveScore)}
                    >
                      {compatibilityResult.loveScore}%
                    </span>
                  </div>
                  {renderStars(compatibilityResult.loveScore)}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium mb-1">Friendship</div>
                  <div className="text-xl font-bold mb-1">
                    <span
                      className={getScoreColor(
                        compatibilityResult.friendshipScore,
                      )}
                    >
                      {compatibilityResult.friendshipScore}%
                    </span>
                  </div>
                  {renderStars(compatibilityResult.friendshipScore)}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium mb-1">Work</div>
                  <div className="text-xl font-bold mb-1">
                    <span
                      className={getScoreColor(compatibilityResult.workScore)}
                    >
                      {compatibilityResult.workScore}%
                    </span>
                  </div>
                  {renderStars(compatibilityResult.workScore)}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>

        {compatibilityResult && (
          <CardFooter className="px-6 pb-6 pt-0">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleSaveResult}
            >
              <Save className="h-4 w-4" /> Save This Result
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default CompatibilityTool;
