"use client"

import { useState } from "react";

import { ChevronRightIcon, CheckCircleIcon, ArrowPathIcon, XCircleIcon } from "@heroicons/react/24/outline";

import { launchOutbound } from "@/actions/outbound";

export default function TruoraOutbound({ accountId, flowId, outboundId }: { accountId: string; flowId: string, outboundId: string }) {
  const [phoneNumber, setPhoneNumber] = useState("3246781687")
  const [name, setName] = useState("Juan")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>(null)

  const handleTriggerOutbound = async () => {
    if (!phoneNumber || !name) {
      alert("Please enter both phone number and name.")
      return
    }

    if (loading) {
      return
    }

    setLoading(true)
    setSent(true)
    setResult(null)
    const data = await launchOutbound(accountId, flowId, outboundId, phoneNumber, name)
    setResult(data)
    setLoading(false)
    console.log("Outbound result:", data)
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-low overflow-hidden">

      <div className="p-xl border-b border-surface-container-highest">
        <h2 className="font-headline-sm text-headline-sm text-primary mb-xs">Outbound</h2>
        <p className="font-body-sm text-body-sm text-secondary">Launch a new outbound message to verify phone number via WhatsApp</p>
      </div>

      <div className="p-xl flex flex-col gap-lg">
        <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-md">
          <div className="flex flex-col gap-base">
            <label className="font-label-sm text-label-sm text-outline">Code</label>
            <input className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-sm py-sm font-body-md text-body-md text-secondary cursor-not-allowed text-center" disabled type="text" value="+57" />
          </div>

          <div className="flex flex-col gap-base">
            <label className="font-label-sm text-label-sm text-outline">Phone Number</label>
            <input className="w-full bg-surface-container-lowest border border-outline rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" placeholder="Enter phone number" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col gap-base">
          <label className="font-label-sm text-label-sm text-outline">Name</label>
          <input className="w-full bg-surface-container-lowest border border-outline rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <button onClick={handleTriggerOutbound} disabled={loading} className="w-full md:w-auto bg-primary text-on-primary font-label-md text-label-md py-sm px-lg rounded-lg hover:bg-surface-tint active:scale-95 transition-all duration-100 flex items-center justify-center gap-sm">
          <ChevronRightIcon className="h-5 w-5" />
          Trigger Outbound
        </button>

      </div>

      {
        sent &&
        <div className="bg-surface-container-low p-lg border-t border-surface-container-highest">
          <h3 className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-md">Resultado del outbound</h3>

          {
            loading ?
              <div className="bg-secondary-container text-on-secondary-container rounded-lg p-md flex items-start gap-md border border-tertiary-fixed-dim">
                <ArrowPathIcon className="h-5 w-5 text-secondary mt-xs animate-spin" />
                <p className="font-label-md text-label-md text-on-surface">Sending message...</p>
              </div>
            : result !== null ?
              <div className="bg-secondary-container text-on-secondary-container rounded-lg p-md flex items-start gap-md border border-tertiary-fixed-dim">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mt-xs" />
                <p className="font-label-md text-label-md text-on-surface">Message sent successfully</p>
              </div>
            :
              <div className="bg-error text-on-error rounded-lg p-md flex items-start gap-md border border-error-dim">
                <XCircleIcon className="h-5 w-5 mt-xs" />
                <p className="font-label-md text-label-md">Failed to send message. Please try again.</p>
              </div>
          }
        </div>
      }

    </section>
  );
};


