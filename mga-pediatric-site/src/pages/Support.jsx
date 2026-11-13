import { useState } from 'react';
import Icon from '../components/Icon';
import EnquiryForm from '../components/EnquiryForm';
import { useSeo } from '../hooks/useSeo';
import { SITE } from '../config/site';
import { mailLink, whatsappLink } from '../utils/format';

const FAQ = [
  ['How do I log in?', 'Open the app and sign in with the email address or phone number you registered with, along with your password. If you do not have an account yet, tap Sign up and create one.'],
  ['How do I reset my password?', 'On the login screen, tap "Forgot Password" and follow the instructions to reset it via email or phone.'],
  ['How do I enroll in a course?', 'Browse our courses, select your desired program, and follow the enrollment steps on the course page.'],
  ['How do I request a refund?', 'Please contact our support team with your transaction details and reason for refund. Refunds are subject to our refund policy.'],
  ['How do I contact support?', 'You can reach us via email at support@medicalglobalacademy.com, call us, or message us on WhatsApp.'],
  ['Are the programs accredited?', 'Our programs are aligned with global standards and accredited by CPD and ACTD. Details are shown on each course page.']
];

const HELP_TOPICS = [
  { icon: 'user', title: 'Login & Account Issues', text: 'Trouble signing in, wrong credentials or problems with your profile details.' },
  { icon: 'lock', title: 'Password Reset', text: 'Forgot your password or unable to reset it? We will help you regain access.' },
  { icon: 'book', title: 'Course Enrollment', text: 'Questions about eligibility, enrolling in a program and batch start dates.' },
  { icon: 'video', title: 'Course Access Issues', text: 'Cannot see your course, modules are locked or content is not loading.' },
  { icon: 'laptop', title: 'Live Class Issues', text: 'Problems joining live classes, video buffering or audio and playback errors.' },
  { icon: 'credit-card', title: 'Payment & Refund', text: 'Payment not reflected, failed transactions, invoices and refund requests.' },
  { icon: 'award', title: 'Certificate Issues', text: 'Certificate not received, name correction or verification questions.' },
  { icon: 'tool', title: 'Technical Support', text: 'App crashes, slow performance, installation or update problems.' }
];

export default function Support() {
  useSeo({ title: 'Support', description: 'Contact MGA Pediatrics for help with courses, enrolment, payments and the learning app.', path: '/support' });

  return (
    <div className="hm">
      {/* HERO SECTION */}
      <section className="hm-hero hm-hero-small">
        <div className="container">
          <p className="hm-kicker">Support Center</p>
          <h1>How can we <em>help?</em></h1>
          <p className="hm-lead">
            Questions about a course, enrolment, payments or the app? Our support team is here to assist you every step of the way.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '80px' }}>
        
        {/* CONTACT GRID */}
        <div className="hm-contact-grid">
          {/* Contact Cards */}
          <div className="hm-contact-cards">
            <a className="hm-contact-card" href={`mailto:${SITE.email}`}>
              <span className="hm-cc-icon"><Icon name="mail" size={24} /></span>
              <div>
                <small>Email Support</small>
                <b>{SITE.email}</b>
              </div>
            </a>
            <a className="hm-contact-card" href={`tel:${SITE.phoneRaw}`}>
              <span className="hm-cc-icon"><Icon name="phone" size={24} /></span>
              <div>
                <small>Phone / WhatsApp</small>
                <b>{SITE.phone}</b>
              </div>
            </a>
            <a className="hm-contact-card" href={whatsappLink('Hello, I need help with MGA Pediatrics')} target="_blank" rel="noopener noreferrer">
              <span className="hm-cc-icon"><Icon name="chat" size={24} /></span>
              <div>
                <small>WhatsApp</small>
                <b>Chat with us</b>
              </div>
            </a>
            
            <div className="hm-contact-info">
              <p><strong>Office Address:</strong><br />Plot No. 159, Pandav Nagar, Ghaziabad, Uttar Pradesh, 201005, IN</p>
              <p><strong>Support Hours:</strong><br />Mon–Sat, 10:00 AM – 6:00 PM IST</p>
              <p><strong>Response Time:</strong><br />We usually respond within 24–48 business hours.</p>
            </div>
          </div>

          {/* Enquiry Form (replaces the old "Send us a message" form) */}
          <EnquiryForm className="hm-form-card" />
        </div>

        {/* HOW WE CAN HELP */}
        <section className="hm-block">
          <div className="hm-head hm-head-split">
            <div className="hm-head-left">
              <div>
                <p className="hm-eyebrow">Support Topics</p>
                <h2>How we can help</h2>
              </div>
            </div>
          </div>

          <div className="hm-help-grid">
            {HELP_TOPICS.map((topic, i) => (
              <div key={i} className="hm-help-card">
                <span className="hm-help-icon"><Icon name={topic.icon} size={22} /></span>
                <h3>{topic.title}</h3>
                <p>{topic.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="hm-block hm-block-tint">
          <div className="container">
            <div className="hm-head hm-head-split">
              <div className="hm-head-left">
                <div>
                  <p className="hm-eyebrow">FAQs</p>
                  <h2>Frequently asked questions</h2>
                </div>
              </div>
            </div>
            
            <div className="hm-faq-list">
              {FAQ.map(([q, a], i) => (
                <details key={i} className="hm-faq-item">
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* DELETE ACCOUNT REQUEST */}
        <section className="hm-delete-section">
          <div className="hm-delete-content">
            <h2>Delete Account Request</h2>
            <p>You can request deletion of your Medical Global Academy account at any time by contacting our support team.</p>
            
            <h4>How to request deletion:</h4>
            <ul>
              <li>Email us at <strong>{SITE.email}</strong> with the subject "Account Deletion Request", or message us on WhatsApp.</li>
              <li>Include your registered name, email address and phone number so we can verify your account.</li>
              <li>We will confirm your request and complete the deletion within 30 days of verification.</li>
            </ul>

            <div className="hm-delete-actions">
             
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}