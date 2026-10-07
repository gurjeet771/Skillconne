/* =========================================================
   SKILLCONNECT - REVIEWS JAVASCRIPT
   File: reviews.js
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
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import { app } from "./firebase-config.js";


/* =========================================================
   FIREBASE
   ========================================================= */

const auth = getAuth(app);
const db = getFirestore(app);


/* =========================================================
   DEMO REVIEWS
   ========================================================= */

const demoReviews = [
    {
        id: "demo-1",
        rating: 5,
        reviewer: "Rahul Kumar",
        date: "25 Sep 2026",
        text: "Excellent service. The professional arrived on time and completed the bathroom cleaning very carefully.",
        service: "Bathroom Cleaning"
    },
    {
        id: "demo-2",
        rating: 5,
        reviewer: "Amit Singh",
        date: "22 Sep 2026",
        text: "Very professional and affordable. The work quality was better than expected.",
        service: "AC Service"
    },
    {
        id: "demo-3",
        rating: 4,
        reviewer: "Priya Singh",
        date: "18 Sep 2026",
        text: "Good service and friendly behaviour. The professional was slightly late, but the work was completed properly.",
        service: "Home Cleaning"
    }
];

let currentUser = null;
let selectedRating = 0;
let selectedTags = [];
let allReviews = [];


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeStars();
    initializeTags();
    initializeForm();
    initializeFilter();
    initializeSidebar();
    initializeLogout();
    initializeLinks();

});


/* =========================================================
   AUTH STATE
   ========================================================= */

onAuthStateChanged(auth, async (user) => {

    currentUser = user;

    updateUserUI(user);

    if (user) {
        await loadUserReviews(user);
    } else {
        loadDemoReviews();
    }

});


/* =========================================================
   UPDATE USER UI
   ========================================================= */

function updateUserUI(user) {

    if (!user) {
        return;
    }

    const name =
        user.displayName ||
        user.email?.split("@")[0] ||
        "Customer";

    const initials = getInitials(name);

    const sidebarName =
        document.getElementById("sidebarCustomerName");

    const sidebarAvatar =
        document.getElementById("sidebarCustomerAvatar");

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
   LOAD USER REVIEWS
   ========================================================= */

async function loadUserReviews(user) {

    try {

        const reviewsRef = collection(db, "reviews");

        const q = query(
            reviewsRef,
            where("customerId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const firestoreReviews = [];

        snapshot.forEach((doc) => {

            const data = doc.data();

            firestoreReviews.push({
                id: doc.id,
                rating: Number(data.rating) || 0,
                reviewer:
                    data.customerName ||
                    user.displayName ||
                    "Customer",
                date: formatFirestoreDate(data.createdAt),
                text: data.text || data.review || "",
                service: data.service || "Service"
            });

        });

        allReviews = [
            ...firestoreReviews,
            ...demoReviews
        ];

        renderReviews(allReviews);
        updateRatingSummary(allReviews);

    } catch (error) {

        console.error("Unable to load reviews:", error);

        loadDemoReviews();

    }

}


/* =========================================================
   DEMO REVIEWS
   ========================================================= */

function loadDemoReviews() {

    allReviews = [...demoReviews];

    renderReviews(allReviews);
    updateRatingSummary(allReviews);

}


/* =========================================================
   STAR INPUT
   ========================================================= */

function initializeStars() {

    const stars =
        document.querySelectorAll(".star-btn");

    const selectedRatingText =
        document.getElementById("selectedRatingText");

    const selectedRatingInput =
        document.getElementById("selectedRating");


    stars.forEach((star) => {

        star.addEventListener("mouseenter", () => {

            const rating =
                Number(star.dataset.rating);

            highlightStars(rating);

        });


        star.addEventListener("mouseleave", () => {

            highlightStars(selectedRating);

        });


        star.addEventListener("click", () => {

            selectedRating =
                Number(star.dataset.rating);

            if (selectedRatingInput) {
                selectedRatingInput.value =
                    selectedRating;
            }

            highlightStars(selectedRating);


            if (selectedRatingText) {

                const textMap = {
                    1: "Very Poor",
                    2: "Poor",
                    3: "Average",
                    4: "Good",
                    5: "Excellent"
                };

                selectedRatingText.textContent =
                    `${selectedRating} Star${selectedRating > 1 ? "s" : ""} - ${textMap[selectedRating]}`;

            }

        });

    });

}


function highlightStars(rating) {

    const stars =
        document.querySelectorAll(".star-btn");

    stars.forEach((star) => {

        const value =
            Number(star.dataset.rating);

        star.classList.toggle(
            "active",
            value <= rating
        );

    });

}


/* =========================================================
   REVIEW TAGS
   ========================================================= */

function initializeTags() {

    const tags =
        document.querySelectorAll(".review-tag");

    tags.forEach((tag) => {

        tag.addEventListener("click", () => {

            const value =
                tag.dataset.tag;

            tag.classList.toggle("selected");

            if (tag.classList.contains("selected")) {

                if (!selectedTags.includes(value)) {
                    selectedTags.push(value);
                }

            } else {

                selectedTags =
                    selectedTags.filter(
                        item => item !== value
                    );

            }

        });

    });

}


/* =========================================================
   REVIEW FORM
   ========================================================= */

function initializeForm() {

    const form =
        document.getElementById("reviewForm");

    const cancelButton =
        document.getElementById("cancelReviewBtn");


    if (form) {

        form.addEventListener(
            "submit",
            submitReview
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            resetReviewForm
        );

    }

}


/* =========================================================
   SUBMIT REVIEW
   ========================================================= */

async function submitReview(event) {

    event.preventDefault();


    const reviewText =
        document.getElementById("reviewText");

    const bookingId =
        document.getElementById("reviewBookingId");

    const submitButton =
        document.getElementById("submitReviewBtn");

    const successBox =
        document.getElementById("reviewSuccess");


    const text =
        reviewText?.value.trim() || "";

    const booking =
        bookingId?.value.trim() || "";


    /* ---------- VALIDATION ---------- */

    if (selectedRating < 1 || selectedRating > 5) {

        showToast(
            "Please select a rating from 1 to 5 stars."
        );

        return;

    }


    if (text.length < 10) {

        showToast(
            "Please write at least 10 characters in your review."
        );

        reviewText?.focus();

        return;

    }


    if (!currentUser) {

        showToast(
            "Please login before submitting a review."
        );

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

        return;

    }


    /* ---------- LOADING ---------- */

    if (submitButton) {

        submitButton.disabled = true;
        submitButton.textContent =
            "Submitting...";

    }


    try {

        const serviceName =
            document.getElementById(
                "reviewServiceName"
            )?.textContent.trim() ||
            "Service";

        const workerName =
            document.getElementById(
                "reviewWorkerName"
            )?.textContent.trim() ||
            "Professional";


        const reviewData = {

            customerId: currentUser.uid,

            customerName:
                currentUser.displayName ||
                currentUser.email?.split("@")[0] ||
                "Customer",

            workerName: workerName,

            bookingId: booking || null,

            service: serviceName,

            rating: selectedRating,

            review: text,

            text: text,

            tags: selectedTags,

            status: "PUBLISHED",

            createdAt: serverTimestamp(),

            updatedAt: serverTimestamp()

        };


        await addDoc(
            collection(db, "reviews"),
            reviewData
        );


        /* ---------- SUCCESS ---------- */

        if (successBox) {

            successBox.classList.add("show");

        }


        showToast(
            "Your review has been submitted successfully."
        );


        resetReviewForm(false);


        /* Reload reviews */

        await loadUserReviews(currentUser);


        setTimeout(() => {

            if (successBox) {
                successBox.classList.remove("show");
            }

        }, 4000);


    } catch (error) {

        console.error(
            "Review submission error:",
            error
        );

        showToast(
            "Unable to submit review. Please try again."
        );

    } finally {

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.innerHTML =
                "★ Submit Review";

        }

    }

}


/* =========================================================
   RESET REVIEW FORM
   ========================================================= */

function resetReviewForm(showToastMessage = true) {

    const form =
        document.getElementById("reviewForm");

    if (form) {
        form.reset();
    }


    selectedRating = 0;
    selectedTags = [];


    const selectedRatingInput =
        document.getElementById("selectedRating");

    const selectedRatingText =
        document.getElementById("selectedRatingText");


    if (selectedRatingInput) {
        selectedRatingInput.value = "0";
    }

    if (selectedRatingText) {
        selectedRatingText.textContent =
            "Please select a rating";
    }


    document
        .querySelectorAll(".star-btn")
        .forEach(star => {
            star.classList.remove("active");
        });


    document
        .querySelectorAll(".review-tag")
        .forEach(tag => {
            tag.classList.remove("selected");
        });


    if (showToastMessage) {
        showToast("Review form cleared.");
    }

}


/* =========================================================
   REVIEW FILTER
   ========================================================= */

function initializeFilter() {

    const filter =
        document.getElementById("reviewFilter");

    if (!filter) {
        return;
    }


    filter.addEventListener("change", () => {

        const value = filter.value;

        if (value === "all") {

            renderReviews(allReviews);
            return;

        }


        const rating =
            Number(value);

        const filtered =
            allReviews.filter(
                review =>
                    Number(review.rating) === rating
            );

        renderReviews(filtered);

    });

}


/* =========================================================
   RENDER REVIEWS
   ========================================================= */

function renderReviews(reviews) {

    const list =
        document.getElementById("reviewList");

    const empty =
        document.getElementById("reviewsEmpty");


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (!reviews.length) {

        if (empty) {
            empty.classList.add("show");
        }

        return;

    }


    if (empty) {
        empty.classList.remove("show");
    }


    reviews.forEach((review) => {

        const article =
            document.createElement("article");

        article.className = "review-item";

        article.dataset.rating =
            review.rating;


        const stars =
            createStars(review.rating);

        const initials =
            getInitials(review.reviewer);


        article.innerHTML = `

            <div class="review-item-header">

                <div class="reviewer-info">

                    <div class="reviewer-avatar">
                        ${escapeHTML(initials)}
                    </div>

                    <div>

                        <h4>
                            ${escapeHTML(review.reviewer)}
                        </h4>

                        <span>
                            ${escapeHTML(review.date)}
                        </span>

                    </div>

                </div>

                <div class="review-item-rating">
                    ${stars}
                </div>

            </div>

            <p class="review-item-text">
                ${escapeHTML(review.text)}
            </p>

            <span class="review-service-name">
                ${escapeHTML(review.service)}
            </span>

        `;


        list.appendChild(article);

    });

}


/* =========================================================
   RATING SUMMARY
   ========================================================= */

function updateRatingSummary(reviews) {

    const ratingNumber =
        document.getElementById("overallRating");

    const totalReviews =
        document.getElementById("totalReviews");

    const overallStars =
        document.getElementById("overallStars");


    if (!reviews.length) {

        if (ratingNumber) {
            ratingNumber.textContent = "0.0";
        }

        if (totalReviews) {
            totalReviews.textContent = "0";
        }

        if (overallStars) {
            overallStars.textContent = "☆☆☆☆☆";
        }

        return;

    }


    const total =
        reviews.reduce(
            (sum, review) =>
                sum + Number(review.rating || 0),
            0
        );


    const average =
        total / reviews.length;


    if (ratingNumber) {
        ratingNumber.textContent =
            average.toFixed(1);
    }


    if (totalReviews) {
        totalReviews.textContent =
            reviews.length;
    }


    if (overallStars) {

        const rounded =
            Math.round(average);

        overallStars.textContent =
            createStars(rounded);

    }


    updateRatingBreakdown(reviews);

}


/* =========================================================
   RATING BREAKDOWN
   ========================================================= */

function updateRatingBreakdown(reviews) {

    const rows =
        document.querySelectorAll(".rating-row");


    rows.forEach((row) => {

        const label =
            row.querySelector(".rating-label");

        const fill =
            row.querySelector(".rating-bar-fill");

        const count =
            row.querySelector(".rating-count");


        if (!label || !fill || !count) {
            return;
        }


        const match =
            label.textContent.match(/\d/);

        if (!match) {
            return;
        }


        const rating =
            Number(match[0]);


        const ratingCount =
            reviews.filter(
                review =>
                    Number(review.rating) === rating
            ).length;


        const percentage =
            reviews.length
                ? (ratingCount / reviews.length) * 100
                : 0;


        fill.style.width =
            `${percentage}%`;

        count.textContent =
            ratingCount;

    });

}


/* =========================================================
   CREATE STAR STRING
   ========================================================= */

function createStars(rating) {

    const value =
        Math.max(
            0,
            Math.min(5, Number(rating) || 0)
        );


    return (
        "★".repeat(value) +
        "☆".repeat(5 - value)
    );

}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

function initializeSidebar() {

    const menuButton =
        document.getElementById("mobileMenuBtn");

    const sidebar =
        document.getElementById("dashboardSidebar");


    if (!menuButton || !sidebar) {
        return;
    }


    menuButton.addEventListener("click", () => {

        sidebar.classList.toggle("open");

        createSidebarOverlay();

    });

}


/* =========================================================
   SIDEBAR OVERLAY
   ========================================================= */

function createSidebarOverlay() {

    let overlay =
        document.querySelector(".sidebar-overlay");


    if (!overlay) {

        overlay =
            document.createElement("div");

        overlay.className =
            "sidebar-overlay";

        document.body.appendChild(overlay);


        overlay.addEventListener("click", () => {

            const sidebar =
                document.getElementById(
                    "dashboardSidebar"
                );

            sidebar?.classList.remove("open");

            overlay.classList.remove("show");

        });

    }


    const sidebar =
        document.getElementById(
            "dashboardSidebar"
        );


    if (sidebar?.classList.contains("open")) {

        overlay.classList.add("show");

    } else {

        overlay.classList.remove("show");

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById("logoutBtn");


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener("click", async () => {

        try {

            await signOut(auth);

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

    });

}


/* =========================================================
   LINKS
   ========================================================= */

function initializeLinks() {

    document
        .querySelectorAll('a[href="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => event.preventDefault()
            );

        });

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast =
        document.getElementById("dashboardToast");


    if (!toast) {
        return;
    }


    toast.textContent =
        message;

    toast.classList.add("show");


    clearTimeout(
        window.skillConnectToastTimer
    );


    window.skillConnectToastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

}


/* =========================================================
   FIRESTORE DATE
   ========================================================= */

function formatFirestoreDate(timestamp) {

    if (!timestamp) {
        return "Recently";
    }


    try {

        const date =
            timestamp.toDate
                ? timestamp.toDate()
                : new Date(timestamp);


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    } catch (error) {

        return "Recently";

    }

}


/* =========================================================
   INITIALS
   ========================================================= */

function getInitials(name) {

    if (!name) {
        return "SC";
    }


    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word.charAt(0))
        .join("")
        .toUpperCase();

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}