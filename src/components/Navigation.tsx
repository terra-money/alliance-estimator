import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import styles from "styles/Navigation.module.scss";

const navigationVariants = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      y: {
        duration: 0.3, ease: [0.34, 1.26, 0.64, 1]
      },
      opacity: {
        duration: 1,
      }
    }
  },
};

const Navigation = () => {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [hidden, setHidden] = useState(true);

  const { scrollY } = useScroll() as any;

  useEffect(() => {
    if (scrollY?.current === 0) {
      setHidden(false);
    }
  }, [scrollY, setHidden])

  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY?.current < scrollY?.prev && scrollY?.current < 500) {
        setHidden(false);
      } else if (scrollY?.current > 50 && scrollY?.current > scrollY?.prev) {
        setHidden(true);
      }
    })
  }, [scrollY, setHidden])

  return (
    <motion.nav
      className={styles.navigation}
      variants={navigationVariants}
      initial="hidden"
      animate={hidden ? "hidden" : "visible"}
    >
      <div className={styles.left_container}>
        <div className={styles.logo_container}>
          <img
            src="/Icons/Logo.svg"
            className={styles.logo}
            alt="Logo"
            width={40}
            height={40}
          />
          <h3>Alliance</h3>
        </div>
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
    </motion.nav>
  )
}

export default Navigation;
