import"./chunk-FJBZMROU.js";import{E as c,H as n,K as l,L as p,M as g}from"./chunk-RDGRUNCC.js";c(g);var f=p(),u;l(n(f,"users"),t=>{u=t.val()});l(n(f,"leaderboard"),t=>{b.innerHTML="";let s=t.val();for(let[o,h]of Object.entries(s)){let d="";for(let[$,e]of Object.entries(h)){let i=[];for(let a=0;a<e.stops.length;a++)i.push(r(e.stops[a])),e.buses[a]&&i.push(e.buses[a]);let m=new Date(e.time);d+=`
      <tr>
        <td>
          <details>
            <summary>${u[$].name.replace(/[<]/g,"&lt;").replace(/[>]/g,"&gt;")}</summary>
            ${(e.distance/1e3).toFixed(1)}km<br>
            ${m.toLocaleDateString("en-GB")}<br>
            ${m.toLocaleTimeString("en-GB")}
          </details>
        </td>
        <td>${i.join(" \u2192 ")}</td>
      </tr>
      `}b.innerHTML+=`
    <h1 onclick="startgame('${o}')">${r(o.split(" \u2192 ")[0])} \u2192 ${r(o.split(" \u2192 ")[1])}</h1>
    <table>
      <tbody>
        ${d}
      </tbody>
    </table>
    `}});var w=await fetch("https://data.busrouter.sg/v1/stops.min.geojson").then(t=>t.json()),b=document.querySelector("body > div");function r(t){return w.features.find(s=>s.id==t).properties.name}function v(t){let s=r(t.split(" \u2192 ")[0])+` (${t.split(" \u2192 ")[0]})`,o=r(t.split(" \u2192 ")[1])+` (${t.split(" \u2192 ")[1]})`;localStorage.setItem("busstops",JSON.stringify([s,o])),window.location.href="game.html"}window.startgame=v;
