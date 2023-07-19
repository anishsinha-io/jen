import React, { useContext } from "react";

import { useMediaQuery } from "usehooks-ts";

import { UserSettings, SettingsContext } from "../../context/Settings";

import { Link, redirect, useNavigate } from "react-router-dom";

import styles from "./navbar.module.css";
import { Tab, TabContext } from "../../context/Tab";

const Navbar: React.FC = () => {

    const { tab, setTab } = useContext<Tab>(TabContext);

    const { darkMode } = useContext<UserSettings>(SettingsContext);
    const darkModeClass = darkMode ? "dark" : "";

    const mobile = useMediaQuery("(max-width: 600px)");
    const tablet = useMediaQuery("(min-width: 768px)");


    return <nav className={styles.navbar}>
        <div className={styles["navbar-header"]}>
            <a className={styles["navbar-header-item"] + " " + ((tab === "Home") && styles.active)} href={"/"}>Home</a>
            <a className={styles["navbar-header-item"] + " " + ((tab === "About") && styles.active)}
               href={"/"}>About</a>
            <a className={styles["navbar-header-item"] + " " + ((tab === "Login") && styles.active)}
               href={"/"}>Login</a>
        </div>
    </nav>;
};

export default Navbar;