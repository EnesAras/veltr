import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getCategories, listProducts, findProductById } from "./products.js";
import { listShippingRates } from "./shippingRates.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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
  console.log(`veltr-backend listening on http://localhost:${port}`);
});
