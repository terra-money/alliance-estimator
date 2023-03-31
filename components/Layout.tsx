import { NativeAssetColumn, AllianceAssetColumn } from "@/components";
import { useAppState } from "@/contexts";
import styles from "@/styles/Layout.module.css";

function Layout() {
  const { allianceAssets, addAllianceAsset } = useAppState();

  return (
    <>
      <header>
        <h1>Phoenix Validator Reward Estimator</h1>
      </header>
      <main className={styles.columnContainer}>
        <div className={styles.assetColumn}>
          <NativeAssetColumn />
        </div>
        {allianceAssets.map((asset, i) => {
          return (
            <div
              key={`alliance-asset-${asset.id}`}
              className={styles.assetColumn}
            >
              <AllianceAssetColumn id={asset.id} label={asset.label} />
            </div>
          );
        })}
        <div className={styles.addColumn}>
          <button
            onClick={() => {
              addAllianceAsset("New Asset");
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
