/* =========================================================
   SKILLCONNECT
   BOOKING DETAILS JAVASCRIPT
   File: booking.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PRINT BOOKING
    ===================================================== */

    window.printBooking = function () {
        window.print();
    };


    /* =====================================================
       OPEN MAP
    ===================================================== */

    window.openMap = function () {

        const address =
            "House No. 25, Main Road, Kanpur Nagar, Uttar Pradesh - 208001";

        const mapUrl =
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(address);

        window.open(mapUrl, "_blank");
    };


    /* =====================================================
       CONTACT SUPPORT
    ===================================================== */

    window.contactSupport = function () {

        const supportEmail = "support@skillconnect.com";

        const subject = encodeURIComponent(
            "Support Request - Booking #SC-2026-00125"
        );

        const body = encodeURIComponent(
            "Hello SkillConnect Support,\n\n" +
            "I need help regarding my booking #SC-2026-00125.\n\n" +
            "Please assist me.\n\n" +
            "Thank you."
        );

        window.location.href =
            `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    };


    /* =====================================================
       CANCEL BOOKING
    ===================================================== */

    window.cancelBooking = function () {

        const confirmed = confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) {
            return;
        }

        const reason = prompt(
            "Please enter the reason for cancellation:"
        );

        if (reason === null) {
            return;
        }

        if (reason.trim() === "") {
            alert("Please enter a cancellation reason.");
            return;
        }

        alert(
            "Your cancellation request has been submitted.\n\n" +
            "Reason: " + reason
        );

        updateBookingStatusAfterCancel();
    };


    /* =====================================================
       UPDATE UI AFTER CANCELLATION
    ===================================================== */

    function updateBookingStatusAfterCancel() {

        const statusBadge =
            document.querySelector(".status-badge");

        if (statusBadge) {
            statusBadge.className =
                "status-badge status-cancelled";

            statusBadge.textContent =
                "● Cancelled";
        }

        const cancelCard =
            document.querySelector(".cancel-card");

        if (cancelCard) {

            cancelCard.innerHTML = `
                <h3>Booking Cancelled</h3>

                <p>
                    This booking has been cancelled successfully.
                </p>
            `;

            cancelCard.style.background = "#fef2f2";
        }

        const paymentStatus =
            document.querySelector(".payment-status");

        if (paymentStatus) {

            paymentStatus.innerHTML = `
                <span
                    class="payment-dot"
                    style="background:#ef4444;"
                ></span>

                <span>
                    Payment status will be updated
                </span>
            `;
        }
    }


    /* =====================================================
       SHARE BOOKING
    ===================================================== */

    window.shareBooking = async function () {

        const bookingId = "#SC-2026-00125";

        const shareData = {
            title: "SkillConnect Booking",
            text:
                "My SkillConnect booking " +
                bookingId +
                " - Bathroom Cleaning",
            url: window.location.href
        };


        /* Native share support */

        if (
            navigator.share &&
            typeof navigator.share === "function"
        ) {

            try {

                await navigator.share(shareData);

            } catch (error) {

                if (error.name !== "AbortError") {
                    console.log(
                        "Share failed:",
                        error
                    );
                }
            }

            return;
        }


        /* Clipboard fallback */

        try {

            await navigator.clipboard.writeText(
                window.location.href
            );

            alert(
                "Booking link copied to clipboard!"
            );

        } catch (error) {

            prompt(
                "Copy this booking link:",
                window.location.href
            );
        }
    };


    /* =====================================================
       ADD CANCELLED STATUS STYLE
    ===================================================== */

    const style = document.createElement("style");

    style.textContent = `
        .status-cancelled {
            color: #b91c1c !important;
            background: #fef2f2 !important;
            border: 1px solid #fecaca !important;
        }
    `;

    document.head.appendChild(style);


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    const navLinks =
        document.querySelectorAll(".main-nav a");

    navLinks.forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) {
            return;
        }

        const linkPage =
            href.split("/")
                .pop()
                .toLowerCase();

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });


    /* =====================================================
       PREVENT EMPTY HASH LINKS
    ===================================================== */

    document
        .querySelectorAll('a[href="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {
                event.preventDefault();
            });
        });


    /* =====================================================
       SIMPLE BUTTON FEEDBACK
    ===================================================== */

    const payButtons =
        document.querySelectorAll(
            'a[href="payments.html"]'
        );

    payButtons.forEach(button => {

        button.addEventListener("click", () => {

            button.style.opacity = "0.75";
            button.style.pointerEvents = "none";

            setTimeout(() => {
                button.style.opacity = "1";
                button.style.pointerEvents = "auto";
            }, 800);
        });
    });

});