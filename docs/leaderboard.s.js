import{c as b,d as p,g as l,h as c,i as m}from"./chunk-GXLBMYCJ.js";b(m);var g=c();l(p(g,"leaderboard"),e=>{f.innerHTML="";let s=e.val();for(let[i,u]of Object.entries(s)){let a="";for(let[h,t]of Object.entries(u)){let n=[];for(let o=0;o<t.stops.length;o++)n.push(r(t.stops[o])),t.buses[o]&&n.push(t.buses[o]);let d=new Date(t.time);a+=`
      <tr>
        <td>${h}<br>${(t.distance/1e3).toFixed(1)}km<br>${d.toLocaleDateString("en-GB")}<br>${d.toLocaleTimeString("en-GB")}</td>
        <td>${n.join(" \u2192 ")}</td>
      </tr>
      `}f.innerHTML+=`
    <h1>${r(i.split(" \u2192 ")[0])} \u2192 ${r(i.split(" \u2192 ")[1])}</h1>
    <table>
      <tbody>
        ${a}
      </tbody>
    </table>
    `}});var $=await fetch("https://data.busrouter.sg/v1/stops.min.geojson").then(e=>e.json()),f=document.querySelector("body > div");function r(e){return $.features.find(s=>s.id==e).properties.name}
