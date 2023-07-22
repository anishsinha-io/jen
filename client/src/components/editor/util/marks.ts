import { Editor } from "slate";

// export const toggleMark = (editor: Editor, mark: string) => {
//     if (!editor.marks) editor.marks = {} as Omit<Text, "text">;
//     if (editor.marks[mark]) {
//         editor.removeMark(mark);
//     } else {
//         editor.addMark(mark, true);
//     }
// };

export const toggleMark = (editor: Editor, mark: string) => {
    const marks: any = Editor.marks(editor);
    if (marks[mark]) {
        Editor.removeMark(editor, mark);
    } else Editor.addMark(editor, mark, true);
};