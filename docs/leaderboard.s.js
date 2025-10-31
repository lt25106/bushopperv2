import"./chunk-FJBZMROU.js";import{E as m,H as a,K as l,L as p,M as b}from"./chunk-RDGRUNCC.js";m(b);var g=p(),u;l(a(g,"users"),t=>{u=t.val()});l(a(g,"leaderboard"),t=>{f.innerHTML="";let s=t.val();for(let[o,h]of Object.entries(s)){let d="";for(let[$,e]of Object.entries(h)){let r=[];for(let i=0;i<e.stops.length;i++)r.push(n(e.stops[i])),e.buses[i]&&r.push(e.buses[i]);let c=new Date(e.time);d+=`
      <tr>
        <td>${u[$].name}<br>${(e.distance/1e3).toFixed(1)}km<br>${c.toLocaleDateString("en-GB")}<br>${c.toLocaleTimeString("en-GB")}</td>
        <td>${r.join(" \u2192 ")}</td>
      </tr>
      `}f.innerHTML+=`
    <h1 onclick="startgame('${o}')">${n(o.split(" \u2192 ")[0])} \u2192 ${n(o.split(" \u2192 ")[1])}</h1>
    <table>
      <tbody>
        ${d}
      </tbody>
    </table>
    `}});var w=await fetch("https://data.busrouter.sg/v1/stops.min.geojson").then(t=>t.json()),f=document.querySelector("body > div");function n(t){return w.features.find(s=>s.id==t).properties.name}function v(t){let s=n(t.split(" \u2192 ")[0])+` (${t.split(" \u2192 ")[0]})`,o=n(t.split(" \u2192 ")[1])+` (${t.split(" \u2192 ")[1]})`;localStorage.setItem("busstops",JSON.stringify([s,o])),window.location.href="game.html"}window.startgame=v;
