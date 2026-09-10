'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { site } from '@/data/site';
import styles from './experience-statement.module.css';

function ImageSeal({ id }: { id: string }) {
  const sealPath = `${id}-experience-seal`;

  return <svg className={styles.seal} viewBox="0 0 126 126" aria-hidden="true" focusable="false">
    <defs>
      <path id={sealPath} d="M 13,63 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" />
    </defs>
    <text className={styles.sealCopy} textLength="282" lengthAdjust="spacing">
      <textPath href={`#${sealPath}`} startOffset="1%">ESTÉTICA · SAÚDE · CONFIANÇA · </textPath>
    </text>
    <text className={styles.sealMark} x="63" y="74" textAnchor="middle">PB</text>
  </svg>;
}

export function ExperienceStatement() {
  const root = useRef<HTMLElement>(null);
  const uid = useId().replace(/:/g, '');

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    let frame = 0;

    const setup = () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      section.classList.remove(styles.motionReady, styles.motionArmed, styles.motionVisible);

      if (media.matches || !('IntersectionObserver' in window)) return;

      section.classList.add(styles.motionReady);
      void section.offsetWidth;
      frame = window.requestAnimationFrame(() => {
        section.classList.add(styles.motionArmed);
        observer = new IntersectionObserver(([entry]) => {
          if (!entry?.isIntersecting) return;
          section.classList.add(styles.motionVisible);
          observer?.disconnect();
        }, { threshold: .1, rootMargin: '0px 0px -8% 0px' });
        observer.observe(section);
      });
    };

    setup();
    media.addEventListener('change', setup);

    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      media.removeEventListener('change', setup);
    };
  }, []);

  return <section ref={root} className={styles.root} aria-labelledby="experience-statement-title">
    <svg className={styles.thread} viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M 552 934 C 557 687 678 552 836 475 C 1116 338 1287 119 1648 -18" pathLength="1" vectorEffect="non-scaling-stroke" data-experience-motion="line" />
    </svg>

    <header className={styles.topline} data-experience-motion="fade">
      <p>04 / SUA EXPERIÊNCIA</p>
      <span aria-hidden="true" />
    </header>

    <div className={styles.heading}>
      <h2 id="experience-statement-title" aria-label="Naturalidade sem excessos.">
        <span className={styles.titleMask}><span data-experience-motion="title">Naturalidade</span></span>
        <span className={styles.titleMask}><em data-experience-motion="title">sem excessos.</em></span>
      </h2>
      <p className={styles.subtitle} data-experience-motion="fade">BELEZA COM IDENTIDADE. SEMPRE.</p>
    </div>

    <figure className={styles.photo} data-experience-motion="photo">
      <Image
        src={site.images.beauty}
        alt="Dra. Paula Brito realizando o planejamento facial de uma paciente"
        fill
        sizes="(max-width: 700px) 94vw, (max-width: 1100px) 50vw, 45vw"
      />
      <span className={styles.photoWash} aria-hidden="true" />
      <svg className={styles.photoArc} viewBox="0 0 720 740" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M 735 -18 C 526 49 414 177 371 359 C 345 470 349 594 371 758" pathLength="1" vectorEffect="non-scaling-stroke" data-experience-motion="line" />
      </svg>
      <p className={styles.photoCopy} data-experience-motion="photo-copy">CUIDADO<br />EM CADA<br />DETALHE.<span aria-hidden="true" /></p>
      <ImageSeal id={uid} />
    </figure>

    <div className={styles.quote} data-experience-motion="quote">
      <span className={styles.quoteMark} aria-hidden="true">PB</span>
      <div>
        <p>Mais do que estética,<br />é sobre se sentir bem com quem você é.</p>
        <footer><span aria-hidden="true" /><span className={styles.quoteAttribution}>NOSSO OLHAR</span></footer>
      </div>
    </div>

    <a className={styles.cta} href="#experiencia" data-experience-motion="cta">
      <span>CONHEÇA O TRATAMENTO</span>
      <ArrowUpRight size={25} strokeWidth={1.4} aria-hidden="true" />
    </a>
  </section>;
}
