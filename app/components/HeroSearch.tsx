"use client";
import { redirect, RedirectType } from 'next/navigation' 
import { useState } from "react";

export default function HeroSearch() {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (!location.trim()) {
      setError("Please enter a location");
      return;
    }
    setError("");
    console.log("Searching for:", location);
    // Call your search API here
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        redirect(`/map?lat=${latitude}&long=${longitude}`, RedirectType.replace)
      },
      (err) => {
        setError("Unable to retrieve your location");
        console.error(err);
      }
    );
  };

  return (
    <div className="mt-8 flex flex-col items-center text-center px-4 sm:px-0">
      <p className="text-white text-lg sm:text-xl max-w-xl">
        Find parking near you quickly and easily. Enter a location or use your current location.
      </p>

      <div className="mt-4 flex flex-col sm:flex-row gap-2 w-full max-w-md">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter a city or address"
          className="flex-1 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
        />
        <button
          onClick={handleSearch}
          className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-white font-semibold"
        >
          Search
        </button>
        <button
          onClick={handleCurrentLocation}
          className="rounded-full bg-gray-600 hover:bg-gray-700 px-4 py-2 text-white font-semibold"
        >
          Use Current Location
        </button>
      </div>

      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
}
