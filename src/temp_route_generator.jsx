import { originAirportCodes, destinationAirportCodes, globalAirportsList } from '@/lib/airportData';

    function generateRoutesAsCsv() {
      let csvContent = "Origin,Destination\n";
      const airportLabelMap = globalAirportsList.reduce((acc, airport) => {
        acc[airport.value] = airport.label;
        return acc;
      }, {});

      originAirportCodes.forEach(originCode => {
        destinationAirportCodes.forEach(destinationCode => {
          if (originCode !== destinationCode) {
            const originLabel = airportLabelMap[originCode] || originCode;
            const destinationLabel = airportLabelMap[destinationCode] || destinationCode;
            csvContent += `"${originLabel}","${destinationLabel}"\n`;
          }
        });
      });
      
      
      const newWindow = window.open();
      newWindow.document.write(`<pre>${csvContent}</pre>`);
      newWindow.document.title = "All Possible Routes (CSV)";
      
      console.log("CSV content generated. Please copy from the new window or the console log below if new window is blocked.");
      console.log(csvContent);
    }

    
    export default generateRoutesAsCsv;