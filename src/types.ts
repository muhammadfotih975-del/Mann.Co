export interface Requisition {
  id: number;
  mercenary_name: string;
  mercenary_class: string;
  faction: 'RED' | 'BLU';
  ration_item: string;
  ration_quantity: number;
  frontline_sector: string;
  priority: 'ROUTINE' | 'STANDARD' | 'URGENT' | 'DEFCON 1';
  message: string;
  status: 'PENDING' | 'APPROVED' | 'DISPATCHED' | 'CONSUMED' | 'DENIED';
  admin_notes: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface RationItem {
  id: number;
  code: string;
  name: string;
  tagline: string;
  hp_restore: string;
  recharge_seconds: number;
  weight_oz: number;
  stock_units: number;
  faction_alignment: 'RED' | 'BLU' | 'NEUTRAL';
  description: string;
}

export interface AdminStats {
  totalRequisitions: number;
  pendingCount: number;
  approvedCount: number;
  dispatchedCount: number;
  redCount: number;
  bluCount: number;
  totalRationsRequested: number;
  inventoryTotal: number;
}

export interface AdminUser {
  username: string;
  role: string;
  clearance: string;
}

export interface SqlQueryResult {
  type: 'SELECT' | 'EXECUTE';
  rowCount?: number;
  rows?: Record<string, any>[];
  result?: string;
}

export interface SqlSchemaInfo {
  tables: string[];
  schemaInfo: Record<string, Array<{ cid: number; name: string; type: string; notnull: number; dflt_value: any; pk: number }>>;
}
