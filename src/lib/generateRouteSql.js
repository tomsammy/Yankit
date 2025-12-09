import { globalAirportsList } from '@/lib/airportData.js';
import { getCoords, haversineDistance } from '@/lib/distanceUtils.js';

function generateAllRouteSql() {
  const allAirportCodes = [...new Set(globalAirportsList.map(a => a.value))];
  const BATCH_SIZE = 200; 

  let fullSqlScript = "-- FULLY POPULATED ROUTE DATA SCRIPT\n";
  fullSqlScript += "-- This script clears the existing table and repopulates it with accurate distances and costs.\n\n";
  fullSqlScript += "BEGIN;\n\n";
  fullSqlScript += "-- Step 1: Clear all existing data to ensure a fresh start.\n";
  fullSqlScript += "TRUNCATE TABLE public.flight_routes_data RESTART IDENTITY;\n\n";

  let allInserts = [];

  allAirportCodes.forEach(originIata => {
    allAirportCodes.forEach(destinationIata => {
      if (originIata !== destinationIata) {
        const originCoords = getCoords(originIata);
        const destinationCoords = getCoords(destinationIata);

        if (originCoords && destinationCoords) {
          const distanceKm = Math.round(haversineDistance(originCoords, destinationCoords));
          
          if (distanceKm > 0) {
            const baseCostPerKm = 0.037;
            const serviceFeePercentage = 0.13;
            const baseEarning = 10;
            const yankerEarnings = parseFloat((baseEarning + (distanceKm * baseCostPerKm)).toFixed(2));
            const senderShippingCost = parseFloat((yankerEarnings * (1 + serviceFeePercentage)).toFixed(2));

            allInserts.push(`('${originIata}', '${destinationIata}', ${distanceKm}, ${baseCostPerKm}, ${serviceFeePercentage}, ${yankerEarnings}, ${senderShippingCost})`);
          }
        }
      }
    });
  });
  
  if (allInserts.length > 0) {
    fullSqlScript += "-- Step 2: Insert new data in batches.\n";
    for (let i = 0; i < allInserts.length; i += BATCH_SIZE) {
        const batch = allInserts.slice(i, i + BATCH_SIZE);
        fullSqlScript += "INSERT INTO public.flight_routes_data (origin_iata, destination_iata, distance_km, base_cost_per_km, service_fee_percentage, yanker_earnings, sender_shipping_cost) VALUES\n";
        fullSqlScript += batch.join(',\n') + ";\n\n";
    }
  }

  fullSqlScript += "COMMIT;\n\n";
  fullSqlScript += "-- Script generation complete. Run this in your Supabase SQL Editor.\n";

  console.log("SQL Script Generation Complete.\nCopy the entire output below and run it in your Supabase SQL Editor:\n\n");
  console.log(fullSqlScript);
  
  return fullSqlScript;
}

export { generateAllRouteSql };