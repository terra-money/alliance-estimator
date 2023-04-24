import { useRef, useEffect, useState } from "react"
import styles from "styles/Layout.module.scss"
import Navigation from "./Navigation"
import LandingSection from "./Sections/LandingSection"
import Estimator from "./Sections/Estimator"
import { useAppState } from "contexts"

function Layout() {
  const { shareLink } = useAppState()
  const [showAddButton, setShowAddButton] = useState(false)
  const estimatorRef = useRef<HTMLDivElement | null>(null)

  function handleScrollToEstimator() {
    estimatorRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }

  const handleShowAddButton = () => {
    const scrollY = window.scrollY
    const height = window.innerHeight

    if (scrollY >= height - 200) {
      setShowAddButton(true)
    } else {
      setShowAddButton(false)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", () => {
      handleShowAddButton()
    })

    return () => {
      window.removeEventListener("scroll", () => {
        handleShowAddButton()
      })
    }
  }, [])

  return (
    <>
      <header className={styles.header}>
        <Navigation />
      </header>
      <main>
        <LandingSection handleScrollToEstimator={handleScrollToEstimator} />
        <Estimator showAddButton={showAddButton} estimatorRef={estimatorRef} />
      </main>
      <footer>
        <div style={{ padding: 8 }}>
          <input
            style={{ padding: 8, backgroundColor: "#333", width: "100%" }}
            type="text"
            value={shareLink}
            readOnly
          />
        </div>
      </footer>
    </>
  )
}

export default Layout
