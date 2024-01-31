import { Poppins } from "next/font/google";
import Image from "next/image";
import React from "react";

import styles from "../styles/ProgramCard.module.css";

const poppins = Poppins({ weight: ["400", "700"], style: "normal", subsets: [] });

export type CardProps = {
  type: string;
  title: string;
  dates: string;
  numStudents: number;
  color: number;
  className?: string;
};

export function ProgramCard({ type, title, dates, numStudents, color, className }: CardProps) {
  let outerDivClass = styles.outerDiv;

  let topDivClass = styles.topDiv;
  switch (color) {
    case 1:
      topDivClass += ` ${styles.teal}`;
      break;
    case 2:
      topDivClass += ` ${styles.yellow}`;
      break;
    case 3:
      topDivClass += ` ${styles.red}`;
      break;
    case 4:
      topDivClass += ` ${styles.green}`;
      break;
    default:
      topDivClass += ` ${styles.teal}`;
      break;
  }

  const botDivClass = styles.botDiv;

  let typeClass = styles.type;
  typeClass += ` ${poppins.className}`;

  let titleClass = styles.title;
  titleClass += ` ${poppins.className}`;

  let dateClass = styles.dates;
  dateClass += ` ${poppins.className}`;

  let numClass = styles.numStudents;
  numClass += ` ${poppins.className}`;

  let numTextClass = styles.numText;
  numTextClass = ` ${poppins.className}`;

  const iconClass = styles.icon;

  if (className) {
    outerDivClass += ` ${className}`;
  }

  return (
    <div className={outerDivClass}>
      <div className={topDivClass}>
        <p className={typeClass}>{type} Program</p>
        <p className={titleClass}>{title}</p>
      </div>
      <div className={botDivClass}>
        <p className={dateClass}>{dates}</p>
        <div className={numClass}>
          <Image
            alt="students"
            src="/programs/Vector.png"
            height={12}
            width={18}
            className={iconClass}
          />
          <p className={numTextClass}>{numStudents} Students</p>
        </div>
      </div>
    </div>
  );
}
