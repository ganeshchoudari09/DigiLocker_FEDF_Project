import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { useAuth } from '../../context/AuthContext';
import './AIAssistant.css';

const SUGGESTIONS = [
  'How many documents do I have?',
  'Show verified documents',
  'Find pending documents',
  'List shared documents',
];

const generateAIResponse = (query, user, stats, documents, sharedLinks) => {
  const q = query.toLowerCase();

  // Document count queries
  if (q.includes('how many') && q.includes('document')) {
    return `You have ${stats.total} documents in your vault. ${stats.verified} are verified, ${stats.pending} are pending verification, and ${stats.shared} are currently shared.`;
  }

  // Verified documents
  if (q.includes('verified')) {
    const verified = documents.filter((d) => d.status === 'verified');
    if (verified.length === 0) return 'You don\'t have any verified documents yet.';
    return `You have ${verified.length} verified documents: ${verified.map((d) => d.name).join(', ')}`;
  }

  // Pending documents
  if (q.includes('pending')) {
    const pending = documents.filter((d) => d.status === 'pending');
    if (pending.length === 0) return 'You don\'t have any pending documents.';
    return `You have ${pending.length} pending documents waiting for verification: ${pending.map((d) => d.name).join(', ')}`;
  }

  // Shared documents
  if (q.includes('shared')) {
    if (sharedLinks.length === 0) return 'You haven\'t shared any documents yet.';
    return `You have ${sharedLinks.length} active share links. You can manage them in the Shared Documents section.`;
  }

  // Storage info
  if (q.includes('storage')) {
    const maxDocs = 50;
    const percent = Math.round((stats.total / maxDocs) * 100);
    return `You're using ${stats.total} out of ${maxDocs} document slots (${percent}% full). You can upload ${maxDocs - stats.total} more documents.`;
  }

  // Document categories
  if (q.includes('category') || q.includes('type')) {
    const categories = [...new Set(documents.map((d) => d.category))];
    if (categories.length === 0) return 'You don\'t have any documents yet.';
    return `Your documents are in these categories: ${categories.join(', ')}`;
  }

  // Recently added
  if (q.includes('recent') || q.includes('latest')) {
    if (documents.length === 0) return 'You don\'t have any documents yet.';
    const recent = documents.slice(0, 3);
    return `Your 3 most recent documents are: ${recent.map((d) => d.name).join(', ')}`;
  }

  // Features
  if (q.includes('what can') || q.includes('feature') || q.includes('help')) {
    return 'I can help you:\n• Count and analyze your documents\n• Find verified, pending, or shared documents\n• Check your storage usage\n• View document categories\n• Browse recent uploads\n• Get security tips\nJust ask me anything about your documents!';
  }

  // Security questions
  if (q.includes('secure') || q.includes('safety') || q.includes('encrypt')) {
    return 'Your documents are protected with 256-bit encryption. All data is stored locally in your browser and never shared externally. You can also enable 2FA in Security settings for extra protection.';
  }

  // Account info
  if (q.includes('account') || q.includes('profile')) {
    return `Your account: ${user?.name} (${user?.email}). Your profile is ${user?.verified ? 'verified' : 'not verified'}. ${user?.aadhaarLinked ? 'Aadhaar is linked.' : 'Link your Aadhaar for enhanced features.'}`;
  }

  // Upload/download info
  if (q.includes('upload') || q.includes('download')) {
    return 'You can upload documents from your computer. Each file is scanned and verified. Verified documents can be downloaded anytime in PDF format.';
  }

  // Sharing info
  if (q.includes('share')) {
    return 'You can create secure share links for your documents. Recipients get a time-limited access link. You can revoke access anytime from the Shared Documents section.';
  }

  // Default response
  return 'I can help you find and manage your documents. Ask me about your documents, storage, verification status, shared links, security, or account information.';
};

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I\'m Digi AI. I can help you find documents, check verification status, manage shares, and answer questions about your vault. What would you like to know?' },
  ]);
  const [input, setInput] = useState('');
  const { filteredDocuments, stats, sharedLinks } = useDocuments();
  const { user } = useAuth();

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');

    setTimeout(() => {
      const response = generateAIResponse(text, user, stats, filteredDocuments, sharedLinks);
      setMessages((prev) => [...prev, { role: 'ai', text: response }]);
    }, 600);
  };

  return (
    <>
      <motion.button
        className="ai-fab"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles size={22} />
        <span>Ask Digi AI</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="ai-header">
              <div className="ai-avatar">
                <Bot size={24} />
              </div>
              <div>
                <strong>Digi AI Assistant</strong>
                <p>Based on your vault data</p>
              </div>
              <button className="ai-close" onClick={() => setOpen(false)}><X size={20} /></button>
            </div>

            <div className="ai-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => sendMessage(s)}>{s}</button>
              ))}
            </div>

            <div className="ai-messages">
              {messages.map((m, i) => (
                <div key={i} className={`ai-msg ${m.role}`}>
                  {m.role === 'ai' && <div className="msg-avatar"><Bot size={14} /></div>}
                  <div className="msg-bubble">{m.text}</div>
                </div>
              ))}
            </div>

            <div className="ai-input-row">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask about your documents..."
              />
              <button className="ai-send" onClick={() => sendMessage(input)}>
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
