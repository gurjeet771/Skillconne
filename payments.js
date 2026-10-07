/* =========================================================
   SkillConnect - Payments
   File: payments.js
   ========================================================= */

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import { app } from "./firebase-config.js";

const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

/* =========================================================
   DEMO PAYMENT DATA
   ========================================================= */

const demoTransactions = [
    {
        id: "SC-2026-00110",
        service: "AC Service",
        amount: 650,
        date: "20 Sep 2026",
        time: "04:15 PM",
        status: "paid"
    },
    {
        id: "SC-2026-00098",
        service: "Home Cleaning",
        amount: 800,
        date: "15 Sep 2026",
        time: "12:20 PM",
        status: "paid"
    },
    {
        id: "SC-2026-00085",
        service: "Electrician Service",
        amount: 350,
        date: "10 Sep 2026",
        time: "03:30 PM",
        status: "paid"
    },
    {
        id: "SC-2026-00071",
        service: "Plumbing Service",
        amount: 500,
        date: "05 Sep 2026",
        time: "10:10 AM",
        status: "failed"
    }
];

let transactions = [...demoTransactions];

/* =========================================================
   AUTH
   ========================================================= */

onAuthStateChanged(auth, async (user) => {
    currentUser = user;

    if (user) {
        updateUserUI(user);
        await loadPayments(user);
    } else {
        updateUserUI(null);
        loadDemoPayments();
    }
});

/* =========================================================
   LOAD PAYMENTS
   ========================================================= */

async function loadPayments(user) {
    try {
        const q = query(
            collection(db, "payments"),
            where("customerId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            transactions = snapshot.docs.map((doc) => {
                const data = doc.data();

                return {
                    id: data.bookingId || doc.id,
                    service: data.service || "Service",
                    amount: Number(data.amount || data.price || 0),
                    date: formatDate(data.date),
                    time: data.time || "",
                    status: normalizeStatus(data.status)
                };
            });
        } else {
            loadDemoPayments();
        }

        renderTransactions();
        updateSummary();

    } catch (error) {
        console.error("Payment loading error:", error);

        showToast("Unable to load live payments. Showing demo data.");

        loadDemoPayments();
    }
}

/* =========================================================
   DEMO DATA
   ========================================================= */

function loadDemoPayments() {
    transactions = [...demoTransactions];

    renderTransactions();
    updateSummary();
}

/* =========================================================
   SUMMARY
   ========================================================= */

function updateSummary() {
    const totalSpent = transactions
        .filter(payment => payment.status === "paid")
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    const successful = transactions.filter(
        payment => payment.status === "paid"
    ).length;

    const pending = transactions
        .filter(payment => payment.status === "pending")
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    const totalTransactions = transactions.length;

    const totalSpentEl = document.getElementById("totalSpent");
    const successfulEl = document.getElementById("successfulPayments");
    const pendingEl = document.getElementById("pendingPayments");
    const countEl = document.getElementById("transactionCount");

    if (totalSpentEl) {
        totalSpentEl.textContent = `₹${totalSpent}`;
    }

    if (successfulEl) {
        successfulEl.textContent = successful;
    }

    if (pendingEl) {
        pendingEl.textContent = `₹${pending}`;
    }

    if (countEl) {
        countEl.textContent = totalTransactions;
    }
}

/* =========================================================
   TRANSACTIONS
   ========================================================= */

function renderTransactions() {
    const list = document.getElementById("transactionList");
    const emptyState = document.getElementById("noTransactions");
    const filter = document.getElementById("paymentStatusFilter");

    if (!list) return;

    const selectedStatus = filter ? filter.value : "all";

    const filtered = transactions.filter(payment => {
        if (selectedStatus === "all") {
            return true;
        }

        return payment.status === selectedStatus;
    });

    list.querySelectorAll(".transaction-item").forEach(item => {
        item.remove();
    });

    if (filtered.length === 0) {
        if (emptyState) {
            emptyState.style.display = "block";
        }

        return;
    }

    if (emptyState) {
        emptyState.style.display = "none";
    }

    filtered.forEach(payment => {
        const item = createTransactionElement(payment);
        list.appendChild(item);
    });
}

/* =========================================================
   CREATE TRANSACTION
   ========================================================= */

function createTransactionElement(payment) {
    const item = document.createElement("div");

    item.className = "transaction-item";
    item.dataset.status = payment.status;

    const iconClass =
        payment.status === "paid"
            ? "success"
            : payment.status === "failed"
                ? "failed"
                : "pending";

    const icon =
        payment.status === "paid"
            ? "✓"
            : payment.status === "failed"
                ? "!"
                : "◷";

    const statusText = payment.status.toUpperCase();

    const statusClass =
        payment.status === "paid"
            ? "transaction-status-paid"
            : payment.status === "failed"
                ? "transaction-status-failed"
                : "transaction-status-pending";

    item.innerHTML = `
        <div class="transaction-icon ${iconClass}">
            ${icon}
        </div>

        <div class="transaction-info">
            <h3>${escapeHTML(payment.service)}</h3>

            <p>
                Booking #${escapeHTML(payment.id)}
            </p>

            <div class="transaction-date">
                ${escapeHTML(payment.date)} · ${escapeHTML(payment.time)}
            </div>
        </div>

        <div class="transaction-amount">
            <strong>₹${Number(payment.amount || 0)}</strong>

            <span class="${statusClass}">
                ${statusText}
            </span>
        </div>
    `;

    return item;
}

/* =========================================================
   PENDING PAYMENT
   ========================================================= */

document.addEventListener("click", (event) => {
    const payButton = event.target.closest('[data-action="pay"]');

    if (!payButton) return;

    const bookingId = payButton.dataset.bookingId;

    handlePayment(bookingId);
});

function handlePayment(bookingId) {
    showToast(`Payment started for booking ${bookingId}.`);

    /*
       Real payment gateway can be connected later.

       Example future flow:
       Razorpay / Stripe / UPI
       -> payment success
       -> Firestore payment document
       -> booking status = PAID
    */
}

/* =========================================================
   PAYMENT FILTER
   ========================================================= */

const paymentFilter = document.getElementById("paymentStatusFilter");

if (paymentFilter) {
    paymentFilter.addEventListener("change", () => {
        renderTransactions();
    });
}

/* =========================================================
   SUPPORT
   ========================================================= */

const supportButton = document.getElementById("paymentSupportBtn");

if (supportButton) {
    supportButton.addEventListener("click", () => {
        showToast("Support request option will be available soon.");
    });
}

/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.getElementById("dashboardSidebar");

let sidebarOverlay = null;

if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");

        if (sidebar.classList.contains("open")) {
            createSidebarOverlay();
        } else {
            removeSidebarOverlay();
        }
    });
}

function createSidebarOverlay() {
    if (sidebarOverlay) return;

    sidebarOverlay = document.createElement("div");

    sidebarOverlay.style.position = "fixed";
    sidebarOverlay.style.inset = "0";
    sidebarOverlay.style.background = "rgba(15,23,42,.35)";
    sidebarOverlay.style.zIndex = "999";
    sidebarOverlay.style.cursor = "pointer";

    document.body.appendChild(sidebarOverlay);

    sidebarOverlay.addEventListener("click", closeSidebar);
}

function removeSidebarOverlay() {
    if (sidebarOverlay) {
        sidebarOverlay.remove();
        sidebarOverlay = null;
    }
}

function closeSidebar() {
    if (sidebar) {
        sidebar.classList.remove("open");
    }

    removeSidebarOverlay();
}

/* =========================================================
   LOGOUT
   ========================================================= */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);

            localStorage.removeItem("skillconnectUser");

            window.location.href = "login.html";

        } catch (error) {
            console.error("Logout error:", error);
            showToast("Logout failed. Please try again.");
        }
    });
}

/* =========================================================
   USER UI
   ========================================================= */

function updateUserUI(user) {
    if (!user) return;

    const name =
        user.displayName ||
        localStorage.getItem("skillconnectUserName") ||
        "Customer";

    const initials = getInitials(name);

    const sidebarName =
        document.getElementById("sidebarCustomerName");

    const sidebarAvatar =
        document.getElementById("sidebarCustomerAvatar");

    const headerName =
        document.getElementById("headerName");

    const headerAvatar =
        document.getElementById("headerAvatar");

    if (sidebarName) {
        sidebarName.textContent = name;
    }

    if (sidebarAvatar) {
        sidebarAvatar.textContent = initials;
    }

    if (headerName) {
        headerName.textContent = name;
    }

    if (headerAvatar) {
        headerAvatar.textContent = initials;
    }
}

/* =========================================================
   HELPERS
   ========================================================= */

function getInitials(name) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("");
}

function normalizeStatus(status) {
    const value = String(status || "").toLowerCase();

    if (
        value === "paid" ||
        value === "success" ||
        value === "successful"
    ) {
        return "paid";
    }

    if (
        value === "failed" ||
        value === "failure"
    ) {
        return "failed";
    }

    return "pending";
}

function formatDate(value) {
    if (!value) {
        return "Date unavailable";
    }

    if (typeof value === "string") {
        return value;
    }

    if (value.toDate) {
        return value.toDate().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    return String(value);
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {
    const toast = document.getElementById("dashboardToast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.skillConnectToastTimer);

    window.skillConnectToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}