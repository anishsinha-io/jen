import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import { IoMdCheckmarkCircle } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";

import styles from "./Login.module.css";

import Spinner from "../../assets/loading.svg";

import { Auth, AuthContext } from "../../context/Auth";
import { Tab, TabContext } from "../../context/Tab";

const Login: React.FC = () => {

    const { tab, setTab } = useContext<Tab>(TabContext)

    useEffect(() => {
        setTab(() => "Login")
    }, [])

    const { authenticated, setToken, loading, token } = useContext<Auth>(AuthContext);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [showSpinner, setShowSpinner] = useState<boolean>(false);
    const [showCheck, setShowCheck] = useState<boolean>(false);

    const handleSignIn = async () => {
        setShowSpinner(() => true);
        const res = await axios.post("http://localhost/api/auth/login", { email, password });
        if (res.status != 200) {
            console.log("error logging in");
        } else {
            setToken(() => res.data.token);
            setShowCheck(() => true);
            setShowSpinner(() => false);
        }
    };

    return <div className={styles.login}>
        <h1 className={styles["login-heading"]}>Welcome Back!</h1>
        <label className={styles["login-input-label"]}>
            <p>Email</p>
            <input className={styles["login-input"]} type={"text"} placeholder={"email"}
                   value={email} onChange={(e: any) =>
                setEmail(() => e.target.value)} />
        </label>
        <label className={styles["login-input-label"]}>
            <p>Password</p>
            <input className={styles["login-input"]} type={"password"}
                   placeholder={"password"}
                   value={password} onChange={(e: any) => setPassword(() => e.target.value)} />
        </label>

        <button className={styles["login-button"] + " " + (email && password && styles.active)}
                onClick={handleSignIn}>
            {showSpinner && <img src={Spinner} alt={"loading"} className={styles["login-spinner"]} />}
            {showCheck && <IoMdCheckmarkCircle size={"2rem"} style={{ marginTop: "0.23rem" }} />}
            {showCheck || showSpinner || <p>Sign In</p>}
        </button>
    </div>;
};

export default Login;