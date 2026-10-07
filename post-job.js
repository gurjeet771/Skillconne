/* =========================================================
   SkillConnect - Post Job
   File: post-job.js
   ========================================================= */

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import { app } from "./firebase-config.js";

const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let selectedRequirements = [];
let editingJobId = null;

/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const form = document.getElementById("postJobForm");
const postJobBtn = document.getElementById("postJobBtn");
const cancelBtn = document.getElementById("cancelPostJobBtn");

const categoryInput = document.getElementById("jobCategory");
const titleInput = document.getElementById("jobTitle");
const descriptionInput = document.getElementById("jobDescription");

const dateInput = document.getElementById("jobDate");
const timeInput = document.getElementById("jobTime");
const durationInput = document.getElementById("jobDuration");

const addressInput = document.getElementById("jobAddress");
const cityInput = document.getElementById("jobCity");
const stateInput = document.getElementById("jobState");
const pincodeInput = document.getElementById("jobPincode");
const landmarkInput = document.getElementById("jobLandmark");

const budgetInput = document.getElementById("jobBudget");
const budgetTypeInput = document.getElementById("budgetType");

const notesInput = document.getElementById("jobNotes");

const contactPreferenceInput =
    document.getElementById("contactPreference");

const workerPreferenceInput =
    document.getElementById("workerPreference");

const termsInput = document.getElementById("jobTerms");

const successBox = document.getElementById("postJobSuccess");
const successText = document.getElementById("postJobSuccessText");
const errorBox = document.getElementById("postJobError");

/* =========================================================
   AUTH STATE
   ========================================================= */

onAuthStateChanged(auth, async (user) => {
    currentUser = user;

    updateUserUI(user);

    if (user) {
        await checkEditMode();
    }
});

/* =========================================================
   PAGE INIT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    setMinimumDate();
    setupRequirementTags();
    setupFormEvents();
    setupMobileMenu();
    setupCancelButton();
});

/* =========================================================
   MINIMUM DATE
   ========================================================= */

function setMinimumDate() {
    if (!dateInput) return;

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
}

/* =========================================================
   REQUIREMENT TAGS
   ========================================================= */

function setupRequirementTags() {
    const tags = document.querySelectorAll(".requirement-tag");

    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            const requirement = tag.dataset.requirement;

            if (!requirement) return;

            if (selectedRequirements.includes(requirement)) {
                selectedRequirements =
                    selectedRequirements.filter(
                        item => item !== requirement
                    );

                tag.classList.remove("selected");
            } else {
                selectedRequirements.push(requirement);

                tag.classList.add("selected");
            }

            updateDescriptionFromTags();
        });
    });
}

function updateDescriptionFromTags() {
    if (!descriptionInput) return;

    const currentDescription =
        descriptionInput.value.trim();

    if (!selectedRequirements.length) {
        return;
    }

    const tagsText =
        selectedRequirements.join(", ");

    if (!currentDescription) {
        descriptionInput.value =
            `Requirements: ${tagsText}`;
    }
}

/* =========================================================
   FORM EVENTS
   ========================================================= */

function setupFormEvents() {
    if (!form) return;

    form.addEventListener("submit", handleSubmit);

    if (pincodeInput) {
        pincodeInput.addEventListener("input", () => {
            pincodeInput.value =
                pincodeInput.value.replace(/\D/g, "").slice(0, 6);
        });
    }

    if (budgetInput) {
        budgetInput.addEventListener("input", () => {
            if (Number(budgetInput.value) < 0) {
                budgetInput.value = "";
            }
        });
    }
}

/* =========================================================
   SUBMIT
   ========================================================= */

async function handleSubmit(event) {
    event.preventDefault();

    hideMessages();

    const validation = validateForm();

    if (!validation.valid) {
        showError(validation.message);
        return;
    }

    const jobData = collectJobData();

    setLoading(true);

    try {
        if (editingJobId && currentUser) {
            await updateDoc(
                doc(db, "jobs", editingJobId),
                {
                    ...jobData,
                    updatedAt: serverTimestamp()
                }
            );

            saveLocalJob(jobData, editingJobId);

            showSuccess(
                "Job updated successfully. Professionals can now see your updated requirement."
            );

        } else if (currentUser) {
            const jobRef = await addDoc(
                collection(db, "jobs"),
                {
                    ...jobData,
                    customerId: currentUser.uid,
                    status: "OPEN",
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }
            );

            saveLocalJob(jobData, jobRef.id);

            showSuccess(
                "Your job has been posted successfully. Professionals near you can now send offers."
            );

            form.reset();

            selectedRequirements = [];

            document
                .querySelectorAll(".requirement-tag")
                .forEach(tag => {
                    tag.classList.remove("selected");
                });

            setMinimumDate();

        } else {
            /*
             * Demo mode when user is not logged in.
             */

            const demoId =
                "JOB-" +
                Date.now().toString().slice(-8);

            saveLocalJob(jobData, demoId);

            showSuccess(
                "Job saved in demo mode. Login/Firebase will be required for live professional offers."
            );
        }

    } catch (error) {
        console.error("Post job error:", error);

        showError(
            getFirebaseErrorMessage(error)
        );

    } finally {
        setLoading(false);
    }
}

/* =========================================================
   COLLECT FORM DATA
   ========================================================= */

function collectJobData() {
    return {
        category: categoryInput?.value || "",
        title: titleInput?.value.trim() || "",
        description: descriptionInput?.value.trim() || "",

        requirements: [...selectedRequirements],

        date: dateInput?.value || "",
        time: timeInput?.value || "",
        duration: durationInput?.value || "",

        address: addressInput?.value.trim() || "",
        city: cityInput?.value.trim() || "",
        state: stateInput?.value.trim() || "",
        pincode: pincodeInput?.value.trim() || "",
        landmark: landmarkInput?.value.trim() || "",

        budget: Number(budgetInput?.value || 0),
        budgetType: budgetTypeInput?.value || "fixed",

        notes: notesInput?.value.trim() || "",

        contactPreference:
            contactPreferenceInput?.value || "phone",

        workerPreference:
            workerPreferenceInput?.value || "any"
    };
}

/* =========================================================
   VALIDATION
   ========================================================= */

function validateForm() {
    if (!categoryInput?.value) {
        return {
            valid: false,
            message: "Please select a service category."
        };
    }

    if (!titleInput?.value.trim()) {
        return {
            valid: false,
            message: "Please enter a job title."
        };
    }

    if (
        !descriptionInput?.value.trim() ||
        descriptionInput.value.trim().length < 10
    ) {
        return {
            valid: false,
            message:
                "Please provide a clear job description of at least 10 characters."
        };
    }

    if (!dateInput?.value) {
        return {
            valid: false,
            message: "Please select your preferred date."
        };
    }

    if (!timeInput?.value) {
        return {
            valid: false,
            message: "Please select your preferred time."
        };
    }

    if (!addressInput?.value.trim()) {
        return {
            valid: false,
            message: "Please enter the service address."
        };
    }

    if (!cityInput?.value.trim()) {
        return {
            valid: false,
            message: "Please enter the city."
        };
    }

    if (!stateInput?.value.trim()) {
        return {
            valid: false,
            message: "Please enter the state."
        };
    }

    if (!/^\d{6}$/.test(pincodeInput?.value.trim() || "")) {
        return {
            valid: false,
            message: "Please enter a valid 6-digit pincode."
        };
    }

    const budget = Number(budgetInput?.value || 0);

    if (budget < 50 || budget > 100000) {
        return {
            valid: false,
            message: "Budget must be between ₹50 and ₹1,00,000."
        };
    }

    if (!termsInput?.checked) {
        return {
            valid: false,
            message:
                "Please accept the Terms of Service and Privacy Policy."
        };
    }

    return {
        valid: true,
        message: ""
    };
}

/* =========================================================
   EDIT MODE
   ========================================================= */

async function checkEditMode() {
    const params = new URLSearchParams(
        window.location.search
    );

    editingJobId = params.get("edit");

    if (!editingJobId) {
        return;
    }

    if (!currentUser) {
        return;
    }

    try {
        const jobRef = doc(db, "jobs", editingJobId);
        const jobSnap = await getDoc(jobRef);

        if (!jobSnap.exists()) {
            showError("Job not found.");
            return;
        }

        const job = jobSnap.data();

        if (
            job.customerId &&
            job.customerId !== currentUser.uid
        ) {
            showError(
                "You are not allowed to edit this job."
            );

            return;
        }

        fillForm(job);

        if (postJobBtn) {
            postJobBtn.innerHTML = `
                <span>✓</span>
                Update Job
            `;
        }

    } catch (error) {
        console.error("Edit job error:", error);

        /*
         * If Firebase data is unavailable,
         * try localStorage.
         */
        loadLocalJobForEdit(editingJobId);
    }
}

/* =========================================================
   FILL EDIT FORM
   ========================================================= */

function fillForm(job) {
    if (categoryInput) {
        categoryInput.value = job.category || "";
    }

    if (titleInput) {
        titleInput.value = job.title || "";
    }

    if (descriptionInput) {
        descriptionInput.value = job.description || "";
    }

    if (dateInput) {
        dateInput.value = job.date || "";
    }

    if (timeInput) {
        timeInput.value = job.time || "";
    }

    if (durationInput) {
        durationInput.value = job.duration || "";
    }

    if (addressInput) {
        addressInput.value = job.address || "";
    }

    if (cityInput) {
        cityInput.value = job.city || "";
    }

    if (stateInput) {
        stateInput.value = job.state || "";
    }

    if (pincodeInput) {
        pincodeInput.value = job.pincode || "";
    }

    if (landmarkInput) {
        landmarkInput.value = job.landmark || "";
    }

    if (budgetInput) {
        budgetInput.value = job.budget || "";
    }

    if (budgetTypeInput) {
        budgetTypeInput.value =
            job.budgetType || "fixed";
    }

    if (notesInput) {
        notesInput.value = job.notes || "";
    }

    if (contactPreferenceInput) {
        contactPreferenceInput.value =
            job.contactPreference || "phone";
    }

    if (workerPreferenceInput) {
        workerPreferenceInput.value =
            job.workerPreference || "any";
    }

    selectedRequirements =
        Array.isArray(job.requirements)
            ? [...job.requirements]
            : [];

    document
        .querySelectorAll(".requirement-tag")
        .forEach(tag => {
            if (
                selectedRequirements.includes(
                    tag.dataset.requirement
                )
            ) {
                tag.classList.add("selected");
            }
        });
}

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveLocalJob(jobData, jobId) {
    const job = {
        id: jobId,
        ...jobData,
        customerId: currentUser?.uid || "demo-user",
        status: "OPEN",
        createdAt: new Date().toISOString()
    };

    localStorage.setItem(
        "skillconnectPostedJob",
        JSON.stringify(job)
    );

    localStorage.setItem(
        "skillconnectJobStatus",
        "OPEN"
    );
}

function loadLocalJobForEdit(jobId) {
    const stored =
        localStorage.getItem(
            "skillconnectPostedJob"
        );

    if (!stored) {
        showError("Job details could not be found.");
        return;
    }

    try {
        const job = JSON.parse(stored);

        if (String(job.id) === String(jobId)) {
            fillForm(job);
        }

    } catch (error) {
        console.error(error);
    }
}

/* =========================================================
   CANCEL
   ========================================================= */

function setupCancelButton() {
    if (!cancelBtn) return;

    cancelBtn.addEventListener("click", () => {
        window.location.href =
            "customer-dashboard.html";
    });
}

/* =========================================================
   LOADING
   ========================================================= */

function setLoading(loading) {
    if (!postJobBtn) return;

    postJobBtn.disabled = loading;

    if (loading) {
        postJobBtn.innerHTML = `
            <span>⏳</span>
            ${editingJobId ? "Updating..." : "Posting..."}
        `;
    } else {
        postJobBtn.innerHTML = `
            <span>＋</span>
            ${editingJobId ? "Update Job" : "Post Job"}
        `;
    }
}

/* =========================================================
   SUCCESS / ERROR
   ========================================================= */

function showSuccess(message) {
    if (!successBox) return;

    if (successText) {
        successText.textContent = message;
    }

    successBox.classList.add("show");

    successBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    showToast("Job action completed successfully.");

    setTimeout(() => {
        if (successBox) {
            successBox.classList.remove("show");
        }
    }, 7000);
}

function showError(message) {
    if (!errorBox) return;

    errorBox.textContent = message;
    errorBox.classList.add("show");

    errorBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    showToast(message);
}

function hideMessages() {
    if (successBox) {
        successBox.classList.remove("show");
    }

    if (errorBox) {
        errorBox.classList.remove("show");
    }
}

/* =========================================================
   USER UI
   ========================================================= */

function updateUserUI(user) {
    if (!user) return;

    const name =
        user.displayName ||
        localStorage.getItem(
            "skillconnectUserName"
        ) ||
        "Customer";

    const initials = getInitials(name);

    const sidebarName =
        document.getElementById(
            "sidebarCustomerName"
        );

    const sidebarAvatar =
        document.getElementById(
            "sidebarCustomerAvatar"
        );

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
   MOBILE SIDEBAR
   ========================================================= */

function setupMobileMenu() {
    const menuBtn =
        document.getElementById(
            "mobileMenuBtn"
        );

    const sidebar =
        document.getElementById(
            "dashboardSidebar"
        );

    if (!menuBtn || !sidebar) return;

    let overlay = null;

    menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");

        if (sidebar.classList.contains("open")) {
            overlay = document.createElement("div");

            overlay.style.position = "fixed";
            overlay.style.inset = "0";
            overlay.style.background =
                "rgba(15,23,42,.35)";
            overlay.style.zIndex = "999";

            document.body.appendChild(overlay);

            overlay.addEventListener(
                "click",
                () => {
                    sidebar.classList.remove(
                        "open"
                    );

                    overlay?.remove();
                    overlay = null;
                }
            );
        } else {
            overlay?.remove();
            overlay = null;
        }
    });
}

/* =========================================================
   LOGOUT
   ========================================================= */

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener(
        "click",
        async () => {
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
                    "Logout failed. Please try again."
                );
            }
        }
    );
}

/* =========================================================
   HELPERS
   ========================================================= */

function getInitials(name) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(
            word =>
                word.charAt(0).toUpperCase()
        )
        .join("");
}

function getFirebaseErrorMessage(error) {
    if (!error) {
        return "Something went wrong. Please try again.";
    }

    switch (error.code) {
        case "permission-denied":
            return "Firebase permission denied. Please check Firestore Security Rules.";

        case "unauthenticated":
            return "Please login before posting a job.";

        case "failed-precondition":
            return "Firestore configuration needs attention.";

        case "network-request-failed":
            return "Network error. Please check your internet connection.";

        default:
            return (
                error.message ||
                "Unable to save the job. Please try again."
            );
    }
}

function showToast(message) {
    const toast =
        document.getElementById(
            "dashboardToast"
        );

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(
        window.skillConnectToastTimer
    );

    window.skillConnectToastTimer =
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
}