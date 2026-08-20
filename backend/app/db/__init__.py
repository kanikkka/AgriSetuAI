import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "agrisetu_live.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Mandi Rates Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS mandi_rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mandi_name TEXT,
        state TEXT,
        crop TEXT,
        modal_price REAL,
        min_price REAL,
        max_price REAL,
        arrival_mt REAL,
        distance_km REAL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Corporate RFQs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS corporate_rfqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        buyer_name TEXT,
        crop TEXT,
        offered_rate REAL,
        required_volume_qtl REAL,
        current_pooled_qtl REAL DEFAULT 0,
        badge TEXT,
        status TEXT DEFAULT 'Open',
        contact_phone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 3. Arhtiya Trust Ledger Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS arhtiyas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        mandi TEXT,
        shop_no TEXT,
        commission_rate REAL,
        avg_settlement_hours REAL,
        total_settlements INTEGER DEFAULT 0,
        total_rating_sum REAL DEFAULT 0,
        verified BOOLEAN DEFAULT 1
    )
    """)

    # 4. Godowns Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS warehouses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        wdra_reg_no TEXT,
        location TEXT,
        distance_km REAL,
        monthly_rent_qtl REAL,
        total_capacity_mt REAL,
        occupied_capacity_mt REAL DEFAULT 0,
        bank_loan_floor_pct REAL DEFAULT 75.0
    )
    """)

    conn.commit()

    # Seed Initial Data if empty
    cursor.execute("SELECT COUNT(*) FROM mandi_rates")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
        INSERT INTO mandi_rates (mandi_name, state, crop, modal_price, min_price, max_price, arrival_mt, distance_km)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, [
            ("Khanna APMC Yard", "Punjab", "Wheat", 2440.0, 2410.0, 2480.0, 480.0, 15.0),
            ("Rajpura APMC Yard", "Punjab", "Wheat", 2380.0, 2350.0, 2415.0, 310.0, 35.0),
            ("Karnal APMC Yard", "Haryana", "Wheat", 2495.0, 2460.0, 2530.0, 620.0, 85.0),
            ("Sirsa Grain Market", "Haryana", "Wheat", 2410.0, 2380.0, 2445.0, 280.0, 140.0),
            ("Khanna APMC Yard", "Punjab", "Basmati Paddy", 3820.0, 3750.0, 3900.0, 220.0, 15.0),
            ("Karnal APMC Yard", "Haryana", "Basmati Paddy", 3950.0, 3880.0, 4020.0, 540.0, 85.0),
        ])

    cursor.execute("SELECT COUNT(*) FROM corporate_rfqs")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
        INSERT INTO corporate_rfqs (buyer_name, crop, offered_rate, required_volume_qtl, current_pooled_qtl, badge, status, contact_phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, [
            ("ITC Agri-Business Division", "Wheat", 2620.0, 500.0, 320.0, "Verified MNC", "Open", "+91 98112-23344"),
            ("Adani Wilmar Logistics", "Basmati Paddy", 3850.0, 600.0, 450.0, "Direct Export", "Urgent", "+91 98223-34455"),
            ("Cargill India Foods", "Maize", 2190.0, 300.0, 180.0, "Bulk Processor", "Open", "+91 98334-45566")
        ])

    cursor.execute("SELECT COUNT(*) FROM arhtiyas")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
        INSERT INTO arhtiyas (name, mandi, shop_no, commission_rate, avg_settlement_hours, total_settlements, total_rating_sum)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, [
            ("M/s Bansal Trading Co.", "Khanna APMC", "Shop #42", 2.0, 12.0, 85, 410.0),
            ("Garg Agro Commission Agent", "Karnal APMC", "Shop #18-B", 2.2, 18.0, 62, 285.0),
            ("Punjab Kheti Commission Agent", "Rajpura APMC", "Shop #09", 2.5, 24.0, 44, 198.0)
        ])

    cursor.execute("SELECT COUNT(*) FROM warehouses")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
        INSERT INTO warehouses (name, wdra_reg_no, location, distance_km, monthly_rent_qtl, total_capacity_mt, occupied_capacity_mt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, [
            ("CWC Central Warehouse Ludhiana", "WDRA-PB-2023-091", "Ludhiana Industrial Area", 12.0, 4.20, 2500.0, 1100.0),
            ("Punjab State Warehousing Corp", "WDRA-PB-2022-441", "Khanna APMC Outer", 4.0, 3.80, 1800.0, 950.0),
            ("Karnal Agro Silos Hub", "WDRA-HR-2024-118", "GT Road, Karnal", 28.0, 5.10, 4000.0, 1800.0)
        ])

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()