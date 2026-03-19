import express from 'express';
import path from 'path';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from './firebase-applet-config.json';

// Initialize Database
let db: Database.Database;
try {
  const dbPath = process.env.VERCEL ? '/tmp/globsourcia.db' : 'globsourcia.db';
  db = new Database(dbPath);
  console.log(`[DB] Database initialized successfully at ${dbPath}`);
  if (process.env.VERCEL) {
    console.warn('[DB] WARNING: Running on Vercel. SQLite database is in /tmp and will be reset on every cold start. For persistent data, migrate to a cloud database.');
  }
} catch (err) {
  console.error('[DB] Failed to initialize database:', err);
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET || 'globsourcia-secret-key';
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

// Initialize Firebase Admin
try {
  initializeApp({
    projectId: firebaseConfig.projectId
  });
  console.log('[FIREBASE] Firebase Admin initialized successfully');
} catch (err) {
  console.error('[FIREBASE] Failed to initialize Firebase Admin:', err);
  // We don't exit here as some parts might still work
}

const firestore = getFirestore();

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT, -- 'customer', 'sourcing_agent', 'shipping_agent', 'admin'
    type TEXT, -- 'company', 'personal'
    company_details TEXT, -- JSON string
    phone TEXT,
    avatar_url TEXT,
    preferences TEXT, -- JSON string for notifications, theme, etc.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS rfqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    sourcing_agent_id INTEGER,
    status TEXT DEFAULT 'draft', -- 'draft', 'paid', 'assigned', 'sourcing', 'shipping', 'offered', 'ordered', 'shipped'
    origin_country TEXT,
    destination_country TEXT,
    delivery_mode TEXT,
    quality_level TEXT,
    total_budget REAL,
    currency TEXT,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid'
    payment_proof TEXT,
    payment_date DATETIME,
    billing_type TEXT, -- 'receipt', 'invoice'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES users(id),
    FOREIGN KEY(sourcing_agent_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS rfq_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rfq_id INTEGER,
    name TEXT,
    category TEXT,
    photo_urls TEXT, -- JSON string
    website_link TEXT,
    quantity REAL,
    unit TEXT,
    budget REAL,
    note TEXT,
    FOREIGN KEY(rfq_id) REFERENCES rfqs(id)
  );

  CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rfq_id INTEGER,
    sourcing_agent_id INTEGER,
    shipping_agent_id INTEGER,
    status TEXT DEFAULT 'sourcing_pending', -- 'sourcing_pending', 'shipping_pending', 'ready', 'accepted', 'declined'
    unit_price REAL,
    total_exw REAL,
    shipping_cost REAL,
    customs_cost REAL,
    commission REAL,
    total_cost REAL,
    production_time TEXT,
    delivery_deadline TEXT,
    validity_date TEXT,
    shipping_details TEXT, -- JSON
    quantity REAL,
    quality_level TEXT,
    delivery_mode TEXT,
    delivery_sub_mode TEXT,
    volume_cbm REAL,
    gross_weight_kg REAL,
    offer_validity TEXT,
    payment_terms TEXT,
    exw_charges REAL,
    total_cfr REAL,
    remarks TEXT,
    supplier_name TEXT,
    supplier_address TEXT,
    supplier_contact_person TEXT,
    supplier_email TEXT,
    hs_code TEXT,
    offer_pi_url TEXT,
    moq INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(rfq_id) REFERENCES rfqs(id),
    FOREIGN KEY(sourcing_agent_id) REFERENCES users(id),
    FOREIGN KEY(shipping_agent_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category TEXT,
    country TEXT,
    address TEXT,
    contact_person TEXT,
    contact_email TEXT,
    rating REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shipments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_number TEXT UNIQUE,
    carrier TEXT,
    rfq_id INTEGER,
    customer_id INTEGER,
    sourcing_agent_id INTEGER,
    shipping_agent_id INTEGER,
    offer_id INTEGER,
    status TEXT DEFAULT 'pending', -- 'pending', 'booked', 'in_transit', 'customs', 'delivered', 'delayed'
    origin TEXT,
    destination TEXT,
    estimated_delivery TEXT,
    transport_mode TEXT,
    packing_details TEXT,
    total_value REAL,
    purchase_cost REAL,
    freight_cost REAL,
    customs_cost REAL,
    selling_price REAL,
    shipping_line TEXT,
    booking_number TEXT,
    bl_number TEXT,
    free_time TEXT,
    cut_off TEXT,
    etd TEXT,
    eta TEXT,
    transit_time TEXT,
    delivery_date TEXT,
    last_update DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(rfq_id) REFERENCES rfqs(id),
    FOREIGN KEY(customer_id) REFERENCES users(id),
    FOREIGN KEY(sourcing_agent_id) REFERENCES users(id),
    FOREIGN KEY(shipping_agent_id) REFERENCES users(id),
    FOREIGN KEY(offer_id) REFERENCES offers(id)
  );

  CREATE TABLE IF NOT EXISTS shipment_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shipment_id INTEGER,
    rfq_id INTEGER,
    FOREIGN KEY(shipment_id) REFERENCES shipments(id),
    FOREIGN KEY(rfq_id) REFERENCES rfqs(id)
  );

  CREATE TABLE IF NOT EXISTS shipment_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shipment_id INTEGER,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    location TEXT,
    description TEXT,
    FOREIGN KEY(shipment_id) REFERENCES shipments(id)
  );

  CREATE TABLE IF NOT EXISTS shipment_orders (
    shipment_id INTEGER,
    rfq_id INTEGER,
    PRIMARY KEY(shipment_id, rfq_id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    message TEXT,
    type TEXT, -- 'info', 'success', 'warning', 'error'
    target_view TEXT,
    target_id INTEGER,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    description TEXT,
    due_date TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rfq_id INTEGER,
    customer_id INTEGER,
    amount REAL,
    currency TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
    type TEXT, -- 'sourcing_fee', 'product_payment', 'shipping_fee'
    due_date TEXT,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(rfq_id) REFERENCES rfqs(id),
    FOREIGN KEY(customer_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS sample_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rfq_id INTEGER,
    offer_id INTEGER,
    customer_id INTEGER,
    sourcing_agent_id INTEGER,
    shipping_agent_id INTEGER,
    status TEXT DEFAULT 'pending', -- 'pending', 'sourcing_priced', 'shipping_priced', 'ready', 'paid', 'shipped', 'delivered', 'cancelled'
    details TEXT,
    sample_cost REAL,
    shipping_cost REAL,
    total_cost REAL,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid'
    payment_proof TEXT,
    tracking_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(rfq_id) REFERENCES rfqs(id),
    FOREIGN KEY(offer_id) REFERENCES offers(id),
    FOREIGN KEY(customer_id) REFERENCES users(id),
    FOREIGN KEY(sourcing_agent_id) REFERENCES users(id),
    FOREIGN KEY(shipping_agent_id) REFERENCES users(id)
  );
`);

  // Migration for existing offers table
  const columns = db.prepare("PRAGMA table_info(offers)").all() as any[];
  const columnNames = columns.map(c => c.name);
  const newColumns = [
    ['quantity', 'REAL'],
    ['quality_level', 'TEXT'],
    ['delivery_mode', 'TEXT'],
    ['delivery_sub_mode', 'TEXT'],
    ['volume_cbm', 'REAL'],
    ['gross_weight_kg', 'REAL'],
    ['offer_validity', 'TEXT'],
    ['payment_terms', 'TEXT'],
    ['exw_charges', 'REAL'],
    ['total_cfr', 'REAL'],
    ['remarks', 'TEXT'],
    ['supplier_name', 'TEXT'],
    ['supplier_address', 'TEXT'],
    ['supplier_contact_person', 'TEXT'],
    ['supplier_email', 'TEXT'],
    ['hs_code', 'TEXT'],
    ['offer_pi_url', 'TEXT']
  ];

  for (const [name, type] of newColumns) {
    if (!columnNames.includes(name)) {
      db.prepare(`ALTER TABLE offers ADD COLUMN ${name} ${type}`).run();
    }
  }

// Create demo users if not exists
const hashedPw = bcrypt.hashSync('123456', 10);
db.prepare("INSERT OR IGNORE INTO users (email, password, name, role, type, uid) VALUES ('customer@test.com', ?, 'Test Customer', 'customer', 'personal', 'mock-uid-customer')").run(hashedPw);
db.prepare("INSERT OR IGNORE INTO users (email, password, name, role, type, uid) VALUES ('sourcing@test.com', ?, 'Sourcing Agent', 'sourcing_agent', 'personal', 'mock-uid-sourcing')").run(hashedPw);
db.prepare("INSERT OR IGNORE INTO users (email, password, name, role, type, uid) VALUES ('shipping@test.com', ?, 'Shipping Agent', 'shipping_agent', 'personal', 'mock-uid-shipping')").run(hashedPw);
db.prepare("INSERT OR IGNORE INTO users (email, password, name, role, type, uid) VALUES ('admin@test.com', ?, 'Admin User', 'admin', 'personal', 'mock-uid-admin')").run(hashedPw);

// Also update them in case they were inserted with literal strings previously
db.prepare("UPDATE users SET password = ? WHERE email IN ('customer@test.com', 'sourcing@test.com', 'shipping@test.com', 'admin@test.com') AND password LIKE '%bcrypt.hashSync%'").run(hashedPw);

// Helper for sending notifications and emails
async function createNotification(userId: number, title: string, message: string, type: string = 'info', target_view?: string, target_id?: number) {
  try {
    // 1. Save to database
    db.prepare('INSERT INTO notifications (user_id, title, message, type, target_view, target_id) VALUES (?, ?, ?, ?, ?, ?)')
      .run(userId, title, message, type, target_view || null, target_id || null);

    // 2. Send email (Mock implementation for now, but structured for real service)
    const user: any = db.prepare('SELECT email, name, preferences FROM users WHERE id = ?').get(userId);
    if (user && user.email) {
      const prefs = JSON.parse(user.preferences || '{"emailNotifications": true}');
      if (prefs.emailNotifications === false) {
        console.log(`[EMAIL SKIPPED] User ${user.email} has disabled email notifications.`);
        return;
      }
      
      console.log(`[EMAIL SENT] To: ${user.email} | Subject: ${title} | Body: ${message}`);
      
      // If a real API key was provided, we would call Resend or SendGrid here
      // Example with Resend:
      /*
      if (process.env.RESEND_API_KEY) {
        await axios.post('https://api.resend.com/emails', {
          from: 'Globsourcia <notifications@globsourcia.com>',
          to: user.email,
          subject: title,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #000; padding: 24px; text-align: center;">
                <h1 style="color: #fff; margin: 0; font-size: 24px;">Glob$ourcia</h1>
              </div>
              <div style="padding: 32px;">
                <h2 style="color: #111827; margin-top: 0;">${title}</h2>
                <p style="color: #4b5563; line-height: 1.6;">Hello ${user.name},</p>
                <p style="color: #4b5563; line-height: 1.6;">${message}</p>
                <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                  <a href="${APP_URL}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View in Dashboard</a>
                </div>
              </div>
              <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af;">
                &copy; 2026 Globsourcia. All rights reserved.
              </div>
            </div>
          `
        }, {
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` }
        });
      }
      */
    }
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

function getUidById(userId: number | string): string | null {
  if (!userId) return null;
  const user: any = db.prepare('SELECT uid FROM users WHERE id = ?').get(userId);
  return user ? user.uid : null;
}

async function syncShipmentToFirestore(shipmentId: number | string) {
  try {
    const shipment: any = db.prepare('SELECT * FROM shipments WHERE id = ?').get(shipmentId);
    if (!shipment) return;

    const updates = db.prepare('SELECT * FROM shipment_updates WHERE shipment_id = ? ORDER BY date DESC').all(shipmentId);

    const customer_uid = getUidById(shipment.customer_id);
    const sourcing_agent_uid = getUidById(shipment.sourcing_agent_id);
    const shipping_agent_uid = getUidById(shipment.shipping_agent_id);

    const firestoreData = {
      ...shipment,
      updates,
      customer_uid,
      sourcing_agent_uid,
      shipping_agent_uid,
      updatedAt: new Date().toISOString()
    };

    // Remove any fields that shouldn't be in Firestore or are null
    delete firestoreData.id;

    await firestore.collection('shipments').doc(shipmentId.toString()).set(firestoreData, { merge: true });
    console.log(`[FIRESTORE SYNC] Shipment #${shipmentId} synced successfully with ${updates.length} updates.`);
  } catch (error) {
    console.error(`[FIRESTORE SYNC ERROR] Shipment #${shipmentId}:`, error);
  }
}

const VALID_RFQ_TRANSITIONS: Record<string, string[]> = {
  'draft': ['submitted'],
  'submitted': ['approved', 'rejected'],
  'rejected': ['submitted'],
  'approved': ['assigned'],
  'assigned': ['sourcing', 'shipping'],
  'sourcing': ['shipping'],
  'shipping': ['offered'],
  'offered': ['ordered', 'shipping'],
  'ordered': ['shipped'],
  'shipped': []
};

const validateRfqStatusTransition = (currentStatus: string, nextStatus: string, user: any) => {
  if (user.role === 'admin') return true; // Admin can do anything
  
  if (currentStatus !== nextStatus) {
    const allowedNext = VALID_RFQ_TRANSITIONS[currentStatus] || [];
    if (!allowedNext.includes(nextStatus)) return false;
  }

  // Role based restrictions
  if (nextStatus === 'submitted' && user.role !== 'customer') return false;
  if (['approved', 'rejected', 'assigned'].includes(nextStatus) && !['admin', 'shipping_agent'].includes(user.role)) return false;
  if (['sourcing', 'shipping'].includes(nextStatus) && !['admin', 'sourcing_agent'].includes(user.role)) return false;
  if (nextStatus === 'offered' && !['admin', 'shipping_agent'].includes(user.role)) return false;
  if (nextStatus === 'ordered' && user.role !== 'customer') return false;
  if (nextStatus === 'shipped' && !['admin', 'shipping_agent'].includes(user.role)) return false;

  return true;
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch (e) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Health Check
  app.get('/api/health', (req, res) => {
    console.log('[HEALTH] Health check request received');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Auth Routes
  app.post('/api/auth/register', (req, res) => {
    const { email, password, name, role, type, company_details, uid } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      const result = db.prepare('INSERT INTO users (email, password, name, role, type, company_details, uid) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(email, hashedPassword, name, role || 'customer', type || 'personal', JSON.stringify(company_details || {}), uid);
      const token = jwt.sign({ id: result.lastInsertRowid, email, role, uid }, JWT_SECRET);
      res.json({ token, user: { id: result.lastInsertRowid, email, name, role, uid } });
    } catch (e) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`[LOGIN ATTEMPT] Email: ${email}`);
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (user) {
        const isMatch = bcrypt.compareSync(password, user.password);
        console.log(`[LOGIN] User found. Password match: ${isMatch}`);
        if (isMatch) {
          const token = jwt.sign({ id: user.id, email: user.email, role: user.role, uid: user.uid }, JWT_SECRET);
          res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, uid: user.uid } });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } else {
        console.log(`[LOGIN] User not found: ${email}`);
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('[LOGIN] Database error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/google', async (req, res) => {
    const { idToken } = req.body;
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const email = decodedToken.email;
      const uid = decodedToken.uid;
      const name = decodedToken.name || email?.split('@')[0] || 'User';

      let user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (!user) {
        const role = email === 'clicfret@gmail.com' ? 'admin' : 'customer';
        const result = db.prepare('INSERT INTO users (email, name, role, type, uid) VALUES (?, ?, ?, ?, ?)')
          .run(email, name, role, 'personal', uid);
        user = { id: result.lastInsertRowid, email, name, role, uid };
      } else if (!user.uid) {
        db.prepare('UPDATE users SET uid = ? WHERE id = ?').run(uid, user.id);
        user.uid = uid;
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role, uid: user.uid }, JWT_SECRET);
      res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, uid: user.uid } });
    } catch (e) {
      res.status(401).json({ error: 'Invalid Google token' });
    }
  });

  app.post('/api/users/sync-uid', authenticate, (req: any, res) => {
    const { uid } = req.body;
    try {
      db.prepare('UPDATE users SET uid = ? WHERE id = ?').run(uid, req.user.id);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Failed to sync UID' });
    }
  });

  // LinkedIn OAuth Routes
  app.get('/api/auth/linkedin/url', (req, res) => {
    const redirectUri = `${APP_URL}/auth/linkedin/callback`;
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: LINKEDIN_CLIENT_ID || '',
      redirect_uri: redirectUri,
      scope: 'openid profile email',
    });
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
    res.json({ url: authUrl });
  });

  app.get(['/auth/linkedin/callback', '/auth/linkedin/callback/'], async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('No code provided');

    try {
      const redirectUri = `${APP_URL}/auth/linkedin/callback`;
      const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        client_id: LINKEDIN_CLIENT_ID || '',
        client_secret: LINKEDIN_CLIENT_SECRET || '',
        redirect_uri: redirectUri,
      }).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const accessToken = tokenResponse.data.access_token;
      const userResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const linkedinUser = userResponse.data;
      const email = linkedinUser.email;
      const name = linkedinUser.name;

      // Find or create user
      let user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (!user) {
        const result = db.prepare('INSERT INTO users (email, name, role, type) VALUES (?, ?, ?, ?)')
          .run(email, name, 'customer', 'personal');
        user = { id: result.lastInsertRowid, email, name, role: 'customer' };
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  token: '${token}', 
                  user: ${JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role })} 
                }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (e: any) {
      console.error('LinkedIn OAuth Error:', e.response?.data || e.message);
      res.status(500).send('Authentication failed');
    }
  });

  // User Profile Routes
  app.get('/api/users/profile', authenticate, (req: any, res) => {
    const user: any = db.prepare('SELECT id, email, name, role, type, company_details, phone, avatar_url, preferences FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.company_details = JSON.parse(user.company_details || '{}');
    user.preferences = JSON.parse(user.preferences || '{"notifications": true, "emailNotifications": true, "currency": "USD", "language": "en"}');
    res.json(user);
  });

  app.put('/api/users/settings', authenticate, (req: any, res) => {
    const { phone, preferences, type } = req.body;
    try {
      db.prepare('UPDATE users SET phone = ?, preferences = ?, type = ? WHERE id = ?')
        .run(phone, JSON.stringify(preferences || {}), type, req.user.id);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Failed to update settings' });
    }
  });

  app.post('/api/users/change-password', authenticate, (req: any, res) => {
    const { currentPassword, newPassword } = req.body;
    const user: any = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
    if (bcrypt.compareSync(currentPassword, user.password)) {
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, req.user.id);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid current password' });
    }
  });

  app.put('/api/users/profile', authenticate, (req: any, res) => {
    const { name, type, company_details, phone, avatar_url } = req.body;
    try {
      db.prepare('UPDATE users SET name = ?, type = ?, company_details = ?, phone = ?, avatar_url = ? WHERE id = ?')
        .run(name, type, JSON.stringify(company_details || {}), phone, avatar_url, req.user.id);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Failed to update profile' });
    }
  });

  // RFQ Routes
  app.post('/api/rfqs', authenticate, (req: any, res) => {
    const { origin_country, destination_country, delivery_mode, quality_level, total_budget, currency, products } = req.body;
    const result = db.prepare('INSERT INTO rfqs (customer_id, origin_country, destination_country, delivery_mode, quality_level, total_budget, currency, status) VALUES (?, ?, ?, ?, ?, ?, ?, \'draft\')')
      .run(req.user.id, origin_country, destination_country, delivery_mode, quality_level, total_budget, currency);
    
    const rfqId = result.lastInsertRowid;
    const insertProduct = db.prepare('INSERT INTO rfq_products (rfq_id, name, category, photo_urls, website_link, quantity, unit, budget, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    
    for (const p of products) {
      insertProduct.run(rfqId, p.name, p.category, JSON.stringify(p.photo_urls || []), p.website_link, p.quantity, p.unit, p.budget, p.note);
    }
    
    res.json({ id: rfqId });
  });

  app.put('/api/rfqs/:id', authenticate, (req: any, res) => {
    const { origin_country, destination_country, delivery_mode, quality_level, total_budget, currency, products } = req.body;
    const rfqId = req.params.id;
    
    const rfq: any = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(rfqId);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
    if (rfq.customer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (rfq.status !== 'draft') {
      return res.status(400).json({ error: 'Only drafts can be updated' });
    }

    db.prepare('UPDATE rfqs SET origin_country = ?, destination_country = ?, delivery_mode = ?, quality_level = ?, total_budget = ?, currency = ? WHERE id = ?')
      .run(origin_country, destination_country, delivery_mode, quality_level, total_budget, currency, rfqId);
    
    db.prepare('DELETE FROM rfq_products WHERE rfq_id = ?').run(rfqId);
    const insertProduct = db.prepare('INSERT INTO rfq_products (rfq_id, name, category, photo_urls, website_link, quantity, unit, budget, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    
    for (const p of products) {
      insertProduct.run(rfqId, p.name, p.category, JSON.stringify(p.photo_urls || []), p.website_link, p.quantity, p.unit, p.budget, p.note);
    }
    
    res.json({ success: true });
  });

  app.delete('/api/rfqs/:id', authenticate, (req: any, res) => {
    const rfqId = req.params.id;
    const rfq: any = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(rfqId);
    
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
    if (rfq.customer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (rfq.status !== 'draft' && req.user.role !== 'admin') {
      return res.status(400).json({ error: 'Only drafts can be deleted' });
    }

    db.prepare('DELETE FROM rfq_products WHERE rfq_id = ?').run(rfqId);
    db.prepare('DELETE FROM rfqs WHERE id = ?').run(rfqId);
    
    res.json({ success: true });
  });

  app.patch('/api/rfqs/:id/submit', authenticate, (req: any, res) => {
    const rfqId = req.params.id;
    const { paymentProof, billingType } = req.body;
    const rfq: any = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(rfqId);
    
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
    if (rfq.customer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!validateRfqStatusTransition(rfq.status, 'submitted', req.user)) {
      return res.status(400).json({ error: `Invalid status transition from ${rfq.status} to submitted` });
    }

    db.prepare('UPDATE rfqs SET status = \'submitted\', payment_proof = ?, billing_type = ? WHERE id = ?')
      .run(paymentProof || null, billingType || 'receipt', rfqId);

    // Notify Admins/Shipping Agents
    const agents = db.prepare('SELECT id FROM users WHERE role IN (\'admin\', \'shipping_agent\')').all();
    for (const agent of agents as any[]) {
      createNotification(agent.id, 'New RFQ Submitted', `A new RFQ (#${rfqId}) has been submitted and is awaiting approval.`, 'info');
    }

    res.json({ success: true });
  });

  app.patch('/api/rfqs/:id/approve', authenticate, (req: any, res) => {
    if (req.user.role !== 'shipping_agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const rfqId = req.params.id;
    const rfq: any = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(rfqId);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

    if (!validateRfqStatusTransition(rfq.status, 'approved', req.user)) {
      return res.status(400).json({ error: `Invalid status transition from ${rfq.status} to approved` });
    }

    // Update RFQ status and payment status
    db.prepare('UPDATE rfqs SET status = \'approved\', payment_status = \'paid\', payment_date = CURRENT_TIMESTAMP WHERE id = ?').run(rfqId);

    // Generate Invoice/Receipt systematically
    const amount = 50; // Fixed sourcing fee for now
    const currency = rfq.currency || 'USD';
    const type = rfq.billing_type === 'invoice' ? 'sourcing_fee' : 'receipt';
    
    db.prepare(`
      INSERT INTO invoices (rfq_id, customer_id, amount, currency, status, type, due_date, paid_at)
      VALUES (?, ?, ?, ?, 'paid', ?, DATE('now', '+7 days'), CURRENT_TIMESTAMP)
    `).run(rfqId, rfq.customer_id, amount, currency, type);

    // Notify Customer
    createNotification(rfq.customer_id, 'RFQ Approved', `Your RFQ (#${rfqId}) has been approved. You can now view it in your dashboard.`, 'success');

    res.json({ success: true });
  });

  app.patch('/api/rfqs/:id/reject', authenticate, (req: any, res) => {
    if (req.user.role !== 'shipping_agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const rfq: any = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(req.params.id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

    if (!validateRfqStatusTransition(rfq.status, 'rejected', req.user)) {
      return res.status(400).json({ error: `Invalid status transition from ${rfq.status} to rejected` });
    }

    db.prepare('UPDATE rfqs SET status = \'rejected\' WHERE id = ?').run(req.params.id);
    
    if (rfq) {
      createNotification(rfq.customer_id, 'RFQ Rejected', `Your RFQ (#${req.params.id}) has been rejected. Please contact support for more details.`, 'error');
    }

    res.json({ success: true });
  });

  app.post('/api/rfqs/:id/pay', authenticate, (req: any, res) => {
    if (req.user.role !== 'customer') return res.status(403).json({ error: 'Forbidden' });
    
    const { paymentProof, billingType } = req.body;
    const rfq: any = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(req.params.id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

    if (!validateRfqStatusTransition(rfq.status, 'submitted', req.user)) {
      return res.status(400).json({ error: `Invalid status transition from ${rfq.status} to submitted` });
    }

    const result = db.prepare('UPDATE rfqs SET status = \'submitted\', payment_proof = ?, billing_type = ? WHERE id = ? AND customer_id = ?')
      .run(paymentProof, billingType || 'receipt', req.params.id, req.user.id);
    
    if (result.changes > 0) {
      // Notify Admins/Shipping Agents
      const agents = db.prepare('SELECT id FROM users WHERE role IN (\'admin\', \'shipping_agent\')').all();
      for (const agent of agents as any[]) {
        createNotification(agent.id, 'RFQ Payment Submitted', `Payment proof for RFQ (#${req.params.id}) has been uploaded.`, 'info');
      }
    }

    res.json({ success: true });
  });

  app.patch('/api/rfqs/:id/assign', authenticate, (req: any, res) => {
    if (req.user.role !== 'shipping_agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const rfq: any = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(req.params.id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

    if (!validateRfqStatusTransition(rfq.status, 'assigned', req.user)) {
      return res.status(400).json({ error: `Invalid status transition from ${rfq.status} to assigned` });
    }

    const { sourcing_agent_id } = req.body;
    db.prepare('UPDATE rfqs SET sourcing_agent_id = ?, status = \'assigned\' WHERE id = ?')
      .run(sourcing_agent_id, req.params.id);

    // Notify Sourcing Agent
    createNotification(sourcing_agent_id, 'New RFQ Assigned', `You have been assigned to a new RFQ (#${req.params.id}).`, 'info');

    res.json({ success: true });
  });

  app.get('/api/rfqs', authenticate, (req: any, res) => {
    let rfqs;
    if (req.user.role === 'customer') {
      rfqs = db.prepare('SELECT * FROM rfqs WHERE customer_id = ?').all(req.user.id);
    } else if (req.user.role === 'sourcing_agent') {
      rfqs = db.prepare('SELECT * FROM rfqs WHERE sourcing_agent_id = ?').all(req.user.id);
    } else {
      // Shipping agents and admins see all
      rfqs = db.prepare('SELECT * FROM rfqs').all();
    }
    
    const enrichedRfqs = rfqs.map((rfq: any) => {
      const products = db.prepare('SELECT * FROM rfq_products WHERE rfq_id = ?').all(rfq.id);
      rfq.products = products.map((p: any) => ({
        ...p,
        photo_urls: JSON.parse(p.photo_urls || '[]')
      }));
      return rfq;
    });
    
    res.json(enrichedRfqs);
  });

  app.get('/api/rfqs/:id', authenticate, (req: any, res) => {
    const rfq: any = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(req.params.id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
    const products = db.prepare('SELECT * FROM rfq_products WHERE rfq_id = ?').all(rfq.id);
    rfq.products = products.map((p: any) => ({
      ...p,
      photo_urls: JSON.parse(p.photo_urls || '[]')
    }));
    rfq.offers = db.prepare('SELECT * FROM offers WHERE rfq_id = ?').all(rfq.id).map((o: any) => {
      if (req.user.role === 'customer') {
        const { supplier_name, supplier_address, supplier_contact_person, supplier_email, hs_code, offer_pi_url, ...rest } = o;
        return rest;
      }
      return o;
    });
    res.json(rfq);
  });

  // Supplier Routes
  app.get('/api/suppliers', authenticate, (req: any, res) => {
    if (req.user.role !== 'sourcing_agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const suppliers = db.prepare('SELECT * FROM suppliers ORDER BY name ASC').all();
    res.json(suppliers);
  });

  app.post('/api/suppliers', authenticate, (req: any, res) => {
    if (req.user.role !== 'sourcing_agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { name, category, country, address, contact_person, contact_email, rating } = req.body;
    const result = db.prepare(`
      INSERT INTO suppliers (name, category, country, address, contact_person, contact_email, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, category, country, address, contact_person, contact_email, rating || 0);
    res.json({ id: result.lastInsertRowid });
  });

  // Offer Routes
  app.post('/api/offers', authenticate, (req: any, res) => {
    if (req.user.role !== 'sourcing_agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { 
      rfq_id, unit_price, total_exw, production_time, validity_date,
      quantity, quality_level, delivery_mode, delivery_sub_mode,
      volume_cbm, gross_weight_kg, delivery_deadline, offer_validity,
      payment_terms, exw_charges, shipping_cost, total_cfr, remarks,
      supplier_name, supplier_address, supplier_contact_person, supplier_email,
      hs_code, offer_pi_url, moq
    } = req.body;
    
    const rfq: any = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(rfq_id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

    if (req.user.role === 'sourcing_agent' && rfq.sourcing_agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You are not assigned as the sourcing agent for this RFQ' });
    }

    if (!validateRfqStatusTransition(rfq.status, 'shipping', req.user)) {
      return res.status(400).json({ error: `Invalid status transition from ${rfq.status} to shipping` });
    }

    const result = db.prepare(`
      INSERT INTO offers (
        rfq_id, sourcing_agent_id, unit_price, total_exw, production_time, validity_date, status,
        quantity, quality_level, delivery_mode, delivery_sub_mode, volume_cbm, gross_weight_kg,
        delivery_deadline, offer_validity, payment_terms, exw_charges, shipping_cost, total_cfr, remarks,
        supplier_name, supplier_address, supplier_contact_person, supplier_email, hs_code, offer_pi_url, moq
      )
      VALUES (?, ?, ?, ?, ?, ?, 'shipping_pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      rfq_id, req.user.id, unit_price, total_exw, production_time, validity_date,
      quantity, quality_level, delivery_mode, delivery_sub_mode, volume_cbm, gross_weight_kg,
      delivery_deadline, offer_validity, payment_terms, exw_charges, shipping_cost, total_cfr, remarks,
      supplier_name, supplier_address, supplier_contact_person, supplier_email, hs_code, offer_pi_url, moq
    );
    
    db.prepare('UPDATE rfqs SET status = \'shipping\' WHERE id = ?').run(rfq_id);

    // Notify Shipping Agents
    const shippingAgents = db.prepare('SELECT id FROM users WHERE role IN (\'admin\', \'shipping_agent\')').all();
    for (const agent of shippingAgents as any[]) {
      createNotification(agent.id, 'New Offer Created', `A sourcing agent has submitted an offer for RFQ (#${rfq_id}). Please add shipping details.`, 'info');
    }

    res.json({ id: result.lastInsertRowid });
  });

  app.patch('/api/offers/:id', authenticate, (req: any, res) => {
    if (req.user.role !== 'sourcing_agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { 
      unit_price, total_exw, production_time, validity_date,
      quantity, quality_level, delivery_mode, delivery_sub_mode,
      volume_cbm, gross_weight_kg, delivery_deadline, offer_validity,
      payment_terms, exw_charges, shipping_cost, total_cfr, remarks,
      supplier_name, supplier_address, supplier_contact_person, supplier_email,
      hs_code, offer_pi_url, moq
    } = req.body;
    
    const offer: any = db.prepare('SELECT * FROM offers WHERE id = ?').get(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });

    if (req.user.role === 'sourcing_agent' && offer.sourcing_agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You are not the owner of this offer' });
    }

    if (offer.status !== 'shipping_pending' && offer.status !== 'sourcing_pending') {
      return res.status(400).json({ error: 'Offer cannot be modified in its current status' });
    }

    db.prepare(`
      UPDATE offers 
      SET unit_price = ?, total_exw = ?, production_time = ?, validity_date = ?,
          quantity = ?, quality_level = ?, delivery_mode = ?, delivery_sub_mode = ?,
          volume_cbm = ?, gross_weight_kg = ?, delivery_deadline = ?, offer_validity = ?,
          payment_terms = ?, exw_charges = ?, shipping_cost = ?, total_cfr = ?, remarks = ?,
          supplier_name = ?, supplier_address = ?, supplier_contact_person = ?, supplier_email = ?,
          hs_code = ?, offer_pi_url = ?, moq = ?
      WHERE id = ?
    `).run(
      unit_price, total_exw, production_time, validity_date,
      quantity, quality_level, delivery_mode, delivery_sub_mode,
      volume_cbm, gross_weight_kg, delivery_deadline, offer_validity,
      payment_terms, exw_charges, shipping_cost, total_cfr, remarks,
      supplier_name, supplier_address, supplier_contact_person, supplier_email,
      hs_code, offer_pi_url, moq,
      req.params.id
    );

    res.json({ success: true });
  });

  app.patch('/api/offers/:id/shipping', authenticate, (req: any, res) => {
    if (req.user.role !== 'shipping_agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { shipping_cost, customs_cost, commission, total_cost, delivery_deadline, shipping_details } = req.body;
    
    const offer: any = db.prepare('SELECT rfq_id FROM offers WHERE id = ?').get(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    const rfq: any = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(offer.rfq_id);

    if (req.user.role === 'shipping_agent' && rfq.shipping_agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You are not assigned as the shipping agent for this RFQ' });
    }

    if (!validateRfqStatusTransition(rfq.status, 'offered', req.user)) {
      return res.status(400).json({ error: `Invalid status transition from ${rfq.status} to offered` });
    }

    db.prepare(`
      UPDATE offers 
      SET shipping_agent_id = ?, shipping_cost = ?, customs_cost = ?, commission = ?, total_cost = ?, delivery_deadline = ?, shipping_details = ?, status = 'ready'
      WHERE id = ?
    `).run(req.user.id, shipping_cost, customs_cost, commission, total_cost, delivery_deadline, JSON.stringify(shipping_details), req.params.id);
    
    db.prepare('UPDATE rfqs SET status = \'offered\' WHERE id = ?').run(offer.rfq_id);

    // Notify Customer
    if (rfq) {
      createNotification(rfq.customer_id, 'New Offer Received', `You have received a new offer for your RFQ (#${offer.rfq_id}).`, 'success', 'rfq-details', offer.rfq_id);
    }

    res.json({ success: true });
  });

  app.post('/api/offers/:id/approve', authenticate, (req: any, res) => {
    if (req.user.role !== 'customer') return res.status(403).json({ error: 'Forbidden' });
    
    const offer: any = db.prepare('SELECT * FROM offers WHERE id = ?').get(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });

    const rfq: any = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(offer.rfq_id);
    if (!validateRfqStatusTransition(rfq.status, 'ordered', req.user)) {
      return res.status(400).json({ error: `Invalid status transition from ${rfq.status} to ordered` });
    }

    db.prepare('UPDATE offers SET status = \'accepted\' WHERE id = ?').run(req.params.id);
    db.prepare('UPDATE rfqs SET status = \'ordered\' WHERE id = ?').run(offer.rfq_id);

    // Create product payment invoice
    db.prepare(`
      INSERT INTO invoices (rfq_id, customer_id, amount, currency, status, type, due_date)
      VALUES (?, ?, ?, ?, 'pending', 'product_payment', ?)
    `).run(offer.rfq_id, req.user.id, offer.total_cost, rfq.currency || 'USD', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

    // Notify Sourcing & Shipping Agents
    createNotification(offer.sourcing_agent_id, 'Offer Approved', `The customer has approved your offer for RFQ (#${offer.rfq_id}).`, 'success', 'rfq-details', offer.rfq_id);
    if (offer.shipping_agent_id) {
      createNotification(offer.shipping_agent_id, 'Offer Approved', `The customer has approved the offer for RFQ (#${offer.rfq_id}).`, 'success', 'rfq-details', offer.rfq_id);
    }

    res.json({ success: true });
  });

  // Sample Request Routes
  app.post('/api/sample-requests', authenticate, (req: any, res) => {
    if (req.user.role !== 'customer') return res.status(403).json({ error: 'Forbidden' });
    const { rfq_id, offer_id, details } = req.body;
    
    const offer: any = db.prepare('SELECT * FROM offers WHERE id = ?').get(offer_id);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });

    const result = db.prepare(`
      INSERT INTO sample_requests (rfq_id, offer_id, customer_id, sourcing_agent_id, shipping_agent_id, details, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `).run(rfq_id, offer_id, req.user.id, offer.sourcing_agent_id, offer.shipping_agent_id, details);

    // Notify Sourcing Agent
    createNotification(offer.sourcing_agent_id, 'New Sample Request', `A customer has requested a sample for Offer #${offer_id}. Please provide the sample cost.`, 'info', 'rfq-details', rfq_id);

    res.json({ id: result.lastInsertRowid });
  });

  app.get('/api/sample-requests', authenticate, (req: any, res) => {
    let requests;
    if (req.user.role === 'customer') {
      requests = db.prepare('SELECT * FROM sample_requests WHERE customer_id = ?').all(req.user.id);
    } else if (req.user.role === 'sourcing_agent') {
      requests = db.prepare('SELECT * FROM sample_requests WHERE sourcing_agent_id = ?').all(req.user.id);
    } else if (req.user.role === 'shipping_agent') {
      requests = db.prepare('SELECT * FROM sample_requests WHERE shipping_agent_id = ?').all(req.user.id);
    } else {
      requests = db.prepare('SELECT * FROM sample_requests').all();
    }
    res.json(requests);
  });

  app.get('/api/rfqs/:id/sample-requests', authenticate, (req: any, res) => {
    const requests = db.prepare('SELECT * FROM sample_requests WHERE rfq_id = ?').all(req.params.id);
    res.json(requests);
  });

  app.patch('/api/sample-requests/:id/sourcing', authenticate, (req: any, res) => {
    if (req.user.role !== 'sourcing_agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { sample_cost } = req.body;
    const request: any = db.prepare('SELECT * FROM sample_requests WHERE id = ?').get(req.params.id);
    if (!request) return res.status(404).json({ error: 'Sample request not found' });

    db.prepare('UPDATE sample_requests SET sample_cost = ?, status = \'sourcing_priced\', updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(sample_cost, req.params.id);

    // Notify Shipping Agent
    if (request.shipping_agent_id) {
      createNotification(request.shipping_agent_id, 'Sample Cost Prepared', `Sourcing agent has prepared the sample cost for Request #${req.params.id}. Please add shipping cost.`, 'info', 'rfq-details', request.rfq_id);
    } else {
      // If no shipping agent assigned to the offer yet, notify admins
      const admins = db.prepare('SELECT id FROM users WHERE role = \'admin\'').all();
      for (const admin of admins as any[]) {
        createNotification(admin.id, 'Sample Cost Prepared', `Sourcing agent has prepared the sample cost for Request #${req.params.id}. No shipping agent assigned.`, 'warning', 'rfq-details', request.rfq_id);
      }
    }

    res.json({ success: true });
  });

  app.patch('/api/sample-requests/:id/shipping', authenticate, (req: any, res) => {
    if (req.user.role !== 'shipping_agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { shipping_cost } = req.body;
    const request: any = db.prepare('SELECT * FROM sample_requests WHERE id = ?').get(req.params.id);
    if (!request) return res.status(404).json({ error: 'Sample request not found' });

    const total_cost = (request.sample_cost || 0) + shipping_cost;

    db.prepare('UPDATE sample_requests SET shipping_cost = ?, total_cost = ?, status = \'ready\', updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(shipping_cost, total_cost, req.params.id);

    // Notify Customer
    createNotification(request.customer_id, 'Sample Request Ready', `Your sample request for Request #${req.params.id} is ready for payment. Total cost: ${total_cost}`, 'success', 'rfq-details', request.rfq_id);

    res.json({ success: true });
  });

  app.post('/api/sample-requests/:id/pay', authenticate, (req: any, res) => {
    if (req.user.role !== 'customer') return res.status(403).json({ error: 'Forbidden' });
    const { payment_proof } = req.body;
    
    db.prepare('UPDATE sample_requests SET payment_status = \'paid\', status = \'paid\', payment_proof = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND customer_id = ?')
      .run(payment_proof, req.params.id, req.user.id);

    const request: any = db.prepare('SELECT * FROM sample_requests WHERE id = ?').get(req.params.id);
    
    // Notify Agents
    createNotification(request.sourcing_agent_id, 'Sample Paid', `Customer has paid for Sample Request #${req.params.id}.`, 'success', 'rfq-details', request.rfq_id);
    if (request.shipping_agent_id) {
      createNotification(request.shipping_agent_id, 'Sample Paid', `Customer has paid for Sample Request #${req.params.id}.`, 'success', 'rfq-details', request.rfq_id);
    }

    res.json({ success: true });
  });

  app.patch('/api/sample-requests/:id/ship', authenticate, (req: any, res) => {
    if (req.user.role !== 'shipping_agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { tracking_number } = req.body;
    
    db.prepare('UPDATE sample_requests SET tracking_number = ?, status = \'shipped\', updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(tracking_number, req.params.id);

    const request: any = db.prepare('SELECT * FROM sample_requests WHERE id = ?').get(req.params.id);
    
    // Notify Customer
    createNotification(request.customer_id, 'Sample Shipped', `Your sample for Request #${req.params.id} has been shipped. Tracking: ${tracking_number}`, 'success', 'rfq-details', request.rfq_id);

    res.json({ success: true });
  });

  // Shipment Routes
  app.post('/api/shipments', authenticate, (req: any, res) => {
    if (req.user.role !== 'shipping_agent' && req.user.role !== 'admin' && req.user.role !== 'sourcing_agent') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { 
      tracking_number, carrier, rfq_ids, origin, destination, estimated_delivery,
      transport_mode, packing_details, total_value, shipping_line, booking_number,
      bl_number, free_time, cut_off, etd, eta, transit_time, delivery_date,
      purchase_cost, freight_cost, customs_cost, selling_price
    } = req.body;
    
    // rfq_ids should be an array
    if (!Array.isArray(rfq_ids) || rfq_ids.length === 0) {
      return res.status(400).json({ error: 'At least one RFQ ID is required' });
    }

    // Get the first RFQ to derive the linked agents and customer
    const firstRfq: any = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(rfq_ids[0]);
    if (!firstRfq) {
      return res.status(400).json({ error: 'Invalid RFQ ID' });
    }

    // Find the accepted offer for this RFQ to get the sourcing agent
    const acceptedOffer: any = db.prepare('SELECT * FROM offers WHERE rfq_id = ? AND status = \'accepted\'').get(firstRfq.id);

    const result = db.prepare(`
      INSERT INTO shipments (
        tracking_number, carrier, origin, destination, estimated_delivery, 
        transport_mode, packing_details, total_value, shipping_line, booking_number,
        bl_number, free_time, cut_off, etd, eta, transit_time, delivery_date,
        status, customer_id, sourcing_agent_id, shipping_agent_id, offer_id,
        purchase_cost, freight_cost, customs_cost, selling_price
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      tracking_number, carrier, origin, destination, estimated_delivery,
      transport_mode, packing_details, total_value, shipping_line, booking_number,
      bl_number, free_time, cut_off, etd, eta, transit_time, delivery_date,
      firstRfq.customer_id, 
      acceptedOffer ? acceptedOffer.sourcing_agent_id : null,
      req.user.role === 'shipping_agent' ? req.user.id : null,
      acceptedOffer ? acceptedOffer.id : null,
      purchase_cost || 0,
      freight_cost || 0,
      customs_cost || 0,
      selling_price || 0
    );
    
    const shipmentId = result.lastInsertRowid;
    
    // Link RFQs to shipment
    const insertItem = db.prepare('INSERT INTO shipment_items (shipment_id, rfq_id) VALUES (?, ?)');
    const updateRfq = db.prepare('UPDATE rfqs SET status = \'shipped\' WHERE id = ?');
    
    for (const rfqId of rfq_ids) {
      const rfq: any = db.prepare('SELECT * FROM rfqs WHERE id = ?').get(rfqId);
      if (!rfq) continue;

      if (!validateRfqStatusTransition(rfq.status, 'shipped', req.user)) {
        // We might want to skip or error here. For now let's just log and continue if admin, or error if not.
        if (req.user.role !== 'admin') {
          return res.status(400).json({ error: `Invalid status transition for RFQ #${rfqId} from ${rfq.status} to shipped` });
        }
      }

      insertItem.run(shipmentId, rfqId);
      updateRfq.run(rfqId);

      // Notify Customer for each RFQ
      createNotification(rfq.customer_id, 'Shipment Created', `A new shipment has been created for your RFQ (#${rfqId}). Tracking: ${tracking_number}`, 'info');
    }
    
    // Initial update
    db.prepare(`
      INSERT INTO shipment_updates (shipment_id, location, description)
      VALUES (?, ?, ?)
    `).run(shipmentId, origin, 'Shipment created and pending pickup');
    
    // Sync to Firestore
    syncShipmentToFirestore(shipmentId);

    res.json({ id: shipmentId });
  });

  app.get('/api/shipments/:id', authenticate, (req: any, res) => {
    const shipment: any = db.prepare('SELECT * FROM shipments WHERE id = ?').get(req.params.id);
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
    
    // Get items
    const items = db.prepare(`
      SELECT r.* FROM rfqs r
      JOIN shipment_items si ON r.id = si.rfq_id
      WHERE si.shipment_id = ?
    `).all(req.params.id);
    
    shipment.items = items;
    res.json(shipment);
  });

  app.patch('/api/shipments/:id', authenticate, (req: any, res) => {
    if (req.user.role !== 'shipping_agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { status, location, description, purchase_cost, freight_cost, customs_cost, selling_price } = req.body;
    
    db.prepare(`
      UPDATE shipments 
      SET status = COALESCE(?, status), 
          purchase_cost = COALESCE(?, purchase_cost),
          freight_cost = COALESCE(?, freight_cost),
          customs_cost = COALESCE(?, customs_cost),
          selling_price = COALESCE(?, selling_price),
          last_update = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(status || null, purchase_cost || null, freight_cost || null, customs_cost || null, selling_price || null, req.params.id);
    
    if (location || description) {
      db.prepare(`
        INSERT INTO shipment_updates (shipment_id, location, description)
        VALUES (?, ?, ?)
      `).run(req.params.id, location || null, description || 'Status updated');
    }
    
    // Sync to Firestore
    syncShipmentToFirestore(req.params.id);
    
    res.json({ success: true });
  });

  app.get('/api/shipments', authenticate, (req: any, res) => {
    let shipments;
    if (req.user.role === 'customer') {
      shipments = db.prepare(`
        SELECT DISTINCT s.* FROM shipments s
        JOIN shipment_items si ON s.id = si.shipment_id
        JOIN rfqs r ON si.rfq_id = r.id
        WHERE r.customer_id = ?
      `).all(req.user.id);
    } else {
      shipments = db.prepare('SELECT * FROM shipments').all();
    }
    
    // Fetch updates and linked RFQs for each shipment
    const shipmentsWithDetails = shipments.map((s: any) => {
      const updates = db.prepare('SELECT * FROM shipment_updates WHERE shipment_id = ? ORDER BY date DESC').all(s.id);
      const items = db.prepare(`
        SELECT r.* FROM rfqs r
        JOIN shipment_items si ON r.id = si.rfq_id
        WHERE si.shipment_id = ?
      `).all(s.id);
      return { ...s, updates, items };
    });
    
    res.json(shipmentsWithDetails);
  });

  app.get('/api/users/agents', authenticate, (req: any, res) => {
    if (req.user.role !== 'shipping_agent' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const agents = db.prepare('SELECT id, name, email FROM users WHERE role = \'sourcing_agent\'').all();
    res.json(agents);
  });

  app.get('/api/users/chat-partners', authenticate, (req: any, res) => {
    const role = req.user.role;
    let partners = [];
    
    if (role === 'customer') {
      // Customers can chat with shipping agents and admins
      partners = db.prepare('SELECT uid, name, role, avatar_url FROM users WHERE role IN (\'shipping_agent\', \'admin\') AND uid IS NOT NULL').all();
    } else if (role === 'sourcing_agent') {
      // Sourcing agents can chat with shipping agents and admins
      partners = db.prepare('SELECT uid, name, role, avatar_url FROM users WHERE role IN (\'shipping_agent\', \'admin\') AND uid IS NOT NULL').all();
    } else if (role === 'shipping_agent') {
      // Shipping agents can chat with everyone
      partners = db.prepare('SELECT uid, name, role, avatar_url FROM users WHERE uid IS NOT NULL AND uid != ?').all(req.user.uid);
    } else if (role === 'admin') {
      // Admins can chat with everyone
      partners = db.prepare('SELECT uid, name, role, avatar_url FROM users WHERE uid IS NOT NULL AND uid != ?').all(req.user.uid);
    }
    
    res.json(partners);
  });

  // Finance Routes
  app.get('/api/finance/analytics', authenticate, (req: any, res) => {
    try {
      let totalSpend, pendingPayments, invoiceCount;
      
      if (req.user.role === 'customer') {
        totalSpend = db.prepare('SELECT SUM(amount) as total FROM invoices WHERE customer_id = ? AND status = \'paid\'').get(req.user.id);
        pendingPayments = db.prepare('SELECT SUM(amount) as total FROM invoices WHERE customer_id = ? AND status = \'pending\'').get(req.user.id);
        invoiceCount = db.prepare('SELECT COUNT(*) as count FROM invoices WHERE customer_id = ?').get(req.user.id);
      } else {
        // Admins and agents see global stats
        totalSpend = db.prepare('SELECT SUM(amount) as total FROM invoices WHERE status = \'paid\'').get();
        pendingPayments = db.prepare('SELECT SUM(amount) as total FROM invoices WHERE status = \'pending\'').get();
        invoiceCount = db.prepare('SELECT COUNT(*) as count FROM invoices').get();
      }
      
      const total = totalSpend?.total || 0;
      const pending = pendingPayments?.total || 0;
      const count = invoiceCount?.count || 0;
      const savings = total * 0.15;

      res.json({
        totalSpend: total,
        pendingPayments: pending,
        invoiceCount: count,
        savings: savings,
        monthlySpend: [
          { month: 'Jan', amount: 4500 },
          { month: 'Feb', amount: 5200 },
          { month: 'Mar', amount: total }
        ]
      });
    } catch (error) {
      console.error('Error fetching finance analytics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/invoices', authenticate, (req: any, res) => {
    try {
      let invoices;
      if (req.user.role === 'customer') {
        invoices = db.prepare('SELECT * FROM invoices WHERE customer_id = ? ORDER BY created_at DESC').all(req.user.id);
      } else if (req.user.role === 'admin' || req.user.role === 'shipping_agent') {
        invoices = db.prepare('SELECT * FROM invoices ORDER BY created_at DESC').all();
      } else if (req.user.role === 'sourcing_agent') {
        // Sourcing agents see invoices for their assigned RFQs
        invoices = db.prepare(`
          SELECT i.* FROM invoices i
          JOIN rfqs r ON i.rfq_id = r.id
          WHERE r.sourcing_agent_id = ?
          ORDER BY i.created_at DESC
        `).all(req.user.id);
      } else {
        invoices = [];
      }
      
      res.json(invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.patch('/api/invoices/:id/status', authenticate, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { status } = req.body;
    const invoiceId = req.params.id;
    
    try {
      db.prepare('UPDATE invoices SET status = ?, paid_at = ? WHERE id = ?')
        .run(status, status === 'paid' ? new Date().toISOString() : null, invoiceId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating invoice status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/invoices/:id/pay', authenticate, (req: any, res) => {
    if (req.user.role !== 'customer') return res.status(403).json({ error: 'Forbidden' });
    
    db.prepare('UPDATE invoices SET status = \'paid\', paid_at = CURRENT_TIMESTAMP WHERE id = ? AND customer_id = ?')
      .run(req.params.id, req.user.id);
    
    res.json({ success: true });
  });

  // Notification Routes
  app.get('/api/notifications', authenticate, (req: any, res) => {
    const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(req.user.id);
    res.json(notifications);
  });

  app.patch('/api/notifications/:id/read', authenticate, (req: any, res) => {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ success: true });
  });

  app.patch('/api/notifications/read-all', authenticate, (req: any, res) => {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.user.id);
    res.json({ success: true });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(3000, '0.0.0.0', () => {
      console.log('Server running on http://localhost:3000');
    });
  }

  return app;
}

let appPromise: Promise<express.Express> | null = null;

if (!process.env.VERCEL) {
  startServer();
}

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = startServer();
  }
  const app = await appPromise;
  return app(req, res);
}
