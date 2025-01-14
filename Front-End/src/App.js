import React, { useState, useEffect, useRef } from "react";
import LoginRegisterForm from "./components/LoginRegisterForm";
import LocationList from "./components/LocationList";
import ScheduleMatch from "./components/ScheduleMatch";
import MatchesList from "./components/MatchesList";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import "@arcgis/core/assets/esri/themes/light/main.css";
import { distance, union } from "@arcgis/core/geometry/geometryEngine";



import { OCCUPATION_STATUS_COLORS } from "./MapConstants";

const App = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("user"))
    );
    const [activeTab, setActiveTab] = useState("locations");
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );
    const handleLogin = (userData) => {
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(userData)); // Save user to local storage
    };

    const handleLogout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("user"); // Remove user from local storage
    };


    const [radius, setRadius] = useState(5);
    const [userLocation, setUserLocation] = useState(null);

    const mapRef = useRef(null);
    const graphicsLayerRef = useRef(null);
    const tabLineRef = useRef(null); // Add reference for the tab line
    const viewRef = useRef(null);



    const createPointGraphic = (longitude, latitude, color = [255, 0, 0]) => {
        const point = new Point({
            longitude: longitude,
            latitude: latitude,
        });

        const symbol = new SimpleMarkerSymbol({
            color: color,
            size: 14,
            outline: {
                color: "black",
                width: 1.5,
            },
        });

        return new Graphic({
            geometry: point,
            symbol: symbol,
        });
    };

    useEffect(() => {
        if (isLoggedIn && mapRef.current) {
            console.log("Initializing map...");

            const map = new Map({ basemap: "streets-navigation-vector" });

            const view = new MapView({
                container: mapRef.current,
                map: map,
                center: [26.1025, 44.4268],
                zoom: 13,
            });

            viewRef.current = view;

            const graphicsLayer = new GraphicsLayer();
            graphicsLayerRef.current = graphicsLayer;
            map.add(graphicsLayer);

            console.log("MapView created. Adding GraphicsLayer.");

            view.ui.components = view.ui.components.filter((component) => component !== "zoom");

            console.log("Removed default zoom controls.");

            // Start tracking the user's location
            const stopTracking = trackUserLocation(graphicsLayer);

            console.log("Started tracking user location.");

            return () => {
                stopTracking();
                view.destroy();
                console.log("Cleaned up MapView.");
            };
        } else {
            console.log("Map initialization skipped or map already initialized.");
        }
    }, [isLoggedIn]);



    // MAP FUNCTIONS

    const handleLocationsFetched = (locations) => {
        if (graphicsLayerRef.current) {
            locations.forEach((location) => {
                const longitude = parseFloat(location.longitude);
                const latitude = parseFloat(location.latitude);

                if (!isNaN(longitude) && !isNaN(latitude)) {
                    const centerPoint = { longitude, latitude };
                    const pointGraphic = createPointGraphic(longitude, latitude, OCCUPATION_STATUS_COLORS.AVAILABLE);
                    graphicsLayerRef.current.add(pointGraphic);
                } else {
                    console.error("Invalid coordinates:", location);
                }
            });
        } else {
            console.error("GraphicsLayer is not initialized.");
        }
    };

    const trackUserLocation = (graphicsLayer) => {
        let userLocationGraphic = null;

        const updateUserLocation = (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log(`Updated location: ${latitude}, ${longitude}`);

            // Update the user's location in the state
            setUserLocation({
                latitude,
                longitude,
            });

            if (userLocationGraphic) {
                // Update the graphic's geometry with the new location
                userLocationGraphic.geometry = {
                    type: "point",
                    longitude: longitude,
                    latitude: latitude,
                };
            } else {
                // Create the graphic if it doesn't exist
                userLocationGraphic = new Graphic({
                    geometry: {
                        type: "point",
                        longitude: longitude,
                        latitude: latitude,
                    },
                    symbol: new SimpleMarkerSymbol({
                        color: [0, 0, 255], // Blue for the user's location
                        size: 14,
                        outline: {
                            color: "black",
                            width: 1.5,
                        },
                    }),
                });

                graphicsLayer.add(userLocationGraphic);
            }
        };

        const handleError = (error) => {
            console.error(`Geolocation error: ${error.message}`);
        };

        // Start watching the user's location
        const watchId = navigator.geolocation.watchPosition(
            updateUserLocation,
            handleError,
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000,
            }
        );

        // Cleanup function
        return () => {
            navigator.geolocation.clearWatch(watchId);
            if (userLocationGraphic) {
                graphicsLayer.remove(userLocationGraphic);
            }
        };
    };


    const filterLocations = () => {
        if (!graphicsLayerRef.current || !viewRef.current) return;

        const graphics = graphicsLayerRef.current.graphics.items;
        const userLocation = graphics.find(
            (graphic) => graphic.symbol.color[2] === 255
        );

        if (!userLocation) {
            console.error("User location not found.");
            return;
        }

        const filteredGraphics = graphics.filter((graphic) => {
            if (graphic === userLocation) return false;

            const distance = distance(
                userLocation.geometry,
                graphic.geometry,
                "kilometers"
            );

            return distance <= radius;
        });

        graphicsLayerRef.current.removeAll();
        filteredGraphics.forEach((graphic) => graphicsLayerRef.current.add(graphic));
        graphicsLayerRef.current.add(userLocation);

        if (filteredGraphics.length > 0) {
            const geometries = filteredGraphics.map((graphic) => graphic.geometry);
            const extent = union(geometries).extent.expand(1.5);
            // viewRef.current.goTo(extent);
            viewRef.current.goTo({
                target: userLocation.geometry,
                zoom: 15, // Optional: Set a specific zoom level
            }).catch((error) => {
                console.error("Error focusing view:", error);
            });

        }
    };



    // RENDER FUNCTIONS

    const renderContent = () => {
        if (!isLoggedIn) {
            return <LoginRegisterForm onLogin={handleLogin} />;
        }
        return (
            <div
                style={{
                    display: "flex",
                    height: "100vh",
                    margin: 0,
                }}
            >
                {/* Left Side: Content and Tabs */}
                <div
                    style={{
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                        borderRight: "2px solid #ddd",
                        background: "#fff",
                    }}
                >
                    {/* Tab Navigation */}
                    <div
                        ref={tabLineRef}
                        className="tab-navigation"
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            background: "#007BFF",
                            padding: "10px 0",
                            borderBottom: "2px solid #0056b3",
                        }}
                    >
                        {[{ key: "locations", label: "Location List" }, { key: "matches", label: "Matches List" }, { key: "schedule", label: "Schedule Match" }].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: activeTab === tab.key ? "#0056b3" : "#007BFF",
                                    color: "#fff",
                                    fontSize: "16px",
                                    fontWeight: activeTab === tab.key ? "bold" : "normal",
                                    border: "none",
                                    cursor: "pointer",
                                    borderRadius: "0",
                                    transition: "background-color 0.3s ease",
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
                        {activeTab === "locations" && (
                            <LocationList
                                onLocationsFetched={handleLocationsFetched}
                                tabLineRef={tabLineRef}
                            />
                        )}
                        {activeTab === "matches" && <MatchesList />}
                        {activeTab === "schedule" && <ScheduleMatch />}
                    </div>
                </div>

                {/* Right Side: Map */}
                <div ref={mapRef} style={{ flex: "2", height: "100%", position: "relative" }}>
                    {/* Filter Box */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "10px",
                            background: "#fff",
                            padding: "10px",
                            borderRadius: "4px",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                            zIndex: 5, // Ensure it doesn’t interfere with ArcGIS UI
                            textAlign: "center",
                            width: "200px",
                        }}
                    >
                        <p style={{ margin: "0 0 10px", fontSize: "14px", color: "#333" }}>
                            Filter Locations
                        </p>
                        <input
                            type="number"
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                            style={{
                                marginBottom: "10px",
                                padding: "5px",
                                width: "100%",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                            }}
                            placeholder="Radius (km)"
                        />
                        <button
                            onClick={filterLocations}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: "#007BFF",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "4px",
                                width: "100%",
                            }}
                        >
                            Filter
                        </button>
                    </div>

                    {/* Zoom Buttons */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "10px",
                            right: "10px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            zIndex: 10,
                        }}
                    >
                        {/* Center on user location button */}
                        <button
                            className="esri-widget esri-widget--button esri-interactive"
                            style={{ marginBottom: "5px" }}
                            title="Center on user location"
                            onClick={() => {
                                if (userLocation) {
                                    console.log("Focusing on user location:", userLocation);
                                    viewRef.current.goTo({
                                        target: [userLocation.longitude, userLocation.latitude],
                                        zoom: 15,
                                    }).catch((error) => {
                                        console.error("Error centering on user location:", error);
                                    });
                                } else {
                                    console.error("User location not available.");
                                    alert("User location not available. Make sure location tracking is enabled.");
                                }
                            }}
                        >
                            <span className="esri-icon-locate"></span>
                        </button>

                        {/* Zoom In */}
                        <button
                            className="esri-widget esri-widget--button esri-interactive"
                            style={{ marginBottom: "5px" }}
                            title="Zoom In"
                            onClick={() => (viewRef.current.zoom += 1)}
                        >
                            <span className="esri-icon-plus"></span>
                        </button>

                        {/* Zoom Out */}
                        <button
                            className="esri-widget esri-widget--button esri-interactive"
                            title="Zoom Out"
                            onClick={() => (viewRef.current.zoom -= 1)}
                        >
                            <span className="esri-icon-minus"></span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    return <div>{renderContent()}</div>;
};

export default App;
