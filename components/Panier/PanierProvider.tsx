"use client";

import React, { useState } from "react";
import PanierDrawer from "./PanierDrawer";
import CheckoutModal from "./CheckoutModal";

const PanierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      {children}
      <PanierDrawer />
      <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </>
  );
};

export default PanierProvider;
