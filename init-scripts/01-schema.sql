-- ============================================
-- High-Scale Energy Ingestion Engine Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DEVICE REGISTRY (Reference Tables)
-- ============================================

CREATE TABLE IF NOT EXISTS meters (
    meter_id VARCHAR(64) PRIMARY KEY,
    location VARCHAR(255),
    capacity_kw DECIMAL(10,2),
    installed_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id VARCHAR(64) PRIMARY KEY,
    vin VARCHAR(17) UNIQUE,
    battery_capacity_kwh DECIMAL(10,2),
    model VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CORRELATION TABLE (Meter-Vehicle Relationship)
-- ============================================

CREATE TABLE IF NOT EXISTS charging_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meter_id VARCHAR(64) NOT NULL REFERENCES meters(meter_id),
    vehicle_id VARCHAR(64) NOT NULL REFERENCES vehicles(vehicle_id),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_charging_sessions_active
    ON charging_sessions(meter_id, vehicle_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_charging_sessions_timerange
    ON charging_sessions(started_at, ended_at);
CREATE INDEX IF NOT EXISTS idx_charging_sessions_vehicle
    ON charging_sessions(vehicle_id, started_at DESC);

-- ============================================
-- HOT STORE (Live State Tables)
-- ============================================

CREATE TABLE IF NOT EXISTS meter_live_state (
    meter_id VARCHAR(64) PRIMARY KEY,
    kwh_consumed_ac DECIMAL(12,4) NOT NULL,
    voltage DECIMAL(8,2) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_live_state (
    vehicle_id VARCHAR(64) PRIMARY KEY,
    soc DECIMAL(5,2) NOT NULL,
    kwh_delivered_dc DECIMAL(12,4) NOT NULL,
    battery_temp DECIMAL(5,2) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COLD STORE (Historical Tables with Partitioning)
-- ============================================

CREATE TABLE IF NOT EXISTS meter_telemetry_history (
    id BIGSERIAL,
    meter_id VARCHAR(64) NOT NULL,
    kwh_consumed_ac DECIMAL(12,4) NOT NULL,
    voltage DECIMAL(8,2) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    ingested_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

CREATE TABLE IF NOT EXISTS vehicle_telemetry_history (
    id BIGSERIAL,
    vehicle_id VARCHAR(64) NOT NULL,
    soc DECIMAL(5,2) NOT NULL,
    kwh_delivered_dc DECIMAL(12,4) NOT NULL,
    battery_temp DECIMAL(5,2) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    ingested_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- ============================================
-- PARTITION MANAGEMENT FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION create_daily_partition(
    table_name TEXT,
    partition_date DATE
) RETURNS VOID AS $$
DECLARE
    partition_name TEXT;
    start_date TEXT;
    end_date TEXT;
BEGIN
    partition_name := table_name || '_' || TO_CHAR(partition_date, 'YYYY_MM_DD');
    start_date := partition_date::TEXT;
    end_date := (partition_date + INTERVAL '1 day')::DATE::TEXT;

    EXECUTE FORMAT(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I
         FOR VALUES FROM (%L) TO (%L)',
        partition_name, table_name, start_date, end_date
    );

    -- Create indexes on new partition
    IF table_name = 'meter_telemetry_history' THEN
        EXECUTE FORMAT(
            'CREATE INDEX IF NOT EXISTS %I ON %I (meter_id, timestamp DESC)',
            partition_name || '_meter_ts_idx', partition_name
        );
    ELSIF table_name = 'vehicle_telemetry_history' THEN
        EXECUTE FORMAT(
            'CREATE INDEX IF NOT EXISTS %I ON %I (vehicle_id, timestamp DESC)',
            partition_name || '_vehicle_ts_idx', partition_name
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create partitions for next 7 days
DO $$
DECLARE
    i INTEGER;
BEGIN
    FOR i IN 0..7 LOOP
        PERFORM create_daily_partition('meter_telemetry_history', CURRENT_DATE + i);
        PERFORM create_daily_partition('vehicle_telemetry_history', CURRENT_DATE + i);
    END LOOP;
END $$;

-- ============================================
-- INDEXES FOR HIGH-PERFORMANCE QUERIES
-- ============================================

-- Index for meter history time-range queries
CREATE INDEX IF NOT EXISTS idx_meter_history_timerange
    ON meter_telemetry_history (timestamp, meter_id);

-- Index for vehicle history time-range queries
CREATE INDEX IF NOT EXISTS idx_vehicle_history_timerange
    ON vehicle_telemetry_history (timestamp, vehicle_id);

-- ============================================
-- SEED DATA FOR TESTING (Optional)
-- ============================================

-- Insert sample meters
INSERT INTO meters (meter_id, location, capacity_kw) VALUES
    ('MTR-001', 'Station A - Bay 1', 150.00),
    ('MTR-002', 'Station A - Bay 2', 150.00),
    ('MTR-003', 'Station B - Bay 1', 350.00)
ON CONFLICT (meter_id) DO NOTHING;

-- Insert sample vehicles
INSERT INTO vehicles (vehicle_id, vin, battery_capacity_kwh, model) VALUES
    ('VH-001', 'WVWZZZ3CZWE123456', 82.00, 'VW ID.4'),
    ('VH-002', '5YJ3E1EA1LF123456', 75.00, 'Tesla Model 3'),
    ('VH-003', 'WAUTPBFF5LA123456', 95.00, 'Audi e-tron')
ON CONFLICT (vehicle_id) DO NOTHING;

-- Create an active charging session for testing
INSERT INTO charging_sessions (meter_id, vehicle_id, started_at, is_active) VALUES
    ('MTR-001', 'VH-001', NOW() - INTERVAL '2 hours', TRUE)
ON CONFLICT DO NOTHING;
