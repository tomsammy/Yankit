import React, { Suspense } from 'react';
    import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Loader2 } from 'lucide-react';

    import PageLayout from '@/components/layouts/PageLayout';
    import ScrollToTop from '@/components/ScrollToTop';
    import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
    import { AppStateProvider } from '@/contexts/AppStateContext';
    import ProtectedRoute from '@/components/ProtectedRoute'; 

    // Page Imports
    const HomePage = React.lazy(() => import('@/pages/HomePage'));
    const SupportPage = React.lazy(() => import('@/pages/SupportPage'));
    const SignInPage = React.lazy(() => import('@/pages/SignInPage'));
    const SignUpPage = React.lazy(() => import('@/pages/SignUpPage'));
    const HowItWorksPage = React.lazy(() => import('@/pages/HowItWorksPage')); 
    const BaggageActionsPage = React.lazy(() => import('@/pages/BaggageActionsPage'));
    const ListYourBagPage = React.lazy(() => import('@/pages/list-your-bag/ListYourBagPage'));
    const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
    const EmailConfirmationPage = React.lazy(() => import('@/pages/EmailConfirmationPage'));
    const ForgotPasswordPage = React.lazy(() => import('@/pages/ForgotPasswordPage'));
    const ResetPasswordPage = React.lazy(() => import('@/pages/ResetPasswordPage'));
    const ChangePasswordPage = React.lazy(() => import('@/pages/ChangePasswordPage'));
    const MyShipmentsPage = React.lazy(() => import('@/pages/MyShipmentsPage'));
    const MyListingsPage = React.lazy(() => import('@/pages/MyListingsPage'));
    const EditListingPage = React.lazy(() => import('@/pages/EditListingPage'));
    const AfricanAnecdotesPage = React.lazy(() => import('@/pages/AfricanAnecdotesPage'));
    const ShipmentPaymentPage = React.lazy(() => import('@/pages/ShipmentPaymentPage'));
    const CreateShipmentAndPayPage = React.lazy(() => import('@/pages/CreateShipmentAndPayPage'));
    const ShipmentTrackingPage = React.lazy(() => import('@/pages/ShipmentTrackingPage'));
    const PaymentSuccessPage = React.lazy(() => import('@/pages/PaymentSuccessPage'));
    const PaymentCancelledPage = React.lazy(() => import('@/pages/PaymentCancelledPage'));
    
    // Static Page Imports
    const AboutPage = React.lazy(() => import('@/pages/static/AboutPage'));
    const CareersPage = React.lazy(() => import('@/pages/static/CareersPage'));
    const PressPage = React.lazy(() => import('@/pages/static/PressPage'));
    const TrustSafetyPage = React.lazy(() => import('@/pages/static/TrustSafetyPage'));
    const TermsOfServicePage = React.lazy(() => import('@/pages/static/TermsOfServicePage'));
    const PrivacyPolicyPage = React.lazy(() => import('@/pages/static/PrivacyPolicyPage'));
    const CookiePolicyPage = React.lazy(() => import('@/pages/static/CookiePolicyPage'));

    const AppLoadingScreen = () => (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800">
        <Loader2 className="w-16 h-16 text-primary dark:text-secondary animate-spin" />
      </div>
    );
    AppLoadingScreen.displayName = 'AppLoadingScreen';
    
    const routesConfig = [
      { path: "/", element: <HomePage />, name: "Home" },
      { path: "/support", element: <SupportPage />, name: "Support" },
      { path: "/signin", element: <SignInPage />, name: "Sign In" },
      { path: "/signup", element: <SignUpPage />, name: "Sign Up" },
      { path: "/how-it-works", element: <HowItWorksPage />, name: "How It Works" }, 
      { path: "/yank-a-bag-now", element: <BaggageActionsPage />, name: "Yank a Bag Now" },
      { path: "/send-a-bag", element: <BaggageActionsPage />, isProtected: false, name: "Send a Bag" },
      { path: "/list-your-bag", element: <ListYourBagPage />, isProtected: true, name: "List Your Bag" },
      { path: "/dashboard", element: <DashboardPage />, isProtected: true, name: "Dashboard" },
      { path: "/confirm-email", element: <EmailConfirmationPage />, name: "Confirm Email" },
      { path: "/forgot-password", element: <ForgotPasswordPage />, name: "Forgot Password" },
      { path: "/reset-password", element: <ResetPasswordPage />, name: "Reset Password" },
      { path: "/change-password", element: <ChangePasswordPage />, isProtected: true, name: "Change Password" },
      { path: "/my-shipments", element: <MyShipmentsPage />, isProtected: true, name: "My Shipments" },
      { path: "/my-listings", element: <MyListingsPage />, isProtected: true, name: "My Listings" },
      { path: "/edit-listing/:listingId", element: <EditListingPage />, isProtected: true, name: "Edit Listing" },
      { path: "/african-anecdotes", element: <AfricanAnecdotesPage />, name: "African Anecdotes" },
      { path: "/payment/shipment/:shipmentId", element: <ShipmentPaymentPage />, isProtected: true, name: "Shipment Payment" },
      { path: "/create-shipment-and-pay", element: <CreateShipmentAndPayPage />, isProtected: true, name: "Create Shipment And Pay" },
      { path: "/shipment-tracking/:shipmentId", element: <ShipmentTrackingPage />, isProtected: true, name: "Shipment Tracking" },
      { path: "/payment-success", element: <PaymentSuccessPage />, isProtected: true, name: "Payment Success" },
      { path: "/payment-cancelled", element: <PaymentCancelledPage />, isProtected: true, name: "Payment Cancelled" },
      { path: "/about", element: <AboutPage />, name: "About Us" },
      { path: "/careers", element: <CareersPage />, name: "Careers" },
      { path: "/press", element: <PressPage />, name: "Press" },
      { path: "/trust-safety", element: <TrustSafetyPage />, name: "Trust & Safety" },
      { path: "/terms", element: <TermsOfServicePage />, name: "Terms of Service" },
      { path: "/privacy", element: <PrivacyPolicyPage />, name: "Privacy Policy" },
      { path: "/cookies", element: <CookiePolicyPage />, name: "Cookie Policy" },
    ];

    const AppRoutes = () => {
      const location = useLocation();
    
      return (
        <Suspense fallback={<AppLoadingScreen />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-grow"
            >
              <Routes location={location}>
                {routesConfig.map(({ path, element, isProtected, name }) => {
                  return (
                    <Route
                      key={name || path}
                      path={path}
                      element={isProtected ? <ProtectedRoute>{element}</ProtectedRoute> : element}
                    />
                  );
                })}
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      );
    };
    AppRoutes.displayName = 'AppRoutes';

    function AppContent() {
      const auth = useAuth();
      const location = useLocation();
      
      if (auth?.loading) { 
        return <AppLoadingScreen />;
      }
      
      const showChatbotOnRoutes = ['/', '/support', '/how-it-works', '/send-a-bag', '/yank-a-bag-now'];
      const shouldShowChatbot = showChatbotOnRoutes.includes(location.pathname);

      return (
        <PageLayout showChatbot={shouldShowChatbot}>
          <AppRoutes />
        </PageLayout>
      );
    }
    AppContent.displayName = 'AppContent';
    
    function App() {
      return (
        <Router>
          <ScrollToTop />
          <AppStateProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </AppStateProvider>
          <Toaster />
        </Router>
      );
    }

    export default App;