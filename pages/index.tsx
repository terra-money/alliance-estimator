import Head from "next/head";
import { InitAppState } from "@/contexts";
import { Layout } from "@/components";
import { APP_TITLE } from "@/constants";

export default function Home() {
  return (
    <>
      <Head>
        <title>{APP_TITLE}</title>
        <meta name="description" content={APP_TITLE} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <InitAppState>
          <Layout />
        </InitAppState>
      </main>
    </>
  );
}
