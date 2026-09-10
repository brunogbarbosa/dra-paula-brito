'use client';
import Image from 'next/image';
export function EssenceChapter(){return <section id="manifesto" className="essence-editorial" aria-labelledby="essence-title">
 <div className="section-topline"><p>01 — ESSÊNCIA</p><span/><p>O QUE TORNA VOCÊ ÚNICA</p></div>
 <div className="essence-statement" data-reveal><span className="essence-asterisk" aria-hidden="true">✳</span><h2 id="essence-title">Existe uma beleza<br/>que só <em>você tem.</em></h2><span className="essence-sideword">PRESERVAR. VALORIZAR. REALÇAR.</span></div>
 <div className="essence-foot"><figure className="essence-small-photo" data-reveal><Image src="/images/paula-natural.webp" alt="Dra. Paula Brito" fill sizes="(max-width:700px) 25vw, 130px"/></figure><p data-reveal>Ela está nos seus traços, na sua expressão e na sua história. A harmonização começa por reconhecer tudo isso — e cuidar de cada detalhe com intenção.</p><div className="essence-words" data-reveal><span>Identidade.</span><span>Equilíbrio.</span><span>Naturalidade.</span></div></div>
 </section>}
