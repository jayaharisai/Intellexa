// src/components/ui/card.js
import React from "react";
import "../styles.css"

export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};