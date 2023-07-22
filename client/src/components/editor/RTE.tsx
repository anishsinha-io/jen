import React, { useState } from "react";
import { Slate, Editable } from "slate-react";
import { withReact } from "slate-react";
import { createEditor, Descendant } from "slate";

const initialValue: Descendant[] = [
    {
        type: "paragraph",
        children: [{ text: "jennysinha" }],
    } as Descendant,
];

const RTE = () => {
    const [editor] = useState(() => withReact(createEditor()));
    return <Slate editor={editor} initialValue={initialValue}>
        <Editable />
    </Slate>;
};

export default RTE;