const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/vidstack-BEi14iNw2-BWqEpMyw.js","assets/vidstack-D9mvYVIz-RqVQ1Hhz.js"])))=>i.map(i=>d[i]);
import{l as e}from"./app-04j5RE-w.js";import{At as t,Ct as n,Dt as r,Ft as i,G as a,H as o,It as s,K as c,Mt as l,Ot as u,Pt as d,St as f,Tt as p,W as m,X as h,Y as g,at as _,ct as v,it as y,jt as ee,n as te,nt as ne,o as re,pt as b,rt as ie,tt as x,vt as ae,wt as oe,xt as se,yt as S}from"./vidstack-D9mvYVIz-RqVQ1Hhz.js";import{S as ce,a as le,b as ue,d as de,t as fe,x as pe,y as me}from"./vidstack-CgfrU1hS-CEPAje2D.js";import{n as he,t as ge}from"./vidstack-mvRkf9tF-BrqIIW2_.js";import{n as C,r as w}from"./vidstack-CYE89tBD-BQ0NG9DX.js";import{n as _e}from"./vidstack-B1Z6f96t-DSxfLiaI.js";import{a as ve,i as ye,n as T,o as E,r as be,t as xe}from"./vidstack-DM8v4Khu-CRx9w9KD.js";var{I:Se}=ve,Ce=e=>e.strings===void 0,we={},Te=(e,t=we)=>e._$AH=t,D={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},O=e=>(...t)=>({_$litDirective$:e,values:t}),k=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},A=(e,t)=>{var n,r;let i=e._$AN;if(i===void 0)return!1;for(let e of i)(r=(n=e)._$AO)==null||r.call(n,t,!1),A(e,t);return!0},j=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},Ee=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),ke(t)}};function De(e){this._$AN===void 0?this._$AM=e:(j(this),this._$AM=e,Ee(this))}function Oe(e,t=!1,n=0){let r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let e=n;e<r.length;e++)A(r[e],!1),j(r[e]);else r!=null&&(A(r,!1),j(r));else A(this,e)}var ke=e=>{var t,n;e.type==D.CHILD&&((t=e)._$AP??(t._$AP=Oe),(n=e)._$AQ??(n._$AQ=De))},Ae=class extends k{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,n){super._$AT(e,t,n),Ee(this),this.isConnected=e._$AU}_$AO(e,t=!0){var n,r;e!==this.isConnected&&(this.isConnected=e,e?(n=this.reconnected)==null||n.call(this):(r=this.disconnected)==null||r.call(this)),t&&(A(this,e),j(this))}setValue(e){if(Ce(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}},je=e=>e??T,Me=class extends k{constructor(e){if(super(e),this.et=T,e.type!==D.CHILD)throw Error(this.constructor.directiveName+`() can only be used in child bindings`)}render(e){if(e===T||e==null)return this.ft=void 0,this.et=e;if(e===ye)return e;if(typeof e!=`string`)throw Error(this.constructor.directiveName+`() called with a non-string value`);if(e===this.et)return this.ft;this.et=e;let t=[e];return t.raw=t,this.ft={_$litType$:this.constructor.resultType,strings:t,values:[]}}};Me.directiveName=`unsafeHTML`,Me.resultType=1;var M=class extends Me{};M.directiveName=`unsafeSVG`,M.resultType=2;var Ne=O(M),Pe=class extends Ae{#e=null;#t=!1;#n=null;constructor(e){super(e),this.#t=e.type===D.ATTRIBUTE||e.type===D.BOOLEAN_ATTRIBUTE}render(e){return e!==this.#e&&(this.disconnected(),this.#e=e,this.isConnected&&this.#r()),this.#e?this.#i(n(this.#e)):T}reconnected(){this.#r()}disconnected(){this.#n?.(),this.#n=null}#r(){this.#e&&(this.#n=h(this.#o.bind(this)))}#i(e){return this.#t?je(e):e}#a(e){this.setValue(this.#i(e))}#o(){this.#a(this.#e?.())}};function N(e){return O(Pe)(a(e))}var Fe=class{#e;#t;elements=new Set;constructor(e,t){this.#e=e,this.#t=t}connect(){this.#r();let e=new MutationObserver(this.#n);for(let t of this.#e)e.observe(t,{childList:!0,subtree:!0});f(()=>e.disconnect()),f(this.disconnect.bind(this))}disconnect(){this.elements.clear()}assign(e,t){ie(e)?(t.textContent=``,t.append(e)):(be(null,t),be(e,t)),t.style.display||(t.style.display=`contents`);let n=t.firstElementChild;if(!n)return;let r=t.getAttribute(`data-class`);r&&n.classList.add(...r.split(` `))}#n=o(this.#r.bind(this));#r(e){if(e&&!e.some(e=>e.addedNodes.length))return;let t=!1,n=this.#e.flatMap(e=>[...e.querySelectorAll(`slot`)]);for(let e of n)!e.hasAttribute(`name`)||this.elements.has(e)||(this.elements.add(e),t=!0);t&&this.#t(this.elements)}},Ie=0,P=`data-slot-id`,Le=class{#e;slots;constructor(e){this.#e=e,this.slots=new Fe(e,this.#n.bind(this))}connect(){this.slots.connect(),this.#n();let e=new MutationObserver(this.#t);for(let t of this.#e)e.observe(t,{childList:!0});f(()=>e.disconnect())}#t=o(this.#n.bind(this));#n(){for(let e of this.#e)for(let t of e.children){if(t.nodeType!==1)continue;let e=t.getAttribute(`slot`);if(!e)continue;t.style.display=`none`;let n=t.getAttribute(P);n||t.setAttribute(P,n=++Ie+``);for(let r of this.slots.elements){if(r.getAttribute(`name`)!==e||r.getAttribute(P)===n)continue;let i=document.importNode(t,!0);e.includes(`-icon`)&&i.classList.add(`vds-icon`),i.style.display=``,i.removeAttribute(`slot`),this.slots.assign(i,r),r.setAttribute(P,n)}}}};function Re({name:e,class:t,state:n,paths:r,viewBox:i=`0 0 32 32`}){return E`<svg
    class="${`vds-icon`+(t?` ${t}`:``)}"
    viewBox="${i}"
    fill="none"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    data-icon=${je(e??n)}
  >
    ${b(r)?Ne(r):N(r)}
  </svg>`}var ze=class{#e={};#t=!1;slots;constructor(e){this.slots=new Fe(e,this.#r.bind(this))}connect(){this.slots.connect()}load(){this.loadIcons().then(e=>{this.#e=e,this.#t=!0,this.#r()})}*#n(){for(let e of Object.keys(this.#e)){let t=`${e}-icon`;for(let n of this.slots.elements)n.name===t&&(yield{icon:this.#e[e],slot:n})}}#r(){if(this.#t)for(let{icon:e,slot:t}of this.#n())this.slots.assign(e,t)}},Be=class extends ze{connect(){super.connect();let{player:e}=C();if(!e.el)return;let t,n=new IntersectionObserver(e=>{e[0]?.isIntersecting&&(t?.(),t=void 0,this.load())});n.observe(e.el),t=f(()=>n.disconnect())}},Ve=new WeakMap,F=O(class extends Ae{render(e){return T}update(e,[t]){let n=t!==this.G;return n&&this.G!==void 0&&this.ot(void 0),(n||this.rt!==this.lt)&&(this.G=t,this.dt=e.options?.host,this.ot(this.lt=e.element)),T}ot(e){if(typeof this.G==`function`){let t=this.dt??globalThis,n=Ve.get(t);n===void 0&&(n=new WeakMap,Ve.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.dt,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.dt,e)}else this.G.value=e}get rt(){return typeof this.G==`function`?Ve.get(this.dt??globalThis)?.get(this.G):this.G?.value}disconnected(){this.rt===this.lt&&this.ot(void 0)}reconnected(){this.ot(this.lt)}}),He=c();function I(){return s(He)}var Ue={colorScheme:`system`,download:null,customIcons:!1,disableTimeSlider:!1,menuContainer:null,menuGroup:`bottom`,noAudioGain:!1,noGestures:!1,noKeyboardAnimations:!1,noModal:!1,noScrubGesture:!1,playbackRates:{min:0,max:2,step:.25},audioGains:{min:0,max:300,step:25},seekStep:10,sliderChaptersMinWidth:325,hideQualityBitrate:!1,smallWhen:!1,thumbnails:null,translations:null,when:!1},We=class extends te{static props=Ue;#e;#t=a(()=>{let e=this.$props.when();return this.#r(e)});#n=a(()=>{let e=this.$props.smallWhen();return this.#r(e)});get isMatch(){return this.#t()}get isSmallLayout(){return this.#n()}onSetup(){this.#e=C(),this.setAttributes({"data-match":this.#t,"data-sm":()=>this.#n()?``:null,"data-lg":()=>this.#n()?null:``,"data-size":()=>this.#n()?`sm`:`lg`,"data-no-scrub-gesture":this.$props.noScrubGesture}),p(He,{...this.$props,when:this.#t,smallWhen:this.#n,userPrefersAnnouncements:t(!0),userPrefersKeyboardAnimations:t(!0),menuPortal:t(null)})}onAttach(e){ce(e,this.$props.colorScheme)}#r(e){return e!==`never`&&(ne(e)?e:a(()=>e(this.#e.player.state))())}},Ge=We.prototype;oe(Ge,`isMatch`),oe(Ge,`isSmallLayout`);function Ke(e,t){h(()=>{let{player:n}=C(),r=n.el;return r&&u(r,`data-layout`,t()&&e),()=>r?.removeAttribute(`data-layout`)})}function L(e,t){return e()?.[t]??t}function qe(){return N(()=>{let{translations:e,userPrefersAnnouncements:t}=I();return t()?E`<media-announcer .translations=${N(e)}></media-announcer>`:null})}function R(e,t=``){return E`<slot
    name=${`${e}-icon`}
    data-class=${`vds-icon vds-${e}-icon${t?` ${t}`:``}`}
  ></slot>`}function z(e){return e.map(e=>R(e))}function B(e,t){return N(()=>L(e,t))}function Je({tooltip:e}){let{translations:t}=I(),{remotePlaybackState:n}=w(),r=N(()=>`${L(t,`AirPlay`)} ${i(n())}`),a=B(t,`AirPlay`);return E`
    <media-tooltip class="vds-airplay-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-airplay-button class="vds-airplay-button vds-button" aria-label=${r}>
          ${R(`airplay`)}
        </media-airplay-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${e}>
        <span class="vds-airplay-tooltip-text">${a}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function Ye({tooltip:e}){let{translations:t}=I(),{remotePlaybackState:n}=w(),r=N(()=>`${L(t,`Google Cast`)} ${i(n())}`),a=B(t,`Google Cast`);return E`
    <media-tooltip class="vds-google-cast-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-google-cast-button class="vds-google-cast-button vds-button" aria-label=${r}>
          ${R(`google-cast`)}
        </media-google-cast-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${e}>
        <span class="vds-google-cast-tooltip-text">${a}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function V({tooltip:e}){let{translations:t}=I(),n=B(t,`Play`),r=B(t,`Pause`);return E`
    <media-tooltip class="vds-play-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-play-button
          class="vds-play-button vds-button"
          aria-label=${B(t,`Play`)}
        >
          ${z([`play`,`pause`,`replay`])}
        </media-play-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${e}>
        <span class="vds-play-tooltip-text">${n}</span>
        <span class="vds-pause-tooltip-text">${r}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function Xe({tooltip:e,ref:t=se}){let{translations:n}=I(),r=B(n,`Mute`),i=B(n,`Unmute`);return E`
    <media-tooltip class="vds-mute-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-mute-button
          class="vds-mute-button vds-button"
          aria-label=${B(n,`Mute`)}
          ${F(t)}
        >
          ${z([`mute`,`volume-low`,`volume-high`])}
        </media-mute-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${e}>
        <span class="vds-mute-tooltip-text">${i}</span>
        <span class="vds-unmute-tooltip-text">${r}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function H({tooltip:e}){let{translations:t}=I(),n=B(t,`Closed-Captions On`),r=B(t,`Closed-Captions Off`);return E`
    <media-tooltip class="vds-caption-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-caption-button
          class="vds-caption-button vds-button"
          aria-label=${B(t,`Captions`)}
        >
          ${z([`cc-on`,`cc-off`])}
        </media-caption-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${e}>
        <span class="vds-cc-on-tooltip-text">${r}</span>
        <span class="vds-cc-off-tooltip-text">${n}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function Ze(){let{translations:e}=I(),t=B(e,`Enter PiP`),n=B(e,`Exit PiP`);return E`
    <media-tooltip class="vds-pip-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-pip-button
          class="vds-pip-button vds-button"
          aria-label=${B(e,`PiP`)}
        >
          ${z([`pip-enter`,`pip-exit`])}
        </media-pip-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content">
        <span class="vds-pip-enter-tooltip-text">${t}</span>
        <span class="vds-pip-exit-tooltip-text">${n}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function Qe({tooltip:e}){let{translations:t}=I(),n=B(t,`Enter Fullscreen`),r=B(t,`Exit Fullscreen`);return E`
    <media-tooltip class="vds-fullscreen-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-fullscreen-button
          class="vds-fullscreen-button vds-button"
          aria-label=${B(t,`Fullscreen`)}
        >
          ${z([`fs-enter`,`fs-exit`])}
        </media-fullscreen-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${e}>
        <span class="vds-fs-enter-tooltip-text">${n}</span>
        <span class="vds-fs-exit-tooltip-text">${r}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function $e({backward:e,tooltip:t}){let{translations:n,seekStep:r}=I(),i=e?`Seek Backward`:`Seek Forward`,a=B(n,i);return E`
    <media-tooltip class="vds-seek-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-seek-button
          class="vds-seek-button vds-button"
          seconds=${N(()=>(e?-1:1)*r())}
          aria-label=${a}
        >
          ${R(e?`seek-backward`:`seek-forward`)}
        </media-seek-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${t}>
        ${B(n,i)}
      </media-tooltip-content>
    </media-tooltip>
  `}function et(){let{translations:e}=I(),{live:t}=w(),n=B(e,`Skip To Live`),r=B(e,`LIVE`);return t()?E`
        <media-live-button class="vds-live-button" aria-label=${n}>
          <span class="vds-live-button-text">${r}</span>
        </media-live-button>
      `:null}function U(){return N(()=>{let{download:e,translations:t}=I(),n=e();if(v(n))return null;let{source:r,title:i}=w(),a=r(),o=he({title:i(),src:a,download:n});return b(o?.url)?E`
          <media-tooltip class="vds-download-tooltip vds-tooltip">
            <media-tooltip-trigger>
              <a
                role="button"
                class="vds-download-button vds-button"
                aria-label=${B(t,`Download`)}
                href=${ge(o.url,{download:o.name})}
                download=${o.name}
                target="_blank"
              >
                <slot name="download-icon" data-class="vds-icon" />
              </a>
            </media-tooltip-trigger>
            <media-tooltip-content class="vds-tooltip-content" placement="top">
              ${B(t,`Download`)}
            </media-tooltip-content>
          </media-tooltip>
        `:null})}function W(){let{translations:e}=I();return E`
    <media-captions
      class="vds-captions"
      .exampleText=${B(e,`Captions look like this`)}
    ></media-captions>
  `}function G(){return E`<div class="vds-controls-spacer"></div>`}function tt(e,t){return E`
    <media-menu-portal .container=${N(e)} disabled="fullscreen">
      ${t}
    </media-menu-portal>
  `}function nt(e,t,n,r){let i=b(t)?document.querySelector(t):t;i||=e?.closest(`dialog`),i||=document.body;let a=document.createElement(`div`);a.style.display=`contents`,a.classList.add(n),i.append(a),h(()=>{if(!a)return;let{viewType:e}=w(),t=r();u(a,`data-view-type`,e()),u(a,`data-sm`,t),u(a,`data-lg`,!t),u(a,`data-size`,t?`sm`:`lg`)});let{colorScheme:o}=I();return ce(a,o),a}function rt({placement:e,tooltip:n,portal:r}){let{textTracks:i}=C(),{viewType:o,seekableStart:s,seekableEnd:c}=w(),{translations:l,thumbnails:u,menuPortal:f,noModal:p,menuGroup:m,smallWhen:h}=I();if(a(()=>{let e=s(),n=c(),r=t(null);return _e(i,`chapters`,r.set),!r()?.cues.filter(t=>t.startTime<=n&&t.endTime>=e)?.length})())return null;let g=a(()=>p()?d(e):h()?null:d(e)),_=a(()=>!h()&&m()===`bottom`&&o()===`video`?26:0),v=t(!1);function ee(){v.set(!0)}function te(){v.set(!1)}let ne=E`
    <media-menu-items
      class="vds-chapters-menu-items vds-menu-items"
      placement=${N(g)}
      offset=${N(_)}
    >
      ${N(()=>v()?E`
          <media-chapters-radio-group
            class="vds-chapters-radio-group vds-radio-group"
            .thumbnails=${N(u)}
          >
            <template>
              <media-radio class="vds-chapter-radio vds-radio">
                <media-thumbnail class="vds-thumbnail"></media-thumbnail>
                <div class="vds-chapter-radio-content">
                  <span class="vds-chapter-radio-label" data-part="label"></span>
                  <span class="vds-chapter-radio-start-time" data-part="start-time"></span>
                  <span class="vds-chapter-radio-duration" data-part="duration"></span>
                </div>
              </media-radio>
            </template>
          </media-chapters-radio-group>
        `:null)}
    </media-menu-items>
  `;return E`
    <media-menu class="vds-chapters-menu vds-menu" @open=${ee} @close=${te}>
      <media-tooltip class="vds-tooltip">
        <media-tooltip-trigger>
          <media-menu-button
            class="vds-menu-button vds-button"
            aria-label=${B(l,`Chapters`)}
          >
            ${R(`menu-chapters`)}
          </media-menu-button>
        </media-tooltip-trigger>
        <media-tooltip-content
          class="vds-tooltip-content"
          placement=${y(n)?N(n):n}
        >
          ${B(l,`Chapters`)}
        </media-tooltip-content>
      </media-tooltip>
      ${r?tt(f,ne):ne}
    </media-menu>
  `}function K(e){let{style:t}=new Option;return t.color=e,t.color.match(/\((.*?)\)/)[1].replace(/,/g,` `)}var it={type:`color`},at={type:`radio`,values:{"Monospaced Serif":`mono-serif`,"Proportional Serif":`pro-serif`,"Monospaced Sans-Serif":`mono-sans`,"Proportional Sans-Serif":`pro-sans`,Casual:`casual`,Cursive:`cursive`,"Small Capitals":`capitals`}},ot={type:`slider`,min:0,max:400,step:25,upIcon:null,downIcon:null},st={type:`slider`,min:0,max:100,step:5,upIcon:null,downIcon:null},ct={type:`radio`,values:[`None`,`Drop Shadow`,`Raised`,`Depressed`,`Outline`]},q={fontFamily:`pro-sans`,fontSize:`100%`,textColor:`#ffffff`,textOpacity:`100%`,textShadow:`none`,textBg:`#000000`,textBgOpacity:`100%`,displayBg:`#000000`,displayBgOpacity:`0%`},J=Object.keys(q).reduce((e,n)=>({...e,[n]:t(q[n])}),{});for(let e of Object.keys(J)){let t=localStorage.getItem(`vds-player:${m(e)}`);b(t)&&J[e].set(t)}function lt(){for(let e of Object.keys(J)){let t=q[e];J[e].set(t)}}var ut=!1,dt=new Set;function ft(){let{player:e}=C();dt.add(e),pt(e),f(()=>dt.delete(e)),ut||=(r(()=>{for(let e of ae(J)){let t=J[e],n=q[e],r=`vds-player:${m(e)}`;h(()=>{let i=t(),a=i===n;for(let t of dt)mt(t,e,i);a?localStorage.removeItem(r):localStorage.setItem(r,i)})}},null),!0)}function pt(e){for(let t of ae(J))mt(e,t,J[t]())}function mt(e,t,n){let r=q[t],i=`--media-user-${m(t)}`,a=n===r?null:ht(t,n);if(t===`fontFamily`){let t=n===`capitals`?`small-caps`:null;e.el?.style.setProperty(`--media-user-font-variant`,t)}e.el?.style.setProperty(i,a)}function ht(e,t){switch(e){case`fontFamily`:return _t(t);case`fontSize`:case`textOpacity`:case`textBgOpacity`:case`displayBgOpacity`:return gt(t);case`textColor`:return`rgb(${K(t)} / var(--media-user-text-opacity, 1))`;case`textShadow`:return vt(t);case`textBg`:return`rgb(${K(t)} / var(--media-user-text-bg-opacity, 1))`;case`displayBg`:return`rgb(${K(t)} / var(--media-user-display-bg-opacity, 1))`}}function gt(e){return(parseInt(e)/100).toString()}function _t(e){switch(e){case`mono-serif`:return`"Courier New", Courier, "Nimbus Mono L", "Cutive Mono", monospace`;case`mono-sans`:return`"Deja Vu Sans Mono", "Lucida Console", Monaco, Consolas, "PT Mono", monospace`;case`pro-sans`:return`Roboto, "Arial Unicode Ms", Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif`;case`casual`:return`"Comic Sans MS", Impact, Handlee, fantasy`;case`cursive`:return`"Monotype Corsiva", "URW Chancery L", "Apple Chancery", "Dancing Script", cursive`;case`capitals`:return`"Arial Unicode Ms", Arial, Helvetica, Verdana, "Marcellus SC", sans-serif + font-variant=small-caps`;default:return`"Times New Roman", Times, Georgia, Cambria, "PT Serif Caption", serif`}}function vt(e){switch(e){case`drop shadow`:return`rgb(34, 34, 34) 1.86389px 1.86389px 2.79583px, rgb(34, 34, 34) 1.86389px 1.86389px 3.72778px, rgb(34, 34, 34) 1.86389px 1.86389px 4.65972px`;case`raised`:return`rgb(34, 34, 34) 1px 1px, rgb(34, 34, 34) 2px 2px`;case`depressed`:return`rgb(204, 204, 204) 1px 1px, rgb(34, 34, 34) -1px -1px`;case`outline`:return`rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px`;default:return``}}var yt=0;function Y({label:e=``,value:t=``,children:n}){if(!e)return E`
      <div class="vds-menu-section">
        <div class="vds-menu-section-body">${n}</div>
      </div>
    `;let r=`vds-menu-section-${++yt}`;return E`
    <section class="vds-menu-section" role="group" aria-labelledby=${r}>
      <div class="vds-menu-section-title">
        <header id=${r}>${e}</header>
        ${t?E`<div class="vds-menu-section-value">${t}</div>`:null}
      </div>
      <div class="vds-menu-section-body">${n}</div>
    </section>
  `}function bt({label:e,children:t}){return E`
    <div class="vds-menu-item">
      <div class="vds-menu-item-label">${e}</div>
      ${t}
    </div>
  `}function X({label:e,icon:t,hint:n}){return E`
    <media-menu-button class="vds-menu-item">
      ${R(`menu-arrow-left`,`vds-menu-close-icon`)}
      ${t?R(t,`vds-menu-item-icon`):null}
      <span class="vds-menu-item-label">${N(e)}</span>
      <span class="vds-menu-item-hint" data-part="hint">${n?N(n):null} </span>
      ${R(`menu-arrow-right`,`vds-menu-open-icon`)}
    </media-menu-button>
  `}function xt({value:e=null,options:t,hideLabel:n=!1,children:r=null,onChange:i=null}){function a(e){let{value:t,label:i}=e;return E`
      <media-radio class="vds-radio" value=${t}>
        ${R(`menu-radio-check`)}
        ${n?null:E`
              <span class="vds-radio-label" data-part="label">
                ${b(i)?i:N(i)}
              </span>
            `}
        ${y(r)?r(e):r}
      </media-radio>
    `}return E`
    <media-radio-group
      class="vds-radio-group"
      value=${b(e)?e:e?N(e):``}
      @change=${i}
    >
      ${x(t)?t.map(a):N(()=>t().map(a))}
    </media-radio-group>
  `}function St(e){return x(e)?e.map(e=>({label:e,value:e.toLowerCase()})):Object.keys(e).map(t=>({label:t,value:e[t]}))}function Ct(){return E`
    <div class="vds-slider-track"></div>
    <div class="vds-slider-track-fill vds-slider-track"></div>
    <div class="vds-slider-thumb"></div>
  `}function wt(){return E`
    <media-slider-steps class="vds-slider-steps">
      <template>
        <div class="vds-slider-step"></div>
      </template>
    </media-slider-steps>
  `}function Z({label:e=null,value:t=null,upIcon:n=``,downIcon:r=``,children:i,isMin:a,isMax:o}){let s=e||t,c=[r?R(r,`down`):null,i,n?R(n,`up`):null];return E`
    <div
      class=${`vds-menu-item vds-menu-slider-item${s?` group`:``}`}
      data-min=${N(()=>a()?``:null)}
      data-max=${N(()=>o()?``:null)}
    >
      ${s?E`
            <div class="vds-menu-slider-title">
              ${[e?E`<div>${e}</div>`:null,t?E`<div>${t}</div>`:null]}
            </div>
            <div class="vds-menu-slider-body">${c}</div>
          `:c}
    </div>
  `}var Tt={...ot,upIcon:`menu-opacity-up`,downIcon:`menu-opacity-down`},Et={...st,upIcon:`menu-opacity-up`,downIcon:`menu-opacity-down`};function Dt(){return N(()=>{let{hasCaptions:e}=w(),{translations:t}=I();return e()?E`
      <media-menu class="vds-font-menu vds-menu">
        ${X({label:()=>L(t,`Caption Styles`)})}
        <media-menu-items class="vds-menu-items">
          ${[Y({label:B(t,`Font`),children:[Ot(),kt()]}),Y({label:B(t,`Text`),children:[At(),Mt(),jt()]}),Y({label:B(t,`Text Background`),children:[Nt(),Pt()]}),Y({label:B(t,`Display Background`),children:[Ft(),It()]}),Y({children:[Lt()]})]}
        </media-menu-items>
      </media-menu>
    `:null})}function Ot(){return Q({label:`Family`,option:at,type:`fontFamily`})}function kt(){return Q({label:`Size`,option:Tt,type:`fontSize`})}function At(){return Q({label:`Color`,option:it,type:`textColor`})}function jt(){return Q({label:`Opacity`,option:Et,type:`textOpacity`})}function Mt(){return Q({label:`Shadow`,option:ct,type:`textShadow`})}function Nt(){return Q({label:`Color`,option:it,type:`textBg`})}function Pt(){return Q({label:`Opacity`,option:Et,type:`textBgOpacity`})}function Ft(){return Q({label:`Color`,option:it,type:`displayBg`})}function It(){return Q({label:`Opacity`,option:Et,type:`displayBgOpacity`})}function Lt(){let{translations:e}=I();return E`
    <button class="vds-menu-item" role="menuitem" @click=${lt}>
      <span class="vds-menu-item-label">${N(()=>L(e,`Reset`))}</span>
    </button>
  `}function Q({label:e,option:t,type:n}){let{player:r}=C(),{translations:i}=I(),a=J[n],o=()=>L(i,e);function s(){ee(),r.dispatchEvent(new Event(`vds-font-change`))}if(t.type===`color`){function e(e){a.set(e.target.value),s()}return bt({label:N(o),children:E`
        <input
          class="vds-color-picker"
          type="color"
          .value=${N(a)}
          @input=${e}
        />
      `})}if(t.type===`slider`){let{min:e,max:n,step:r,upIcon:i,downIcon:c}=t;function l(e){a.set(e.detail+`%`),s()}return Z({label:N(o),value:N(a),upIcon:i,downIcon:c,isMin:()=>a()===e+`%`,isMax:()=>a()===n+`%`,children:E`
        <media-slider
          class="vds-slider"
          min=${e}
          max=${n}
          step=${r}
          key-step=${r}
          .value=${N(()=>parseInt(a()))}
          aria-label=${N(o)}
          @value-change=${l}
          @drag-value-change=${l}
        >
          ${Ct()}${wt()}
        </media-slider>
      `})}let c=St(t.values);return E`
    <media-menu class=${`vds-${m(n)}-menu vds-menu`}>
      ${X({label:o,hint:()=>{let e=a(),t=c.find(t=>t.value===e)?.label||``;return L(i,b(t)?t:t())}})}
      <media-menu-items class="vds-menu-items">
        ${xt({value:a,options:c,onChange({detail:e}){a.set(e),s()}})}
      </media-menu-items>
    </media-menu>
  `}function Rt({label:e,checked:r,defaultChecked:i=!1,storageKey:a,onChange:o}){let{translations:s}=I(),c=t(!!((a?localStorage.getItem(a):null)??i)),l=t(!1),u=N(fe(c)),d=B(s,e);a&&o(n(c)),r&&h(()=>void c.set(r()));function f(e){e?.button!==1&&(c.set(e=>!e),a&&localStorage.setItem(a,c()?`1`:``),o(c(),e),l.set(!1))}function p(e){_(e)&&f()}function m(e){e.button===0&&l.set(!0)}return E`
    <div
      class="vds-menu-checkbox"
      role="menuitemcheckbox"
      tabindex="0"
      aria-label=${d}
      aria-checked=${u}
      data-active=${N(()=>l()?``:null)}
      @pointerup=${f}
      @pointerdown=${m}
      @keydown=${p}
    ></div>
  `}function zt(){return N(()=>{let{translations:e}=I();return E`
      <media-menu class="vds-accessibility-menu vds-menu">
        ${X({label:()=>L(e,`Accessibility`),icon:`menu-accessibility`})}
        <media-menu-items class="vds-menu-items">
          ${[Y({children:[Bt(),Vt()]}),Y({children:[Dt()]})]}
        </media-menu-items>
      </media-menu>
    `})}function Bt(){let{userPrefersAnnouncements:e,translations:t}=I(),n=`Announcements`;return bt({label:B(t,n),children:Rt({label:n,storageKey:`vds-player::announcements`,onChange(t){e.set(t)}})})}function Vt(){return N(()=>{let{translations:e,userPrefersKeyboardAnimations:t,noKeyboardAnimations:n}=I(),{viewType:r}=w();if(a(()=>r()!==`video`||n())())return null;let i=`Keyboard Animations`;return bt({label:B(e,i),children:Rt({label:i,defaultChecked:!0,storageKey:`vds-player::keyboard-animations`,onChange(e){t.set(e)}})})})}function Ht(){return N(()=>{let{noAudioGain:e,translations:t}=I(),{audioTrack:n,audioTracks:r,canSetAudioGain:i}=w();return a(()=>!(i()&&!e())&&r().length<=1)()?null:E`
      <media-menu class="vds-audio-menu vds-menu">
        ${X({label:()=>L(t,`Audio`),icon:`menu-audio`,hint:()=>n()?.label??``})}
        <media-menu-items class="vds-menu-items">
          ${[Ut(),Wt()]}
        </media-menu-items>
      </media-menu>
    `})}function Ut(){return N(()=>{let{translations:e}=I(),{audioTracks:t}=w(),n=B(e,`Default`);return a(()=>t().length<=1)()?null:Y({children:E`
        <media-menu class="vds-audio-tracks-menu vds-menu">
          ${X({label:()=>L(e,`Track`)})}
          <media-menu-items class="vds-menu-items">
            <media-audio-radio-group
              class="vds-audio-track-radio-group vds-radio-group"
              empty-label=${n}
            >
              <template>
                <media-radio class="vds-audio-track-radio vds-radio">
                  <slot name="menu-radio-check-icon" data-class="vds-icon"></slot>
                  <span class="vds-radio-label" data-part="label"></span>
                </media-radio>
              </template>
            </media-audio-radio-group>
          </media-menu-items>
        </media-menu>
      `})})}function Wt(){return N(()=>{let{noAudioGain:e,translations:t}=I(),{canSetAudioGain:n}=w();if(a(()=>!n()||e())())return null;let{audioGain:r}=w();return Y({label:B(t,`Boost`),value:N(()=>Math.round(((r()??1)-1)*100)+`%`),children:[Z({upIcon:`menu-audio-boost-up`,downIcon:`menu-audio-boost-down`,children:Gt(),isMin:()=>((r()??1)-1)*100<=Kt(),isMax:()=>((r()??1)-1)*100===qt()})]})})}function Gt(){let{translations:e}=I(),t=B(e,`Boost`),n=Kt,r=qt,i=Jt;return E`
    <media-audio-gain-slider
      class="vds-audio-gain-slider vds-slider"
      aria-label=${t}
      min=${N(n)}
      max=${N(r)}
      step=${N(i)}
      key-step=${N(i)}
    >
      ${Ct()}${wt()}
    </media-audio-gain-slider>
  `}function Kt(){let{audioGains:e}=I(),t=e();return x(t)?t[0]??0:t.min}function qt(){let{audioGains:e}=I(),t=e();return x(t)?t[t.length-1]??300:t.max}function Jt(){let{audioGains:e}=I(),t=e();return x(t)?t[1]-t[0]||25:t.step}function Yt(){return N(()=>{let{translations:e}=I(),{hasCaptions:t}=w(),n=B(e,`Off`);return t()?E`
      <media-menu class="vds-captions-menu vds-menu">
        ${X({label:()=>L(e,`Captions`),icon:`menu-captions`})}
        <media-menu-items class="vds-menu-items">
          <media-captions-radio-group
            class="vds-captions-radio-group vds-radio-group"
            off-label=${n}
          >
            <template>
              <media-radio class="vds-caption-radio vds-radio">
                <slot name="menu-radio-check-icon" data-class="vds-icon"></slot>
                <span class="vds-radio-label" data-part="label"></span>
              </media-radio>
            </template>
          </media-captions-radio-group>
        </media-menu-items>
      </media-menu>
    `:null})}function Xt(){return N(()=>{let{hideQualityBitrate:e,translations:t}=I(),{canSetQuality:n,qualities:r}=w();if(!n()||r().length<=1)return null;let i=B(t,`Auto`);return E`
      <media-menu class="vds-quality-menu vds-menu">
        ${X({label:()=>L(t,`Quality`),icon:`menu-quality-up`})}
        <media-menu-items class="vds-menu-items">
          <media-quality-radio-group
            class="vds-quality-radio-group vds-radio-group"
            auto-label=${i}
            ?hide-bitrate=${N(e)}
          >
            <template>
              <media-radio class="vds-quality-radio vds-radio">
                <slot name="menu-radio-check-icon" data-class="vds-icon"></slot>
                <span class="vds-radio-label" data-part="label"></span>
                <span class="vds-radio-hint" data-part="bitrate"></span>
              </media-radio>
            </template>
          </media-quality-radio-group>
        </media-menu-items>
      </media-menu>
    `})}function Zt(){return N(()=>{let{translations:e}=I(),{canSetPlaybackRate:t,playbackRate:n}=w();return t()?E`
      <media-menu class="vds-speed-menu vds-menu">
        ${X({label:()=>L(e,`Speed`),icon:`menu-speed-up`,hint:()=>n()===1?L(e,`Normal`):n()+`x`})}
        <media-menu-items class="vds-menu-items">
          ${Y({label:B(e,`Speed`),value:N(()=>n()===1?L(e,`Normal`):n()+`x`),children:Z({upIcon:`menu-font-size-up`,downIcon:`menu-font-size-down`,children:tn(),isMin:()=>n()===Qt(),isMax:()=>n()===$t()})})}
        </media-menu-items>
      </media-menu>
    `:null})}function Qt(){let{playbackRates:e}=I(),t=e();return x(t)?t[0]??0:t.min}function $t(){let{playbackRates:e}=I(),t=e();return x(t)?t[t.length-1]??2:t.max}function en(){let{playbackRates:e}=I(),t=e();return x(t)?t[1]-t[0]||.25:t.step}function tn(){let{translations:e}=I(),t=B(e,`Speed`),n=Qt,r=$t,i=en;return E`
    <media-speed-slider
      class="vds-speed-slider vds-slider"
      aria-label=${t}
      min=${N(n)}
      max=${N(r)}
      step=${N(i)}
      key-step=${N(i)}
    >
      ${Ct()}${wt()}
    </media-speed-slider>
  `}function nn({placement:e,portal:n,tooltip:r}){return N(()=>{let{viewType:i}=w(),{translations:o,menuPortal:s,noModal:c,menuGroup:l,smallWhen:u}=I(),f=a(()=>c()?d(e):u()?null:d(e)),p=a(()=>!u()&&l()===`bottom`&&i()===`video`?26:0),m=t(!1);ft();function h(){m.set(!0)}function g(){m.set(!1)}let _=E`
      <media-menu-items
        class="vds-settings-menu-items vds-menu-items"
        placement=${N(f)}
        offset=${N(p)}
      >
        ${N(()=>m()?[Zt(),Xt(),zt(),Ht(),Yt()]:null)}
      </media-menu-items>
    `;return E`
      <media-menu class="vds-settings-menu vds-menu" @open=${h} @close=${g}>
        <media-tooltip class="vds-tooltip">
          <media-tooltip-trigger>
            <media-menu-button
              class="vds-menu-button vds-button"
              aria-label=${B(o,`Settings`)}
            >
              ${R(`menu-settings`,`vds-rotate-icon`)}
            </media-menu-button>
          </media-tooltip-trigger>
          <media-tooltip-content
            class="vds-tooltip-content"
            placement=${y(r)?N(r):r}
          >
            ${B(o,`Settings`)}
          </media-tooltip-content>
        </media-tooltip>
        ${n?tt(s,_):_}
      </media-menu>
    `})}function rn({orientation:e,tooltip:n}){return N(()=>{let{pointer:r,muted:i,canSetVolume:a}=w();if(r()===`coarse`&&!i())return null;if(!a())return Xe({tooltip:n});let o=t(void 0);return E`
      <div class="vds-volume" ?data-active=${N(me(o))} ${F(o.set)}>
        ${Xe({tooltip:n})}
        <div class="vds-volume-popup">${an({orientation:e})}</div>
      </div>
    `})}function an({orientation:e}={}){let{translations:t}=I();return E`
    <media-volume-slider
      class="vds-volume-slider vds-slider"
      aria-label=${B(t,`Volume`)}
      orientation=${je(e)}
    >
      <div class="vds-slider-track"></div>
      <div class="vds-slider-track-fill vds-slider-track"></div>
      <media-slider-preview class="vds-slider-preview" no-clamp>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
      <div class="vds-slider-thumb"></div>
    </media-volume-slider>
  `}function on(){let e=t(void 0),n=t(0),{thumbnails:r,translations:i,sliderChaptersMinWidth:a,disableTimeSlider:o,seekStep:s,noScrubGesture:c}=I(),l=B(i,`Seek`),u=N(o),d=N(()=>n()<a()),f=N(r);return ue(e,()=>{let t=e();t&&n.set(t.clientWidth)}),E`
    <media-time-slider
      class="vds-time-slider vds-slider"
      aria-label=${l}
      key-step=${N(s)}
      ?disabled=${u}
      ?no-swipe-gesture=${N(c)}
      ${F(e.set)}
    >
      <media-slider-chapters class="vds-slider-chapters" ?disabled=${d}>
        <template>
          <div class="vds-slider-chapter">
            <div class="vds-slider-track"></div>
            <div class="vds-slider-track-fill vds-slider-track"></div>
            <div class="vds-slider-progress vds-slider-track"></div>
          </div>
        </template>
      </media-slider-chapters>
      <div class="vds-slider-thumb"></div>
      <media-slider-preview class="vds-slider-preview">
        <media-slider-thumbnail
          class="vds-slider-thumbnail vds-thumbnail"
          .src=${f}
        ></media-slider-thumbnail>
        <div class="vds-slider-chapter-title" data-part="chapter-title"></div>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
    </media-time-slider>
  `}function sn(){return E`
    <div class="vds-time-group">
      ${N(()=>{let{duration:e}=w();return e()?[E`<media-time class="vds-time" type="current"></media-time>`,E`<div class="vds-time-divider">/</div>`,E`<media-time class="vds-time" type="duration"></media-time>`]:null})}
    </div>
  `}function cn(){return N(()=>{let{live:e,duration:t}=w();return e()?et():t()?E`<media-time class="vds-time" type="current" toggle remainder></media-time>`:null})}function ln(){return N(()=>{let{live:e}=w();return e()?et():sn()})}function un(){return N(()=>{let{textTracks:e}=C(),{title:n,started:r}=w(),i=t(null);return _e(e,`chapters`,i.set),i()&&(r()||!n())?dn():E`<media-title class="vds-chapter-title"></media-title>`})}function dn(){return E`<media-chapter-title class="vds-chapter-title"></media-chapter-title>`}var fn=class extends Be{async loadIcons(){let t=(await e(async()=>{let{icons:e}=await import(`./vidstack-BEi14iNw2-BWqEpMyw.js`);return{icons:e}},__vite__mapDeps([0,1]))).icons,n={};for(let e of Object.keys(t))n[e]=Re({name:e,paths:t[e]});return n}},pn=class extends We{static props={...super.props,when:({viewType:e})=>e===`audio`,smallWhen:({width:e})=>e<576}};function mn(){return[qe(),W(),E`
      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">
          ${[$e({backward:!0,tooltip:`top start`}),V({tooltip:`top`}),$e({tooltip:`top`}),hn(),on(),cn(),rn({orientation:`vertical`,tooltip:`top`}),H({tooltip:`top`}),U(),Je({tooltip:`top`}),gn()]}
        </media-controls-group>
      </media-controls>
    `]}function hn(){return N(()=>{let e=t(void 0),n=t(!1),r=C(),{title:i,started:a,currentTime:o,ended:s}=w(),{translations:c}=I(),u=pe(e),d=()=>a()||o()>0,f=()=>`${L(c,s()?`Replay`:d()?`Continue`:`Play`)}: ${i()}`;h(()=>{u()&&document.activeElement===document.body&&r.player.el?.focus({preventScroll:!0})});function p(){let t=e(),r=!!t&&!u()&&t.clientWidth<t.children[0].clientWidth;t&&l(t,`vds-marquee`,r),n.set(r)}function m(){return E`
        <span class="vds-title-text">
          ${N(f)}${N(()=>d()?dn():null)}
        </span>
      `}return ue(e,p),i()?E`
          <span class="vds-title" title=${N(f)} ${F(e.set)}>
            ${[m(),N(()=>n()&&!u()?m():null)]}
          </span>
        `:G()})}function gn(){let e=`top end`;return[rt({tooltip:`top`,placement:e,portal:!0}),nn({tooltip:`top end`,placement:e,portal:!0})]}var _n=class extends re(xe,pn){static tagName=`media-audio-layout`;static attrs={smallWhen:{converter(e){return e!==`never`&&!!e}}};#e;#t=t(!1);onSetup(){this.forwardKeepAlive=!1,this.#e=C(),this.#r(),this.#a()}onConnect(){this.#r(),Ke(`audio`,()=>this.isMatch),this.#i()}render(){return N(this.#n.bind(this))}#n(){return this.isMatch?mn():null}#r(){this.classList.add(`vds-audio-layout`)}#i(){let{menuPortal:e}=I();h(()=>{if(!this.isMatch)return;let t=nt(this,this.menuContainer,`vds-audio-layout`,()=>this.isSmallLayout),n=t?[this,t]:[this];return(this.$props.customIcons()?new Le(n):new fn(n)).connect(),e.set(t),()=>{t.remove(),e.set(null)}})}#a(){let{pointer:e}=this.#e.$state;h(()=>{e()===`coarse`&&h(this.#o.bind(this))})}#o(){if(!this.#t()){S(this,`pointerdown`,this.#s.bind(this),{capture:!0});return}S(this,`pointerdown`,e=>e.stopPropagation()),S(window,`pointerdown`,this.#c.bind(this))}#s(e){let{target:t}=e;de(t)&&t.closest(`.vds-time-slider`)&&(e.stopImmediatePropagation(),this.setAttribute(`data-scrubbing`,``),this.#t.set(!0))}#c(){this.#t.set(!1),this.removeAttribute(`data-scrubbing`)}},vn=O(class extends k{constructor(){super(...arguments),this.key=T}render(e,t){return this.key=e,t}update(e,[t,n]){return t!==this.key&&(Te(e),this.key=t),n}}),yn=class extends We{static props={...super.props,when:({viewType:e})=>e===`video`,smallWhen:({width:e,height:t})=>e<576||t<380}};function bn(){return N(()=>{let e=C(),{noKeyboardAnimations:n,userPrefersKeyboardAnimations:r}=I();if(a(()=>n()||!r())())return null;let i=t(!1),{lastKeyboardAction:o}=e.$state;h(()=>{i.set(!!o());let e=setTimeout(()=>i.set(!1),500);return()=>{i.set(!1),window.clearTimeout(e)}});let s=a(()=>{let e=o()?.action;return e&&i()?m(e):null}),c=a(()=>`vds-kb-action${i()?``:` hidden`}`),l=a(xn),u=a(()=>{let e=Cn();return e?le(e):null});function d(){let e=u();return e?E`
        <div class="vds-kb-bezel">
          <div class="vds-kb-icon">${e}</div>
        </div>
      `:null}return E`
      <div class=${N(c)} data-action=${N(s)}>
        <div class="vds-kb-text-wrapper">
          <div class="vds-kb-text">${N(l)}</div>
        </div>
        ${N(()=>vn(o(),d()))}
      </div>
    `})}function xn(){let{$state:e}=C(),t=e.lastKeyboardAction()?.action,n=e.audioGain()??1;switch(t){case`toggleMuted`:return e.muted()?`0%`:Sn(e.volume(),n);case`volumeUp`:case`volumeDown`:return Sn(e.volume(),n);default:return``}}function Sn(e,t){return`${Math.round(e*t*100)}%`}function Cn(){let{$state:e}=C();switch(e.lastKeyboardAction()?.action){case`togglePaused`:return e.paused()?`kb-pause-icon`:`kb-play-icon`;case`toggleMuted`:return e.muted()||e.volume()===0?`kb-mute-icon`:e.volume()>=.5?`kb-volume-up-icon`:`kb-volume-down-icon`;case`toggleFullscreen`:return`kb-fs-${e.fullscreen()?`enter`:`exit`}-icon`;case`togglePictureInPicture`:return`kb-pip-${e.pictureInPicture()?`enter`:`exit`}-icon`;case`toggleCaptions`:return e.hasCaptions()?`kb-cc-${e.textTrack()?`on`:`off`}-icon`:null;case`volumeUp`:return`kb-volume-up-icon`;case`volumeDown`:return`kb-volume-down-icon`;case`seekForward`:return`kb-seek-forward-icon`;case`seekBackward`:return`kb-seek-backward-icon`;default:return null}}function wn(){return[qe(),jn(),$(),bn(),W(),E`<div class="vds-scrim"></div>`,E`
      <media-controls class="vds-controls">
        ${[En(),G(),E`<media-controls-group class="vds-controls-group"></media-controls-group>`,G(),E`
            <media-controls-group class="vds-controls-group">
              ${on()}
            </media-controls-group>
          `,E`
            <media-controls-group class="vds-controls-group">
              ${[V({tooltip:`top start`}),rn({orientation:`horizontal`,tooltip:`top`}),ln(),un(),H({tooltip:`top`}),Tn(),Je({tooltip:`top`}),Ye({tooltip:`top`}),U(),Ze(),Qe({tooltip:`top end`})]}
            </media-controls-group>
          `]}
      </media-controls>
    `]}function Tn(){return N(()=>{let{menuGroup:e}=I();return e()===`bottom`?An():null})}function En(){return E`
    <media-controls-group class="vds-controls-group">
      ${N(()=>{let{menuGroup:e}=I();return e()===`top`?[G(),An()]:null})}
    </media-controls-group>
  `}function Dn(){return[qe(),jn(),$(),W(),bn(),E`<div class="vds-scrim"></div>`,E`
      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">
          ${[Je({tooltip:`top start`}),Ye({tooltip:`bottom start`}),G(),H({tooltip:`bottom`}),U(),An(),rn({orientation:`vertical`,tooltip:`bottom end`})]}
        </media-controls-group>

        ${G()}

        <media-controls-group class="vds-controls-group" style="pointer-events: none;">
          ${[G(),V({tooltip:`top`}),G()]}
        </media-controls-group>

        ${G()}

        <media-controls-group class="vds-controls-group">
          ${[ln(),un(),Qe({tooltip:`top end`})]}
        </media-controls-group>

        <media-controls-group class="vds-controls-group">
          ${on()}
        </media-controls-group>
      </media-controls>
    `,kn()]}function On(){return E`
    <div class="vds-load-container">
      ${[$(),V({tooltip:`top`})]}
    </div>
  `}function kn(){return N(()=>{let{duration:e}=w();return e()===0?null:E`
      <div class="vds-start-duration">
        <media-time class="vds-time" type="duration"></media-time>
      </div>
    `})}function $(){return E`
    <div class="vds-buffering-indicator">
      <media-spinner class="vds-buffering-spinner"></media-spinner>
    </div>
  `}function An(){let{menuGroup:e,smallWhen:t}=I(),n=()=>e()===`top`||t()?`bottom`:`top`,r=a(()=>`${n()} ${e()===`top`?`end`:`center`}`),i=a(()=>`${n()} end`);return[rt({tooltip:r,placement:i,portal:!0}),nn({tooltip:r,placement:i,portal:!0})]}function jn(){return N(()=>{let{noGestures:e}=I();return e()?null:E`
      <div class="vds-gestures">
        <media-gesture class="vds-gesture" event="pointerup" action="toggle:paused"></media-gesture>
        <media-gesture
          class="vds-gesture"
          event="pointerup"
          action="toggle:controls"
        ></media-gesture>
        <media-gesture
          class="vds-gesture"
          event="dblpointerup"
          action="toggle:fullscreen"
        ></media-gesture>
        <media-gesture class="vds-gesture" event="dblpointerup" action="seek:-10"></media-gesture>
        <media-gesture class="vds-gesture" event="dblpointerup" action="seek:10"></media-gesture>
      </div>
    `})}var Mn=class extends re(xe,yn){static tagName=`media-video-layout`;static attrs={smallWhen:{converter(e){return e!==`never`&&!!e}}};#e;onSetup(){this.forwardKeepAlive=!1,this.#e=C(),this.#t()}onConnect(){this.#t(),Ke(`video`,()=>this.isMatch),this.#n()}render(){return N(this.#r.bind(this))}#t(){this.classList.add(`vds-video-layout`)}#n(){let{menuPortal:e}=I();h(()=>{if(!this.isMatch)return;let t=nt(this,this.menuContainer,`vds-video-layout`,()=>this.isSmallLayout),n=t?[this,t]:[this];return(this.$props.customIcons()?new Le(n):new fn(n)).connect(),e.set(t),()=>{t.remove(),e.set(null)}})}#r(){let{load:e}=this.#e.$props,{canLoad:t,streamType:n,nativeControls:r}=this.#e.$state;return!r()&&this.isMatch?e()===`play`&&!t()?On():n()===`unknown`?$():this.isSmallLayout?Dn():wn():null}};g(_n),g(Mn);