import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'messhall.sqlite');
export const db = new DatabaseSync(dbPath);

// Initialize SQL Tables
export function initDatabase() {
  // 1. Requisitions (User Forum submissions and combat ration requests)
  db.exec(`
    CREATE TABLE IF NOT EXISTS requisitions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mercenary_name TEXT NOT NULL,
      mercenary_class TEXT NOT NULL,
      faction TEXT NOT NULL DEFAULT 'RED',
      ration_item TEXT NOT NULL,
      ration_quantity INTEGER NOT NULL DEFAULT 1,
      frontline_sector TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'STANDARD',
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      admin_notes TEXT DEFAULT '',
      likes_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 2. Ration Inventory (Mann Co. combat edibles)
  db.exec(`
    CREATE TABLE IF NOT EXISTS ration_inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      hp_restore TEXT NOT NULL,
      recharge_seconds INTEGER NOT NULL,
      weight_oz REAL NOT NULL,
      stock_units INTEGER NOT NULL,
      faction_alignment TEXT NOT NULL,
      description TEXT NOT NULL
    );
  `);

  // 3. Admin Activity Logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);

  // Seed inventory if empty
  const countRow = db.prepare('SELECT COUNT(*) as cnt FROM ration_inventory').get() as { cnt: number };
  if (countRow.cnt === 0) {
    const seedInventory = [
      {
        code: 'MC-RATION-001',
        name: 'The Sandvich',
        tagline: 'Standard Issue Tactical Nutrition Device',
        hp_restore: '+300 HP (100% Full Heal)',
        recharge_seconds: 30,
        weight_oz: 24.5,
        stock_units: 420,
        faction_alignment: 'RED',
        description: 'Two slices of irradiated rye bread, mortadella, Swiss cheese, iceberg lettuce, and a pimento-stuffed olive. Heals 300 health over 4.3 seconds when consumed.'
      },
      {
        code: 'MC-RATION-002',
        name: 'Buffalo Steak Sandvich',
        tagline: 'High-Protein Berserker Flesh Slab',
        hp_restore: 'Mini-Crits + Speed Boost (Melee Locked)',
        recharge_seconds: 30,
        weight_oz: 32.0,
        stock_units: 185,
        faction_alignment: 'RED',
        description: 'Raw, unpasteurized buffalo ribeye steak wrapped in yellow wax butcher paper. Causes mercenary to enter a blind combat fury with 35% speed boost.'
      },
      {
        code: 'MC-RATION-003',
        name: 'The Dalokohs Bar',
        tagline: 'Heavy Industrial Confectionery Brick',
        hp_restore: '+100 HP + Increases Max HP to 350',
        recharge_seconds: 10,
        weight_oz: 16.0,
        stock_units: 310,
        faction_alignment: 'BLU',
        description: 'Solid manganese-fortified chocolate slab made behind the Iron Curtain. Restores 100 health and elevates mercenary maximum vitality for 30 seconds.'
      },
      {
        code: 'MC-RATION-004',
        name: 'The Second Banana',
        tagline: 'Rapid Re-Deployment Potassium Cylinder',
        hp_restore: '+150 HP (Quick Snacking)',
        recharge_seconds: 11,
        weight_oz: 9.8,
        stock_units: 540,
        faction_alignment: 'NEUTRAL',
        description: 'Yellow fruit engineered in Mann Co. orbital labs. Recharges nearly 3 times faster than standard breadstuffs. Perfect for mobile flank skirmishers.'
      },
      {
        code: 'MC-RATION-005',
        name: 'The Robo-Sandvich',
        tagline: 'Reinforced Titanium Cased MRE',
        hp_restore: '+300 HP (Hydraulic Grease Infused)',
        recharge_seconds: 30,
        weight_oz: 48.0,
        stock_units: 64,
        faction_alignment: 'BLU',
        description: 'Machined steel plating protecting a preserved meat core with synthetic Mayo-9000 lubricant. Resists rocket splash and EMP shock.'
      },
      {
        code: 'MC-RATION-006',
        name: 'The Fishcake',
        tagline: 'Smoked Arctic Trout Tactical Loaf',
        hp_restore: '+100 HP + Morale Boost',
        recharge_seconds: 10,
        weight_oz: 14.2,
        stock_units: 95,
        faction_alignment: 'RED',
        description: 'Cold-smoked salmon and whitefish compressed under 4,000 PSI into a durable field ration bar. Stinks to high heaven, but keeps the medic alive.'
      }
    ];

    const insertInv = db.prepare(`
      INSERT INTO ration_inventory (code, name, tagline, hp_restore, recharge_seconds, weight_oz, stock_units, faction_alignment, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of seedInventory) {
      insertInv.run(
        item.code,
        item.name,
        item.tagline,
        item.hp_restore,
        item.recharge_seconds,
        item.weight_oz,
        item.stock_units,
        item.faction_alignment,
        item.description
      );
    }
  }

  // Seed forum requisitions if empty
  const reqCount = db.prepare('SELECT COUNT(*) as cnt FROM requisitions').get() as { cnt: number };
  if (reqCount.cnt === 0) {
    const initialPosts = [
      {
        mercenary_name: 'Misha (Heavy)',
        mercenary_class: 'Heavy Weapons Guy',
        faction: 'RED',
        ration_item: 'The Sandvich',
        ration_quantity: 3,
        frontline_sector: 'Dustbowl - Point 3 Bunker',
        priority: 'DEFCON 1',
        message: 'Doctor is bleeding and BLU sniper is watching open corridor! Send Sandvich immediately or Heavy will break mess hall door with bare fists!',
        status: 'DISPATCHED',
        admin_notes: 'Ration box dropped by carrier pigeon at 06:40. Heavy acknowledged receipt.',
        likes_count: 14,
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        mercenary_name: 'Jane Doe',
        mercenary_class: 'Soldier',
        faction: 'RED',
        ration_item: 'Buffalo Steak Sandvich',
        ration_quantity: 5,
        frontline_sector: 'Badlands - Spire Peak',
        priority: 'URGENT',
        message: 'I require raw bovine protein to fortify my digestive tract before rocket jumping over BLU perimeter! Do not send spoons, I eat with tactical entrenching shovel!',
        status: 'APPROVED',
        admin_notes: 'Approved by Quartermaster. Packaging with extra grease paper.',
        likes_count: 9,
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        mercenary_name: 'Dell Conagher',
        mercenary_class: 'Engineer',
        faction: 'BLU',
        ration_item: 'The Second Banana',
        ration_quantity: 2,
        frontline_sector: '2Fort - Intel Basement',
        priority: 'STANDARD',
        message: 'Sentry nest is under constant sapper fire from Frenchmen. Need quick potassium chew between wrench swings. Ain’t got time to chew beef.',
        status: 'PENDING',
        admin_notes: 'Awaiting sector transport confirmation.',
        likes_count: 6,
        created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 1).toISOString()
      }
    ];

    const insertReq = db.prepare(`
      INSERT INTO requisitions (
        mercenary_name, mercenary_class, faction, ration_item, ration_quantity,
        frontline_sector, priority, message, status, admin_notes, likes_count,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const post of initialPosts) {
      insertReq.run(
        post.mercenary_name,
        post.mercenary_class,
        post.faction,
        post.ration_item,
        post.ration_quantity,
        post.frontline_sector,
        post.priority,
        post.message,
        post.status,
        post.admin_notes,
        post.likes_count,
        post.created_at,
        post.updated_at
      );
    }
  }
}

// Queries for requisitions
export function getRequisitions(filters: { faction?: string; status?: string; search?: string } = {}) {
  let query = 'SELECT * FROM requisitions WHERE 1=1';
  const params: any[] = [];

  if (filters.faction && filters.faction !== 'ALL') {
    query += ' AND faction = ?';
    params.push(filters.faction);
  }

  if (filters.status && filters.status !== 'ALL') {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.search) {
    query += ' AND (mercenary_name LIKE ? OR message LIKE ? OR frontline_sector LIKE ? OR ration_item LIKE ?)';
    const term = `%${filters.search}%`;
    params.push(term, term, term, term);
  }

  query += ' ORDER BY id DESC';
  return db.prepare(query).all(...params);
}

export function createRequisition(data: {
  mercenary_name: string;
  mercenary_class: string;
  faction: string;
  ration_item: string;
  ration_quantity: number;
  frontline_sector: string;
  priority: string;
  message: string;
}) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO requisitions (
      mercenary_name, mercenary_class, faction, ration_item, ration_quantity,
      frontline_sector, priority, message, status, admin_notes, likes_count,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', '', 0, ?, ?)
  `);

  const result = stmt.run(
    data.mercenary_name.trim(),
    data.mercenary_class,
    data.faction || 'RED',
    data.ration_item,
    Number(data.ration_quantity) || 1,
    data.frontline_sector.trim(),
    data.priority || 'STANDARD',
    data.message.trim(),
    now,
    now
  );

  const insertedId = result.lastInsertRowid;
  return db.prepare('SELECT * FROM requisitions WHERE id = ?').get(insertedId);
}

export function updateRequisitionStatus(id: number, status: string, admin_notes: string = '') {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    UPDATE requisitions
    SET status = ?, admin_notes = ?, updated_at = ?
    WHERE id = ?
  `);
  stmt.run(status, admin_notes, now, id);

  // Log in admin activity
  db.prepare('INSERT INTO admin_logs (action, details, timestamp) VALUES (?, ?, ?)')
    .run('UPDATE_STATUS', `Requisition #${id} changed to ${status}. Notes: ${admin_notes}`, now);

  return db.prepare('SELECT * FROM requisitions WHERE id = ?').get(id);
}

export function deleteRequisition(id: number) {
  const now = new Date().toISOString();
  const existing = db.prepare('SELECT * FROM requisitions WHERE id = ?').get(id);
  db.prepare('DELETE FROM requisitions WHERE id = ?').run(id);

  db.prepare('INSERT INTO admin_logs (action, details, timestamp) VALUES (?, ?, ?)')
    .run('DELETE_REQUISITION', `Deleted Requisition #${id} (${JSON.stringify(existing)})`, now);

  return { success: true, deletedId: id };
}

export function likeRequisition(id: number) {
  db.prepare('UPDATE requisitions SET likes_count = likes_count + 1 WHERE id = ?').run(id);
  return db.prepare('SELECT likes_count FROM requisitions WHERE id = ?').get(id);
}

export function getInventory() {
  return db.prepare('SELECT * FROM ration_inventory ORDER BY id ASC').all();
}

export function updateInventoryStock(id: number, stock: number) {
  db.prepare('UPDATE ration_inventory SET stock_units = ? WHERE id = ?').run(stock, id);
  return db.prepare('SELECT * FROM ration_inventory WHERE id = ?').get(id);
}

export function getDatabaseStats() {
  const totalRequisitions = (db.prepare('SELECT COUNT(*) as cnt FROM requisitions').get() as { cnt: number }).cnt;
  const pendingCount = (db.prepare("SELECT COUNT(*) as cnt FROM requisitions WHERE status = 'PENDING'").get() as { cnt: number }).cnt;
  const approvedCount = (db.prepare("SELECT COUNT(*) as cnt FROM requisitions WHERE status = 'APPROVED'").get() as { cnt: number }).cnt;
  const dispatchedCount = (db.prepare("SELECT COUNT(*) as cnt FROM requisitions WHERE status = 'DISPATCHED'").get() as { cnt: number }).cnt;
  const redCount = (db.prepare("SELECT COUNT(*) as cnt FROM requisitions WHERE faction = 'RED'").get() as { cnt: number }).cnt;
  const bluCount = (db.prepare("SELECT COUNT(*) as cnt FROM requisitions WHERE faction = 'BLU'").get() as { cnt: number }).cnt;
  const totalRationsRequested = (db.prepare('SELECT SUM(ration_quantity) as total FROM requisitions').get() as { total: number | null }).total || 0;
  const inventoryTotal = (db.prepare('SELECT SUM(stock_units) as total FROM ration_inventory').get() as { total: number | null }).total || 0;

  return {
    totalRequisitions,
    pendingCount,
    approvedCount,
    dispatchedCount,
    redCount,
    bluCount,
    totalRationsRequested,
    inventoryTotal
  };
}

// SQL Terminal & Inspector for Admin
export function executeRawSql(sqlQuery: string) {
  const clean = sqlQuery.trim();
  if (!clean) throw new Error('SQL Query cannot be empty');

  // Check if it's a SELECT or PRAGMA
  const isSelect = /^SELECT\b|^PRAGMA\b|^EXPLAIN\b/i.test(clean);
  if (isSelect) {
    const rows = db.prepare(clean).all();
    return {
      type: 'SELECT',
      rowCount: rows.length,
      rows
    };
  } else {
    const result = db.exec(clean);
    return {
      type: 'EXECUTE',
      result: 'Query executed successfully.'
    };
  }
}

export function getSqlSchemaInfo() {
  const tables = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name
  `).all() as { name: string }[];

  const schemaInfo: Record<string, any[]> = {};
  for (const table of tables) {
    schemaInfo[table.name] = db.prepare(`PRAGMA table_info(${table.name})`).all();
  }

  return { tables: tables.map(t => t.name), schemaInfo };
}
