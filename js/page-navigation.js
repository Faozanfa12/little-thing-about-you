import { playPageFlipChime } from './audio-fx.js';

const PAGE_ORDER = [
  'page-01-opening.html',
  'page-02-letter.html',
  'page-03-beauty.html',
  'page-04-little-things.html',
  'page-05-gallery.html',
  'page-06-why-you.html',
  'page-07-confession.html',
  'page-08-gift.html',
  'page-09-question.html',
  'page-10-celebration.html',
  'page-11-future.html',
  'page-12-final-letter.html'
];

function isStoryPage(url) {
  return url.origin === window.location.origin
    && url.pathname.split('/').some((part) => part === 'pages')
    && PAGE_ORDER.includes(url.pathname.split('/').pop());
}

export function initPageNavigation(onPageChange) {
  let navigationInProgress = false;
  let renderedPath = window.location.pathname;

  const navigate = async (url, { addHistoryEntry = true } = {}) => {
    if (!isStoryPage(url)) {
      window.location.assign(url.href);
      return;
    }
    if (navigationInProgress || (url.pathname === renderedPath && url.href === window.location.href)) return;

    navigationInProgress = true;
    try {
      // Gentle romantic fade-out transition
      const currentShell = document.querySelector('.story-shell');
      if (currentShell) {
        currentShell.style.transition = 'opacity 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms cubic-bezier(0.16, 1, 0.3, 1)';
        currentShell.style.opacity = '0';
        currentShell.style.transform = 'translateY(12px) scale(0.99)';
        await new Promise((resolve) => setTimeout(resolve, 180));
      }

      const response = await fetch(url.href, {
        headers: { Accept: 'text/html' }
      });
      if (!response.ok) {
        throw new Error(`Page request failed with status ${response.status}`);
      }

      const html = await response.text();
      const nextDocument = new DOMParser().parseFromString(html, 'text/html');
      const currentAudio = document.querySelector('audio[data-background-music]');
      const currentAtmosphere = document.querySelector('[data-romantic-atmosphere]');

      const nextPageNodes = Array.from(nextDocument.body.childNodes)
        .filter((node) => !node.matches?.('audio[data-background-music]') && !node.matches?.('[data-romantic-atmosphere]'));

      document.title = nextDocument.title;
      for (const attribute of Array.from(document.body.attributes)) {
        document.body.removeAttribute(attribute.name);
      }
      for (const attribute of Array.from(nextDocument.body.attributes)) {
        document.body.setAttribute(attribute.name, attribute.value);
      }
      for (const child of Array.from(document.body.childNodes)) {
        if (child !== currentAudio && child !== currentAtmosphere) {
          child.remove();
        }
      }
      document.body.append(...nextPageNodes);

      if (addHistoryEntry) {
        window.history.pushState({}, '', url.href);
      }
      renderedPath = url.pathname;
      window.scrollTo({ top: 0, behavior: 'instant' });
      playPageFlipChime();
      onPageChange();
    } catch (error) {
      console.error('Could not navigate to the next story page without reloading:', error);
      window.location.assign(url.href);
    } finally {
      navigationInProgress = false;
    }
  };

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const progressDot = event.target.closest('[data-go-page]');
    if (progressDot) {
      const pageNumber = Number(progressDot.getAttribute('data-go-page'));
      const pageName = PAGE_ORDER[pageNumber - 1];
      if (pageName) {
        event.preventDefault();
        navigate(new URL(`./${pageName}`, window.location.href));
      }
      return;
    }

    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      || link.target || link.hasAttribute('download')) {
      return;
    }

    const url = new URL(link.href, window.location.href);
    if (!isStoryPage(url)) return;
    event.preventDefault();
    navigate(url);
  });

  document.addEventListener('site:navigate', (event) => {
    const destination = event.detail?.url;
    if (typeof destination !== 'string') return;
    navigate(new URL(destination, window.location.href));
  });

  document.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLElement
      && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;

    const pageIndex = PAGE_ORDER.indexOf(window.location.pathname.split('/').pop() || '');
    if (event.key === 'ArrowRight' && pageIndex >= 0 && pageIndex < PAGE_ORDER.length - 1) {
      if (pageIndex !== 8) { // Don't arrow-skip question page
        navigate(new URL(`./${PAGE_ORDER[pageIndex + 1]}`, window.location.href));
      }
    }
    if (event.key === 'ArrowLeft' && pageIndex > 0) {
      navigate(new URL(`./${PAGE_ORDER[pageIndex - 1]}`, window.location.href));
    }
  });

  // Mobile Touch Swipe Gesture for Page Turning
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.lightbox') || e.target.closest('.gallery-marquee')) return;
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (e.target.closest('.lightbox') || e.target.closest('.gallery-marquee')) return;
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;

    // Horizontal swipe threshold: at least 55px and more horizontal than vertical
    if (Math.abs(diffX) > 55 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      const pageIndex = PAGE_ORDER.indexOf(window.location.pathname.split('/').pop() || '');
      if (diffX < 0 && pageIndex >= 0 && pageIndex < PAGE_ORDER.length - 1) {
        // Swipe left -> Next page (skip if on proposal page)
        if (pageIndex !== 8) {
          navigate(new URL(`./${PAGE_ORDER[pageIndex + 1]}`, window.location.href));
        }
      } else if (diffX > 0 && pageIndex > 0) {
        // Swipe right -> Prev page
        navigate(new URL(`./${PAGE_ORDER[pageIndex - 1]}`, window.location.href));
      }
    }
  }, { passive: true });

  window.addEventListener('popstate', () => {
    navigate(new URL(window.location.href), { addHistoryEntry: false });
  });
}
