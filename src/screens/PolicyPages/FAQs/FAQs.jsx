import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Shield, BarChart3, TrendingUp, Settings } from 'lucide-react';
import styles from './FAQs.module.css';

export default function FAQsModal({ isOpen, onClose }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!isOpen) return null;

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      category: 'Security & Privacy',
      icon: <Shield size={16} />,
      question: 'Is it safe to upload my CAS PDF statement on Nidhify?',
      answer: 'Yes, completely. Nidhify uses an automated script designed with a strict Zero-Storage Password Policy. When you upload your statement and enter its password, our system reads the data in real-time to generate your dashboard insights and instantly discards the password. We never save your CAS password or your raw PDF file on our servers.'
    },
    {
      category: 'Security & Privacy',
      icon: <Shield size={16} />,
      question: 'Does Nidhify share or sell my financial data?',
      answer: 'Never. Your financial information belongs entirely to you. Nidhify is a pure tracking utility tool. We do not sell, rent, or share your transaction history, portfolio value, or personal details with third-party marketing companies, insurance brokers, or loan providers.'
    },
    {
      category: 'Security & Privacy',
      icon: <Shield size={16} />,
      question: 'Can someone withdraw money from my account using Nidhify?',
      answer: 'Absolutely not. Nidhify is strictly a view-only portfolio tracking dashboard. There are no payment gateways, transactional capabilities, or links to your bank accounts that allow moving money. It is physically impossible to execute trades or withdrawals through Nidhify.'
    },
    {
      category: 'Using the Platform',
      icon: <BarChart3 size={16} />,
      question: 'What is a CAS PDF, and how do I get it?',
      answer: 'A Consolidated Account Statement (CAS) is an official PDF document that summarizes all your mutual fund transactions across different fund houses. You can generate and download your official, password-protected statement safely by visiting the official CAMS Online portal.'
    },
    {
      category: 'Using the Platform',
      icon: <BarChart3 size={16} />,
      question: 'Can I use Nidhify without uploading a CAS statement?',
      answer: 'Yes. Uploading a CAS PDF is entirely voluntary. If you prefer not to upload your file, you can skip that step and use Nidhify\'s clean manual interface to add and track your Mutual Funds, Fixed Deposits (FDs), Stocks, Digital Gold, and Insurance policies one by one.'
    },
    {
      category: 'Using the Platform',
      icon: <BarChart3 size={16} />,
      question: 'What other assets can I track on Nidhify?',
      answer: 'Beyond Mutual Funds, Nidhify allows you to manually input details to keep an eye on your Fixed Deposits (FDs), Stocks, Digital Gold, and Insurance plans, giving you a complete, unified look at your aggregate net worth.'
    },
    {
      category: 'Data & Advisory',
      icon: <TrendingUp size={16} />,
      question: 'Why does my portfolio balance look slightly different from other apps?',
      answer: 'Nidhify aggregates and processes statement data on an "as-is" basis for tracking purposes. Discrepancies can occasionally occur due to third-party data feed lags, parsing delays, or processing times for newly updated Net Asset Values (NAVs). For critical financial actions, always cross-verify your exact balances with your official fund house or banking portals.'
    },
    {
      category: 'Data & Advisory',
      icon: <TrendingUp size={16} />,
      question: 'Does Nidhify provide investment recommendations or stock tips?',
      answer: 'No. Nidhify is an automated tracking software platform and does not provide professional investment, tax, or legal advice. The platform does not hold financial advisory certifications or SEBI registrations. All analytics are automated and meant for educational and informational tracking only. We highly recommend consulting a SEBI-registered advisor before making major financial decisions.'
    },
    {
      category: 'Account Management',
      icon: <Settings size={16} />,
      question: 'How do I delete my data or account?',
      answer: (
        <div>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#4a5d5a' }}>You have complete control over your digital footprint on Nidhify. You can manage this instantly through your Account Settings:</p>
          <ul className={styles.FAQsModalNestedList}>
            <li><strong>Delink CAS:</strong> This wipes out all mutual fund tracking analytics generated from your PDF while keeping your manual entries intact.</li>
            <li><strong>Delete Account:</strong> This permanently and irreversibly erases your profile credentials, dashboard metrics, and manual tracking entries from our entire database.</li>
          </ul>
        </div>
      )
    }
  ];

  let currentCategory = '';

  return (
    <div className={styles.FAQsModalOverlay} onClick={onClose}>
      <div className={styles.FAQsModalSheet} onClick={(e) => e.stopPropagation()}>
        {/* Fixed Header */}
        <header className={styles.FAQsModalHeader}>
          <h2 className={styles.FAQsModalTitle}>FAQs</h2>
          <button type="button" className={styles.FAQsModalCloseIconBtn} onClick={onClose} aria-label="Close modal">
            <X size={22} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className={styles.FAQsModalScrollBody}>
          {faqData.map((faq, idx) => {
            const showCategory = faq.category !== currentCategory;
            if (showCategory) currentCategory = faq.category;

            return (
              <React.Fragment key={idx}>
                {showCategory && (
                  <div className={styles.FAQsModalCategoryHeader}>
                    <span className={styles.FAQsModalCategoryIcon}>{faq.icon}</span>
                    <h3 className={styles.FAQsModalCategoryTitle}>{faq.category}</h3>
                  </div>
                )}

                <div 
                  className={`${styles.FAQsModalAccordionItem} ${openIndex === idx ? styles.FAQsModalAccordionActive : ''}`}
                  onClick={() => toggleFaq(idx)}
                >
                  <div className={styles.FAQsModalAccordionTrigger}>
                    <h4 className={styles.FAQsModalQuestionText}>{faq.question}</h4>
                    {openIndex === idx ? <ChevronUp size={16} color="#8fa7a4" /> : <ChevronDown size={16} color="#8fa7a4" />}
                  </div>

                  <div className={`${styles.FAQsModalAccordionPanel} ${openIndex === idx ? styles.FAQsModalPanelExpanded : ''}`}>
                    <div className={styles.FAQsModalAnswerWrapper}>
                      {typeof faq.answer === 'string' ? (
                        <p className={styles.FAQsModalAnswerText}>{faq.answer}</p>
                      ) : (
                        faq.answer
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Sticky Bottom Action */}
        <footer className={styles.FAQsModalFooter}>
          <button type="button" className={styles.FAQsModalCloseActionBtn} onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
}