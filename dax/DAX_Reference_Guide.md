# DAX Reference Guide: Sales & Performance Analytics

This guide documents every DAX formula used in this project, explaining the business rationale, mathematical formulation, and visualization context.

---

## 📌 1. Best Practice: Dedicated `_Measures` Table
In Power BI Desktop:
1. Go to **Home** -> **Enter Data**.
2. Name the table `_Measures` and click **Load**.
3. Right-click `_Measures` -> **New Measure** to add each formula below.
4. Hide the dummy `Column1` so the table icon changes to a calculator 🧮 icon at the top of the data pane.

---

## 📊 2. Core Business Measures

| Measure Name | DAX Formula | Formatting | Purpose |
| :--- | :--- | :--- | :--- |
| **Total Sales** | `SUM(Fact_Sales[NetSales])` | Currency (`$#,##0`) | Primary top-line revenue KPI card & chart values |
| **Total Profit** | `SUM(Fact_Sales[Profit])` | Currency (`$#,##0`) | Bottom-line net profitability |
| **Profit Margin %** | `DIVIDE([Total Profit], [Total Sales], 0)` | Percentage (`0.0%`) | Measure of operational efficiency & pricing health |
| **Total Orders** | `DISTINCTCOUNT(Fact_Sales[OrderID])` | Whole Number (`#,##0`) | Volume of discrete customer orders processed |
| **Average Order Value (AOV)** | `DIVIDE([Total Sales], [Total Orders], 0)` | Currency (`$#,##0.00`) | Revenue generated per transaction |
| **Total Units Sold** | `SUM(Fact_Sales[Quantity])` | Whole Number (`#,##0`) | Inventory depletion & physical product volume |
| **Avg Discount Rate %** | `AVERAGE(Fact_Sales[DiscountRate])` | Percentage (`0.0%`) | Monitoring margin erosion from promotions |
| **Return Rate %** | `DIVIDE(SUM(Fact_Sales[ReturnFlag]), [Total Orders], 0)` | Percentage (`0.0%`) | Product quality & reverse logistics KPI |

---

## ⏱️ 3. Time Intelligence Measures

> **Important**: Ensure `Dim_Date` is marked as a **Date Table** (`Dim_Date[FullDate]`).

### 1. Sales Year-to-Date (YTD)
```dax
Sales YTD = 
TOTALYTD(
    [Total Sales],
    Dim_Date[FullDate]
)
```

### 2. Prior Year Sales (Same Period Last Year)
```dax
Sales PY = 
CALCULATE(
    [Total Sales],
    SAMEPERIODLASTYEAR(Dim_Date[FullDate])
)
```

### 3. YoY Sales Growth %
```dax
Sales YoY Growth % = 
DIVIDE(
    [Total Sales] - [Sales PY],
    [Sales PY],
    0
)
```

### 4. Month-over-Month (MoM) Growth %
```dax
Sales Previous Month = 
CALCULATE(
    [Total Sales],
    DATEADD(Dim_Date[FullDate], -1, MONTH)
)

Sales MoM Growth % = 
DIVIDE(
    [Total Sales] - [Sales Previous Month],
    [Sales Previous Month],
    0
)
```

---

## 🏆 4. Ranking & Regional Intelligence

### 1. Dynamic Product Ranking
```dax
Product Sales Rank = 
RANKX(
    ALLSELECTED(Dim_Product[ProductName]),
    [Total Sales],
    ,
    DESC,
    Dense
)
```

### 2. Top 5 Product Visual Filter
```dax
Is Top 5 Product = 
IF([Product Sales Rank] <= 5, 1, 0)
```
*(Add this measure to visual-level filters and set condition to `is 1`)*.

### 3. Target Achievement Indicator
```dax
Target Achievement % = 
DIVIDE([Total Sales], [Regional Sales Target], 0)
```
