import { useRef } from "react";
import { useExampleAppState } from "../../contexts/ExampleAppStateProvider";
import { NativeAssetColumn, AllianceAssetColumn } from "components";
import add_button from "styles/icons/add_button.svg";
import styles from "styles/Estimator.module.scss";

const ExampleEstimator = ({
  estimatorRef,
}: {
  estimatorRef: any;
}) => {
  const {
    allianceAssets,
    addAllianceAsset,
    exampleNativeInputValues,
    setExampleNativeInputValues,
    setAllianceAssets
  } = useExampleAppState();
  const endOfPageRef = useRef<HTMLDivElement | null>(null);

  function handleScroll() {
    setTimeout(() => {
      endOfPageRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
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
          userInputValues={exampleNativeInputValues}
          setNativeInputValues={setExampleNativeInputValues}
        />
      </div>
      {Object.keys(allianceAssets).map((assetId) => {
        return (
          <div
            key={`alliance-asset-${assetId}`}
            className={styles.assetColumn}
          >
            <AllianceAssetColumn
              id={+assetId}
              label={allianceAssets[+assetId].name}
              userInputValues={allianceAssets[+assetId].inputValues}
              changeColumnTitle={changeColumnTitle}
            />
          </div>
        );
      })}
      <div ref={endOfPageRef} className={styles.lastColumn}>
        <div  className={styles.addColumn}>
          <button
            onClick={() => {
              addAllianceAsset("New Asset");
              handleScroll();
            }}
          >
            <img src={add_button} alt="Add Asset" />
          </button>
        </div>
      </div>
    </section>
  )
};

export default ExampleEstimator;