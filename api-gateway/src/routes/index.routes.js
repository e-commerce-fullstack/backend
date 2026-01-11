import express from "express";
import axios from "axios";
import FormData from 'form-data'; // ✅ Don't forget this!
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { 
  AUTH_SERVICE_URL, 
  ORDER_SERVICE_URL, 
  PAYMENT_SERVICE_URL, 
  PRODUCT_SERVICE_URL 
} from "../configs/env.js";
import multer from 'multer';
const v1 = "/api/v1"; 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

// ⚠️ CRITICAL: Since your index.js likely uses app.use("/api/v1", routes),
// we do NOT add "/api/v1" here again. If we do, the url becomes /api/v1/api/v1/...
// If your index.js uses app.use("/", routes), then keep the prefix.
// Assuming standard practice: app.use("/api/v1", router) in main file.



/* ---------- Get User  ---------- */
router.get(`${v1}/auth/users/all`, async (req, res)=>{
  try {
    const r = await axios.get(`${AUTH_SERVICE_URL}/api/v1/auth/users/all`, {
      headers: { Authorization: req.headers.authorization}
      
    })
    res.json(r.data)
  } catch (e) {
    res.status(e.response?.status || 500).json({message: "Cannot fetch user info", data:e.response?.data})
  }
})


/* ---------- AUTH ---------- */
router.post(`${v1}/auth/login`, async (req, res) => {
  try {
    const r = await axios.post(`${AUTH_SERVICE_URL}/api/v1/auth/login`, req.body);
    res.json(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data);
  }
});

router.post(`${v1}/auth/register`, async (req, res) => {
  try {
    const r = await axios.post(`${AUTH_SERVICE_URL}/api/v1/auth/register`, req.body);
    res.json(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data);
  }
});

router.get(`${v1}/auth/me`, authMiddleware, async (req, res) => {
  try {
    const r = await axios.get(`${AUTH_SERVICE_URL}/api/v1/auth/me`, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data);
  }
});

// ✅ REFRESH TOKEN (The missing piece)
router.post(`${v1}/auth/refresh`, async (req, res) => {
  try {
    const r = await axios.post(`${AUTH_SERVICE_URL}/api/v1/auth/refresh`, req.body);
    res.json(r.data);
  } catch (e) {
    console.error("❌ Token Refresh Failed:", e.message);
    res.status(e.response?.status || 500).json(e.response?.data);
  }
});

/* ---------- PRODUCTS ---------- */

// 1. Get Categories (Must come BEFORE :id routes)
router.get(`${v1}/products/categories`, async (req, res) => {
  try {
    // Note: Ensure the path matches your Product Service (usually /api/v1/product/categories)
    const r = await axios.get(`${PRODUCT_SERVICE_URL}/api/v1/product/categories`);
    res.json(r.data);
  } catch (e) {
    console.error("❌ Categories Fetch Error:", e.response?.data || e.message);
    res.status(e.response?.status || 500).json(e.response?.data);
  }
});

// 2. Search Products
router.get(`${v1}/products/search`, async (req, res) => {
  try {
    const r = await axios.get(`${PRODUCT_SERVICE_URL}/api/v1/products/search`, { 
      params: req.query 
    });
    res.json(r.data);
  } catch (e) {
    res.status(500).json(e.response?.data);
  }
});


// Add product
router.post(`${v1}/products`, authMiddleware, upload.single('image'), async (req, res) => {
  console.log("🛠️ Gateway: Processing product with image...");
  
  try {
    const form = new FormData();
    
    // 1. Forward all text fields
    Object.keys(req.body).forEach(key => {
      form.append(key, req.body[key]);
    });

    // 2. Append the file if it exists
    if (req.file) {
      form.append('image', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
    }

    // 3. Send to Product Service (Port 4002)
    const response = await axios.post(`${PRODUCT_SERVICE_URL}/api/v1/product`, form, {
      headers: {
        ...form.getHeaders(), // ⚠️ CRITICAL
        Authorization: req.headers.authorization
      }
    });

    res.status(201).json(response.data);
  } catch (e) {
    console.error("❌ Gateway Proxy Error:", e.message);
    res.status(e.response?.status || 500).json(e.response?.data);
  }
});

// 3. Get All Products (with optional query params)
router.get(`${v1}/products`, async (req, res) => {
  try {
    const r = await axios.get(`${PRODUCT_SERVICE_URL}/api/v1/product`, { 
      params: req.query 
    });
    res.json(r.data);
  } catch (e) {
    console.error("❌ Products Fetch Error:", e.message);
    res.status(500).json(e.response?.data);
  }
});

// 4. Get Product By ID
router.get(`${v1}/products/:id`, async (req, res) => {
  try {
    const r = await axios.get(`${PRODUCT_SERVICE_URL}/api/v1/product/${req.params.id}`);
    res.json(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).json(e.response?.data);
  }
});

// 5. Update Product (Protected)
// Update product (Gateway)
router.put(`${v1}/products/:id`, authMiddleware, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  console.log(`🛠️ Gateway: Updating product ${id}...`);
  
  try {
    const form = new FormData();
    
    // 1. Append text fields (only append if they exist in req.body)
    Object.keys(req.body).forEach(key => {
      form.append(key, req.body[key]);
    });

    // 2. Append the NEW image if provided
    if (req.file) {
      form.append('image', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
    }

    // 3. Forward PUT request to Product Service
    const response = await axios.put(`${PRODUCT_SERVICE_URL}/api/v1/product/${id}`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: req.headers.authorization
      }
    });

    res.status(200).json(response.data);
  } catch (e) {
    console.error("❌ Gateway Update Error:", e.message);
    res.status(e.response?.status || 500).json(e.response?.data);
  }
});

// 6. Delete Product (Protected)
router.delete(`${v1}/products/:id`, authMiddleware, async (req, res) => {
  try {
    const r = await axios.delete(`${PRODUCT_SERVICE_URL}/api/v1/product/${req.params.id}`);
    res.json(r.data);
  } catch (e) {
    res.status(500).json(e.response?.data);
  }
});

/* ---------- ORDERS ---------- */
router.post(`${v1}/orders`, authMiddleware, async (req, res) => {
  try {
    console.log("📦 Creating Order for User:", req.user.id);

    const orderData = {
      userId: req.user.id || req.user._id,
      products: req.body.products,
      total: req.body.total,
    };

    const response = await axios.post(
      `${ORDER_SERVICE_URL}/api/v1/orders`, 
      orderData, 
      { 
        headers: { Authorization: req.headers.authorization },
        timeout: 5000 
      }
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('❌ Order Service Error:', err.message);
    res.status(err.response?.status || 500).json(err.response?.data || "Order Creation Failed");
  }
});

// GET Single Order (Critical for Payment Page)
router.get(`${v1}/orders/:id`, authMiddleware, async (req, res) => {
  try {
    const orderRes = await axios.get(`${ORDER_SERVICE_URL}/api/v1/orders/${req.params.id}`, {
      headers: { Authorization: req.headers.authorization },
    });
    
    // Simple enrichment (optional)
    const order = orderRes.data;
    
    res.json(order);
  } catch (err) {
    console.error("❌ Fetch Order Failed:", err.message);
    res.status(404).json({ message: "Order not found" });
  }
});

/* ---------- PAYMENTS (The Fix for 404 & $0.00) ---------- */
/* gateway/routes/index.routes.js */
router.post(`${v1}/payments`, authMiddleware, async (req, res) => {
  const pythonPayload = {
    order_id: req.body.orderId,          
    amount: parseFloat(req.body.total) || 0   // Ensure it defaults to 0 if total is missing
  };

  console.log("🚀 Sending to Python:", pythonPayload); // Check your terminal for this!

  try {
    const response = await axios.post(
      `${PAYMENT_SERVICE_URL}/api/v1/payments/generate`, 
      pythonPayload
    );
    res.json(response.data);
  } catch (err) {
    console.error("❌ Python Error Details:", err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data);
  }
});

// Status Check (Polling)
router.get(`${v1}/payments/status/:md5`, async (req, res) => {
  try {
    // Python Route: @router.get("/status/{md5}") inside /api/v1/payments prefix
    // So URL is: http://localhost:4004/api/v1/payments/status/{md5}
    const targetUrl = `${PAYMENT_SERVICE_URL}/api/v1/payments/status/${req.params.md5}`;
    
    const response = await axios.get(targetUrl);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data);
  }
});

export default router;