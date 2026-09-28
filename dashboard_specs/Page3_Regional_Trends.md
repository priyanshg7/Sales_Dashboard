# Dashboard Specification: Page 3 - Regional & Geographic Trends

## 🎯 Objective
Enable VP of Sales and regional managers to track geographic revenue distribution, identify high-growth territories, monitor shipping SLA times, and benchmark regional sales targets.

---

## 📐 Layout Wireframe (16:9 Canvas)

```
+--------------------------------------------------------------------------------------------------+
| [Header] REGIONAL & GEOGRAPHIC SALES PERFORMANCE            [Slicers: Market | Ship Mode | Year] |
+--------------------------------------------------------------------------------------------------+
| [KPI: Top Region]    [KPI: Target Met %]    [KPI: Avg Shipping Time] [KPI: On-Time Delivery %]  |
| West ($1.12M)        104.8% of Target       4.2 Days (-0.6d YoY)     96.2% SLA Met              |
+--------------------------------------------------------------------------------------------------+
| [Geographic Revenue Map (Filled Map / Bubble Map)]       | [Regional Manager Benchmark (Bar)]    |
| - Location: Dim_Customer[State] / [Country]              | - Y-Axis: Dim_Region[RegionalManager] |
| - Bubble Size: [Total Sales]                             | - Bar Value: [Total Sales]            |
| - Color Saturation: [Profit Margin %]                    | - Target Marker: [Sales Target]       |
+--------------------------------------------------------------------------------------------------+
| [Shipping Mode & SLA Duration Breakdown]                 | [Regional YoY Growth Comparison]      |
| - Columns: Fact_Sales[ShipMode]                          | - X-Axis: Dim_Region[Region]          |
| - Metric: [Total Orders] & [Avg Shipping Days]           | - Y-Axis: [Sales YoY Growth %]        |
+--------------------------------------------------------------------------------------------------+
```

---

## 🛠️ Visual Configurations & Fields

### 1. Geographic Map
- **Visual Type**: Map / Filled Shape Map / Azure Map
- **Location**: `Dim_Customer[State]` (Data Category set to *State or Province*)
- **Bubble Size**: `_Measures[Total Sales]`
- **Color Category**: `_Measures[Profit Margin %]` (Diverging gradient)
- **Tooltip**: `Dim_Customer[City]`, `_Measures[Total Sales]`, `_Measures[Total Profit]`, `_Measures[Total Orders]`

### 2. Regional Leaderboard & Target Benchmark
- **Visual Type**: Clustered Bar Chart with Target Lines (or Bullet Chart visual)
- **Y-Axis**: `Dim_Region[Region]`
- **X-Axis**: `_Measures[Total Sales]`
- **Tooltips**: `_Measures[Target Achievement %]`, `Dim_Region[RegionalManager]`
- **Data Labels**: Enabled (Formatted as `$#,##0`)

### 3. Shipping Mode & Delivery Logistics
- **Visual Type**: Ribbon Chart / Stacked Column Chart
- **X-Axis**: `Dim_Date[Quarter]`
- **Y-Axis**: `_Measures[Total Orders]`
- **Legend**: `Fact_Sales[ShipMode]`
- **Secondary Card**: Average delivery days gauge with benchmark of 5.0 days.
