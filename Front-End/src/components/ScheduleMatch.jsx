import React, { useState, useEffect } from "react";
import { format } from "date-fns"; // Install with `npm install date-fns`

const ScheduleMatch = ({ locationId: initialLocationId }) => {
  const [locationId, setLocationId] = useState(initialLocationId || "");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLocationId(initialLocationId || "");
  }, [initialLocationId]);

  const formatDateTime = (datetime) => {
    return format(new Date(datetime), "yyyy-MM-dd HH:mm:ss");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const formattedStartDate = formatDateTime(startDate);
      const formattedEndDate = formatDateTime(endDate);

      // Step 1: Create the match
      const matchResponse = await fetch("http://localhost:8080/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId,
          name,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }),
        credentials: "include",
      });

      if (!matchResponse.ok) {
        const matchError = await matchResponse.text();
        throw new Error(matchError || "Failed to schedule the match.");
      }

      // Extract match ID from the response
      const rawMatchId = await matchResponse.text();
      const matchId = JSON.parse(rawMatchId); // Removes quotes
      console.log("Match created with ID:", matchId);

      // Step 2: Create two teams using the match ID
      // const teamPromises = Array.from({ length: 2 }).map((_, index) =>
      //   fetch("http://localhost:8080/api/teams", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       matchId,
      //       maxPlayers: 6,
      //     }),
      //     credentials: "include",
      //   }).then((response) => ({
      //     index: index + 1,
      //     ok: response.ok,
      //     errorText: !response.ok ? response.text() : null,
      //   }))
      // );

      // const teamResults = await Promise.all(teamPromises);

      // // Check for failed team creations
      // const failedTeams = teamResults.filter((result) => !result.ok);
      // if (failedTeams.length > 0) {
      //   const errors = await Promise.all(
      //     failedTeams.map((result) => result.errorText)
      //   );
      //   console.error("Team creation errors:", errors);
      //   throw new Error(
      //     `Failed to create ${failedTeams.length} team(s): ${errors.join(", ")}`
      //   );
      // }
      const team1Response = await fetch("http://localhost:8080/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          maxPlayers: 6,
        }),
        credentials: "include",
      });
      if (!team1Response.ok) {
        const matchError = await matchResponse.text();
        throw new Error(matchError || "Failed to create team2.");
      }
      const team2Response = await fetch("http://localhost:8080/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          maxPlayers: 6,
        }),
        credentials: "include",
      });
      if (!team2Response.ok) {
        const matchError = await matchResponse.text();
        throw new Error(matchError || "Failed to create team2.");
      }

      setMessage("Match and two teams scheduled successfully!");
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
