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

function trocarAba(nomeAba) {
  document.querySelectorAll(".tab-pane").forEach(el => el.classList.remove("active"));
  document.getElementById("tab-" + nomeAba).classList.add("active");
  document.querySelectorAll(".nav-list li, .bottom-nav div").forEach(el => {
    el.classList.toggle("active", el.dataset.tab === nomeAba);
  });
}
document.querySelectorAll("[data-tab]").forEach(el => {
  el.addEventListener("click", () => trocarAba(el.dataset.tab));
});

const hoje = new Date();
document.getElementById("data-hoje").textContent = hoje.toLocaleDateString("pt-BR", {
  weekday: "long", day: "numeric", month: "long"
});

(function atualizarBannerAgua() {
  const horaAtual = hoje.getHours();
  const banner = document.getElementById("banner-agua");
  if (horaAtual >= 8 && horaAtual <= 22) {
    banner.textContent = "Ja bebeu agua nas ultimas horas? Esse e seu lembrete carinhoso.";
    banner.classList.add("visivel");
  }
})();

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
      li.textContent = (d.horario || "") + " - " + d.titulo;
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
