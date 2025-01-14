import React, { useState } from "react";

const ScheduleMatch = ({ locationId }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // Step 1: Create the match
      const matchResponse = await fetch("localhost:8080/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId,
          name,
          startDate,
          endDate,
        }),
        credentials: "include", // Allow cookies
      });

      if (!matchResponse.ok) {
        const matchError = await matchResponse.text();
        throw new Error(matchError || "Failed to schedule the match.");
      }

      const matchId = await matchResponse.text(); // Match ID is returned as plain text

      // Step 2: Create the required number of teams for the match
      const teamPromises = Array.from({ length: 2 }).map(() => {
        return fetch("localhost:8080/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            matchId,
            maxPlayers: 10, // Example value, can be adjusted
          }),
        });
      });

      const teamResponses = await Promise.all(teamPromises);
      const failedTeams = teamResponses.filter((response) => !response.ok);

      if (failedTeams.length > 0) {
        throw new Error("Failed to create all teams for the match.");
      }

      setMessage("Match and teams scheduled successfully!");
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Match Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location ID:</label>
          <input
            type="text"
            value={locationId}
            readOnly
            style={{ backgroundColor: "#f0f0f0" }} // Indicate it's read-only
          />
        </div>
        <button type="submit">Schedule Match</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ScheduleMatch;
