import "styles/globals.scss";
import { InitAppState } from "contexts";
import { Layout } from "components";
import { BrowserRouter } from 'react-router-dom';
import ExampleAppState from 'contexts/ExampleAppStateProvider';

export default function Home() {
  return (
    <InitAppState>
      <ExampleAppState>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </ExampleAppState>
    </InitAppState>
  );
}
