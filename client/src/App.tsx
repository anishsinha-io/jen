import { useState } from "react";
import Login from "./components/login/Login";

function App() {
    const [count, setCount] = useState(0);

    return (
        <section className={"app-container"}>
            <Login />
        </section>
    );
}

export default App;
