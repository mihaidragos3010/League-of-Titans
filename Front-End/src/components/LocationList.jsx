import React, { useState, useEffect } from "react";

const LocationList = ({ onLocationsFetched }) => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        console.log(
          "Attempting to fetch from http://localhost:8080/api/locations"
        );

        const response = await fetch("http://localhost:8080/api/locations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Fields</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {locations.map((location) => (
          <li key={location.id}>
            <strong>{location.name}</strong>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationList;
