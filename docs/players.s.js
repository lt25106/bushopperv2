import"./chunk-FJBZMROU.js";import{E as f,H as m,K as p,L as u,M as g}from"./chunk-RDGRUNCC.js";f(g);var y=u(),$;p(m(y,"users"),t=>{$=t.val()});p(m(y,"leaderboard"),t=>{h.innerHTML="";let a=t.val(),e={};for(let[l,d]of Object.entries(a))for(let[s,r]of Object.entries(d))e[s]||(e[s]={}),e[s][l]=r;for(let[l,d]of Object.entries(e)){let s="";for(let[r,o]of Object.entries(d)){let c=[];for(let n=0;n<o.stops.length;n++)c.push(i(o.stops[n])),o.buses[n]&&c.push(o.buses[n]);let b=new Date(o.time);s+=`
      <tr>
        <td>
          <span onclick="startgame('${r}')">        
            ${i(r.split(" \u2192 ")[0])} \u2192 ${i(r.split(" \u2192 ")[1])}
          </span><br>
          <details>
            <summary>${b.toLocaleDateString("en-GB")}</summary>
            ${(o.distance/1e3).toFixed(1)}km<br>
            ${b.toLocaleTimeString("en-GB")}
          </details>
        </td>
        <td>${c.join(" \u2192 ")}</td>
      </tr>
      `}h.innerHTML+=`
    <h1>${$[l].name}</h1>
    <table>
      <tbody>
        ${s}
      </tbody>
    </table>
    `}});var w=await fetch("https://data.busrouter.sg/v1/stops.min.geojson").then(t=>t.json()),h=document.querySelector("body > div");function i(t){return w.features.find(a=>a.id==t).properties.name}function j(t){let a=i(t.split(" \u2192 ")[0])+` (${t.split(" \u2192 ")[0]})`,e=i(t.split(" \u2192 ")[1])+` (${t.split(" \u2192 ")[1]})`;localStorage.setItem("busstops",JSON.stringify([a,e])),window.location.href="game.html"}window.startgame=j;
