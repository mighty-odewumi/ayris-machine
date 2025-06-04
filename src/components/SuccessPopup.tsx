"use client"

import { useEffect } from 'react'

interface SuccessPopupProps {
  message: string
  onClose: () => void
  autoCloseTime?: number
}

export default function SuccessPopup({ message, onClose, autoCloseTime = 3000 }: SuccessPopupProps) {
  useEffect(() => {
    // Auto-close the popup after specified time
    const timer = setTimeout(() => {
      onClose()
    }, autoCloseTime)

    return () => clearTimeout(timer)
  }, [onClose, autoCloseTime])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="bg-gradient-to-b from-gray-900 to-black border border-red-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="text-green-500 text-3xl mb-2">✓</div>
          <h3 className="text-white text-xl mb-4 font-medieval">Success</h3>
          <p className="text-gray-300 mb-6">{message}</p>
          <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-red-600 h-full animate-shrink" 
              style={{ animation: `shrink ${autoCloseTime/1000}s linear forwards` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}