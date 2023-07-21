import React, { useCallback, useContext, useEffect, useState } from "react";

import styles from "./homepage.module.css";
import { Tab, TabContext } from "@/context/Tab";

import { toggleMark } from "@components/editor/util/marks";

import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";

import { BaseEditor, Transforms, Element, Editor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

type CustomElement = { type: "paragraph"; children: CustomText[] }
type CustomText = { text: string; bold?: true }

declare module "slate" {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}


const initialValue: Descendant[] = [
    {
        type: "paragraph",
        children: [{ text: "A line of text in a paragraph." }],
    } as Descendant,
];

const CodeElement = (props) => {
    return <pre {...props.attributes}>
        <code>{props.children}</code>
    </pre>;
};

const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = (props: RenderLeafProps) => {

    const underline = props.leaf["underline"] ? "underline" : "";
    const strikeThrough = props.leaf["strikethrough"] ? "line-through" : "";

    const textDecorationClassName = underline + " " + strikeThrough;
    console.log(textDecorationClassName);

    return (
        <span
            {...props.attributes}
            style={{
                fontWeight: props.leaf["bold"] ? "bold" : "normal",
                fontStyle: props.leaf["italic"] ? "italic" : "normal",
                textDecoration: textDecorationClassName,
            }}
        >
      {props.children}
    </span>
    );
};


const HomePage: React.FC = () => {
    const { setTab } = useContext<Tab>(TabContext);

    useEffect(() => {
        setTab(() => "home");
    }, []);


    const [editor] = useState(() => withReact(createEditor()));

    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case "code":
                return <CodeElement {...props} />;
            default:
                return <DefaultElement {...props} />;
        }
    }, []);

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />;
    }, []);


    // Render the Slate context.
    return <section className={styles.home}>
        <Slate editor={editor} initialValue={initialValue}>
            <Editable onKeyDown={(e) => {
                if (!e.ctrlKey) return;

                switch (e.key) {
                    case "`": {
                        e.preventDefault();
                        const [match] = Editor.nodes(editor, {
                            match: (n: any) => n.type === "paragraph",
                        });
                        Transforms.setNodes<any>(editor, { type: match ? "code" : "paragraph" }, { match: n => Element.isElement(n) && Editor.isBlock(editor, n) });
                        break;
                    }
                    case "b": {
                        e.preventDefault();
                        toggleMark(editor, "bold");
                        break;
                    }
                    case "i": {
                        e.preventDefault();
                        toggleMark(editor, "italic");
                        break;
                    }
                    case "u": {
                        e.preventDefault();
                        toggleMark(editor, "underline");
                        break;
                    }
                    case "s": {
                        e.preventDefault();
                        toggleMark(editor, "strikethrough");
                        break;
                    }
                }
            }} renderElement={renderElement} renderLeaf={renderLeaf}
            />
        </Slate>
    </section>;
};

export default HomePage;