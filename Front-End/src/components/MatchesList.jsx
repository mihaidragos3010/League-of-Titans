import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import "./MatchesList.css"; // Import custom styles
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

  
const MatchesList = ({ filterLocationId }) => {
    const [matches, setMatches] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [error, setError] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [locationId, setLocationId] = useState(filterLocationId || "");
    const [showFilters, setShowFilters] = useState(false);
  
    // Fetch matches on component mount
    useEffect(() => {
      const fetchAndSetMatches = async () => {
        const fetchedMatches = await fetchMatches();
        setMatches(fetchedMatches);
        setFilteredMatches(fetchedMatches);
      };
  
      fetchAndSetMatches();
    }, []);
  
    // Apply filters when needed
    const applyLocalFilters = useCallback(() => {
      const filtered = applyFilters(matches, {
        locationId,
        startDate,
        endDate,
      });
      setFilteredMatches(filtered);
    }, [matches, locationId, startDate, endDate]);
  
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
          </div>
        )}
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {filteredMatches.map((match) => (
            <li
              key={match.match.id}
              style={{
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
                <strong>Team 1 Spots Left:</strong>{" "}
                {match.team1.maxPlayers - match.nr_team1_players}
              </p>
              <p>
                <strong>Team 2 Spots Left:</strong>{" "}
                {match.team2.maxPlayers - match.nr_team2_players}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default MatchesList;