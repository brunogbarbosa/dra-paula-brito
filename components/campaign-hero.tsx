'use client';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { site, appointmentUrl } from '@/data/site';
import { useCampaignMotion } from './use-campaign-motion';
export function CampaignHero() {
 const motionRef = useCampaignMotion();
 return <section ref={motionRef} id="inicio" className="campaign" aria-labelledby="campaign-title">
  <div className="campaign-organic campaign-organic-one" aria-hidden="true"/><div className="campaign-organic campaign-organic-two" aria-hidden="true"/>
  <div className="campaign-inner"><div className="campaign-copy">
   <p className="campaign-kicker"><span/>HARMONIZAÇÃO FACIAL · DRA. PAULA BRITO</p>
   <h1 id="campaign-title"><span className="campaign-title-line"><span>Sua beleza.</span></span><span className="campaign-title-line"><span>Sua <em>essência.</em></span></span></h1>
   <p className="campaign-subtitle">Realçar o que faz você ser única.<br/>Com equilíbrio, delicadeza e naturalidade.</p>
   <div className="campaign-action"><a className="campaign-cta" href={appointmentUrl} target="_blank" rel="noreferrer"><span>Agendar minha avaliação</span><span className="cta-arrow"><ArrowUpRight size={22} strokeWidth={1.4}/></span></a></div>
   <a className="campaign-discover" href="#manifesto">Conheça o meu olhar <ArrowDown size={15}/></a>
   <div className="campaign-signature"><span/><p>RECIFE & SURUBIM<small>Um cuidado pensado para você.</small></p></div>
  </div><div className="campaign-image-stage">
   <div className="campaign-contour" aria-hidden="true"/>
   <figure className="campaign-portrait"><div className="campaign-silhouette"><Image className="campaign-original" src={site.images.hero} alt="Retrato da Dra. Paula Brito" fill preload sizes="(max-width:700px) 90vw, 47vw"/></div><figcaption>Dra. <em>Paula Brito</em><span>HARMONIZAÇÃO FACIAL · CRO 12935</span></figcaption></figure>
   <div className="campaign-seal" aria-hidden="true"><span>BELEZA COM IDENTIDADE</span><svg viewBox="0 0 100 100"><path d="M29 78V20h17c27 0 27 31 0 31H29M48 80V32h14c24 0 23 23 0 23H48m14 0c28 0 28 25 0 25H48" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg><span>PAULA BRITO</span></div>
   <p className="campaign-editorial">A SUA MELHOR VERSÃO É SUA.</p>
  </div></div>
  <div className="campaign-baseline"><span>HARMONIA</span><i/><span>NATURALIDADE</span><i/><span>IDENTIDADE</span><a href="#manifesto" aria-label="Explorar o site"><ArrowDown size={18}/></a></div>
 </section>;
}
