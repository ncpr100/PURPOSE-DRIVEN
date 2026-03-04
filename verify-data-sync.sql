-- DATA SYNCHRONIZATION VERIFICATION 
-- Clear analytics cache and regenerate fresh metrics

-- Clear stale analytics cache
TRUNCATE TABLE analytics_cache;

-- Clear stale KPI metrics  
TRUNCATE TABLE kpi_metrics;

-- Verify current data state
SELECT 'churches' as table_name, COUNT(*) as count FROM churches
UNION ALL
SELECT 'users', COUNT(*) FROM users  
UNION ALL
SELECT 'members', COUNT(*) FROM members
UNION ALL  
SELECT 'check_ins', COUNT(*) FROM check_ins
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'volunteers', COUNT(*) FROM volunteers;

-- Show member details
SELECT 
  m."firstName",
  m."lastName", 
  m.email,
  c.name as church_name,
  m."churchId"
FROM members m
JOIN churches c ON m."churchId" = c.id;

-- Show user details  
SELECT 
  email,
  role,
  "churchId",
  "isActive"
FROM users;