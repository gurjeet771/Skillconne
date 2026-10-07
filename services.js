/* =========================================================
   SkillConnect - Services Page
   File: service.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const searchInput = document.getElementById("serviceSearchInput");
    const searchBtn = document.getElementById("serviceSearchBtn");
    const categoryFilter = document.getElementById("categoryFilter");
    const servicesGrid = document.getElementById("servicesGrid");
    const serviceCards = Array.from(
        document.querySelectorAll(".service-card")
    );
    const servicesCount = document.getElementById("servicesCount");
    const noServiceResult = document.getElementById("noServiceResult");

    const postCustomJobBtn =
        document.getElementById("postCustomJobBtn");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const dashboardSidebar =
        document.getElementById("dashboardSidebar");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const sidebarCustomerName =
        document.getElementById("sidebarCustomerName");

    const sidebarCustomerAvatar =
        document.getElementById("sidebarCustomerAvatar");

    const headerName =
        document.getElementById("headerName");

    const headerAvatar =
        document.getElementById("headerAvatar");

    const toast =
        document.getElementById("dashboardToast");


    /* =====================================================
       SERVICE DATA
       ===================================================== */

    const serviceData = {
        "Bathroom Cleaning": {
            id: "bathroom-cleaning",
            category: "cleaning"
        },

        "Home Cleaning": {
            id: "home-cleaning",
            category: "cleaning"
        },

        "Plumbing": {
            id: "plumbing",
            category: "plumbing"
        },

        "Electrician": {
            id: "electrician",
            category: "electrical"
        },

        "AC Service": {
            id: "ac-service",
            category: "ac"
        },

        "Appliance Repair": {
            id: "appliance-repair",
            category: "repair"
        },

        "Salon at Home": {
            id: "salon-at-home",
            category: "beauty"
        },

        "Painting": {
            id: "painting",
            category: "repair"
        },

        "Carpenter": {
            id: "carpenter",
            category: "repair"
        },

        "Packers & Movers": {
            id: "packers-movers",
            category: "moving"
        },

        "Pest Control": {
            id: "pest-control",
            category: "cleaning"
        },

        "Water Purifier Service": {
            id: "water-purifier-service",
            category: "repair"
        }
    };


    /* =====================================================
       CUSTOMER DATA
       ===================================================== */

    function loadCustomerData() {

        let customer = null;

        try {
            const savedCustomer =
                localStorage.getItem("skillconnectCustomer");

            if (savedCustomer) {
                customer = JSON.parse(savedCustomer);
            }
        } catch (error) {
            console.warn("Customer data could not be loaded.");
        }

        if (!customer) {
            customer = {
                name: "Rahul Kumar",
                initials: "RK"
            };
        }

        const name =
            customer.name ||
            customer.displayName ||
            "Rahul Kumar";

        const initials =
            customer.initials ||
            getInitials(name);

        if (sidebarCustomerName) {
            sidebarCustomerName.textContent = name;
        }

        if (headerName) {
            headerName.textContent = name;
        }

        if (sidebarCustomerAvatar) {
            sidebarCustomerAvatar.textContent = initials;
        }

        if (headerAvatar) {
            headerAvatar.textContent = initials;
        }
    }


    function getInitials(name) {

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase())
            .join("");
    }


    /* =====================================================
       SEARCH + FILTER
       ===================================================== */

    let selectedCategory = "all";


    function filterServices() {

        const searchText =
            (searchInput?.value || "")
                .trim()
                .toLowerCase();

        let visibleCount = 0;

        serviceCards.forEach(card => {

            const category =
                (card.dataset.category || "").toLowerCase();

            const searchData =
                (card.dataset.search || "").toLowerCase();

            const serviceName =
                (card.dataset.service || "").toLowerCase();

            const categoryMatch =
                selectedCategory === "all" ||
                category === selectedCategory;

            const searchMatch =
                searchText === "" ||
                searchData.includes(searchText) ||
                serviceName.includes(searchText);

            const shouldShow =
                categoryMatch && searchMatch;

            if (shouldShow) {
                card.classList.remove("hidden");
                visibleCount++;
            } else {
                card.classList.add("hidden");
            }
        });


        /* Update service count */

        if (servicesCount) {

            servicesCount.textContent =
                `${visibleCount} service${visibleCount !== 1 ? "s" : ""}`;
        }


        /* No result message */

        if (noServiceResult) {

            if (visibleCount === 0) {
                noServiceResult.classList.add("show");
            } else {
                noServiceResult.classList.remove("show");
            }
        }
    }


    /* =====================================================
       CATEGORY BUTTONS
       ===================================================== */

    if (categoryFilter) {

        const categoryButtons =
            categoryFilter.querySelectorAll(".category-btn");

        categoryButtons.forEach(button => {

            button.addEventListener("click", () => {

                categoryButtons.forEach(btn => {
                    btn.classList.remove("active");
                });

                button.classList.add("active");

                selectedCategory =
                    button.dataset.category || "all";

                filterServices();
            });
        });
    }


    /* =====================================================
       SEARCH BUTTON
       ===================================================== */

    if (searchBtn) {

        searchBtn.addEventListener("click", () => {
            filterServices();
        });
    }


    /* =====================================================
       SEARCH ENTER KEY
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener("keydown", event => {

            if (event.key === "Enter") {
                event.preventDefault();
                filterServices();
            }
        });


        /* Live search */

        searchInput.addEventListener("input", () => {
            filterServices();
        });
    }


    /* =====================================================
       SERVICE CARD CLICK
       ===================================================== */

    serviceCards.forEach(card => {

        card.addEventListener("click", () => {

            const serviceName =
                card.dataset.service || "";

            if (!serviceName) {
                return;
            }

            const data =
                serviceData[serviceName];

            const serviceId =
                data?.id ||
                slugify(serviceName);

            const category =
                data?.category ||
                card.dataset.category ||
                "";

            saveSelectedService(
                serviceName,
                category
            );

            window.location.href =
                `service-details.html?service=${encodeURIComponent(serviceName)}&category=${encodeURIComponent(category)}&id=${encodeURIComponent(serviceId)}`;
        });


        /* Keyboard accessibility */

        card.setAttribute("tabindex", "0");

        card.addEventListener("keydown", event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                card.click();
            }
        });
    });


    /* =====================================================
       SAVE SELECTED SERVICE
       ===================================================== */

    function saveSelectedService(serviceName, category) {

        try {

            localStorage.setItem(
                "skillconnectSelectedService",
                JSON.stringify({
                    service: serviceName,
                    category: category,
                    selectedAt: new Date().toISOString()
                })
            );

        } catch (error) {
            console.warn(
                "Selected service could not be saved."
            );
        }
    }


    /* =====================================================
       SLUGIFY
       ===================================================== */

    function slugify(text) {

        return text
            .toLowerCase()
            .trim()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }


    /* =====================================================
       URL PARAMETERS
       ===================================================== */

    function loadUrlParameters() {

        const params =
            new URLSearchParams(window.location.search);

        const serviceParam =
            params.get("service");

        const categoryParam =
            params.get("category");

        if (serviceParam && searchInput) {

            searchInput.value =
                serviceParam;
        }

        if (categoryParam) {

            const categoryButtons =
                document.querySelectorAll(".category-btn");

            categoryButtons.forEach(button => {

                if (
                    button.dataset.category ===
                    categoryParam
                ) {

                    categoryButtons.forEach(btn => {
                        btn.classList.remove("active");
                    });

                    button.classList.add("active");

                    selectedCategory =
                        categoryParam;
                }
            });
        }

        if (serviceParam || categoryParam) {
            filterServices();
        }
    }


    /* =====================================================
       POST CUSTOM JOB
       ===================================================== */

    if (postCustomJobBtn) {

        postCustomJobBtn.addEventListener("click", () => {

            try {
                localStorage.setItem(
                    "skillconnectPostJobSource",
                    "services"
                );
            } catch (error) {
                console.warn(
                    "Post job source could not be saved."
                );
            }

            window.location.href =
                "post-job.html";
        });
    }


    /* =====================================================
       MOBILE SIDEBAR
       ===================================================== */

    function openSidebar() {

        if (!dashboardSidebar) {
            return;
        }

        dashboardSidebar.classList.add("open");
        createSidebarOverlay();
    }


    function closeSidebar() {

        if (!dashboardSidebar) {
            return;
        }

        dashboardSidebar.classList.remove("open");

        const overlay =
            document.getElementById(
                "serviceSidebarOverlay"
            );

        if (overlay) {
            overlay.remove();
        }
    }


    function createSidebarOverlay() {

        if (
            document.getElementById(
                "serviceSidebarOverlay"
            )
        ) {
            return;
        }

        const overlay =
            document.createElement("div");

        overlay.id =
            "serviceSidebarOverlay";

        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.background =
            "rgba(15, 23, 42, 0.35)";
        overlay.style.zIndex = "999";
        overlay.style.cursor = "pointer";

        overlay.addEventListener(
            "click",
            closeSidebar
        );

        document.body.appendChild(overlay);
    }


    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                if (
                    dashboardSidebar &&
                    dashboardSidebar.classList.contains("open")
                ) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            }
        );
    }


    /* =====================================================
       CLOSE SIDEBAR AFTER NAVIGATION
       ===================================================== */

    if (dashboardSidebar) {

        const sidebarLinks =
            dashboardSidebar.querySelectorAll(
                ".sidebar-nav-link"
            );

        sidebarLinks.forEach(link => {

            link.addEventListener(
                "click",
                closeSidebar
            );
        });
    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            const confirmLogout =
                window.confirm(
                    "Are you sure you want to logout?"
                );

            if (!confirmLogout) {
                return;
            }

            try {
                localStorage.removeItem(
                    "skillconnectCustomer"
                );
            } catch (error) {
                console.warn(
                    "Customer session could not be cleared."
                );
            }

            showToast(
                "Logging out..."
            );

            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 700);
        });
    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        if (!toast) {
            return;
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(
            showToast.timeout
        );

        showToast.timeout =
            setTimeout(() => {

                toast.classList.remove("show");

            }, 2500);
    }


    /* =====================================================
       ACTIVE SIDEBAR LINK
       ===================================================== */

    function setActiveSidebarLink() {

        const currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();

        const links =
            document.querySelectorAll(
                ".sidebar-nav-link"
            );

        links.forEach(link => {

            const href =
                link.getAttribute("href");

            if (!href) {
                return;
            }

            const linkPage =
                href.split("/")
                    .pop()
                    .split("?")[0]
                    .toLowerCase();

            if (
                linkPage === currentPage ||
                (
                    currentPage === "" &&
                    linkPage === "service.html"
                )
            ) {
                link.classList.add("active");
            }
        });
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    loadCustomerData();

    setActiveSidebarLink();

    loadUrlParameters();

    filterServices();

});