import { db, observarLogin, entrarComGoogle } from "./firebase-config.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const loginScreen = document.getElementById("login-screen");
const appEl = document.getElementById("app");
document.getElementById("btn-login-google").addEventListener("click", entrarComGoogle);

observarLogin((user) => {
  if (user) {
    loginScreen.classList.add("escondido");
    appEl.classList.remove("escondido");
    carregarCompromissosHoje(user.uid);
    carregarTarefasUrgentes(user.uid);
  } else {
    loginScreen.classList.remove("escondido");
    appEl.classList.add("escondido");
  }
});

const abasNaSheet = ["ciclo", "algumdia", "estudos", "mural"];
const sheet = document.getElementById("sheet-mais");
const btnMais = document.getElementById("btn-mais");
const sheetFundo = document.getElementById("sheet-fundo");

function abrirSheet() {
  sheet.classList.remove("escondido");
  btnMais.setAttribute("aria-expanded", "true");
  sheet.querySelector(".sheet-item").focus();
}

function fecharSheet() {
  sheet.classList.add("escondido");
  btnMais.setAttribute("aria-expanded", "false");
  btnMais.focus();
}

sheet.addEventListener("keydown", (event) => {
  if (event.key === "Escape") fecharSheet();
});

btnMais.addEventListener("click", abrirSheet);
sheetFundo.addEventListener("click", fecharSheet);

document.querySelectorAll(".sheet-item").forEach(item => {
  item.addEventListener("click", () => {
    trocarAba(item.dataset.tab);
    fecharSheet();
  });
});

function trocarAba(nomeAba) {
  document.querySelectorAll(".tab-pane").forEach(el => el.classList.remove("active"));
  document.getElementById("tab-" + nomeAba).classList.add("active");

  document.querySelectorAll(".nav-list li").forEach(el => {
    el.classList.toggle("active", el.dataset.tab === nomeAba);
  });

  document.querySelectorAll(".nav-item[data-tab]").forEach(el => {
    el.classList.toggle("active", el.dataset.tab === nomeAba);
  });

  if (abasNaSheet.includes(nomeAba)) {
    btnMais.classList.add("active");
  } else {
    btnMais.classList.remove("active");
  }
}

document.querySelectorAll(".nav-list li[data-tab], .nav-item[data-tab]").forEach(el => {
  el.addEventListener("click", () => trocarAba(el.dataset.tab));
});

const hoje = new Date();
const dataTexto = hoje.toLocaleDateString("pt-BR", {
  weekday: "long", day: "numeric", month: "long"
});
document.getElementById("data-hoje").textContent =
  dataTexto.charAt(0).toUpperCase() + dataTexto.slice(1);

async function carregarCompromissosHoje(uid) {
  const inicioDia = new Date(); inicioDia.setHours(0,0,0,0);
  const fimDia = new Date(); fimDia.setHours(23,59,59,999);
  const lista = document.getElementById("lista-compromissos");
  try {
    const ref = collection(db, "usuarios", uid, "compromissos");
    const q = query(ref, where("data", ">=", inicioDia), where("data", "<=", fimDia));
    const snap = await getDocs(q);
    if (snap.empty) return;
    lista.innerHTML = "";
    snap.forEach(doc => {
      const d = doc.data();
      const li = document.createElement("li");
      li.textContent = (d.horario || "") + " — " + d.titulo;
      lista.appendChild(li);
    });
  } catch (e) { console.error("Erro ao carregar compromissos:", e); }
}

async function carregarTarefasUrgentes(uid) {
  const lista = document.getElementById("lista-tarefas-urgentes");
  try {
    const ref = collection(db, "usuarios", uid, "tarefas");
    const q = query(ref, where("status", "!=", "feito"));
    const snap = await getDocs(q);
    if (snap.empty) return;
    lista.innerHTML = "";
    snap.forEach(doc => {
      const d = doc.data();
      const li = document.createElement("li");
      li.textContent = d.titulo;
      lista.appendChild(li);
    });
  } catch (e) { console.error("Erro ao carregar tarefas:", e); }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(console.error);
}
