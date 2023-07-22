import React from "react";
import { RenderElementProps } from "slate-react";

export const H1Element: React.FC<RenderElementProps> = ({ attributes, children }) => {
    return <h1 {...attributes}>{children}</h1>;
};

export const H2Element: React.FC<RenderElementProps> = ({ attributes, children }) => {
    return <h2 {...attributes}>{children}</h2>;
};

export const H3Element: React.FC<RenderElementProps> = ({ attributes, children }) => {
    return <h3 {...attributes}>{children}</h3>;
};
