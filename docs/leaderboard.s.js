import"./chunk-FJBZMROU.js";import{E as c,H as n,K as l,L as p,M as b}from"./chunk-RDGRUNCC.js";c(b);var g=p(),u;l(n(g,"users"),t=>{u=t.val()});l(n(g,"leaderboard"),t=>{f.innerHTML="";let s=t.val();for(let[o,h]of Object.entries(s)){let d="";for(let[$,e]of Object.entries(h)){let r=[];for(let a=0;a<e.stops.length;a++)r.push(i(e.stops[a])),e.buses[a]&&r.push(e.buses[a]);let m=new Date(e.time);d+=`
      <tr>
        <td>
          <details>
            <summary>${u[$].name}</summary>
            ${(e.distance/1e3).toFixed(1)}km<br>
            ${m.toLocaleDateString("en-GB")}<br>
            ${m.toLocaleTimeString("en-GB")}
          </details>
        </td>
        <td>${r.join(" \u2192 ")}</td>
      </tr>
      `}f.innerHTML+=`
    <h1 onclick="startgame('${o}')">${i(o.split(" \u2192 ")[0])} \u2192 ${i(o.split(" \u2192 ")[1])}</h1>
    <table>
      <tbody>
        ${d}
      </tbody>
    </table>
    `}});var w=await fetch("https://data.busrouter.sg/v1/stops.min.geojson").then(t=>t.json()),f=document.querySelector("body > div");function i(t){return w.features.find(s=>s.id==t).properties.name}function v(t){let s=i(t.split(" \u2192 ")[0])+` (${t.split(" \u2192 ")[0]})`,o=i(t.split(" \u2192 ")[1])+` (${t.split(" \u2192 ")[1]})`;localStorage.setItem("busstops",JSON.stringify([s,o])),window.location.href="game.html"}window.startgame=v;
