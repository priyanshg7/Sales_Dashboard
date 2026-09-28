import csv
import json
import os

def export_json():
    csv_path = os.path.join("..", "data", "Superstore_Sales_Consolidated.csv")
    out_path = "sales_data.json"
    
    records = []
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append({
                "id": row["OrderID"],
                "date": row["OrderDate"],
                "yr": int(row["Year"]),
                "q": row["Quarter"],
                "m": row["Month"],
                "cust": row["CustomerName"],
                "seg": row["Segment"],
                "tier": row["CustomerTier"],
                "city": row["City"],
                "st": row["State"],
                "reg": row["Region"],
                "mgr": row["RegionalManager"],
                "cat": row["Category"],
                "sub": row["SubCategory"],
                "prod": row["ProductName"],
                "chan": row["SalesChannel"],
                "ship": row["ShipMode"],
                "status": row["OrderStatus"],
                "qty": int(row["Quantity"]),
                "price": float(row["UnitPrice"]),
                "cost": float(row["UnitCost"]),
                "sales": float(row["Sales"]),
                "profit": float(row["Profit"]),
                "margin": float(row["ProfitMarginPct"]),
                "shipDays": int(row["ShippingDays"]),
                "ret": row["Returned"]
            })
            
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(records, f)
        
    print(f"Exported {len(records)} records to {out_path}")

if __name__ == "__main__":
    export_json()
