import React, { useState, useEffect, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
} from "react-simple-maps";
import "./MapChart.css";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const homeCoordinates: [number, number, number] = [100, -40, 0];

const MapChart: React.FC = () => {
  const [visitedCountries, setVisitedCountries] = useState<string[]>(
    localStorage.getItem("visitedCountries")
      ? JSON.parse(localStorage.getItem("visitedCountries") || "")
      : []
  );
  const [rotation, setRotation] =
    useState<[number, number, number]>(homeCoordinates);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    setIsDragging(true);
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const handleMouseMove = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    if (isDragging) {
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      setRotation([rotation[0] + deltaX / 2, rotation[1] - deltaY / 2, 0]);
      setMouseX(event.clientX);
      setMouseY(event.clientY);
    }
  };

  const handleResetClick = () => {
    setRotation(homeCoordinates); // Set the rotation to the coordinates of the location you want to center the map on
  };

  const handleCountryClick = (geo: any) => {
    const country = geo.properties.name;
    console.log(country);
    if (visitedCountries.includes(country)) {
      setVisitedCountries(
        visitedCountries.filter((visitedCountry) => visitedCountry !== country)
      );
    } else {
      setVisitedCountries([...visitedCountries, country]);
    }
    localStorage.setItem("visitedCountries", JSON.stringify(visitedCountries));
  };

  useEffect(() => {
    console.log("visitedCountries:", visitedCountries);
    localStorage.setItem("visitedCountries", JSON.stringify(visitedCountries));
  }, [visitedCountries]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="container">
      <ComposableMap
        projection="geoOrthographic"
        projectionConfig={{
          rotate: rotation, // Set the rotation based on state
          scale: 200,
        }}
        height={450}
        style={{ width: "100%", height: "auto" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Sphere id="ocean" fill="#e2f9fe" stroke="#D6D6DA" strokeWidth={0.5} />
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleCountryClick(geo)}
                style={{
                  default: {
                    fill: visitedCountries.includes(geo.properties.name)
                      ? "#355C7D"
                      : "#D6D6DA",
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
      <button onClick={handleResetClick}>Reset Rotation</button>
    </div>
  );
};

export default memo(MapChart);
