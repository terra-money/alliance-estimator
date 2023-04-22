import styles from "styles/ActionButtons.module.scss";

const ActionButtons = ({
  expandAll,
  collapseAll,
  allOpened,
  allClosed,
}: {
  expandAll: () => void;
  collapseAll: () => void;
  allOpened: boolean;
  allClosed: boolean;
}) => {
  return (
    <div className={styles.columnActions}>
      <button className={`${allOpened ? styles.all : ''}`} onClick={expandAll}>
        <img
          src="/Icons/Chevron.svg"
          width={12}
          height={12}
          alt='double chevron down'
          style={{ transform: "rotate(180deg)" }}
        />
        Open All
      </button>
      <button className={`${allClosed ? styles.all : ''}`} onClick={collapseAll}>
        <img
          src="/Icons/Chevron.svg"
          width={12}
          height={12}
          alt='double chevron down'
        />
        Close All
      </button>
    </div>
  );
};

export default ActionButtons;