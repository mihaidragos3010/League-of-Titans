import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./MatchesList.css";

// Fetch matches from API
export const fetchMatches = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/matches", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
};

// Fetch locations from API
export const fetchLocations = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/locations", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

// Fetch players for a team
export const fetchPlayersForTeam = async (teamId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/players/team/${teamId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching players for team ${teamId}:`, error);
    return [];
  }
};

// Join a team
export const joinTeam = async (teamId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/teams/join/${teamId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to join team. Status: ${response.status}`);
    }

    alert("Successfully joined the team!");
  } catch (error) {
    console.error("Error joining team:", error);
    alert("Failed to join the team. Please try again.");
  }
};

// Apply filters to matches
export const applyFilters = (matches, { locationId, startDate, endDate }) => {
  return matches.filter((match) => {
    const matchStart = new Date(match.match.startDate);
    const matchEnd = new Date(match.match.endDate);

    const matchesLocation =
      locationId.trim() !== ""
        ? match.match.locationId.toString() === locationId.trim()
        : true;
    const afterStartDate = startDate ? matchStart >= startDate : true;
    const beforeEndDate = endDate ? matchEnd <= endDate : true;

    return matchesLocation && afterStartDate && beforeEndDate;
  });
};

const MatchesList = ({ filterLocationId, onFiltersApplied }) => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [locations, setLocations] = useState({});
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [locationId, setLocationId] = useState(filterLocationId || "");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);

  // Fetch matches and locations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedMatches, fetchedLocations] = await Promise.all([
          fetchMatches(),
          fetchLocations(),
        ]);

        setMatches(fetchedMatches);
        setFilteredMatches(fetchedMatches);

        const locationsMap = fetchedLocations.reduce((acc, location) => {
          acc[location.id] = location.address;
          return acc;
        }, {});
        setLocations(locationsMap);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleMatchClick = async (match) => {
    setSelectedMatch(match);
    try {
      const team1Players = await fetchPlayersForTeam(match.team1.id);
      const team2Players = await fetchPlayersForTeam(match.team2.id);

      setTeam1Players(team1Players);
      setTeam2Players(team2Players);
    } catch (error) {
      console.error("Error fetching players for selected match:", error);
    }
  };

  const applyLocalFilters = useCallback(() => {
    const filtered = applyFilters(matches, { locationId, startDate, endDate });
    setFilteredMatches(filtered);

    if (onFiltersApplied) {
      onFiltersApplied(filtered);
    }
  }, [matches, locationId, startDate, endDate, onFiltersApplied]);

  const clearFilters = () => {
    setLocationId("");
    setStartDate(null);
    setEndDate(null);
    setFilteredMatches(matches);
  };

  useEffect(() => {
    applyLocalFilters();
  }, [applyLocalFilters]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Matches List</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={() => setShowFilters(!showFilters)}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {showFilters && (
        <div style={{ marginBottom: "20px" }}>
          <label>Filter by Location ID:</label>
          <input
            type="text"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            placeholder="Enter Location ID"
            style={{ marginLeft: "10px", padding: "5px" }}
          />
          <div style={{ marginTop: "10px" }}>
            <label>Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              isClearable
              placeholderText="Select start date"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <label>End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              isClearable
              placeholderText="Select end date"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <button
            onClick={applyLocalFilters}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <h3>Matches</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {filteredMatches.map((match) => (
              <li
                key={match.match.id}
                onClick={() => handleMatchClick(match)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <strong>Match Name:</strong> {match.match.name}
                <p>
                  <strong>Start Date:</strong> {match.match.startDate}
                </p>
                <p>
                  <strong>End Date:</strong> {match.match.endDate}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {locations[match.match.locationId] || "N/A"}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          {selectedMatch ? (
            <>
              <h3>Match Details</h3>
              <p>
                <strong>Name:</strong> {selectedMatch.match.name}
              </p>
              <p>
                <strong>Start Date:</strong> {selectedMatch.match.startDate}
              </p>
              <p>
                <strong>End Date:</strong> {selectedMatch.match.endDate}
              </p>
              <p>
                <strong>Location ID:</strong> {selectedMatch.match.locationId}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {locations[selectedMatch.match.locationId] || "N/A"}
              </p>
              <p>
                <strong>Spots Left in Team 1:</strong>{" "}
                {selectedMatch.team1.maxPlayers -
                  selectedMatch.nr_team1_players}
              </p>
              <p>
                <strong>Spots Left in Team 2:</strong>{" "}
                {selectedMatch.team2.maxPlayers -
                  selectedMatch.nr_team2_players}
              </p>

              <div style={{ marginTop: "10px" }}>
                <h4>Team 1 Players:</h4>
                {team1Players.length > 0 ? (
                  <ul>
                    {team1Players.map((player, index) => (
                      <li key={index}>{player.username}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No players in Team 1.</p>
                )}
                <button
                  onClick={() => joinTeam(selectedMatch.team1.id)}
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Join Team 1
                </button>
              </div>

              <div style={{ marginTop: "10px" }}>
                <h4>Team 2 Players:</h4>
                {team2Players.length > 0 ? (
                  <ul>
                    {team2Players.map((player, index) => (
                      <li key={index}>{player.username}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No players in Team 2.</p>
                )}
                <button
                  onClick={() => joinTeam(selectedMatch.team2.id)}
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Join Team 2
                </button>
              </div>
            </>
          ) : (
            <h3>Select a match to see details.</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchesList;
