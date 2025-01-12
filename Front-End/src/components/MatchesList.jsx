import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import "./MatchesList.css"; // Import custom styles

const MatchesList = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(null); // For filtering after a start date
  const [endDate, setEndDate] = useState(null); // For filtering before an end date

  useEffect(() => {
    // Fetch locations from the API using fetch
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/matches");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMatches(data);
        setFilteredMatches(data); // Initially show all matches
      } catch (err) {
        setError("Failed to fetch matches. Please try again later.");
      }
    };

    fetchMatches();
  }, []);

  // Function to filter matches based on provided dates
  const filterMatches = () => {
    if (!startDate && !endDate) {
      // If no dates are selected, show all matches
      setFilteredMatches(matches);
      return;
    }

    const filtered = matches.filter((match) => {
      const matchStart = new Date(match.startDate);
      const matchEnd = new Date(match.endDate);

      // Conditions for filtering
      const afterStartDate = startDate ? matchStart >= startDate : true;
      const beforeEndDate = endDate ? matchEnd <= endDate : true;

      return afterStartDate && beforeEndDate;
    });

    setFilteredMatches(filtered);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Matches List</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Date Filters */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "20px" }}>
        <div>
          <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            isClearable
            placeholderText="Select start date"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div>
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
          onClick={filterMatches}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Filter
        </button>
      </div>

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
  // return (
  //   <div style={{ padding: "20px" }}>
  //     <h1>Available Matches</h1>
  //     {error && <p style={{ color: "red" }}>{error}</p>}
  //     <ul>
  //       {matches.map((matches) => (
  //         <li key={matches.id}>
  //           <strong>{matches.id}</strong>
  //           <p>locationId: {matches.locationId}</p>
  //           <p>startDate: {matches.startDate}</p>
  //           <p>endDate: {matches.endDate}</p>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
};

export default MatchesList;
