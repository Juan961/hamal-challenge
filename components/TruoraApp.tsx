"use client"

import { useState } from "react";

import { ArrowPathIcon } from "@heroicons/react/24/outline";

import TruoraIFrame from "@/components/Iframe";
import TruoraOutbound from "@/components/Outbound";

export type TruoraConfig = {
  accountId: string;
  outboundId: string;
  outboundFlowId: string;
  iframeFlowId: string;
};

const FIELDS: { key: keyof TruoraConfig; label: string }[] = [
  { key: "accountId", label: "Account ID" },
  { key: "outboundId", label: "Outbound ID" },
  { key: "outboundFlowId", label: "Outbound Flow ID" },
  { key: "iframeFlowId", label: "Iframe Flow ID" },
];

export default function TruoraApp({ defaults }: { defaults: TruoraConfig }) {
  const [config, setConfig] = useState<TruoraConfig>(defaults);

  const update = (key: keyof TruoraConfig, value: string) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  const reset = () => setConfig(defaults);

  const isModified = FIELDS.some(({ key }) => config[key] !== defaults[key]);

  return (
    <>
      <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-low overflow-hidden">

        <div className="p-xl border-b border-surface-container-highest flex items-start justify-between gap-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-xs">Configuration</h2>
            <p className="font-body-sm text-body-sm text-secondary">Override the Truora identifiers. Defaults come from environment variables.</p>
          </div>
          <button
            onClick={reset}
            disabled={!isModified}
            className="shrink-0 bg-surface-container-highest text-secondary font-label-md text-label-md py-sm px-lg rounded-lg hover:bg-surface-container-high active:scale-95 transition-all duration-100 flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Reset to defaults
          </button>
        </div>

        <div className="p-xl flex flex-col gap-lg">
          {FIELDS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-base">
              <label className="font-label-sm text-label-sm text-outline">{label}</label>
              <input
                className="w-full bg-surface-container-lowest border border-outline rounded-lg px-md py-sm font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
                type="text"
                value={config[key]}
                placeholder={defaults[key]}
                onChange={(e) => update(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <TruoraOutbound accountId={config.accountId} flowId={config.outboundFlowId} outboundId={config.outboundId} />

      <TruoraIFrame accountId={config.accountId} flowId={config.iframeFlowId} />
    </>
  );
}
