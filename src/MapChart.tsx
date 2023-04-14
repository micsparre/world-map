import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const MapChart: React.FC = () => {
  const [visitedCountries, setVisitedCountries] = useState<string[]>(localStorage.getItem("visitedCountries") ? JSON.parse(localStorage.getItem("visitedCountries") || "") : []);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setIsDragging(true);
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (isDragging) {
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      setRotation([rotation[0] + deltaX / 2, rotation[1] - deltaY / 2, 0]);
      setMouseX(event.clientX);
      setMouseY(event.clientY);
    }
  };

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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <ComposableMap 
    projection='geoOrthographic' 
    projectionConfig={{
      rotate: rotation, // Set the rotation based on state
      scale: 200,
    }}
    width={900}
    height={450}
    style={{ width: "100%", height: "auto" }} 
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
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

