import { useRef } from "react";
import { NativeAssetColumn, AllianceAssetColumn } from "components";
import { useAppState } from "contexts";
import styles from "styles/Layout.module.scss";
import add_button from "styles/icons/add_button.svg";
import { APP_TITLE } from "../constants";

function Layout() {
  const { allianceAssets, addAllianceAsset, nativeInputValues, setAllianceAssets, setNativeInputValues } = useAppState();
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
    <>
      <header className={styles.header}>
        <h1>{APP_TITLE}</h1>
      </header>
      <main className={styles.columnContainer}>
        <div className={styles.assetColumn_native}>
          <NativeAssetColumn
            userInputValues={nativeInputValues}
            setNativeInputValues={setNativeInputValues}
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
        <div ref={endOfPageRef} className={styles.addColumn}>
          <button
            onClick={() => {
              addAllianceAsset("New Asset");
              handleScroll();
            }}
          >
            <img src={add_button} alt="Add Asset" />
          </button>
        </div>
      </main>
    </>
  );
}

export default Layout;
