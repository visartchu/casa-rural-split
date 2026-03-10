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

function getConsumersList(item) {
  if (item.exclude && Array.isArray(item.exclude)) {
    return people.filter((p) => !item.exclude.includes(p));
  }

  if (item.consumers === "all") {
    return [...people];
  }

  if (Array.isArray(item.consumers)) {
    return item.consumers;
  }

  return [];
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
      delete item.exclude;
      item.consumers = "all";
    }
  });

  renderItems();
  renderSummary();
}

function limpiarTodo() {
  renderItems();
  renderSummary();
}

function getFilteredItems() {
  if (filtroActual === "comun") {
    return items.filter((item) => item.category === "comun");
  }

  if (filtroActual === "alcohol_viernes") {
    return items.filter((item) => item.category === "alcohol_viernes");
  }

  if (filtroActual === "alcohol_sabado") {
    return items.filter((item) => item.category === "alcohol_sabado");
  }

  return [];
}


function renderItems() {
  const filtered = getFilteredItems();

  itemsContainer.innerHTML = filtered.map((item) => {
    const consumersList = getConsumersList(item);
    const porPersona = consumersList.length > 0 ? item.price / consumersList.length : 0;
    const repartidoTexto =
      item.exclude && item.exclude.length > 0
        ? `Repartido entre ${consumersList.length} personas · Excluidos: ${item.exclude.join(", ")}`
        : `Repartido entre ${consumersList.length} personas`;

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

        <div class="meta">${repartidoTexto}</div>
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
    const consumersList = getConsumersList(item);
    if (!consumersList.length) return;

    const split = item.price / consumersList.length;
    consumersList.forEach((person) => {
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
