# Dashboard Specification: Page 2 - Product Performance & Profitability

## 🎯 Objective
Empower product managers and merchandising teams to evaluate category profit margins, identify underperforming loss-leaders, track discount elasticity, and drill into individual SKU sales.

---

## 📐 Layout Wireframe (16:9 Canvas)

```
+--------------------------------------------------------------------------------------------------+
| [Header] PRODUCT & CATEGORY PROFITABILITY ANALYSIS           [Slicers: Category | Discount Band] |
+--------------------------------------------------------------------------------------------------+
| [KPI: Top Category]   [KPI: Best Selling SKU]   [KPI: Avg Unit Price]   [KPI: High Margin SKU %] |
| Technology ($1.62M)   MacBook Air M3 ($248k)    $412.50                 68.4% of Catalog         |
+--------------------------------------------------------------------------------------------------+
| [Sales vs. Profit Margin Matrix (Scatter Plot)]           | [Profitability by Sub-Category]      |
| - X-Axis: [Total Sales]                                   | - Visual: 100% Stacked Bar           |
| - Y-Axis: [Profit Margin %]                               | - Categories: High/Med/Low/Loss      |
| - Bubble Size: [Total Units Sold]                         | - SubCategories breakdown            |
| - Details: Dim_Product[ProductName]                       |                                      |
+--------------------------------------------------------------------------------------------------+
| [Detailed Product Performance Matrix Table with Conditional Formatting Data Bars]               |
| - Columns: Product Name | Category | Units Sold | Total Revenue | Total Profit | Margin % | Rank |
+--------------------------------------------------------------------------------------------------+
```

---

## 🛠️ Visual Configurations & Fields

### 1. Scatter Plot: Price & Margin Quadrant Analysis
- **X-Axis**: `_Measures[Total Sales]` (Logarithmic or Standard scale)
- **Y-Axis**: `_Measures[Profit Margin %]`
- **Size**: `_Measures[Total Units Sold]`
- **Play Axis / Legend**: `Dim_Product[Category]`
- **Reference Lines**: 
  - Constant X-Line at median sales (Separates high/low volume)
  - Constant Y-Line at target margin (25%) (Identifies healthy vs margin-eroding items)

### 2. Discount Impact Analysis
- **Visual Type**: Area Chart
- **X-Axis**: `Fact_Sales[DiscountRate]` (Binned: 0%, 5%, 10%, 15%, 20%, 25%, 30%)
- **Y-Axis (Line 1)**: `_Measures[Total Sales]`
- **Y-Axis (Line 2)**: `_Measures[Profit Margin %]`
- **Insight**: Highlights threshold where discounts stop driving profitable volume.

### 3. Product Matrix Table
- **Rows**: `Dim_Product[Category]`, `Dim_Product[SubCategory]`, `Dim_Product[ProductName]` (Hierarchical drilldown enabled)
- **Values**:
  - `_Measures[Total Units Sold]`
  - `_Measures[Total Sales]`
  - `_Measures[Total Profit]`
  - `_Measures[Profit Margin %]` (Conditional Formatting: Background color scale Red-Yellow-Green)
  - `_Measures[Return Rate %]`
