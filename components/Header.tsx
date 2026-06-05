import { ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function Header() {
  return (
    <header className="bg-surface-container-lowest shadow-sm docked full-width top-0 z-50">
      <div className="flex justify-between items-center px-gutter py-md w-full max-w-container-max mx-auto">
        <div className="flex items-center gap-sm">
          <ShieldCheckIcon className="h-8 w-8 text-primary" />
          <span className="font-headline-md text-headline-md font-bold text-primary">HAMAL Challenge</span>
        </div>
      </div>
    </header>
  )
}
