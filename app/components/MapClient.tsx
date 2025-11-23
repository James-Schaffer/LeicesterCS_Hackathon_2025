'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import parkJson from "../../parkingLocations.json";
import { useSearchParams } from 'next/navigation';

type ParkingSpot = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  openCloseTimes: string;
  busyHours: string[];
  prices: string;
};

export default function MapClient() {
  const searchParams = useSearchParams();
  const lat = searchParams.get('lat');
  const lon = searchParams.get('long'); 

  const latitude = lat ? parseFloat(lat) : 52.6100; // default: Leicester
  const longitude = lon ? parseFloat(lon) : -1.1140;

  useEffect(() => {
    const map = L.map('map', {
      center: [latitude,longitude],
      zoom: 15,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const parkingIcon = L.icon({
      iconUrl: '/icons/mapPinIcon.png',
      iconSize: [32, 49],
      iconAnchor: [16, 49],
      popupAnchor: [0, -49],
    });

    const parkingIcon_open = L.icon({
      iconUrl: '/icons/mapPinIcon_open.png',
      iconSize: [32, 49],
      iconAnchor: [16, 49],
      popupAnchor: [0, -49],
    });

    const parkingIcon_busy = L.icon({
      iconUrl: '/icons/mapPinIcon_busy.png',
      iconSize: [32, 49],
      iconAnchor: [16, 49],
      popupAnchor: [0, -49],
    });

    const parkingIcon_closed = L.icon({
      iconUrl: '/icons/mapPinIcon_closed.png',
      iconSize: [32, 49],
      iconAnchor: [16, 49],
      popupAnchor: [0, -49],
    });

    const spots = parkJson as ParkingSpot[];
    const nowTime = getLocalTime12h();
    const nowDay = (new Date().getDay() + 6) % 7; // Adjust to make Monday=0, Sunday=6

    console.log("Current time: "+nowTime);

    spots.forEach((spot) => {
      console.log("Checking spot: "+spot.openCloseTimes);
      console.log(spot.busyHours);
      console.log(nowDay);
      console.log(nowTime);
      var todayOpenClose = getOpenTimes(spot.openCloseTimes, nowDay);
      const isOpen = isTimeBetween(nowTime, todayOpenClose.open, todayOpenClose.close);

      const issBusy = isBusy(spot.busyHours, nowTime);

      console.log(`Spot "${spot.name}" isOpen: ${isOpen}, issBusy: ${issBusy}`);

      var txt = (
        "<b>"+spot.name+"</b><br>"
        +getOpenBusyHTML(isOpen, issBusy)+" : "+spot.prices+"<br><br>"
        +spot.description+"<br><br>"
        +spot.openCloseTimes
      );

      L.marker([spot.latitude, spot.longitude], { icon: (!isOpen ? parkingIcon_closed : (issBusy ? parkingIcon_busy : parkingIcon_open)) })
        .addTo(map)
        .bindPopup(txt);
    });

    return () => map.remove();
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
}


function getOpenBusyHTML(open: boolean, busy: boolean) {
  if (!open) {
    return '<span style="color: #ff0000; font-weight: bold;">Closed</span>';
  }
  if (busy) {
    return '<span style="color: #ec8906ff; font-weight: bold;">Open - Busy</span>';
  }
  return '<span style="color: #1cb317ff; font-weight: bold;">Open</span>';
}

function getLocalTime12h() {
  let t = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  // Example: "12:05 AM" → "00:05 AM"
  if (t.startsWith("12:") && t.includes("AM")) {
    t = t.replace(/^12:/, "00:");
  }

  return t;
}

function isTimeBetween(target:String, start:String, end:String) {
  const toMinutes = (t) => {
    const [time, modifier] = t.split(" ");
    let [h, m] = time.split(":").map(Number);

    if (modifier.toLowerCase() === "pm" && h !== 12) h += 12;
    if (modifier.toLowerCase() === "am" && h === 12) h = 0;

    return h * 60 + m;
  };

  const t = toMinutes(target);
  const s = toMinutes(start);
  const e = toMinutes(end);

  // Supports ranges that cross midnight (e.g., 10pm–2am)
  if (s < e) return s <= t && t <= e;
  return t <= s && e <= t;
}

function getOpenTimes(openCloseTimes:String, day:number) {
  const tmp = openCloseTimes.split("<br>")[day];
  const openClose = tmp.substring(tmp.indexOf(":") +2).split("-");
  return { open: openClose[0].trim(), close: openClose[1].trim() };
}


function isBusy(busyHours:String[], time:String) {
  if (busyHours.length === 0) return false;
  time = time.slice(0, 3) + "00" + time.slice(5); // Convert to nearest hour (floor)
  return busyHours.includes(time.toLowerCase());
}