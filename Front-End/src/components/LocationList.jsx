import React, { useState, useEffect } from "react";

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch locations from the API using fetch
    const fetchLocations = async () => {
      try {
        const response = await fetch("/locations");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLocations(data);
      } catch (err) {
        setError("Failed to fetch locations. Please try again later.");
      }
    };

    fetchLocations();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Fields</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {locations.map((location) => (
          <li key={location.id}>
            <strong>{location.name}</strong>
            <p>Address: {location.address}</p>
            <p>Capacity: {location.capacity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationList;
