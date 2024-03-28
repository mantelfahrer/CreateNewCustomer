import { Form } from "./components/form";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.tabs}>
        <div className={styles.tab}>Customer #1</div>
        <div className={styles.tabInactive}>Customer #2</div>
        <div className={styles.tabNew}>+</div>
      </div>
      <div className={styles.folder}>
        <Form />
      </div>
    </div>
  );
}
