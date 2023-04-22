import { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import Animate from 'components/Motion/Animate';
import styles from "styles/LandingSection.module.scss"

const LandingSection = ({ handleScrollToEstimator }: { handleScrollToEstimator: () => void }) => {
  const { scrollY } = useScroll() as any;
  const [northScrollY, setNorthScrollY] = useState(false);

  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY?.current < scrollY?.prev) {
        setNorthScrollY(true);
      } else if (scrollY?.current > scrollY?.prev) {
        setNorthScrollY(false);
      }
    })
  }, [scrollY])

  const textContainerVariants = {
    default: {
    },
    visible: {
      transition: {
        staggerChildren: 0.15,
        staggerDirection: northScrollY ? -1 : 1,
      },
    },
  };

  const fadeInVariants = {
    initial: {
      opacity: 0,
    },
    animate: (custom: number) => ({
      opacity: 1,
      transition: {
        opacity: {
          duration: 1.5, delay: custom * 1.5, ease: "easeInOut"
        }
      }
    })
  };

  return (
    <section className={styles.landing_section}>
      <motion.div
        className={styles.text_container}
        variants={textContainerVariants}
        initial="default"
        whileInView="visible"
        viewport={{ once: false }}
      >
        <div>
          <Animate customIndex={0}>
            <h1>
              Grow
            </h1>
          </Animate>
          <Animate customIndex={0}>
            <h1>
              blockchains
            </h1>
          </Animate>
          <Animate customIndex={0}>
            <h1>
              easier
            </h1>
          </Animate>
        </div>
        <Animate customIndex={1}>
          <h6>
            Alliance allows blockchains to trade yield with each other.
          </h6>
        </Animate>
        <Animate customIndex={2}>
          <p>
            Alliance is an open-source Cosmos SDK module that leverages interchain staking to form economic alliances among blockchains. By boosting the economic activity across Cosmos chains through creating bilateral, mutually beneficial alliances, Alliance aims to give rise to a new wave of innovation, user adoption, and cross-chain collaboration.
          </p>
        </Animate>
        <div className={styles.button_container}>
          <Animate customIndex={3}>
            <button
              className={styles.button}
              onClick={handleScrollToEstimator}
            >
              <img src="/Icons/Calc.svg" alt="Calculator" width={14} height={14} />
              Estimator
            </button>
          </Animate>
          <Animate customIndex={4}>
            <a
              className={styles.button}
              href="https://alliance.terra.money/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/Icons/Docs.svg" alt="Calculator" width={14} height={14} />
              Documentation
            </a>
          </Animate>
        </div>
      </motion.div>

      <div className={styles.blob_1} />
      <div className={styles.blob_2} />
      <div className={styles.blob_3} />

      <div className={styles.ellipse_1} />
      <div className={styles.ellipse_2} />
      <motion.div
        variants={fadeInVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: false }}
        custom={2}
        className={styles.ellipse_3}
      />
      <div className={styles.ellipse_4} />

      <motion.img
        variants={fadeInVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: false }}
        custom={1}
        src="/Icons/AllianceLogoOutline.svg"
        alt="Alliance Logo"
        className={styles.alliance_outline}
        width={800}
      />
    </section>
  )
};

export default LandingSection;