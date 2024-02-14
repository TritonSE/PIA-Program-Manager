import { Button } from "../components/Button";
import { ProgramCard } from "../components/ProgramCard";
import styles from "../styles/Programs.module.css";

export default function Programs() {
  const cardsClass = styles.cards;
  const mainClass = styles.main;
  const headerClass = styles.header;
  let titleClass = styles.title;
  titleClass += ` font-[alternate-gothic]`;
  const spacerClass = styles.spacer;
  const grouperClass = styles.group;
  const addTaskClass = styles.addTask;

  return (
    <main className={mainClass}>
      <div className={headerClass}>
        <h1 className={titleClass}>Programs</h1>
        <div className={spacerClass}></div>
        <div className={grouperClass}>
          {/* Should be replaced with Add Button when created */}
          <Button label="+ Create Program" className={addTaskClass}></Button>
        </div>
      </div>
      <div className={cardsClass}>
        <ProgramCard
          type="Standard"
          title="Test"
          dates="Jun 12, 2023 - Jun 12, 2024"
          numStudents={1}
          color={1}
        />
        <ProgramCard
          type="Standard"
          title="Test"
          dates="Jun 12, 2023 - Jun 12, 2024"
          numStudents={1}
          color={2}
        />
        <ProgramCard
          type="Standard"
          title="Test"
          dates="Jun 12, 2023 - Jun 12, 2024"
          numStudents={1}
          color={3}
        />
        <ProgramCard
          type="Standard"
          title="Test"
          dates="Jun 12, 2023 - Jun 12, 2024"
          numStudents={1}
          color={3}
        />
        <ProgramCard
          type="Standard"
          title="Test"
          dates="Jun 12, 2023 - Jun 12, 2024"
          numStudents={1}
          color={3}
        />
        <ProgramCard
          type="Standard"
          title="Test"
          dates="Jun 12, 2023 - Jun 12, 2024"
          numStudents={1}
          color={3}
        />
      </div>
    </main>
  );
}
