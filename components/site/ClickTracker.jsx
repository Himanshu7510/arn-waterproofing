'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function track(event, params = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  if (typeof window.gtag === 'function') window.gtag('event', event, params);
}

export default function ClickTracker() {
  const pathname = usePathname();
  // SPA page views for Meta Pixel (GA4 enhanced measurement tracks history changes itself)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (typeof window.fbq === 'function') window.fbq('track', 'PageView');
  }, [pathname]);

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.startsWith('tel:')) {
        track('click_call', { link_url: href });
        if (typeof window.fbq === 'function') window.fbq('track', 'Contact', { method: 'phone' });
      } else if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        track('click_whatsapp', { link_url: href });
        if (typeof window.fbq === 'function') window.fbq('track', 'Contact', { method: 'whatsapp' });
      } else if (href.startsWith('mailto:')) {
        track('click_email', { link_url: href });
      }
    };
    const isField = (el) => el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
    const onFocusIn = (e) => { if (isField(e.target)) document.body.classList.add('is-typing'); };
    const onFocusOut = () => setTimeout(() => { if (!isField(document.activeElement)) document.body.classList.remove('is-typing'); }, 50);
    document.addEventListener('click', onClick);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);
  return null;
}
