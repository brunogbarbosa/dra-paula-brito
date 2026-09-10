'use client';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { site, appointmentUrl } from '@/data/site';
import { useCampaignMotion } from './use-campaign-motion';
export function CampaignHero(){
 const root=useCampaignMotion();
 return <section ref={root} id="inicio" className="campaign" aria-labelledby="campaign-title">
  <figure className="campaign-portrait"><Image className="campaign-original" src={site.images.hero} alt="Dra. Paula Brito em sua clínica" fill preload sizes="(max-width:700px) 100vw, 62vw"/><span className="portrait-shade"/></figure>
  <div className="campaign-copy"><p className="campaign-kicker" data-hero-motion>HARMONIZAÇÃO FACIAL <span>RECIFE · SURUBIM</span></p><h1 id="campaign-title"><span data-hero-motion>A beleza</span><span data-hero-motion>de ser</span><em data-hero-motion>você.</em></h1><div className="campaign-description" data-hero-motion><span className="fine-rule"/><p>Um olhar sensível para os seus traços.<br/>Uma forma única de realçar a sua essência.</p></div><a className="campaign-cta" href={appointmentUrl} target="_blank" rel="noreferrer" data-hero-motion>Agendar minha avaliação <ArrowUpRight size={20}/></a></div>
  <div className="campaign-bottom" data-hero-motion><a href="#manifesto" className="scroll-discover"><ArrowDown size={18}/><span>UM NOVO OLHAR SOBRE VOCÊ</span></a><p>Dra. Paula Brito <span>CRO 12935</span></p><span className="hero-edition">BELEZA COM IDENTIDADE.</span></div>
 </section>;
}
