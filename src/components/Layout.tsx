import { useRef, useState } from "react";
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import styles from "styles/Layout.module.scss";
import Navigation from './Navigation';
import Estimator from './Sections/Estimator';
import ExampleEstimator from './Sections/ExampleEstimator';
import Modal from './Modal';
import AnimatedCopyButton from './AnimatedCopyButton';

function Layout() {
  const estimatorRef = useRef<HTMLDivElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <Navigation handleModalOpen={handleModalOpen} />
      </header>
      <main>
        <Routes>
          <Route path="/" element={
            <Estimator estimatorRef={estimatorRef} />
          } />
          <Route path="/mock-data" element={<ExampleEstimator estimatorRef={estimatorRef} />} />
        </Routes>
      </main>
      {location.pathname !== "/mock-data" && (
        <Modal isOpen={modalOpen} onClose={handleModalClose}>
          <div className={styles.copy_modal}>
            <h2>Share Estimator</h2>
            <div className={styles.middle_section}>
              <div className={styles.text}>
                <p>You can share your data by copying the URL provided below. </p>
                <p>Anyone with this URL will be able to view and interact with the data you've shared.</p>
              </div>
              <div className={styles.info}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8 15.5C12.14 15.5 15.5 12.14 15.5 8C15.5 3.86 12.14 0.5 8 0.5C3.86 0.5 0.5 3.86 0.5 8C0.5 12.14 3.86 15.5 8 15.5V15.5ZM7.25 4.25L8.75 4.25L8.75 8.75H7.25L7.25 4.25V4.25ZM7.25 10.25H8.75V11.75H7.25V10.25V10.25Z" fill="#EE4444"/>
                </svg>

                <div className={styles.text}>
                  <p>Sharing the URL below lets others view your data. If they modify it, a new URL is created with the changes. Share the new URL for the latest data, as the old one keeps the original data.</p>
                </div>
              </div>
            </div>
            <AnimatedCopyButton />
          </div>
        </Modal>
      )}
    </>
  )
}

export default Layout
