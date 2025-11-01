import"./chunk-FJBZMROU.js";import{E as b,H as c,K as p,L as f,M as g}from"./chunk-RDGRUNCC.js";b(g);var h=f(),$;p(c(h,"users"),e=>{$=e.val()});p(c(h,"leaderboard"),e=>{u.innerHTML="";let o=e.val(),a={};for(let[l,d]of Object.entries(o))for(let[r,t]of Object.entries(d)){let s=new Date(t.time).toLocaleDateString("en-GB");a[s]||(a[s]=[]),a[s].push({...t,uid:r,route:l})}for(let[l,d]of Object.entries(a)){let r="";d.forEach(t=>{let s=[];for(let n=0;n<t.stops.length;n++)s.push(i(t.stops[n])),t.buses[n]&&s.push(t.buses[n]);let m=new Date(t.time);r+=`
      <tr>
        <td>
          <span onclick="startgame('${t.route}')">        
            ${i(t.route.split(" \u2192 ")[0])} \u2192 ${i(t.route.split(" \u2192 ")[1])}
          </span><br>
          <details>
            <summary>${$[t.uid].name.replace(/[<]/g,"&lt;").replace(/[>]/g,"&gt;")}</summary>
            ${(t.distance/1e3).toFixed(1)}km<br>
            ${m.toLocaleDateString("en-GB")}<br>
            ${m.toLocaleTimeString("en-GB")}
          </details>
        </td>
        <td>${s.join(" \u2192 ")}</td>
      </tr>
      `}),u.innerHTML+=`
    <h1>${l}</h1>
    <table>
      <tbody>
        ${r}
      <tbody>
    </table>
    `}});var w=await fetch("https://data.busrouter.sg/v1/stops.min.geojson").then(e=>e.json()),u=document.querySelector("body > div");function i(e){return w.features.find(o=>o.id==e).properties.name}function y(e){let o=i(e.split(" \u2192 ")[0])+` (${e.split(" \u2192 ")[0]})`,a=i(e.split(" \u2192 ")[1])+` (${e.split(" \u2192 ")[1]})`;localStorage.setItem("busstops",JSON.stringify([o,a])),window.location.href="game.html"}window.startgame=y;
