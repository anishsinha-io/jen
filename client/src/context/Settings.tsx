import React, { useState } from 'react';

export interface UserSettings {
    darkMode: boolean;
    setDarkMode: any;
}

export const SettingsContext = React.createContext<UserSettings>({
    darkMode: true,
    setDarkMode: () => {
    }
});

export const SettingsContextProvider = (props) => {
    const [darkMode, setDarkMode] = useState<boolean>(true);

    return <SettingsContext.Provider value={{ darkMode, setDarkMode }}>
        {props.children}
    </SettingsContext.Provider>;
};