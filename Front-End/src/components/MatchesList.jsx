import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import "./MatchesList.css"; // Import custom styles

const MatchesList = ({ filterLocationId }) => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [locationId, setLocationId] = useState("");
  const [showFilters, setShowFilters] = useState(false); // Track if filter box is visible

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/matches", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Filter matches by location_id if provided
        const filteredData = filterLocationId
          ? data.filter(
              (match) => match.locationId.toString() === filterLocationId
            )
          : data;

        setMatches(filteredData);
        setFilteredMatches(filteredData); // Initially show all matches
      } catch (err) {
        setError("Failed to fetch matches. Please try again later.");
      }
    };

    fetchMatches();
  }, [filterLocationId]);

  // Function to filter matches based on provided criteria
  const filterMatches = () => {
    const filtered = matches.filter((match) => {
      const matchStart = new Date(match.startDate);
      const matchEnd = new Date(match.endDate);

      const matchesLocation = locationId
        ? match.locationId.toString() === locationId.trim()
        : true;
      const afterStartDate = startDate ? matchStart >= startDate : true;
      const beforeEndDate = endDate ? matchEnd <= endDate : true;

      return matchesLocation && afterStartDate && beforeEndDate;
    });

    setFilteredMatches(filtered);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Matches List</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Show/Hide Filters */}
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

      {/* Filter Selection Box */}
      {showFilters && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <label>Filter by Location ID:</label>
            <input
              type="text"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              placeholder="Enter Location ID"
              style={{ marginLeft: "10px", padding: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              isClearable
              placeholderText="Select start date"
              dateFormat="yyyy-MM-dd"
              style={{ marginLeft: "10px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              isClearable
              placeholderText="Select end date"
              dateFormat="yyyy-MM-dd"
              style={{ marginLeft: "10px" }}
            />
          </div>
          <button
            onClick={filterMatches}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28A745",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Matches List */}
      <ul>
        {filteredMatches.map((match) => (
          <li key={match.id}>
            <strong>{match.id}</strong>
            <p>Location ID: {match.locationId}</p>
            <p>Start Date: {match.startDate}</p>
            <p>End Date: {match.endDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchesList;
