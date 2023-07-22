import { KeyboardEvent } from "react";
import { Editor } from "slate";
import { toggleMark } from "@components/editor/util/marks";

export const keybindingMap = {
    CMD_BOLD: "b",
    CMD_ITALIC: "i",
    CMD_UNDERLINE: "u",
    CMD_STRIKETHROUGH: "x",
};

export const handleKeyDown = (editor: Editor, e: KeyboardEvent<HTMLDivElement>) => {
    if (e.metaKey) {
        e.preventDefault();
        switch (e.key) {
            case keybindingMap.CMD_BOLD:
                toggleMark(editor, "bold");
                break;
            case keybindingMap.CMD_ITALIC:
                toggleMark(editor, "italic");
                break;
            case keybindingMap.CMD_UNDERLINE:
                toggleMark(editor, "underline");
                break;
            case keybindingMap.CMD_STRIKETHROUGH:
                if (e.shiftKey) {
                    toggleMark(editor, "strikethrough");
                }
                break;
        }
    }
};