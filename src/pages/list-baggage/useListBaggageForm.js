import { useState, useEffect, useCallback } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { format, parseISO } from "date-fns";
    import { MAX_BAGGAGE_WEIGHT_PER_BAG, MAX_BAGS_PER_LISTING, BASE_EARNING, PER_KM_RATE } from '@/config/constants';
    import { haversineDistance, placeholderAirportCoords } from '@/lib/distanceUtils';

    export const useListBaggageForm = (initialFormState) => {
      const [formData, setFormData] = useState(initialFormState);
      const [errors, setErrors] = useState({});
      const [estimatedDistance, setEstimatedDistance] = useState(null);
      const [estimatedEarnings, setEstimatedEarnings] = useState(null);
      const location = useLocation();
      const navigate = useNavigate();

      useEffect(() => {
        if (location.state?.formData) {
          const { origin, destination, departureDate, numberOfBags } = location.state.formData;
          setFormData({
            origin: origin || '',
            destination: destination || '',
            departureDate: departureDate ? parseISO(departureDate) : null,
            numberOfBags: numberOfBags || '',
          });
          navigate(location.pathname, { replace: true, state: {} }); 
        } else if (location.search) {
            const queryParams = new URLSearchParams(location.search);
            setFormData(prev => ({
                ...prev,
                origin: queryParams.get('origin') || prev.origin,
                destination: queryParams.get('destination') || prev.destination,
                departureDate: queryParams.get('departureDate') ? parseISO(queryParams.get('departureDate')) : prev.departureDate,
            }));
            navigate(location.pathname, { replace: true }); 
        }
      }, [location.state, location.search, navigate, location.pathname]);

      useEffect(() => {
        if (formData.origin && formData.destination) {
          setEstimatedDistance(null); 
          setEstimatedEarnings(null); 
          const originCoords = placeholderAirportCoords[formData.origin];
          const destCoords = placeholderAirportCoords[formData.destination];
          
          if (originCoords && destCoords) {
            if (formData.origin === formData.destination) {
                 setEstimatedDistance(null); 
                 setEstimatedEarnings(null);
                 setErrors(prev => ({...prev, destination: "Origin and destination airports cannot be the same."}));
            } else {
                const distance = Math.round(haversineDistance(originCoords, destCoords));
                setEstimatedDistance(distance);
                setEstimatedEarnings(BASE_EARNING + (distance * PER_KM_RATE));
                 if (errors.destination === "Origin and destination airports cannot be the same.") {
                    setErrors(prev => ({...prev, destination: null}));
                 }
            }
          } else {
            setEstimatedDistance(null); 
            setEstimatedEarnings(null);
          }
        } else {
          setEstimatedDistance(null);
          setEstimatedEarnings(null);
        }
      }, [formData.origin, formData.destination, errors.destination]);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: null }));
        }
      };
      
      const handleNumberOfBagsChange = (value) => {
        setFormData(prev => ({ ...prev, numberOfBags: value }));
        if (errors.numberOfBags) {
          setErrors(prev => ({ ...prev, numberOfBags: null }));
        }
      };

      const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, departureDate: date }));
        if (errors.departureDate) {
          setErrors(prev => ({ ...prev, departureDate: null }));
        }
      };
      
      const handleAirportChange = (fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
         if (errors[fieldName]) {
          setErrors(prev => ({ ...prev, [fieldName]: null }));
        }
      };

      const validateForm = () => {
        const newErrors = {};
        if (!formData.origin) newErrors.origin = "Origin airport is required.";
        if (!formData.destination) newErrors.destination = "Destination airport is required.";
        if (formData.origin && formData.destination && formData.origin === formData.destination) {
          newErrors.destination = "Origin and destination airports cannot be the same.";
        }
        if (!formData.departureDate) newErrors.departureDate = "Departure date is required.";
        else if (new Date(formData.departureDate) < new Date(new Date().toDateString())) { 
            newErrors.departureDate = "Departure date cannot be in the past.";
        }

        const bags = parseInt(formData.numberOfBags, 10);
        if (!formData.numberOfBags) newErrors.numberOfBags = "Number of bags is required.";
        else if (isNaN(bags) || bags <= 0 || bags > MAX_BAGS_PER_LISTING) {
          newErrors.numberOfBags = `Number of bags must be between 1 and ${MAX_BAGS_PER_LISTING}.`;
        }
        
        if (formData.origin && formData.destination && (estimatedDistance === null || estimatedEarnings === null) && formData.origin !== formData.destination) {
             newErrors.confirmation = "Could not calculate distance or earnings. Please check selected airports. They might not be in our current database.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
      
      return { formData, errors, estimatedDistance, estimatedEarnings, handleInputChange, handleDateChange, handleAirportChange, handleNumberOfBagsChange, validateForm, setFormData, setErrors };
    };