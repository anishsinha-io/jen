import React from "react";

export interface ToolbarState {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    h1: boolean;
    h2: boolean;
    h3: boolean;
}

const ToolbarContext = React.createContext(null);

const Toolbar = () => {
    return <div></div>;
};

export default Toolbar;