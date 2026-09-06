// import { createContext, useState } from "react";

// export const CreateTripContext = createContext();

// export const CreateTripProvider = ({ children }) => {
//     const [tripData, setTripData] = useState({});

//     return (
//         <CreateTripContext.Provider value={{ tripData, setTripData }}>
//             {children}
//         </CreateTripContext.Provider>
//     );
// };
import React, { createContext, useState } from 'react';

export const CreateTripContext = createContext();

export const CreateTripProvider = ({ children }) => {
  const [tripData, setTripData] = useState({
    locationInfo: null,
    travelerCount: null,
    budget: null,
    startDate: null,
    endDate: null,
    totalDays: null,
  });

  const resetTripData = () => {
    setTripData({
      locationInfo: null,
      travelerCount: null,
      budget: null,
      startDate: null,
      endDate: null,
      totalDays: null,
    });
  };

  const updateTripData = (newData) => {
    setTripData(prev => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <CreateTripContext.Provider 
      value={{ 
        tripData, 
        setTripData: updateTripData,
        resetTripData 
      }}
    >
      {children}
    </CreateTripContext.Provider>
  );
};