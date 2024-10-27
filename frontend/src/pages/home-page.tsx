"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Home Page/Header";
import HeroSection from "../components/Home Page/HeroSection";
import FeaturesSection from "../components/Home Page/FeaturesSection";
import HowItWorksSection from "../components/Home Page/HowItWorksSection";
import CallToActionSection from "../components/Home Page/CallToActionSection";
import Footer from "../components/Home Page/Footer";

const HomePage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header
        toggleMobileMenu={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CallToActionSection />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
