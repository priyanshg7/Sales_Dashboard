// =========================================================================================
// POWER QUERY (M) SCRIPT: DYNAMIC DATE / CALENDAR DIMENSION TABLE
// =========================================================================================
// Usage in Power BI:
// 1. In Power BI Desktop, open 'Power Query Editor' (Home -> Transform Data)
// 2. Click 'New Source' -> 'Blank Query'
// 3. Click 'Advanced Editor'
// 4. Paste this entire script and click 'Done'
// 5. Rename Query to: Dim_Date
// =========================================================================================

let
    // Set Start and End Dates (or make dynamic based on Fact_Sales table)
    StartDate = #date(2023, 1, 1),
    EndDate = #date(2025, 12, 31),
    
    // Generate list of dates
    DayCount = Duration.Days(Duration.From(EndDate - StartDate)) + 1,
    Source = List.Dates(StartDate, DayCount, #duration(1, 0, 0, 0)),
    
    // Convert to Table
    #"Converted to Table" = Table.FromList(Source, Splitter.SplitByNothing(), {"FullDate"}, null, ExtraValues.Error),
    #"Changed Type FullDate" = Table.TransformColumnTypes(#"Converted to Table",{{"FullDate", type date}}),
    
    // Add Date Key (YYYYMMDD integer)
    #"Added DateKey" = Table.AddColumn(#"Changed Type FullDate", "DateKey", each Date.Year([FullDate]) * 10000 + Date.Month([FullDate]) * 100 + Date.Day([FullDate]), Int64.Type),
    
    // Add Calendar Attributes
    #"Added Year" = Table.AddColumn(#"Added DateKey", "Year", each Date.Year([FullDate]), Int64.Type),
    #"Added Quarter Number" = Table.AddColumn(#"Added Year", "QuarterNo", each Date.QuarterOfYear([FullDate]), Int64.Type),
    #"Added Quarter" = Table.AddColumn(#"Added Quarter Number", "Quarter", each "Q" & Text.From([QuarterNo]), type text),
    #"Added YearQuarter" = Table.AddColumn(#"Added Quarter", "YearQuarter", each Text.From([Year]) & "-Q" & Text.From([QuarterNo]), type text),
    
    #"Added Month Number" = Table.AddColumn(#"Added YearQuarter", "MonthNo", each Date.Month([FullDate]), Int64.Type),
    #"Added Month Name" = Table.AddColumn(#"Added Month Number", "MonthName", each Date.MonthName([FullDate]), type text),
    #"Added Month Short" = Table.AddColumn(#"Added Month Name", "MonthShort", each Date.ToText([FullDate], "MMM"), type text),
    #"Added YearMonth" = Table.AddColumn(#"Added Month Short", "YearMonth", each Date.ToText([FullDate], "yyyy-MM"), type text),
    #"Added YearMonthSort" = Table.AddColumn(#"Added YearMonth", "YearMonthSort", each [Year] * 100 + [MonthNo], Int64.Type),
    
    #"Added Day of Month" = Table.AddColumn(#"Added YearMonthSort", "DayOfMonth", each Date.Day([FullDate]), Int64.Type),
    #"Added Day of Week" = Table.AddColumn(#"Added Day of Month", "DayOfWeek", each Date.DayOfWeek([FullDate], Day.Monday) + 1, Int64.Type),
    #"Added Day Name" = Table.AddColumn(#"Added Day of Week", "DayName", each Date.DayOfWeekName([FullDate]), type text),
    #"Added IsWeekend" = Table.AddColumn(#"Added Day Name", "IsWeekend", each if [DayOfWeek] >= 6 then 1 else 0, Int64.Type),
    
    // Add Fiscal Year (Starts in April)
    #"Added Fiscal Year" = Table.AddColumn(#"Added IsWeekend", "FiscalYear", each if [MonthNo] >= 4 then "FY" & Text.From([Year]) else "FY" & Text.From([Year] - 1), type text),
    #"Added Fiscal Quarter" = Table.AddColumn(#"Added Fiscal Year", "FiscalQuarter", each "FQ" & Text.From(Number.Mod([MonthNo] + 8, 12) / 3 + 1), type text),
    
    // Reorder & Set Types
    #"Final Types" = Table.TransformColumnTypes(#"Added Fiscal Quarter",{
        {"DateKey", Int64.Type},
        {"FullDate", type date},
        {"Year", Int64.Type},
        {"QuarterNo", Int64.Type},
        {"Quarter", type text},
        {"YearQuarter", type text},
        {"MonthNo", Int64.Type},
        {"MonthName", type text},
        {"MonthShort", type text},
        {"YearMonth", type text},
        {"YearMonthSort", Int64.Type},
        {"DayOfMonth", Int64.Type},
        {"DayOfWeek", Int64.Type},
        {"DayName", type text},
        {"IsWeekend", Int64.Type},
        {"FiscalYear", type text},
        {"FiscalQuarter", type text}
    })
in
    #"Final Types"
