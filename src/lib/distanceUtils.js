    function toRad(x) {
        return (x * Math.PI) / 180;
      }
  
      export function haversineDistance(coords1, coords2) {
        if (!coords1 || !coords2) {
          return null;
        }
  
        const R = 6371;
        const dLat = toRad(coords2.lat - coords1.lat);
        const dLon = toRad(coords2.lon - coords1.lon);
        const lat1 = toRad(coords1.lat);
        const lat2 = toRad(coords2.lat);
  
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
        return R * c;
      }
  
      export const placeholderAirportCoords = {
        "SYD": { lat: -33.946111, lon: 151.177222 },
        "MEL": { lat: -37.673333, lon: 144.843333 },
        "BNE": { lat: -27.384167, lon: 153.1175 },
        "PER": { lat: -31.940278, lon: 115.966944 },
        "ADL": { lat: -34.945, lon: 138.530556 },
        "CBR": { lat: -35.306944, lon: 149.195 },
        "HBA": { lat: -42.836111, lon: 147.510278 },
        "DRW": { lat: -12.408333, lon: 130.875556 },
        "CNS": { lat: -16.885833, lon: 145.755278 },
        "OOL": { lat: -28.164444, lon: 153.504722 },
        "AKL": { lat: -37.008056, lon: 174.791667 },
        "WLG": { lat: -41.327222, lon: 174.805278 },
        "CHC": { lat: -43.489394, lon: 172.532236 },
        "ZQN": { lat: -45.021111, lon: 168.738889 },
        "DUD": { lat: -45.928056, lon: 170.198333 },
        "LHR": { lat: 51.470020, lon: -0.454295 },
        "LOS": { lat: 6.57744, lon: 3.32115 },
        "JNB": { lat: -26.139167, lon: 28.246111 },
        "CPT": { lat: -33.9648, lon: 18.6017 },
        "CAI": { lat: 30.121944, lon: 31.405556 },
        "DXB": { lat: 25.253175, lon: 55.365673 },
        "YYZ": { lat: 43.677717, lon: -79.624819 },
        "DFW": { lat: 32.8998, lon: -97.0403 },
        "ORD": { lat: 41.974167, lon: -87.907321 },
        "LAX": { lat: 33.941589, lon: -118.40853 },
        "JFK": { lat: 40.641312, lon: -73.778139 },
        "NBO": { lat: -1.319167, lon: 36.9275 },
        "EBB": { lat: 0.042361, lon: 32.443583 },
        "ADD": { lat: 8.97788, lon: 38.79931 },
        "DAR": { lat: -6.87325, lon: 39.2025 },
        "KGL": { lat: -1.968611, lon: 30.139444 },
        "ACC": { lat: 5.60518, lon: -0.166789 },
        "ABJ": { lat: 5.261389, lon: -3.926292 },
        "DKR": { lat: 14.671389, lon: -17.073333 }, 
        "CMN": { lat: 33.367469, lon: -7.589967 },
        "TUN": { lat: 36.851028, lon: 10.227194 },
        "ALG": { lat: 36.691017, lon: 3.215411 },
        "TIP": { lat: 32.663611, lon: 13.158889 },
        "KRT": { lat: 15.589536, lon: 32.55315 },
        "HRE": { lat: -17.931861, lon: 31.092778 },
        "LUN": { lat: -15.330833, lon: 28.452778 },
        "MPM": { lat: -25.920833, lon: 32.5725 },
        "WDH": { lat: -22.48, lon: 17.470556 },
        "GBE": { lat: -24.555278, lon: 25.918333 },
        "MRU": { lat: -20.430278, lon: 57.683611 },
        "SEZ": { lat: -4.674444, lon: 55.521944 },
        "FIH": { lat: -4.385833, lon: 15.444444 },
        "LAD": { lat: -8.858333, lon: 13.231111 },
        "COO": { lat: 6.357222, lon: 2.384444 },
        "OUA": { lat: 12.353333, lon: -1.5125 },
        "BJM": { lat: -3.323889, lon: 29.318611 },
        "NDJ": { lat: 12.133611, lon: 15.034167 },
        "CKY": { lat: 9.576389, lon: -13.611944 },
        "ROB": { lat: 6.233889, lon: -10.362222 },
        "LLW": { lat: -13.788611, lon: 33.780278 },
        "MBA": { lat: -4.034803, lon: 39.594247 },
        "JUB": { lat: 4.872, lon: 31.601 },
        "DUR": { lat: -29.615, lon: 31.116667 }, 
        "SIN": { lat: 1.36442, lon: 103.99153 },
        "KUL": { lat: 2.745578, lon: 101.709917 },
        "PEN": { lat: 5.297222, lon: 100.276667 },
        "BKK": { lat: 13.69, lon: 100.750111 },
        "DMK": { lat: 13.9125, lon: 100.606667 },
        "MNL": { lat: 14.508611, lon: 121.019444 },
        "CEB": { lat: 10.3075, lon: 123.978889 },
        "CGK": { lat: -6.125556, lon: 106.655833 },
        "DPS": { lat: -8.748169, lon: 115.167269 },
        "SGN": { lat: 10.818889, lon: 106.662778 },
        "HAN": { lat: 21.221111, lon: 105.807222 },
        "PNH": { lat: 11.546389, lon: 104.844167 },
        "REP": { lat: 13.410556, lon: 103.812778 },
        "RGN": { lat: 16.9075, lon: 96.133333 },
        "MDL": { lat: 21.702222, lon: 95.978056 },
        "VTE": { lat: 17.988333, lon: 102.563333 },
        "LPQ": { lat: 19.897222, lon: 102.161389 },
        "BWN": { lat: 4.944167, lon: 114.928333 },
        "DEL": { lat: 28.55616, lon: 77.10009 },
        "BOM": { lat: 19.08869, lon: 72.86791 },
        "BLR": { lat: 13.198611, lon: 77.706389 },
        "MAA": { lat: 12.994444, lon: 80.180556 },
        "HYD": { lat: 17.240278, lon: 78.429444 },
        "CCU": { lat: 22.654722, lon: 88.446667 },
        "AMD": { lat: 23.077222, lon: 72.634722 },
        "PNQ": { lat: 18.582222, lon: 73.919722 },
        "COK": { lat: 10.151944, lon: 76.401944 },
        "GOI": { lat: 15.380833, lon: 73.831389 },
        "IXC": { lat: 30.673333, lon: 76.788611 },
        "CDG": { lat: 49.009722, lon: 2.547778 },
        "AMS": { lat: 52.308056, lon: 4.764167 },
        "FRA": { lat: 50.033333, lon: 8.570556 },
        "IST": { lat: 41.275278, lon: 28.751944 },
        "DOH": { lat: 25.273056, lon: 51.565 },
        "AUH": { lat: 24.433056, lon: 54.651111 },
        "PEK": { lat: 40.079999, lon: 116.584999 },
        "PKX": { lat: 39.509, lon: 116.4103 },
        "PVG": { lat: 31.143333, lon: 121.805278 },
        "ICN": { lat: 37.4691, lon: 126.4505 },
        "NRT": { lat: 35.764722, lon: 140.386389 },
        "HND": { lat: 35.552258, lon: 139.779694 },
        "HKT": { lat: 8.113, lon: 98.316 }
      };
  
      export function getCoords(iata) {
        return placeholderAirportCoords[iata] || null;
      }