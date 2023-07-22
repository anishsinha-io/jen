import React, { useContext, useEffect } from "react";

import styles from "./Toolbar.module.css";
import { Editor } from "slate";

import { BsTypeBold, BsTypeItalic, BsTypeStrikethrough, BsTypeUnderline } from "react-icons/bs";
import { EditorToolbarStatus, EditorToolbarStatusContext } from "@components/editor/context/Editor";

const Toolbar = () => {
    const { editor, setBold, bold, toggleMark } = useContext<EditorToolbarStatus>(EditorToolbarStatusContext);

    const handleClick = (e) => {
        toggleMark("bold");
    };

    return <div className={styles.toolbar}>
        <button data-name={"bold"} onClick={(e) => handleClick(e)}
                className={styles["toolbar-btn"] + (bold ? styles.active : "")}>
            <BsTypeBold size={20} />
        </button>
        {/*<button data-name={"italic"} onClick={handleClick} className={styles["toolbar-btn"]}>*/}
        {/*    <BsTypeItalic size={20} />*/}
        {/*</button>*/}
        {/*<button data-name={"underline"} onClick={handleClick} className={styles["toolbar-btn"]}>*/}
        {/*    <BsTypeUnderline size={20} />*/}
        {/*</button>*/}
        {/*<button data-name={"strikethrough"} onClick={handleClick} className={styles["toolbar-btn"]}>*/}
        {/*    <BsTypeStrikethrough size={20} />*/}
        {/*</button>*/}
    </div>;
};

export default Toolbar;