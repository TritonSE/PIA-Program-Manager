import { title } from "process";
import { ProgramCard } from "../components/ProgramCard";
import styles from "../styles/Programs.module.css";

import { League_Gothic } from "next/font/google";

const gothic = League_Gothic({ weight: ["400"], style: "normal", subsets: [] });

export default function Programs() {
  const cardsClass = styles.cards;
  const mainClass = styles.main;
  let titleClass = styles.title;
  titleClass += ` ${gothic.className}`;

  return (
    <main className={mainClass}>
      <h1 className={titleClass}>PROGRAMS</h1>
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
