import React from "react";

import styles from "./EditorPage.module.css";
import RTE from "@/components/editor/RTE";

const EditorPage: React.FC = () => {
  return (
    <section className={styles.editor}>
      <RTE />
    </section>
  );
};

export default EditorPage;
