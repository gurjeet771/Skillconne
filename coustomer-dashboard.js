/* =========================================================
   SKILLCONNECT
   CUSTOMER DASHBOARD JAVASCRIPT
   File: customer.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar =
        document.getElementById("dashboardSidebar");

    const overlay =
        document.getElementById("sidebarOverlay");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const dashboardSearch =
        document.getElementById("dashboardSearch");

    const serviceSearchInput =
        document.getElementById("serviceSearch");

    const recentBookings =
        document.getElementById("recentBookings");

    const noBookingsMessage =
        document.getElementById("noBookingsMessage");


    /* =====================================================
       DEMO BOOKING DATA
    ===================================================== */

    let bookings = [
        {
            id: "SC-2026-00125",
            service: "Bathroom Cleaning",
            professional: "Rahul Kumar",
            date: "25 Sep 2026",
            time: "11:00 AM",
            amount: 400,
            status: "Accepted"
        },
        {
            id: "SC-2026-00118",
            service: "Electrical Repair",
            professional: "Amit Sharma",
            date: "22 Sep 2026",
            time: "03:00 PM",
            amount: 350,
            status: "Completed"
        }
    ];


    /* =====================================================
       LOCAL STORAGE BOOKING
    ===================================================== */

    const savedBooking =
        localStorage.getItem(
            "skillconnectPendingBooking"
        );

    if (savedBooking) {

        try {

            const booking =
                JSON.parse(savedBooking);

            if (booking) {

                const formattedDate =
                    formatBookingDate(
                        booking.date
                    );

                const formattedTime =
                    formatBookingTime(
                        booking.time
                    );

                bookings.unshift({

                    id:
                        booking.bookingId ||
                        "SC-NEW",

                    service:
                        booking.service ||
                        "Service",

                    professional:
                        booking.professional ||
                        "Professional",

                    date:
                        formattedDate,

                    time:
                        formattedTime,

                    amount:
                        Number(booking.total) || 0,

                    status:
                        "Pending"
                });
            }

        } catch (error) {

            console.error(
                "Unable to read booking data:",
                error
            );
        }
    }


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    function formatBookingDate(dateValue) {

        if (!dateValue) {
            return "Date not selected";
        }

        const date =
            new Date(
                dateValue + "T00:00:00"
            );

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


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatBookingTime(timeValue) {

        if (!timeValue) {
            return "Time not selected";
        }

        const parts =
            timeValue.split(":");

        if (parts.length < 2) {
            return timeValue;
        }

        let hour =
            parseInt(parts[0], 10);

        const minutes =
            parts[1];

        const ampm =
            hour >= 12
                ? "PM"
                : "AM";

        hour =
            hour % 12 || 12;

        return `${hour}:${minutes} ${ampm}`;
    }


    /* =====================================================
       UPDATE DASHBOARD STATS
    ===================================================== */

    function updateStats() {

        const totalBookings =
            document.getElementById(
                "totalBookings"
            );

        const activeBookings =
            document.getElementById(
                "activeBookings"
            );

        const completedBookings =
            document.getElementById(
                "completedBookings"
            );

        const totalSpent =
            document.getElementById(
                "totalSpent"
            );


        const total =
            bookings.length;

        const active =
            bookings.filter(
                booking =>
                    booking.status === "Accepted" ||
                    booking.status === "Pending"
            ).length;

        const completed =
            bookings.filter(
                booking =>
                    booking.status === "Completed"
            ).length;

        const spent =
            bookings
                .filter(
                    booking =>
                        booking.status === "Completed"
                )
                .reduce(
                    (sum, booking) =>
                        sum +
                        Number(booking.amount || 0),
                    0
                );


        if (totalBookings) {
            totalBookings.textContent =
                total;
        }

        if (activeBookings) {
            activeBookings.textContent =
                active;
        }

        if (completedBookings) {
            completedBookings.textContent =
                completed;
        }

        if (totalSpent) {
            totalSpent.textContent =
                `₹${spent.toLocaleString("en-IN")}`;
        }
    }


    /* =====================================================
       RENDER RECENT BOOKINGS
    ===================================================== */

    function renderBookings() {

        if (!recentBookings) {
            return;
        }

        const existingItems =
            recentBookings.querySelectorAll(
                ".dashboard-booking-item"
            );

        existingItems.forEach(
            item => item.remove()
        );


        if (bookings.length === 0) {

            if (noBookingsMessage) {
                noBookingsMessage.style.display =
                    "block";
            }

            return;
        }


        if (noBookingsMessage) {
            noBookingsMessage.style.display =
                "none";
        }


        bookings
            .slice(0, 5)
            .forEach(booking => {

                const item =
                    document.createElement("div");

                item.className =
                    "dashboard-booking-item";


                const icon =
                    getServiceIcon(
                        booking.service
                    );


                const statusClass =
                    getStatusClass(
                        booking.status
                    );


                item.innerHTML = `

                    <div class="booking-item-icon">
                        ${icon}
                    </div>

                    <div class="booking-item-info">

                        <h3>
                            ${escapeHTML(
                                booking.service
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                booking.professional
                            )}
                        </p>

                        <span>
                            ${escapeHTML(
                                booking.date
                            )}
                            •
                            ${escapeHTML(
                                booking.time
                            )}
                        </span>

                    </div>

                    <div class="booking-item-right">

                        <strong>
                            ₹${Number(
                                booking.amount || 0
                            ).toLocaleString("en-IN")}
                        </strong>

                        <span class="
                            status-badge
                            ${statusClass}
                        ">
                            ${escapeHTML(
                                booking.status
                            )}
                        </span>

                    </div>
                `;


                recentBookings.insertBefore(
                    item,
                    noBookingsMessage
                );
            });
    }


    /* =====================================================
       SERVICE ICON
    ===================================================== */

    function getServiceIcon(service) {

        const value =
            String(service)
                .toLowerCase();

        if (
            value.includes("clean")
        ) {
            return "🧹";
        }

        if (
            value.includes("plumb")
        ) {
            return "🔧";
        }

        if (
            value.includes("electric")
        ) {
            return "⚡";
        }

        if (
            value.includes("ac")
        ) {
            return "❄️";
        }

        if (
            value.includes("carpenter")
        ) {
            return "🪚";
        }

        if (
            value.includes("paint")
        ) {
            return "🎨";
        }

        return "🛠️";
    }


    /* =====================================================
       STATUS CLASS
    ===================================================== */

    function getStatusClass(status) {

        switch (
            String(status).toLowerCase()
        ) {

            case "accepted":
                return "status-accepted";

            case "completed":
                return "status-completed";

            case "pending":
                return "status-pending";

            default:
                return "status-pending";
        }
    }


    /* =====================================================
       SEARCH SERVICES
    ===================================================== */

    window.searchService = function () {

        const query =
            serviceSearchInput
                ? serviceSearchInput.value.trim()
                : "";


        if (!query) {

            showToast(
                "Please enter a service name."
            );

            return;
        }


        window.location.href =
            "services.html?search=" +
            encodeURIComponent(query);
    };


    /* =====================================================
       HEADER SEARCH
    ===================================================== */

    if (dashboardSearch) {

        dashboardSearch.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Enter"
                ) {
                    return;
                }

                const query =
                    dashboardSearch.value.trim();

                if (!query) {
                    return;
                }

                window.location.href =
                    "services.html?search=" +
                    encodeURIComponent(query);
            }
        );
    }


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    function openSidebar() {

        if (sidebar) {
            sidebar.classList.add("open");
        }

        if (overlay) {
            overlay.classList.add("show");
        }

        document.body.style.overflow =
            "hidden";
    }


    function closeSidebar() {

        if (sidebar) {
            sidebar.classList.remove("open");
        }

        if (overlay) {
            overlay.classList.remove("show");
        }

        document.body.style.overflow =
            "";
    }


    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            openSidebar
        );
    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebar
        );
    }


    /* Close sidebar when navigation link clicked */

    document
        .querySelectorAll(".sidebar-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 850
                    ) {
                        closeSidebar();
                    }
                }
            );
        });


    /* =====================================================
       CONTACT SUPPORT
    ===================================================== */

    window.contactSupport = function (event) {

        if (event) {
            event.preventDefault();
        }

        const email =
            "support@skillconnect.com";

        const subject =
            encodeURIComponent(
                "SkillConnect Customer Support"
            );

        const body =
            encodeURIComponent(
                "Hello SkillConnect Support,\n\n" +
                "I need help regarding my account or booking.\n\n" +
                "Thank you."
            );

        window.location.href =
            `mailto:${email}?subject=${subject}&body=${body}`;
    };


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );

                if (!confirmed) {
                    return;
                }

                localStorage.removeItem(
                    "skillconnectPendingBooking"
                );

                window.location.href =
                    "login.html";
            }
        );
    }


    /* =====================================================
       SIDEBAR ACTIVE LINK
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    document
        .querySelectorAll(".sidebar-link")
        .forEach(link => {

            const href =
                link.getAttribute("href");

            if (!href) {
                return;
            }

            const page =
                href
                    .split("/")
                    .pop()
                    .split("?")[0]
                    .toLowerCase();

            if (
                page === currentPage &&
                page !== "#"
            ) {
                link.classList.add("active");
            }
        });


    /* =====================================================
       TOAST
    ===================================================== */

    let toastTimer;

    function showToast(message) {

        const toast =
            document.getElementById(
                "dashboardToast"
            );

        if (!toast) {
            return;
        }

        toast.textContent =
            message;

        toast.classList.add(
            "show"
        );

        clearTimeout(
            toastTimer
        );

        toastTimer =
            setTimeout(
                () => {
                    toast.classList.remove(
                        "show"
                    );
                },
                2500
            );
    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value == null
                ? ""
                : String(value);

        return div.innerHTML;
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateStats();
    renderBookings();

});