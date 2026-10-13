'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SystemWindow } from './SystemWindow';
import { SystemButton } from './SystemButton';

interface NotificationModalProps {
  message: string | null;
  onClose: () => void;
}

export function NotificationModal({ message, onClose }: NotificationModalProps) {
  return (
    <AnimatePresence>
      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-sm"
          >
            <SystemWindow title="NOTIFICATION" variant="blue">
              <div className="my-4 text-center font-cyber text-sm text-[#E8F4FF] leading-relaxed">
                {message}
              </div>

              <div className="mt-5 flex justify-center">
                <SystemButton size="md" variant="primary" onClick={onClose} className="w-32">
                  CONFIRM
                </SystemButton>
              </div>
            </SystemWindow>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
