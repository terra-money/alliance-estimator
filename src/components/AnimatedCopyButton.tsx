import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAppState } from "contexts";
import styles from "styles/AnimatedCopyButton.module.scss";

const AnimatedCopyButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const { shareLink } = useAppState()

  const handleCopy = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 2000);
  };

  const copyIcon = (
    <motion.svg
      whileTap={{ scale: 0.9 }}
      onClick={handleCopy}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </motion.svg>
  );

  const checkmarkIcon = (
    <motion.svg
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </motion.svg>
  );

  return (
    <CopyToClipboard
      text={shareLink}
      onCopy={handleCopy}
    >
      <div>
        <div className={styles.url}>
          <div className={styles.input_wrapper}>
            <input
              className={styles.input}
              type="text"
              value={shareLink}
              readOnly
            />
            <div className={styles.inputSuffix}>
              <AnimatePresence mode="wait">
                {!isClicked && (
                  <motion.div
                    key="copyIcon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ height: "24px" }}
                  >
                    {copyIcon}
                  </motion.div>
                )}
                {isClicked && (
                  <motion.div
                    key="checkmarkIcon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ height: "24px" }}
                  >
                    {checkmarkIcon}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </CopyToClipboard>
  );
};

export default AnimatedCopyButton;
