'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useId } from 'react';
import { site } from '@/data/site';
import styles from './author-chapter.module.css';

const biography = site.bio;

function BrandSeal({ id }: { id: string }) {
  const pathId = `${id}-author-seal`;

  return <svg className={styles.seal} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
    <defs>
      <path id={pathId} d="M 15,60 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" />
    </defs>
    <text className={styles.sealText} textLength="280" lengthAdjust="spacing">
      <textPath href={`#${pathId}`} startOffset="1%">HARMONIZAÇÃO FACIAL · PAULA BRITO · </textPath>
    </text>
    <text className={styles.sealMark} x="60" y="70" textAnchor="middle">PB</text>
    <circle cx="8" cy="60" r="1.6" />
    <circle cx="112" cy="60" r="1.6" />
  </svg>;
}

export function AuthorChapter() {
  const uid = useId().replace(/:/g, '');

  return <section id="sobre" className={styles.root} aria-labelledby="author-title">
    <header className={styles.topline} data-author-motion="fade">
      <p>02 / POR TRÁS DO CUIDADO</p>
      <span aria-hidden="true" />
      <p>A BELEZA TAMBÉM ESTÁ NAS PESSOAS.</p>
    </header>

    <div className={styles.stage}>
      <div className={styles.copy}>
        <h2 id="author-title" aria-label="Cuidar é enxergar além.">
          <span className={styles.titleMask}><span data-author-motion="title">Cuidar é</span></span>
          <span className={styles.titleMask}><span data-author-motion="title">enxergar</span></span>
          <span className={styles.titleMask}><em data-author-motion="title">além.</em></span>
        </h2>
        <p className={styles.subcopy} data-author-motion="subcopy">Cada detalhe começa<br />na escuta.</p>
      </div>

      <figure className={styles.photo} data-author-motion="photo">
        <Image
          src={site.images.about}
          alt="Retrato da Dra. Paula Brito com roupa branca e as mãos próximas ao rosto"
          fill
          sizes="(max-width: 700px) 88vw, 46vw"
        />
      </figure>

      <article className={styles.card} data-author-motion="card">
        <p className={styles.cardLabel}>DRA. PAULA BRITO</p>
        <p className={styles.cardCopy}>{biography}</p>
        <a className={styles.cta} href={site.instagram} target="_blank" rel="noreferrer">
          <span>Conheça a Dra. Paula</span>
          <span className={styles.ctaCircle} aria-hidden="true"><ArrowUpRight size={24} strokeWidth={1.25} /></span>
        </a>
      </article>

      <aside className={styles.sideNote} aria-label="Mais que tratamentos, pessoas.">
        <span>MAIS QUE TRATAMENTOS, PESSOAS.</span>
        <i aria-hidden="true" />
        <b aria-hidden="true" />
      </aside>

      <svg className={`${styles.thread} ${styles.threadDesktop}`} viewBox="0 0 1600 110" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={`${uid}-author-pearl`} cx="30%" cy="25%">
            <stop stopColor="#f8eeee" />
            <stop offset=".5" stopColor="#bc8d96" />
            <stop offset="1" stopColor="#786344" />
          </radialGradient>
        </defs>
        <path d="M -30 30 C 260 84 540 91 800 58 C 1065 25 1320 91 1630 27" pathLength="1" vectorEffect="non-scaling-stroke" data-author-motion="line" />
        <circle cx="800" cy="58" r="8" fill={`url(#${uid}-author-pearl)`} data-author-motion="bead" />
      </svg>

      <svg className={`${styles.thread} ${styles.threadMobile}`} viewBox="0 0 430 546" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={`${uid}-author-pearl-mobile`} cx="30%" cy="25%">
            <stop stopColor="#f8eeee" />
            <stop offset=".5" stopColor="#bc8d96" />
            <stop offset="1" stopColor="#786344" />
          </radialGradient>
        </defs>
        <path d="M -20 475 C 55 498 90 529 150 538 C 236 551 335 543 450 518" pathLength="1" vectorEffect="non-scaling-stroke" data-author-motion="line" />
        <circle cx="99" cy="524" r="6.5" fill={`url(#${uid}-author-pearl-mobile)`} data-author-motion="bead" />
      </svg>
    </div>

    <footer className={styles.closing}>
      <p className={styles.closingEyebrow} data-author-motion="final"><span />NOSSA FILOSOFIA DE CUIDADO<span /></p>
      <div className={styles.closingRow}>
        <div className={styles.closingMonogram} aria-hidden="true"><strong>PB</strong><span /></div>
        <p className={styles.closingStatement}>
          <span data-author-motion="final">Precisão em cada escolha.</span>
          <em data-author-motion="final">Cuidado em cada encontro.</em>
        </p>
        <div className={styles.closingSeal}><span aria-hidden="true" /><BrandSeal id={uid} /></div>
      </div>
      <p className={styles.closingNote} data-author-motion="final">Escuta, presença e intenção em cada detalhe.</p>
    </footer>
  </section>;
}
