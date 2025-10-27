import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar.tsx";
import RaceCard from "../../components/RaceCard.tsx";
import { races } from "../../races.ts";
import { type RaceData, raceService } from "../../services/raceService.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.tsx";

const RacePage: React.FC = () => {
  const [latestRace, setLatestRace] = useState<RaceData | null>(null);
  const [isLoadingRace, setIsLoadingRace] = useState(true);

  // Fetch latest race data
  useEffect(() => {
    const fetchLatestRace = async () => {
      setIsLoadingRace(true);
      try {
        const data = await raceService.getLatestRace();
        setLatestRace(data);
      } catch (error) {
        console.error("Error fetching latest race:", error);
      }
      setIsLoadingRace(false);
    };

    fetchLatestRace();
  }, []);

  // Helper function to normalize date to midnight
  const getDateAtMidnight = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Get today's date at midnight for comparison
  const today = new Date();
  const todayMidnight = getDateAtMidnight(today);

  // Separate races into past and upcoming
  const pastRaces = races
    .filter(
      (race) => getDateAtMidnight(race.date).getTime() < todayMidnight.getTime()
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime()); // Most recent first

  const upcomingRaces = races
    .filter(
      (race) =>
        getDateAtMidnight(race.date).getTime() >= todayMidnight.getTime()
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime()); // Soonest first

  return (
    <div className="min-h-screen flex justify-center bg-[#FFFAF0] py-8">
      <NavigationBar />
      <div className="mt-20 mb-8 mx-auto max-w-5xl px-4">
        {/* Latest Race Card - At the top */}
        {!isLoadingRace && latestRace && (
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Siste Løp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Dato</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {latestRace.date}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Sted</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {latestRace.place}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Disiplin</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {latestRace.discipline}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Plass</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {latestRace.position || "N/A"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Kategori</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {latestRace.category}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">FIS Poeng</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {latestRace.fisPoints || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Races Section */}
        <h1 className="mt-8 mb-8 text-center text-3xl font-bold text-gray-800">
          Kommende Løp
        </h1>
        <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
          {upcomingRaces.map((race) => (
            <RaceCard key={race.name} race={race} />
          ))}
        </div>

        {/* Past Races Section */}
        {pastRaces.length > 0 && (
          <>
            <h2 className="mt-16 mb-8 text-center text-3xl font-bold text-gray-800">
              Tidligere Løp
            </h2>
            <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
              {pastRaces.map((race) => (
                <RaceCard key={race.name} race={race} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RacePage;
