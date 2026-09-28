import os
import csv
import random
from datetime import datetime, timedelta

def generate_data(output_dir="."):
    os.makedirs(output_dir, exist_ok=True)
    random.seed(42)

    # 1. Dim_Region
    regions_data = [
        {"RegionKey": "REG-EAST", "Region": "East", "Country": "United States", "RegionalManager": "Sarah Jenkins", "Market": "North America"},
        {"RegionKey": "REG-WEST", "Region": "West", "Country": "United States", "RegionalManager": "David Chen", "Market": "North America"},
        {"RegionKey": "REG-CENT", "Region": "Central", "Country": "United States", "RegionalManager": "Michael Roberts", "Market": "North America"},
        {"RegionKey": "REG-SOUT", "Region": "South", "Country": "United States", "RegionalManager": "Amanda Perez", "Market": "North America"},
        {"RegionKey": "REG-EMEA", "Region": "EMEA", "Country": "United Kingdom", "RegionalManager": "Oliver Smith", "Market": "Europe"},
        {"RegionKey": "REG-APAC", "Region": "APAC", "Country": "Singapore", "RegionalManager": "Li Wei", "Market": "Asia Pacific"},
        {"RegionKey": "REG-LATAM", "Region": "LATAM", "Country": "Brazil", "RegionalManager": "Carlos Silva", "Market": "Latin America"},
    ]

    with open(os.path.join(output_dir, "Dim_Region.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(regions_data[0].keys()))
        writer.writeheader()
        writer.writerows(regions_data)

    # 2. Dim_Product
    categories = {
        "Technology": {
            "Phones": [("iPhone 15 Pro", 750, 999), ("Samsung Galaxy S24", 620, 899), ("Google Pixel 8", 450, 699), ("OnePlus 12", 480, 749)],
            "Laptops": [("MacBook Air M3", 820, 1099), ("Dell XPS 15", 950, 1299), ("Lenovo ThinkPad X1", 900, 1249), ("HP Spectre x360", 800, 1149)],
            "Accessories": [("Logitech MX Master 3S", 55, 99), ("Apple Magic Keyboard", 60, 119), ("Sony WH-1000XM5", 190, 349), ("Dell 27-inch 4K Monitor", 220, 399)]
        },
        "Furniture": {
            "Chairs": [("Herman Miller Aeron", 650, 1150), ("Steelcase Gesture", 580, 980), ("Ergonomic Mesh Chair", 110, 229), ("Executive Leather Chair", 180, 349)],
            "Desks": [("Autonomous Standing Desk", 280, 499), ("IKEA Bekant Desk", 140, 279), ("Solid Oak Executive Desk", 420, 850), ("Compact Writing Desk", 80, 159)],
            "Bookcases": [("5-Tier Industrial Bookshelf", 90, 189), ("Modern Glass Display Cabinet", 160, 320), ("Modular Cube Storage", 45, 99)]
        },
        "Office Supplies": {
            "Storage": [("Heavy Duty File Cabinet", 95, 189), ("Stackable Storage Bins (Set of 4)", 25, 49), ("Desk Organizer Set", 12, 28)],
            "Paper": [("Premium Multipurpose Paper Ream", 4.5, 9.99), ("Recycled Cardstock 500 Sheets", 7.0, 14.50), ("Glossy Photo Paper", 6.0, 13.99)],
            "Binders": [("Heavy Duty 3-Ring Binder", 3.0, 7.99), ("Presentation Folder 25-Pack", 8.0, 18.00), ("Plastic Sheet Protectors 100-Pack", 5.0, 11.50)],
            "Appliances": [("Fellowes Paper Shredder", 65, 129), ("Compact Microwave Oven", 55, 119), ("Keurig Commercial Coffee Maker", 85, 179)]
        }
    }

    products_data = []
    prod_id = 101
    for cat, subcats in categories.items():
        for subcat, items in subcats.items():
            for name, cost, price in items:
                products_data.append({
                    "ProductKey": f"PROD-{prod_id}",
                    "ProductName": name,
                    "Category": cat,
                    "SubCategory": subcat,
                    "UnitCost": cost,
                    "UnitPrice": price,
                    "TargetMarginPct": round((price - cost) / price * 100, 1)
                })
                prod_id += 1

    with open(os.path.join(output_dir, "Dim_Product.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(products_data[0].keys()))
        writer.writeheader()
        writer.writerows(products_data)

    # 3. Dim_Customer
    first_names = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
                   "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
                   "Daniel", "Nancy", "Matthew", "Lisa", "Anthony", "Betty", "Mark", "Margaret", "Donald", "Sandra",
                   "Steven", "Ashley", "Paul", "Kimberly", "Andrew", "Emily", "Joshua", "Donna", "Kenneth", "Michelle"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
                  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
                  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"]
    
    segments = ["Consumer", "Corporate", "Home Office"]
    segment_weights = [0.52, 0.30, 0.18]

    cities_states = [
        ("New York City", "New York", "REG-EAST"),
        ("Los Angeles", "California", "REG-WEST"),
        ("Chicago", "Illinois", "REG-CENT"),
        ("Houston", "Texas", "REG-CENT"),
        ("Phoenix", "Arizona", "REG-WEST"),
        ("Philadelphia", "Pennsylvania", "REG-EAST"),
        ("San Antonio", "Texas", "REG-CENT"),
        ("San Diego", "California", "REG-WEST"),
        ("Dallas", "Texas", "REG-CENT"),
        ("San Jose", "California", "REG-WEST"),
        ("Austin", "Texas", "REG-CENT"),
        ("Jacksonville", "Florida", "REG-SOUT"),
        ("Fort Worth", "Texas", "REG-CENT"),
        ("Columbus", "Ohio", "REG-EAST"),
        ("Charlotte", "North Carolina", "REG-SOUT"),
        ("San Francisco", "California", "REG-WEST"),
        ("Indianapolis", "Indiana", "REG-CENT"),
        ("Seattle", "Washington", "REG-WEST"),
        ("Denver", "Colorado", "REG-WEST"),
        ("Boston", "Massachusetts", "REG-EAST"),
        ("London", "Greater London", "REG-EMEA"),
        ("Manchester", "Greater Manchester", "REG-EMEA"),
        ("Singapore City", "Central Region", "REG-APAC"),
        ("Sydney", "New South Wales", "REG-APAC"),
        ("Sao Paulo", "Sao Paulo", "REG-LATAM"),
    ]

    customers_data = []
    num_customers = 600
    for cid in range(1, num_customers + 1):
        fn = random.choice(first_names)
        ln = random.choice(last_names)
        city, state, reg_key = random.choice(cities_states)
        segment = random.choices(segments, weights=segment_weights)[0]
        customers_data.append({
            "CustomerKey": f"CUST-{cid:04d}",
            "CustomerName": f"{fn} {ln}",
            "Segment": segment,
            "City": city,
            "State": state,
            "Country": "United States" if "REG-" in reg_key and reg_key not in ["REG-EMEA", "REG-APAC", "REG-LATAM"] else ("United Kingdom" if reg_key == "REG-EMEA" else ("Singapore" if reg_key == "REG-APAC" else "Brazil")),
            "PrimaryRegionKey": reg_key,
            "CustomerTier": random.choices(["Bronze", "Silver", "Gold", "Platinum"], weights=[0.45, 0.30, 0.18, 0.07])[0]
        })

    with open(os.path.join(output_dir, "Dim_Customer.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(customers_data[0].keys()))
        writer.writeheader()
        writer.writerows(customers_data)

    # 4. Dim_Date (Calendar 2023-01-01 to 2025-12-31)
    start_date = datetime(2023, 1, 1)
    end_date = datetime(2025, 12, 31)
    current = start_date
    dates_data = []

    while current <= end_date:
        date_key = int(current.strftime("%Y%m%d"))
        dates_data.append({
            "DateKey": date_key,
            "FullDate": current.strftime("%Y-%m-%d"),
            "Year": current.year,
            "Quarter": f"Q{((current.month - 1) // 3) + 1}",
            "YearQuarter": f"{current.year}-Q{((current.month - 1) // 3) + 1}",
            "MonthNo": current.month,
            "MonthName": current.strftime("%B"),
            "MonthShort": current.strftime("%b"),
            "YearMonth": current.strftime("%Y-%m"),
            "DayOfMonth": current.day,
            "DayOfWeek": current.isoweekday(),
            "DayName": current.strftime("%A"),
            "IsWeekend": 1 if current.isoweekday() in [6, 7] else 0,
            "FiscalYear": f"FY{current.year if current.month >= 4 else current.year - 1}",
            "FiscalQuarter": f"FQ{((current.month - 4) % 12 // 3) + 1}"
        })
        current += timedelta(days=1)

    with open(os.path.join(output_dir, "Dim_Date.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(dates_data[0].keys()))
        writer.writeheader()
        writer.writerows(dates_data)

    # 5. Fact_Sales (12,000 Transactions)
    ship_modes = ["Standard Class", "Second Class", "First Class", "Same Day"]
    ship_weights = [0.60, 0.20, 0.15, 0.05]
    ship_delays = {"Standard Class": (4, 7), "Second Class": (3, 5), "First Class": (1, 3), "Same Day": (0, 0)}

    channels = ["Online Store", "Enterprise Direct", "Retail Partner", "Reseller Portal"]
    channel_weights = [0.50, 0.25, 0.15, 0.10]

    fact_sales = []
    num_orders = 12000
    total_days = (end_date - start_date).days

    for order_idx in range(1, num_orders + 1):
        order_id = f"ORD-{2023 + (order_idx % 3)}-{order_idx:05d}"
        
        day_offset = random.randint(0, total_days)
        order_date = start_date + timedelta(days=day_offset)

        order_date_key = int(order_date.strftime("%Y%m%d"))
        
        cust = random.choice(customers_data)
        cust_key = cust["CustomerKey"]
        reg_key = cust["PrimaryRegionKey"]

        prod = random.choice(products_data)
        prod_key = prod["ProductKey"]
        unit_cost = prod["UnitCost"]
        unit_price = prod["UnitPrice"]

        if prod["Category"] == "Office Supplies":
            quantity = random.randint(1, 10)
        elif prod["Category"] == "Furniture":
            quantity = random.randint(1, 4)
        else: # Technology
            quantity = random.randint(1, 3)

        discount_rate = random.choices([0.0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30], weights=[0.45, 0.15, 0.15, 0.12, 0.08, 0.03, 0.02])[0]
        
        gross_sales = round(quantity * unit_price, 2)
        discount_amount = round(gross_sales * discount_rate, 2)
        net_sales = round(gross_sales - discount_amount, 2)
        total_cost = round(quantity * unit_cost, 2)
        profit = round(net_sales - total_cost, 2)
        profit_margin_pct = round((profit / net_sales) * 100, 2) if net_sales > 0 else 0.0

        ship_mode = random.choices(ship_modes, weights=ship_weights)[0]
        min_d, max_d = ship_delays[ship_mode]
        shipping_days = random.randint(min_d, max_d)
        ship_date = order_date + timedelta(days=shipping_days)
        ship_date_key = int(ship_date.strftime("%Y%m%d"))

        channel = random.choices(channels, weights=channel_weights)[0]
        order_status = random.choices(["Completed", "Shipped", "Delivered", "Returned", "Cancelled"], weights=[0.78, 0.12, 0.05, 0.03, 0.02])[0]
        
        return_flag = 1 if order_status == "Returned" else 0

        fact_sales.append({
            "OrderID": order_id,
            "OrderLine": 1,
            "OrderDateKey": order_date_key,
            "ShipDateKey": ship_date_key,
            "CustomerKey": cust_key,
            "ProductKey": prod_key,
            "RegionKey": reg_key,
            "SalesChannel": channel,
            "ShipMode": ship_mode,
            "OrderStatus": order_status,
            "Quantity": quantity,
            "UnitPrice": unit_price,
            "UnitCost": unit_cost,
            "GrossSales": gross_sales,
            "DiscountRate": discount_rate,
            "DiscountAmount": discount_amount,
            "NetSales": net_sales,
            "TotalCost": total_cost,
            "Profit": profit,
            "ProfitMarginPct": profit_margin_pct,
            "ShippingDays": shipping_days,
            "ReturnFlag": return_flag
        })

    with open(os.path.join(output_dir, "Fact_Sales.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(fact_sales[0].keys()))
        writer.writeheader()
        writer.writerows(fact_sales)

    # Also generate a consolidated Single Table Dataset for users who want single-file drag-and-drop into Power BI
    merged_data = []
    prod_map = {p["ProductKey"]: p for p in products_data}
    cust_map = {c["CustomerKey"]: c for c in customers_data}
    reg_map = {r["RegionKey"]: r for r in regions_data}
    date_map = {d["DateKey"]: d for d in dates_data}

    for item in fact_sales:
        p = prod_map[item["ProductKey"]]
        c = cust_map[item["CustomerKey"]]
        r = reg_map[item["RegionKey"]]
        d = date_map[item["OrderDateKey"]]
        merged_data.append({
            "OrderID": item["OrderID"],
            "OrderDate": d["FullDate"],
            "ShipDate": date_map.get(item["ShipDateKey"], {}).get("FullDate", d["FullDate"]),
            "Year": d["Year"],
            "Quarter": d["Quarter"],
            "Month": d["MonthName"],
            "CustomerName": c["CustomerName"],
            "Segment": c["Segment"],
            "CustomerTier": c["CustomerTier"],
            "City": c["City"],
            "State": c["State"],
            "Country": c["Country"],
            "Region": r["Region"],
            "RegionalManager": r["RegionalManager"],
            "Market": r["Market"],
            "Category": p["Category"],
            "SubCategory": p["SubCategory"],
            "ProductName": p["ProductName"],
            "SalesChannel": item["SalesChannel"],
            "ShipMode": item["ShipMode"],
            "OrderStatus": item["OrderStatus"],
            "Quantity": item["Quantity"],
            "UnitPrice": item["UnitPrice"],
            "UnitCost": item["UnitCost"],
            "GrossSales": item["GrossSales"],
            "DiscountRate": item["DiscountRate"],
            "DiscountAmount": item["DiscountAmount"],
            "Sales": item["NetSales"],
            "TotalCost": item["TotalCost"],
            "Profit": item["Profit"],
            "ProfitMarginPct": item["ProfitMarginPct"],
            "ShippingDays": item["ShippingDays"],
            "Returned": "Yes" if item["ReturnFlag"] == 1 else "No"
        })

    with open(os.path.join(output_dir, "Superstore_Sales_Consolidated.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(merged_data[0].keys()))
        writer.writeheader()
        writer.writerows(merged_data)

    print(f"Successfully generated all datasets in {output_dir}:")
    print(f" - Fact_Sales.csv: {len(fact_sales)} rows")
    print(f" - Dim_Product.csv: {len(products_data)} rows")
    print(f" - Dim_Customer.csv: {len(customers_data)} rows")
    print(f" - Dim_Region.csv: {len(regions_data)} rows")
    print(f" - Dim_Date.csv: {len(dates_data)} rows")
    print(f" - Superstore_Sales_Consolidated.csv: {len(merged_data)} rows")

if __name__ == "__main__":
    generate_data(".")
