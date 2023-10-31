import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import React from "react";
import { Component } from "react";

interface Question {
  location: {
    longitude: string;
    latitude: string;
  };
  question: string;
}

interface MapProps {
  questions: Question[];
}

const Map: React.FC<MapProps> = ({ questions }: MapProps) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [showMap, setShowMap] = useState(false);

  const showUserLocation = () => {
    setShowMap(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude, latitude } = position.coords;
      setUserLocation([longitude, latitude]);
      if (mapRef.current) {
        mapRef.current.setCenter([longitude, latitude]);
      }
    });
  };

  useEffect(() => {
    if (!showMap || !userLocation) return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoicmFtaWRldjc3IiwiYSI6ImNsbHpodWcyaTExazkzZHM2NTN3NzlhNWYifQ.suBN9luCpHgHqqdlOpo77w";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: userLocation,
      zoom: 12,
    });

    map.on("load", () => {
      if (questions && questions.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        questions.forEach((q) => {
          const lng = parseFloat(q.location.longitude);
          const lat = parseFloat(q.location.latitude);

          bounds.extend([lng, lat]);

          new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setText(q.question))
            .addTo(map);
        });
        map.fitBounds(bounds, { padding: 50 });
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [questions, userLocation, showMap]);

  return (
    <div>
      <button onClick={showUserLocation}>Show Map</button>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default Map;
