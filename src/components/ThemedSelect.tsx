import {useEffect,useId,useRef,useState} from 'react';
import type {KeyboardEvent} from 'react';

type Choice = {value:string;label:string;disabled?:boolean};
interface ThemedSelectProps {
  id?:string;
  ariaLabel?:string;
  value:string;
  onValueChange:(value:string)=>void;
  options:readonly Choice[];
  disabled?:boolean;
}

/**
 * Theme-owned dropdown, avoiding the native Windows/macOS option menu (and its
 * forced blue selection). Keyboard navigation, Escape, click-away and reduced
 * motion are supported. Parent forms retain their own validation and state.
 */
export default function ThemedSelect({id,ariaLabel,value,onValueChange,options,disabled=false}:ThemedSelectProps){
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState(0);
  const root=useRef<HTMLDivElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const list=useRef<HTMLDivElement>(null);
  const listId=useId();
  const current=options.findIndex(option=>option.value===value);
  const index=current<0?0:current;
  const selected=options[index];

  useEffect(()=>{
    if(!open)return;
    const dismiss=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false)};
    document.addEventListener('pointerdown',dismiss);
    return()=>document.removeEventListener('pointerdown',dismiss);
  },[open]);
  useEffect(()=>{
    if(open){
      list.current?.focus();
      list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:'nearest'});
    }
  },[open]);

  function choose(nextIndex:number){
    const next=options[nextIndex];
    if(!next||next.disabled)return;
    onValueChange(next.value);
    setActive(nextIndex);
    setOpen(false);
    trigger.current?.focus();
  }
  function enable(){if(disabled||!options.length)return;setActive(index);setOpen(true)}
  function keyboard(event:KeyboardEvent<HTMLDivElement>){
    if(event.key==='Escape'){event.preventDefault();setOpen(false);trigger.current?.focus();return}
    if(event.key==='Tab'){setOpen(false);return}
    if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
      event.preventDefault();
      const dir=event.key==='ArrowDown'?1:-1;
      let next=event.key==='Home'?0:event.key==='End'?options.length-1:(active+dir+options.length)%options.length;
      for(let i=0;i<options.length&&options[next]?.disabled;i++)next=(next+dir+options.length)%options.length;
      setActive(next);
      list.current?.querySelector(`#${CSS.escape(`${listId}-option-${next}`)}`)?.scrollIntoView({block:'nearest'});
    }else if(event.key==='Enter'||event.key===' '){event.preventDefault();choose(active)}
  }
  return <div className={`cemetery-select${open?' is-open':''}${disabled?' is-disabled':''}`} ref={root}>
    <button
      id={id} ref={trigger} type="button" className="cemetery-select-trigger"
      aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} aria-controls={open?listId:undefined}
      onClick={()=>open?setOpen(false):enable()}
      onKeyDown={event=>{
        if(!open&&['ArrowDown','ArrowUp','Enter',' '].includes(event.key)){event.preventDefault();enable()}
      }} disabled={disabled}
    >
      <span className="cemetery-select-value">{selected?.label??'Select an option'}</span>
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" className="cemetery-select-chevron"><path d="m5 7 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
    {open&&<div id={listId} ref={list} role="listbox" tabIndex={-1} aria-label={ariaLabel||selected?.label||'Choose an option'} aria-activedescendant={`${listId}-option-${active}`} className="cemetery-select-menu" onKeyDown={keyboard}>
      <div className="cemetery-select-menu-title" aria-hidden="true">✦ &nbsp; CHOOSE YOUR PATH</div>
      {options.map((option,i)=><div
        id={`${listId}-option-${i}`} key={`${option.value}-${i}`} role="option" aria-selected={option.value===value}
        aria-disabled={option.disabled||undefined} className={`cemetery-select-option${i===active?' is-active':''}${option.value===value?' is-selected':''}`}
        onMouseEnter={()=>setActive(i)}
        onClick={()=>choose(i)}
      ><span className="cemetery-select-option-label">{option.label}</span>{option.value===value&&<span className="cemetery-select-check" aria-hidden="true">✦</span>}</div>)}
    </div>}
  </div>;
}
