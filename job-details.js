/* =========================================================
   SKILLCONNECT - JOB DETAILS
   job-details.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const dashboardSidebar =
        document.getElementById("dashboardSidebar");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const editJobBtn =
        document.getElementById("editJobBtn");

    const cancelJobBtn =
        document.getElementById("cancelJobBtn");

    const acceptButtons =
        document.querySelectorAll(
            '[data-action="accept"]'
        );


    /* =====================================================
       MOBILE SIDEBAR
       ===================================================== */

    let overlay =
        document.querySelector(
            ".dashboard-sidebar-overlay"
        );


    if (!overlay) {

        overlay =
            document.createElement("div");

        overlay.className =
            "dashboard-sidebar-overlay";

        document.body.appendChild(overlay);
    }


    function openSidebar() {

        if (!dashboardSidebar) {
            return;
        }

        dashboardSidebar.classList.add("open");

        overlay.classList.add("show");
    }


    function closeSidebar() {

        if (!dashboardSidebar) {
            return;
        }

        dashboardSidebar.classList.remove("open");

        overlay.classList.remove("show");
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


    overlay.addEventListener(
        "click",
        closeSidebar
    );


    /* =====================================================
       SIDEBAR NAVIGATION
       ===================================================== */

    const navLinks =
        document.querySelectorAll(
            ".sidebar-nav-link"
        );


    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                closeSidebar();
            }
        );
    });


    /* =====================================================
       ACCEPT OFFER
       ===================================================== */

    acceptButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const worker =
                    button.dataset.worker ||
                    "selected professional";


                const confirmed =
                    confirm(
                        `Accept ${worker}'s offer for this job?`
                    );


                if (!confirmed) {
                    return;
                }


                /*
                 * Disable all accept buttons.
                 */

                acceptButtons.forEach(item => {

                    item.disabled = true;

                    item.style.opacity = "0.55";

                    item.style.cursor = "not-allowed";
                });


                /*
                 * Mark selected offer.
                 */

                button.textContent =
                    "✓ Offer Accepted";

                button.disabled = true;

                button.style.opacity = "1";


                /*
                 * Update job status.
                 */

                const jobStatus =
                    document.querySelector(
                        ".job-status"
                    );


                if (jobStatus) {

                    jobStatus.textContent =
                        "● Worker Selected";

                    jobStatus.style.background =
                        "#dcfce7";

                    jobStatus.style.color =
                        "#166534";
                }


                /*
                 * Save temporary job information.
                 */

                const acceptedOffer = {

                    worker: worker,

                    status: "ACCEPTED",

                    acceptedAt:
                        new Date().toISOString(),

                    jobId:
                        "#JOB-2026-00125"
                };


                localStorage.setItem(
                    "skillconnectAcceptedJob",
                    JSON.stringify(
                        acceptedOffer
                    )
                );


                showToast(
                    `${worker}'s offer has been accepted.`
                );
            }
        );
    });


    /* =====================================================
       EDIT JOB
       ===================================================== */

    if (editJobBtn) {

        editJobBtn.addEventListener(
            "click",
            () => {

                /*
                 * Post-job page can later load the
                 * existing job data for editing.
                 */

                window.location.href =
                    "post-job.html?edit=JOB-2026-00125";
            }
        );
    }


    /* =====================================================
       CANCEL JOB
       ===================================================== */

    if (cancelJobBtn) {

        cancelJobBtn.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Are you sure you want to cancel this job? This action cannot be easily undone."
                    );


                if (!confirmed) {
                    return;
                }


                const jobStatus =
                    document.querySelector(
                        ".job-status"
                    );


                if (jobStatus) {

                    jobStatus.textContent =
                        "● Job Cancelled";

                    jobStatus.style.background =
                        "#fef2f2";

                    jobStatus.style.color =
                        "#dc2626";
                }


                cancelJobBtn.disabled = true;

                cancelJobBtn.textContent =
                    "Job Cancelled";

                cancelJobBtn.style.opacity =
                    "0.6";


                localStorage.setItem(
                    "skillconnectJobStatus",
                    "CANCELLED"
                );


                showToast(
                    "Job cancelled successfully."
                );
            }
        );
    }


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


                /*
                 * Firebase logout will be connected later.
                 */

                localStorage.removeItem(
                    "skillconnectLoggedIn"
                );


                showToast(
                    "Logging out..."
                );


                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 700);
            }
        );
    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        let toast =
            document.getElementById(
                "jobDetailsToast"
            );


        if (!toast) {

            toast =
                document.createElement("div");

            toast.id =
                "jobDetailsToast";

            toast.style.position =
                "fixed";

            toast.style.right =
                "25px";

            toast.style.bottom =
                "25px";

            toast.style.zIndex =
                "5000";

            toast.style.padding =
                "13px 18px";

            toast.style.borderRadius =
                "10px";

            toast.style.background =
                "#111827";

            toast.style.color =
                "#ffffff";

            toast.style.fontSize =
                "13px";

            toast.style.fontWeight =
                "600";

            toast.style.boxShadow =
                "0 10px 30px rgba(0,0,0,0.15)";

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateY(15px)";

            toast.style.transition =
                "0.25s ease";

            document.body.appendChild(toast);
        }


        toast.textContent = message;

        toast.style.opacity = "1";

        toast.style.transform =
            "translateY(0)";


        clearTimeout(
            window.jobToastTimer
        );


        window.jobToastTimer =
            setTimeout(() => {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translateY(15px)";

            }, 3000);
    }


    /* =====================================================
       LOAD EXISTING JOB STATUS
       ===================================================== */

    function loadJobStatus() {

        const savedStatus =
            localStorage.getItem(
                "skillconnectJobStatus"
            );


        const jobStatus =
            document.querySelector(
                ".job-status"
            );


        if (!jobStatus || !savedStatus) {
            return;
        }


        if (savedStatus === "CANCELLED") {

            jobStatus.textContent =
                "● Job Cancelled";

            jobStatus.style.background =
                "#fef2f2";

            jobStatus.style.color =
                "#dc2626";


            if (cancelJobBtn) {

                cancelJobBtn.disabled =
                    true;

                cancelJobBtn.textContent =
                    "Job Cancelled";

                cancelJobBtn.style.opacity =
                    "0.6";
            }
        }
    }


    /* =====================================================
       LOAD ACCEPTED OFFER
       ===================================================== */

    function loadAcceptedOffer() {

        try {

            const saved =
                localStorage.getItem(
                    "skillconnectAcceptedJob"
                );


            if (!saved) {
                return;
            }


            const accepted =
                JSON.parse(saved);


            if (
                !accepted ||
                accepted.status !== "ACCEPTED"
            ) {
                return;
            }


            const jobStatus =
                document.querySelector(
                    ".job-status"
                );


            if (jobStatus) {

                jobStatus.textContent =
                    "● Worker Selected";

                jobStatus.style.background =
                    "#dcfce7";

                jobStatus.style.color =
                    "#166534";
            }


            acceptButtons.forEach(button => {

                if (
                    button.dataset.worker ===
                    accepted.worker
                ) {

                    button.textContent =
                        "✓ Offer Accepted";

                    button.disabled = true;

                    button.style.opacity =
                        "1";
                }
            });

        } catch (error) {

            console.error(
                "Unable to load accepted offer:",
                error
            );
        }
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    loadJobStatus();

    loadAcceptedOffer();

});