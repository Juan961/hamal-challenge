import Header from "@/components/Header";

import TruoraIFrame from "@/components/Iframe";
import TruoraOutbound from "@/components/Outbound";

const accountId = "70dfnoo9mn2lf052manim57cvg"

const outboundId = "OTB723153edce4324ef323314c53d944c96"
const outboundFlowId = "IPFaa962d8099dc437f3c1d95a21556df20"

const iframeFlowId = "IPF35f7c6bf39a917053b56d84539a9a471"

export default function Home() {
  return (
    <>
      <Header />

      <main className="grow w-full max-w-container-max mx-auto px-gutter py-2xl">
        <div className="max-w-200 mx-auto flex flex-col gap-xl">

          <TruoraOutbound accountId={accountId} flowId={outboundFlowId} outboundId={outboundId} />

          <TruoraIFrame accountId={accountId} flowId={iframeFlowId} />
          
        </div>
      </main>


    </>
  );
}
