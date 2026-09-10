'use client';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
const pillars = [
 ['01', 'Identidade', 'Seus traços e sua história são o ponto de partida.'],
 ['02', 'Equilíbrio', 'Um olhar para o conjunto, com atenção a cada detalhe.'],
 ['03', 'Naturalidade', 'Valorizar a sua expressão, preservando o que é seu.'],
];
export function EssenceChapter(){
 return <section id="manifesto" className="essence-editorial" aria-labelledby="essence-title">
  <div className="essence-topline"><p>01 / A ESSÊNCIA</p><span/><p>BELEZA QUE FAZ SENTIDO PARA VOCÊ</p></div>
  <div className="essence-stage"><div className="essence-photo-wrap" data-reveal><figure className="essence-photo"><Image src="/images/paula-sorriso.webp" alt="Dra. Paula Brito sorrindo" fill sizes="(max-width:700px) 88vw, 40vw"/></figure><span className="essence-photo-note">Natural em cada detalhe.</span><span className="essence-frame" aria-hidden="true"/></div>
   <div className="essence-copy" data-reveal><p className="essence-prelude">A beleza começa no que é seu.</p><h2 id="essence-title">Não é sobre<br/>mudar quem<br/><em>você é.</em></h2><p className="essence-description">É sobre olhar para si com mais carinho. Valorizar seus traços, respeitar suas proporções e realçar a beleza que já existe em você.</p><a className="essence-link" href="#sobre">Conheça o olhar por trás do cuidado <span><ArrowUpRight size={23}/></span></a></div>
  </div>
  <div className="essence-values">{pillars.map(([number,title,copy])=><article key={number} data-reveal><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
 </section>;
}
