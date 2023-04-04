import Image from 'next/image';
import styles from "@/styles/ActionButtons.module.scss";

const ActionButtons = ({
  expandAll,
  collapseAll,
}: {
  expandAll: () => void;
  collapseAll: () => void;
}) => {
  return (
    <div className={styles.columnActions}>
      <button onClick={expandAll}>
        <Image
          src="/Icons/Chevron.svg"
          width={14}
          height={14}
          alt='double chevron down'
          style={{ transform: "rotate(180deg)" }}
        />
        Expand All
      </button>
      <button onClick={collapseAll}>
        <Image
          src="/Icons/Chevron.svg"
          width={14}
          height={14}
          alt='double chevron down'
        />
        Collapse All
      </button>
    </div>
  );
};

export default ActionButtons;