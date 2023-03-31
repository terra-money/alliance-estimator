import { NativeAssetColumn, AllianceAssetColumn } from "@/components";
import styles from "@/styles/Layout.module.css";

function Layout() {
  const allianceAssets = ["WHALELSD", "KUJILSD", "OSMOLSD", "OSMOLSD2"];
  return (
    <>
      <header>
        <h1>Phoenix Validator Reward Estimator</h1>
      </header>
      <main className={styles.columnContainer}>
        <div className={styles.assetColumn}>
          <NativeAssetColumn />
        </div>
        {allianceAssets.map((asset) => {
          return (
            <div key={`alliance-asset-${asset}`} className={styles.assetColumn}>
              <AllianceAssetColumn name={asset} />
            </div>
          );
        })}
      </main>
    </>
  );
}

export default Layout;
