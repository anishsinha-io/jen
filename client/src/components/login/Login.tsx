import React, { CSSProperties, useContext, useEffect, useState } from "react";
import axios from "axios";

import { BsPerson } from "react-icons/bs";

import styles from "@components/login/Login.module.css";

import { Auth, AuthContext } from "@/context/Auth";
import { Tab, TabContext } from "@/context/Tab";
import { Settings, SettingsContext, Theme } from "@/context/Settings";

import { PiPasswordLight } from "react-icons/pi";
import { BsCheck2All } from "react-icons/bs";
import { VscError } from "react-icons/vsc";

import { RingLoader } from "react-spinners";
import { http } from "@services/http";
import { useNavigate } from "react-router-dom";

const loginButtonCSSOverrides: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Login: React.FC = () => {
    const { setTab } = useContext<Tab>(TabContext);
    const { theme } = useContext<Settings>(SettingsContext);

    const iconColorDark = "#f8f9fa";
    const iconColorBarbie = "#0aaef3";

    let iconColor = "#0c0c0c";
    if (theme === Theme.BARBIE) iconColor = iconColorBarbie;
    if (theme === Theme.DARK) iconColor = iconColorDark;

    const navigate = useNavigate();

    const { authenticated, setToken, login } = useContext<Auth>(AuthContext);

    useEffect(() => {
        if (authenticated) navigate("/");
        setTab(() => "Login");
    }, [authenticated]);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [showSpinner, setShowSpinner] = useState<boolean>(false);
    const [showCheck, setShowCheck] = useState<boolean>(false);

    const [showLoginError, setShowLoginError] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<string>("");

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setLoginError(() => "Please enter an email and a password before submitting");
            setShowLoginError(() => true);
            return;
        }
        setShowSpinner(() => true);
        try {
            const res = await login(email, password);
            if (res.status !== 200) {
                setShowSpinner(() => false);
                setLoginError(() => "Invalid email or password");
                setShowLoginError(() => true);
                setEmail(() => "");
                setPassword(() => "");
            } else {
                setToken(() => res.data.token);
                setShowCheck(() => true);
                navigate("/");
                setShowSpinner(() => false);
            }
        } catch {
            setShowSpinner(() => false);
            setLoginError(() => "Invalid email or password");
            setShowLoginError(() => true);
            setEmail(() => "");
            setPassword(() => "");
        }
    };

    return <div className={styles.login + " " + styles["login-" + theme]}>
        <h1 className={styles["login-heading"]}>Welcome Back.</h1>
        {showLoginError &&
            <div className={styles["login-error"]}><p>{loginError}</p></div>}
        <form className={styles["login-form"] + " " + styles["login-form-" + theme]}>
            <label className={styles["input-label"]}>
                <BsPerson color={iconColor}
                          className={styles["input-icon"] + " " + styles["input-icon-" + theme]}
                          size={"2rem"} />
                <p>EMAIL</p>
                <input type={"text"} placeholder={"jennysinha@gmail.com"}
                       className={styles["input"] + " " + styles["input-" + theme] + " " + (showLoginError && styles.error)}
                       value={email}
                       onChange={(e) => {
                           setShowLoginError(() => false);
                           setEmail(e.target.value);
                       }}
                />
            </label>
            <label className={styles["input-label"]}>
                <PiPasswordLight color={iconColor}
                                 className={styles["input-icon"] + " " + styles["input-icon-" + theme]}
                                 size={"2rem"} />
                <p>PASSWORD</p>
                <input type={"password"} placeholder={"password"}
                       className={styles["input"] + " " + styles["input-" + theme] + " " + (showLoginError && styles.error)}
                       value={password}
                       onChange={(e) => {
                           setShowLoginError(() => false);
                           setPassword(e.target.value);
                       }
                       } />
            </label>
            <button type={"submit"} className={styles["login-button"] + " " + styles["login-button-" + theme]}
                    onClick={(e) => handleSignIn(e)}>
                {showLoginError || showSpinner || showCheck || <p>Login</p>}
                {showLoginError || showCheck || showSpinner && <RingLoader
                    color={iconColor}
                    // loading={showSpinner}
                    // cssOverride={loginButtonCSSOverrides}
                    size={30}
                    aria-label="Loading Spinner"
                    // data-testid="loader"
                    // className={styles["login-loading-spinner"]}
                />}
                {showLoginError || showSpinner || showCheck && <BsCheck2All size={"1.5rem"} color={iconColor} />}
                {showLoginError && <VscError color={iconColor} size={"1.75rem"} />}
            </button>
        </form>
    </div>;
};

export default Login;