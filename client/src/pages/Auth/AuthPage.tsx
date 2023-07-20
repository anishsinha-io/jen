import React, { useContext } from "react";
import Login from "../../components/Login/Login";

import styles from "./AuthPage.module.css";
import { Tab, TabContext } from "@/context/Tab";
import { Settings, SettingsContext, Theme } from "@/context/Settings";

const AuthPage: React.FC = () => {
    const { theme } = useContext<Settings>(SettingsContext);

    return <div className={styles.auth + " " + styles["auth-" + theme]}>
        <Login />
    </div>;
};

export default AuthPage;