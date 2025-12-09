import { format } from "date-fns";

    export const airlineLogos = {
      emirates: "Emirates logo",
      malaysia_airlines: "Malaysia Airlines logo",
      kenya_airways: "Kenya Airways logo",
      uganda_airlines: "Uganda Airlines logo",
      ethiopian_airlines: "Ethiopian Airlines logo",
      flydubai: "Flydubai logo",
      // Add more as needed for specific routes
    };
    
    // Initial focus routes: Dubai, Malaysia, Uganda, Kenya, Ethiopia, South Sudan
    export const commonRoutesData = [
      {
        origin: "DXB", // Dubai
        destination: "NBO", // Nairobi, Kenya
        airlines: [
          { code: "EK", name: "Emirates", logoKey: "emirates", priceRange: [350, 600], duration: "5h 0m", stops: "Direct", standardBaggage: "1pc x 30kg" },
          { code: "KQ", name: "Kenya Airways", logoKey: "kenya_airways", priceRange: [300, 550], duration: "5h 10m", stops: "Direct", standardBaggage: "1pc x 23kg" },
          { code: "FZ", name: "Flydubai", logoKey: "flydubai", priceRange: [280, 500], duration: "5h 5m", stops: "Direct", standardBaggage: "1pc x 20kg" },
        ]
      },
      {
        origin: "NBO", // Nairobi, Kenya
        destination: "DXB", // Dubai
        airlines: [
          { code: "EK", name: "Emirates", logoKey: "emirates", priceRange: [350, 600], duration: "5h 0m", stops: "Direct", standardBaggage: "1pc x 30kg" },
          { code: "KQ", name: "Kenya Airways", logoKey: "kenya_airways", priceRange: [300, 550], duration: "5h 10m", stops: "Direct", standardBaggage: "1pc x 23kg" },
          { code: "FZ", name: "Flydubai", logoKey: "flydubai", priceRange: [280, 500], duration: "5h 5m", stops: "Direct", standardBaggage: "1pc x 20kg" },
        ]
      },
      {
        origin: "DXB", // Dubai
        destination: "EBB", // Entebbe, Uganda
        airlines: [
          { code: "EK", name: "Emirates", logoKey: "emirates", priceRange: [400, 650], duration: "5h 20m", stops: "Direct", standardBaggage: "1pc x 30kg" },
          { code: "UG", name: "Uganda Airlines", logoKey: "uganda_airlines", priceRange: [380, 600], duration: "5h 30m", stops: "Direct", standardBaggage: "1pc x 23kg" },
          { code: "FZ", name: "Flydubai", logoKey: "flydubai", priceRange: [350, 580], duration: "5h 25m", stops: "Direct", standardBaggage: "1pc x 20kg" },
        ]
      },
       {
        origin: "EBB", // Entebbe, Uganda
        destination: "DXB", // Dubai
        airlines: [
          { code: "EK", name: "Emirates", logoKey: "emirates", priceRange: [400, 650], duration: "5h 20m", stops: "Direct", standardBaggage: "1pc x 30kg" },
          { code: "UG", name: "Uganda Airlines", logoKey: "uganda_airlines", priceRange: [380, 600], duration: "5h 30m", stops: "Direct", standardBaggage: "1pc x 23kg" },
          { code: "FZ", name: "Flydubai", logoKey: "flydubai", priceRange: [350, 580], duration: "5h 25m", stops: "Direct", standardBaggage: "1pc x 20kg" },
        ]
      },
      {
        origin: "DXB", // Dubai
        destination: "ADD", // Addis Ababa, Ethiopia
        airlines: [
          { code: "EK", name: "Emirates", logoKey: "emirates", priceRange: [300, 500], duration: "4h 0m", stops: "Direct", standardBaggage: "1pc x 30kg" },
          { code: "ET", name: "Ethiopian Airlines", logoKey: "ethiopian_airlines", priceRange: [280, 480], duration: "4h 10m", stops: "Direct", standardBaggage: "2pcs x 23kg" },
          { code: "FZ", name: "Flydubai", logoKey: "flydubai", priceRange: [250, 450], duration: "4h 5m", stops: "Direct", standardBaggage: "1pc x 20kg" },
        ]
      },
      {
        origin: "ADD", // Addis Ababa, Ethiopia
        destination: "DXB", // Dubai
        airlines: [
          { code: "EK", name: "Emirates", logoKey: "emirates", priceRange: [300, 500], duration: "4h 0m", stops: "Direct", standardBaggage: "1pc x 30kg" },
          { code: "ET", name: "Ethiopian Airlines", logoKey: "ethiopian_airlines", priceRange: [280, 480], duration: "4h 10m", stops: "Direct", standardBaggage: "2pcs x 23kg" },
          { code: "FZ", name: "Flydubai", logoKey: "flydubai", priceRange: [250, 450], duration: "4h 5m", stops: "Direct", standardBaggage: "1pc x 20kg" },
        ]
      },
      {
        origin: "KUL", // Kuala Lumpur, Malaysia
        destination: "NBO", // Nairobi, Kenya
        airlines: [
          { code: "MH", name: "Malaysia Airlines", logoKey: "malaysia_airlines", priceRange: [500, 800], duration: "10h 0m", stops: "1 Stop (e.g., DXB)", standardBaggage: "1pc x 30kg" },
          { code: "KQ", name: "Kenya Airways", logoKey: "kenya_airways", priceRange: [550, 850], duration: "9h 30m", stops: "1 Stop (e.g., BKK or DXB)", standardBaggage: "2pcs x 23kg" },
        ]
      },
      {
        origin: "NBO", // Nairobi, Kenya
        destination: "KUL", // Kuala Lumpur, Malaysia
        airlines: [
          { code: "MH", name: "Malaysia Airlines", logoKey: "malaysia_airlines", priceRange: [500, 800], duration: "10h 0m", stops: "1 Stop (e.g., DXB)", standardBaggage: "1pc x 30kg" },
          { code: "KQ", name: "Kenya Airways", logoKey: "kenya_airways", priceRange: [550, 850], duration: "9h 30m", stops: "1 Stop (e.g., BKK or DXB)", standardBaggage: "2pcs x 23kg" },
        ]
      },
      {
        origin: "NBO", // Nairobi, Kenya
        destination: "EBB", // Entebbe, Uganda
        airlines: [
          { code: "KQ", name: "Kenya Airways", logoKey: "kenya_airways", priceRange: [120, 220], duration: "1h 0m", stops: "Direct", standardBaggage: "1pc x 23kg" },
          { code: "UG", name: "Uganda Airlines", logoKey: "uganda_airlines", priceRange: [110, 200], duration: "1h 5m", stops: "Direct", standardBaggage: "1pc x 23kg" },
        ]
      },
      {
        origin: "EBB", // Entebbe, Uganda
        destination: "NBO", // Nairobi, Kenya
        airlines: [
          { code: "KQ", name: "Kenya Airways", logoKey: "kenya_airways", priceRange: [120, 220], duration: "1h 0m", stops: "Direct", standardBaggage: "1pc x 23kg" },
          { code: "UG", name: "Uganda Airlines", logoKey: "uganda_airlines", priceRange: [110, 200], duration: "1h 5m", stops: "Direct", standardBaggage: "1pc x 23kg" },
        ]
      },
      {
        origin: "ADD", // Addis Ababa, Ethiopia
        destination: "JUB", // Juba, South Sudan
        airlines: [
          { code: "ET", name: "Ethiopian Airlines", logoKey: "ethiopian_airlines", priceRange: [200, 350], duration: "1h 50m", stops: "Direct", standardBaggage: "2pcs x 23kg" },
        ]
      },
      {
        origin: "JUB", // Juba, South Sudan
        destination: "ADD", // Addis Ababa, Ethiopia
        airlines: [
          { code: "ET", name: "Ethiopian Airlines", logoKey: "ethiopian_airlines", priceRange: [200, 350], duration: "1h 50m", stops: "Direct", standardBaggage: "2pcs x 23kg" },
        ]
      },
      {
        origin: "NBO", // Nairobi, Kenya
        destination: "JUB", // Juba, South Sudan
        airlines: [
          { code: "KQ", name: "Kenya Airways", logoKey: "kenya_airways", priceRange: [250, 400], duration: "1h 30m", stops: "Direct", standardBaggage: "1pc x 23kg" },
        ]
      },
      {
        origin: "JUB", // Juba, South Sudan
        destination: "NBO", // Nairobi, Kenya
        airlines: [
          { code: "KQ", name: "Kenya Airways", logoKey: "kenya_airways", priceRange: [250, 400], duration: "1h 30m", stops: "Direct", standardBaggage: "1pc x 23kg" },
        ]
      },
      // Example of a multi-stop route if direct is not common
      {
        origin: "KUL", // Kuala Lumpur
        destination: "JUB", // Juba
        airlines: [
            { code: "EK", name: "Emirates", logoKey: "emirates", priceRange: [700, 1200], duration: "12h 0m", stops: "1 Stop (DXB)", standardBaggage: "1pc x 30kg" },
            { code: "ET", name: "Ethiopian Airlines", logoKey: "ethiopian_airlines", priceRange: [650, 1100], duration: "13h 30m", stops: "1 Stop (ADD)", standardBaggage: "2pcs x 23kg" },
        ]
      }
    ];
    
    export const generateRealisticFlights = (searchParams) => {
      const { legs: searchLegs, tripType } = searchParams; // Assuming legs is an array for multi-city
      const results = [];
      let flightIdCounter = 1;

      const processLeg = (leg) => {
        const { origin, destination, departureDate } = leg;
        const legResults = [];

        const matchingRoute = commonRoutesData.find(
          (route) => route.origin === origin && route.destination === destination
        );
      
        if (matchingRoute) {
          matchingRoute.airlines.forEach((airlineRoute) => {
            const numFlightsForAirline = Math.floor(Math.random() * 2) + 1; 
            for (let i = 0; i < numFlightsForAirline; i++) {
              const price = Math.floor(Math.random() * (airlineRoute.priceRange[1] - airlineRoute.priceRange[0] + 1)) + airlineRoute.priceRange[0];
              
              const baseDepartureTime = new Date(departureDate || new Date());
              const departureHour = Math.floor(Math.random() * 12) + 7; 
              const departureMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
              baseDepartureTime.setHours(departureHour, departureMinute, 0, 0);
      
              const durationParts = airlineRoute.duration.match(/(\d+)h(?: (\d+)m)?/);
              const durationHours = durationParts ? parseInt(durationParts[1]) : 0;
              const durationMinutes = durationParts && durationParts[2] ? parseInt(durationParts[2]) : 0;
      
              const arrivalTime = new Date(baseDepartureTime);
              arrivalTime.setHours(baseDepartureTime.getHours() + durationHours);
              arrivalTime.setMinutes(baseDepartureTime.getMinutes() + durationMinutes);
      
              legResults.push({
                id: flightIdCounter++,
                airline: airlineRoute.name,
                airlineCode: airlineRoute.code,
                airlineLogoKey: airlineRoute.logoKey,
                from: origin,
                to: destination,
                departureTime: format(baseDepartureTime, "HH:mm"),
                departureDate: format(baseDepartureTime, "yyyy-MM-dd"),
                arrivalTime: format(arrivalTime, "HH:mm"),
                arrivalDate: format(arrivalTime, "yyyy-MM-dd"),
                duration: airlineRoute.duration,
                price: price,
                stops: airlineRoute.stops,
                standardBaggage: airlineRoute.standardBaggage || "1pc x 23kg (Default)",
              });
            }
          });
        } else {
          // Fallback for routes not explicitly defined - less likely with focused airport list
          const fallbackAirlines = [
              { code: "XX", name: "Connecting Air", logoKey: "kenya_airways", priceRange: [200, 700], duration: "6h 30m", stops: "1-2 Stops", standardBaggage: "1pc x 20kg" },
          ];
          fallbackAirlines.forEach(airlineRoute => {
              const price = Math.floor(Math.random() * (airlineRoute.priceRange[1] - airlineRoute.priceRange[0] + 1)) + airlineRoute.priceRange[0];
              const baseDepartureTime = new Date(departureDate || new Date());
              const departureHour = Math.floor(Math.random() * 12) + 7;
              const departureMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
              baseDepartureTime.setHours(departureHour, departureMinute, 0, 0);
  
              const durationParts = airlineRoute.duration.match(/(\d+)h(?: (\d+)m)?/);
              const durationHours = durationParts ? parseInt(durationParts[1]) : 0;
              const durationMinutes = durationParts && durationParts[2] ? parseInt(durationParts[2]) : 0;
  
              const arrivalTime = new Date(baseDepartureTime);
              arrivalTime.setHours(baseDepartureTime.getHours() + durationHours);
              arrivalTime.setMinutes(baseDepartureTime.getMinutes() + durationMinutes);
  
              legResults.push({
                  id: flightIdCounter++,
                  airline: airlineRoute.name,
                  airlineCode: airlineRoute.code,
                  airlineLogoKey: airlineRoute.logoKey,
                  from: origin || "AAA", // Should always have origin/dest from search
                  to: destination || "BBB",
                  departureTime: format(baseDepartureTime, "HH:mm"),
                  departureDate: format(baseDepartureTime, "yyyy-MM-dd"),
                  arrivalTime: format(arrivalTime, "HH:mm"),
                  arrivalDate: format(arrivalTime, "yyyy-MM-dd"),
                  duration: airlineRoute.duration,
                  price: price,
                  stops: airlineRoute.stops,
                  standardBaggage: airlineRoute.standardBaggage || "1pc x 23kg (Default)",
              });
          });
        }
        return legResults;
      };

      if (tripType === 'multi-city') {
        searchLegs.forEach(leg => {
          results.push(...processLeg(leg));
        });
      } else { // one-way or round-trip
        results.push(...processLeg(searchLegs[0]));
        // For round-trip, one might generate return flights too, but current logic focuses on outbound.
        // If return flights are needed, a similar call to processLeg with swapped origin/dest and returnDate would be required.
      }
    
      return results.sort((a, b) => a.price - b.price);
    };