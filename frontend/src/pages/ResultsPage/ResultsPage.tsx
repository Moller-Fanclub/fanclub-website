import React, { useEffect, useState } from "react";
import { type RaceData } from "../../services/raceService.ts";
import PageContainer from "../../components/PageContainer.tsx";
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
          `${
            import.meta.env.VITE_API_URL || "http://localhost:3001/api"
          }/fis/all`
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
  const currentSeasonRaces = (racesBySeason[selectedSeason] || []).sort(
    (a, b) => {
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
    }
  );

  return (
    <PageContainer>
      <h1 className="mb-8 text-center text-4xl font-bold text-white drop-shadow-lg">
        Resultater og Historikk
      </h1>

      {/* Season Selector */}
      {!isLoading && (
        <div className="mb-8 flex justify-center">
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="w-[250px] bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
                  <SelectValue placeholder="Velg sesong" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-white/20 text-white">
                  {seasons.map((season) => (
                    <SelectItem key={season} value={season} className="text-white hover:bg-white/10 focus:bg-white/20 focus:text-white">
                      {season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Table with races for selected season */}
          {!isLoading && currentSeasonRaces.length > 0 && (
            <Card className="overflow-hidden bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Alle Løp - {selectedSeason} ({currentSeasonRaces.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20 hover:bg-white/5">
                        <TableHead
                          className="cursor-pointer select-none hover:bg-white/10 text-white font-semibold"
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
                          className="cursor-pointer select-none hover:bg-white/10 text-white font-semibold"
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
                          className="cursor-pointer select-none hover:bg-white/10 text-white font-semibold"
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
                          className="cursor-pointer select-none hover:bg-white/10 text-white font-semibold"
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
                          className="cursor-pointer select-none hover:bg-white/10 text-white font-semibold"
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
                          className="cursor-pointer select-none hover:bg-white/10 text-white font-semibold"
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
                        <TableRow key={index} className="border-white/20 hover:bg-white/5 transition-colors">
                          <TableCell className="font-medium text-white">
                            {race.date}
                          </TableCell>
                          <TableCell className="text-white/90">{race.place}</TableCell>
                          <TableCell className="text-white/90">{race.discipline}</TableCell>
                          <TableCell className="text-white/90">{race.category}</TableCell>
                          <TableCell className="text-white/90">{race.position || "N/A"}</TableCell>
                          <TableCell className="text-white/90">{race.fisPoints || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

      {isLoading && (
        <div className="text-center text-white py-12">
          <p className="text-xl">Henter løpdata...</p>
        </div>
      )}
    </PageContainer>
  );
};

export default ResultsPage;
