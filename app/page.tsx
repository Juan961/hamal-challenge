import Header from "@/components/Header";

import TruoraApp, { TruoraConfig } from "@/components/TruoraApp";

const defaults: TruoraConfig = {
  accountId: process.env.TRUORA_ACCOUNT_ID || "70dfnoo9mn2lf052manim57cvg",
  outboundId: process.env.TRUORA_OUTBOUND_ID || "OTBc844b322cff54ba7aa9048d3b7e6cfd6",
  outboundFlowId: process.env.TRUORA_OUTBOUND_FLOW_ID || "IPFaa962d8099dc437f3c1d95a21556df20",
  iframeFlowId: process.env.TRUORA_IFRAME_FLOW_ID || "IPF35f7c6bf39a917053b56d84539a9a471",
};

export default function Home() {
  return (
    <>
      <Header />

      <main className="grow w-full max-w-container-max mx-auto px-gutter py-2xl">
        <div className="max-w-200 mx-auto flex flex-col gap-xl">

          <TruoraApp defaults={defaults} />

        </div>
      </main>
    </>
  );
}
