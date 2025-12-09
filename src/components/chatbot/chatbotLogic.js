import { BaggageClaim, Info, Phone, Send as SendIcon, Plane, Search, DollarSign, Menu, ShieldCheck, AlertTriangle, UserCircle, FileText, Percent, MapPin, Edit3, Lock } from 'lucide-react';

    const commonKeywords = {
      help: ['help', 'support', 'assistance', 'problem', 'issue'],
      greeting: ['hello', 'hi', 'hey', 'greetings'],
      bye: ['bye', 'goodbye', 'see ya', 'later'],
      thanks: ['thanks', 'thank you', 'appreciate it'],
      send_package: ['send', 'package', 'ship', 'item', 'parcel', 'goods'],
      offer_baggage: ['offer', 'baggage', 'space', 'luggage', 'travel with', 'carry'],
      flights: ['flight', 'book flight', 'ticket', 'airline'],
      payment: ['payment', 'pay', 'cost', 'price', 'fee', 'charge'],
      how_it_works: ['how it works', 'process', 'explain', 'guide'],
      baggage_allowance: ['baggage allowance', 'weight limit', 'bag limit', 'size limit', 'how much can i carry'],
      prohibited_items: ['prohibited items', 'restricted items', 'cannot send', 'illegal items', 'dangerous goods'],
      disputes: ['dispute', 'problem with user', 'complaint', 'issue with transaction'],
      account_issues: ['account', 'profile', 'password', 'email', 'login', 'verification'],
      tracking: ['track', 'tracking', 'status of shipment', 'where is my item'],
      insurance: ['insurance', 'coverage', 'damage', 'lost item'],
      fees: ['fees', 'service charge', 'commission', 'platform cost'],
      safety: ['safety', 'secure', 'trust', 'scam'],
      contact: ['contact', 'phone number', 'email address', 'reach you'],
    };

    const conversationFlows = {
      initial: {
        greeting: "Welcome to <span class='font-vernaccia-bold'>Yankit</span>! I'm your virtual assistant. How can I help you today?",
        options: [
          { id: 'book_flight', text: 'Book a Flight', icon: Plane, nextFlow: 'bookingFlightInfo' },
          { id: 'what_is_yankit', text: 'What is <span class="font-vernaccia-bold">Yankit</span>?', icon: Info, nextFlow: 'aboutYankit' },
          { id: 'how_to_send', text: 'How do I send an item?', icon: SendIcon, nextFlow: 'sendingItemInfo' },
          { id: 'how_to_offer', text: 'How do I offer baggage space?', icon: BaggageClaim, nextFlow: 'offeringBaggageInfo' },
          { id: 'baggage_rules', text: 'Baggage Rules & Limits', icon: BaggageClaim, nextFlow: 'baggageAllowanceInfo' },
          { id: 'safety_trust', text: 'Safety & Trust', icon: ShieldCheck, nextFlow: 'safetyInfo' },
          { id: 'fees_payments', text: 'Fees & Payments', icon: DollarSign, nextFlow: 'feesInfo' },
          { id: 'account_help_initial', text: 'Account Help', icon: UserCircle, nextFlow: 'accountHelp' },
          { id: 'contact_support_initial', text: 'Contact Support', icon: Phone, nextFlow: 'contactSupport' },
        ],
        keywordResponses: {
          what_is_yankit: 'aboutYankit',
          how_to_send: 'sendingItemInfo',
          send_package: 'sendingItemInfo',
          offer_baggage: 'offeringBaggageInfo',
          how_to_offer: 'offeringBaggageInfo',
          baggage_allowance: 'baggageAllowanceInfo',
          prohibited_items: 'prohibitedItemsInfo',
          safety: 'safetyInfo',
          flights: 'bookingFlightInfo',
          fees: 'feesInfo',
          payment: 'feesInfo',
          account_issues: 'accountHelp',
          contact: 'contactSupport',
          help: 'initial', 
        }
      },
      aboutYankit: {
        response: "<span class='font-vernaccia-bold'>Yankit</span> is a dual-service platform. We offer competitive flight bookings AND a peer-to-peer service connecting people who need to send items (Senders) with travellers who have spare baggage allowance (Yankers).",
        options: [
          { id: 'learn_flights_from_about', text: 'Tell me about Flights', icon: Plane, nextFlow: 'bookingFlightInfo' },
          { id: 'learn_sending_from_about', text: 'How to send items', icon: SendIcon, nextFlow: 'sendingItemInfo' },
          { id: 'learn_offering_from_about', text: 'How to offer space', icon: BaggageClaim, nextFlow: 'offeringBaggageInfo' },
          { id: 'main_menu_from_about', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
          flights: 'bookingFlightInfo',
          send_package: 'sendingItemInfo',
          offer_baggage: 'offeringBaggageInfo',
          main_menu_from_about: 'initial',
        }
      },
      bookingFlightInfo: {
        response: "Yes, you can book flights directly through <span class='font-vernaccia-bold'>Yankit</span>! We offer competitive prices and a seamless booking experience. Would you like to search for a flight now?",
        options: [
            { id: 'go_to_flights', text: 'Yes, Search for a Flight', icon: Plane, action: 'navigate', path: '/flights', nextFlow: 'initial' },
            { id: 'main_menu_from_flights', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
            go_to_flights: { action: 'navigate', path: '/flights', nextFlow: 'initial' },
            main_menu_from_flights: 'initial',
        }
      },
      sendingItemInfo: {
        response: "To send an item: \n1. Go to 'Send a Bag'. \n2. Search for Yankers (travellers) going to your destination. \n3. Contact a Yanker via in-app chat, agree on terms, and finalize the contract. \nPayment is held securely by <span class='font-vernaccia-bold'>Yankit</span> and released after confirmation.",
        options: [
          { id: 'search_listings_now', text: 'Go to Send a Bag', icon: Search, action: 'navigate', path: '/send-a-bag', nextFlow: 'initial' },
          { id: 'payment_info_sending', text: 'About Payments', icon: DollarSign, nextFlow: 'feesInfo' },
          { id: 'prohibited_items_q', text: 'What can I send?', icon: AlertTriangle, nextFlow: 'prohibitedItemsInfo' },
          { id: 'main_menu_from_sending', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
          payment: 'feesInfo',
          prohibited_items: 'prohibitedItemsInfo',
          search_listings_now: { action: 'navigate', path: '/send-a-bag', nextFlow: 'initial' },
          main_menu_from_sending: 'initial'
        }
      },
      offeringBaggageInfo: {
        response: "To offer baggage space (become a Yanker): \n1. Go to 'Yank a Bag'. \n2. List your trip details (origin, destination, dates, available bags - max 2, up to 20kg each). \n3. Senders can then find your listing and contact you. \nRemember to check in the bag as your own and provide the bag tag evidence in-app.",
        options: [
          { id: 'list_baggage_now', text: 'Go to Yank a Bag', icon: BaggageClaim, action: 'navigate', path: '/yank-a-bag', nextFlow: 'initial' },
          { id: 'baggage_rules_offering', text: 'Baggage Rules', icon: BaggageClaim, nextFlow: 'baggageAllowanceInfo' },
          { id: 'main_menu_from_offering', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
            list_baggage_now: { action: 'navigate', path: '/yank-a-bag', nextFlow: 'initial' },
            baggage_allowance: 'baggageAllowanceInfo',
            main_menu_from_offering: 'initial'
        }
      },
      baggageAllowanceInfo: {
        response: "Yankers can offer space for up to 2 bags. Each bag must not exceed 20kg. Senders must ensure their items comply with these limits and all airline/customs regulations for both origin and destination countries. <span class='font-vernaccia-bold'>Yankit</span> is not responsible for the contents.",
        options: [
          { id: 'prohibited_items_from_allowance', text: 'What items are prohibited?', icon: AlertTriangle, nextFlow: 'prohibitedItemsInfo' },
          { id: 'safety_guidelines_allowance', text: 'Safety Guidelines', icon: ShieldCheck, nextFlow: 'safetyInfo' },
          { id: 'main_menu_from_allowance', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
          prohibited_items: 'prohibitedItemsInfo',
          safety: 'safetyInfo',
          main_menu_from_allowance: 'initial',
        }
      },
      prohibitedItemsInfo: {
        response: "You CANNOT send or carry: illegal substances, weapons, hazardous materials, counterfeit goods, perishable items requiring special handling (unless agreed), or anything restricted by airlines or customs in origin/destination countries. Always declare contents honestly. See our Trust & Safety page for more.",
        options: [
          { id: 'trust_safety_page_prohibited', text: 'Visit Trust & Safety', icon: ShieldCheck, action: 'navigate', path: '/trust-safety', nextFlow: 'initial' },
          { id: 'baggage_allowance_from_prohibited', text: 'Baggage Limits', icon: BaggageClaim, nextFlow: 'baggageAllowanceInfo' },
          { id: 'main_menu_from_prohibited', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
          trust_safety_page_prohibited: { action: 'navigate', path: '/trust-safety', nextFlow: 'initial' },
          baggage_allowance: 'baggageAllowanceInfo',
          main_menu_from_prohibited: 'initial',
        }
      },
      feesInfo: {
        response: "Senders pay the agreed amount for the service. <span class='font-vernaccia-bold'>Yankit</span> charges a small service fee to both Senders and Yankers from this amount upon successful completion. This fee is clearly shown before you confirm a contract. Payments are held securely by <span class='font-vernaccia-bold'>Yankit</span> and released to the Yanker after delivery confirmation.",
        options: [
          { id: 'how_it_works_fees', text: 'How <span class="font-vernaccia-bold">Yankit</span> Works', icon: Info, nextFlow: 'aboutYankit' },
          { id: 'contact_support_fees', text: 'More Questions?', icon: Phone, nextFlow: 'contactSupport' },
          { id: 'main_menu_from_fees', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
          how_it_works: 'aboutYankit',
          contact: 'contactSupport',
          main_menu_from_fees: 'initial',
        }
      },
      safetyInfo: {
        response: "<span class='font-vernaccia-bold'>Yankit</span> prioritizes safety. We use in-app messaging for secure communication, have a review system, and encourage user verification. However, users are responsible for items sent/carried and must comply with all laws. For details, visit our Trust & Safety page.",
        options: [
          { id: 'trust_safety_page_safety', text: 'Visit Trust & Safety', icon: ShieldCheck, action: 'navigate', path: '/trust-safety', nextFlow: 'initial' },
          { id: 'prohibited_items_from_safety', text: 'Prohibited Items', icon: AlertTriangle, nextFlow: 'prohibitedItemsInfo' },
          { id: 'main_menu_from_safety', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
          trust_safety_page_safety: { action: 'navigate', path: '/trust-safety', nextFlow: 'initial' },
          prohibited_items: 'prohibitedItemsInfo',
          main_menu_from_safety: 'initial',
        }
      },
      accountHelp: {
        response: "What do you need help with regarding your account?",
        options: [
          { id: 'password_reset_acc', text: 'Password Reset', icon: Lock, nextFlow: 'passwordResetInfo' },
          { id: 'update_profile_acc', text: 'Update Profile/Email', icon: Edit3, nextFlow: 'updateProfileInfo' },
          { id: 'verification_acc', text: 'Account Verification', icon: ShieldCheck, nextFlow: 'verificationInfo' },
          { id: 'main_menu_from_account', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
          password_reset_acc: 'passwordResetInfo',
          update_profile_acc: 'updateProfileInfo',
          verification_acc: 'verificationInfo',
          main_menu_from_account: 'initial',
        }
      },
      passwordResetInfo: {
        response: "To reset your password, please go to the Sign In page and click on the 'Forgot Password?' link. You'll receive an email with instructions.",
        options: [
          { id: 'go_to_signin_pw', text: 'Go to Sign In', icon: Lock, action: 'navigate', path: '/signin', nextFlow: 'initial' },
          { id: 'back_to_account_help_pw', text: 'Account Help Menu', icon: UserCircle, nextFlow: 'accountHelp' },
          { id: 'main_menu_from_pw', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
          go_to_signin_pw: { action: 'navigate', path: '/signin', nextFlow: 'initial' },
          back_to_account_help_pw: 'accountHelp',
          main_menu_from_pw: 'initial',
        }
      },
      updateProfileInfo: {
        response: "You can update your profile information, including your email address, from your Dashboard after signing in.",
        options: [
          { id: 'go_to_dashboard_profile', text: 'Go to Dashboard', icon: UserCircle, action: 'navigate', path: '/dashboard', nextFlow: 'initial' },
          { id: 'back_to_account_help_profile', text: 'Account Help Menu', icon: UserCircle, nextFlow: 'accountHelp' },
          { id: 'main_menu_from_profile', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
          go_to_dashboard_profile: { action: 'navigate', path: '/dashboard', nextFlow: 'initial' },
          back_to_account_help_profile: 'accountHelp',
          main_menu_from_profile: 'initial',
        }
      },
      verificationInfo: {
        response: "Account verification helps build trust in the community. You may be prompted to verify your identity. Follow the instructions in your account settings or when prompted. For issues, contact support.",
        options: [
          { id: 'contact_support_verif', text: 'Contact Support', icon: Phone, nextFlow: 'contactSupport' },
          { id: 'back_to_account_help_verif', text: 'Account Help Menu', icon: UserCircle, nextFlow: 'accountHelp' },
          { id: 'main_menu_from_verif', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
          contact: 'contactSupport',
          back_to_account_help_verif: 'accountHelp',
          main_menu_from_verif: 'initial',
        }
      },
      disputeInfo: {
        response: "If you have an issue with a transaction or another user, first try to resolve it through in-app messaging. If that fails, please gather all details (conversation screenshots, etc.) and contact our support team via the Support page. We'll do our best to mediate.",
        options: [
          { id: 'go_to_support_dispute', text: 'Contact Support', icon: Phone, nextFlow: 'contactSupport' },
          { id: 'safety_tips_dispute', text: 'Safety Tips', icon: ShieldCheck, nextFlow: 'safetyInfo' },
          { id: 'main_menu_from_dispute', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
          contact: 'contactSupport',
          safety: 'safetyInfo',
          main_menu_from_dispute: 'initial',
        }
      },
      trackingInfo: {
        response: "Once a contract is active, you can communicate with the Yanker via in-app chat for updates. The Yanker is responsible for providing the bag tag evidence after check-in. Formal tracking like courier services is not part of <span class='font-vernaccia-bold'>Yankit</span>, it's peer-to-peer.",
        options: [
          { id: 'my_activity_tracking', text: 'Go to My Activity', icon: MapPin, action: 'navigate', path: '/my-activity', nextFlow: 'initial' },
          { id: 'how_it_works_tracking', text: 'How <span class="font-vernaccia-bold">Yankit</span> Works', icon: Info, nextFlow: 'aboutYankit' },
          { id: 'main_menu_from_tracking', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
          my_activity_tracking: { action: 'navigate', path: '/my-activity', nextFlow: 'initial' },
          how_it_works: 'aboutYankit',
          main_menu_from_tracking: 'initial',
        }
      },
      contactSupport: {
        response: "You can reach our support team via the 'Support' page on our website. There you'll find FAQs, contact methods, and our office address. For urgent matters, please check the contact options there.",
        options: [
          { id: 'go_to_support', text: 'Go to Support Page', icon: Phone, action: 'navigate', path: '/support', nextFlow: 'initial' },
          { id: 'main_menu_from_support', text: 'Main Menu', icon: Menu, nextFlow: 'initial' },
        ],
        keywordResponses: {
            go_to_support: { action: 'navigate', path: '/support', nextFlow: 'initial' },
            main_menu_from_support: 'initial'
        }
      },
      fallback: {
        response: "I'm not quite sure how to help with that. Please choose one of the options below, or try phrasing your question differently. You can also visit our Support page for more detailed help.",
        options: [
          { id: 'fallback_initial', text: 'Main Menu', icon: Menu, nextFlow: 'initial'},
          { id: 'fallback_support', text: 'Contact Support', icon: Phone, nextFlow: 'contactSupport' }
        ],
        keywordResponses: {
          fallback_initial: 'initial',
          fallback_support: 'contactSupport'
        }
      }
    };

    export const getInitialGreeting = () => {
      return { id: 'greeting', text: conversationFlows.initial.greeting, sender: 'bot' };
    };

    export const getOptions = (flow) => {
      return conversationFlows[flow]?.options || conversationFlows.initial.options;
    };
    
    const findKeywordMatch = (flowState, userInput) => {
        const flowKeywords = conversationFlows[flowState]?.keywordResponses || {};
        for (const keywordId in flowKeywords) {
            if (userInput.includes(keywordId) || (commonKeywords[keywordId] && commonKeywords[keywordId].some(k => userInput.includes(k)))) {
                return flowKeywords[keywordId];
            }
        }
        
        // General keyword matching if not found in specific flow
        for (const commonKey in commonKeywords) {
            if (commonKeywords[commonKey].some(k => userInput.includes(k))) {
                if (commonKey === 'send_package') return 'sendingItemInfo';
                if (commonKey === 'offer_baggage') return 'offeringBaggageInfo';
                if (commonKey === 'flights') return 'bookingFlightInfo'; // Assuming you might add this
                if (commonKey === 'payment' || commonKey === 'fees') return 'feesInfo';
                if (commonKey === 'help' || commonKey === 'support' || commonKey === 'contact') return 'contactSupport';
                if (commonKey === 'baggage_allowance') return 'baggageAllowanceInfo';
                if (commonKey === 'prohibited_items') return 'prohibitedItemsInfo';
                if (commonKey === 'disputes') return 'disputeInfo';
                if (commonKey === 'account_issues') return 'accountHelp';
                if (commonKey === 'tracking') return 'trackingInfo';
                if (commonKey === 'safety') return 'safetyInfo';
                if (commonKey === 'how_it_works') return 'aboutYankit';
            }
        }
        return null;
    };

    export const getResponse = (currentFlow, userInput) => {
      userInput = userInput.toLowerCase().trim();
      let nextFlowKey = userInput; 
      let action = null;
      let path = null;

      if (userInput === 'back_to_main' || userInput === 'main_menu' || userInput === 'fallback_initial') {
        return { text: conversationFlows.initial.greeting, nextFlow: 'initial', action, path, options: conversationFlows.initial.options };
      }
      
      const flow = conversationFlows[currentFlow];
      if (!flow) return { text: conversationFlows.fallback.response, nextFlow: 'fallback', action, path, options: conversationFlows.fallback.options };
      
      let targetFlow = flow.keywordResponses?.[userInput]; 
      
      if (typeof targetFlow === 'object' && targetFlow !== null) { 
          action = targetFlow.action;
          path = targetFlow.path;
          nextFlowKey = targetFlow.nextFlow;
      } else if (typeof targetFlow === 'string') {
          nextFlowKey = targetFlow;
      } else { 
        const keywordMatch = findKeywordMatch(currentFlow, userInput);
        if (keywordMatch) {
            if (typeof keywordMatch === 'object' && keywordMatch !== null) {
                action = keywordMatch.action;
                path = keywordMatch.path;
                nextFlowKey = keywordMatch.nextFlow;
            } else {
                nextFlowKey = keywordMatch;
            }
        } else {
            nextFlowKey = 'fallback'; 
        }
      }

      const nextFlowState = conversationFlows[nextFlowKey] || conversationFlows.fallback;
      const responseText = nextFlowState.response || conversationFlows.fallback.response;
      const responseOptions = nextFlowState.options || conversationFlows.fallback.options;

      return { text: responseText, nextFlow: nextFlowKey, action, path, options: responseOptions };
    };