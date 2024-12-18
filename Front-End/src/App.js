import React, { useState, useEffect, useRef } from "react";
import LoginRegisterForm from "./components/LoginRegisterForm";
import LocationList from "./components/LocationList";
import ScheduleMatch from "./components/ScheduleMatch";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import "@arcgis/core/assets/esri/themes/light/main.css"; // ArcGIS CSS

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks login state
    const [activeTab, setActiveTab] = useState("locations"); // Default tab
    const mapRef = useRef(null); // Reference for the "Map Area"

    // Initialize ArcGIS MapView inside "Map Area" only once
    useEffect(() => {
        if (isLoggedIn && mapRef.current && !mapRef.current.hasChildNodes()) {
            const map = new Map({
                basemap: "topo-vector", // Options: streets, satellite, etc.
            });

            new MapView({
                container: mapRef.current, // Attach map to the "Map Area"
                map: map,
                center: [26.1025, 44.4268], // Longitude, Latitude of Bucharest
                zoom: 13, // Initial zoom level
            });
        }
    }, [isLoggedIn]);

    // Render content based on login state
    const renderContent = () => {
        if (!isLoggedIn) {
            return (
                <LoginRegisterForm
                    onLogin={() => {
                        setIsLoggedIn(true); // Update login state
                    }}
                />
            );
        }
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh", // Full viewport height
                    margin: 0,
                }}
            >
                {/* Tab Navigation */}
                <div
                    className="tab-navigation"
                    style={{
                        display: "flex",
                        padding: "10px",
                        background: "#f8f9fa",
                    }}
                >
                    <button
                        onClick={() => setActiveTab("locations")}
                        style={{
                            padding: "10px 20px",
                            marginRight: "10px",
                            backgroundColor:
                                activeTab === "locations" ? "#007BFF" : "#f0f0f0",
                            color: activeTab === "locations" ? "#fff" : "#000",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "4px",
                        }}
                    >
                        Location List
                    </button>
                    <button
                        onClick={() => setActiveTab("schedule")}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: activeTab === "schedule" ? "#007BFF" : "#f0f0f0",
                            color: activeTab === "schedule" ? "#fff" : "#000",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "4px",
                        }}
                    >
                        Schedule Match
                    </button>
                </div>

                {/* Main Container with Flexbox */}
                <div
                    style={{
                        display: "flex",
                        flex: 1, // Take all remaining space
                        overflow: "hidden",
                    }}
                >
                    {/* Left Side: Content */}
                    <div
                        style={{
                            flex: "1",
                            overflowY: "auto",
                            padding: "10px",
                            background: "#fff",
                            borderRight: "1px solid #ddd",
                        }}
                    >
                        <div className="search-bar" style={{ marginBottom: "10px" }}>
                            <input
                                type="text"
                                placeholder="Search for locations..."
                                className="search-input"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </div>
                        {/* Tab Content */}
                        {activeTab === "locations" && <LocationList />}
                        {activeTab === "schedule" && <ScheduleMatch />}
                    </div>

                    {/* Right Side: Full-Height Map */}
                    <div
                        ref={mapRef}
                        style={{
                            flex: "2",
                            height: "100%", // Full height
                        }}
                    ></div>
                </div>
            </div>
        );
    };

    return <div>{renderContent()}</div>;
};

export default App;
