import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { selectUserName } from '../../store/auth/auth.selectors';
import styles from './Assistant.module.css';
import { useNavigate } from 'react-router-dom';
import AiImage from "../../assets/images/ai-icon.png"
import { sendChatMessage } from "../../services/apis/ai.service";

const getGreeting = () => {
  const hour = new Date().toLocaleString("en-IN", {
    hour: "numeric",
    hour12: false,
    timeZone: "Asia/Kolkata"
  });
  const h = Number(hour);
  if (h >= 5 && h < 12) return "Good Morning";
  if (h >= 12 && h < 17) return "Good Afternoon";
  return "Good Evening";
};

const DESCRIPTION =
  "Welcome to Nidhify AI. Ask questions about Mutual Funds, FDs, Insurance, and personal finance through simple explanations and comparisons.";

const SUGGESTED_PROMPTS = [
  { id: 1, text: 'What is a mutual fund?' },
  { id: 2, text: 'How do Fixed Deposits work?' },
  { id: 3, text: 'What insurance should I get?' },
  { id: 4, text: 'Explain SIP vs Lump Sum' },
];

export default function Assistant() {
  const navigate = useNavigate();
  const userName = useSelector(selectUserName);
  const firstName = userName ? userName.split(' ')[0] : 'there';
  const greeting = useMemo(() => getGreeting(), []);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSend = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const res = await sendChatMessage(trimmed);

    if (res && res.success && res.data?.response) {
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } else if (res && res.message) {
      setMessages(prev => [...prev, { role: 'assistant', content: res.message, isError: true }]);
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please check your connection and try again.', isError: true }]);
    }

    setIsLoading(false);
  };

  const handlePromptClick = (text) => {
    handleSend(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      handleSend(inputValue);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className={styles['Assistant-container']}>
      <div className={styles['Assistant-glow-pink']}></div>
      <div className={styles['Assistant-glow-blue']}></div>

      <header className={styles['Assistant-header']}>
        <button
          onClick={() => navigate("/dashboard")}
          className={styles['Assistant-icon-btn']}
          aria-label="Go to Dashboard"
        >
          <ArrowLeft size={22} />
        </button>

        <div className={styles['Assistant-brand-info']}>
          <Sparkles size={16} className={styles['Assistant-sparkle-icon']} />
          <span className={styles['Assistant-brand-name']}>Nidhify AI</span>
        </div>

        <div className={styles['Assistant-header-spacer']}></div>
      </header>

      <main className={`${styles['Assistant-main']} ${hasMessages ? styles['Assistant-main--chat'] : ''}`}>
        {!hasMessages ? (
          <>
            <div className={styles['Assistant-hero-wrapper']}>
              <img
                src={AiImage}
                alt="AI Assistant Logo"
                className={styles['Assistant-hero-image']}
              />
            </div>

            <h1 className={styles['Assistant-greeting']}>
              {greeting}, {firstName}
            </h1>

            <p className={styles['Assistant-description']}>
              {DESCRIPTION}
            </p>

            <div className={styles['Assistant-suggestions-list']}>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  className={styles['Assistant-suggestion-card']}
                  onClick={() => handlePromptClick(prompt.text)}
                >
                  <span className={styles['Assistant-card-text']}>{prompt.text}</span>
                  <span className={styles['Assistant-card-arrow']}>→</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className={styles['Assistant-messages-list']}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles['Assistant-message-row']} ${
                  msg.role === 'user'
                    ? styles['Assistant-message-row--user']
                    : styles['Assistant-message-row--ai']
                }`}
              >
                <div
                  className={`${styles['Assistant-message-bubble']} ${
                    msg.role === 'user'
                      ? styles['Assistant-message-bubble--user']
                      : msg.isError
                        ? styles['Assistant-message-bubble--error']
                        : styles['Assistant-message-bubble--ai']
                  }`}
                >
                  <div className={styles['Assistant-message-text']}>
                    {msg.role === 'user' ? (
                      <p>{msg.content}</p>
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles['Assistant-message-row']} ${styles['Assistant-message-row--ai']}`}>
                <div className={`${styles['Assistant-message-bubble']} ${styles['Assistant-message-bubble--ai']}`}>
                  <div className={styles['Assistant-typing-indicator']}>
                    <Sparkles size={18} className={styles['Assistant-sparkle-loading']} />
                    <span>Thinking</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className={styles['Assistant-footer']}>
        <form onSubmit={handleSubmit} className={styles['Assistant-search-form']}>
          <input
            name="assistantSearchInput"
            type="text"
            placeholder="Ask anything..."
            className={styles['Assistant-input']}
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={styles['Assistant-send-btn']}
            aria-label="Send message"
            disabled={isLoading || !inputValue.trim()}
          >
            <ArrowRight size={18} />
          </button>
        </form>
        <p className={styles['Assistant-disclaimer']}>For educational purposes only. AI responses may be inaccurate or outdated and do not constitute investment, insurance, legal, or tax advice.</p>
      </footer>
    </div>
  );
}
