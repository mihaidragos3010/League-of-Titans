import React, { useState, useEffect } from "react";
import { fetchLocations } from "./LocationList"; // Assume you have this function
import { fetchMatches } from "./MatchesList"; // Assume you have this function

const Profile = ({ onLogout }) => {
    const [profile, setProfile] = useState(null);
    const [locations, setLocations] = useState([]);
    const [matches, setMatches] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState("");

    // Fetch profile information on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/players/profile",
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch profile: ${response.status}`);
                }

                const profileData = await response.json();
                setProfile(profileData);

                // Check if the user is an admin
                if (profileData?.username === "admin") {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setError(
                    "Failed to fetch profile information. Please try again later."
                );
            }
        };

        fetchProfile();
    }, []);

    // Fetch locations and matches if the user is admin
    useEffect(() => {
        if (isAdmin) {
            const fetchAdminData = async () => {
                try {
                    const fetchedLocations = await fetchLocations();
                    const fetchedMatches = await fetchMatches();
                    setLocations(fetchedLocations);
                    setMatches(fetchedMatches);
                } catch (error) {
                    console.error("Error fetching admin data:", error);
                }
            };

            fetchAdminData();
        }
    }, [isAdmin]);

    const deleteLocation = async (locationId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/location?id=${locationId}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );
            if (!response.ok) {
                throw new Error(`Failed to delete location: ${response.status}`);
            }
            alert("Location deleted successfully!");
            setLocations(locations.filter((loc) => loc.id !== locationId));
        } catch (error) {
            console.error("Error deleting location:", error);
            alert("Failed to delete location.");
        }
    };

    const deleteMatch = async (matchId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/matches?id=${matchId}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );
            if (!response.ok) {
                throw new Error(`Failed to delete match: ${response.status}`);
            }
            alert("Match deleted successfully!");
            setMatches(matches.filter((match) => match.match.id !== matchId));
        } catch (error) {
            console.error("Error deleting match:", error);
            alert("Failed to delete match.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Profile</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {profile ? (
                <>
                    <p>
                        <strong>Username:</strong> {profile.username}
                    </p>
                    <p>
                        <strong>Email:</strong> {profile.email}
                    </p>
                    <p>
                        <strong>Description:</strong>{" "}
                        {profile.description || "No description"}
                    </p>

                    {isAdmin && (
                        <>
                            <h3>Admin Actions</h3>

                            {/* Locations Section */}
                            <div>
                                <h4>Locations</h4>
                                {locations.length > 0 ? (
                                    <ul>
                                        {locations.map((location) => (
                                            <li key={location.id} style={{ marginBottom: "10px" }}>
                                                <strong>{location.name}</strong> - {location.address}
                                                <button
                                                    onClick={() => deleteLocation(location.id)}
                                                    style={{
                                                        marginLeft: "10px",
                                                        padding: "5px 10px",
                                                        backgroundColor: "#dc3545",
                                                        color: "#fff",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No locations available.</p>
                                )}
                            </div>

                            {/* Matches Section */}
                            <div>
                                <h4>Matches</h4>
                                {matches.length > 0 ? (
                                    <ul>
                                        {matches.map((match) => (
                                            <li key={match.match.id} style={{ marginBottom: "10px" }}>
                                                <strong>{match.match.name}</strong> -{" "}
                                                {new Date(match.match.startDate).toLocaleString()} to{" "}
                                                {new Date(match.match.endDate).toLocaleString()}
                                                <button
                                                    onClick={() => deleteMatch(match.match.id)}
                                                    style={{
                                                        marginLeft: "10px",
                                                        padding: "5px 10px",
                                                        backgroundColor: "#dc3545",
                                                        color: "#fff",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No matches available.</p>
                                )}
                            </div>
                        </>
                    )}

                    {/* <button
            onClick={onLogout}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button> */}
                </>
            ) : (
                <p>Loading profile information...</p>
            )}
        </div>
    );
};

export default Profile;
