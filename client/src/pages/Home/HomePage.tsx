import React, { useContext } from 'react';
import { SettingsContext, UserSettings } from "../../context/Settings";

import styles from "./homepage.module.css";

const HomePage: React.FC = () => {
    const { darkMode } = useContext<UserSettings>(SettingsContext);
    const darkModeClass = darkMode ? "dark" : "";

    return <section className={styles.home}>
        Home Page!
    </section>;
};

export default HomePage;