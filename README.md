# ✦ ImpactGolf 
### Play with Passion, Win with Purpose.

**ImpactGolf** is a premium, full-stack MERN (MongoDB, Express, React, Node.js) SaaS platform designed for the modern golfer. It combines performance tracking with charitable giving and a high-stakes monthly prize pool. Users enter their golf scores to participate in global draws, while a percentage of every subscription and win is routed to world-changing charities.

**Live Demo:** [https://impact-golf-git-main-dhruv-mehtas-projects-6107db05.vercel.app/]

---

## 🚀 Key Features

### 👤 For Registered Subscribers
* **Performance Dashboard:** Log and track Stableford golf scores (1-45).
* **Impact Partners:** Select a charity of choice where 10% of all personal winnings are automatically donated.
* **Premium Subscription:** Integrated with **Stripe** for secure monthly ($10) and yearly recurring billing.
* **Prize Claims:** Built-in winner verification system where users upload proof of scores to claim their share of the pool.
* **Profile Management:** Securely update personal details and credentials via a dedicated settings portal.

### ⚙️ For Administrators
* **Analytics Command Center:** Real-time tracking of Total Users, Pro Subscribers, Global Prize Pool, and Impact Partners.
* **Proprietary Draw Engine:** A custom-built algorithm that generates monthly winning numbers and calculates prize splits across threetiers:
    * **Match 5:** 40% of the pool.
    * **Match 4:** 35% of the pool.
    * **Match 3:** 25% of the pool.
* **Charity Management:** Dynamic CRUD interface to add, edit, or remove partnered charities.
* **Winner Verification:** Reviewer panel to approve/reject claims and mark payouts as completed.

---

## 📈 Draw Engine Logic

The platform uses a tiered distribution logic to ensure maximum participation excitement:

$$Prize\_Pool = (Total\_Subscribers \times Monthly\_Fee) \times Platform\_Margin$$

**Winnings Breakdown:**
* **Match 5 Numbers:** $Pool \times 0.40 / Total\_Winners\_M5$
* **Match 4 Numbers:** $Pool \times 0.35 / Total\_Winners\_M4$
* **Match 3 Numbers:** $Pool \times 0.25 / Total\_Winners\_M3$

---

## 🔑 Admin Test Credentials
For the selection process review, use the following credentials to access the Admin Control Center:
* **Email:** `tiger@golf.com`
* **Password:** `supersecretpassword123` 

---

## 🛠️ Tech Stack

**Frontend:**
* **React.js** (Vite)
* **Tailwind CSS** (Modern dark-mode UI)
* **Framer Motion** (High-end animations & transitions)
* **Axios** (API communication)

**Backend:**
* **Node.js & Express.js**
* **MongoDB & Mongoose** (NoSQL Database)
* **JWT (JSON Web Tokens)** (Role-based authentication)
* **Bcrypt.js** (Secure password hashing)
* **Stripe API** (Payment processing)

---

## 🛠️Run the Application:
**In separate Terminals**
* **Backend:** `node server.js` (from backend folder)
* **Frontend:** `npm run dev` (from frontend folder)

---

**Built with ❤️ by Dhruv Mehta.**


