import { useRef } from "react";
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import styles from "styles/Layout.module.scss";
import Navigation from './Navigation';
import Estimator from './Sections/Estimator';
import ExampleEstimator from './Sections/ExampleEstimator';

function Layout() {
  const estimatorRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  return (
    <>
      <header className={styles.header}>
        <Navigation />
      </header>
      <main>
        {location.pathname !== "/mock-data" && (
          <a
            className={styles.mockDataLink}
            href="/mock-data"
          >
            Mock data example
            <img
              src="/Icons/Arrow.svg"
              alt="Arrow"
              width={14}
              height={14}
              className={styles.arrow}
            />
          </a>
        )}
        <Routes>
          <Route path="/" element={<Estimator estimatorRef={estimatorRef} />} />
          <Route path="mock-data" element={<ExampleEstimator estimatorRef={estimatorRef} />} />
        </Routes>
      </main>
    </>
  );
}

export default Layout;
