/**
 * Photo Gallery & Lightbox Module
 * Supports hover tilt/zoom, keyboard navigation, touch swipes,
 * and glowing photo expansions with love reactions.
 */

import { LOVE_CONFIG } from "./config.js";
import { playHeartPop } from "./audio-fx.js";

const loveCounts = {};

export function initGallery() {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  const lightboxTitle = document.querySelector("[data-lightbox-title]");
  const lightboxDescription = document.querySelector(
    "[data-lightbox-description]",
  );
  const closeButton = lightbox?.querySelector("[data-lightbox-close]");
  let currentIndex = 0;
  let previouslyFocusedElement = null;

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    previouslyFocusedElement?.focus();
  };

  const openLightbox = (index) => {
    const item = LOVE_CONFIG.gallery[index];
    if (!item || !lightbox || !lightboxImage) return;

    if (!lightbox.classList.contains("is-open")) {
      previouslyFocusedElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    }

    currentIndex = index;
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;

    if (lightboxTitle) {
      lightboxTitle.innerHTML = `${item.title || ""} <span style="font-size:0.75em; opacity:0.6; font-weight:normal; margin-left:8px;">(${currentIndex + 1}/${LOVE_CONFIG.gallery.length})</span>`;
      lightboxTitle.hidden = !item.title && !item.description;
    }

    if (lightboxDescription) {
      lightboxDescription.textContent = item.description || "";
      lightboxDescription.hidden = !item.description;
    }

    const loveCounter = lightbox.querySelector("[data-love-count]");
    if (loveCounter) {
      loveCounter.textContent = loveCounts[currentIndex] || 0;
    }

    lightbox.classList.add("is-open");
    closeButton?.focus();
  };

  // Attach click & hover effects to all gallery buttons
  gallery.querySelectorAll("[data-photo-index]").forEach((button) => {
    const photoIndex = Number(button.getAttribute("data-photo-index"));

    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const image = button.querySelector("img");
      if (image) {
        image.style.transform = `scale(1.14) translate(${x * 14}px, ${y * 14}px)`;
      }
    });

    button.addEventListener("pointerleave", () => {
      const image = button.querySelector("img");
      if (image) {
        image.style.transform = "";
      }
    });

    button.addEventListener("click", () => {
      openLightbox(photoIndex);
    });
  });

  if (lightbox) {
    const loveButton = lightbox.querySelector("[data-lightbox-love]");
    if (loveButton && !loveButton.dataset.bound) {
      loveButton.dataset.bound = "true";
      loveButton.addEventListener("click", (e) => {
        e.stopPropagation();
        loveCounts[currentIndex] = (loveCounts[currentIndex] || 0) + 1;
        const countSpan = lightbox.querySelector("[data-love-count]");
        if (countSpan) {
          countSpan.textContent = loveCounts[currentIndex];
        }

        playHeartPop();

        // Button bounce
        loveButton.style.transform = "scale(1.18)";
        setTimeout(() => {
          loveButton.style.transform = "";
        }, 180);

        // Spawn rising floating hearts
        const rect = loveButton.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top;

        const emojis = ["❤️", "💖", "💕", "✨", "🥰"];
        for (let i = 0; i < 3; i++) {
          const heart = document.createElement("span");
          heart.className = "lightbox-heart-fly";
          heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          heart.style.left = `${originX}px`;
          heart.style.top = `${originY}px`;
          heart.style.setProperty(
            "--dx",
            `${(Math.random() * 60 - 30).toFixed(1)}px`,
          );
          heart.style.setProperty(
            "--rot",
            `${(Math.random() * 40 - 20).toFixed(1)}deg`,
          );
          document.body.appendChild(heart);
          setTimeout(() => heart.remove(), 950);
        }
      });
    }

    lightbox.addEventListener("click", (event) => {
      if (
        event.target === lightbox ||
        event.target.closest("[data-lightbox-close]")
      ) {
        closeLightbox();
      }
    });

    // Touch swipe support on mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    lightbox.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 45) {
          if (diff < 0) {
            // Swipe left -> next photo
            openLightbox((currentIndex + 1) % LOVE_CONFIG.gallery.length);
          } else {
            // Swipe right -> prev photo
            openLightbox(
              (currentIndex - 1 + LOVE_CONFIG.gallery.length) %
                LOVE_CONFIG.gallery.length,
            );
          }
        }
      },
      { passive: true },
    );

    // Keyboard navigation
    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight")
        openLightbox((currentIndex + 1) % LOVE_CONFIG.gallery.length);
      if (event.key === "ArrowLeft")
        openLightbox(
          (currentIndex - 1 + LOVE_CONFIG.gallery.length) %
            LOVE_CONFIG.gallery.length,
        );
    });
  }
}
