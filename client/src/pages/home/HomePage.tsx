import React, { useContext, useEffect } from "react";

import styles from "./homepage.module.css";
import { Tab, TabContext } from "@/context/Tab";

const HomePage: React.FC = () => {
  const { setTab } = useContext<Tab>(TabContext);

  useEffect(() => {
    setTab(() => "home");
  }, []);

  return <section className={styles.home}>Welcome!</section>;
};

export default HomePage;
