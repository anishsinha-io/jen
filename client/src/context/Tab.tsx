import React, { useState } from "react";

export interface Tab {
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
}

export const TabContext = React.createContext<Tab>({
  tab: "home",
  setTab: (_) => "home",
});

// TODO this or that
export const TabContextProvider = (props) => {
  const [tab, setTab] = useState<string>("home");

  return (
    <TabContext.Provider value={{ tab, setTab }}>
      {props.children}
    </TabContext.Provider>
  );
};
