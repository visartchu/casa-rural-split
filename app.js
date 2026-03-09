const people = [
  "Ivan",
  "Alvaro",
  "Alba",
  "Andreu",
  "Berni",
  "Eric",
  "Nora",
  "Paula",
  "Ruben",
  "Sergi",
  "Vera",
  "Isa",
  "Jordi",
  "Maria"
];

const paid = {
  Vera: 23.23,
  Jordi: 2,
  Alvaro: 70.26
};

const items = [
  { id: 1, name: "CARBO VEGETAL", price: 4.25, category: "comun", consumers: [...people] },
  { id: 2, name: "BOSSA PLASTIC", price: 1.20, category: "comun", consumers: [...people] },
  { id: 3, name: "OLI VERGE", price: 4.45, category: "comun", consumers: [...people] },
  { id: 4, name: "ROTLLIE CUINA GEGANT", price: 2.90, category: "comun", consumers: [...people] },
  { id: 5, name: "SAL FINA", price: 0.40, category: "comun", consumers: [...people] },
  { id: 6, name: "ALL SEC 250 G", price: 1.85, category: "comun", consumers: [...people] },
  { id: 7, name: "ALLOTI TARRINA", price: 1.10, category: "comun", consumers: [...people] },
  { id: 8, name: "GOT REUTILITZABLE", price: 1.65, category: "comun", consumers: [...people] },
  { id: 9, name: "SALSA CALÇOTS (4)", price: 11.20, category: "comun", consumers: [...people] },
  { id: 10, name: "OLIVA AMB OS PET", price: 1.40, category: "comun", consumers: [...people] },
  { id: 11, name: "PEBRE NEGRE MOLT", price: 1.30, category: "comun", consumers: [...people] },
  { id: 12, name: "HIGIENIC DOBLE ROLL", price: 4.50, category: "comun", consumers: [...people] },
  { id: 13, name: "CALÇOTS", price: 40.00, category: "comun", consumers: [...people] },
  { id: 14, name: "OLIVAS", price: 4.89, category: "comun", consumers: [...people] },
  { id: 15, name: "PATATAS", price: 5.98, category: "comun", consumers: [...people] },
  { id: 16, name: "PATATAS CAMPESINAS", price: 2.05, category: "comun", consumers: [...people] },
  { id: 17, name: "RUFFLES JAMÓN", price: 2.99, category: "comun", consumers: [...people] },
  { id: 18, name: "PAPEL DE PLATA", price: 3.34, category: "comun", consumers: [...people] },
  { id: 19, name: "AGUA", price: 3.98, category: "comun", consumers: [...people] },
  { id: 20, name: "CALÇOTS", price: 40.00, category: "comun", consumers: [...people] },

  // Alcohol oculto por ahora
  { id: 20, name: "Ron viernes 1", price: 15.45, category: "alcohol", consumers: [] },
  { id: 21, name: "Ron sábado 3", price: 46.35, category: "alcohol", consumers: [] },
  { id: 22, name: "Jager viernes 1", price: 15.25, category: "alcohol", consumers: [] },
  { id: 23, name: "Jager sábado 1", price: 15.25, category: "alcohol", consumers: [] },
  { id: 24, name: "Cola Zero 1", price: 4.10, category: "alcohol", consumers: [] },
  { id: 25, name: "Cola Zero 2", price: 4.10, category: "alcohol", consumers: [] }
];

let filtroActual = "todos";

const itemsContainer = document.getElementById("items");
const summaryContainer = document.getElementById("summary");
const grandTotalEl = document.getElementById("grandTotal");
const assignedTotalEl = document.getElementById("assignedTotal");
const differenceEl = document.getElementById("difference");

function formatEuro(value) {
  return value.toFixed(2).replace(".", ",") + " €";
}

function setFiltro(filtro) {
  filtroActual = filtro;

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filtro);
  });

  renderItems();
}

function toggleConsumer(itemId, person) {
  const item = items.find((i) => i.id === itemId);
  if (!item || item.category === "comun") return;

  const index = item.consumers.indexOf(person);

  if (index >= 0) {
    item.consumers.splice(index, 1);
  } else {
    item.consumers.push(person);
  }

  renderItems();
  renderSummary();
}

function asignarComunesATodos() {
  items.forEach((item) => {
    if (item.category === "comun") {
      item.consumers = [...people];
    }
  });

  renderItems();
  renderSummary();
}

function limpiarTodo() {
  items.forEach((item) => {
    if (item.category !== "comun") {
      item.consumers = [];
    }
  });

  renderItems();
  renderSummary();
}

function getFilteredItems() {
  if (filtroActual === "todos") {
    return items.filter((item) => item.category !== "alcohol");
  }

  return items.filter((item) => item.category === filtroActual);
}

function renderItems() {
  const filtered = getFilteredItems();

  itemsContainer.innerHTML = filtered.map((item) => {
    const porPersona = item.consumers.length > 0 ? item.price / item.consumers.length : 0;

    return `
      <div class="item ${item.category}">
        <div class="item-top">
          <div>
            <div><strong>${item.name}</strong></div>
            <div class="meta">
              ${formatEuro(item.price)}
              ${item.consumers.length > 0 ? " · " + formatEuro(porPersona) + " por persona" : " · Sin asignar"}
            </div>
          </div>
        </div>

        ${
          item.category === "comun"
            ? `<div class="meta">Repartido automáticamente entre todos</div>`
            : `
              <div class="chips">
                ${people.map((person) => `
                  <span
                    class="chip ${item.consumers.includes(person) ? "active" : ""}"
                    onclick="toggleConsumer(${item.id}, '${person.replace(/'/g, "\\'")}')"
                  >
                    ${person}
                  </span>
                `).join("")}
              </div>
            `
        }
      </div>
    `;
  }).join("");
}

function renderSummary() {
  const totals = {};
  people.forEach((person) => {
    totals[person] = 0;
  });

  items.forEach((item) => {
    if (item.consumers.length === 0) return;

    const split = item.price / item.consumers.length;
    item.consumers.forEach((person) => {
      totals[person] += split;
    });
  });

  const grandTotal = items
    .filter((item) => item.category !== "alcohol")
    .reduce((sum, item) => sum + item.price, 0);

  const assignedTotal = Object.values(totals).reduce((sum, value) => sum + value, 0);
  const difference = grandTotal - assignedTotal;

  summaryContainer.innerHTML = people.map((person) => `
    <div class="summary-row">
      <span>${person}</span>
      <strong>${formatEuro(totals[person])}</strong>
    </div>
  `).join("");

  grandTotalEl.textContent = formatEuro(grandTotal);
  assignedTotalEl.textContent = formatEuro(assignedTotal);
  differenceEl.textContent = formatEuro(difference);
}

document.getElementById("btnComunes").addEventListener("click", asignarComunesATodos);
document.getElementById("btnLimpiar").addEventListener("click", limpiarTodo);
document.getElementById("btnCopiar").addEventListener("click", copiarResumen);

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => setFiltro(btn.dataset.filter));
});

function copiarResumen() {
  const totals = {};
  people.forEach((person) => {
    totals[person] = 0;
  });

  items.forEach((item) => {
    if (item.category === "alcohol") return;
    if (item.consumers.length === 0) return;

    const split = item.price / item.consumers.length;
    item.consumers.forEach((person) => {
      totals[person] += split;
    });
  });

  const grandTotal = items
    .filter((item) => item.category !== "alcohol")
    .reduce((sum, item) => sum + item.price, 0);

  const texto = [
    "Reparto casa rural",
    "",
    ...people.map((person) => `${person}: ${formatEuro(totals[person])}`),
    "",
    `Total ticket: ${formatEuro(grandTotal)}`
  ].join("\n");

  navigator.clipboard.writeText(texto)
    .then(() => alert("Resumen copiado"))
    .catch(() => alert("No se pudo copiar automáticamente"));
}

function renderBalance(totals) {

  const balance = {};

  people.forEach(p => {
    const pagado = paid[p] || 0;
    const consumido = totals[p] || 0;
    balance[p] = pagado - consumido;
  });

  const balanceDiv = document.getElementById("balance");

  balanceDiv.innerHTML = people.map(p => `
    <div class="summary-row">
      <span>${p}</span>
      <strong>${formatEuro(balance[p])}</strong>
    </div>
  `).join("");
}

renderItems();
renderSummary();
renderBalance(totals);
