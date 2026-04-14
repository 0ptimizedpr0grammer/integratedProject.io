Chart.defaults.color          = '#8892a4';
Chart.defaults.borderColor    = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family    = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size      = 12;

const C = { green: '#4ade80', blue: '#60a5fa', yellow: '#fbbf24', red: '#f87171', purple: '#c084fc' };

let _trend = null, _zone = null, _ring = null;

function renderTrend(id, rows) {
  _trend?.destroy();
  const ctx = document.getElementById(id)?.getContext('2d');
  if (!ctx) return;
  _trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: rows.map(r => r.date),
      datasets: [{
        data: rows.map(r => r.total_waste_kg),
        borderColor: C.green, backgroundColor: 'rgba(74,222,128,0.07)',
        fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => v >= 1000 ? (v/1000).toFixed(1)+'k' : v } }
      }
    }
  });
}

function renderZones(id, rows) {
  _zone?.destroy();
  const ctx = document.getElementById(id)?.getContext('2d');
  if (!ctx) return;
  const s = [...rows].sort((a,b) => b.total_waste_kg - a.total_waste_kg).slice(0, 7);
  _zone = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: s.map(r => r.zone_name),
      datasets: [
        { label: 'Total (kg)',    data: s.map(r => r.total_waste_kg),    backgroundColor: 'rgba(96,165,250,0.75)', borderRadius: 4, borderSkipped: false },
        { label: 'Recycled (kg)', data: s.map(r => r.total_recycled_kg), backgroundColor: 'rgba(74,222,128,0.75)', borderRadius: 4, borderSkipped: false },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => v >= 1000 ? (v/1000).toFixed(1)+'k' : v } }
      }
    }
  });
}

function renderRing(id, data) {
  _ring?.destroy();
  const ctx = document.getElementById(id)?.getContext('2d');
  if (!ctx) return;
  _ring = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Recycled', 'Landfill'],
      datasets: [{ data: [data.recycled_kg, data.landfill_kg], backgroundColor: [C.green, 'rgba(248,113,113,0.7)'], borderWidth: 0, hoverOffset: 4 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '72%',
      plugins: { legend: { position: 'bottom' } }
    }
  });
}