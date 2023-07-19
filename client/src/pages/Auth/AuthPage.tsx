import React from "react";
import Login from "../../components/Login/Login";

import styles from "./AuthPage.module.css";

const AuthPage: React.FC = () => {
    return <div className={styles.auth}>
        <Login />
    </div>;
};

export default AuthPage;