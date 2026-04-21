import React from 'react';
import type {ReactNode} from 'react';
import './styles.css';

const footerSections = [
  {
    title: 'Solutions',
    links: [
      { label: 'Agencies', href: 'https://www.codecapsules.io/solutions/agency' },
      { label: 'Enterprises', href: 'https://www.codecapsules.io/solutions/enterprise' },
      { label: 'Developers', href: 'https://www.codecapsules.io/solutions/developers' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'Backend Capsule', href: '/products/backend-capsule/' },
      { label: 'Frontend Capsule', href: '/products/frontend-capsule/deploy' },
      { label: 'Database Capsule', href: '/products/database-capsule/overview' },
      { label: 'WordPress Capsule', href: '/products/wordpress-capsule/deploy' },
      { label: 'AI Agent Capsule', href: '/products/agent-capsule/deploy' },
      { label: 'MongoDB Capsule', href: 'https://www.codecapsules.io/use-case/mongodb' },
    ],
  },
  {
    title: 'Information',
    links: [
      { label: 'Compare', href: 'https://www.codecapsules.io/compare' },
      { label: 'Blog', href: 'https://www.codecapsules.io/blog' },
      { label: 'FAQ', href: 'https://www.codecapsules.io/faq' },
      { label: 'Success Stories', href: 'https://www.codecapsules.io/success-stories' },
    ],
  },
  {
    title: 'Popular Tutorials',
    links: [
      { label: 'Deploy a Python Telegram Bot', href: '/tutorials/how-to-create-and-host-a-telegram-bot-on-code-capsules' },
      { label: 'Deploy a Node.js Telegram Bot', href: '/tutorials/create-and-host-a-telegram-bot-with-node.js-on-code-capsules' },
      { label: 'Deploy a TypeScript Telegram Bot', href: '/tutorials/create-and-host-go-ai-telegram-bot' },
    ],
  },
];

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/company/code-capsules/', icon: 'simple-icons:linkedin' },
  { label: 'Slack', href: 'https://codecapsules.slack.com', icon: 'simple-icons:slack' },
  { label: 'YouTube', href: 'https://youtube.com/@codecapsules/', icon: 'simple-icons:youtube' },
  { label: 'GitHub', href: 'https://github.com/codecapsules-io', icon: 'simple-icons:github' },
];

const bottomLinks = [
  { label: 'Documentation', href: '/' },
  { label: 'Login', href: 'https://app.codecapsules.io' },
  { label: 'Terms & Conditions', href: 'https://www.codecapsules.io/policies/terms-conditions' },
  { label: 'Licence & Distribution', href: 'https://www.codecapsules.io/policies/licence-distribution' },
  { label: 'Trademark', href: 'https://www.codecapsules.io/policies/trademark' },
  { label: 'Privacy Policy', href: 'https://www.codecapsules.io/policies/privacy-policy' },
  { label: 'Acceptable Use', href: 'https://www.codecapsules.io/policies/acceptable-use' },
  { label: 'Credit Card Terms', href: 'https://www.codecapsules.io/policies/credit-card-customer-terms' },
];

function isExternal(href: string): boolean {
  return href.startsWith('http');
}

function Footer(): ReactNode {
  return (
    <footer className="cc-footer">
      <div className="cc-footer__inner">
        {/* Main grid */}
        <div className="cc-footer__grid">
          {/* Logo + socials */}
          <div className="cc-footer__brand">
            <a href="https://www.codecapsules.io" className="cc-footer__logo-link">
              <img
                src="https://cdn.prod.website-files.com/67ceb2cb686dbb71573b4e01/67cebcb49209deccb991799d_Code%20Capsules%20-%20Logo%201.svg"
                alt="Code Capsules"
                className="cc-footer__logo"
              />
            </a>
            <p className="cc-footer__tagline">
              Cloud deployment made simple. Focus on building, we'll take care of the shipping.
            </p>
            <div className="cc-footer__socials">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cc-footer__social-link"
                  aria-label={social.label}
                >
                  <img
                    src={`https://api.iconify.design/${social.icon}.svg?color=%231a1a1a`}
                    alt=""
                    className="cc-footer__social-icon"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="cc-footer__section">
              <h3 className="cc-footer__section-title">{section.title}</h3>
              <ul className="cc-footer__section-list">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="cc-footer__link"
                      {...(isExternal(link.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="cc-footer__bottom">
          <div className="cc-footer__bottom-links">
            {bottomLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="cc-footer__bottom-link"
                {...(isExternal(link.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.label}
              </a>
            ))}
          </div>
          <p className="cc-footer__copyright">
            &copy; {new Date().getFullYear()} Code Capsules. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
