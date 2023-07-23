import { KeyboardEvent } from "react";
import { Editor } from "slate";
import isHotkey from "is-hotkey";

import { toggleMark } from "@components/editor/util/marks";

export const handleKeyDown = (editor: Editor, e: KeyboardEvent<HTMLDivElement>) => {
    if (isHotkey("mod+b", e)) toggleMark(editor, "bold");
    if (isHotkey("mod+i", e)) toggleMark(editor, "italic");
    if (isHotkey("mod+u", e)) toggleMark(editor, "underline");
    if (isHotkey("mod+shift+x", e)) toggleMark(editor, "strikethrough");
};