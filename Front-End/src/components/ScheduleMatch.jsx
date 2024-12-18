import React, { useState } from "react";

const ScheduleMatch = () => {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [date, setDate] = useState("");
  const [locationId, setLocationId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team1,
          team2,
          date,
          locationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to schedule the match.");
      }

      setMessage("Match scheduled successfully!");
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Schedule a Match</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Team 1:</label>
          <input
            type="text"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Team 2:</label>
          <input
            type="text"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location ID:</label>
          <input
            type="text"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            required
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
