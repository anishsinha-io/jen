import React, { useContext, useEffect, useState } from "react";

import styles from "./homepage.module.css";
import { Tab, TabContext } from "@/context/Tab";

import RTE from "@components/editor/RTE";

const HomePage: React.FC = () => {
    const { setTab } = useContext<Tab>(TabContext);

    useEffect(() => {
        setTab(() => "home");
    }, []);


    return <section className={styles.home}>
        <RTE />
    </section>;
};

export default HomePage;