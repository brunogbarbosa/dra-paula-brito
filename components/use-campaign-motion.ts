'use client';
import { useLayoutEffect, useRef } from 'react';
export function useCampaignMotion(){
 const root=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{
  const section=root.current;if(!section)return;
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  let animations:Animation[]=[];
  const setup=()=>{animations.forEach(a=>a.cancel());animations=[];if(media.matches)return;
   section.querySelectorAll('[data-hero-motion]').forEach((el,i)=>animations.push(el.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:1100,delay:100+i*105,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})));
   const photo=section.querySelector('.campaign-original');if(photo)animations.push(photo.animate([{opacity:.35,transform:'scale(1.035)'},{opacity:1,transform:'scale(1)'}],{duration:1700,easing:'cubic-bezier(.16,1,.3,1)'}));
  };setup();media.addEventListener('change',setup);return()=>{animations.forEach(a=>a.cancel());media.removeEventListener('change',setup)};
 },[]);return root;
}
