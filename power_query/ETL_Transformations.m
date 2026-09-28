// =========================================================================================
// POWER QUERY (M) SCRIPT: FACT_SALES ETL CLEANING & ENRICHMENT
// =========================================================================================
// This script demonstrates industry-standard data transformation in Power Query:
// 1. Data Type Casting & Standardization
// 2. Removing Duplicates & Trimming Whitespaces
// 3. Null Handling & Data Integrity Checks
// 4. Custom Business Logic: Delivery Status & Profitability Segment
// =========================================================================================

let
    // 1. Load CSV File (Replace path or use Power BI Source navigation)
    Source = Csv.Document(File.Contents("Fact_Sales.csv"), [Delimiter=",", Columns=22, Encoding=65001, QuoteStyle=QuoteStyle.None]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    
    // 2. Data Type Conversions
    #"Changed Types" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"OrderID", type text},
        {"OrderLine", Int64.Type},
        {"OrderDateKey", Int64.Type},
        {"ShipDateKey", Int64.Type},
        {"CustomerKey", type text},
        {"ProductKey", type text},
        {"RegionKey", type text},
        {"SalesChannel", type text},
        {"ShipMode", type text},
        {"OrderStatus", type text},
        {"Quantity", Int64.Type},
        {"UnitPrice", type number},
        {"UnitCost", type number},
        {"GrossSales", type number},
        {"DiscountRate", type number},
        {"DiscountAmount", type number},
        {"NetSales", type number},
        {"TotalCost", type number},
        {"Profit", type number},
        {"ProfitMarginPct", type number},
        {"ShippingDays", Int64.Type},
        {"ReturnFlag", Int64.Type}
    }),

    // 3. Clean Text Fields (Trim spaces, standard casing)
    #"Trimmed OrderID" = Table.TransformColumns(#"Changed Types",{
        {"OrderID", Text.Trim, type text},
        {"SalesChannel", Text.Trim, type text},
        {"ShipMode", Text.Trim, type text},
        {"OrderStatus", Text.Trim, type text}
    }),

    // 4. Filter / Remove Anomalies (e.g., negative quantity or null order IDs)
    #"Filtered Valid Rows" = Table.SelectRows(#"Trimmed OrderID", each [Quantity] > 0 and [OrderID] <> null and [OrderID] <> ""),

    // 5. Add Custom Business Category: Profitability Band
    #"Added Profitability Band" = Table.AddColumn(#"Filtered Valid Rows", "ProfitabilityBand", each 
        if [ProfitMarginPct] >= 35 then "High Margin (>= 35%)"
        else if [ProfitMarginPct] >= 15 then "Medium Margin (15-34%)"
        else if [ProfitMarginPct] >= 0 then "Low Margin (0-14%)"
        else "Loss Making (< 0%)",
        type text
    ),

    // 6. Add Delivery Speed SLA Status
    #"Added Delivery SLA" = Table.AddColumn(#"Added Profitability Band", "DeliverySLA", each
        if [ShipMode] = "Same Day" and [ShippingDays] <= 0 then "On-Time"
        else if [ShipMode] = "First Class" and [ShippingDays] <= 3 then "On-Time"
        else if [ShipMode] = "Second Class" and [ShippingDays] <= 5 then "On-Time"
        else if [ShipMode] = "Standard Class" and [ShippingDays] <= 7 then "On-Time"
        else "Delayed",
        type text
    )
in
    #"Added Delivery SLA"
