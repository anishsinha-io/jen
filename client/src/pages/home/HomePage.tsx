import React, { useContext, useEffect } from "react";
import { SettingsContext, Settings } from "@/context/Settings";

import styles from "./homepage.module.css";
import { Tab, TabContext } from "@/context/Tab";

const HomePage: React.FC = () => {
    const { darkMode } = useContext<Settings>(SettingsContext);
    const darkModeClass = darkMode ? "dark" : "";

    const { setTab } = useContext<Tab>(TabContext);

    useEffect(() => {
        setTab(() => "home");
    }, []);

    return <section className={styles.home}>
        Home Page!
    </section>;
};

export default HomePage;