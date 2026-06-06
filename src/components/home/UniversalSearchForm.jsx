import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AirportSelect } from "@/components/AirportSelect";
import {
  Calendar as CalendarIcon,
  Minus,
  Plus,
  Briefcase,
  ArrowRightLeft,
  MapPin,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/hooks/useSession";
import AuthModal from "@/components/auth/AuthModal";
import { cn } from "@/lib/utils";
import { MAX_BAGS_PER_LISTING } from "@/data/constants";
import { globalAirportsList } from "@/lib/airportData";

const SearchModeButton = ({
  mode,
  currentMode,
  onClick,
  icon: Icon,
  children,
}) => {
  const baseClasses =
    "w-full py-6 md:py-3 text-base font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-opacity-50 flex items-center justify-center";
  const activeClasses =
    "bg-sky-400 dark:bg-purple-600 text-white shadow-lg ring-sky-300 dark:ring-purple-500";
  const inactiveClasses =
    "bg-white/30 hover:bg-white/50 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 text-slate-100 dark:text-slate-300 ring-transparent";
  return (
    <button
      onClick={() => onClick(mode)}
      className={`${baseClasses} ${currentMode === mode ? activeClasses : inactiveClasses}`}
      aria-pressed={currentMode === mode}
    >
      <Icon size={20} className="mr-2" /> {children}
    </button>
  );
};

const SearchModeToggle = ({ searchMode, setSearchMode }) => (
  <div className="grid grid-cols-2 gap-2 mb-6">
    <SearchModeButton
      mode="send"
      currentMode={searchMode}
      onClick={setSearchMode}
      icon={Briefcase}
    >
      Send a Bag
    </SearchModeButton>
    <SearchModeButton
      mode="travel"
      currentMode={searchMode}
      onClick={setSearchMode}
      icon={ArrowRightLeft}
    >
      Yank a Bag
    </SearchModeButton>
  </div>
);

const AirportInput = ({
  value,
  onChange,
  placeholder,
  type,
  className,
  label,
}) => (
  <div className="relative">
    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-400" />
    <AirportSelect
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "w-full bg-white/20 dark:bg-slate-800/30 backdrop-blur-sm text-white placeholder-slate-300 dark:placeholder-slate-400 border-slate-400/50 dark:border-slate-700/50 focus:ring-white/50 dark:focus:ring-sky-400/50 focus:border-white/50 dark:focus:border-sky-400/50 rounded-lg transition-colors pl-10",
        className,
      )}
      aria-label={label}
      type={type}
    />
  </div>
);

const DatePickerInput = ({ date, setDate, className }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full bg-white/20 dark:bg-slate-800/30 backdrop-blur-sm text-white placeholder-slate-300 dark:placeholder-slate-400 border-slate-400/50 dark:border-slate-700/50 focus:ring-white/50 dark:focus:ring-sky-400/50 focus:border-white/50 dark:focus:border-sky-400/50 rounded-lg transition-colors justify-start text-left font-normal h-12",
            !date && "text-slate-300 dark:text-slate-400",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-5 w-5 text-slate-300 dark:text-slate-400" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-xl rounded-lg"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            setIsPopoverOpen(false);
          }}
          initialFocus
          className="text-slate-800 dark:text-slate-200"
          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </PopoverContent>
    </Popover>
  );
};

const QuantityInput = ({ value, setValue, label }) => (
  <div className="flex items-center justify-between bg-white/20 dark:bg-slate-800/30 backdrop-blur-sm text-white border border-slate-400/50 dark:border-slate-700/50 rounded-lg px-3 h-12">
    <label
      htmlFor={label.toLowerCase().replace(/\s/g, "")}
      className="text-sm font-medium text-slate-200 dark:text-slate-300"
    >
      {label}
    </label>
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-white hover:bg-white/30 dark:hover:bg-slate-700/50 rounded-full"
        onClick={() => setValue(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-6 text-center font-semibold">{value}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-white hover:bg-white/30 dark:hover:bg-slate-700/50 rounded-full"
        onClick={() => setValue(Math.min(MAX_BAGS_PER_LISTING, value + 1))}
        disabled={value >= MAX_BAGS_PER_LISTING}
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const SearchFormInputs = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  departureDate,
  setDepartureDate,
  numberOfBags,
  setNumberOfBags,
}) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AirportInput
        value={origin}
        onChange={setOrigin}
        placeholder="Origin Airport"
        type="origin"
        label="Origin Airport"
      />
      <AirportInput
        value={destination}
        onChange={setDestination}
        placeholder="Destination Airport"
        type="destination"
        label="Destination Airport"
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DatePickerInput date={departureDate} setDate={setDepartureDate} />
      <QuantityInput
        value={numberOfBags}
        setValue={setNumberOfBags}
        label="Number of Bags"
      />
    </div>
  </>
);

const UniversalSearchForm = ({ initialMode = "send", onSearch }) => {
  const [searchMode, setSearchMode] = useState(initialMode);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [numberOfBags, setNumberOfBags] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingSearchAction, setPendingSearchAction] = useState(null);
  const formRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { session } = useSession();

  const findAirportByCode = (code) =>
    globalAirportsList.find((airport) => airport.value === code) || null;

  useEffect(() => {
    if (location.state?.searchCriteria) {
      const { mode, origin, destination, date, bags } =
        location.state.searchCriteria;
      setSearchMode(mode || initialMode);
      setOrigin(origin || null);
      setDestination(destination || null);
      setDepartureDate(date ? new Date(date) : null);
      setNumberOfBags(bags || 1);
    } else if (location.state?.prefillSearch) {
      const { origin: prefillOriginCode, destination: prefillDestinationCode } =
        location.state.prefillSearch;
      setOrigin(findAirportByCode(prefillOriginCode));
      setDestination(findAirportByCode(prefillDestinationCode));

      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, initialMode, navigate]);

  const executeSearch = useCallback(
    (criteria, mode) => {
      if (onSearch) {
        onSearch(criteria);
      } else {
        const targetPath = mode === "send" ? "/list-baggage" : "/yank-a-bag";
        navigate(targetPath, { state: { searchCriteria: criteria } });
      }
    },
    [navigate, onSearch],
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (!origin || !destination || !departureDate) {
      toast({
        title: "Missing Information",
        description: "Please select origin, destination, and departure date.",
        variant: "destructive",
      });
      return;
    }

    const searchCriteria = {
      mode: searchMode,
      origin: origin,
      destination: destination,
      date: departureDate.toISOString(),
      bags: numberOfBags,
    };

    if (searchMode === "travel" && !session) {
      setPendingSearchAction({ criteria: searchCriteria, mode: searchMode });
      setIsAuthModalOpen(true);
      return;
    }
    executeSearch(searchCriteria, searchMode);
  };

  const handleAuthSuccess = useCallback(() => {
    setIsAuthModalOpen(false);
    if (pendingSearchAction) {
      executeSearch(pendingSearchAction.criteria, pendingSearchAction.mode);
      setPendingSearchAction(null);
    }
  }, [pendingSearchAction, executeSearch]);

  const handleAuthClose = useCallback(() => {
    setIsAuthModalOpen(false);
    setPendingSearchAction(null);
  }, []);

  return (
    <>
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white/10 dark:bg-slate-800/20 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-2xl max-w-3xl mx-auto"
      >
        <h2 className="text-center text-xl md:text-2xl font-semibold text-sky-100 dark:text-sky-300 mb-6">
          Yankit - Why Mail It When You Can Yank It!
        </h2>
        <SearchModeToggle
          searchMode={searchMode}
          setSearchMode={setSearchMode}
        />

        <form onSubmit={handleSearch} className="space-y-6">
          <SearchFormInputs
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
            numberOfBags={numberOfBags}
            setNumberOfBags={setNumberOfBags}
          />

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-500 dark:from-purple-600 dark:to-indigo-600 dark:hover:from-purple-500 dark:hover:to-indigo-500 text-white text-lg font-bold py-4 shadow-lg transition-all duration-300 ease-in-out"
            >
              Search Now
            </Button>
          </motion.div>
        </form>
      </motion.div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthClose}
        onSuccess={handleAuthSuccess}
        initialView="sign_in"
        message="Please sign in or create an account to list your bag."
        redirectTo={location.pathname}
        searchCriteria={pendingSearchAction?.criteria}
      />
    </>
  );
};

export default UniversalSearchForm;
