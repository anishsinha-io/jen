import React, { useCallback, useContext } from "react";
import { Editable, Slate } from "slate-react";
import { Descendant } from "slate";
import { renderElement, renderLeaf } from "@components/editor/render";
import Toolbar from "@components/editor/toolbar/Toolbar";

import styles from "./RTE.module.css";

import { EditorToolbarStatus, EditorToolbarStatusContext } from "@components/editor/context/Editor";


const initialValue: Descendant[] = [
    {
        type: "paragraph",
        children: [{ text: "" }],
    } as Descendant,
];

const RTE = () => {
    const renderElementCb = useCallback(renderElement, []);
    const renderLeafCb = useCallback(renderLeaf, []);

    const {
        editor, handleKeyDown,
    } = useContext<EditorToolbarStatus>(EditorToolbarStatusContext);

    return <div className={styles.rte}>
        <Toolbar />
        <Slate editor={editor!} initialValue={initialValue}>
            <Editable placeholder={"Write something amazing..."}
                      onKeyDown={(e) => handleKeyDown(e)}
                      renderElement={renderElementCb}
                      renderLeaf={renderLeafCb}
                      className={styles.editor}
                      renderPlaceholder={({ children, attributes }) => (
                          <span {...attributes} className={styles.placeholder}>
                              {children}
                          </span>
                      )}
            />
        </Slate>
    </div>;
};

export default RTE;