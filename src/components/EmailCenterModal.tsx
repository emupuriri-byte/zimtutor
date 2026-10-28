import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, X, CheckCheck, Trash2, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { TransactionalEmail } from '../types';

interface EmailCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailCenterModal: React.FC<EmailCenterModalProps> = ({ isOpen, onClose }) => {
  const { emails, markEmailAsRead, markAllEmailsAsRead, clearEmails } = useApp();
  const [selectedEmail, setSelectedEmail] = useState<TransactionalEmail | null>(
    emails.length > 0 ? emails[0] : null
  );

  if (!isOpen) return null;

  const currentSelected =
    selectedEmail && emails.some((e) => e.id === selectedEmail.id)
      ? emails.find((e) => e.id === selectedEmail.id)!
      : emails[0] || null;

  const handleSelectEmail = (email: TransactionalEmail) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      markEmailAsRead(email.id);
    }
  };

  const getEmailBadge = (type: TransactionalEmail['type']) => {
    switch (type) {
      case 'lesson_request':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-black bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-300">
            <Clock className="w-3 h-3" /> Lesson Request
          </span>
        );
      case 'lesson_confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-black px-2 py-0.5 rounded-full border border-black">
            <CheckCircle className="w-3 h-3 text-white" /> Confirmed
          </span>
        );
      case 'reschedule_proposed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-900 bg-zinc-200 px-2 py-0.5 rounded-full border border-zinc-300">
            <Calendar className="w-3 h-3" /> Time Proposed
          </span>
        );
      case 'request_declined':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-300 line-through">
            <AlertCircle className="w-3 h-3" /> Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-full">
            Notification
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-zinc-300">
        {/* Header (Black and White) */}
        <div className="px-6 py-4 bg-black text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 text-white flex items-center justify-center border border-zinc-700">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Transactional Email Dispatch Center</h2>
                <span className="text-xs bg-white text-black font-extrabold px-2 py-0.5 rounded-full">
                  {emails.length} Delivered
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Server-side email notifications for lesson requests, confirmations & updates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {emails.length > 0 && (
              <>
                <button
                  onClick={markAllEmailsAsRead}
                  className="px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg flex items-center gap-1 transition"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
                <button
                  onClick={clearEmails}
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                  title="Clear email log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition ml-2"
              aria-label="Close Email Center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {emails.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
            <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900">No emails dispatched yet</h3>
            <p className="text-sm text-zinc-500 max-w-sm mt-1">
              When a student requests a lesson or a teacher responds, transactional email records appear here instantly!
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* List Sidebar */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-200 overflow-y-auto bg-zinc-50 shrink-0">
              <div className="p-3 border-b border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-500">
                Recent Email Activity
              </div>
              <div className="divide-y divide-zinc-200">
                {emails.map((email) => {
                  const isSelected = currentSelected?.id === email.id;
                  return (
                    <button
                      key={email.id}
                      onClick={() => handleSelectEmail(email)}
                      className={`w-full text-left p-3.5 transition flex flex-col gap-1.5 relative ${
                        isSelected
                          ? 'bg-zinc-200/70 border-l-4 border-l-black'
                          : 'hover:bg-zinc-100'
                      }`}
                    >
                      {!email.isRead && (
                        <span className="absolute top-3.5 right-3 w-2 h-2 rounded-full bg-black"></span>
                      )}
                      <div className="flex items-center justify-between gap-2 pr-3">
                        <span className="text-xs font-bold text-black truncate">
                          {email.toName}
                        </span>
                        <span className="text-[10px] text-zinc-400 shrink-0">
                          {new Date(email.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-zinc-700 truncate">
                        {email.subject}
                      </div>
                      <div>{getEmailBadge(email.type)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email Detail View */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white flex flex-col">
              {currentSelected ? (
                <div>
                  {/* Meta Bar */}
                  <div className="border-b border-zinc-200 pb-4 mb-4">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-bold text-black leading-snug">
                        {currentSelected.subject}
                      </h3>
                      {getEmailBadge(currentSelected.type)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                      <div>
                        <span className="text-zinc-400 font-medium">To: </span>
                        <strong className="text-black">{currentSelected.toName}</strong> (
                        {currentSelected.toEmail})
                      </div>
                      <div>
                        <span className="text-zinc-400 font-medium">Sent: </span>
                        <span className="text-zinc-800">
                          {new Date(currentSelected.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-medium">From: </span>
                        <span className="text-zinc-800">no-reply@zimtutor.co.zw (Zim Tutor Service)</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-medium">Status: </span>
                        <span className="text-black font-bold inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 inline text-black" /> Sent & Delivered
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rendered HTML Container */}
                  <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-xs mb-4">
                    <div
                      dangerouslySetInnerHTML={{ __html: currentSelected.bodyHtml }}
                    />
                  </div>

                  {/* Raw text fallback viewer */}
                  <details className="mt-4 text-xs text-zinc-500">
                    <summary className="cursor-pointer font-bold text-zinc-700 hover:text-black transition select-none">
                      View Raw Plaintext Content
                    </summary>
                    <pre className="mt-2 p-3 bg-zinc-950 text-zinc-100 rounded-lg overflow-x-auto font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                      {currentSelected.bodyText}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="text-zinc-400 text-sm">Select an email to view details</div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
          <span>Protected: Private addresses and phone numbers are never exposed in email notifications.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
