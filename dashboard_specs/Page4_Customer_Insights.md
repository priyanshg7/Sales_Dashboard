# Dashboard Specification: Page 4 - Customer & Segment Analytics

## 🎯 Objective
Analyze customer segmentation behavior, identify high-value enterprise accounts, evaluate repeat purchase frequency, and understand revenue concentration across customer tiers.

---

## 📐 Layout Wireframe (16:9 Canvas)

```
+--------------------------------------------------------------------------------------------------+
| [Header] CUSTOMER SEGMENTATION & RETENTION COHORTS             [Slicers: Customer Tier | Segment] |
+--------------------------------------------------------------------------------------------------+
| [KPI: Total Customers] [KPI: Repeat Order Rate] [KPI: Revenue / Customer] [KPI: Top Tier Share]  |
| 600 Accounts           64.2% Repeat Rate        $6,416 per Account        42.8% by Platinum/Gold |
+--------------------------------------------------------------------------------------------------+
| [Segment Sales & Profit Breakdown (Donut + Bars)]        | [Customer Tier Distribution (Pyramid)]|
| - Legend: Dim_Customer[Segment]                          | - Tier: Platinum, Gold, Silver, Bronze|
| - Comparison: Sales vs Profit Contribution               | - Metric: Customer Count vs Revenue   |
+--------------------------------------------------------------------------------------------------+
| [Top 10 High-Value Customers (Interactive Matrix with Drillthrough to Order History)]           |
| - Customer Name | Segment | Tier | Total Orders | Total Spent | Profit Contributed | AOV         |
+--------------------------------------------------------------------------------------------------+
```

---

## 🛠️ Visual Configurations & Fields

### 1. Customer Segment Analysis
- **Visual Type**: Clustered Column & Line Chart
- **X-Axis**: `Dim_Customer[Segment]`
- **Column Value**: `_Measures[Total Sales]`
- **Line Value**: `_Measures[Profit Margin %]`
- **Data Labels**: Position = Outside End

### 2. Tier Concentration (Pareto Chart)
- **Visual Type**: Line & Stacked Column
- **X-Axis**: `Dim_Customer[CustomerTier]` (Ordered Platinum -> Gold -> Silver -> Bronze)
- **Column Values**: `_Measures[Total Sales]`
- **Line Value**: Cumulative % of Revenue (DAX Pareto measure)

### 3. Top 10 Accounts Leaderboard Table
- **Columns**:
  - `Dim_Customer[CustomerName]`
  - `Dim_Customer[Segment]`
  - `Dim_Customer[City]`, `Dim_Customer[State]`
  - `_Measures[Total Orders]`
  - `_Measures[Total Sales]`
  - `_Measures[Total Profit]`
  - `_Measures[Average Order Value]`
- **Drillthrough Target**: Right click customer -> Navigate to detailed Order Transaction Log.
