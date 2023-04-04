import { useRef } from "react";
import { NativeAssetColumn, AllianceAssetColumn } from "@/components";
import { useAppState } from "@/contexts";
import styles from "@/styles/Layout.module.css";

function Layout() {
  const { allianceAssets, addAllianceAsset, nativeInputValues } = useAppState();
  const endOfPageRef = useRef<HTMLDivElement | null>(null);
  function handleScroll() {
    setTimeout(() => {
      endOfPageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  }

  return (
    <>
      <header>
        <h1>Phoenix Validator Reward Estimator</h1>
      </header>
      <main className={styles.columnContainer}>
        <div className={styles.assetColumn}>
          <NativeAssetColumn userInputValues={nativeInputValues} />
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
              />
            </div>
          );
        })}
        <div ref={endOfPageRef} className={styles.addColumn}>
          <button
            onClick={() => {
              addAllianceAsset("New Asset");
              handleScroll();
            }}
          >
            Add Alliance Asset
          </button>
        </div>
      </main>
    </>
  );
}

export default Layout;
