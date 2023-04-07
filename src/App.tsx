import "styles/globals.scss";
import { InitAppState } from "contexts";
import { Layout } from "components";

export default function Home() {
  return (
    <main>
      <InitAppState>
        <Layout />
      </InitAppState>
    </main>
  );
}
