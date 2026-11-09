/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CustomerRequest,
  ServiceItem,
  AdminSettings,
} from './types';
import {
  INITIAL_SERVICES,
  INITIAL_REQUESTS,
  INITIAL_SETTINGS,
} from './data/servicesData';
import { useFullscreen } from './hooks/useFullscreen';
import { CyberCommandCenter } from './components/cyber-workstation/CyberCommandCenter';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { HowItWorks } from './components/HowItWorks';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FullscreenControls } from './components/FullscreenControls';
import { ServiceRequestModal } from './components/ServiceRequestModal';
import { PaymentSectionModal } from './components/PaymentSectionModal';
import { RequestTrackingView } from './components/RequestTrackingView';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  // Fullscreen & Presentation Mode management using browser Fullscreen API
  const {
    isFullscreen,
    isPresentationMode,
    toggleFullscreen,
    exitFullscreen,
    togglePresentationMode,
  } = useFullscreen();

  // Persistent Requests State
  const [requests, setRequests] = useState<CustomerRequest[]>(() => {
    try {
      const saved = localStorage.getItem('vh_customer_requests_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REQUESTS;
  });

  // Persistent Services State (7 Services with Updated Pricing)
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const savedVersion = localStorage.getItem('vh_pricing_version');
      if (savedVersion === '2026_pricing_v2') {
        const saved = localStorage.getItem('vh_services_v4');
        if (saved) return JSON.parse(saved);
      }
      // Migrate to new pricing
      localStorage.setItem('vh_pricing_version', '2026_pricing_v2');
      localStorage.setItem('vh_services_v4', JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SERVICES;
  });

  // Persistent Admin Settings
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem('vh_admin_settings_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SETTINGS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vh_customer_requests_v3', JSON.stringify(requests));
    } catch (e) {
      console.error(e);
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem('vh_services_v4', JSON.stringify(services));
    } catch (e) {
      console.error(e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem('vh_admin_settings_v3', JSON.stringify(adminSettings));
    } catch (e) {
      console.error(e);
    }
  }, [adminSettings]);

  // Modal Flow States
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);
  const [activePaymentRequest, setActivePaymentRequest] = useState<CustomerRequest | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingInitialId, setTrackingInitialId] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Smooth scroll handler
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Step 1: User submits account details (username or mobile number) -> transitions to payment modal
  const handleServiceRequestSubmit = (newRequest: CustomerRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
    setSelectedServiceForModal(null);
    setActivePaymentRequest(newRequest);
  };

  // Step 2: User submits UTR on payment modal
  const handlePaymentSubmit = (
    requestId: string,
    utr: string,
    receiptImage?: string,
    amountPaid?: number,
    remainingAmount?: number,
    excessAmount?: number
  ) => {
    const now = new Date().toISOString();
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const updated: CustomerRequest = {
            ...r,
            utrNumber: utr,
            receiptImage: receiptImage || r.receiptImage,
            amountPaid: amountPaid !== undefined ? amountPaid : r.price,
            remainingAmount: remainingAmount || 0,
            excessAmount: excessAmount || 0,
            paymentStatus:
              (remainingAmount || 0) > 0 ? 'Payment Incomplete' : 'Verification Pending',
            requestStatus: 'Payment Verification',
            lastUpdatedDate: now,
            adminRemarks:
              (excessAmount || 0) > 0
                ? `UTR reference ${utr} logged with excess payment of ${r.currency}${excessAmount}. Queued for review.`
                : `UTR reference ${utr} logged for ${r.currency}${amountPaid || r.price}. In queue for administrative reconciliation.`,
          };
          setActivePaymentRequest(updated);
          return updated;
        }
        return r;
      })
    );
  };

  // Step 3: Transition to case tracker
  const handleTrackCaseFromPayment = (requestId: string) => {
    setActivePaymentRequest(null);
    setTrackingInitialId(requestId);
    setIsTrackingOpen(true);
  };

  // Admin Case Updates
  const handleUpdateRequest = (updated: CustomerRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  return (
    <div
      className={`min-h-screen bg-[#020704] text-slate-100 flex flex-col font-sans selection:bg-[#00FF41]/30 selection:text-[#00FF41] relative ${
        isFullscreen ? 'w-screen h-screen overflow-y-auto' : ''
      }`}
    >
      {/* 1. Full-Page Persistent Cyber Command Center (Matrix Canvas + 10 Automated Floating Programs + Controls) */}
      <CyberCommandCenter />

      {/* 2. Sticky Translucent Navigation Bar */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenTracking={() => {
          setTrackingInitialId('');
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onGetStarted={() => handleNavigate('services')}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        isPresentationMode={isPresentationMode}
      />

      {/* 3. Main Content Sections (Completely transparent background, animation visible throughout) */}
      <main className="flex-1 relative z-10 bg-transparent">
        {/* Section 4: Hero Section */}
        <HeroSection
          onExploreServices={() => handleNavigate('services')}
          onOpenTracking={() => {
            setTrackingInitialId('');
            setIsTrackingOpen(true);
          }}
        />

        {/* Section 5: Choose Your Recovery Service (7 cards) */}
        <ServicesSection
          services={services}
          onSelectService={(service) => setSelectedServiceForModal(service)}
        />

        {/* Section 9: About VIKAS HACKER */}
        <AboutSection />

        {/* Section 10: How It Works (4 steps) */}
        <HowItWorks />

        {/* Section 12: Contact on WhatsApp Only */}
        <ContactSection />
      </main>

      {/* Section 13: Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        isPresentationMode={isPresentationMode}
      />

      {/* Fullscreen & Presentation Mode Floating Bar */}
      <FullscreenControls
        isFullscreen={isFullscreen}
        isPresentationMode={isPresentationMode}
        onExitFullscreen={exitFullscreen}
        onTogglePresentation={togglePresentationMode}
      />

      {/* POPUP 1: Service Request Form (Only ONE input field) */}
      {selectedServiceForModal && (
        <ServiceRequestModal
          service={selectedServiceForModal}
          onClose={() => setSelectedServiceForModal(null)}
          onBack={() => setSelectedServiceForModal(null)}
          onSubmit={handleServiceRequestSubmit}
        />
      )}

      {/* POPUP 2: Payment Information & UTR Verification Screen */}
      {activePaymentRequest && (
        <PaymentSectionModal
          request={activePaymentRequest}
          adminSettings={adminSettings}
          onClose={() => setActivePaymentRequest(null)}
          onBackToForm={() => {
            const foundService = services.find((s) => s.id === activePaymentRequest.serviceId) || null;
            setActivePaymentRequest(null);
            setSelectedServiceForModal(foundService);
          }}
          onSubmitPayment={handlePaymentSubmit}
          onTrackCase={handleTrackCaseFromPayment}
        />
      )}

      {/* MODAL 3: Request Tracking System */}
      {isTrackingOpen && (
        <RequestTrackingView
          requests={requests}
          initialRequestId={trackingInitialId}
          onClose={() => setIsTrackingOpen(false)}
          onOpenPaymentModal={(req) => {
            setIsTrackingOpen(false);
            setActivePaymentRequest(req);
          }}
        />
      )}

      {/* MODAL 4: Completely Separate Secure Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          requests={requests}
          services={services}
          adminSettings={adminSettings}
          onUpdateRequest={handleUpdateRequest}
          onUpdateServices={(newServices) => setServices(newServices)}
          onUpdateSettings={(newSettings) => setAdminSettings(newSettings)}
        />
      )}

    </div>
  );
}
