import React, { useEffect, useState } from "react";
import { BaseEditor, createEditor, Editor } from "slate";
import { ReactEditor, withReact } from "slate-react";
import { HistoryEditor } from "slate-history";

declare module "slate" {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor;
    }
}

export interface EditorToolbarStatus {
    editor?: Editor,
    bold: boolean,
    setBold?: React.Dispatch<React.SetStateAction<boolean>>,
    italic: boolean,
    setItalic?: React.Dispatch<React.SetStateAction<boolean>>,
    underline: boolean,
    setUnderline?: React.Dispatch<React.SetStateAction<boolean>>,
    strikethrough: boolean,
    setStrikethrough?: React.Dispatch<React.SetStateAction<boolean>>,
    toggleMarkDisplay: (mark: string) => void
}

const initialState: EditorToolbarStatus = {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    toggleMarkDisplay: (mark: string) => null,
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
        if (mark === "italic") setBold((state) => !state);
        if (mark === "underline") setBold((state) => !state);
        if (mark === "strikethrough") setBold((state) => !state);
    };

    return <EditorToolbarStatusContext.Provider value={{
        editor,
        bold,
        setBold,
        italic,
        setItalic,
        underline,
        setUnderline,
        strikethrough,
        setStrikethrough,
        toggleMarkDisplay,
    }}>{props.children}</EditorToolbarStatusContext.Provider>;
};

export default EditorToolbarStatusContextProvider;