
const PAGE_ORDER = ['page-01-opening.html','page-02-letter.html','page-03-beauty.html','page-04-little-things.html','page-05-gallery.html','page-06-why-you.html','page-07-confession.html','page-08-gift.html','page-09-question.html','page-10-celebration.html','page-11-future.html','page-12-final-letter.html'];

export function getPageInfo() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const pageIndex = PAGE_ORDER.indexOf(currentPath);
  const currentNumber = pageIndex >= 0 ? pageIndex + 1 : 1;
  const total = PAGE_ORDER.length;
  const previousPath = pageIndex > 0 ? `./${PAGE_ORDER[pageIndex - 1]}` : '../index.html';
  const nextPath = pageIndex >= 0 && pageIndex < PAGE_ORDER.length - 1 ? `./${PAGE_ORDER[pageIndex + 1]}` : null;
  return { currentNumber, total, previousPath, nextPath, pageIndex };
}

export function initNavigation() {
  const info = getPageInfo();
  document.querySelectorAll('[data-page-count]').forEach((el) => {
    el.textContent = `${String(info.currentNumber).padStart(2, '0')} / ${String(info.total).padStart(2, '0')}`;
  });

  document.querySelectorAll('[data-progress-dot]').forEach((dot, index) => {
    dot.classList.toggle('is-current', index === info.currentNumber - 1);
  });

  const prevButton = document.querySelector('[data-nav="prev"]');
  const nextButton = document.querySelector('[data-nav="next"]');

  if (prevButton) {
    prevButton.href = info.previousPath;
    if (window.location.pathname.endsWith('/index.html')) prevButton.classList.add('is-hidden');
  }

  if (nextButton) {
    const isQuestionPage = info.currentNumber === 9 || window.location.pathname.includes('page-09');
    if (info.nextPath && !isQuestionPage) {
      nextButton.href = info.nextPath;
      nextButton.classList.remove('is-hidden');
    } else {
      nextButton.href = './page-10-celebration.html';
      nextButton.classList.add('is-hidden');
    }
  }

}
