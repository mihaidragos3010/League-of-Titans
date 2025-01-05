import React, { useState, useEffect, useRef } from "react";
import ScheduleMatch from "./ScheduleMatch";

const LocationList = ({ onLocationsFetched, tabLineRef }) => {
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
        `http://localhost:8080/api/matches?locationId=${location.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Await the JSON response
      setMatches(data); // Set the matches state
    } catch (err) {
      console.error("Fetch error for matches:", err);
      setMatches([]); // Clear matches if there’s an error
    }

    if (listRef.current && tabLineRef?.current) {
      const listRect = listRef.current.getBoundingClientRect();
      const tabLineRect = tabLineRef.current.getBoundingClientRect();

      setPopupPosition({
        top: tabLineRect.bottom, // Position below the tab line with some spacing
        left: listRect.right + 10, // Position next to the locations list
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
        <h1 style={{ marginBottom: "10px" }}>Available Fields</h1>
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
      {selectedLocation && (
        <div
          style={{
            position: "absolute",
            top: `${popupPosition.top}px`, // Dynamic vertical position
            left: `${popupPosition.left}px`, // Dynamic horizontal position
            width: "300px", // Fixed width for the popup
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
          <h2 style={{ marginBottom: "8px" }}>
            {selectedLocation.name} Details
          </h2>
          <p style={{ margin: "5px 0" }}>
            Latitude: {selectedLocation.latitude}
          </p>
          <p style={{ margin: "5px 0" }}>
            Longitude: {selectedLocation.longitude}
          </p>
          <p style={{ margin: "5px 0" }}>ID: {selectedLocation.id}</p>

          <button
            onClick={handleScheduleButtonClick}
            style={{
              padding: "8px 16px",
              margin: "8px 0",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Schedule Game
          </button>

          {showScheduleForm && (
            <div style={{ marginTop: "10px" }}>
              <h3 style={{ marginBottom: "8px" }}>Schedule a Game</h3>
              <ScheduleMatch locationId={selectedLocation.id} />
            </div>
          )}
        </div>
      )}

      {/* Matches List */}
      {selectedLocation && matches.length > 0 && (
        <div
          style={{
            flex: "1",
            overflowY: "auto",
            borderTop: "1px solid #ddd",
            padding: "10px",
            background: "#f9f9f9",
          }}
        >
          <h2>Matches at {selectedLocation.name}</h2>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {matches.map((match) => (
              <li
                key={match.id}
                style={{
                  padding: "8px",
                  marginBottom: "8px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <p>Start Date: {match.startDate}</p>
                <p>End Date: {match.endDate}</p>
                <p>Location ID: {match.locationId}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationList;
