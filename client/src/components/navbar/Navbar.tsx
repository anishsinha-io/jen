import React, { useContext, useEffect } from "react";

import styles from "./navbar.module.css";

import { Tab, TabContext } from "@/context/Tab";
import { Auth, AuthContext } from "@/context/Auth";

import { http } from "@services/http";

const Navbar: React.FC = () => {

    const { tab } = useContext<Tab>(TabContext);

    const { authenticated, logout } = useContext<Auth>(AuthContext);

    return <nav className={styles.navbar}>
        <div className={styles["navbar-header"]}>
            <a className={styles["navbar-header-item"] + " " + ((tab === "home") && styles.active)} href={"/"}>Home</a>
            <a className={styles["navbar-header-item"] + " " + ((tab === "About") && styles.active)}
               href={"/about"}>About</a>
            {!authenticated &&
                <a className={styles["navbar-header-item"] + " " + ((tab === "Login") && styles.active)}
                   href={"/login"}>Login</a>}
            {authenticated &&
                <a className={styles["navbar-header-item"]} href={"/"} onClick={logout}>Logout</a>}
        </div>
    </nav>;
};

export default Navbar;