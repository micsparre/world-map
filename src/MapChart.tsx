import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const MapChart: React.FC = () => {
  const [visitedCountries, setVisitedCountries] = useState<string[]>(localStorage.getItem("visitedCountries") ? JSON.parse(localStorage.getItem("visitedCountries") || "") : []);

  const handleCountryClick = (geo: any) => {
    const country = geo.properties.name;
    console.log(country);
    if (visitedCountries.includes(country)) {
      setVisitedCountries(visitedCountries.filter((visitedCountry) => visitedCountry !== country));
    } else {
      setVisitedCountries([...visitedCountries, country]);
    }
    localStorage.setItem("visitedCountries", JSON.stringify(visitedCountries))
  };

  useEffect(() => {
    console.log("visitedCountries:", visitedCountries);
    localStorage.setItem("visitedCountries", JSON.stringify(visitedCountries));
  }, [visitedCountries]);

  return (
    <ComposableMap 
    projection='geoMercator' 
    projectionConfig={{
      scale: 90,
    }}
    width={900}
    height={600}
    style={{ width: "100%", height: "auto" }} 
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo : any) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              onClick={() => handleCountryClick(geo)}
              style={{
                default: {
                  fill: visitedCountries.includes(geo.properties.name) ? "#355C7D" : "#D6D6DA",
                  outline: "#D6D6DA",
                },
                hover: {
                  fill: "#6C5B7B",
                  outline: "#2A363B",
                },
                pressed: {
                  fill: "#F67280",
                  outline: "none",
                },
              }}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;

