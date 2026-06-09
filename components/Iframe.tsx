"use client"

import { useEffect, useRef, useState } from "react";

import { LockClosedIcon, DocumentCheckIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { generateWebToken } from "../actions/truora";

export default function TruoraIFrame({ accountId, flowId }: { accountId: string; flowId: string }) {
  const [iframeSrc, setIframeSrc] = useState('');
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [isTrusted, setIsTrusted] = useState<boolean | null>(null);
  const [processStarted, setProcessStarted] = useState(false);
  const [processInProgress, setProcessInProgress] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // The iframe is cross-origin, so we can't listen for clicks inside it.
    // When the user clicks into it, the parent window blurs and the iframe
    // becomes the document's active element — use that to detect first interaction.
    const handleBlur = () => {
      if (document.activeElement === iframeRef.current) {
        setProcessStarted(true);
        setProcessInProgress(true);
      }
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  useEffect(() => {
    generateWebToken(accountId, flowId).then(token => {
      setIframeSrc(`https://identity.truorastaging.com/?token=${token}`);
      setTokenLoaded(true);
    });

    const handleMessage = (event: MessageEvent) => {
      // Log the REAL message: origin + payload (not the MessageEvent object,
      // whose data/origin are non-enumerable and get dropped by JSON.stringify).
      console.log('postMessage received', { origin: event.origin, data: event.data });

      // Serialize the actual payload so we can see its true shape in the view.
      const payload =
        typeof event.data === 'string' ? event.data : JSON.stringify(event.data);

      // Record EVERY message so nothing is hidden. Origin is included so you can
      // tell Truora events apart from dev-tooling / extension noise.
      setEvents(prev => [...prev, `[${event.origin}] ${payload}`]);

      // React to the known Truora events.
      if (event.data === 'truora.process.succeeded') {
        setIsTrusted(true);
      } else if (event.data === 'truora.process.failed') {
        setIsTrusted(false);
      } else if (event.data === 'truora.steps.completed') {
        setProcessInProgress(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [accountId, flowId]);

  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-low overflow-hidden">

      <div className="p-xl border-b border-surface-container-highest">
        <h2 className="font-headline-sm text-headline-sm text-primary mb-xs">Iframe</h2>
        <p className="font-body-sm text-body-sm text-secondary">Embed the Truora iframe to display the verification interface</p>
      </div>

      {
        isTrusted === null &&
        <div className="p-xl flex flex-col items-center justify-center min-h-125 bg-surface-bright relative">

          {!tokenLoaded &&
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-bright/80 backdrop-blur-sm z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-md"></div>
              <p className="font-label-md text-label-md text-secondary">Esperando token...</p>
            </div>
          }

          <div className="w-full max-w-[450px] h-175 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden relative">

            <div className="bg-surface-container py-sm px-md flex items-center justify-between border-b border-outline-variant">
              <div className="flex items-center gap-sm text-secondary">
                <LockClosedIcon className="h-5 w-5" />
                <span className="font-label-sm text-label-sm">Secure Verification</span>
              </div>
            </div>


            <iframe
              ref={iframeRef}
              src={iframeSrc}
              allow="camera"
              className="w-full flex-1"
              style={{ border: 'none' }}
            />
          </div>
        </div>
      }

      {
        processStarted &&

        <div className="bg-surface-container-low p-lg border-t border-surface-container-highest">
          <h3 className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-md">Result of the verification</h3>

          {
            isTrusted === true ?
              <div className="inline-flex items-center gap-sm bg-primary-fixed text-on-primary-fixed rounded-full px-md py-xs border border-primary-fixed-dim">
                <DocumentCheckIcon className="h-5 w-5" />
                <span className="font-label-sm text-label-sm">You validate your identity</span>
              </div> : isTrusted === false ?
                <div className="inline-flex items-center gap-sm bg-error text-on-error rounded-full px-md py-xs border border-error-dim">
                  <XMarkIcon className="h-5 w-5" />
                  <span className="font-label-sm text-label-sm">You did not validate your identity, sorry!</span>
                </div> : processStarted ?
                  <div className="inline-flex items-center gap-sm bg-primary-fixed text-on-primary-fixed rounded-full px-md py-xs border border-primary-fixed-dim">
                    <ClockIcon className="h-5 w-5" />
                    <span className="font-label-sm text-label-sm">Waiting for Result</span>
                  </div> : null
          }
        </div>
      }

      {
        false && 
        <div>
          {
            events.map((event, index) => (
              <p key={index}>{event}</p>
            ))
          }

          {
            events.length === 0 && <p className="font-body-sm text-body-sm text-secondary">No se han recibido eventos aún.</p>
          }
        </div>
      }
    </section>
  );
};
