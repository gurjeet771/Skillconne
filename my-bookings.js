/* =========================================================
   SKILLCONNECT - MY BOOKINGS
   my-bookings.js
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
    getDocs
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

const bookingSearch =
    document.getElementById("bookingSearch");

const bookingStatusFilter =
    document.getElementById("bookingStatusFilter");

const bookingDateFilter =
    document.getElementById("bookingDateFilter");

const clearBookingFilters =
    document.getElementById("clearBookingFilters");

const bookingsList =
    document.getElementById("bookingsList");

const noBookingsMessage =
    document.getElementById("noBookingsMessage");

const bookingsLoading =
    document.getElementById("bookingsLoading");

const totalBookings =
    document.getElementById("totalBookings");

const activeBookings =
    document.getElementById("activeBookings");

const completedBookings =
    document.getElementById("completedBookings");

const totalSpent =
    document.getElementById("totalSpent");

const bookingCountBadge =
    document.getElementById("bookingCountBadge");

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const dashboardSidebar =
    document.getElementById("dashboardSidebar");

const logoutBtn =
    document.getElementById("logoutBtn");

const sidebarCustomerName =
    document.getElementById("sidebarCustomerName");

const headerName =
    document.getElementById("headerName");

const sidebarCustomerAvatar =
    document.getElementById("sidebarCustomerAvatar");

const headerAvatar =
    document.getElementById("headerAvatar");

const dashboardToast =
    document.getElementById("dashboardToast");


/* =========================================================
   STATE
   ========================================================= */

let allBookings = [];


/* =========================================================
   DEMO BOOKINGS
   ========================================================= */

const demoBookings = [
    {
        id: "sample-001",
        service: "Bathroom Cleaning",
        icon: "🧹",
        date: "2026-09-25",
        time: "11:00 AM",
        location: "Kanpur, Uttar Pradesh",
        price: 400,
        status: "ACCEPTED"
    },

    {
        id: "sample-002",
        service: "AC Service",
        icon: "❄",
        date: "2026-09-20",
        time: "02:00 PM",
        location: "Kanpur, Uttar Pradesh",
        price: 650,
        status: "COMPLETED"
    },

    {
        id: "sample-003",
        service: "Home Cleaning",
        icon: "🏠",
        date: "2026-09-28",
        time: "10:00 AM",
        location: "Kanpur, Uttar Pradesh",
        price: 800,
        status: "PENDING"
    }
];


/* =========================================================
   STATUS LABEL
   ========================================================= */

function getStatusLabel(status) {

    const labels = {
        PENDING: "Pending",
        ACCEPTED: "Accepted",
        ON_THE_WAY: "On the Way",
        STARTED: "Started",
        COMPLETED: "Completed",
        PAID: "Paid",
        REVIEWED: "Reviewed",
        CANCELLED: "Cancelled"
    };

    return labels[status] || status;
}


/* =========================================================
   STATUS CLASS
   ========================================================= */

function getStatusClass(status) {

    return "status-" +
        String(status)
            .toLowerCase()
            .replaceAll("_", "-");
}


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
   FORMAT DATE
   ========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================================================
   IS ACTIVE
   ========================================================= */

function isActiveBooking(status) {

    return [
        "PENDING",
        "ACCEPTED",
        "ON_THE_WAY",
        "STARTED"
    ].includes(status);
}


/* =========================================================
   IS COMPLETED
   ========================================================= */

function isCompletedBooking(status) {

    return [
        "COMPLETED",
        "PAID",
        "REVIEWED"
    ].includes(status);
}


/* =========================================================
   IS PAST
   ========================================================= */

function isPastBooking(booking) {

    if (!booking.date) {
        return false;
    }

    const bookingDate =
        new Date(booking.date);

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);

    bookingDate.setHours(0, 0, 0, 0);

    return bookingDate < today;
}


/* =========================================================
   RENDER BOOKINGS
   ========================================================= */

function renderBookings(bookings) {

    if (!bookingsList) return;

    if (!bookings.length) {

        bookingsList.innerHTML = "";

        if (noBookingsMessage) {
            noBookingsMessage.style.display = "block";
        }

        return;
    }


    if (noBookingsMessage) {
        noBookingsMessage.style.display = "none";
    }


    bookingsList.innerHTML =
        bookings.map(
            booking => {

                return `
                    <div class="booking-item"
                         data-booking-id="${escapeHTML(booking.id)}"
                         data-status="${escapeHTML(booking.status)}"
                         data-service="${escapeHTML(booking.service)}">

                        <div class="booking-service-icon">
                            ${escapeHTML(booking.icon || "🛠")}
                        </div>

                        <div class="booking-item-info">

                            <h4>
                                ${escapeHTML(booking.service)}
                            </h4>

                            <p>
                                ${escapeHTML(
                                    formatDate(booking.date)
                                )}
                                ·
                                ${escapeHTML(
                                    booking.time || ""
                                )}
                            </p>

                            <p>
                                ${escapeHTML(
                                    booking.location || ""
                                )}
                            </p>

                        </div>

                        <div class="booking-item-right">

                            <span class="status-badge ${getStatusClass(booking.status)}">
                                ${escapeHTML(
                                    getStatusLabel(booking.status)
                                )}
                            </span>

                            <div class="booking-item-price">
                                ₹${Number(booking.price || 0).toLocaleString("en-IN")}
                            </div>

                            <a
                                href="booking-details.html?id=${encodeURIComponent(booking.id)}"
                                class="dashboard-btn dashboard-btn-secondary dashboard-btn-small">
                                View
                            </a>

                        </div>

                    </div>
                `;
            }
        ).join("");
}


/* =========================================================
   UPDATE STATS
   ========================================================= */

function updateStats(bookings) {

    const total =
        bookings.length;

    const active =
        bookings.filter(
            booking =>
                isActiveBooking(booking.status)
        ).length;

    const completed =
        bookings.filter(
            booking =>
                isCompletedBooking(booking.status)
        ).length;

    const spent =
        bookings
            .filter(
                booking =>
                    [
                        "COMPLETED",
                        "PAID",
                        "REVIEWED"
                    ].includes(booking.status)
            )
            .reduce(
                (sum, booking) =>
                    sum + Number(booking.price || 0),
                0
            );


    if (totalBookings) {
        totalBookings.textContent = total;
    }

    if (activeBookings) {
        activeBookings.textContent = active;
    }

    if (completedBookings) {
        completedBookings.textContent = completed;
    }

    if (totalSpent) {
        totalSpent.textContent =
            "₹" +
            spent.toLocaleString("en-IN");
    }

    if (bookingCountBadge) {
        bookingCountBadge.textContent = total;
    }
}


/* =========================================================
   FILTER BOOKINGS
   ========================================================= */

function filterBookings() {

    const searchValue =
        bookingSearch
            ? bookingSearch.value
                .trim()
                .toLowerCase()
            : "";

    const statusValue =
        bookingStatusFilter
            ? bookingStatusFilter.value
            : "all";

    const dateValue =
        bookingDateFilter
            ? bookingDateFilter.value
            : "all";


    const filtered =
        allBookings.filter(
            booking => {

                const matchesSearch =
                    !searchValue ||
                    booking.service
                        .toLowerCase()
                        .includes(searchValue) ||
                    booking.location
                        .toLowerCase()
                        .includes(searchValue) ||
                    booking.id
                        .toLowerCase()
                        .includes(searchValue);


                const matchesStatus =
                    statusValue === "all" ||
                    booking.status === statusValue;


                let matchesDate = true;

                if (dateValue === "upcoming") {
                    matchesDate =
                        !isPastBooking(booking);
                }

                if (dateValue === "past") {
                    matchesDate =
                        isPastBooking(booking);
                }


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesDate
                );
            }
        );


    renderBookings(filtered);
}


/* =========================================================
   LOAD LOCAL BOOKING
   ========================================================= */

function loadLocalBooking() {

    try {

        const saved =
            localStorage.getItem(
                "skillconnectPendingBooking"
            );

        if (!saved) {
            return;
        }

        const booking =
            JSON.parse(saved);

        if (!booking) {
            return;
        }


        const localBooking = {

            id:
                booking.id ||
                "local-" + Date.now(),

            service:
                booking.service ||
                booking.serviceName ||
                "Service",

            icon:
                booking.icon ||
                "🛠",

            date:
                booking.date ||
                "",

            time:
                booking.time ||
                "",

            location:
                booking.location ||
                booking.address ||
                "Kanpur, Uttar Pradesh",

            price:
                Number(
                    booking.price ||
                    booking.total ||
                    0
                ),

            status:
                booking.status ||
                "PENDING"
        };


        const alreadyExists =
            allBookings.some(
                item =>
                    item.id === localBooking.id
            );


        if (!alreadyExists) {
            allBookings.unshift(
                localBooking
            );
        }

    } catch (error) {

        console.error(
            "Local booking error:",
            error
        );
    }
}


/* =========================================================
   LOAD FIRESTORE BOOKINGS
   ========================================================= */

async function loadFirestoreBookings(user) {

    try {

        const bookingsRef =
            collection(db, "bookings");

        const bookingsQuery =
            query(
                bookingsRef,
                where("customerId", "==", user.uid)
            );

        const snapshot =
            await getDocs(bookingsQuery);


        snapshot.forEach(
            docSnapshot => {

                const data =
                    docSnapshot.data();


                const booking = {

                    id:
                        docSnapshot.id,

                    service:
                        data.service ||
                        data.serviceName ||
                        "Service",

                    icon:
                        data.icon ||
                        "🛠",

                    date:
                        data.date ||
                        "",

                    time:
                        data.time ||
                        "",

                    location:
                        data.location ||
                        data.address ||
                        "",

                    price:
                        Number(
                            data.price ||
                            data.totalAmount ||
                            0
                        ),

                    status:
                        data.status ||
                        "PENDING"
                };


                const existingIndex =
                    allBookings.findIndex(
                        item =>
                            item.id === booking.id
                    );


                if (existingIndex >= 0) {

                    allBookings[
                        existingIndex
                    ] = booking;

                } else {

                    allBookings.push(
                        booking
                    );
                }
            }
        );

    } catch (error) {

        console.error(
            "Firestore booking error:",
            error
        );
    }
}


/* =========================================================
   SORT BOOKINGS
   ========================================================= */

function sortBookings() {

    allBookings.sort(
        (a, b) => {

            const dateA =
                new Date(
                    `${a.date || "1970-01-01"} ${a.time || "00:00"}`
                );

            const dateB =
                new Date(
                    `${b.date || "1970-01-01"} ${b.time || "00:00"}`
                );

            return dateB - dateA;
        }
    );
}


/* =========================================================
   LOAD BOOKINGS
   ========================================================= */

async function loadBookings(user = null) {

    if (bookingsLoading) {
        bookingsLoading.style.display = "flex";
    }

    if (bookingsList) {
        bookingsList.style.display = "none";
    }


    allBookings = [
        ...demoBookings
    ];


    /* Load local booking */

    loadLocalBooking();


    /* Load Firebase bookings */

    if (user) {

        await loadFirestoreBookings(user);
    }


    sortBookings();

    updateStats(allBookings);

    filterBookings();


    if (bookingsLoading) {
        bookingsLoading.style.display = "none";
    }

    if (bookingsList) {
        bookingsList.style.display = "block";
    }
}


/* =========================================================
   SEARCH
   ========================================================= */

if (bookingSearch) {

    bookingSearch.addEventListener(
        "input",
        filterBookings
    );
}


/* =========================================================
   STATUS FILTER
   ========================================================= */

if (bookingStatusFilter) {

    bookingStatusFilter.addEventListener(
        "change",
        filterBookings
    );
}


/* =========================================================
   DATE FILTER
   ========================================================= */

if (bookingDateFilter) {

    bookingDateFilter.addEventListener(
        "change",
        filterBookings
    );
}


/* =========================================================
   CLEAR FILTERS
   ========================================================= */

if (clearBookingFilters) {

    clearBookingFilters.addEventListener(
        "click",
        function () {

            if (bookingSearch) {
                bookingSearch.value = "";
            }

            if (bookingStatusFilter) {
                bookingStatusFilter.value = "all";
            }

            if (bookingDateFilter) {
                bookingDateFilter.value = "all";
            }

            filterBookings();

            showToast(
                "Filters cleared."
            );
        }
    );
}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener(
        "click",
        function () {

            if (!dashboardSidebar) return;

            dashboardSidebar.classList.toggle(
                "open"
            );
        }
    );
}


/* =========================================================
   CLOSE SIDEBAR ON LINK CLICK
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
   TOAST
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
   LOAD USER PROFILE
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
   AUTH STATE
   ========================================================= */

onAuthStateChanged(
    auth,
    async function (user) {

        updateUserUI(user);

        await loadBookings(user);
    }
);