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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("locations");
  const mapRef = useRef(null);
  const graphicsLayerRef = useRef(null);

  const createSquareGraphic = (centerPoint, color, size = 0.001) => {
    const { longitude, latitude } = centerPoint;

    const square = {
      type: "polygon",
      rings: [
        [
          [longitude - size, latitude - size],
          [longitude + size, latitude - size],
          [longitude + size, latitude + size],
          [longitude - size, latitude + size],
          [longitude - size, latitude - size],
        ],
      ],
    };

    const symbol = new SimpleFillSymbol({
      color: color,
      outline: {
        color: "black",
        width: 1,
      },
    });

    return new Graphic({
      geometry: new Polygon(square),
      symbol: symbol,
    });
  };

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
        width: 2,
      },
    });

    return new Graphic({
      geometry: point,
      symbol: symbol,
    });
  };

  useEffect(() => {
    if (isLoggedIn && mapRef.current && !mapRef.current.hasChildNodes()) {
      const map = new Map({ basemap: "topo-vector" });

      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [26.1025, 44.4268],
        zoom: 13,
      });

      const graphicsLayer = new GraphicsLayer();
      graphicsLayerRef.current = graphicsLayer;
      map.add(graphicsLayer);

      const squares = [
        {
          color: [255, 0, 0, 0.5],
          center: { longitude: 26.1, latitude: 44.43 },
        },
        {
          color: [255, 255, 0, 0.5],
          center: { longitude: 26.105, latitude: 44.43 },
        },
        {
          color: [0, 255, 0, 0.5],
          center: { longitude: 26.11, latitude: 44.43 },
        },
      ];

      squares.forEach((square) => {
        const graphic = createSquareGraphic(square.center, square.color);
        graphicsLayer.add(graphic);
      });
    }
  }, [isLoggedIn]);

  const handleLocationsFetched = (locations) => {
    if (graphicsLayerRef.current) {
      locations.forEach((location) => {
        // Swap latitude and longitude
        const longitude = parseFloat(location.latitude); // Longitude should take latitude's value
        const latitude = parseFloat(location.longitude); // Latitude should take longitude's value

        if (!isNaN(longitude) && !isNaN(latitude)) {
          const pointGraphic = createPointGraphic(longitude, latitude);
          graphicsLayerRef.current.add(pointGraphic);
        } else {
          console.error("Invalid coordinates:", location);
        }
      });
    } else {
      console.error("GraphicsLayer is not initialized.");
    }
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <LoginRegisterForm onLogin={() => setIsLoggedIn(true)} />;
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
          {/* Horizontal Tabs */}
          <div
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
              { key: "schedule", label: "Schedule Match" },
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
              <LocationList onLocationsFetched={handleLocationsFetched} />
            )}
            {activeTab === "matches" && <MatchesList />}
            {activeTab === "schedule" && <ScheduleMatch />}
          </div>
        </div>

        {/* Right Side: Map */}
        <div ref={mapRef} style={{ flex: "2", height: "100%" }}></div>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
};

export default App;
