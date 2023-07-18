import { useState } from 'react';
import Login from "./components/Login/Login";

function App() {
    const [count, setCount] = useState(0);

    return (
        <section className={"app-container"}>
            <Login />
        </section>
    );
}

export default App;
