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
    toggleMark: (mark: string) => void
}

const initialState: EditorToolbarStatus = {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    toggleMark: (mark: string) => null,
};

export const EditorToolbarStatusContext = React.createContext<EditorToolbarStatus>(initialState);

const EditorToolbarStatusContextProvider = (props) => {
    const [bold, setBold] = useState<boolean>(false);
    const [italic, setItalic] = useState<boolean>(false);
    const [underline, setUnderline] = useState<boolean>(false);
    const [strikethrough, setStrikethrough] = useState<boolean>(false);

    const [editor] = useState(() => withReact(createEditor()));

    useEffect(() => console.clear(), []);

    const toggleMark = (mark: string) => {
        const marks: any = Editor.marks(editor);
        if (!marks) return;
        switch (mark) {
            case "bold":
                setBold((state) => !state);
                if (marks[mark]) {
                    Editor.removeMark(editor, mark);
                } else {
                    Editor.addMark(editor, mark, true);
                }
        }
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
        toggleMark,
    }}>{props.children}</EditorToolbarStatusContext.Provider>;
};

export default EditorToolbarStatusContextProvider;