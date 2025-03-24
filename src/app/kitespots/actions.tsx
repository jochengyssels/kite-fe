/**
 * Re-export file for API service functions
 * This file maintains backward compatibility with existing imports
 * while using the restructured code from @/services/api-service
 */

import { KiteSpot } from "@/services/api-service";

// Re-export all types
export type {
    KiteSpot,
    KiteSpotForecast
  } from "@/services/api-service";
  
  // Re-export all functions
  export {
    // Basic kitespot retrieval functions
    getAllKiteSpots,
    getKiteSpotByName,
    
    // Filtering functions
    getKiteSpotsByDifficulty,
    getKiteSpotsByWaterType,
    getKiteSpotsByCountry,
    getFilteredKiteSpots,
    getKiteSpotsByMonth,
    
    // Special functions
    getRecommendedKiteSpots,
    searchKiteSpots,
    
    // Forecast functions
    getKiteSpotForecast,
    
    // Utility functions
    getAllCountries,
    
    // Any other functions you might be using
  } from "@/services/api-service";
  
  /**
   * If you have any functions that were specific to the actions.ts file
   * and don't exist in api-service.ts, you can define them here:
   */
  
  // Example of a function that might have been specific to actions.ts
  export async function getTopRatedSpots(limit: number = 5): Promise<KiteSpot[]> {
    const { getAllKiteSpots } = await import("@/services/api-service");
    const spots = await getAllKiteSpots();
    
    // Sort by rating (if available) and take the top 'limit' spots
    return spots
      .filter(spot => spot.rating !== undefined)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }
  
  /**
   * You can also add any mock data functions that might have been in the original file
   */
  
  // Example of a mock data function
  export function getMockForecast(spotId: string): any[] {
    return [
      {
        id: "forecast-1",
        spot_id: spotId,
        date: new Date().toISOString().split('T')[0], // Today
        wind_speed: 18,
        wind_direction: "NE",
        temperature: 25,
        precipitation: 0,
        wave_height: 1.2,
        conditions: "Excellent"
      },
      {
        id: "forecast-2",
        spot_id: spotId,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        wind_speed: 15,
        wind_direction: "E",
        temperature: 24,
        precipitation: 0,
        wave_height: 0.8,
        conditions: "Good"
      },
      {
        id: "forecast-3",
        spot_id: spotId,
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
        wind_speed: 12,
        wind_direction: "SE",
        temperature: 23,
        precipitation: 10,
        wave_height: 0.5,
        conditions: "Fair"
      }
    ];
  }