# Microservices Project

This repository contains a microservices setup for an e-commerce system, including API Gateway, Authentication, Product, Order, and Payment services.

---

## Tech Stack

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![REST API](https://img.shields.io/badge/REST_API-FF6C37?style=for-the-badge)

---

## Services

| Service            | Language | Description                           |
|-------------------|----------|----------------------------------------|
| api-gateway       | Node.js  | Handles routing and gateway logic      |
| auth-service      | Node.js  | Authentication and user management     |
| product-service   | Node.js  | Product management                     |
| order-service     | Node.js  | Order management                       |
| payment-service   | Python   | Payment processing using FastAPI       |

---

## Prerequisites

- Node.js >= 16
- npm >= 8
- Python >= 3.10
- pip
- MongoDB (running cloud cluster)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/e-commerce-fullstack/backend.git microservice
cd microservice
```

## Artchitecture / Folder Structure
```
microservice/
├── api-gateway/
│   ├── package.json
│   └── src/
│       ├── configs/env.js
│       ├── middlewares/auth.middleware.js
│       ├── routes/index.routes.js
│       └── server.js
├── auth-service/
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── configs/env.js
│       ├── controllers/auth.controller.js
│       ├── database/
│       │   ├── models/
│       │   └── repositories/
│       ├── middlewares/
│       ├── routes/auth.routes.js
│       └── services/auth.service.js
├── order-service/
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── controllers/order.controller.js
│       ├── database/
│       │   ├── models/
│       │   └── repositories/
│       ├── middlewares/
│       ├── routes/order.routes.js
│       └── services/order.service.js
├── payment-service/
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── config.py
│       ├── controllers/payment_controller.py
│       ├── database/
│       │   ├── models/
│       │   └── repositories/
│       ├── middlewares/auth_middleware.py
│       ├── routes/payment_routes.py
│       └── services/payment_service.py
├── product-service/
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── controllers/product.controller.js
│       ├── database/
│       │   ├── models/
│       │   └── repositories/
│       ├── middlewares/
│       ├── routes/product.routes.js
│       └── services/product.service.js
└── README.md


```