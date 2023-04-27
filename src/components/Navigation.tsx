import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from "styles/Navigation.module.scss";

const Navigation = ({ handleModalOpen }: { handleModalOpen: () => void }) => {
  const location = useLocation();

  const shareIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  );

  return (
    <motion.nav
      className={styles.navigation}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.01,
      }}
    >
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
        {location.pathname !== "/mock-data" && (
          <button onClick={handleModalOpen}>{shareIcon}</button>
        )}
      </div>
      <div className={styles.button_container}>
        {location.pathname !== "/mock-data" ? (
          <div>
            <a
              className={styles.mockDataLink}
              href="/mock-data"
            >
              Mock data
              <img
                src="/Icons/Arrow.svg"
                alt="Arrow"
                width={14}
                height={14}
                className={styles.arrow}
              />
            </a>
          </div>
        ) : (
          <div>
            <a
              className={styles.mockDataLink}
              href="/"
            >
              Back to estimator
              <img
                src="/Icons/Arrow.svg"
                alt="Arrow"
                width={14}
                height={14}
                className={styles.arrow}
              />
            </a>
          </div>
        )}
        <a
          className={styles.terra_link}
          href='https://www.terra.money/'
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/Icons/TerraLogo.svg"
            alt="Terra"
            width={16}
            height={16}
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
        <a
          className={styles.terra_link}
          href='https://alliance.terra.money/'
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/Icons/Docs.svg"
            alt="Documentation Icon"
          />
          <span>Docs</span>
          <img
            src="/Icons/Arrow.svg"
            alt="Arrow"
            width={14}
            height={14}
            className={styles.arrow}
          />
        </a>
      </div>
    </motion.nav>
  )
}

export default Navigation;
