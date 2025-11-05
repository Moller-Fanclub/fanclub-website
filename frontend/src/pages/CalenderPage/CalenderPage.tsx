import { useState, useEffect } from "react";
import LocationRaceCard from "../../components/LocationRaceCard.tsx";
import { races as staticRaces, type Race } from "../../races.ts";
import PageContainer from "../../components/PageContainer.tsx";
import FadeInnAnimation from "@/components/FadeInnAnimation.tsx";
import { raceService } from "@/services/raceService.ts";
import GoToTop from "@/components/GoToTop.tsx";

interface LocationGroup {
  location: string;
  imagePath: string;
  races: Race[];
}

type RaceView = 'upcoming' | 'past';

const RacePage: React.FC = () => {
  const [races, setRaces] = useState<Race[]>(staticRaces);
  const [selectedView, setSelectedView] = useState<RaceView>('upcoming');

  // Helper function to normalize date to midnight
  const getDateAtMidnight = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Get today's date at midnight for comparison
  const today = new Date();
  const todayMidnight = getDateAtMidnight(today);

  // Fetch results for past races on mount
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const currentDate = new Date();
        const currentMidnight = getDateAtMidnight(currentDate);

        // Get past races
        const pastRacesList = staticRaces.filter(
          (race) => getDateAtMidnight(race.date).getTime() < currentMidnight.getTime()
        );

        if (pastRacesList.length === 0) {
          return;
        }

        // Fetch results for all past races
        const resultLinks = pastRacesList.map(race => race.resultLink);
        const results = await raceService.getMultipleRaceResults(resultLinks);

        // Merge results with races
        const racesWithResults = staticRaces.map(race => {
          const result = results.get(race.resultLink);
          if (result) {
            return {
              ...race,
              result: {
                position: result.position,
                fisPoints: result.fisPoints,
                date: result.date,
                place: result.place,
                discipline: result.discipline,
                country: result.country,
                category: result.category,
              }
            };
          }
          return race;
        });

        setRaces(racesWithResults);
      } catch (error) {
        console.error('Error fetching race results:', error);
      }
    };

    fetchResults();
  }, []);

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
  const hasUpcoming = upcomingGrouped.length > 0;
  const hasPast = pastGrouped.length > 0;

  useEffect(() => {
    if (selectedView === 'upcoming' && !hasUpcoming && hasPast) {
      setSelectedView('past');
    } else if (selectedView === 'past' && !hasPast && hasUpcoming) {
      setSelectedView('upcoming');
    }
  }, [selectedView, hasUpcoming, hasPast]);

  const toggleButtonBaseClasses =
    "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900";

  return (
    <PageContainer maxWidth="6xl">
      <h1 className="mt-8 text-center text-4xl font-bold text-white drop-shadow-lg">
        Rennkalender
      </h1>

      <div className="mt-8 flex justify-center">
        <div className="inline-flex w-full max-w-lg gap-1 rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur">
          <button
            type="button"
            onClick={() => hasUpcoming && setSelectedView('upcoming')}
            disabled={!hasUpcoming}
            className={
              `${toggleButtonBaseClasses} ` +
              (selectedView === 'upcoming'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-white/70 hover:text-white') +
              (!hasUpcoming ? ' opacity-40 cursor-not-allowed' : '')
            }
          >
            Kommende renn
          </button>
          <button
            type="button"
            onClick={() => hasPast && setSelectedView('past')}
            disabled={!hasPast}
            className={
              `${toggleButtonBaseClasses} ` +
              (selectedView === 'past'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-white/70 hover:text-white') +
              (!hasPast ? ' opacity-40 cursor-not-allowed' : '')
            }
          >
            Tidligere renn
          </button>
        </div>
      </div>

      {selectedView === 'upcoming' && (
        <>
          {hasUpcoming ? (
            <FadeInnAnimation className="mt-12 grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
              {upcomingGrouped.map((group) => (
                <LocationRaceCard
                  key={group.location}
                  location={group.location}
                  imagePath={group.imagePath}
                  races={group.races}
                  isPast={false}
                />
              ))}
            </FadeInnAnimation>
          ) : (
            <p className="mt-12 text-center text-lg font-medium text-white/80">
              Ingen kommende renn er planlagt ennå.
            </p>
          )}
        </>
      )}

      {selectedView === 'past' && (
        <>
          {hasPast ? (
            <>
              {pastGrouped.map((group) => (
                <div
                  key={group.location}
                  className="mt-12 grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3"
                >
                  <FadeInnAnimation className="w-full">
                    <LocationRaceCard
                      location={group.location}
                      imagePath={group.imagePath}
                      races={group.races}
                      isPast={true}
                    />
                  </FadeInnAnimation>
                </div>
              ))}
            </>
          ) : (
            <p className="mt-12 text-center text-lg font-medium text-white/80">
              Ingen tidligere renn er registrert ennå.
            </p>
          )}
        </>
      )}
      <GoToTop />
    </PageContainer>
  );
};

export default RacePage;
