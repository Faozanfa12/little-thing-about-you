/**
 * Interactive Features & Micro-Interactions Module
 * Controls card accordion toggles, reveal triggers, and 3D card parallax.
 */

import { playWaxSealStamp, playShootingStarChime } from "./audio-fx.js";
import { LOVE_CONFIG } from "./config.js";

export function initInteractions() {
  // Intersection Observer for scroll / load reveals
  const revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    revealTargets.forEach((node) => observer.observe(node));
  } else {
    revealTargets.forEach((node) => node.classList.add("is-visible"));
  }

  // Accordion Interactive Cards
  document.querySelectorAll(".interactive-card").forEach((card) => {
    const trigger = card.querySelector(".card-trigger");
    const description = card.querySelector(".card-description");
    if (!trigger || !description) return;

    const syncDescriptionState = (isOpen) => {
      description.style.maxHeight = isOpen
        ? `${description.scrollHeight + 16}px`
        : "0px";
      description.style.opacity = isOpen ? "1" : "0";
      description.style.marginTop = isOpen ? "1rem" : "0";
      description.style.overflow = "hidden";
    };

    syncDescriptionState(card.classList.contains("is-open"));

    const toggleCard = (event) => {
      event?.stopPropagation();
      const isOpen = card.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
      syncDescriptionState(isOpen);
    };

    trigger.addEventListener("click", toggleCard);
    card.addEventListener("click", (e) => {
      if (e.target !== trigger && !trigger.contains(e.target)) {
        toggleCard(e);
      }
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCard(event);
      }
    });
  });

  // 3D Parallax Tilt Effect for Desktop
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (!prefersReducedMotion && window.innerWidth > 900) {
    const storyCard = document.querySelector(".story-card");
    if (storyCard) {
      let ticking = false;

      const handleMove = (e) => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
          const rect = storyCard.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -2.5;
          const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 2.5;

          storyCard.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
          ticking = false;
        });
      };

      const handleLeave = () => {
        storyCard.style.transform =
          "perspective(1200px) rotateX(0deg) rotateY(0deg)";
      };

      window.addEventListener("pointermove", handleMove, { passive: true });
      window.addEventListener("mouseleave", handleLeave);
    }
  }

  // Interactive Wax Seal Love Stamp (Page 12)
  const waxSeal = document.querySelector(".wax-seal");
  if (waxSeal && !waxSeal.dataset.bound) {
    waxSeal.dataset.bound = "true";
    waxSeal.setAttribute("role", "button");
    waxSeal.setAttribute("tabindex", "0");
    waxSeal.setAttribute(
      "aria-label",
      "Cap cinta dari Otan - Klik untuk segel resmi",
    );
    waxSeal.title = "Cap Cinta dari Otan ♥ (Klik aku!)";

    const triggerWaxStamp = (e) => {
      e.stopPropagation();
      playWaxSealStamp();

      // Stamp compress & bounce animation
      waxSeal.style.transform = "scale(0.82) rotate(-18deg)";
      setTimeout(() => {
        waxSeal.style.transform = "scale(1.28) rotate(12deg)";
        setTimeout(() => {
          waxSeal.style.transform = "";
        }, 240);
      }, 100);

      // Sparkle explosion around stamp
      const rect = waxSeal.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      const icons = ["❤️", "✨", "💖", "⭐", "💌", "🌸"];
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("span");
        particle.className = "stamp-sparkle-particle";
        const angle = (Math.PI * 2 * i) / 20 + (Math.random() * 0.3 - 0.15);
        const dist = 35 + Math.random() * 70;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - 10;
        particle.textContent = icons[Math.floor(Math.random() * icons.length)];
        particle.style.left = `${originX}px`;
        particle.style.top = `${originY}px`;
        particle.style.setProperty("--tx", `${tx.toFixed(1)}px`);
        particle.style.setProperty("--ty", `${ty.toFixed(1)}px`);
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1050);
      }

      // Temporary floating love badge
      let badge = document.querySelector(".wax-seal-badge");
      if (!badge) {
        badge = document.createElement("div");
        badge.className = "wax-seal-badge";
        badge.textContent = "Officially Sealed with All My Love ✨ - Otan";
        waxSeal.parentElement?.appendChild(badge);
        setTimeout(() => {
          badge.classList.add("is-fadeout");
          setTimeout(() => badge.remove(), 400);
        }, 2600);
      }
    };

    waxSeal.addEventListener("click", triggerWaxStamp);
    waxSeal.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerWaxStamp(e);
      }
    });
  }

  // Make a Wish Shooting Star Feature (Page 07)
  const wishBtn = document.querySelector("[data-wish-star]");
  const wishResult = document.querySelector("[data-wish-result]");
  if (wishBtn && !wishBtn.dataset.bound) {
    wishBtn.dataset.bound = "true";
    wishBtn.addEventListener("click", () => {
      playShootingStarChime();
      wishBtn.style.transform = "scale(0.92)";
      setTimeout(() => {
        wishBtn.style.transform = "";
      }, 150);

      // Spawn shooting star streak
      const star = document.createElement("div");
      star.className = "shooting-star-streak";
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 1200);

      // Spawn stardust sparkles along path
      for (let i = 0; i < 18; i++) {
        setTimeout(() => {
          const spark = document.createElement("span");
          spark.className = "star-trail-sparkle";
          spark.textContent = ["✨", "⭐", "💫"][Math.floor(Math.random() * 3)];
          spark.style.left = `${12 + i * 4.6 + Math.random() * 4}vw`;
          spark.style.top = `${8 + i * 4.4 + Math.random() * 4}vh`;
          document.body.appendChild(spark);
          setTimeout(() => spark.remove(), 800);
        }, i * 35);
      }

      // Smoothly reveal wish result card
      if (wishResult) {
        wishResult.hidden = false;
        wishResult.classList.add("is-revealed");
      }

      wishBtn.innerHTML = "<span>✨</span> Harapan Terkirim ke Bintang";
      wishBtn.disabled = true;
      wishBtn.classList.add("is-granted");
    });
  }

  // Direct WhatsApp Response Bridge (Page 10 & Page 12)
  document.querySelectorAll("[data-whatsapp-btn]").forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";

    btn.addEventListener("click", () => {
      const isCelebration = document.body.dataset.page === "celebration";
      const message = isCelebration
        ? `Hai Otan! Aku udah baca seluruh websitenya... And my answer is YES! 💖✨ Makasih yaa buat website yang super manis ini, aku terharu banget 🥰`
        : `Hai Otan, aku udah baca websitenya sampai surat terakhir... Makasih banyak ya untuk semua kata-kata indahnya. Aku sangat bersyukur ada kamu di hidupku ❤️✨`;

      const cleanNum = (LOVE_CONFIG.whatsappNumber || "").replace(/\D/g, "");
      const waUrl = cleanNum
        ? `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`
        : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

      // Copy text to clipboard as convenient backup
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message).catch(() => {});
      }

      // Show sweet floating toast notification
      let toast = document.querySelector(".romantic-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "romantic-toast";
        toast.innerHTML =
          "<span>💌</span> Membuka WhatsApp... Pesan manis siap dikirim! ✨";
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.classList.add("is-fadeout");
          setTimeout(() => toast.remove(), 400);
        }, 3200);
      }

      // Open WhatsApp window
      setTimeout(() => {
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }, 400);
    });
  });
}
