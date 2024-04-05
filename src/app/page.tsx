import { Form } from "./components/form";
import { Tabs } from "./components/tabs";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.main}>
      <Tabs />
      <div className={styles.folder}>
        <Form />
      </div>
    </div>
  );
}
