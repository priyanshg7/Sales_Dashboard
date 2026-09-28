// ==========================================================================
// ENTERPRISE POWER BI SALES DASHBOARD SIMULATION SCRIPT
// ==========================================================================

let rawSalesData = [];
let filteredData = [];
let charts = {};

// Slicer Elements
const filterYear = document.getElementById("filterYear");
const filterRegion = document.getElementById("filterRegion");
const filterCategory = document.getElementById("filterCategory");
const filterSegment = document.getElementById("filterSegment");
const resetBtn = document.getElementById("resetFilters");
const themeToggle = document.getElementById("themeToggle");
const productSearch = document.getElementById("productSearch");

// Nav Page Tabs
const navItems = document.querySelectorAll(".nav-item");
const pageViews = document.querySelectorAll(".page-view");
const pageHeading = document.getElementById("pageHeading");
const pageSubHeading = document.getElementById("pageSubHeading");

const pageHeaders = {
  "page-overview": {
    title: "Executive Overview Dashboard",
    sub: "Real-time transactional sales, profit velocity, and regional trends"
  },
  "page-products": {
    title: "Product Performance & Profitability",
    sub: "Quadrant margin matrix, category breakdown, and SKU catalog financial health"
  },
  "page-regional": {
    title: "Regional & Geographic Performance",
    sub: "Territory sales revenue, shipping speed SLAs, and regional manager benchmarks"
  },
  "page-customers": {
    title: "Customer & Segment Insights",
    sub: "Enterprise vs consumer cohorts, tier contributions, and high-value accounts"
  }
};

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
  await loadData();
});

// Load Dataset
async function loadData() {
  try {
    const response = await fetch("sales_data.json");
    rawSalesData = await response.json();
    applyFilters();
  } catch (error) {
    console.error("Error loading sales_data.json:", error);
  }
}

// Event Listeners
function setupEventListeners() {
  // Navigation Tabs
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(n => n.classList.remove("active"));
      pageViews.forEach(p => p.classList.remove("active"));

      item.classList.add("active");
      const pageId = item.getAttribute("data-page");
      const targetPage = document.getElementById(pageId);
      if (targetPage) targetPage.classList.add("active");

      // Update Header Text
      if (pageHeaders[pageId]) {
        pageHeading.textContent = pageHeaders[pageId].title;
        pageSubHeading.textContent = pageHeaders[pageId].sub;
      }

      // Re-render visible charts to avoid canvas resize artifacts
      setTimeout(updateAllCharts, 100);
    });
  });

  // Filter Changes
  [filterYear, filterRegion, filterCategory, filterSegment].forEach(slicer => {
    slicer.addEventListener("change", applyFilters);
  });

  // Reset Slicers
  resetBtn.addEventListener("click", () => {
    filterYear.value = "All";
    filterRegion.value = "All";
    filterCategory.value = "All";
    filterSegment.value = "All";
    applyFilters();
  });

  // Theme Toggle
  themeToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
    updateAllCharts();
  });

  // Product Table Search
  if (productSearch) {
    productSearch.addEventListener("input", (e) => {
      renderProductTable(e.target.value.toLowerCase());
    });
  }
}

// Slicer Filter Engine
function applyFilters() {
  const yr = filterYear.value;
  const reg = filterRegion.value;
  const cat = filterCategory.value;
  const seg = filterSegment.value;

  filteredData = rawSalesData.filter(d => {
    if (yr !== "All" && d.yr !== parseInt(yr)) return false;
    if (reg !== "All" && d.reg !== reg) return false;
    if (cat !== "All" && d.cat !== cat) return false;
    if (seg !== "All" && d.seg !== seg) return false;
    return true;
  });

  updateKPICards();
  updateAllCharts();
  renderProductTable();
  renderRegionalManagers();
  renderCustomerTable();
}

// KPI Ribbon Calculation
function updateKPICards() {
  const totalSales = filteredData.reduce((acc, cur) => acc + cur.sales, 0);
  const totalProfit = filteredData.reduce((acc, cur) => acc + cur.profit, 0);
  const totalUnits = filteredData.reduce((acc, cur) => acc + cur.qty, 0);
  const orderSet = new Set(filteredData.map(d => d.id));
  const custSet = new Set(filteredData.map(d => d.cust));
  const totalOrders = orderSet.size;
  const totalCustomers = custSet.size;

  const profitMarginPct = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
  const aov = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  const avgShippingDays = filteredData.length > 0 
    ? filteredData.reduce((acc, cur) => acc + cur.shipDays, 0) / filteredData.length 
    : 0;
  
  const returnsCount = filteredData.filter(d => d.ret === "Yes").length;
  const returnRate = filteredData.length > 0 ? (returnsCount / filteredData.length) * 100 : 0;

  // Format Display
  document.getElementById("kpiSales").textContent = formatCurrency(totalSales);
  document.getElementById("kpiProfit").textContent = formatCurrency(totalProfit);
  document.getElementById("kpiProfitMargin").innerHTML = `<i class="fa-solid fa-percent"></i> ${profitMarginPct.toFixed(1)}% Margin`;
  document.getElementById("kpiOrders").textContent = formatNumber(totalOrders);
  document.getElementById("kpiUnits").innerHTML = `<i class="fa-solid fa-box-open"></i> ${formatNumber(totalUnits)} Units Sold`;
  document.getElementById("kpiAov").textContent = formatCurrency(aov);
  document.getElementById("kpiCustCount").innerHTML = `<i class="fa-solid fa-user-check"></i> ${formatNumber(totalCustomers)} Customers`;
  document.getElementById("kpiShipping").textContent = `${avgShippingDays.toFixed(1)} Days`;
  document.getElementById("kpiReturnRate").innerHTML = `<i class="fa-solid fa-arrow-rotate-left"></i> ${returnRate.toFixed(1)}% Returns`;
}

// Formatters
function formatCurrency(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
  return `$${val.toFixed(2)}`;
}

function formatNumber(val) {
  return new Intl.NumberFormat().format(val);
}

// Chart Engine
function getChartColors() {
  const isDark = document.body.classList.contains("dark-theme");
  return {
    text: isDark ? "#94A3B8" : "#475569",
    grid: isDark ? "rgba(51, 65, 85, 0.4)" : "rgba(226, 232, 240, 0.8)",
    primary: "#4361EE",
    secondary: "#4CC9F0",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    purple: "#8B5CF6",
    pink: "#EC4899"
  };
}

function updateAllCharts() {
  const c = getChartColors();

  renderMonthlyTrendChart(c);
  renderCategoryDonutChart(c);
  renderTopSubcatsChart(c);
  renderChannelsChart(c);
  renderProductScatterChart(c);
  renderSubcatMarginChart(c);
  renderRegionalSalesChart(c);
  renderShippingModesChart(c);
  renderSegmentBreakdownChart(c);
  renderTierDonutChart(c);
}

// 1. Monthly Revenue & Profit Trend
function renderMonthlyTrendChart(c) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const salesByMonth = new Array(12).fill(0);
  const profitByMonth = new Array(12).fill(0);

  filteredData.forEach(d => {
    const monthIdx = new Date(d.date).getMonth();
    salesByMonth[monthIdx] += d.sales;
    profitByMonth[monthIdx] += d.profit;
  });

  const ctx = document.getElementById("chartMonthlyTrend");
  if (!ctx) return;
  if (charts.monthlyTrend) charts.monthlyTrend.destroy();

  charts.monthlyTrend = new Chart(ctx, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Total Sales",
          data: salesByMonth,
          backgroundColor: "rgba(67, 97, 238, 0.7)",
          borderColor: "#4361EE",
          borderWidth: 1,
          borderRadius: 6,
          yAxisID: "y"
        },
        {
          label: "Net Profit",
          data: profitByMonth,
          type: "line",
          borderColor: "#10B981",
          backgroundColor: "#10B981",
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: "y"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
          }
        }
      },
      scales: {
        x: { grid: { color: c.grid }, ticks: { color: c.text } },
        y: { grid: { color: c.grid }, ticks: { color: c.text, callback: (v) => formatCurrency(v) } }
      }
    }
  });
}

// 2. Category Donut
function renderCategoryDonutChart(c) {
  const catSales = {};
  filteredData.forEach(d => {
    catSales[d.cat] = (catSales[d.cat] || 0) + d.sales;
  });

  const labels = Object.keys(catSales);
  const data = Object.values(catSales);

  const ctx = document.getElementById("chartCategoryDonut");
  if (!ctx) return;
  if (charts.categoryDonut) charts.categoryDonut.destroy();

  charts.categoryDonut = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ["#4361EE", "#F59E0B", "#10B981", "#8B5CF6"],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: c.text, boxWidth: 12, font: { size: 11 } } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.raw)}`
          }
        }
      },
      cutout: "68%"
    }
  });
}

// 3. Top 5 Subcategories Bar Chart
function renderTopSubcatsChart(c) {
  const subSales = {};
  filteredData.forEach(d => {
    subSales[d.sub] = (subSales[d.sub] || 0) + d.sales;
  });

  const sorted = Object.entries(subSales).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const labels = sorted.map(s => s[0]);
  const data = sorted.map(s => s[1]);

  const ctx = document.getElementById("chartTopSubcats");
  if (!ctx) return;
  if (charts.topSubcats) charts.topSubcats.destroy();

  charts.topSubcats = new Chart(ctx, {
    type: "bar",
    indexAxis: "y",
    data: {
      labels,
      datasets: [{
        label: "Revenue",
        data,
        backgroundColor: "rgba(76, 201, 240, 0.75)",
        borderColor: "#4CC9F0",
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => `Revenue: ${formatCurrency(ctx.raw)}` } }
      },
      scales: {
        x: { grid: { color: c.grid }, ticks: { color: c.text, callback: (v) => formatCurrency(v) } },
        y: { grid: { display: false }, ticks: { color: c.text } }
      }
    }
  });
}

// 4. Channels Breakdown
function renderChannelsChart(c) {
  const chanSales = {};
  filteredData.forEach(d => {
    chanSales[d.chan] = (chanSales[d.chan] || 0) + d.sales;
  });

  const labels = Object.keys(chanSales);
  const data = Object.values(chanSales);

  const ctx = document.getElementById("chartChannels");
  if (!ctx) return;
  if (charts.channels) charts.channels.destroy();

  charts.channels = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Sales",
        data,
        backgroundColor: "rgba(139, 92, 246, 0.75)",
        borderColor: "#8B5CF6",
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => `Sales: ${formatCurrency(ctx.raw)}` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: c.text } },
        y: { grid: { color: c.grid }, ticks: { color: c.text, callback: (v) => formatCurrency(v) } }
      }
    }
  });
}

// 5. Product Margin Scatter
function renderProductScatterChart(c) {
  const prodAgg = {};
  filteredData.forEach(d => {
    if (!prodAgg[d.prod]) {
      prodAgg[d.prod] = { sales: 0, profit: 0, cat: d.cat, qty: 0 };
    }
    prodAgg[d.prod].sales += d.sales;
    prodAgg[d.prod].profit += d.profit;
    prodAgg[d.prod].qty += d.qty;
  });

  const scatterData = Object.keys(prodAgg).map(name => {
    const p = prodAgg[name];
    const margin = p.sales > 0 ? (p.profit / p.sales) * 100 : 0;
    return {
      x: p.sales,
      y: margin,
      r: Math.min(Math.max(p.qty / 50, 4), 16),
      name,
      cat: p.cat
    };
  });

  const ctx = document.getElementById("chartProductScatter");
  if (!ctx) return;
  if (charts.productScatter) charts.productScatter.destroy();

  charts.productScatter = new Chart(ctx, {
    type: "bubble",
    data: {
      datasets: [{
        label: "SKUs",
        data: scatterData,
        backgroundColor: "rgba(67, 97, 238, 0.65)",
        borderColor: "#4CC9F0"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const raw = ctx.raw;
              return `${raw.name}: Sales ${formatCurrency(raw.x)}, Margin ${raw.y.toFixed(1)}%`;
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: "Total Revenue ($)", color: c.text },
          grid: { color: c.grid },
          ticks: { color: c.text, callback: (v) => formatCurrency(v) }
        },
        y: {
          title: { display: true, text: "Profit Margin %", color: c.text },
          grid: { color: c.grid },
          ticks: { color: c.text, callback: (v) => `${v}%` }
        }
      }
    }
  });
}

// 6. Subcategory Margin
function renderSubcatMarginChart(c) {
  const subAgg = {};
  filteredData.forEach(d => {
    if (!subAgg[d.sub]) subAgg[d.sub] = { sales: 0, profit: 0 };
    subAgg[d.sub].sales += d.sales;
    subAgg[d.sub].profit += d.profit;
  });

  const labels = Object.keys(subAgg);
  const data = labels.map(sub => {
    const s = subAgg[sub];
    return s.sales > 0 ? (s.profit / s.sales) * 100 : 0;
  });

  const ctx = document.getElementById("chartSubcatMargin");
  if (!ctx) return;
  if (charts.subcatMargin) charts.subcatMargin.destroy();

  charts.subcatMargin = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Profit Margin %",
        data,
        backgroundColor: "rgba(16, 185, 129, 0.75)",
        borderColor: "#10B981",
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => `Margin: ${ctx.raw.toFixed(1)}%` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: c.text } },
        y: { grid: { color: c.grid }, ticks: { color: c.text, callback: (v) => `${v}%` } }
      }
    }
  });
}

// 7. Regional Sales
function renderRegionalSalesChart(c) {
  const regSales = {};
  filteredData.forEach(d => {
    regSales[d.reg] = (regSales[d.reg] || 0) + d.sales;
  });

  const labels = Object.keys(regSales);
  const data = Object.values(regSales);

  const ctx = document.getElementById("chartRegionalSales");
  if (!ctx) return;
  if (charts.regionalSales) charts.regionalSales.destroy();

  charts.regionalSales = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Revenue",
        data,
        backgroundColor: ["#4361EE", "#3A0CA3", "#4CC9F0", "#7209B7", "#06D6A0", "#FFD166", "#EF476F"],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => `Revenue: ${formatCurrency(ctx.raw)}` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: c.text } },
        y: { grid: { color: c.grid }, ticks: { color: c.text, callback: (v) => formatCurrency(v) } }
      }
    }
  });
}

// 8. Shipping Modes
function renderShippingModesChart(c) {
  const shipSales = {};
  filteredData.forEach(d => {
    shipSales[d.ship] = (shipSales[d.ship] || 0) + d.sales;
  });

  const labels = Object.keys(shipSales);
  const data = Object.values(shipSales);

  const ctx = document.getElementById("chartShippingModes");
  if (!ctx) return;
  if (charts.shippingModes) charts.shippingModes.destroy();

  charts.shippingModes = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ["#4361EE", "#4CC9F0", "#F59E0B", "#10B981"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: c.text, boxWidth: 12 } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.raw)}` } }
      }
    }
  });
}

// 9. Customer Segment Breakdown
function renderSegmentBreakdownChart(c) {
  const segAgg = {};
  filteredData.forEach(d => {
    if (!segAgg[d.seg]) segAgg[d.seg] = { sales: 0, profit: 0 };
    segAgg[d.seg].sales += d.sales;
    segAgg[d.seg].profit += d.profit;
  });

  const labels = Object.keys(segAgg);
  const salesData = labels.map(s => segAgg[s].sales);
  const profitData = labels.map(s => segAgg[s].profit);

  const ctx = document.getElementById("chartSegmentBreakdown");
  if (!ctx) return;
  if (charts.segmentBreakdown) charts.segmentBreakdown.destroy();

  charts.segmentBreakdown = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Sales",
          data: salesData,
          backgroundColor: "rgba(67, 97, 238, 0.8)",
          borderRadius: 6
        },
        {
          label: "Profit",
          data: profitData,
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: c.text } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: c.text } },
        y: { grid: { color: c.grid }, ticks: { color: c.text, callback: (v) => formatCurrency(v) } }
      }
    }
  });
}

// 10. Customer Tier Donut
function renderTierDonutChart(c) {
  const tierSales = {};
  filteredData.forEach(d => {
    tierSales[d.tier] = (tierSales[d.tier] || 0) + d.sales;
  });

  const labels = ["Platinum", "Gold", "Silver", "Bronze"].filter(t => tierSales[t] !== undefined);
  const data = labels.map(t => tierSales[t]);

  const ctx = document.getElementById("chartTierDonut");
  if (!ctx) return;
  if (charts.tierDonut) charts.tierDonut.destroy();

  charts.tierDonut = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ["#EC4899", "#F59E0B", "#94A3B8", "#D97706"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: c.text, boxWidth: 12 } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.raw)}` } }
      },
      cutout: "60%"
    }
  });
}

// Tables Renderers
function renderProductTable(searchTerm = "") {
  const tbody = document.getElementById("productTableBody");
  if (!tbody) return;

  const prodAgg = {};
  filteredData.forEach(d => {
    if (!prodAgg[d.prod]) {
      prodAgg[d.prod] = {
        name: d.prod,
        cat: d.cat,
        sub: d.sub,
        qty: 0,
        price: d.price,
        sales: 0,
        profit: 0
      };
    }
    prodAgg[d.prod].qty += d.qty;
    prodAgg[d.prod].sales += d.sales;
    prodAgg[d.prod].profit += d.profit;
  });

  let list = Object.values(prodAgg);
  if (searchTerm) {
    list = list.filter(p => p.name.toLowerCase().includes(searchTerm) || p.cat.toLowerCase().includes(searchTerm));
  }

  list.sort((a, b) => b.sales - a.sales);

  tbody.innerHTML = list.slice(0, 20).map(p => {
    const margin = p.sales > 0 ? (p.profit / p.sales) * 100 : 0;
    const catClass = p.cat === "Technology" ? "badge-tech" : (p.cat === "Furniture" ? "badge-furn" : "badge-offc");
    const marginClass = margin >= 30 ? "margin-high" : (margin >= 15 ? "margin-med" : "margin-low");

    return `
      <tr>
        <td style="font-weight: 700; color: var(--text-primary);">${p.name}</td>
        <td><span class="badge-tag ${catClass}">${p.cat}</span></td>
        <td>${p.sub}</td>
        <td class="text-right">${formatNumber(p.qty)}</td>
        <td class="text-right">$${p.price.toFixed(2)}</td>
        <td class="text-right" style="font-weight:700;">${formatCurrency(p.sales)}</td>
        <td class="text-right">${formatCurrency(p.profit)}</td>
        <td class="text-right"><span class="margin-pill ${marginClass}">${margin.toFixed(1)}%</span></td>
      </tr>
    `;
  }).join("");
}

function renderRegionalManagers() {
  const container = document.getElementById("managerCardsContainer");
  if (!container) return;

  const managers = [
    { name: "Sarah Jenkins", reg: "East", market: "North America", avatar: "SJ" },
    { name: "David Chen", reg: "West", market: "North America", avatar: "DC" },
    { name: "Michael Roberts", reg: "Central", market: "North America", avatar: "MR" },
    { name: "Amanda Perez", reg: "South", market: "North America", avatar: "AP" },
    { name: "Oliver Smith", reg: "EMEA", market: "Europe", avatar: "OS" },
    { name: "Li Wei", reg: "APAC", market: "Asia Pacific", avatar: "LW" },
    { name: "Carlos Silva", reg: "LATAM", market: "Latin America", avatar: "CS" },
  ];

  const regSales = {};
  filteredData.forEach(d => {
    regSales[d.reg] = (regSales[d.reg] || 0) + d.sales;
  });

  container.innerHTML = managers.map(m => {
    const rev = regSales[m.reg] || 0;
    return `
      <div class="manager-card">
        <div class="manager-info">
          <div class="manager-avatar">${m.avatar}</div>
          <div class="manager-details">
            <h4>${m.name}</h4>
            <p>${m.reg} Region • ${m.market}</p>
          </div>
        </div>
        <div class="manager-stats">
          <div class="rev-val">${formatCurrency(rev)}</div>
          <div class="target-val">100% Attained</div>
        </div>
      </div>
    `;
  }).join("");
}

function renderCustomerTable() {
  const tbody = document.getElementById("customerTableBody");
  if (!tbody) return;

  const custAgg = {};
  filteredData.forEach(d => {
    if (!custAgg[d.cust]) {
      custAgg[d.cust] = {
        name: d.cust,
        seg: d.seg,
        tier: d.tier,
        loc: `${d.city}, ${d.st}`,
        reg: d.reg,
        orders: new Set(),
        spent: 0,
        profit: 0
      };
    }
    custAgg[d.cust].orders.add(d.id);
    custAgg[d.cust].spent += d.sales;
    custAgg[d.cust].profit += d.profit;
  });

  const list = Object.values(custAgg).map(c => ({
    ...c,
    orderCount: c.orders.size,
    aov: c.orders.size > 0 ? c.spent / c.orders.size : 0
  })).sort((a, b) => b.spent - a.spent).slice(0, 15);

  tbody.innerHTML = list.map(c => {
    let tierBadge = "badge-tier-bron";
    if (c.tier === "Platinum") tierBadge = "badge-tier-plat";
    else if (c.tier === "Gold") tierBadge = "badge-tier-gold";
    else if (c.tier === "Silver") tierBadge = "badge-tier-silv";

    return `
      <tr>
        <td style="font-weight: 700; color: var(--text-primary);">${c.name}</td>
        <td>${c.seg}</td>
        <td><span class="badge-tag ${tierBadge}">${c.tier}</span></td>
        <td>${c.loc}</td>
        <td>${c.reg}</td>
        <td class="text-right">${c.orderCount}</td>
        <td class="text-right" style="font-weight: 700; color: var(--accent-secondary);">${formatCurrency(c.spent)}</td>
        <td class="text-right">${formatCurrency(c.profit)}</td>
        <td class="text-right">${formatCurrency(c.aov)}</td>
      </tr>
    `;
  }).join("");
}
