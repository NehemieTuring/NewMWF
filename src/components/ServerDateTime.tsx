"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./ServerDateTime.module.css";

interface ServerTimeData {
  dateTime: string;
  timestamp: number;
  timezone: string;
  formatted: string;
}

interface ServerDateTimeProps {
  white?: boolean;
}

export default function ServerDateTime({ white }: ServerDateTimeProps) {
  const [serverTime, setServerTime] = useState<ServerTimeData | null>(null);
  const [displayTime, setDisplayTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const offsetRef = useRef<number>(0);

  useEffect(() => {
    async function fetchServerTime() {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
        const res = await fetch(`${API_BASE_URL}/system/time`);
        if (!res.ok) throw new Error("Failed to fetch server time");
        const data: ServerTimeData = await res.json();
        setServerTime(data);

        // Calculate offset between server time and client time
        const serverDate = new Date(data.dateTime);
        const clientNow = new Date();
        offsetRef.current = serverDate.getTime() - clientNow.getTime();
        setDisplayTime(serverDate);
        setError(false);
      } catch (err) {
        console.error("Failed to fetch server time:", err);
        setError(true);
        // Fallback to client time
        setDisplayTime(new Date());
        offsetRef.current = 0;
      } finally {
        setLoading(false);
      }
    }

    fetchServerTime();

    // Re-sync with server every 5 minutes
    const syncInterval = setInterval(fetchServerTime, 5 * 60 * 1000);
    return () => clearInterval(syncInterval);
  }, []);

  // Live-tick the clock every second using the offset
  useEffect(() => {
    const tickInterval = setInterval(() => {
      const now = new Date(Date.now() + offsetRef.current);
      setDisplayTime(now);
    }, 1000);
    return () => clearInterval(tickInterval);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonLine}></div>
          <div className={styles.skeletonLineShort}></div>
        </div>
      </div>
    );
  }

  if (!displayTime) return null;

  const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const dayName = dayNames[displayTime.getDay()];
  const day = displayTime.getDate();
  const month = monthNames[displayTime.getMonth()];
  const year = displayTime.getFullYear();
  const hours = displayTime.getHours().toString().padStart(2, "0");
  const minutes = displayTime.getMinutes().toString().padStart(2, "0");
  const seconds = displayTime.getSeconds().toString().padStart(2, "0");

  return (
    <div className={`${styles.container} ${white ? styles.whiteVersion : ""}`}>
      <div className={styles.wrapper}>
        {/* Live pulse indicator */}
        <div className={styles.liveDot}>
          <span className={styles.liveDotInner}></span>
          <span className={styles.liveDotPulse}></span>
        </div>

        {/* Time display */}
        <div className={styles.timeBlock}>
          <span className={styles.timeDigits}>
            <span className={styles.hourMin}>{hours}:{minutes}</span>
            <span className={styles.seconds}>:{seconds}</span>
          </span>
        </div>

        {/* Separator */}
        <div className={styles.separator}></div>

        {/* Date display */}
        <div className={styles.dateBlock}>
          <i className={`fas fa-calendar-alt ${styles.calendarIcon}`}></i>
          <div className={styles.dateText}>
            <span className={styles.dayName}>{dayName}</span>
            <span className={styles.fullDate}>{day} {month} {year}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
