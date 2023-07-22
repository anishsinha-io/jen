import { CodeElement, DefaultElement } from "@components/editor/elements/basic";
import { H1Element } from "@components/editor/elements/headings";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import React from "react";
import { Leaf } from "@components/editor/elements/leaf";

export const renderElement = <T extends RenderElementProps & { element: { type: string } }>(props: T) => {
    switch (props.element.type) {
        case "code":
            return <CodeElement children={props.children} {...props} />;
        case "h1":
            return <H1Element children={props.children} {...props} />;
        default:
            return <DefaultElement children={props.children} {...props} />;
    }
};

export const renderLeaf = (props: RenderLeafProps) => <Leaf children={props.children} {...props} />;
