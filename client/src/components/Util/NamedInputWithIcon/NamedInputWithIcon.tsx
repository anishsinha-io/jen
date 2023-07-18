import React, { useContext } from 'react';
import { IconType } from "react-icons";
import { SettingsContext, UserSettings } from "../../../context/Settings";

export type NamedInputWithIconProps = {
    name: string;
    icon: IconType;
    defaultInputText: string;
    text: string;
    onTextChange: React.Dispatch<React.SetStateAction<string>>;
    type?: string;
    iconSize?: string;
    iconColor?: string;
}

const NamedInputWithIcon: React.FC<NamedInputWithIconProps> = ({
                                                                   name,
                                                                   icon: Icon,
                                                                   defaultInputText,
                                                                   text,
                                                                   onTextChange,
                                                                   type,
                                                                   iconSize = "2rem",
                                                                   iconColor = "#000"
                                                               }) => {
    const { darkMode } = useContext<UserSettings>(SettingsContext);
    const darkModeClass = darkMode ? "dark" : "";

    const inputType = type ? type : "";

    return <>
        <div className={"named-input-wrapper " + darkModeClass}>
            <label className={"named-input-label " + darkModeClass}>
                <Icon className={"named-input-icon " + darkModeClass} size={iconSize!} color={iconColor!} />
                <input type={inputType} className={"named-input " + darkModeClass}
                       onChange={(e) => onTextChange(e.target.value)} placeholder={defaultInputText} />
            </label>
        </div>
    </>;
};

export default NamedInputWithIcon;