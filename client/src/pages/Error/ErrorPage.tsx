import React from 'react';

import styles from "./ErrorPage.module.css";
import { useRouteError } from "react-router-dom";

const ErrorPage: React.FC = () => {

    const error = useRouteError();
    console.error(error);

    return <section className={styles.error}>
        <h1>Sorry, an unexpected error has occurred</h1>
        <p>
            <i>{error.statusText || error.message}</i>
        </p>
    </section>;
};

export default ErrorPage;