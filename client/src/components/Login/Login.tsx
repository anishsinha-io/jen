import axios from 'axios';
import React, { useContext, useState } from 'react';


import { PiPasswordLight, PiUserCircleLight } from "react-icons/pi";
import { CiLogin } from 'react-icons/ci';

import NamedInputWithIcon from "../Util/NamedInputWithIcon/NamedInputWithIcon";
import NamedButtonWithIcon from "../Util/NamedButtonWithIcon/NamedButtonWithIcon";
import { Auth, AuthContext } from "../../context/Auth";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { authenticated, setToken, loading, token } = useContext<Auth>(AuthContext);

    const handleLogin = async () => {
        const res: any = await axios.post("http://localhost/api/auth/login", { email, password });
        if (res.status != 200) console.log("error logging in");
        else {
            setToken(() => res.data.token);
        }
    };

    const handleLogout = async () => {
        await axios.post("http://localhost/api/auth/logout", {}, { headers: { Authorization: "Bearer " + token } });
        setToken(() => "");
    };

    if (loading) return <div>LOADING</div>;

    return <>
        <div id="login" className={"login-box"}>
            {authenticated ? <h1>AUTHENTICATED</h1> : <h1>NOT AUTHENTICATED</h1>}
            <NamedInputWithIcon name={"Username"} icon={PiUserCircleLight} defaultInputText={"username"}
                                onTextChange={setEmail} text={email} iconSize={"1.5rem"} />
            <NamedInputWithIcon name={"Password"} icon={PiPasswordLight} defaultInputText={"password"}
                                onTextChange={setPassword} text={password} type={"password"} iconSize={"1.5rem"}
                                iconColor={"lightgray"} />
            <NamedButtonWithIcon text={"Sign In"} icon={CiLogin} onClick={handleLogin} />
            <NamedButtonWithIcon text={"Sign Out"} icon={CiLogin} onClick={handleLogout} />
        </div>
    </>;
};

export default Login;