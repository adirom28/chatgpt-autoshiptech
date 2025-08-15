import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { db } from './pg.js';
import { quotePrice } from './pricing.js';
import { roughDistanceMiles } from './roughDistance.js';

dotenv.config();
const app = express();

// CORS
const corsOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s=>s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || corsOrigins.includes(origin)) return cb(null, true);
    return cb(null, true); // relax for MVP
  },
  credentials: true
}));

app.use(bodyParser.json());

app.get('/api/health', (req,res)=> res.json({ ok: true }));

app.post('/api/quote', async (req,res)=>{
  try {
    const { publishableKey, origin, destination, vehicle, trailerType, operable } = req.body || {};
    if (!publishableKey) return res.status(400).json({ error: 'Missing publishableKey' });

    const site = await db.oneOrNone('SELECT id FROM partner_sites WHERE publishable_key=$1', [publishableKey]);
    if (!site) return res.status(400).json({ error: 'Invalid publishable key' });

    const distance = await roughDistanceMiles(origin?.zip, destination?.zip);
    const { price, breakdown } = quotePrice({ distance, trailerType, operable });

    const q = await db.one(
      `INSERT INTO quotes (partner_site_id, origin_zip, dest_zip, distance_miles, vehicle_year, vehicle_make, vehicle_model, operable, trailer_type, price_usd, response)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [site.id, origin?.zip, destination?.zip, distance, vehicle?.year, vehicle?.make, vehicle?.model, !!operable, trailerType || 'open', price, { breakdown }]
    );

    res.json({ quoteId: q.id, price, breakdown });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.post('/api/book', async (req,res)=>{
  try {
    const { quoteId, customer, pickupDate, notes } = req.body || {};
    if (!quoteId) return res.status(400).json({ error: 'Missing quoteId' });

    const quote = await db.oneOrNone('SELECT id FROM quotes WHERE id=$1', [quoteId]);
    if (!quote) return res.status(400).json({ error: 'Invalid quoteId' });

    const b = await db.one(
      `INSERT INTO bookings (quote_id, customer_name, customer_phone, customer_email, pickup_date, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, status`,
      [quoteId, customer?.name, customer?.phone, customer?.email, pickupDate || null, notes || null]
    );
    res.json({ bookingId: b.id, status: b.status });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  }
});

// Stripe webhook stub (implement verification in prod)
app.post('/api/webhooks/stripe', bodyParser.raw({ type: 'application/json' }), (req,res)=>{
  try {
    // TODO: verify signature, update subscriptions
    res.json({ received: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Webhook error' });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log(`API listening on :${port}`));
