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
          flexDirection: "column",
          height: "100vh",
          margin: 0,
        }}
      >
        <div
          className="tab-navigation"
          style={{ display: "flex", padding: "10px", background: "#f8f9fa" }}
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
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div
            style={{
              flex: "1",
              overflowY: "auto",
              padding: "10px",
              background: "#fff",
              borderRight: "1px solid #ddd",
            }}
          >
            {activeTab === "locations" && (
              <LocationList onLocationsFetched={handleLocationsFetched} />
            )}
            {activeTab === "schedule" && <ScheduleMatch />}
          </div>
          <div ref={mapRef} style={{ flex: "2", height: "100%" }}></div>
        </div>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
};

export default App;
