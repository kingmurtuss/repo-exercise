const marketState = {
  USDT: 1,
  BTC: 68000,
  ETH: 3400,
  SOL: 160,
  BNB: 610
};

const portfolio = {
  cash: 10000,
  positions: {}
};

const pairSelect = document.getElementById('pair');
const tickersEl = document.getElementById('tickers');
const positionsEl = document.getElementById('positions');
const equityEl = document.getElementById('equity');
const pnlEl = document.getElementById('dailyPnL');
const openCountEl = document.getElementById('openCount');

Object.keys(marketState).filter(s => s !== 'USDT').forEach(sym => {
  const op = document.createElement('option');
  op.value = sym;
  op.textContent = `${sym}/USDT`;
  pairSelect.appendChild(op);
});

function renderTickers() {
  tickersEl.innerHTML = '';
  for (const [sym, px] of Object.entries(marketState)) {
    if (sym === 'USDT') continue;
    const row = document.createElement('div');
    row.className = 'ticker';
    const delta = (Math.random() * 2 - 1).toFixed(2);
    row.innerHTML = `<span>${sym}/USDT</span><strong>$${px.toFixed(2)}</strong><span class="${delta >= 0 ? 'up' : 'down'}">${delta}%</span>`;
    tickersEl.appendChild(row);
  }
}

function portfolioValue() {
  let value = portfolio.cash;
  for (const [sym, pos] of Object.entries(portfolio.positions)) {
    value += pos.qty * marketState[sym];
  }
  return value;
}

function renderPortfolio() {
  positionsEl.innerHTML = '';
  let rows = 0;
  for (const [sym, pos] of Object.entries(portfolio.positions)) {
    if (pos.qty <= 0) continue;
    rows++;
    const value = pos.qty * marketState[sym];
    const pl = value - (pos.qty * pos.avg);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${sym}</td><td>${pos.qty.toFixed(5)}</td><td>$${pos.avg.toFixed(2)}</td><td>$${value.toFixed(2)}</td><td class="${pl >= 0 ? 'up' : 'down'}">$${pl.toFixed(2)}</td>`;
    positionsEl.appendChild(tr);
  }
  if (!rows) {
    positionsEl.innerHTML = '<tr><td colspan="5">No open positions yet.</td></tr>';
  }

  const eq = portfolioValue();
  const pnl = eq - 10000;
  equityEl.textContent = `$${eq.toFixed(2)}`;
  pnlEl.textContent = `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`;
  pnlEl.className = pnl >= 0 ? 'up' : 'down';
  openCountEl.textContent = rows;
}

document.getElementById('tradeForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const sym = pairSelect.value;
  const side = document.getElementById('side').value;
  const amount = Number(document.getElementById('amount').value);
  const price = marketState[sym];
  const qty = amount / price;

  portfolio.positions[sym] ||= { qty: 0, avg: price };
  const pos = portfolio.positions[sym];

  if (side === 'buy') {
    if (portfolio.cash < amount) return alert('Not enough USDT balance.');
    const newQty = pos.qty + qty;
    pos.avg = ((pos.qty * pos.avg) + (qty * price)) / newQty;
    pos.qty = newQty;
    portfolio.cash -= amount;
  } else {
    if (pos.qty < qty) return alert('Not enough asset quantity to sell.');
    pos.qty -= qty;
    portfolio.cash += amount;
  }

  renderPortfolio();
});

function randomMove() {
  for (const sym of Object.keys(marketState)) {
    if (sym === 'USDT') continue;
    marketState[sym] *= (1 + ((Math.random() - 0.5) * 0.015));
  }
}

function refreshAI() {
  const signal = document.getElementById('aiSignal');
  const sym = pairSelect.value;
  const momentum = (Math.random() * 2 - 1) * 100;
  const action = momentum > 20 ? 'Bullish bias: consider scaling in.' : momentum < -20 ? 'Bearish pressure: reduce exposure.' : 'Neutral setup: wait for confirmation.';
  signal.textContent = `${sym}/USDT signal: ${action} Momentum score ${momentum.toFixed(1)}.`;
}

document.getElementById('refreshAi').addEventListener('click', refreshAI);
document.getElementById('connectBtn').addEventListener('click', (e) => {
  e.target.textContent = 'Connected';
  e.target.disabled = true;
});

setInterval(() => { randomMove(); renderTickers(); renderPortfolio(); }, 2500);
renderTickers();
renderPortfolio();
refreshAI();
