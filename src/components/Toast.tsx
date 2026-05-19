'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

interface Props {
  message: string
  type?: 'success' | 'error' | 'info'
  onDismiss: () => void
}

export function Toast({ message, type = 'success', onDismiss }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300) }, 2500)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className={clsx(
      'fixed top-5 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-full text-white text-[14px] font-semibold whitespace-nowrap',
      'shadow-lg transition-all duration-300',
      visible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0',
      type === 'success' && 'bg-orange-900',
      type === 'error'   && 'bg-red-600',
      type === 'info'    && 'bg-slate-700',
    )}>
      {message}
    </div>
  )
}
