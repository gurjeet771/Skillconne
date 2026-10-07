/* =========================================================
   SkillConnect - Worker Dashboard
   File: worker-dashboard.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const sidebar =
        document.getElementById("dashboardSidebar");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const availabilityToggle =
        document.getElementById("availabilityToggle");

    const availabilityStatus =
        document.getElementById("availabilityStatus");

    const workerWelcomeName =
        document.getElementById("workerWelcomeName");

    const sidebarWorkerName =
        document.getElementById("sidebarWorkerName");

    const sidebarWorkerAvatar =
        document.getElementById("sidebarWorkerAvatar");

    const headerWorkerName =
        document.getElementById("headerWorkerName");

    const headerAvatar =
        document.getElementById("headerAvatar");

    const jobRequestsList =
        document.getElementById("jobRequestsList");

    const noJobRequests =
        document.getElementById("noJobRequests");

    const jobRequestBadge =
        document.getElementById("jobRequestBadge");

    const bookingCountBadge =
        document.getElementById("bookingCountBadge");

    const newJobsCount =
        document.getElementById("newJobsCount");

    const activeJobsCount =
        document.getElementById("activeJobsCount");

    const completedJobsCount =
        document.getElementById("completedJobsCount");

    const workerTotalEarnings =
        document.getElementById("workerTotalEarnings");

    const monthlyEarnings =
        document.getElementById("monthlyEarnings");

    const monthlyCompletedJobs =
        document.getElementById("monthlyCompletedJobs");

    const pendingEarnings =
        document.getElementById("pendingEarnings");

    const platformFee =
        document.getElementById("platformFee");

    const profileCompletion =
        document.getElementById("profileCompletion");

    const profileProgressBar =
        document.getElementById("profileProgressBar");

    const profileCompletionText =
        document.getElementById("profileCompletionText");

    const workerRating =
        document.getElementById("workerRating");

    const workerReviewCount =
        document.getElementById("workerReviewCount");

    const verificationTitle =
        document.getElementById("verificationTitle");

    const verificationMessage =
        document.getElementById("verificationMessage");

    const toast =
        document.getElementById("dashboardToast");


    /* =====================================================
       DEMO WORKER DATA
       ===================================================== */

    const defaultWorker = {
        name: "Aman Sharma",
        initials: "AS",
        role: "Professional",
        availability: true,
        profileCompletion: 80,
        rating: 4.8,
        reviewCount: 24,
        verification: "under-review"
    };


    /* =====================================================
       DEMO JOB DATA
       ===================================================== */

    let jobs = [
        {
            id: "sample-job-001",
            service: "Bathroom Cleaning",
            customer: "Rahul Kumar",
            price: 400,
            date: "25 Sep 2026",
            time: "11:00 AM",
            location: "Kanpur",
            status: "NEW"
        },
        {
            id: "sample-job-002",
            service: "AC Service",
            customer: "Priya Singh",
            price: 650,
            date: "27 Sep 2026",
            time: "02:00 PM",
            location: "Kanpur",
            status: "NEW"
        }
    ];


    /* =====================================================
       DEMO DASHBOARD DATA
       ===================================================== */

    const dashboardData = {
        activeJobs: 1,
        completedJobs: 18,
        totalEarnings: 12450,
        monthlyEarnings: 3850,
        monthlyCompletedJobs: 6,
        pendingEarnings: 650,
        platformFee: 385
    };


    /* =====================================================
       LOAD WORKER
       ===================================================== */

    function loadWorker() {

        let worker = null;

        try {

            const saved =
                localStorage.getItem(
                    "skillconnectWorker"
                );

            if (saved) {
                worker = JSON.parse(saved);
            }

        } catch (error) {

            console.warn(
                "Worker data could not be loaded."
            );
        }

        if (!worker) {
            worker = defaultWorker;
        }

        const name =
            worker.name ||
            defaultWorker.name;

        const initials =
            worker.initials ||
            getInitials(name);

        if (sidebarWorkerName) {
            sidebarWorkerName.textContent = name;
        }

        if (headerWorkerName) {
            headerWorkerName.textContent = name;
        }

        if (sidebarWorkerAvatar) {
            sidebarWorkerAvatar.textContent = initials;
        }

        if (headerAvatar) {
            headerAvatar.textContent = initials;
        }

        if (workerWelcomeName) {

            const firstName =
                name.split(" ")[0];

            workerWelcomeName.textContent =
                `Welcome back, ${firstName}! 👋`;
        }

        const available =
            worker.availability !== undefined
                ? worker.availability
                : true;

        if (availabilityToggle) {
            availabilityToggle.checked =
                Boolean(available);
        }

        updateAvailabilityText(
            Boolean(available)
        );

        updateProfileCompletion(
            worker.profileCompletion ??
            defaultWorker.profileCompletion
        );

        updateRating(
            worker.rating ??
            defaultWorker.rating,
            worker.reviewCount ??
            defaultWorker.reviewCount
        );

        updateVerification(
            worker.verification ||
            defaultWorker.verification
        );
    }


    /* =====================================================
       INITIALS
       ===================================================== */

    function getInitials(name) {

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word =>
                word.charAt(0).toUpperCase()
            )
            .join("");
    }


    /* =====================================================
       AVAILABILITY
       ===================================================== */

    function updateAvailabilityText(isAvailable) {

        if (!availabilityStatus) {
            return;
        }

        if (isAvailable) {

            availabilityStatus.textContent =
                "Available for Jobs";

            availabilityStatus.style.color =
                "#16a34a";

        } else {

            availabilityStatus.textContent =
                "Not Available";

            availabilityStatus.style.color =
                "#dc2626";
        }
    }


    if (availabilityToggle) {

        availabilityToggle.addEventListener(
            "change",
            () => {

                const isAvailable =
                    availabilityToggle.checked;

                updateAvailabilityText(
                    isAvailable
                );

                saveWorkerAvailability(
                    isAvailable
                );

                showToast(
                    isAvailable
                        ? "You are now available for jobs."
                        : "You are now unavailable for jobs."
                );
            }
        );
    }


    function saveWorkerAvailability(
        isAvailable
    ) {

        try {

            const saved =
                localStorage.getItem(
                    "skillconnectWorker"
                );

            const worker =
                saved
                    ? JSON.parse(saved)
                    : {
                        ...defaultWorker
                    };

            worker.availability =
                isAvailable;

            localStorage.setItem(
                "skillconnectWorker",
                JSON.stringify(worker)
            );

        } catch (error) {

            console.warn(
                "Availability could not be saved."
            );
        }
    }


    /* =====================================================
       RENDER JOB REQUESTS
       ===================================================== */

    function renderJobRequests() {

        if (!jobRequestsList) {
            return;
        }

        const newJobs =
            jobs.filter(
                job => job.status === "NEW"
            );

        jobRequestsList.innerHTML = "";

        if (newJobs.length === 0) {

            if (noJobRequests) {
                noJobRequests.style.display =
                    "block";
            }

            updateJobCounts();
            return;
        }

        if (noJobRequests) {
            noJobRequests.style.display =
                "none";
        }

        newJobs.forEach(job => {

            const request =
                document.createElement("div");

            request.className =
                "job-request";

            request.innerHTML = `
                <div class="job-request-top">

                    <div class="job-request-title">
                        <h3>${escapeHTML(job.service)}</h3>
                        <p>Customer: ${escapeHTML(job.customer)}</p>
                    </div>

                    <div class="job-request-price">
                        ₹${formatNumber(job.price)}
                    </div>

                </div>

                <div class="job-request-meta">

                    <span class="job-meta-item">
                        📅 ${escapeHTML(job.date)}
                    </span>

                    <span class="job-meta-item">
                        ⏰ ${escapeHTML(job.time)}
                    </span>

                    <span class="job-meta-item">
                        📍 ${escapeHTML(job.location)}
                    </span>

                </div>

                <div class="job-request-actions">

                    <button
                        class="job-action-btn job-action-primary"
                        data-action="accept"
                        data-job-id="${escapeHTML(job.id)}">
                        Accept
                    </button>

                    <button
                        class="job-action-btn job-action-secondary"
                        data-action="view"
                        data-job-id="${escapeHTML(job.id)}">
                        View Details
                    </button>

                    <button
                        class="job-action-btn job-action-secondary"
                        data-action="reject"
                        data-job-id="${escapeHTML(job.id)}">
                        Reject
                    </button>

                </div>
            `;

            jobRequestsList.appendChild(request);
        });

        updateJobCounts();
    }


    /* =====================================================
       JOB ACTIONS
       ===================================================== */

    if (jobRequestsList) {

        jobRequestsList.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!button) {
                    return;
                }

                const action =
                    button.dataset.action;

                const jobId =
                    button.dataset.jobId;

                handleJobAction(
                    action,
                    jobId
                );
            }
        );
    }


    function handleJobAction(
        action,
        jobId
    ) {

        const job =
            jobs.find(
                item => item.id === jobId
            );

        if (!job) {
            return;
        }


        if (action === "accept") {

            job.status = "ACCEPTED";

            saveJobs();

            renderJobRequests();

            updateDashboardStats();

            showToast(
                `${job.service} job accepted successfully.`
            );

            return;
        }


        if (action === "reject") {

            job.status = "REJECTED";

            saveJobs();

            renderJobRequests();

            updateDashboardStats();

            showToast(
                `${job.service} job rejected.`
            );

            return;
        }


        if (action === "view") {

            try {

                localStorage.setItem(
                    "skillconnectSelectedJob",
                    JSON.stringify(job)
                );

            } catch (error) {
                console.warn(
                    "Selected job could not be saved."
                );
            }

            window.location.href =
                `job-details.html?id=${encodeURIComponent(job.id)}`;
        }
    }


    /* =====================================================
       SAVE JOBS
       ===================================================== */

    function saveJobs() {

        try {

            localStorage.setItem(
                "skillconnectWorkerJobs",
                JSON.stringify(jobs)
            );

        } catch (error) {

            console.warn(
                "Worker jobs could not be saved."
            );
        }
    }


    function loadSavedJobs() {

        try {

            const saved =
                localStorage.getItem(
                    "skillconnectWorkerJobs"
                );

            if (saved) {

                const parsed =
                    JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    jobs = parsed;
                }
            }

        } catch (error) {

            console.warn(
                "Saved jobs could not be loaded."
            );
        }
    }


    /* =====================================================
       JOB COUNTS
       ===================================================== */

    function updateJobCounts() {

        const newJobs =
            jobs.filter(
                job => job.status === "NEW"
            ).length;

        const acceptedJobs =
            jobs.filter(
                job => job.status === "ACCEPTED"
            ).length;

        if (newJobsCount) {
            newJobsCount.textContent =
                newJobs;
        }

        if (jobRequestBadge) {
            jobRequestBadge.textContent =
                newJobs;
        }

        if (activeJobsCount) {
            activeJobsCount.textContent =
                dashboardData.activeJobs +
                acceptedJobs;
        }

        if (bookingCountBadge) {
            bookingCountBadge.textContent =
                acceptedJobs;
        }
    }


    /* =====================================================
       DASHBOARD STATISTICS
       ===================================================== */

    function updateDashboardStats() {

        if (completedJobsCount) {
            completedJobsCount.textContent =
                dashboardData.completedJobs;
        }

        if (workerTotalEarnings) {
            workerTotalEarnings.textContent =
                `₹${formatNumber(
                    dashboardData.totalEarnings
                )}`;
        }

        if (monthlyEarnings) {
            monthlyEarnings.textContent =
                `₹${formatNumber(
                    dashboardData.monthlyEarnings
                )}`;
        }

        if (monthlyCompletedJobs) {
            monthlyCompletedJobs.textContent =
                dashboardData.monthlyCompletedJobs;
        }

        if (pendingEarnings) {
            pendingEarnings.textContent =
                `₹${formatNumber(
                    dashboardData.pendingEarnings
                )}`;
        }

        if (platformFee) {
            platformFee.textContent =
                `₹${formatNumber(
                    dashboardData.platformFee
                )}`;
        }

        updateJobCounts();
    }


    /* =====================================================
       PROFILE COMPLETION
       ===================================================== */

    function updateProfileCompletion(
        percentage
    ) {

        const value =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(percentage) || 0
                )
            );

        if (profileCompletion) {
            profileCompletion.textContent =
                `${value}%`;
        }

        if (profileProgressBar) {
            profileProgressBar.style.width =
                `${value}%`;
        }

        if (profileCompletionText) {

            if (value >= 100) {

                profileCompletionText.textContent =
                    "Your professional profile is complete.";

            } else {

                profileCompletionText.textContent =
                    "Add portfolio images and service details to complete your profile.";
            }
        }
    }


    /* =====================================================
       RATING
       ===================================================== */

    function updateRating(
        rating,
        reviewCount
    ) {

        const numericRating =
            Number(rating) || 0;

        if (workerRating) {
            workerRating.textContent =
                numericRating.toFixed(1);
        }

        if (workerReviewCount) {
            workerReviewCount.textContent =
                reviewCount || 0;
        }
    }


    /* =====================================================
       VERIFICATION
       ===================================================== */

    function updateVerification(
        status
    ) {

        if (!verificationTitle ||
            !verificationMessage) {
            return;
        }

        if (status === "verified") {

            verificationTitle.textContent =
                "Profile Verified";

            verificationMessage.textContent =
                "Your professional profile has been verified by the SkillConnect team.";

            return;
        }

        if (status === "rejected") {

            verificationTitle.textContent =
                "Verification Required";

            verificationMessage.textContent =
                "Please update your documents or profile details and submit again.";

            return;
        }

        verificationTitle.textContent =
            "Profile Verification";

        verificationMessage.textContent =
            "Your professional profile is being reviewed by the SkillConnect team.";
    }


    /* =====================================================
       MOBILE SIDEBAR
       ===================================================== */

    function openSidebar() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.add("open");

        createSidebarOverlay();
    }


    function closeSidebar() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.remove("open");

        const overlay =
            document.getElementById(
                "workerSidebarOverlay"
            );

        if (overlay) {
            overlay.remove();
        }
    }


    function createSidebarOverlay() {

        if (
            document.getElementById(
                "workerSidebarOverlay"
            )
        ) {
            return;
        }

        const overlay =
            document.createElement("div");

        overlay.id =
            "workerSidebarOverlay";

        overlay.style.position =
            "fixed";

        overlay.style.inset =
            "0";

        overlay.style.background =
            "rgba(15, 23, 42, 0.35)";

        overlay.style.zIndex =
            "999";

        overlay.addEventListener(
            "click",
            closeSidebar
        );

        document.body.appendChild(
            overlay
        );
    }


    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                if (
                    sidebar &&
                    sidebar.classList.contains("open")
                ) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            }
        );
    }


    /* =====================================================
       CLOSE SIDEBAR ON LINK CLICK
       ===================================================== */

    if (sidebar) {

        const links =
            sidebar.querySelectorAll(
                ".sidebar-nav-link"
            );

        links.forEach(link => {

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

        logoutBtn.addEventListener(
            "click",
            () => {

                const confirmed =
                    window.confirm(
                        "Are you sure you want to logout?"
                    );

                if (!confirmed) {
                    return;
                }

                try {

                    localStorage.removeItem(
                        "skillconnectWorker"
                    );

                } catch (error) {
                    console.warn(
                        "Worker session could not be cleared."
                    );
                }

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

            const page =
                href
                    .split("/")
                    .pop()
                    .split("?")[0]
                    .toLowerCase();

            link.classList.remove(
                "active"
            );

            if (
                page === currentPage ||
                (
                    currentPage === "" &&
                    page === "worker-dashboard.html"
                )
            ) {
                link.classList.add(
                    "active"
                );
            }
        });
    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        if (!toast) {
            return;
        }

        toast.textContent =
            message;

        toast.classList.add(
            "show"
        );

        clearTimeout(
            showToast.timer
        );

        showToast.timer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2500);
    }


    /* =====================================================
       FORMAT NUMBER
       ===================================================== */

    function formatNumber(number) {

        return Number(number || 0)
            .toLocaleString("en-IN");
    }


    /* =====================================================
       HTML ESCAPE
       ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    loadSavedJobs();

    loadWorker();

    renderJobRequests();

    updateDashboardStats();

    setActiveSidebarLink();

});