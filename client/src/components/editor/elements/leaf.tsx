import React from "react";
import { RenderLeafProps } from "slate-react";

export const Leaf: React.FC<RenderLeafProps> = ({ leaf, attributes, children }) => {

    const underline = leaf["underline"] ? "underline" : "";
    const strikeThrough = leaf["strikethrough"] ? "line-through" : "";
    const textDecorationClassName = underline + " " + strikeThrough;

    return (
        <span
            {...attributes}
            style={{
                fontWeight: leaf["bold"] ? "bold" : "normal",
                fontStyle: leaf["italic"] ? "italic" : "normal",
                textDecoration: textDecorationClassName,
            }}
        >
      {children}
    </span>
    );
};
