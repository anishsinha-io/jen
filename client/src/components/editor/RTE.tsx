import React, { useCallback, useContext, useState } from "react";
import { Slate, Editable, ReactEditor } from "slate-react";
import { withReact } from "slate-react";
import { BaseEditor, createEditor, Descendant } from "slate";
import { renderElement, renderLeaf } from "@components/editor/render";
import { handleKeyDown } from "@components/editor/keybindings/meta";
import { HistoryEditor } from "slate-history";
import Toolbar from "@components/editor/toolbar/Toolbar";

import styles from "./RTE.module.css";
import EditorToolbarStatusContextProvider, {
    EditorToolbarStatusContext,
    EditorToolbarStatus,
} from "@components/editor/context/Editor";


const initialValue: Descendant[] = [
    {
        type: "paragraph",
        children: [{ text: "" }],
    } as Descendant,
];

const RTE = () => {
    // const [editor] = useState(() => withReact(createEditor()));

    const renderElementCb = useCallback(renderElement, []);
    const renderLeafCb = useCallback(renderLeaf, []);

    const {
        editor,
    } = useContext<EditorToolbarStatus>(EditorToolbarStatusContext);

    return <div className={styles.rte}>
        <Toolbar />
        <Slate editor={editor!} initialValue={initialValue}>
            <Editable placeholder={"Write something amazing..."}
                      onKeyDown={(e) => handleKeyDown(editor!, e)}
                      renderElement={renderElementCb}
                      renderLeaf={renderLeafCb}
                      className={styles.editor}
                      renderPlaceholder={({ children, attributes }) => (
                          <div {...attributes}>
                              <p className={styles.placeholder}>{children}</p>
                          </div>
                      )}
            />
        </Slate>
    </div>;
};

export default RTE;