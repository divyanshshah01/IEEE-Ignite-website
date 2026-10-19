"use server";

import { db } from "@project-organizer/sdk";

export async function getDashboardStats() {
  try {
    // Run queries in parallel for performance
    const [totalEvents, activeHackathons, totalParticipants, liveCheckins, allRegistrations, allUsers] = await Promise.all([
      db.event.count(),
      db.event.count({
        where: { state: "LIVE" },
      }),
      db.user.count(), 
      db.scanLog.count(),
      db.eventRegistration.findMany({ select: { createdAt: true } }),
      db.user.findMany({ select: { id: true } }) // Fetch to calculate sources/demographics roughly or we just return counts
    ]);

    // Very basic aggregation for Registrations Over Time (last 30 days roughly)
    const registrationsData = allRegistrations.reduce((acc: any, reg) => {
      const date = reg.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!acc[date]) acc[date] = 0;
      acc[date]++;
      return acc;
    }, {});
    
    // Sort and format for Recharts
    const chartData = Object.keys(registrationsData).map(date => ({
      name: date,
      value: registrationsData[date]
    })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    // Fallback if empty database so chart doesn't break visually immediately
    const fallbackChartData = chartData.length > 0 ? chartData : [
      { name: "Apr 10", value: 0 },
      { name: "Apr 17", value: 0 },
    ];

    return {
      success: true,
      data: {
        totalEvents,
        activeHackathons,
        totalParticipants,
        liveCheckins,
        chartData: fallbackChartData
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      success: false,
      error: "Failed to load dashboard metrics",
    };
  }
}
