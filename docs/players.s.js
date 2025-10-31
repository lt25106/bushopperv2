import"./chunk-FJBZMROU.js";import{E as f,H as p,K as b,L as u,M as g}from"./chunk-RDGRUNCC.js";f(g);var $=u(),y;b(p($,"users"),t=>{y=t.val()});b(p($,"leaderboard"),t=>{h.innerHTML="";let n=t.val(),e={};for(let[l,c]of Object.entries(n))for(let[s,r]of Object.entries(c))e[s]||(e[s]={}),e[s][l]=r;for(let[l,c]of Object.entries(e)){let s="";for(let[r,o]of Object.entries(c)){let d=[];for(let a=0;a<o.stops.length;a++)d.push(i(o.stops[a])),o.buses[a]&&d.push(o.buses[a]);let m=new Date(o.time);s+=`
      <tr>
        <td>
          <span onclick="startgame('${r}')">        
            ${i(r.split(" \u2192 ")[0])} \u2192 ${i(r.split(" \u2192 ")[1])}
          </span><br>
          ${(o.distance/1e3).toFixed(1)}km<br>
          ${m.toLocaleDateString("en-GB")}<br>
          ${m.toLocaleTimeString("en-GB")}
        </td>
        <td>${d.join(" \u2192 ")}</td>
      </tr>
      `}h.innerHTML+=`
    <h1>${y[l].name}</h1>
    <table>
      <tbody>
        ${s}
      </tbody>
    </table>
    `}});var w=await fetch("https://data.busrouter.sg/v1/stops.min.geojson").then(t=>t.json()),h=document.querySelector("body > div");function i(t){return w.features.find(n=>n.id==t).properties.name}function j(t){let n=i(t.split(" \u2192 ")[0])+` (${t.split(" \u2192 ")[0]})`,e=i(t.split(" \u2192 ")[1])+` (${t.split(" \u2192 ")[1]})`;localStorage.setItem("busstops",JSON.stringify([n,e])),window.location.href="game.html"}window.startgame=j;
