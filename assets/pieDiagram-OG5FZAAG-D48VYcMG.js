import{t as e}from"./chunk-AQ6EADP3-CZhslHi-.js";import{W as t,c as n,p as r,q as i}from"./chunk-LIEV3EAG-pyKGssV3.js";import{G as a,L as o,Q as s,R as c,T as l,V as u,X as d,f,j as p,k as m}from"./chunk-KEUXMURM-DvBwceAJ.js";import{t as h}from"./chunk-Y3FQM624-Q2rAC2pb.js";import{t as g}from"./chunk-JQRUD6KW-Dbva2Z17.js";import"./chunk-L5GCOVLC-CE2w8Nm_.js";import{t as _}from"./chunk-DMV4VAQV-D1nTPwGa.js";import"./chunk-HNC4WDU7-DoU3KnA7.js";import"./chunk-SATU7PGQ-B1zhgOvc.js";import"./chunk-224SPVON-B8gxtXpy.js";import"./chunk-EQFTRU2I-1ix7TzW9.js";import"./chunk-E5QJAATJ-dh-5CtIV.js";import"./chunk-66DQ2XMT-CM0xjFAN.js";import"./chunk-D6VWDJW2-BxcBdZ9c.js";import"./chunk-BI6VK774-D0oaWk8V.js";import"./chunk-XNMVGMAZ-Cg_LnPtj.js";import"./chunk-4RFN2BYJ-DHHWuC-n.js";import"./chunk-FWYVLQTC-BgDItRzJ.js";import"./chunk-RRFMTAIC-CMN0wcYA.js";import"./chunk-TZUXEDM2-B7p9AcTw.js";import"./chunk-OIYT25JQ-CQ6KOZGX.js";import"./chunk-NV3KIAZN-5yvcpMiu.js";import"./chunk-STOV2HOB-GnExfzIX.js";import{a as v,p as y}from"./chunk-ENMKPL7Y-DNhaakOG.js";var b=c.pie,x={sections:new Map,showData:!1,config:b},S=x.sections,C=x.showData,w=structuredClone(b),T={getConfig:e(()=>structuredClone(w),`getConfig`),clear:e(()=>{S=new Map,C=x.showData,s()},`clear`),setDiagramTitle:m,getDiagramTitle:p,setAccTitle:u,getAccTitle:l,setAccDescription:o,getAccDescription:a,addSection:e(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);S.has(e)||(S.set(e,t),i.debug(`added new section: ${e}, with value: ${t}`))},`addSection`),getSections:e(()=>S,`getSections`),setShowData:e(e=>{C=e},`setShowData`),getShowData:e(()=>C,`getShowData`)},E=e((e,t)=>{g(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},`populateDb`),D={parse:e(async e=>{let t=await _(`pie`,e);i.debug(t),E(t,T)},`parse`)},O=e(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,`getStyles`),k=e(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),r=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1);return n().value(e=>e.value).sort(null)(r)},`createPieArcs`),A={parser:D,db:T,renderer:{draw:e((e,n,a,o)=>{i.debug(`rendering pie chart
`+e);let s=o.db,c=f(),l=v(s.getConfig(),c.pie),u=h(n),p=u.append(`g`);p.attr(`transform`,`translate(225,225)`);let{themeVariables:m}=c,[g]=y(m.pieOuterStrokeWidth);g??=2;let _=l.legendPosition,b=l.textPosition,x=l.donutHole>0&&l.donutHole<=.9?l.donutHole:0,S=t().innerRadius(x*185).outerRadius(185),C=t().innerRadius(185*b).outerRadius(185*b),w=p.append(`g`);w.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+g/2).attr(`class`,`pieOuterCircle`);let T=s.getSections(),E=k(T),D=[m.pie1,m.pie2,m.pie3,m.pie4,m.pie5,m.pie6,m.pie7,m.pie8,m.pie9,m.pie10,m.pie11,m.pie12],O=0;T.forEach(e=>{O+=e});let A=E.filter(e=>(e.data.value/O*100).toFixed(0)!==`0`),j=r(D).domain([...T.keys()]);w.selectAll(`mySlices`).data(A).enter().append(`path`).attr(`d`,S).attr(`fill`,e=>j(e.data.label)).attr(`class`,e=>{let t=`pieCircle`;return l.highlightSlice===`hover`?t+=` highlightedOnHover`:l.highlightSlice===e.data.label&&(t+=` highlighted`),t}),w.selectAll(`mySlices`).data(A).enter().append(`text`).text(e=>(e.data.value/O*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+C.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`);let M=p.append(`text`).text(s.getDiagramTitle()).attr(`x`,0).attr(`y`,-400/2).attr(`class`,`pieTitleText`),N=[...T.entries()].map(([e,t])=>({label:e,value:t})),P=p.selectAll(`.legend`).data(N).enter().append(`g`).attr(`class`,`legend`);P.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>j(e.label)).style(`stroke`,e=>j(e.label)),P.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>s.getShowData()?`${e.label} [${e.value}]`:e.label);let F=Math.max(...P.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0)),I=450,L=490,R=N.length*22;switch(_){case`center`:P.attr(`transform`,(e,t)=>{let n=22*N.length/2,r=-F/2-22,i=t*22-n;return`translate(`+r+`,`+i+`)`});break;case`top`:I+=R,P.attr(`transform`,(e,t)=>`translate(${-F/2-22}, ${t*22-185})`),w.attr(`transform`,()=>`translate(0, ${R+22})`);break;case`bottom`:I+=R,P.attr(`transform`,(e,t)=>{let n=-F/2-22,r=t*22- -207;return`translate(`+n+`,`+r+`)`});break;case`left`:L+=22+F,P.attr(`transform`,(e,t)=>{let n=22*N.length/2;return`translate(-207,`+(t*22-n)+`)`}),w.attr(`transform`,()=>`translate(${F+18+4}, 0)`);break;default:L+=22+F,P.attr(`transform`,(e,t)=>{let n=22*N.length/2;return`translate(216,`+(t*22-n)+`)`});break}let z=M.node()?.getBoundingClientRect().width??0,B=450/2-z/2,V=450/2+z/2,H=Math.min(0,B),U=Math.max(L,V)-H;u.attr(`viewBox`,`${H} 0 ${U} ${I}`),d(u,I,U,l.useMaxWidth)},`draw`)},styles:O};export{A as diagram};