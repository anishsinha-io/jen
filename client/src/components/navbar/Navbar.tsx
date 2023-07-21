import React, { useContext, useEffect } from "react";

import styles from "./navbar.module.css";

import { Tab, TabContext } from "@/context/Tab";
import { Auth, AuthContext } from "@/context/Auth";
import { RingLoader } from "react-spinners";
import { Settings, SettingsContext, Theme } from "@/context/Settings";

const Navbar: React.FC = () => {

    const { tab } = useContext<Tab>(TabContext);

    const { theme } = useContext<Settings>(SettingsContext);

    const iconColorDark = "#f8f9fa";
    const iconColorBarbie = "#0aaef3";

    let iconColor = "#0c0c0c";
    if (theme === Theme.BARBIE) iconColor = iconColorBarbie;
    if (theme === Theme.DARK) iconColor = iconColorDark;

    const { authenticated, logout, loading } = useContext<Auth>(AuthContext);

    return <nav className={styles.navbar}>
        <div className={styles["navbar-header"]}>
            <a className={styles["navbar-header-item"] + " " + ((tab === "home") && styles.active)} href={"/"}>Home</a>
            <a className={styles["navbar-header-item"] + " " + ((tab === "About") && styles.active)}
               href={"/about"}>About</a>
            {loading || !authenticated &&
                <a className={styles["navbar-header-item"] + " " + ((tab === "Login") && styles.active)}
                   href={"/login"}>Login</a>}
            {loading || authenticated &&
                <a className={styles["navbar-header-item"]} href={"/edit"}>Edit</a>
            }
            {loading &&
                <RingLoader
                    color={iconColor}
                    // loading={showSpinner}
                    // cssOverride={loginButtonCSSOverrides}
                    size={30}
                    aria-label="Loading Spinner"
                    // data-testid="loader"
                    // className={styles["login-loading-spinner"]}
                />
            }
            {loading || authenticated &&
                <a className={styles["navbar-header-item"]} href={"/"} onClick={logout}>Logout</a>}
            {loading && <RingLoader
                color={iconColor}
                // loading={showSpinner}
                // cssOverride={loginButtonCSSOverrides}
                size={30}
                aria-label="Loading Spinner"
                // data-testid="loader"
                // className={styles["login-loading-spinner"]}
            />}
        </div>
    </nav>;
};

export default Navbar;