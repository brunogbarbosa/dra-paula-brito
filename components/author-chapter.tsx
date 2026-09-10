'use client';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { site } from '@/data/site';
import styles from './author-chapter.module.css';
export function AuthorChapter(){return <section id="sobre" className={styles.root} aria-labelledby="author-title">
 <div className={styles.photoColumn}><figure className={styles.photo} data-reveal><Image src={site.images.about} alt="Dra. Paula Brito sorrindo" fill sizes="(max-width:700px) 100vw, 48vw"/></figure><div className={styles.photoCaption}><span>O OLHAR POR TRÁS DO CUIDADO</span><span>CRO 12935</span></div></div>
 <div className={styles.copy}><p className="chapter-tag" data-reveal>04 — DRA. PAULA BRITO</p><h2 id="author-title" data-reveal>Precisão<br/>no olhar.<br/><em>Sensibilidade<br/>no cuidado.</em></h2><p className={styles.bio} data-reveal>{site.bio}</p><a className={styles.cta} href={site.instagram} target="_blank" rel="noreferrer" data-reveal>Mais sobre a Dra. Paula <ArrowUpRight size={21}/></a><div className={styles.signature} aria-hidden="true">Paula Brito<span>HARMONIZAÇÃO FACIAL</span></div></div>
 </section>}
