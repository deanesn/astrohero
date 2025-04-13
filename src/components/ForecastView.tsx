import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sun, Moon, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";

interface ForecastViewProps {
  userZodiacSign?: string;
  userName?: string;
}

const ForecastView: React.FC<ForecastViewProps> = ({
  userZodiacSign = "Libra",
  userName = "User",
}) => {
  const [activeTab, setActiveTab] = useState("daily");
  const [isLoading, setIsLoading] = useState(false);

  // Mock forecast data
  const [forecasts, setForecasts] = useState({
    daily: {
      text: "Today is a day of balance and harmony for you. Focus on relationships and partnerships, as they will bring you joy and fulfillment. Your ruling planet Venus is enhancing your charm and diplomatic skills.",
      date: new Date().toLocaleDateString(),
      luckyNumber: 7,
      luckyColor: "Blue",
    },
    weekly: {
      text: "This week brings opportunities for growth in your career. Your natural sense of fairness will help you navigate challenging situations at work. Pay attention to your finances and avoid impulsive purchases. Take time for self-care and relaxation over the weekend.",
      date: `${new Date().toLocaleDateString()} - ${new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
      luckyNumber: 3,
      luckyColor: "Green",
    },
    monthly: {
      text: "This month highlights your social connections and networking abilities. You may find yourself in the spotlight at social gatherings. A creative project could bring unexpected rewards. Be mindful of your energy levels and don't overcommit. Romance may blossom in the latter half of the month.",
      date: `${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
      luckyNumber: 9,
      luckyColor: "Pink",
    },
  });

  const handleRefresh = async () => {
    setIsLoading(true);

    // Simulate API call to OpenAI
    setTimeout(() => {
      // In a real implementation, this would be replaced with an actual API call
      const newForecast = {
        ...forecasts[activeTab as keyof typeof forecasts],
        text: `Newly generated ${activeTab} horoscope for ${userZodiacSign}. This would come from an OpenAI API call in the actual implementation.`,
      };

      setForecasts({
        ...forecasts,
        [activeTab]: newForecast,
      });

      setIsLoading(false);
    }, 1500);
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "daily":
        return <Sun className="h-4 w-4 mr-2" />;
      case "weekly":
        return <Moon className="h-4 w-4 mr-2" />;
      case "monthly":
        return <Calendar className="h-4 w-4 mr-2" />;
      default:
        return <Star className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-indigo-900 mb-2">
          Your Cosmic Forecast
        </h2>
        <p className="text-purple-700">
          Personalized horoscope for {userName}, {userZodiacSign}
        </p>
      </div>

      <Tabs
        defaultValue="daily"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-indigo-100">
            <TabsTrigger value="daily" className="flex items-center">
              {getTabIcon("daily")} Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center">
              {getTabIcon("weekly")} Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center">
              {getTabIcon("monthly")} Monthly
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="bg-white hover:bg-indigo-50"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {["daily", "weekly", "monthly"].map((period) => (
          <TabsContent key={period} value={period} className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-indigo-200 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl text-indigo-800 flex items-center">
                    {getTabIcon(period)}
                    {period.charAt(0).toUpperCase() + period.slice(1)} Horoscope
                  </CardTitle>
                  <CardDescription className="text-purple-600">
                    {forecasts[period as keyof typeof forecasts].date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-700 leading-relaxed">
                    {forecasts[period as keyof typeof forecasts].text}
                  </p>

                  <div className="mt-6 flex gap-6">
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-sm text-indigo-600 font-medium">
                        Lucky Number
                      </p>
                      <p className="text-2xl font-bold text-indigo-900">
                        {
                          forecasts[period as keyof typeof forecasts]
                            .luckyNumber
                        }
                      </p>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-sm text-indigo-600 font-medium">
                        Lucky Color
                      </p>
                      <p className="text-2xl font-bold text-indigo-900">
                        {forecasts[period as keyof typeof forecasts].luckyColor}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-indigo-100 pt-4 text-sm text-gray-500">
                  Cosmic insights generated for your unique astrological profile
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ForecastView;
