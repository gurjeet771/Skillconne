"use strict";

/* =========================
   JOB DATA
========================= */

const jobs = [
    {
        id: "sample-job-001",
        title: "Bathroom Cleaning",
        description: "Deep cleaning required",
        category: "cleaning",
        budget: 400,
        date: "25 Sep 2026",
        time: "11:00 AM",
        location: "Kanpur",
        customer: "Rahul Kumar",
        initials: "RK",
        status: "pending"
    },

    {
        id: "sample-job-002",
        title: "AC Service",
        description: "Split AC servicing required",
        category: "ac",
        budget: 650,
        date: "27 Sep 2026",
        time: "02:00 PM",
        location: "Kanpur",
        customer: "Priya Singh",
        initials: "PS",
        status: "pending"
    },

    {
        id: "sample-job-003",
        title: "Plumbing Repair",
        description: "Kitchen tap leakage repair",
        category: "plumbing",
        budget: 350,
        date: "28 Sep 2026",
        time: "10:30 AM",
        location: "Kanpur",
        customer: "Amit Kumar",
        initials: "AK",
        status: "pending"
    }
];


/* =========================
   STATE
========================= */

let searchText = "";
let selectedCategory = "all";
let selectedStatus = "all";


/* =========================
   ELEMENTS
========================= */

const searchInput =
    document.getElementById("jobSearchInput");

const categoryFilter =
    document.getElementById("jobCategoryFilter");

const statusFilter =
    document.getElementById("jobStatusFilter");

const jobsList =
    document.getElementById("workerJobsList");

const jobsCount =
    document.getElementById("jobsCount");

const jobsEmpty =
    document.getElementById("jobsEmpty");

const jobsLoading =
    document.getElementById("jobsLoading");

const toast =
    document.getElementById("dashboardToast");


/* =========================
   STORAGE
========================= */

const STATUS_KEY =
    "skillconnectWorkerJobStatuses";


function getStatuses() {

    try {

        return JSON.parse(
            localStorage.getItem(STATUS_KEY)
        ) || {};

    } catch {

        return {};
    }
}


function saveJobStatus(jobId, status) {

    const statuses = getStatuses();

    statuses[jobId] = status;

    localStorage.setItem(
        STATUS_KEY,
        JSON.stringify(statuses)
    );
}


function getJobStatus(job) {

    const statuses = getStatuses();

    return statuses[job.id] || job.status;
}


/* =========================
   RENDER
========================= */

function renderJobs() {

    jobsList.innerHTML = "";

    const filteredJobs =
        jobs.filter(job => {

            const status =
                getJobStatus(job);

            const search =
                searchText.toLowerCase();

            const matchesSearch =
                job.title.toLowerCase().includes(search) ||
                job.description.toLowerCase().includes(search) ||
                job.location.toLowerCase().includes(search) ||
                job.customer.toLowerCase().includes(search);

            const matchesCategory =
                selectedCategory === "all" ||
                job.category === selectedCategory;

            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );
        });


    jobsCount.textContent =
        `${filteredJobs.length} ${
            filteredJobs.length === 1
                ? "job"
                : "jobs"
        }`;


    if (filteredJobs.length === 0) {

        jobsEmpty.classList.add("show");

    } else {

        jobsEmpty.classList.remove("show");
    }


    filteredJobs.forEach(job => {

        const status =
            getJobStatus(job);

        const article =
            document.createElement("article");

        article.className =
            "worker-job-item";

        article.innerHTML = `

            <div class="worker-job-top">

                <div class="worker-job-title">

                    <h3>
                        ${job.title}
                    </h3>

                    <p>
                        ${job.description}
                    </p>

                </div>

                <div class="worker-job-budget">

                    ₹${job.budget}

                    <span>
                        Customer Budget
                    </span>

                </div>

            </div>


            <div class="worker-job-meta">

                <div class="worker-job-meta-item">

                    <span>Date</span>

                    <strong>
                        ${job.date}
                    </strong>

                </div>


                <div class="worker-job-meta-item">

                    <span>Time</span>

                    <strong>
                        ${job.time}
                    </strong>

                </div>


                <div class="worker-job-meta-item">

                    <span>Location</span>

                    <strong>
                        ${job.location}
                    </strong>

                </div>

            </div>


            <div class="worker-job-customer">

                <div class="worker-job-customer-avatar">
                    ${job.initials}
                </div>

                <div class="worker-job-customer-info">

                    <strong>
                        ${job.customer}
                    </strong>

                    <span>
                        Customer
                    </span>

                </div>

            </div>


            <div class="worker-job-actions">

                ${getButtons(job.id, status)}

            </div>

        `;

        jobsList.appendChild(article);
    });


    updateStats();
}


/* =========================
   BUTTONS
========================= */

function getButtons(jobId, status) {

    if (status === "pending") {

        return `

            <button
                class="job-btn job-btn-success"
                data-action="accept"
                data-id="${jobId}">
                Accept Job
            </button>

            <button
                class="job-btn job-btn-secondary"
                data-action="view"
                data-id="${jobId}">
                View Details
            </button>

            <button
                class="job-btn job-btn-danger"
                data-action="reject"
                data-id="${jobId}">
                Reject
            </button>

        `;
    }


    if (status === "accepted") {

        return `

            <button
                class="job-btn job-btn-primary"
                data-action="complete"
                data-id="${jobId}">
                Mark Completed
            </button>

            <button
                class="job-btn job-btn-secondary"
                data-action="view"
                data-id="${jobId}">
                View Details
            </button>

        `;
    }


    return `

        <button
            class="job-btn job-btn-secondary"
            data-action="view"
            data-id="${jobId}">
            View Details
        </button>

    `;
}


/* =========================
   JOB ACTIONS
========================= */

jobsList.addEventListener("click", event => {

    const button =
        event.target.closest("[data-action]");

    if (!button) {
        return;
    }

    const action =
        button.dataset.action;

    const jobId =
        button.dataset.id;

    const job =
        jobs.find(item => item.id === jobId);

    if (!job) {
        return;
    }


    if (action === "accept") {

        saveJobStatus(
            jobId,
            "accepted"
        );

        showToast(
            "Job accepted successfully."
        );

        renderJobs();
    }


    else if (action === "reject") {

        saveJobStatus(
            jobId,
            "rejected"
        );

        showToast(
            "Job rejected."
        );

        renderJobs();
    }


    else if (action === "complete") {

        saveJobStatus(
            jobId,
            "completed"
        );

        showToast(
            "Job marked as completed."
        );

        renderJobs();
    }


    else if (action === "view") {

        window.location.href =
            "job-details.html?id=" +
            encodeURIComponent(jobId);
    }

});


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    event => {

        searchText =
            event.target.value;

        renderJobs();
    }
);


/* =========================
   CATEGORY
========================= */

categoryFilter.addEventListener(
    "change",
    event => {

        selectedCategory =
            event.target.value;

        renderJobs();
    }
);


/* =========================
   STATUS
========================= */

statusFilter.addEventListener(
    "change",
    event => {

        selectedStatus =
            event.target.value;

        renderJobs();
    }
);


/* =========================
   CLEAR FILTERS
========================= */

document
    .getElementById("clearJobFilters")
    .addEventListener(
        "click",
        () => {

            searchText = "";
            selectedCategory = "all";
            selectedStatus = "all";

            searchInput.value = "";
            categoryFilter.value = "all";
            statusFilter.value = "all";

            renderJobs();

            showToast(
                "Filters cleared."
            );
        }
    );


/* =========================
   STATS
========================= */

function updateStats() {

    const statuses =
        jobs.map(job => getJobStatus(job));


    const newJobs =
        statuses.filter(
            status => status === "pending"
        ).length;


    const acceptedJobs =
        statuses.filter(
            status => status === "accepted"
        ).length;


    const completedJobs =
        statuses.filter(
            status => status === "completed"
        ).length;


    const earnings =
        jobs
            .filter(
                job =>
                    getJobStatus(job) ===
                    "completed"
            )
            .reduce(
                (total, job) =>
                    total + job.budget,
                0
            );


    document.getElementById(
        "newJobsCount"
    ).textContent = newJobs;


    document.getElementById(
        "acceptedJobsCount"
    ).textContent = acceptedJobs;


    document.getElementById(
        "completedJobsCount"
    ).textContent = completedJobs;


    document.getElementById(
        "totalEarnings"
    ).textContent =
        "₹" +
        earnings.toLocaleString("en-IN");


    document.getElementById(
        "jobRequestBadge"
    ).textContent = newJobs;


    document.getElementById(
        "bookingCountBadge"
    ).textContent = acceptedJobs;
}


/* =========================
   REFRESH
========================= */

document
    .getElementById("refreshJobsBtn")
    .addEventListener(
        "click",
        () => {

            renderJobs();

            showToast(
                "Job requests refreshed."
            );
        }
    );


/* =========================
   MOBILE MENU
========================= */

const sidebar =
    document.getElementById(
        "dashboardSidebar"
    );

document
    .getElementById("mobileMenuBtn")
    .addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "active"
            );
        }
    );


/* =========================
   LOGOUT
========================= */

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "skillconnectUser"
            );

            showToast(
                "Logging out..."
            );

            setTimeout(
                () => {
                    window.location.href =
                        "login.html";
                },
                700
            );
        }
    );


/* =========================
   TOAST
========================= */

let toastTimer;

function showToast(message) {

    clearTimeout(toastTimer);

    toast.textContent =
        message;

    toast.classList.add("show");

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


/* =========================
   INITIAL LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (jobsLoading) {
            jobsLoading.style.display =
                "none";
        }

        renderJobs();

    }
);