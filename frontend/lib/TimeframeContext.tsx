'use client';

import React, { createContext, useContext, useState } from 'react';

type Timeframe = 'Today' | '7 Days' | '30 Days' | 'Year';

type TimeframeContextType = {
  selectedTimeframe: Timeframe;
  setSelectedTimeframe: (timeframe: Timeframe) => void;
};

const TimeframeContext = createContext<TimeframeContextType | undefined>(
  undefined
);

export function TimeframeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<Timeframe>('Today');

  return (
    <TimeframeContext.Provider
      value={{ selectedTimeframe, setSelectedTimeframe }}
    >
      {children}
    </TimeframeContext.Provider>
  );
}

export function useTimeframe() {
  const context = useContext(TimeframeContext);

  if (!context) {
    throw new Error(
      'useTimeframe must be used inside TimeframeProvider'
    );
  }

  return context;
}