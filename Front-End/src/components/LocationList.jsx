import React, { useState, useEffect, useRef } from "react";
import ScheduleMatch from "./ScheduleMatch";

const LocationList = ({ onLocationsFetched, tabLineRef, setActiveTab }) => {
  const [locations, setLocations] = useState([]);
  const [matches, setMatches] = useState([]); // Store matches for the selected location
  const [selectedLocation, setSelectedLocation] = useState(null); // Track selected location
  const [showScheduleForm, setShowScheduleForm] = useState(false); // Track if the schedule form is visible
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 }); // Track popup position
  const [error, setError] = useState("");
  const listRef = useRef(null); // Reference to the locations list

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/locations", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setLocations(data);

        if (onLocationsFetched) {
          onLocationsFetched(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch locations. Please try again later.");
      }
    };

    fetchLocations();
  }, [onLocationsFetched]);

  const handleLocationClick = async (location) => {
    setSelectedLocation(location);
    setShowScheduleForm(false); // Hide the form when selecting a new location

    // Fetch matches for the selected location
    try {
      const response = await fetch(
        `http://localhost:8080/api/matches/${location.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Await the JSON response

      // Filter matches to include only those after the current time
      const now = new Date();
      const upcomingMatches = data.filter(
        (match) => new Date(match.match.startDate) > now
      );

      // Sort matches in chronological order
      upcomingMatches.sort(
        (a, b) => new Date(a.match.startDate) - new Date(b.match.startDate)
      );

      // Limit to the latest 3 matches
      setMatches(upcomingMatches.slice(0, 3));
    } catch (err) {
      console.error("Fetch error for matches:", err);
      setMatches([]); // Clear matches if there’s an error
    }

    if (tabLineRef?.current) {
      const tabLineRect = tabLineRef.current.getBoundingClientRect();

      setPopupPosition({
        top: tabLineRect.bottom + 10, // Slightly below the tab line
        left: tabLineRect.right, // Align with the tab line
      });
    }
  };

  const handleScheduleButtonClick = () => {
    setShowScheduleForm(true); // Show the form when clicking "Schedule Game"
  };

  const handleClosePopup = () => {
    setSelectedLocation(null); // Close the popup
    setShowScheduleForm(false);
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Scrollable Locations List */}
      <div
        ref={listRef} // Attach the ref to the list container
        style={{
          flex: "1",
          maxHeight: "100%",
          overflowY: "auto",
          borderRight: "1px solid #ddd",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Available Fields</h2>
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {locations.map((location) => (
            <li
              key={location.id}
              onClick={() => handleLocationClick(location)}
              style={{
                cursor: "pointer",
                padding: "8px",
                marginBottom: "8px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <strong>{location.name}</strong>
              <p style={{ margin: "5px 0" }}>Latitude: {location.latitude}</p>
              <p style={{ margin: "5px 0" }}>Longitude: {location.longitude}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Popup: Location Details and Schedule Form */}
      {showScheduleForm && (
        <div
          style={{
            position: "absolute",
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
            width: "300px",
            maxWidth: "calc(100vw - 20px)",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: "100",
            padding: "15px",
          }}
        >
          <button
            onClick={handleClosePopup}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              color: "#007BFF",
            }}
          >
            ✖
          </button>
          <h3>Schedule a Game</h3>
          <ScheduleMatch locationId={selectedLocation.id} />
        </div>
      )}

      {/* Matches List */}
      {selectedLocation && (
        <div
          style={{
            flex: "1",
            overflowY: "auto",
            borderTop: "1px solid #ddd",
            padding: "10px",
            background: "#f9f9f9",
          }}
        >
          {/* Location Details */}
          <div style={{ marginBottom: "20px" }}>
            <h3>{selectedLocation.name} Details</h3>
            <p style={{ margin: "3px 0" }}>
              Latitude: {selectedLocation.latitude}
            </p>
            <p style={{ margin: "3px 0" }}>
              Longitude: {selectedLocation.longitude}
            </p>
            <p style={{ margin: "3px 0" }}>ID: {selectedLocation.id}</p>
          </div>

          {/* Matches */}
          <h3>Matches at {selectedLocation.name}</h3>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {matches.length > 0 ? (
              matches.map((match) => (
                <li
                  key={match.match.id}
                  style={{
                    padding: "8px",
                    marginBottom: "8px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <strong style={{ margin: "3px 0" }}>
                    Match name: {match.match.name}
                  </strong>
                  <p style={{ margin: "3px 0" }}>
                    Start Date: {match.match.startDate}
                  </p>
                  <p style={{ margin: "3px 0" }}>
                    End Date: {match.match.endDate}
                  </p>
                  <p style={{ margin: "3px 0" }}>
                    Team 1 Spots Left:{" "}
                    {match.team1.maxPlayers - match.nr_team1_players}
                  </p>
                  <p style={{ margin: "3px 0" }}>
                    Team 2 Spots Left:{" "}
                    {match.team2.maxPlayers - match.nr_team2_players}
                  </p>
                </li>
              ))
            ) : (
              <p>No upcoming matches available.</p>
            )}
          </ul>

          {/* Schedule Game Button */}
          <button
            onClick={handleScheduleButtonClick}
            style={{
              padding: "8px 16px",
              margin: "10px 0",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Schedule Game
          </button>

          {/* Show All Matches Button */}
          <button
            onClick={() => {
              setActiveTab("matches"); // Change the active tab to "matches"
              localStorage.setItem("filterLocationId", selectedLocation.id); // Store the filter in localStorage
            }}
            style={{
              padding: "8px 16px",
              margin: "10px 0",
              backgroundColor: "#FFC107",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Show All Matches
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationList;
