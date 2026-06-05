"use client"

import { useEffect, useState } from "react";

import { LockClosedIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

import { generateWebToken } from "../actions/truora";

export default function TruoraIFrame({ accountId, flowId }: { accountId: string; flowId: string }) {
  const [iframeSrc, setIframeSrc] = useState('');
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    generateWebToken(accountId, flowId).then(token => {
      setIframeSrc(`https://identity.truorastaging.com/?token=${token}`);
      setTokenLoaded(true);
    });

    const handleMessage = (event: MessageEvent) => {
      // Validar origen del mensaje
      if (event.data === 'truora.process.succeeded') {
        console.log('Proceso exitoso');
        setEvents(prev => [...prev, 'Process Succeeded + Result: ' + JSON.stringify(event.data.result)]);
      } else if (event.data === 'truora.process.failed') {
        console.log('Proceso fallido');
        setEvents(prev => [...prev, 'Process Failed + Result: ' + JSON.stringify(event.data.result)]);
      } else if (event.data === 'truora.steps.completed') {
        console.log('Pasos completados, resultado pendiente');
        setEvents(prev => [...prev, 'Steps Completed + Result: ' + JSON.stringify(event.data.result)]);
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
            src={iframeSrc}
            allow="camera"
            className="w-full flex-1"
            style={{ border: 'none' }}
          />
        </div>
      </div>

      { false &&
        <div className="bg-surface-container-low p-lg border-t border-surface-container-highest">
          <h3 className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-md">Resultado de la verificación</h3>

          <div className="inline-flex items-center gap-sm bg-primary-fixed text-on-primary-fixed rounded-full px-md py-xs border border-primary-fixed-dim">
            <DocumentCheckIcon className="h-5 w-5" />
            <span className="font-label-sm text-label-sm">Steps Completed</span>
          </div>
        </div>
      }

      <div>
        {
          events.map((event, index) => (
            <p key={index}>{event}</p>
          ))
        }
      </div>
    </section>
  );
};
