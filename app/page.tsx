"use client"

import { useState } from "react";

import { launchOutbound } from "@/actions/outbound";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("3246781687")

  const handleTriggerOutbound = async () => {
    const result = await launchOutbound(phoneNumber)
    console.log("Outbound result:", result)
  }

  return (
    <main>
      <h1 className="text-2xl font-bold">HAMAL Challenge</h1>

      <section>
        <h2 className="text-xl font-semibold">Outbound</h2>
        <p>Trigger an outbound message</p>
        <input type="text" disabled value="+57" />
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

        <button onClick={handleTriggerOutbound}>Trigger Outbound</button>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Iframe</h2>

        <iframe src="" frameBorder="0"></iframe>
      </section>

    </main>
  );
}
