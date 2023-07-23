import React, { KeyboardEvent, useEffect, useState } from "react";
import { BaseEditor, createEditor, Editor } from "slate";
import { ReactEditor, withReact } from "slate-react";
import { HistoryEditor } from "slate-history";
import isHotkey from "is-hotkey";
import { toggleMark } from "@components/editor/util/marks";

declare module "slate" {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor;
    }
}

export interface EditorToolbarStatus {
    editor?: Editor,
    bold: boolean,
    italic: boolean,
    underline: boolean,
    strikethrough: boolean,
    toggleMarkDisplay: (mark: string) => void,
    handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void
}

const initialState: EditorToolbarStatus = {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    toggleMarkDisplay: (mark: string) => null,
    handleKeyDown: () => null,
};

export const EditorToolbarStatusContext = React.createContext<EditorToolbarStatus>(initialState);

const EditorToolbarStatusContextProvider = (props) => {
    const [bold, setBold] = useState<boolean>(false);
    const [italic, setItalic] = useState<boolean>(false);
    const [underline, setUnderline] = useState<boolean>(false);
    const [strikethrough, setStrikethrough] = useState<boolean>(false);

    const [editor] = useState(() => withReact(createEditor()));

    useEffect(() => console.clear(), []);

    const toggleMarkDisplay = (mark: string) => {
        if (mark === "bold") setBold((state) => !state);
        if (mark === "italic") setItalic((state) => !state);
        if (mark === "underline") setUnderline((state) => !state);
        if (mark === "strikethrough") setStrikethrough((state) => !state);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (isHotkey("mod+b", e)) {
            toggleMark(editor, "bold");
            toggleMarkDisplay("bold");
        }
        if (isHotkey("mod+i", e)) {
            toggleMark(editor, "italic");
            toggleMarkDisplay("italic");
        }
        if (isHotkey("mod+u", e)) {
            toggleMark(editor, "underline");
            toggleMarkDisplay("underline");
        }
        if (isHotkey("mod+shift+x", e)) {
            toggleMark(editor, "strikethrough");
            toggleMarkDisplay("strikethrough");
        }
    };

    return <EditorToolbarStatusContext.Provider value={{
        editor,
        bold,
        italic,
        underline,
        strikethrough,
        toggleMarkDisplay,
        handleKeyDown,
    }}>{props.children}</EditorToolbarStatusContext.Provider>;
};

export default EditorToolbarStatusContextProvider;