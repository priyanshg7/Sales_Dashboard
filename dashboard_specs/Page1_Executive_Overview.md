# Dashboard Specification: Page 1 - Executive Overview

## 🎯 Objective
Provide C-suite executives and sales leadership with a high-level summary of total revenue, profit margins, order velocity, and overall company performance against previous year targets.

---

## 📐 Layout Wireframe (16:9 Canvas - 1280 x 720 px)

```
+--------------------------------------------------------------------------------------------------+
| [Header] SALES PERFORMANCE EXECUTIVE OVERVIEW                [Slicers: Year | Region | Segment] |
+--------------------------------------------------------------------------------------------------+
| [KPI: Total Sales]    [KPI: Total Profit]    [KPI: Profit Margin %]  [KPI: Total Orders]  [KPI: AOV]  |
| $3.85M (+14.2% YoY)   $1.18M (30.6% Margin)  30.6% (+1.8% pts)       12,000 orders        $320.80    |
+--------------------------------------------------------------------------------------------------+
| [Monthly Sales & Profit Trend (Line & Clustered Column)] | [Sales by Category (Donut Chart)]     |
| - X-Axis: Dim_Date[MonthShort]                           | - Legend: Dim_Product[Category]       |
| - Column: [Total Sales]                                  | - Values: [Total Sales]               |
| - Line: [Total Profit]                                   | - Tooltip: [Profit Margin %]          |
| - Target Line: [Sales PY]                                |                                       |
+--------------------------------------------------------------------------------------------------+
| [Top 5 Sub-Categories by Revenue (Bar Chart)]            | [Sales Channel Performance (Treemap)] |
| - Y-Axis: Dim_Product[SubCategory]                       | - Group: Fact_Sales[SalesChannel]     |
| - X-Axis: [Total Sales]                                  | - Values: [Total Sales]               |
| - Data Labels: On                                        | - Color Saturation: [Profit Margin %] |
+--------------------------------------------------------------------------------------------------+
```

---

## 🛠️ Visual Configurations & Fields

### 1. Global Slicer Bar (Top)
- **Year Slicer**: `Dim_Date[Year]` (Tile / Horizontal button style)
- **Region Slicer**: `Dim_Region[Region]` (Dropdown with multi-select)
- **Customer Segment Slicer**: `Dim_Customer[Segment]` (Dropdown)

### 2. Executive KPI Ribbon (Top Row)
1. **Total Sales Card**:
   - Field: `_Measures[Total Sales]`
   - Callout Value: `$3.85M`, Display Units: Auto
   - Subtitle / Indicator: `_Measures[Sales YoY Growth %]` (Green for positive, Red for negative)
2. **Total Profit Card**:
   - Field: `_Measures[Total Profit]`
   - Callout Value: `$1.18M`
3. **Profit Margin % Card**:
   - Field: `_Measures[Profit Margin %]`
   - Callout Value: `30.6%`
4. **Total Orders Card**:
   - Field: `_Measures[Total Orders]`
   - Callout Value: `12,000`
5. **Average Order Value Card**:
   - Field: `_Measures[Average Order Value]`
   - Callout Value: `$320.80`

### 3. Monthly Revenue & Profit Trend
- **Visual Type**: Line and Clustered Column Chart
- **Shared X-Axis**: `Dim_Date[MonthShort]` (Sorted by `Dim_Date[MonthNo]`)
- **Column Values**: `_Measures[Total Sales]` (Theme Blue `#4361EE`)
- **Line Values**: `_Measures[Total Profit]` (Emerald Green `#06D6A0`)
- **Secondary Line**: `_Measures[Sales PY]` (Dashed Grey `#94A3B8`)

### 4. Category Contribution
- **Visual Type**: Donut Chart
- **Legend**: `Dim_Product[Category]`
- **Values**: `_Measures[Total Sales]`
- **Detail Labels**: Category name + Percentage of Total

### 5. Top 5 Sub-Categories
- **Visual Type**: Clustered Bar Chart
- **Y-Axis**: `Dim_Product[SubCategory]`
- **X-Axis**: `_Measures[Total Sales]`
- **Filter**: Filter type = `Top N`, Show top = `5`, By value = `_Measures[Total Sales]`
