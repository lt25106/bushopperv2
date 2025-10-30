import{c as l,d as f,g as m,h as u,i as h}from"./chunk-GXLBMYCJ.js";l(h);var g=u();m(f(g,"leaderboard"),o=>{y.innerHTML="";let a=o.val(),s={};for(let[i,p]of Object.entries(a))for(let[t,n]of Object.entries(p))s[t]||(s[t]={}),s[t][i]=n;for(let[i,p]of Object.entries(s)){let t="";for(let[n,e]of Object.entries(p)){let b=[];for(let r=0;r<e.stops.length;r++)b.push(d(e.stops[r])),e.buses[r]&&b.push(e.buses[r]);let c=new Date(e.time);t+=`
      <tr>
        <td>
          ${d(n.split(" \u2192 ")[0])} \u2192 ${d(n.split(" \u2192 ")[1])}<br>
          <span>
            ${(e.distance/1e3).toFixed(1)}km<br>
            ${c.toLocaleDateString("en-GB")}<br>
            ${c.toLocaleTimeString("en-GB")}
          </span>
        </td>
        <td>${b.join(" \u2192 ")}</td>
      </tr>
      `}y.innerHTML+=`
    <h1>${i}</h1>
    <table>
      <tbody>
        ${t}
      </tbody>
    </table>
    `}});var $=await fetch("https://data.busrouter.sg/v1/stops.min.geojson").then(o=>o.json()),y=document.querySelector("body > div");function d(o){return $.features.find(a=>a.id==o).properties.name}
