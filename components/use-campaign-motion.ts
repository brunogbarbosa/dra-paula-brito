'use client';

import { useLayoutEffect, useRef } from 'react';

/** Finite entrance choreography; scroll and pointer motion run only on demand. */
export function useCampaignMotion() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const hero = root.current;
    if (!hero) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let dispose = () => {};

    const configure = () => {
      dispose();
      if (preference.matches) return;
      let cancelled = false;
      let visible = true;
      let started = false;
      let frame = 0;
      let pointerX = 0;
      let pointerY = 0;
      let x = 0;
      let y = 0;
      let progress = 0;
      const animations: Animation[] = [];
      const portrait = hero.querySelector<HTMLElement>('.campaign-portrait')!;
      const firstShape = hero.querySelector<HTMLElement>('.campaign-organic-one')!;
      const secondShape = hero.querySelector<HTMLElement>('.campaign-organic-two')!;
      const seal = hero.querySelector<HTMLElement>('.campaign-seal')!;
      const ease = 'cubic-bezier(.16, 1, .3, 1)';

      function animate(selector: string, keyframes: Keyframe[], duration: number, delay = 0, stagger = 0) {
        hero!.querySelectorAll(selector).forEach((element, index) => {
          const animation = element.animate(keyframes, {
            duration, delay: delay + index * stagger, easing: ease, fill: 'backwards',
          });
          animation.pause();
          animations.push(animation);
        });
      }

      const rise = [
        { opacity: 0, transform: 'translateY(24px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ];
      animate('.campaign-kicker', rise, 1000, 100);
      animate('.campaign-title-line > span', [
        { transform: 'translateY(115%) rotate(3deg)', opacity: 0 },
        { transform: 'translateY(0) rotate(0)', opacity: 1 },
      ], 1600, 200, 180);
      animate('.campaign-silhouette', [
        { opacity: 0, transform: 'translateY(48px) scale(1.055)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ], 2400, 300);
      animate('.campaign-subtitle', rise, 1300, 850);
      animate('.campaign-action', rise, 1200, 1050);
      animate('.campaign-metric', rise, 1300, 1250, 170);
      animate('.campaign-editorial, .campaign-signature', rise, 1500, 1300, 120);
      animate('.campaign-seal svg', [
        { opacity: 0, transform: 'rotate(-25deg) scale(.86)' },
        { opacity: 1, transform: 'rotate(0) scale(1)' },
      ], 2200, 600);
      animate('.campaign-seal circle, .campaign-seal > svg > path', [
        { strokeDashoffset: 1 }, { strokeDashoffset: 0 },
      ], 2200, 900);
      animate('.campaign-organic', [
        { opacity: 0, scale: '.93' }, { opacity: 1, scale: '1' },
      ], 3200, 0, 200);
      animate('.campaign-contour', [
        { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
      ], 2600, 1000);

      // Wait for the real assets, with a bounded fallback on slow connections.
      const photo = hero.querySelector<HTMLImageElement>('.campaign-original');
      let readyTimer: ReturnType<typeof setTimeout>;
      const fallback = new Promise<void>(resolve => { readyTimer = setTimeout(resolve, 1400); });
      Promise.race([
        Promise.all([document.fonts.ready, photo?.decode().catch(() => {})]), fallback,
      ]).then(() => {
        clearTimeout(readyTimer);
        if (cancelled) return;
        started = true;
        animations.forEach(animation => visible ? animation.play() : animation.cancel());
      });

      const render = () => {
        frame = 0;
        if (!visible || cancelled) return;
        const bounds = hero.getBoundingClientRect();
        const targetProgress = Math.min(1, Math.max(0, -bounds.top / bounds.height));
        progress += (targetProgress - progress) * .12;
        x += (pointerX - x) * .075;
        y += (pointerY - y) * .075;
        const distance = innerWidth <= 700 ? 28 : 64;
        portrait.style.translate = `${x * 9}px ${progress * distance + y * 5}px`;
        firstShape.style.translate = `${x * -12}px ${progress * -38}px`;
        secondShape.style.translate = `${x * 14}px ${progress * -65}px`;
        seal.style.translate = `0 ${progress * -22}px`;
        if (Math.abs(targetProgress - progress) + Math.abs(pointerX - x) + Math.abs(pointerY - y) > .002) {
          frame = requestAnimationFrame(render);
        }
      };
      const schedule = () => { if (!frame && visible) frame = requestAnimationFrame(render); };
      const move = (event: PointerEvent) => {
        if (!finePointer.matches || event.pointerType !== 'mouse') return;
        const bounds = hero.getBoundingClientRect();
        pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
        pointerY = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
        schedule();
      };
      const leave = () => { pointerX = 0; pointerY = 0; schedule(); };
      const observer = new IntersectionObserver(([entry]) => {
        const returning = !visible && entry.isIntersecting;
        visible = entry.isIntersecting;
        if (returning && started) animations.forEach(animation => { animation.currentTime = 0; animation.play(); });
        if (visible) schedule();
        else { cancelAnimationFrame(frame); frame = 0; }
      });
      observer.observe(hero);
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      hero.addEventListener('pointermove', move, { passive: true });
      hero.addEventListener('pointerleave', leave);

      dispose = () => {
        cancelled = true;
        clearTimeout(readyTimer);
        cancelAnimationFrame(frame);
        observer.disconnect();
        animations.forEach(animation => animation.cancel());
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        hero.removeEventListener('pointermove', move);
        hero.removeEventListener('pointerleave', leave);
        [portrait, firstShape, secondShape, seal].forEach(element => element.style.removeProperty('translate'));
      };
    };
    configure();
    preference.addEventListener('change', configure);
    return () => { dispose(); preference.removeEventListener('change', configure); };
  }, []);

  return root;
}
