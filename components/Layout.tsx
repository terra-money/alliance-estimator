import { useRef } from "react";
import Image from "next/image";
import { NativeAssetColumn, AllianceAssetColumn } from "@/components";
import { useAppState } from "@/contexts";
import styles from "@/styles/Layout.module.css";
import add_button from "@/styles/icons/add_button.svg";
import { APP_TITLE } from "@/constants";

function Layout() {
  const { allianceAssets, addAllianceAsset, nativeInputValues } = useAppState();
  const endOfPageRef = useRef<HTMLDivElement | null>(null);
  function handleScroll() {
    setTimeout(() => {
      endOfPageRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }

  return (
    <>
      <header>
        <h1>{APP_TITLE}</h1>
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
            <Image src={add_button} alt="Add Asset" />
          </button>
        </div>
      </main>
    </>
  );
}

export default Layout;
