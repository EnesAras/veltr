import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import Stripe from "stripe";
import { getCategories, listProducts, findProductById } from "./products.js";
import { listShippingRates } from "./shippingRates.js";

function rawBodySaver(req, _res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
}

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ verify: rawBodySaver }));

const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15"
    })
  : null;
const carts = new Map();
const orders = new Map();
const pendingSessions = new Map();

const JWT_SECRET = process.env.JWT_SECRET || "veltr_dev_secret";
const TOKEN_EXPIRY = "7d";
const users = [];

function getProduct(productId) {
  return listProducts().find((product) => product.id === productId) ?? null;
}

function normalizeCartItems(items) {
  if (!Array.isArray(items)) {
    throw new ApiError(400, "items must be an array");
  }
  return items.map((entry) => {
    const productId = entry.productId ?? entry.id;
    if (!productId) {
      throw new ApiError(400, "productId is required for cart items");
    }
    const qty = Number(entry.qty ?? entry.quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      throw new ApiError(400, "qty must be a positive integer");
    }
    const product = getProduct(productId);
    if (!product) {
      throw new ApiError(400, `Product not found: ${productId}`);
    }
    return {
      productId: product.id,
      qty,
      name: product.name,
      price: product.price,
      image: product.image
    };
  });
}

function getCartItems(userId) {
  return carts.get(userId)?.items ?? [];
}

function setCartItems(userId, items) {
  carts.set(userId, { items });
}

function mergeCartEntries(existing, incoming) {
  const lookup = new Map();
  existing.forEach((item) => {
    lookup.set(item.productId, { ...item });
  });
  incoming.forEach((item) => {
    const current = lookup.get(item.productId);
    if (current) {
      current.qty = current.qty + item.qty;
    } else {
      lookup.set(item.productId, { ...item });
    }
  });
  return Array.from(lookup.values());
}

function buildCartResponse(userId) {
  const items = getCartItems(userId);
  const normalized = items
    .map((entry) => getProduct(entry.productId))
    .filter(Boolean)
    .map((product) => {
      const match = items.find((item) => item.productId === product.id);
      return {
        productId: product.id,
        qty: match.qty,
        name: product.name,
        price: product.price,
        image: product.image
      };
    });
  const subtotal = normalized.reduce((acc, item) => acc + item.price * item.qty, 0);
  return { items: normalized, subtotal };
}

function clearCart(userId) {
  carts.delete(userId);
}

function getOrdersForUser(userId) {
  return orders.get(userId) ?? [];
}

function enqueueOrder(userId, order) {
  const existing = [...getOrdersForUser(userId)];
  existing.push(order);
  orders.set(userId, existing);
}

function findOrderBySession(userId, sessionId) {
  if (!sessionId) {
    return null;
  }
  return getOrdersForUser(userId).find((entry) => entry.sessionId === sessionId) ?? null;
}

function createOrderRecord(userId, items, total, sessionId = null) {
  const order = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    userId,
    sessionId,
    items,
    total,
    status: "paid",
    createdAt: new Date().toISOString()
  };
  enqueueOrder(userId, order);
  return order;
}

function createToken(user) {
  return jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function validatePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return sendError(res, new ApiError(401, "Missing authorization header"));
  }
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return sendError(res, new ApiError(401, "Invalid authorization format"));
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users.find((entry) => entry.id === payload.sub);
    if (!user) {
      return sendError(res, new ApiError(401, "Invalid token"));
    }
    req.user = sanitizeUser(user);
    req.token = token;
    next();
  } catch (error) {
    return sendError(res, new ApiError(401, "Invalid or expired token"));
  }
}

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function parsePositiveInteger(value, fallback, name) {
  if (value === undefined) {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ApiError(400, `${name} must be a positive integer`);
  }
  return parsed;
}

function parseNumber(value, name) {
  if (value === undefined || value === "") {
    return null;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new ApiError(400, `${name} must be a number`);
  }
  return parsed;
}

function sendError(res, error) {
  const status = error.status ?? 400;
  res.status(status).json({ error: error.message });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "veltr-backend" });
});

app.get("/api/categories", (_req, res) => {
  res.json({ categories: getCategories() });
});

app.get("/api/shipping-rates", (_req, res) => {
  res.json({ rates: listShippingRates() });
});

app.get("/api/cart", authenticate, (req, res) => {
  res.json(buildCartResponse(req.user.id));
});

app.put("/api/cart", authenticate, (req, res) => {
  try {
    const items = normalizeCartItems(req.body?.items ?? []);
    setCartItems(req.user.id, items);
    res.json(buildCartResponse(req.user.id));
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/cart/merge", authenticate, (req, res) => {
  try {
    const incoming = normalizeCartItems(req.body?.items ?? []);
    const existing = getCartItems(req.user.id);
    const merged = mergeCartEntries(existing, incoming);
    setCartItems(req.user.id, merged);
    res.json(buildCartResponse(req.user.id));
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email, and password are required");
    }
    const normalizedEmail = email.toString().trim().toLowerCase();
    if (users.some((user) => user.email === normalizedEmail)) {
      throw new ApiError(409, "Email is already registered");
    }
    const hashed = await hashPassword(password.toString());
    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      name: name.toString().trim(),
      email: normalizedEmail,
      password: hashed
    };
    users.push(newUser);
    const user = sanitizeUser(newUser);
    res.json({ user, token: createToken(newUser) });
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }
    const normalizedEmail = email.toString().trim().toLowerCase();
    const found = users.find((user) => user.email === normalizedEmail);
    if (!found) {
      throw new ApiError(401, "Invalid credentials");
    }
    const valid = await validatePassword(password.toString(), found.password);
    if (!valid) {
      throw new ApiError(401, "Invalid credentials");
    }
    const user = sanitizeUser(found);
    res.json({ user, token: createToken(found) });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/auth/me", authenticate, (_req, res) => {
  res.json({ user: req.user });
});

app.get("/api/orders", authenticate, (req, res) => {
  const records = [...getOrdersForUser(req.user.id)].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json({ orders: records });
});

app.post("/api/checkout/session", authenticate, async (req, res) => {
  if (!stripe) {
    return sendError(res, new ApiError(500, "Stripe is not configured"));
  }
  try {
    const cart = buildCartResponse(req.user.id);
    if (!cart.items.length) {
      throw new ApiError(400, "Cart is empty");
    }
    const line_items = cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.name
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.qty
    }));
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout/cancel`
    });
    pendingSessions.set(session.id, {
      userId: req.user.id,
      items: cart.items,
      total: cart.subtotal
    });
    res.json({ url: session.url });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/checkout/confirm", authenticate, async (req, res) => {
  if (!stripe) {
    return sendError(res, new ApiError(500, "Stripe is not configured"));
  }
  try {
    const sessionId = req.query.session_id ?? req.query.sessionId;
    if (!sessionId) {
      throw new ApiError(400, "session_id query is required");
    }
    const existingOrder = findOrderBySession(req.user.id, sessionId);
    if (existingOrder) {
      return res.json({ order: existingOrder });
    }
    const pending = pendingSessions.get(sessionId);
    if (!pending || pending.userId !== req.user.id) {
      throw new ApiError(404, "Checkout session not found");
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      throw new ApiError(400, "Payment has not completed yet");
    }
    const order = createOrderRecord(req.user.id, pending.items, pending.total, sessionId);
    clearCart(req.user.id);
    pendingSessions.delete(sessionId);
    res.json({ order });
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/webhooks/stripe", (req, res) => {
  const signature = req.headers["stripe-signature"];
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).send("Webhook endpoint not configured");
  }
  if (!signature) {
    return res.status(400).send("Missing signature");
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const pending = pendingSessions.get(session.id);
    const existingOrder = pending ? findOrderBySession(pending.userId, session.id) : null;
    if (existingOrder) {
      pendingSessions.delete(session.id);
    } else if (pending) {
      createOrderRecord(pending.userId, pending.items, pending.total, session.id);
      clearCart(pending.userId);
      pendingSessions.delete(session.id);
    }
  }
  res.json({ received: true });
});

app.get("/api/products", (req, res) => {
  try {
    const { q, category, sort = "newest" } = req.query;
    const page = parsePositiveInteger(req.query.page, 1, "page");
    const limit = parsePositiveInteger(req.query.limit, 12, "limit");
    const minPrice = parseNumber(req.query.minPrice, "minPrice");
    const maxPrice = parseNumber(req.query.maxPrice, "maxPrice");

    if (maxPrice != null && minPrice != null && maxPrice < minPrice) {
      throw new ApiError(400, "maxPrice must be greater than or equal to minPrice");
    }

    const validSorts = new Set(["price_asc", "price_desc", "newest"]);
    if (sort && !validSorts.has(sort)) {
      throw new ApiError(400, "sort must be one of price_asc, price_desc, or newest");
    }

    let items = [...listProducts()];

    if (q) {
      const normalized = q.toString().trim().toLowerCase();
      items = items.filter((product) => product.name.toLowerCase().includes(normalized));
    }

    if (category) {
      items = items.filter((product) => product.category === category);
    }

    if (minPrice != null) {
      items = items.filter((product) => product.price >= minPrice);
    }

    if (maxPrice != null) {
      items = items.filter((product) => product.price <= maxPrice);
    }

    if (sort === "price_asc") {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      items.sort((a, b) => b.price - a.price);
    } else {
      items.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const total = items.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const startIndex = (page - 1) * limit;
    const pagedItems = items.slice(startIndex, startIndex + limit);

    res.json({
      items: pagedItems,
      meta: {
        page,
        limit,
        total,
        pages
      }
    });
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/products/:id", (req, res) => {
  const product = findProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json({ product });
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`API: http://localhost:${port}`);
  console.log(`veltr-backend listening on http://localhost:${port}`);
});
