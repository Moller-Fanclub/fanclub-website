import LocationRaceCard from "../../components/LocationRaceCard.tsx";
import { races, type Race } from "../../races.ts";
import PageContainer from "../../components/PageContainer.tsx";
import FadeInnAnimation from "@/components/FadeInnAnimation.tsx";

interface LocationGroup {
  location: string;
  imagePath: string;
  races: Race[];
}

const RacePage: React.FC = () => {
  
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

  // Group races by location
  const groupRacesByLocation = (racesList: Race[]): LocationGroup[] => {
    const grouped = new Map<string, LocationGroup>();
    
    racesList.forEach(race => {
      if (!grouped.has(race.name)) {
        grouped.set(race.name, {
          location: race.name,
          imagePath: race.imagePath,
          races: []
        });
      }
      grouped.get(race.name)!.races.push(race);
    });

    // Sort races within each location by date
    grouped.forEach(group => {
      group.races.sort((a, b) => a.date.getTime() - b.date.getTime());
    });

    return Array.from(grouped.values());
  };

  const upcomingGrouped = groupRacesByLocation(upcomingRaces);
  const pastGrouped = groupRacesByLocation(pastRaces);

  return (
    <PageContainer maxWidth="6xl">
      {/* Upcoming Races Section */}
      <h1 className="mt-8 mb-8 text-center text-4xl font-bold text-white drop-shadow-lg">
        Kommende Renn
      </h1>
      <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
        {upcomingGrouped.map((group) => (
            <LocationRaceCard 
              key={group.location}
              location={group.location}
              imagePath={group.imagePath}
              races={group.races}
              isPast={false}
            />
        ))}
      </div>

      {/* Past Races Section */}
      {pastGrouped.length > 0 && (
        <>
        <FadeInnAnimation className="mt-16 mb-8 text-center text-4xl font-bold text-white drop-shadow-lg">
            Tidligere Renn
        </FadeInnAnimation>
        {pastGrouped.map((group) => (
            <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
              <LocationRaceCard 
                key={group.location}
                location={group.location}
                imagePath={group.imagePath}
                races={group.races}
                isPast={true}
              />
            </div>
          ))}
        </>
      )}
    </PageContainer>
  );
};

export default RacePage;
