import React, { useState } from "react";
import LoginRegisterForm from "./components/LoginRegisterForm";
import LocationList from "./components/LocationList";
import ScheduleMatch from "./components/ScheduleMatch";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks login state
  const [activeTab, setActiveTab] = useState("locations"); // Default tab

  // Render content based on login state
  const renderContent = () => {
    // if (!isLoggedIn) {
    //   console.log("Rendering LoginRegisterForm");
    //   return (
    //     <LoginRegisterForm
    //       onLogin={() => {
    //         console.log("onLogin called!"); // Debug message
    //         setIsLoggedIn(true); // Update login state
    //       }}
    //     />
    //   );
    // }
    return (
      <div style={{ padding: "20px" }}>
        {/* Tab Navigation */}
        <div style={{ marginBottom: "20px" }}>
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

        {/* Tab Content */}
        <div>
          {activeTab === "locations" && <LocationList />}
          {activeTab === "schedule" && <ScheduleMatch />}
        </div>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
};

export default App;
