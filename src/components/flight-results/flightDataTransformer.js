import { format, parseISO, isValid } from 'date-fns';

    export const transformDuffelDataToFlights = (offer, offersData) => {
      const firstSlice = offer.slices[0];
      const lastSlice = offer.slices[offer.slices.length - 1];
      const firstSegment = firstSlice.segments[0];
      const lastSegment = lastSlice.segments[lastSlice.segments.length - 1];

      const stops = offer.slices.reduce((acc, slice) => acc + slice.segments.length - 1, 0);
      const stopDescription = stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`;

      const layovers = offer.slices.flatMap(slice =>
        slice.segments.slice(0, -1).map(segment => segment.destination.iata_code)
      ).filter((value, index, self) => self.indexOf(value) === index);

      const operatingCarrier = offersData.airlines.find(a => a.id === firstSegment.operating_carrier.id);
      
      return {
        id: offer.id,
        airline: operatingCarrier.name,
        airlineCode: operatingCarrier.iata_code,
        airlineLogoUrl: operatingCarrier.logo_symbol_url,
        from: firstSegment.origin.iata_code,
        to: lastSegment.destination.iata_code,
        departureTime: format(parseISO(firstSegment.departing_at), 'HH:mm'),
        arrivalTime: format(parseISO(lastSegment.arriving_at), 'HH:mm'),
        departureDate: format(parseISO(firstSegment.departing_at), 'yyyy-MM-dd'),
        duration: firstSlice.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm'),
        stops: stopDescription,
        layovers: layovers,
        price: parseFloat(offer.total_amount),
        currency: offer.total_currency,
        deeplink: offer.payment_requirements.requires_instant_payment ? offersData.offers.find(o => o.id === offer.id)?.payment_requirements?.payment_intent_url : null,
      };
    };