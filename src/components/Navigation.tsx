import { useState } from 'react';
import styles from "styles/Navigation.module.scss";

const Navigation = () => {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  return (
    <nav className={styles.navigation}>
      <div className={styles.left_container}>
        <a
          className={styles.logo_container}
          href="/"
        >
          <img
            src="/Icons/Logo.svg"
            className={styles.logo}
            alt="Logo"
            width={40}
            height={40}
          />
          <h3>Alliance Estimator</h3>
        </a>
      </div>
      <div className={styles.button_container}>
        <a
          className={`${styles.terra_link} ${hoveredIndex === 0 ? styles.hovered : ''}`}
          href='https://www.terra.money/'
          onMouseOver={() => setHoveredIndex(0)}
          onMouseLeave={() => setHoveredIndex(-1)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/Icons/TerraLogo.svg"
            alt="Terra"
          />
          <span>terra.money</span>
          <img
            src="/Icons/Arrow.svg"
            alt="Arrow"
            width={14}
            height={14}
            className={styles.arrow}
          />
        </a>
        <button
          className={`${styles.terra_link} ${styles.documentation} ${hoveredIndex === 2 ? styles.hovered : ''}`}
          onMouseOver={() => setHoveredIndex(2)}
          onMouseLeave={() => setHoveredIndex(-1)}
        >
          <img
            src="/Icons/Docs.svg"
            alt="Documentation Icon"
          />
          <span>Documentation</span>
          <img
            src="/Icons/Arrow.svg"
            alt="Arrow"
            width={14}
            height={14}
            className={styles.arrow}
          />
        </button>
      </div>
    </nav>
  )
}

export default Navigation;
