'use client';
import { useEffect, useRef } from 'react';

/** Progressive enhancement: content stays visible before JS and after cancellation. */
export function usePageMotion(){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const section=root.current;
  if(!section || !('IntersectionObserver' in window) || !Element.prototype.animate)return;
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let dispose=()=>{};
  const configure=()=>{
   dispose();
   if(preference.matches)return;
   const animations=new Set<Animation>();
   const targets=section.querySelectorAll<HTMLElement>('[data-reveal], [data-author-motion="fade"], [data-author-motion="title"], [data-author-motion="subcopy"], [data-author-motion="photo"], [data-author-motion="card"], [data-author-motion="final"]');
   const observer=new IntersectionObserver(entries=>{
    let stagger=0;
    for(const entry of entries){
     if(!entry.isIntersecting)continue;
     observer.unobserve(entry.target);
     if(entry.boundingClientRect.bottom<80)continue;
     const element=entry.target as HTMLElement;
     const photo=element.matches('figure,[data-author-motion="photo"],.essence-photo-wrap');
     const distance=photo?18:22;
     const animation=element.animate([
      {opacity:photo?.65:.4,transform:`translateY(${distance}px)${photo?' scale(.99)':''}`},
      {opacity:1,transform:'translateY(0) scale(1)'}
     ],{duration:photo?1100:850,delay:Math.min(stagger++*65,195),easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
     animations.add(animation);
     animation.onfinish=()=>{animations.delete(animation);animation.cancel()};
    }
   },{threshold:.08});
   for(const target of targets){
    const rect=target.getBoundingClientRect();
    // Reloading or restoring a scrolled page must never hide its current content.
    if(rect.top<window.innerHeight && rect.bottom>0)continue;
    observer.observe(target);
   }
   dispose=()=>{observer.disconnect();for(const animation of animations)animation.cancel();animations.clear()};
  };
  configure();preference.addEventListener('change',configure);
  return()=>{dispose();preference.removeEventListener('change',configure)};
 },[]);
 return root;
}
