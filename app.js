const KEY = "c27-checklist-v1";
let state = {};
try { state = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
const root = document.getElementById("root");
let data;

function render() {
  let total = 0, done = 0, html = "";
  data.subjects.forEach(s => {
    const d = s.items.filter((_, i) => state[s.id + i]).length;
    total += s.items.length; done += d;
    html += `<section class="card" style="--col:var(${s.color})"><div class="head"><h2>${s.name}</h2><span class="count">${d}/${s.items.length}</span></div><div class="bar"><i style="width:${d / s.items.length * 100}%"></i></div>`;
    s.items.forEach((it, i) => {
      const id = s.id + i;
      html += `<label><input type="checkbox" data-id="${id}" ${state[id] ? "checked" : ""}><span class="d">${it.label}${it.tag ? ` <span class="tag">${it.tag}</span>` : ""}</span></label>`;
    });
    html += "</section>";
  });
  root.innerHTML = html;
  document.getElementById("all").textContent = `${done}/${total}`;
}

root.addEventListener("change", e => {
  const id = e.target.dataset.id;
  if (id) { state[id] = e.target.checked; save(); render(); }
});
document.getElementById("reset").onclick = () => { state = {}; save(); render(); };

fetch("lectures.json").then(r => r.json()).then(j => { data = j; render(); })
  .catch(() => { root.textContent = "Could not load lectures.json. Serve this folder over http (see README)."; });
