import React, { useCallback, useState } from "react";
import { Slate, Editable, ReactEditor } from "slate-react";
import { withReact } from "slate-react";
import { BaseEditor, createEditor, Descendant } from "slate";
import { renderElement, renderLeaf } from "@components/editor/render";
import { handleKeyDown } from "@components/editor/keybindings/meta";
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
        children: [{ text: "" }],
    } as Descendant,
];

const RTE = () => {
    const [editor] = useState(() => withReact(createEditor()));

    const renderElementCb = useCallback(renderElement, []);
    const renderLeafCb = useCallback(renderLeaf, []);

    return <Slate editor={editor} initialValue={initialValue}>
        <Editable placeholder={"Write something amazing..."}
                  onKeyDown={(e) => handleKeyDown(editor, e)}
                  renderElement={renderElementCb}
                  renderLeaf={renderLeafCb}
        />
    </Slate>;
};

export default RTE;