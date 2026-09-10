'use client';
import { CampaignHero } from './campaign-hero';
import { usePageMotion } from './use-page-motion';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowUp, X, Menu } from 'lucide-react';
import { Chapters } from './chapters';
import { site, appointmentUrl } from '@/data/site';

function Appointment({className=''}:{className?:string}){return <a className={`appointment ${className}`} href={appointmentUrl} target="_blank" rel="noreferrer">Agendar avaliação <ArrowUpRight size={19}/></a>}
function Label({children}:{children:React.ReactNode}){return <p className="eyebrow">{children}</p>}
function Header(){
 const [open,setOpen]=useState(false); const [scrolled,setScrolled]=useState(false); const dialog=useRef<HTMLDialogElement>(null); const trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>70);onScroll();window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[]);
 useEffect(()=>{if(open){dialog.current?.showModal();document.body.style.overflow='hidden'}else{dialog.current?.close();document.body.style.overflow=''}return()=>{document.body.style.overflow=''}},[open]);
 const close=()=>{setOpen(false);trigger.current?.focus()};
 return <><header className={scrolled?'header scrolled':'header'}><a className="wordmark" href="#inicio" aria-label={`${site.name}, início`}><span className="brand-monogram" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M29 78V20h17c27 0 27 31 0 31H29M48 80V32h14c24 0 23 23 0 23H48m14 0c28 0 28 25 0 25H48" fill="none" stroke="currentColor" strokeWidth="2"/></svg></span><span className="brand-type">PAULA BRITO<small>HARMONIZAÇÃO FACIAL</small></span></a><nav className="desktop-nav" aria-label="Navegação principal"><a href="#sobre">A doutora</a><a href="#experiencia">A experiência</a>{site.results.enabled&&<a href="#resultados">Resultados</a>}<a href="/pre-anamnese">Pré-anamnese</a></nav><Appointment className="header-cta"/><button className="mobile-menu icon-button" ref={trigger} aria-label="Abrir menu" aria-expanded={open} onClick={()=>setOpen(true)}><Menu/></button></header><dialog ref={dialog} className="menu-dialog" onCancel={close} onClose={()=>setOpen(false)}><button className="menu-close icon-button" aria-label="Fechar menu" onClick={close}><X/></button><Label>{site.name}</Label><nav aria-label="Navegação mobile">{[['A doutora','sobre'],['A experiência','experiencia'],['Resultados','resultados'],['Pré-anamnese','/pre-anamnese'],['Vamos conversar','contato']].filter(([,id])=>id!=='resultados'||site.results.enabled).map(([name,id])=><a key={id} href={id.startsWith("/") ? id : `#${id}`} onClick={close}>{name}<ArrowUpRight/></a>)}</nav></dialog></>;
}
export function Experience(){const root=usePageMotion();
 return <div ref={root}><a className="skip-link" href="#manifesto">Pular para o conteúdo</a><Header/><main><CampaignHero/><Chapters/></main><footer className="footer"><div className="footer-main"><a href="#inicio" className="footer-name">{site.name.toUpperCase()}</a><div><a href={site.instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={14}/></a>{(site.whatsapp||site.whatsappUrl)&&<a href={appointmentUrl} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={14}/></a>}{site.phone&&<a href={`tel:${site.phone.replace(/[^\d+]/g,'')}`}>{site.phone}</a>}</div><div>{site.address&&<p>{site.address}</p>}{site.cro&&<p>{site.cro}</p>}<a href="/pre-anamnese">Preencher pré-anamnese <ArrowUpRight size={14} aria-hidden="true" /></a><a href="#inicio">Voltar ao início <ArrowUp size={14} aria-hidden="true" /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {site.name}</span><span>HARMONIZAÇÃO FACIAL</span></div></footer></div>
}
