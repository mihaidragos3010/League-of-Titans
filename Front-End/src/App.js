import React, { useState, useEffect, useRef } from "react";
import LoginRegisterForm from "./components/LoginRegisterForm";
import LocationList from "./components/LocationList";
import ScheduleMatch from "./components/ScheduleMatch";
import MatchesList from "./components/MatchesList";
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import "@arcgis/core/assets/esri/themes/light/main.css";
// import { distance, union } from "@arcgis/core/geometry/geometryEngine";
import { project, load } from "@arcgis/core/geometry/projection";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Profile from "./components/Profile";

import ReactDOM from "react-dom";

import { fetchMatches, applyFilters } from "./components/MatchesList"; // Asigură-te că exporturile sunt disponibile

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

    const [shouldCenterMap, setShouldCenterMap] = useState(false);

    const userLocationGraphicRef = useRef(null);

    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handlePointClick = (location) => {
        setSelectedLocation(location);
    };


    esriConfig.apiKey =
        "AAPTxy8BH1VEsoebNVZXo8HurIeLEqyeZ51opCd1uf2DV8q1ZQ97sld5RzhQfBQ4aenHPGnY53eFIwzjIqjRmELP1DIUHq1mtOxRFE6mO__2UbGjwoNrSm0HH0Wbms9nRYDy5qM3Ksfs7Dh265Uzd6fDHOSnJJlRGY_Cu9YkibhlQb82HJFmrIC5jnMwbGkKK4LQ_EOHCxmLvRxB4Ww9pXg7Si9iFLeny9HdI1_XhvyEJ2c.AT1_zAYPwv8h";

    const createBufferGraphic = (longitude, latitude, radius = 500, location = null) => {
        const point = new Point({
            longitude: longitude,
            latitude: latitude,
            spatialReference: { wkid: 4326 }, // WGS84
        });

        // Proiectează punctul în Web Mercator
        const projectedPoint = project(point, new SpatialReference({ wkid: 3857 }));

        if (!projectedPoint) {
            console.error("Failed to project point for buffer:", point);
            return null;
        }

        // Creează bufferul folosind punctul proiectat
        const bufferGeometry = geometryEngine.buffer(projectedPoint, radius, "meters");

        const bufferSymbol = new SimpleFillSymbol({
            color: [255, 255, 255, 0], // Transparent
            outline: {
                color: [0, 0, 0, 0], // Fără contur
                width: 0,
            },
        });

        return new Graphic({
            geometry: bufferGeometry,
            symbol: bufferSymbol,
            attributes: location, // Atributele locației pentru identificare
        });
    };



    const createPointGraphic = (longitude, latitude, color = [255, 0, 0], outlineColor = [0, 0, 0], outlineWidth = 1.5, location = null) => {
        if (!longitude || !latitude) {
            console.error("Invalid coordinates for point graphic:", location);
            return null;
        }

        const point = new Point({
            longitude: longitude,
            latitude: latitude,
        });

        const symbol = new SimpleMarkerSymbol({
            color: color,
            size: 14,
            outline: {
                color: outlineColor,
                width: outlineWidth,
            },
        });

        return new Graphic({
            geometry: point,
            symbol: symbol,
            attributes: location, // Atributele locației pentru identificare
        });
    };




    // esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurIeLEqyeZ51opCd1uf2DV8q1ZQ97sld5RzhQfBQ4aenHPGnY53eFIwzjIqjRmELP1DIUHq1mtOxRFE6mO__2UbGjwoNrSm0HH0Wbms9nRYDy5qM3Ksfs7Dh265Uzd6fDHOSnJJlRGY_Cu9YkibhlQb82HJFmrIC5jnMwbGkKK4LQ_EOHCxmLvRxB4Ww9pXg7Si9iFLeny9HdI1_XhvyEJ2c.AT1_zAYPwv8h"

    useEffect(() => {
        if (isLoggedIn && mapRef.current) {
            //console.log("Initializing map...");

            const map = new Map({ basemap: "topo-vector" });

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
            //console.log("Graphics layer added to the map:", graphicsLayerRef.current);

            //console.log("MapView created. Adding GraphicsLayer.");

            view.ui.components = view.ui.components.filter(
                (component) => component !== "zoom"
            );

            //console.log("Removed default zoom controls.");

            // Listener pentru click-uri pe hartă
            view.on("click", async (event) => {
                try {
                    const response = await view.hitTest(event);

                    if (response.results.length > 0) {
                        const graphic = response.results.find(
                            (result) => result.graphic.layer === graphicsLayerRef.current
                        )?.graphic;

                        if (graphic) {
                            const location = graphic.attributes;

                            // Evită modificările redundante ale stării
                            if (selectedLocation?.id !== location.id) {
                                //console.log("Clicked location:", location);
                                setSelectedLocation(location);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error during hitTest or click handling:", error);
                }
            });




            // Urmărește locația utilizatorului
            const stopTracking = trackUserLocation(graphicsLayer);

            //console.log("Started tracking user location.");

            return () => {
                stopTracking();
                view.destroy();
                //console.log("Cleaned up MapView.");
            };
        } else {
            //console.log("Map initialization skipped or map already initialized.");
        }
    }, [isLoggedIn]);

    // MAP FUNCTIONS
    const handleFiltersApplied = async (filteredMatches) => {
        if (!graphicsLayerRef.current) {
            console.error("GraphicsLayer is not initialized.");
            return;
        }

        const userLocationGraphic = userLocationGraphicRef.current;

        // Păstrează userLocationGraphic și elimină toate celelalte
        if (userLocationGraphic) {
            graphicsLayerRef.current.graphics = graphicsLayerRef.current.graphics.filter(
                (graphic) => graphic === userLocationGraphic
            );
        } else {
            graphicsLayerRef.current.removeAll();
        }

        const locationsMap = locations.reduce((acc, loc) => {
            acc[loc.id] = loc;
            return acc;
        }, {});

        // Creează un set pentru locațiile care au meciuri
        const locationsWithMatches = new Set(filteredMatches.map((match) => match.match.locationId));

        // Parcurge toate locațiile și actualizează culorile
        locations.forEach((location) => {
            const longitude = parseFloat(location.longitude);
            const latitude = parseFloat(location.latitude);

            if (isNaN(longitude) || isNaN(latitude)) {
                console.warn("Skipping location with invalid coordinates:", location);
                return;
            }

            let color = OCCUPATION_STATUS_COLORS.AVAILABLE; // Implicit, verde
            if (locationsWithMatches.has(location.id)) {
                const filteredLocationMatches = filteredMatches.filter(
                    (match) => match.match.locationId === location.id
                );

                const totalPlayers = filteredLocationMatches.reduce(
                    (sum, match) => sum + match.nr_team1_players + match.nr_team2_players,
                    0
                );
                const maxPlayers = filteredLocationMatches.reduce(
                    (sum, match) => sum + match.team1.maxPlayers + match.team2.maxPlayers,
                    0
                );

                if (totalPlayers === maxPlayers) {
                    color = OCCUPATION_STATUS_COLORS.OCCUPIED;
                } else {
                    color = OCCUPATION_STATUS_COLORS.WAITING;
                }
            }

            // const pointGraphic = createPointGraphic(longitude, latitude, color);
            const pointGraphic = createPointGraphic(longitude, latitude, color, [0, 0, 0], 1.5, location);
            // Creează bufferul invizibil
            const bufferGraphic = createBufferGraphic(longitude, latitude, 500, location);

            // Adaugă punctul și bufferul în GraphicsLayer
            if (pointGraphic) graphicsLayerRef.current.add(pointGraphic);
            if (bufferGraphic) graphicsLayerRef.current.add(bufferGraphic);

        });
    };


    const handleLocationsFetched = async (fetchedLocations) => {
        if (!graphicsLayerRef.current) {
            console.error("GraphicsLayer is not initialized.");
            return;
        }

        const userLocationGraphic = userLocationGraphicRef.current;
        const currentGraphics = new Map(); // Stocăm graficile curente pe baza location.id

        // Adăugați toate graficele curente într-un Map
        graphicsLayerRef.current.graphics.forEach((graphic) => {
            if (graphic.attributes && graphic.attributes.locationId) {
                currentGraphics.set(graphic.attributes.locationId, graphic);
            }
        });

        try {
            const matches = await fetchMatches();

            for (const location of fetchedLocations) {
                const longitude = parseFloat(location.longitude);
                const latitude = parseFloat(location.latitude);

                if (isNaN(longitude) || isNaN(latitude)) {
                    console.error("Invalid coordinates:", location);
                    continue;
                }

                const filteredMatches = applyFilters(matches, { locationId: location.id });

                let color = OCCUPATION_STATUS_COLORS.AVAILABLE;

                if (filteredMatches.length === 0) {
                    color = OCCUPATION_STATUS_COLORS.AVAILABLE;
                } else if (
                    filteredMatches.some((match) => {
                        const totalPlayers =
                            match.nr_team1_players + match.nr_team2_players;
                        return totalPlayers === match.team1.maxPlayers + match.team2.maxPlayers;
                    })
                ) {
                    color = OCCUPATION_STATUS_COLORS.OCCUPIED;
                } else {
                    color = OCCUPATION_STATUS_COLORS.WAITING;
                }

                // Verificăm dacă acest punct există deja și dacă trebuie actualizat
                const existingGraphic = currentGraphics.get(location.id);
                if (existingGraphic) {
                    if (
                        existingGraphic.attributes.color !== color ||
                        existingGraphic.geometry.longitude !== longitude ||
                        existingGraphic.geometry.latitude !== latitude
                    ) {
                        // Actualizăm graficul existent
                        existingGraphic.attributes.color = color;
                        existingGraphic.geometry.longitude = longitude;
                        existingGraphic.geometry.latitude = latitude;
                    }
                    // Eliminăm din lista de procesare (rămânem doar cu punctele noi)
                    currentGraphics.delete(location.id);
                } else {
                    // Adăugăm un punct nou dacă nu există
                    // const pointGraphic = createPointGraphic(longitude, latitude, color);

                    const pointGraphic = createPointGraphic(longitude, latitude, color, [0, 0, 0], 1.5, location);
                    const bufferGraphic = createBufferGraphic(longitude, latitude, 500, location);

                    graphicsLayerRef.current.add(pointGraphic);
                    graphicsLayerRef.current.add(bufferGraphic);
                }
            }

            // Eliminăm punctele care nu mai sunt relevante
            // currentGraphics.forEach((graphic, locationId) => {
            //     graphicsLayerRef.current.remove(graphic);
            // });

            // Actualizează locațiile în state pentru a le partaja cu MatchesList
            setLocations(fetchedLocations);

            // Re-adaugă locația utilizatorului la sfârșitul procesului
            if (userLocationGraphic) {
                graphicsLayerRef.current.add(userLocationGraphic);
            }
        } catch (error) {
            console.error("Error fetching matches or processing locations:", error);
        }
    };



    const updateUserLocation = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        //console.log(`Updated location: ${latitude}, ${longitude}`);
        setUserLocation({
            latitude,
            longitude,
            spatialReference: { wkid: 4326 }, // Add spatial reference
        });

        const userLocationPoint = new Point({
            longitude: longitude,
            latitude: latitude,
            spatialReference: { wkid: 4326 }, // Set WGS84 spatial reference
        });

        if (userLocationGraphicRef.current) {
            //console.log("Updating existing user location graphic.");
            userLocationGraphicRef.current.geometry = userLocationPoint;
        } else {
            //console.log("Creating a new user location graphic.");
            const userGraphic = new Graphic({
                geometry: userLocationPoint,
                symbol: new SimpleMarkerSymbol({
                    color: [0, 0, 255], // Blue color for user location
                    size: 14,
                    outline: { color: "black", width: 1.5 },
                }),
            });
            userLocationGraphicRef.current = userGraphic;
        }

        if (graphicsLayerRef.current) {
            graphicsLayerRef.current.add(userLocationGraphicRef.current);
        }

        if (shouldCenterMap && viewRef.current) {
            viewRef.current
                .goTo([longitude, latitude], { zoom: 15 })
                .then(() => console.log("Map centered on user location."))
                .catch((error) => console.error("Error centering on user location:", error));
            setShouldCenterMap(false);
        }
    };


    const trackUserLocation = (graphicsLayer) => {
        //console.log("Starting to track user location...");

        const updateUserLocationWrapper = (position) => {
            try {
                updateUserLocation(position); // Actualizăm locația
            } catch (error) {
                console.error("Error in updateUserLocation:", error);
            }
        };

        const handleError = (error) => {
            console.error(`Geolocation error: ${error.message}`);
        };

        const watchId = navigator.geolocation.watchPosition(
            updateUserLocationWrapper,
            handleError,
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000,
            }
        );

        return () => {
            //console.log("Stopping location tracking.");
            navigator.geolocation.clearWatch(watchId);

            if (userLocationGraphicRef.current && graphicsLayerRef.current) {
                graphicsLayerRef.current.remove(userLocationGraphicRef.current);
                //console.log("Removed user location graphic from graphics layer.");
            }
        };
    };


    const clearFilteredPoints = () => {
        if (!graphicsLayerRef.current) {
            console.error("GraphicsLayer is not initialized.");
            return;
        }

        // Preserve the user's location graphic
        const userLocationGraphic = userLocationGraphicRef.current;
        graphicsLayerRef.current.removeAll();

        if (userLocationGraphic) {
            graphicsLayerRef.current.add(userLocationGraphic);
        }

        //console.log("Filtered points removed from the map.");
    };

    async function filterLocations(userLocation, locations, radius) {
        if (!locations || locations.length === 0) {
            console.error("No locations available to filter.");
            return [];
        }

        if (!userLocation || !userLocation.spatialReference) {
            console.error("User location is missing spatial reference.");
            return [];
        }

        await load(); // Ensure the projection module is loaded

        const webMercatorSR = new SpatialReference({ wkid: 3857 });
        const projectedUserLocation = project(
            new Point({
                longitude: userLocation.longitude,
                latitude: userLocation.latitude,
                spatialReference: userLocation.spatialReference,
            }),
            webMercatorSR
        );

        return locations.filter((location) => {
            if (!location.geometry && location.longitude && location.latitude) {
                location.geometry = {
                    type: "point",
                    x: location.longitude,
                    y: location.latitude,
                    spatialReference: { wkid: 4326 },
                };
            }

            if (!location.geometry) {
                console.warn("Skipping location with missing geometry or coordinates:", location);
                return false;
            }

            const projectedLocation = project(location.geometry, webMercatorSR);
            if (!projectedLocation) {
                console.warn("Projection failed for location:", location);
                return false;
            }

            const distanceInMeters = geometryEngine.distance(projectedUserLocation, projectedLocation, "meters");
            const distanceInKilometers = distanceInMeters / 1000;

            //console.log(`Distance to ${location.name}: ${distanceInKilometers.toFixed(2)} km`);

            if (distanceInKilometers <= radius) {
                //console.log(`${location.name} is within the range of ${radius} km`);

                // Add a point with a bold contour for locations within the range
                const pointGraphic = createPointGraphic(
                    location.geometry.x,
                    location.geometry.y,
                    [0, 255, 0],    // Green fill color
                    [40, 90, 255],    // Blue outline
                    8               // Thicker outline
                );

                graphicsLayerRef.current.add(pointGraphic);

                return true;
            } else {
                // Add a regular point for locations outside the range
                const pointGraphic = createPointGraphic(
                    location.geometry.x,
                    location.geometry.y,
                    [255, 0, 0],    // Red fill color
                    [0, 0, 0],      // Black outline
                    1.5             // Standard outline
                );

                graphicsLayerRef.current.add(pointGraphic);

                return false;
            }
        });
    }




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
                    <header
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px",
                            background: "#f8f9fa",
                        }}
                    >
                        <h1>League of titans</h1>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: "10px",
                                background: "#007BFF",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Logout
                        </button>
                    </header>
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
                        {[
                            { key: "locations", label: "Location List" },
                            { key: "matches", label: "Matches List" },
                            { key: "profile", label: "Profile" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor:
                                        activeTab === tab.key ? "#0056b3" : "#007BFF",
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
                                setActiveTab={setActiveTab} // Pass setActiveTab
                            />
                        )}
                        {activeTab === "matches" && (
                            <MatchesList
                                filterLocationId={localStorage.getItem("filterLocationId")}
                                onFiltersApplied={handleFiltersApplied}
                                locations={locations}
                            />
                        )}
                        {activeTab === "profile" && <Profile />}
                    </div>
                </div>

                {/* Right Side: Map */}
                <div
                    ref={mapRef}
                    style={{ flex: "2", height: "100%", position: "relative" }}
                >

                    {/* Pop-up */}
                    {selectedLocation &&
                        ReactDOM.createPortal(
                            <div
                                style={{
                                    position: "absolute",
                                    top: "20%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    backgroundColor: "white",
                                    padding: "20px",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    borderRadius: "8px",
                                    zIndex: 10,
                                }}
                            >
                                <h3>Location Details</h3>
                                <p><strong>Name:</strong> {selectedLocation.name}</p>
                                <p><strong>ID:</strong> {selectedLocation.id}</p>
                                <button
                                    onClick={() => setSelectedLocation(null)}
                                    style={{
                                        marginTop: "10px",
                                        padding: "10px 20px",
                                        backgroundColor: "#007BFF",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Close
                                </button>
                            </div>,
                            document.getElementById("popup-container")
                        )}


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
                            onClick={() => {
                                clearFilteredPoints(); // Clear existing filtered points before adding new ones

                                if (userLocation && locations.length > 0) {
                                    const filtered = filterLocations(userLocation, locations, radius);
                                    //console.log("Filtered locations:", filtered);
                                } else {
                                    console.error("User location or locations data is missing.");
                                    alert("Please ensure user location and locations data are available.");
                                }
                            }}
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

                        <button
                            onClick={clearFilteredPoints}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: "#FF4136", // Red color for the remove button
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "4px",
                                width: "100%",
                                marginTop: "10px", // Add spacing above the button
                            }}
                        >
                            Remove Filtered Points
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
                                    //console.log("Focusing on user location:", userLocation);
                                    setShouldCenterMap(true); // Activează centrarea
                                    viewRef.current
                                        .goTo({
                                            target: [userLocation.longitude, userLocation.latitude],
                                            zoom: 15,
                                        })
                                        .catch((error) => {
                                            console.error("Error centering on user location:", error);
                                        });
                                } else {
                                    console.error("User location not available.");
                                    alert(
                                        "User location not available. Make sure location tracking is enabled."
                                    );
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
