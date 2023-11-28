import React, { useState, useEffect, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
} from "react-simple-maps";
import "./MapChart.css";

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
  const [tooltipCountry, setTooltipCountry] = useState<any>();

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
        <Sphere id="ocean" fill="#5eabdb" stroke="#D6D6DA" strokeWidth={0} />
        <Geographies geography={process.env.PUBLIC_URL + "/features.json"}>
          {({ geographies }) =>
            geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleCountryClick(geo)}
                onMouseEnter={() => {
                  console.log(geo);
                  setTooltipCountry(geo);
                }}
                onMouseLeave={() => {
                  setTooltipCountry(undefined);
                }}
                style={{
                  default: {
                    fill: visitedCountries.includes(geo.properties.name)
                      ? "#184d08"
                      : "#D6D6DA",
                    outline: "#D6D6DA",
                    zIndex: 0,
                  },
                  hover: {
                    fill: "#6C5B7B",
                    outline: "#2A363B",
                    zIndex: 0,
                  },
                  pressed: {
                    fill: "#F67280",
                    outline: "none",
                    zIndex: 0,
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
      <button onClick={handleResetClick}>Reset Rotation</button>
      {tooltipCountry && (
        <h2 style={{ color: "white" }}> {tooltipCountry.properties.name} </h2>
      )}
    </div>
  );
};

export default memo(MapChart);
