import React, { CSSProperties, useContext, useEffect, useState } from "react";
import axios from "axios";

import { BsPerson } from "react-icons/bs";

import styles from "@components/Login/Login.module.css";

import { Auth, AuthContext } from "@/context/Auth";
import { Tab, TabContext } from "@/context/Tab";
import { Settings, SettingsContext, Theme } from "@/context/Settings";

import { PiPasswordLight } from "react-icons/pi";
import { BsCheck2All } from "react-icons/bs";

import { ClipLoader, FadeLoader, MoonLoader, RingLoader } from "react-spinners";
import { http } from "@services/http";

const loginButtonCSSOverrides: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Login: React.FC = () => {

    const { setTab } = useContext<Tab>(TabContext);
    const { theme } = useContext<Settings>(SettingsContext);

    const iconColorLight = "#0c0c0c";
    const iconColorDark = "#f8f9fa";
    const iconColorBarbie = "#0aaef3";

    let iconColor = iconColorLight;
    if (theme === Theme.BARBIE) iconColor = iconColorBarbie;
    else iconColor = iconColorDark;


    useEffect(() => {
        setTab(() => "Login");
    }, []);

    const { authenticated, setToken, loading, token } = useContext<Auth>(AuthContext);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [showSpinner, setShowSpinner] = useState<boolean>(false);
    const [showCheck, setShowCheck] = useState<boolean>(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setShowSpinner(() => true);
        const res = await http.post("/auth/login", { email, password });
        console.log("HERE");
        console.log(res);
        if (res.status != 200) {
            console.log("error logging in");
        } else {
            setToken(() => res.data.token);
            setShowCheck(() => true);
        }
        setShowSpinner(() => false);
    };

    return <div className={styles.login + " " + styles["login-" + theme]}>
        <h1 className={styles["login-heading"]}>WELCOME BACK!</h1>
        <form className={styles["login-form"] + " " + styles["login-form-" + theme]}>
            <label className={styles["input-label"]}>
                <BsPerson color={iconColor}
                          className={styles["input-icon"] + " " + styles["input-icon-" + theme]}
                          size={"2rem"} />
                <p>EMAIL</p>
                <input type={"text"} placeholder={"jennysinha@gmail.com"}
                       className={styles["input"] + " " + styles["input-" + theme]} value={email}
                       onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className={styles["input-label"]}>
                <PiPasswordLight color={iconColor}
                                 className={styles["input-icon"] + " " + styles["input-icon-" + theme]}
                                 size={"2rem"} />
                <p>PASSWORD</p>
                <input type={"password"} placeholder={"password"}
                       className={styles["input"] + " " + styles["input-" + theme]} value={password}
                       onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type={"submit"} className={styles["login-button"] + " " + styles["login-button-" + theme]}
                    onClick={(e) => handleSignIn(e)}>
                {showSpinner || showCheck || <p>Login</p>}
                {showCheck || showSpinner && <RingLoader
                    color={iconColor}
                    // loading={showSpinner}
                    // cssOverride={loginButtonCSSOverrides}
                    size={30}
                    aria-label="Loading Spinner"
                    // data-testid="loader"
                    // className={styles["login-loading-spinner"]}
                />}
                {showSpinner || showCheck && <BsCheck2All size={"1.5rem"} color={iconColor} />}
            </button>
        </form>
    </div>;
};

export default Login;