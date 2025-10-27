import React, { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationBar.tsx";
import { type RaceData } from "../../services/raceService.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.tsx";

type SortKey = "date" | "place" | "discipline" | "category" | "position" | "fisPoints";
type SortDirection = "asc" | "desc";

const ResultsPage: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>("2025/2026");
  const [isLoading, setIsLoading] = useState(true);
  const [racesBySeason, setRacesBySeason] = useState<
    Record<string, RaceData[]>
  >({});
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Fetch all races from API
  useEffect(() => {
    const fetchAllRaces = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/fis/all`
        );
        const data = await response.json();

        // Group races by season
        const grouped: Record<string, RaceData[]> = {};
        data.forEach((race: RaceData) => {
          const season = race.season || "Unknown";
          if (!grouped[season]) {
            grouped[season] = [];
          }
          grouped[season].push(race);
        });

        setRacesBySeason(grouped);
      } catch (error) {
        console.error("Error fetching races:", error);
      }
      setIsLoading(false);
    };

    fetchAllRaces();
  }, []);

  // Get available seasons sorted
  const seasons = Object.keys(racesBySeason).sort().reverse();

  // Get the latest race for the selected season
  const latestRace = racesBySeason[selectedSeason]?.[0] || null;

  // Sorting handler
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Get all races for the selected season and sort them
  const currentSeasonRaces = (racesBySeason[selectedSeason] || []).sort((a, b) => {
    let aValue: string | number = a[sortKey];
    let bValue: string | number = b[sortKey];

    // Handle numeric values for position and FIS points
    if (sortKey === "position" || sortKey === "fisPoints") {
      // Try to parse as number, fallback to string comparison
      const aNum = parseFloat(aValue as string);
      const bNum = parseFloat(bValue as string);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        aValue = aNum;
        bValue = bNum;
      }
    }

    // Handle date sorting (format: DD-MM-YYYY)
    if (sortKey === "date") {
      const parseDate = (dateStr: string) => {
        const parts = dateStr.split("-");
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      };
      aValue = parseDate(aValue as string).getTime();
      bValue = parseDate(bValue as string).getTime();
    }

    // Compare values
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen flex justify-center bg-[#FFFAF0] py-8">
      <NavigationBar />
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-20 mb-8">
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
            Resultater og Historikk
          </h1>

          {/* Season Selector */}
          {!isLoading && (
            <div className="mb-8 flex justify-center">
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Velg sesong" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem key={season} value={season}>
                      {season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Latest Race for Selected Season */}
          {!isLoading && latestRace && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-center text-xl">
                  Siste Løp - {selectedSeason}
                </CardTitle>
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
                    <p className="text-sm font-medium text-gray-500">
                      Disiplin
                    </p>
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
                    <p className="text-sm font-medium text-gray-500">
                      Kategori
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {latestRace.category}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">
                      FIS Poeng
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {latestRace.fisPoints || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Table with races for selected season */}
          {!isLoading && currentSeasonRaces.length > 0 && (
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>
                  Alle Løp - {selectedSeason} ({currentSeasonRaces.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className="cursor-pointer select-none hover:bg-gray-100"
                          onClick={() => handleSort("date")}
                        >
                          <div className="flex items-center gap-2">
                            Dato
                            {sortKey === "date" && (
                              <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer select-none hover:bg-gray-100"
                          onClick={() => handleSort("place")}
                        >
                          <div className="flex items-center gap-2">
                            Sted
                            {sortKey === "place" && (
                              <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer select-none hover:bg-gray-100"
                          onClick={() => handleSort("discipline")}
                        >
                          <div className="flex items-center gap-2">
                            Disiplin
                            {sortKey === "discipline" && (
                              <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer select-none hover:bg-gray-100"
                          onClick={() => handleSort("category")}
                        >
                          <div className="flex items-center gap-2">
                            Kategori
                            {sortKey === "category" && (
                              <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer select-none hover:bg-gray-100"
                          onClick={() => handleSort("position")}
                        >
                          <div className="flex items-center gap-2">
                            Plass
                            {sortKey === "position" && (
                              <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer select-none hover:bg-gray-100"
                          onClick={() => handleSort("fisPoints")}
                        >
                          <div className="flex items-center gap-2">
                            FIS Poeng
                            {sortKey === "fisPoints" && (
                              <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                            )}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentSeasonRaces.map((race, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {race.date}
                          </TableCell>
                          <TableCell>{race.place}</TableCell>
                          <TableCell>{race.discipline}</TableCell>
                          <TableCell>{race.category}</TableCell>
                          <TableCell>{race.position || "N/A"}</TableCell>
                          <TableCell>{race.fisPoints || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <div className="text-center text-gray-600 py-12">
              <p>Henter løpdata...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
