/* =========================================================
   SKILLCONNECT
   ADMIN DASHBOARD JAVASCRIPT
   File: admin-dashboard.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar = document.getElementById("sidebar");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebarLinks = document.querySelectorAll(".sidebar-link[data-section]");
    const dashboardSections = document.querySelectorAll(".dashboard-section");

    const logoutBtn = document.getElementById("logoutBtn");
    const notificationBtn = document.getElementById("notificationBtn");

    const searchInput = document.getElementById("adminSearch");

    const viewAllButtons = document.querySelectorAll(
        ".view-all-btn[data-section]"
    );

    const approveButtons = document.querySelectorAll(
        '.action-btn[data-action="approve"]'
    );

    const rejectButtons = document.querySelectorAll(
        '.action-btn[data-action="reject"]'
    );


    /* =====================================================
       SIDEBAR SECTION NAVIGATION
    ===================================================== */

    function showSection(sectionId) {

        dashboardSections.forEach((section) => {
            section.classList.remove("active-section");
        });

        sidebarLinks.forEach((link) => {
            link.classList.remove("active");
        });

        const targetSection = document.getElementById(sectionId);

        if (targetSection) {
            targetSection.classList.add("active-section");
        }

        const activeLink = document.querySelector(
            `.sidebar-link[data-section="${sectionId}"]`
        );

        if (activeLink) {
            activeLink.classList.add("active");
        }

        if (window.innerWidth <= 900 && sidebar) {
            sidebar.classList.remove("active");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    /* =====================================================
       SIDEBAR CLICK
    ===================================================== */

    sidebarLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const sectionId = link.dataset.section;

            if (!sectionId) {
                return;
            }

            event.preventDefault();

            showSection(sectionId);

            history.replaceState(
                null,
                "",
                `#${sectionId}`
            );
        });

    });


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    if (mobileMenuBtn && sidebar) {

        mobileMenuBtn.addEventListener("click", () => {

            sidebar.classList.toggle("active");

        });

    }


    /* =====================================================
       CLOSE SIDEBAR WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener("click", (event) => {

        if (!sidebar || !mobileMenuBtn) {
            return;
        }

        if (window.innerWidth > 900) {
            return;
        }

        const clickedInsideSidebar =
            sidebar.contains(event.target);

        const clickedMenuButton =
            mobileMenuBtn.contains(event.target);

        if (
            !clickedInsideSidebar &&
            !clickedMenuButton
        ) {
            sidebar.classList.remove("active");
        }

    });


    /* =====================================================
       VIEW ALL BUTTONS
    ===================================================== */

    viewAllButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const sectionId = button.dataset.section;

            if (sectionId) {
                showSection(sectionId);

                history.replaceState(
                    null,
                    "",
                    `#${sectionId}`
                );
            }

        });

    });


    /* =====================================================
       APPROVE PROFESSIONAL
    ===================================================== */

    approveButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const row =
                button.closest(".professional-row");

            if (!row) {
                return;
            }

            const nameElement =
                row.querySelector(".professional-user strong");

            const name =
                nameElement
                    ? nameElement.textContent.trim()
                    : "Professional";

            const confirmed = confirm(
                `Approve ${name} as a professional?`
            );

            if (!confirmed) {
                return;
            }

            const actions =
                row.querySelector(".professional-actions");

            const experience =
                row.querySelector(".professional-experience");

            if (actions) {
                actions.innerHTML = `
                    <span class="status verified-status">
                        ✓ Approved
                    </span>
                `;
            }

            if (experience) {
                experience.textContent =
                    "Verified Professional";
            }

        });

    });


    /* =====================================================
       REJECT PROFESSIONAL
    ===================================================== */

    rejectButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const row =
                button.closest(".professional-row");

            if (!row) {
                return;
            }

            const nameElement =
                row.querySelector(".professional-user strong");

            const name =
                nameElement
                    ? nameElement.textContent.trim()
                    : "Professional";

            const confirmed = confirm(
                `Reject verification request from ${name}?`
            );

            if (!confirmed) {
                return;
            }

            row.style.opacity = "0";

            setTimeout(() => {
                row.remove();
            }, 250);

        });

    });


    /* =====================================================
       ADMIN SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const searchValue =
                searchInput.value
                    .trim()
                    .toLowerCase();

            const activeSection =
                document.querySelector(
                    ".dashboard-section.active-section"
                );

            if (!activeSection) {
                return;
            }

            const rows =
                activeSection.querySelectorAll(
                    ".admin-table tbody tr"
                );

            rows.forEach((row) => {

                const rowText =
                    row.textContent.toLowerCase();

                if (
                    searchValue === "" ||
                    rowText.includes(searchValue)
                ) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }

            });

        });

    }


    /* =====================================================
       NOTIFICATION BUTTON
    ===================================================== */

    if (notificationBtn) {

        notificationBtn.addEventListener("click", () => {

            alert(
                "You have new SkillConnect notifications."
            );

        });

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            const confirmed = confirm(
                "Are you sure you want to logout?"
            );

            if (!confirmed) {
                return;
            }

            /*
             * Firebase logout will be connected here.
             *
             * Example later:
             *
             * await signOut(auth);
             *
             */

            window.location.href = "login.html";

        });

    }


    /* =====================================================
       URL HASH
    ===================================================== */

    function loadSectionFromHash() {

        const hash =
            window.location.hash.replace("#", "");

        if (hash) {

            const section =
                document.getElementById(hash);

            if (section &&
                section.classList.contains("dashboard-section")) {

                showSection(hash);
                return;
            }

        }

        showSection("dashboard");

    }

    loadSectionFromHash();


    /* =====================================================
       HASH CHANGE
    ===================================================== */

    window.addEventListener("hashchange", () => {

        loadSectionFromHash();

    });

});