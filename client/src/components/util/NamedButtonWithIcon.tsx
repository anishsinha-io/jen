import React, { useContext } from 'react';
import { IconType } from "react-icons";
import { SettingsContext, UserSettings } from "../../context/Settings";

export enum ButtonType {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    ACCENT = "accent"
}

export type NameButtonWithIconProps = {
    text: string;
    icon: IconType
    type?: ButtonType
    onClick: any
}

const NamedButtonWithIcon: React.FC<NameButtonWithIconProps> =

    ({ text, icon: Icon, type = ButtonType.PRIMARY, onClick }) => {
        const { darkMode } = useContext<UserSettings>(SettingsContext);
        const darkModeClass = darkMode ? "dark" : "";

        return <button className={"btn btn-with-icon btn-" + type + " " + darkModeClass} onClick={onClick}><Icon
            className={"named-button-icon"} />{text}</button>;
    };

export default NamedButtonWithIcon;