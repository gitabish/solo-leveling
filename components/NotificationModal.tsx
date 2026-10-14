'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SystemWindow } from './SystemWindow';
import { sound } from '@/lib/sound';

interface NotificationModalProps {
  message: string | null;
  onClose: () => void;
}

export function NotificationModal({ message, onClose }: NotificationModalProps) {
  React.useEffect(() => {
    if (message) {
      sound.playSystemDing();
    }
  }, [message]);

  return (
    <AnimatePresence>
      {message && (
        <div className="sys-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-center"
          >
            <SystemWindow
              title="NOTIFICATION"
              withBars={true}
              className="max-w-[440px] w-full"
            >
              <div className="py-4 px-2 text-center space-y-6">
                <div
                  className="font-body text-[15px] text-[#f4faff] tracking-wider leading-[2.2]"
                >
                  {message}
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="sys-btn px-10 py-2.5 text-sm"
                  >
                    CONFIRM
                  </button>
                </div>
              </div>
            </SystemWindow>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
