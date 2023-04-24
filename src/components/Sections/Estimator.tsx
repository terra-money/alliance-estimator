import { useRef } from "react"
import { useAppState } from "contexts"
import { NativeAssetColumn, AllianceAssetColumn } from "components"
import add_button from "styles/icons/add_button.svg"
import styles from "styles/Estimator.module.scss"

const Estimator = ({
  showAddButton,
  estimatorRef,
}: {
  showAddButton: boolean
  estimatorRef: any
}) => {
  const {
    allianceAssets,
    addAllianceAsset,
    nativeInputValues,
    setNativeInputValues,
    setAllianceAssets,
  } = useAppState()
  const endOfPageRef = useRef<HTMLDivElement | null>(null)

  function handleScroll() {
    console.log("hello?")
    setTimeout(() => {
      endOfPageRef.current?.scrollIntoView({
        behavior: "smooth",
      })
    }, 100)
  }

  const changeColumnTitle = (id: any, name: any) => {
    setAllianceAssets({
      ...allianceAssets,
      [id]: {
        name,
        inputValues: allianceAssets[id].inputValues,
      },
    })
  }

  return (
    <section ref={estimatorRef} className={styles.columnContainer}>
      <div className={styles.assetColumn_native}>
        <NativeAssetColumn
          userInputValues={nativeInputValues}
          setNativeInputValues={setNativeInputValues}
        />
      </div>
      {Object.keys(allianceAssets).map((assetId) => {
        return (
          <div key={`alliance-asset-${assetId}`} className={styles.assetColumn}>
            <AllianceAssetColumn
              id={+assetId}
              label={allianceAssets[+assetId].name}
              userInputValues={allianceAssets[+assetId].inputValues}
              changeColumnTitle={changeColumnTitle}
            />
          </div>
        )
      })}
      <div ref={endOfPageRef} className={styles.lastColumn}>
        {showAddButton && (
          <div className={styles.addColumn}>
            <button
              onClick={() => {
                addAllianceAsset("New Asset")
                handleScroll()
              }}
            >
              <img src={add_button} alt="Add Asset" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Estimator
