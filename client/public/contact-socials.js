const contactSocialStyle = document.createElement('style');
contactSocialStyle.textContent = `
.kaja-contact-socials {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.kaja-contact-social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  height: 54px;
  min-width: 0;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 18px;
  background: rgba(0,0,0,0.42);
  color: rgba(255,255,255,0.88);
  text-decoration: none;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-family: inherit;
  transition: background 0.35s ease, border-color 0.35s ease, transform 0.35s ease;
}

.kaja-contact-social-button:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.kaja-contact-social-button img {
  width: 22px !important;
  height: 22px !important;
  min-width: 22px !important;
  min-height: 22px !important;
  max-width: 22px !important;
  max-height: 22px !important;
  object-fit: contain !important;
  display: block !important;
}

@media (max-width: 900px) {
  .kaja-contact-socials {
    gap: 8px;
    margin-top: 10px;
  }

  .kaja-contact-social-button {
    height: 42px;
    border-radius: 12px;
    gap: 5px;
    font-size: 0;
    letter-spacing: 0;
  }

  .kaja-contact-social-button img {
    width: 20px !important;
    height: 20px !important;
    min-width: 20px !important;
    min-height: 20px !important;
    max-width: 20px !important;
    max-height: 20px !important;
  }
}
`;
document.head.appendChild(contactSocialStyle);

const contactSocials = [
  {
    label: 'Instagram',
    href: '#instagram',
    icon: '/contact-icons/instagram.png'
  },
  {
    label: 'WhatsApp',
    href: '#whatsapp',
    icon: '/contact-icons/whatsapp.png'
  },
  {
    label: 'Telegram',
    href: '#telegram',
    icon: '/contact-icons/telegram.png'
  },
  {
    label: 'E-mail',
    href: 'mailto:contact@kaja.example',
    icon: '/contact-icons/email.png'
  }
];

function addContactSocialButtons() {
  const form = document.querySelector('.kaja-contact-form');
  if (!form || form.querySelector('.kaja-contact-socials')) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const row = document.createElement('div');
  row.className = 'kaja-contact-socials';
  row.setAttribute('aria-label', 'Contact channels');

  contactSocials.forEach((social) => {
    const link = document.createElement('a');
    link.className = 'kaja-contact-social-button';
    link.href = social.href;
    link.setAttribute('aria-label', social.label);

    const image = document.createElement('img');
    image.src = social.icon;
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.textContent = social.label;

    link.appendChild(image);
    link.appendChild(text);
    row.appendChild(link);
  });

  if (submitButton) {
    form.insertBefore(row, submitButton);
  } else {
    form.appendChild(row);
  }
}

const contactSocialObserver = new MutationObserver(addContactSocialButtons);
contactSocialObserver.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('load', addContactSocialButtons);
requestAnimationFrame(addContactSocialButtons);
setTimeout(addContactSocialButtons, 500);
