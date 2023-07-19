import React, { useState } from "react";

export interface Tab {
    tab: string;
    setTab: React.Dispatch<React.SetStateAction<string>>;
}

export const TabContext = React.createContext<Tab>({ tab: "Home", setTab: ((_) => "Home") });


export const TabContextProvider = (props) => {
    const [tab, setTab] = useState<string>("Home");

    return <TabContext.Provider value={{ tab, setTab }}>
        {props.children}
    </TabContext.Provider>;

};