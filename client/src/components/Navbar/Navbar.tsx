import React, { useContext } from 'react';

import { useMediaQuery } from "usehooks-ts";

import { UserSettings, SettingsContext } from "../../context/Settings";

import { Link, redirect, useNavigate } from "react-router-dom";

import styles from "./navbar.module.css";

const Navbar: React.FC = () => {
    const { darkMode } = useContext<UserSettings>(SettingsContext);
    const darkModeClass = darkMode ? "dark" : "";

    const mobile = useMediaQuery("(max-width: 600px)");
    const tablet = useMediaQuery("(min-width: 768px)");


    return <nav className={styles.navbar}>
        <div className={styles["navbar-header"]}>
            <a className={styles["navbar-header-item"]} href={"/"}>Home</a>
            <a className={styles["navbar-header-item"]} href={"/"}>About</a>
            <a className={styles["navbar-header-item"]} href={"/"}>Login</a>
        </div>
    </nav>;
};

export default Navbar;