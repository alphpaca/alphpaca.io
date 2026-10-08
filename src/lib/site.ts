export const site = {
  name: 'Alphpaca',
  email: import.meta.env.PUBLIC_CONTACT_EMAIL || 'hello@alphpaca.io',
  description:
    'Alphpaca is an independent software studio and product company building thoughtful web applications, cloud platforms, and learning tools.',
};

export function url(path = '') {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export function emailLink(subject = 'Let’s build something together') {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}
