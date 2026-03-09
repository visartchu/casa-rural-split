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
const calcotsPeople = people.filter(p => p !== "Berni" && p !== "Vera");
const paid = {
  Vera: 23.23,
  Jordi: 2,
  Alvaro: 76.20,
  Berni: 5.50
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
  { id: 9, name: "SALSA CALÇOTS (4)", price: 11.20, category: "comun", consumers: [...calcotsPeople] },
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
  { id: 20, name: "ESTROPAJO", price: 2.00, category: "comun", consumers: [...people] },
  { id: 21, name: "HIELOS", price: 5.50, category: "comun", consumers: [...people] }
];

let filtroActual = "comun";

const itemsContainer = document.getElementById("items");
const paymentsDiv = document.getElementById("payments");
const summaryContainer = document.getElementById("summary");
const balanceDiv = document.getElementById("balance");
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

  if (filtro === "pagos") {
    itemsContainer.classList.add("hidden");
    paymentsDiv.classList.remove("hidden");
  } else {
    paymentsDiv.classList.add("hidden");
    itemsContainer.classList.remove("hidden");
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
  // No toca los comunes porque van fijos.
  renderItems();
  renderSummary();
}

function getFilteredItems() {
  if (filtroActual === "comun") {
    return items.filter((item) => item.category === "comun");
  }

  return [];
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
              ${formatEuro(item.price)} · ${formatEuro(porPersona)} por persona
            </div>
          </div>
        </div>

        <div class="meta">Repartido automáticamente entre todos</div>
      </div>
    `;
  }).join("");
}

function buildTotals() {
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

  return totals;
}

function renderBalance(totals) {
  const balance = {};

  people.forEach((person) => {
    const pagado = paid[person] || 0;
    const consumido = totals[person] || 0;
    balance[person] = +(pagado - consumido).toFixed(2);
  });

  balanceDiv.innerHTML = people.map((person) => `
    <div class="summary-row">
      <span>${person}</span>
      <strong>${formatEuro(balance[person])}</strong>
    </div>
  `).join("");
}

function renderPayments(totals) {
  const debtors = [];
  const creditors = [];

  people.forEach((person) => {
    const pagado = paid[person] || 0;
    const consumido = totals[person] || 0;
    const balance = +(pagado - consumido).toFixed(2);

    if (balance < -0.009) {
      debtors.push({
        name: person,
        amount: +Math.abs(balance).toFixed(2)
      });
    } else if (balance > 0.009) {
      creditors.push({
        name: person,
        amount: +balance.toFixed(2)
      });
    }
  });

  const payments = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(debtor.amount, creditor.amount);
    const roundedAmount = +amount.toFixed(2);

    if (roundedAmount > 0) {
      payments.push({
        from: debtor.name,
        to: creditor.name,
        amount: roundedAmount
      });

      debtor.amount = +(debtor.amount - roundedAmount).toFixed(2);
      creditor.amount = +(creditor.amount - roundedAmount).toFixed(2);
    }

    if (debtor.amount <= 0.009) i++;
    if (creditor.amount <= 0.009) j++;
  }

  if (payments.length === 0) {
    paymentsDiv.innerHTML = `
      <div class="payment-row">
        <span>No hay pagos pendientes</span>
        <strong>0,00 €</strong>
      </div>
    `;
    return;
  }

  paymentsDiv.innerHTML = payments.map((payment) => `
    <div class="payment-row">
      <span>${payment.from} paga a ${payment.to}</span>
      <strong>${formatEuro(payment.amount)}</strong>
    </div>
  `).join("");
}

function renderSummary() {
  const totals = buildTotals();

  const grandTotal = items.reduce((sum, item) => sum + item.price, 0);
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

  renderBalance(totals);
  renderPayments(totals);
}

function copiarResumen() {
  const totals = buildTotals();

  const debtors = [];
  const creditors = [];

  people.forEach((person) => {
    const pagado = paid[person] || 0;
    const consumido = totals[person] || 0;
    const balance = +(pagado - consumido).toFixed(2);

    if (balance < -0.009) {
      debtors.push({
        name: person,
        amount: +Math.abs(balance).toFixed(2)
      });
    } else if (balance > 0.009) {
      creditors.push({
        name: person,
        amount: +balance.toFixed(2)
      });
    }
  });

  const payments = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(debtor.amount, creditor.amount);
    const roundedAmount = +amount.toFixed(2);

    if (roundedAmount > 0) {
      payments.push(`${debtor.name} paga a ${creditor.name}: ${formatEuro(roundedAmount)}`);
      debtor.amount = +(debtor.amount - roundedAmount).toFixed(2);
      creditor.amount = +(creditor.amount - roundedAmount).toFixed(2);
    }

    if (debtor.amount <= 0.009) i++;
    if (creditor.amount <= 0.009) j++;
  }

  const grandTotal = items.reduce((sum, item) => sum + item.price, 0);

  const texto = [
    "Reparto casa rural",
    "",
    "Resumen:",
    ...people.map((person) => `${person}: ${formatEuro(totals[person])}`),
    "",
    "Pagos:",
    ...payments,
    "",
    `Total ticket: ${formatEuro(grandTotal)}`
  ].join("\n");

  navigator.clipboard.writeText(texto)
    .then(() => alert("Resumen copiado"))
    .catch(() => alert("No se pudo copiar automáticamente"));
}

document.getElementById("btnComunes").addEventListener("click", asignarComunesATodos);
document.getElementById("btnLimpiar").addEventListener("click", limpiarTodo);
document.getElementById("btnCopiar").addEventListener("click", copiarResumen);

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => setFiltro(btn.dataset.filter));
});

renderItems();
renderSummary();
