import Head from "next/head";
import { Estimator } from "@/components";

export default function Home() {
  return (
    <>
      <Head>
        <title>Phoenix Validator Reward Estimator</title>
        <meta name="description" content="Phoenix Validator Reward Estimator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Estimator />
      </main>
    </>
  );
}
