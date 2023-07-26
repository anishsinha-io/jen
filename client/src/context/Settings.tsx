import React, { useState } from "react";

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
  BARBIE = "barbie",
}

export interface Settings {
  theme: Theme;
  setTheme: (_: any) => void;
}

// TODO i don't know
export const SettingsContext = React.createContext<Settings>({
  theme: Theme.BARBIE,
  setTheme: () => {},
});

export const SettingsContextProvider = (props: any) => {
  const [theme, setTheme] = useState<Theme>(Theme.BARBIE);

  return (
    <SettingsContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </SettingsContext.Provider>
  );
};
