/* =========================================================
   SKILLCONNECT - NOTIFICATIONS
   notifications.js
   ========================================================= */

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import { app } from "./firebase-config.js";


/* =========================================================
   FIREBASE
   ========================================================= */

const auth = getAuth(app);
const db = getFirestore(app);


/* =========================================================
   DOM
   ========================================================= */

const notificationList =
    document.getElementById("notificationList");

const notificationsEmpty =
    document.getElementById("notificationsEmpty");

const notificationLoading =
    document.getElementById("notificationLoading");

const unreadNotificationCount =
    document.getElementById(
        "unreadNotificationCount"
    );

const notificationCountBadge =
    document.getElementById(
        "notificationCountBadge"
    );

const markAllReadBtn =
    document.getElementById(
        "markAllReadBtn"
    );

const clearAllNotificationsBtn =
    document.getElementById(
        "clearAllNotificationsBtn"
    );

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );

const dashboardSidebar =
    document.getElementById(
        "dashboardSidebar"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const sidebarCustomerName =
    document.getElementById(
        "sidebarCustomerName"
    );

const headerName =
    document.getElementById(
        "headerName"
    );

const sidebarCustomerAvatar =
    document.getElementById(
        "sidebarCustomerAvatar"
    );

const headerAvatar =
    document.getElementById(
        "headerAvatar"
    );

const dashboardToast =
    document.getElementById(
        "dashboardToast"
    );


/* =========================================================
   STATE
   ========================================================= */

let activeFilter = "all";

let notifications = [];


/* =========================================================
   DEMO DATA
   ========================================================= */

const demoNotifications = [
    {
        id: "notification-001",
        type: "booking",
        icon: "📅",
        iconClass: "booking",
        title: "Booking Accepted",
        message:
            "Your Bathroom Cleaning booking has been accepted. Your service is scheduled for 25 September at 11:00 AM.",
        time: "10 minutes ago",
        unread: true,
        action: "view-booking",
        bookingId: "sample-001"
    },

    {
        id: "notification-002",
        type: "job",
        icon: "✓",
        iconClass: "success",
        title: "New Worker Offer",
        message:
            "Rajesh Kumar has sent you an offer of ₹400 for your Bathroom Cleaning job.",
        time: "35 minutes ago",
        unread: true,
        action: "view-job",
        jobId: "JOB-2026-00125"
    },

    {
        id: "notification-003",
        type: "payment",
        icon: "₹",
        iconClass: "payment",
        title: "Payment Reminder",
        message:
            "Your payment of ₹400 for Bathroom Cleaning is pending after service completion.",
        time: "1 hour ago",
        unread: true,
        action: "payment"
    },

    {
        id: "notification-004",
        type: "booking",
        icon: "✓",
        iconClass: "success",
        title: "Service Completed",
        message:
            "Your AC Service booking has been successfully completed. You can now rate and review the professional.",
        time: "Yesterday",
        unread: false,
        action: "review",
        bookingId: "sample-002"
    },

    {
        id: "notification-005",
        type: "system",
        icon: "⚙",
        iconClass: "system",
        title: "Welcome to SkillConnect",
        message:
            "Your account is ready. Find trusted professionals or post a job to receive offers from nearby workers.",
        time: "2 days ago",
        unread: false,
        action: "none"
    }
];


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   SHOW TOAST
   ========================================================= */

let toastTimer;

function showToast(message) {

    if (!dashboardToast) return;

    dashboardToast.textContent =
        message;

    dashboardToast.classList.add(
        "show"
    );

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(
            () => {

                dashboardToast.classList.remove(
                    "show"
                );

            },
            2500
        );
}


/* =========================================================
   SAVE LOCAL NOTIFICATIONS
   ========================================================= */

function saveNotifications() {

    try {

        localStorage.setItem(
            "skillconnectNotifications",
            JSON.stringify(notifications)
        );

    } catch (error) {

        console.error(
            "Unable to save notifications:",
            error
        );
    }
}


/* =========================================================
   LOAD LOCAL NOTIFICATIONS
   ========================================================= */

function loadLocalNotifications() {

    try {

        const saved =
            localStorage.getItem(
                "skillconnectNotifications"
            );

        if (!saved) {
            return false;
        }

        const parsed =
            JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            return false;
        }

        notifications = parsed;

        return true;

    } catch (error) {

        console.error(
            "Unable to load local notifications:",
            error
        );

        return false;
    }
}


/* =========================================================
   FIRESTORE NOTIFICATIONS
   ========================================================= */

async function loadFirestoreNotifications(user) {

    try {

        const notificationsRef =
            collection(
                db,
                "notifications"
            );

        const notificationsQuery =
            query(
                notificationsRef,
                where(
                    "userId",
                    "==",
                    user.uid
                )
            );

        const snapshot =
            await getDocs(
                notificationsQuery
            );


        snapshot.forEach(
            docSnapshot => {

                const data =
                    docSnapshot.data();

                const notification = {

                    id:
                        docSnapshot.id,

                    type:
                        data.type ||
                        "system",

                    icon:
                        data.icon ||
                        "♢",

                    iconClass:
                        data.iconClass ||
                        data.type ||
                        "system",

                    title:
                        data.title ||
                        "Notification",

                    message:
                        data.message ||
                        "",

                    time:
                        data.time ||
                        "Recently",

                    unread:
                        data.read !== true,

                    action:
                        data.action ||
                        "none",

                    bookingId:
                        data.bookingId ||
                        "",

                    jobId:
                        data.jobId ||
                        ""
                };


                const existingIndex =
                    notifications.findIndex(
                        item =>
                            item.id ===
                            notification.id
                    );


                if (existingIndex >= 0) {

                    notifications[
                        existingIndex
                    ] = notification;

                } else {

                    notifications.push(
                        notification
                    );
                }
            }
        );

    } catch (error) {

        console.error(
            "Firestore notifications error:",
            error
        );
    }
}


/* =========================================================
   RENDER NOTIFICATIONS
   ========================================================= */

function renderNotifications() {

    if (!notificationList) return;


    let filtered =
        notifications;


    if (activeFilter !== "all") {

        if (activeFilter === "unread") {

            filtered =
                notifications.filter(
                    item => item.unread
                );

        } else {

            filtered =
                notifications.filter(
                    item =>
                        item.type ===
                        activeFilter
                );
        }
    }


    if (!filtered.length) {

        notificationList.innerHTML = "";

        if (notificationsEmpty) {
            notificationsEmpty.style.display =
                "block";
        }

        updateUnreadCount();

        return;
    }


    if (notificationsEmpty) {
        notificationsEmpty.style.display =
            "none";
    }


    notificationList.innerHTML =
        filtered.map(
            notification => {

                const unreadClass =
                    notification.unread
                        ? " unread"
                        : "";


                const unreadDot =
                    notification.unread
                        ? `<div class="notification-unread-dot"></div>`
                        : "";


                return `
                    <div
                        class="notification-item${unreadClass}"
                        data-type="${escapeHTML(notification.type)}"
                        data-id="${escapeHTML(notification.id)}"
                    >

                        <div class="notification-item-icon ${escapeHTML(notification.iconClass)}">
                            ${escapeHTML(notification.icon)}
                        </div>

                        <div class="notification-content">

                            <h3>
                                ${escapeHTML(notification.title)}
                            </h3>

                            <p>
                                ${escapeHTML(notification.message)}
                            </p>

                            <span class="notification-time">
                                ${escapeHTML(notification.time)}
                            </span>

                        </div>

                        ${unreadDot}

                        <div class="notification-actions">

                            ${getActionButton(notification)}

                            ${
                                notification.unread
                                    ? `
                                    <button
                                        type="button"
                                        class="notification-action-btn"
                                        title="Mark as read"
                                        data-action="read"
                                    >
                                        ✓
                                    </button>
                                    `
                                    : ""
                            }

                        </div>

                    </div>
                `;
            }
        ).join("");


    updateUnreadCount();
}


/* =========================================================
   ACTION BUTTON
   ========================================================= */

function getActionButton(notification) {

    if (
        notification.action ===
        "view-booking"
    ) {

        return `
            <button
                type="button"
                class="notification-action-btn"
                title="View Booking"
                data-action="view-booking"
                data-booking-id="${escapeHTML(notification.bookingId)}"
            >
                ↗
            </button>
        `;
    }


    if (
        notification.action ===
        "view-job"
    ) {

        return `
            <button
                type="button"
                class="notification-action-btn"
                title="View Job"
                data-action="view-job"
                data-job-id="${escapeHTML(notification.jobId)}"
            >
                ↗
            </button>
        `;
    }


    if (
        notification.action ===
        "payment"
    ) {

        return `
            <button
                type="button"
                class="notification-action-btn"
                title="Make Payment"
                data-action="payment"
            >
                ₹
            </button>
        `;
    }


    if (
        notification.action ===
        "review"
    ) {

        return `
            <button
                type="button"
                class="notification-action-btn"
                title="Review Service"
                data-action="review"
                data-booking-id="${escapeHTML(notification.bookingId)}"
            >
                ★
            </button>
        `;
    }


    return "";
}


/* =========================================================
   UPDATE UNREAD COUNT
   ========================================================= */

function updateUnreadCount() {

    const count =
        notifications.filter(
            notification =>
                notification.unread
        ).length;


    if (unreadNotificationCount) {

        unreadNotificationCount.textContent =
            count;
    }


    if (notificationCountBadge) {

        notificationCountBadge.textContent =
            count;
    }
}


/* =========================================================
   MARK NOTIFICATION READ
   ========================================================= */

function markNotificationRead(id) {

    const notification =
        notifications.find(
            item =>
                item.id === id
        );


    if (!notification) return;


    notification.unread = false;

    saveNotifications();

    renderNotifications();

    showToast(
        "Notification marked as read."
    );
}


/* =========================================================
   MARK ALL READ
   ========================================================= */

function markAllAsRead() {

    notifications.forEach(
        notification => {

            notification.unread = false;
        }
    );

    saveNotifications();

    renderNotifications();

    showToast(
        "All notifications marked as read."
    );
}


/* =========================================================
   CLEAR ALL
   ========================================================= */

function clearAllNotifications() {

    const confirmed =
        window.confirm(
            "Are you sure you want to clear all notifications?"
        );


    if (!confirmed) {
        return;
    }


    notifications = [];

    saveNotifications();

    renderNotifications();

    showToast(
        "All notifications cleared."
    );
}


/* =========================================================
   ACTION HANDLER
   ========================================================= */

function handleNotificationAction(
    action,
    notificationElement,
    button
) {

    const id =
        notificationElement.dataset.id;


    if (action === "read") {

        markNotificationRead(id);

        return;
    }


    if (action === "view-booking") {

        const bookingId =
            button.dataset.bookingId;

        markNotificationRead(id);

        window.location.href =
            "booking-details.html?id=" +
            encodeURIComponent(
                bookingId || ""
            );

        return;
    }


    if (action === "view-job") {

        const jobId =
            button.dataset.jobId;

        markNotificationRead(id);

        window.location.href =
            "job-details.html?id=" +
            encodeURIComponent(
                jobId || ""
            );

        return;
    }


    if (action === "payment") {

        markNotificationRead(id);

        window.location.href =
            "payments.html";

        return;
    }


    if (action === "review") {

        const bookingId =
            button.dataset.bookingId;

        markNotificationRead(id);

        window.location.href =
            "reviews.html?bookingId=" +
            encodeURIComponent(
                bookingId || ""
            );

        return;
    }
}


/* =========================================================
   EVENT DELEGATION
   ========================================================= */

if (notificationList) {

    notificationList.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button) {
                return;
            }


            const notificationElement =
                button.closest(
                    ".notification-item"
                );


            if (!notificationElement) {
                return;
            }


            handleNotificationAction(
                button.dataset.action,
                notificationElement,
                button
            );
        }
    );
}


/* =========================================================
   FILTER BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        ".notification-filter"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".notification-filter"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    activeFilter =
                        button.dataset.filter ||
                        "all";


                    renderNotifications();
                }
            );
        }
    );


/* =========================================================
   MARK ALL
   ========================================================= */

if (markAllReadBtn) {

    markAllReadBtn.addEventListener(
        "click",
        markAllAsRead
    );
}


/* =========================================================
   CLEAR ALL
   ========================================================= */

if (clearAllNotificationsBtn) {

    clearAllNotificationsBtn.addEventListener(
        "click",
        clearAllNotifications
    );
}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener(
        "click",
        function () {

            if (!dashboardSidebar) {
                return;
            }

            dashboardSidebar.classList.toggle(
                "open"
            );
        }
    );
}


/* =========================================================
   CLOSE SIDEBAR AFTER NAVIGATION
   ========================================================= */

document
    .querySelectorAll(
        ".sidebar-nav-link"
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                function () {

                    if (
                        window.innerWidth <= 850 &&
                        dashboardSidebar
                    ) {

                        dashboardSidebar.classList.remove(
                            "open"
                        );
                    }
                }
            );
        }
    );


/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            try {

                await signOut(auth);

                localStorage.removeItem(
                    "skillconnectUser"
                );

                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

                showToast(
                    "Unable to logout. Please try again."
                );
            }
        }
    );
}


/* =========================================================
   UPDATE USER UI
   ========================================================= */

function updateUserUI(user) {

    if (!user) return;


    const displayName =
        user.displayName ||
        user.email?.split("@")[0] ||
        "Customer";


    if (sidebarCustomerName) {

        sidebarCustomerName.textContent =
            displayName;
    }


    if (headerName) {

        headerName.textContent =
            displayName;
    }


    const initials =
        displayName
            .split(" ")
            .map(
                word =>
                    word.charAt(0)
            )
            .join("")
            .substring(0, 2)
            .toUpperCase();


    if (sidebarCustomerAvatar) {

        sidebarCustomerAvatar.textContent =
            initials;
    }


    if (headerAvatar) {

        headerAvatar.textContent =
            initials;
    }
}


/* =========================================================
   LOAD NOTIFICATIONS
   ========================================================= */

async function loadNotifications(user = null) {

    if (notificationLoading) {

        notificationLoading.style.display =
            "flex";
    }


    /* -----------------------------------------
       Local saved data
       ----------------------------------------- */

    const loadedLocal =
        loadLocalNotifications();


    /* -----------------------------------------
       If nothing saved, use demo data
       ----------------------------------------- */

    if (!loadedLocal) {

        notifications =
            [...demoNotifications];
    }


    /* -----------------------------------------
       Firebase
       ----------------------------------------- */

    if (user) {

        await loadFirestoreNotifications(
            user
        );
    }


    saveNotifications();

    renderNotifications();


    if (notificationLoading) {

        notificationLoading.style.display =
            "none";
    }
}


/* =========================================================
   AUTH STATE
   ========================================================= */

onAuthStateChanged(
    auth,
    async function (user) {

        updateUserUI(user);

        await loadNotifications(user);
    }
);