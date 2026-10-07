/* =========================================================
   SKILLCONNECT - SERVICE DETAILS JAVASCRIPT
   File: service-details.js
   ========================================================= */

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import { app } from "./firebase-config.js";


/* =========================================================
   FIREBASE
   ========================================================= */

const auth = getAuth(app);
const db = getFirestore(app);


/* =========================================================
   SERVICE DATA
   ========================================================= */

const services = {

    cleaning: {
        title: "Bathroom Cleaning",
        category: "Home Cleaning",
        icon: "🧹",
        price: 399,
        rating: 4.8,
        reviews: 24,

        shortDescription:
            "Professional bathroom cleaning service with trained workers, quality cleaning products and hygienic service.",

        description:
            "Our professional bathroom cleaning service is designed to provide deep and hygienic cleaning for your bathroom. Skilled professionals clean floors, tiles, wash basin, toilet area and other surfaces using suitable cleaning products.",

        duration: "2 - 3 Hours",
        availability: "All Days",
        location: "Kanpur",
        professionals: "12+"
    },

    plumbing: {
        title: "Plumbing Service",
        category: "Home Repair",
        icon: "🔧",
        price: 299,
        rating: 4.7,
        reviews: 31,

        shortDescription:
            "Reliable plumbing services for leakage, pipe repair, taps, bathroom fittings and other household plumbing work.",

        description:
            "Get professional plumbing assistance from experienced workers. Services include leakage repair, tap installation, pipe repair, bathroom fittings and other common plumbing requirements.",

        duration: "1 - 3 Hours",
        availability: "All Days",
        location: "Kanpur",
        professionals: "18+"
    },

    electrician: {
        title: "Electrician Service",
        category: "Home Repair",
        icon: "⚡",
        price: 249,
        rating: 4.8,
        reviews: 42,

        shortDescription:
            "Professional electrician service for switches, wiring, fans, lights, sockets and other electrical requirements.",

        description:
            "Experienced electricians can help with household electrical work including wiring, switches, sockets, fans, lights and basic electrical troubleshooting.",

        duration: "1 - 2 Hours",
        availability: "All Days",
        location: "Kanpur",
        professionals: "20+"
    },

    painting: {
        title: "Home Painting",
        category: "Home Improvement",
        icon: "🎨",
        price: 499,
        rating: 4.6,
        reviews: 19,

        shortDescription:
            "Professional home painting service with experienced painters and quality finishing.",

        description:
            "Hire experienced painters for room painting, wall painting and home improvement work. Professionals help with preparation, painting and finishing.",

        duration: "4 - 8 Hours",
        availability: "All Days",
        location: "Kanpur",
        professionals: "10+"
    },

    cleaning_home: {
        title: "Home Cleaning",
        category: "Home Cleaning",
        icon: "🏠",
        price: 599,
        rating: 4.7,
        reviews: 36,

        shortDescription:
            "Complete home cleaning service for rooms, floors, kitchen and other household areas.",

        description:
            "Professional home cleaning helps keep your house clean and hygienic. Workers can clean rooms, floors, kitchen areas and other common household spaces.",

        duration: "3 - 5 Hours",
        availability: "All Days",
        location: "Kanpur",
        professionals: "15+"
    },

    ac: {
        title: "AC Service",
        category: "Appliance Repair",
        icon: "❄️",
        price: 399,
        rating: 4.7,
        reviews: 28,

        shortDescription:
            "AC servicing and basic maintenance by experienced professionals.",

        description:
            "Book experienced professionals for AC cleaning, servicing and basic maintenance to keep your cooling system working efficiently.",

        duration: "1 - 2 Hours",
        availability: "All Days",
        location: "Kanpur",
        professionals: "14+"
    }

};


/* =========================================================
   DEFAULT SERVICE
   ========================================================= */

const defaultService = services.cleaning;


/* =========================================================
   CURRENT SERVICE
   ========================================================= */

let currentService = defaultService;


/* =========================================================
   DEMO PROFESSIONALS
   ========================================================= */

const professionals = [
    {
        name: "Aman Sharma",
        initials: "AS",
        role: "Home Cleaning Specialist",
        rating: 4.9,
        experience: "5 years experience",
        price: 450,
        id: "aman-sharma"
    },
    {
        name: "Raj Kumar",
        initials: "RK",
        role: "Cleaning Professional",
        rating: 4.8,
        experience: "4 years experience",
        price: 400,
        id: "raj-kumar"
    },
    {
        name: "Vikash Singh",
        initials: "VS",
        role: "Deep Cleaning Expert",
        rating: 4.7,
        experience: "3 years experience",
        price: 399,
        id: "vikash-singh"
    }
];


/* =========================================================
   DEMO REVIEWS
   ========================================================= */

const demoReviews = [
    {
        name: "Rahul Kumar",
        initials: "RK",
        date: "25 Sep 2026",
        rating: 5,
        text:
            "Very good service. The professional arrived on time and completed the cleaning properly."
    },
    {
        name: "Priya Singh",
        initials: "PS",
        date: "18 Sep 2026",
        rating: 4,
        text:
            "Good experience and professional behaviour."
    }
];


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeService();

    initializeButtons();

    initializeFAQ();

    initializeSidebar();

    initializeLogout();

    initializeNavigation();

});


/* =========================================================
   AUTH
   ========================================================= */

onAuthStateChanged(auth, (user) => {

    updateUserUI(user);

});


/* =========================================================
   INITIALIZE SERVICE
   ========================================================= */

function initializeService() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const serviceParam =
        params.get("service") ||
        params.get("id") ||
        params.get("category");


    currentService =
        findService(serviceParam);


    if (!currentService) {

        currentService = defaultService;

    }


    renderService(currentService);

}


/* =========================================================
   FIND SERVICE
   ========================================================= */

function findService(value) {

    if (!value) {
        return null;
    }


    const normalized =
        value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "_");


    if (services[normalized]) {
        return services[normalized];
    }


    const found =
        Object.values(services).find(service =>

            service.title
                .toLowerCase()
                .includes(
                    value.toLowerCase()
                )

        );


    return found || null;

}


/* =========================================================
   RENDER SERVICE
   ========================================================= */

function renderService(service) {

    setText(
        "breadcrumbService",
        service.title
    );

    setText(
        "serviceIcon",
        service.icon
    );

    setText(
        "serviceCategory",
        service.category
    );

    setText(
        "serviceTitle",
        service.title
    );

    setText(
        "serviceDescriptionShort",
        service.shortDescription
    );

    setText(
        "servicePrice",
        `₹${service.price}`
    );

    setText(
        "serviceRating",
        service.rating
    );

    setText(
        "serviceReviewCount",
        service.reviews
    );

    setText(
        "serviceDescription",
        service.description
    );

    setText(
        "quickCategory",
        service.category
    );

    setText(
        "professionalCount",
        service.professionals
    );


    const stars =
        document.getElementById(
            "serviceRatingStars"
        );

    if (stars) {

        stars.textContent =
            createStars(service.rating);

    }


    document.title =
        `${service.title} | SkillConnect`;


    renderProfessionals();

    renderReviews();

}


/* =========================================================
   RENDER PROFESSIONALS
   ========================================================= */

function renderProfessionals() {

    const container =
        document.getElementById(
            "professionalList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    professionals.forEach(professional => {

        const item =
            document.createElement("div");

        item.className =
            "professional-item";


        item.innerHTML = `

            <div class="professional-avatar">
                ${escapeHTML(professional.initials)}
            </div>

            <div class="professional-info">

                <h4>
                    ${escapeHTML(professional.name)}
                </h4>

                <p>
                    ${escapeHTML(professional.role)}
                </p>

                <div class="professional-meta">

                    <span class="professional-rating">
                        ★ ${professional.rating}
                    </span>

                    <span class="professional-experience">
                        ${escapeHTML(professional.experience)}
                    </span>

                </div>

            </div>

            <div class="professional-price">

                <strong>
                    ₹${professional.price}
                </strong>

                <span>
                    starting
                </span>

                <br>

                <button
                    type="button"
                    class="professional-view-btn"
                    data-worker-id="${escapeHTML(professional.id)}">

                    View Profile →

                </button>

            </div>

        `;


        const viewButton =
            item.querySelector(
                ".professional-view-btn"
            );


        viewButton?.addEventListener(
            "click",
            () => {

                const workerId =
                    viewButton.dataset.workerId;

                window.location.href =
                    `worker-profile.html?id=${encodeURIComponent(workerId)}`;

            }
        );


        container.appendChild(item);

    });

}


/* =========================================================
   RENDER REVIEWS
   ========================================================= */

function renderReviews() {

    const container =
        document.getElementById(
            "serviceReviews"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    demoReviews.forEach(review => {

        const article =
            document.createElement("article");

        article.className =
            "service-review";


        article.innerHTML = `

            <div class="service-review-header">

                <div class="service-review-user">

                    <div class="service-review-avatar">
                        ${escapeHTML(review.initials)}
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(review.name)}
                        </strong>

                        <span>
                            ${escapeHTML(review.date)}
                        </span>

                    </div>

                </div>

                <div class="service-review-rating">
                    ${createStars(review.rating)}
                </div>

            </div>

            <p>
                ${escapeHTML(review.text)}
            </p>

        `;


        container.appendChild(article);

    });

}


/* =========================================================
   BUTTONS
   ========================================================= */

function initializeButtons() {

    const bookButton =
        document.getElementById(
            "bookServiceBtn"
        );

    const postJobButton =
        document.getElementById(
            "postJobFromServiceBtn"
        );


    if (bookButton) {

        bookButton.addEventListener(
            "click",
            () => {

                const params =
                    new URLSearchParams({

                        service:
                            currentService.title,

                        category:
                            currentService.category,

                        price:
                            currentService.price

                    });


                window.location.href =
                    `booking.html?${params.toString()}`;

            }
        );

    }


    if (postJobButton) {

        postJobButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    `post-job.html?service=${encodeURIComponent(currentService.title)}`;

            }
        );

    }

}


/* =========================================================
   FAQ
   ========================================================= */

function initializeFAQ() {

    const questions =
        document.querySelectorAll(
            ".faq-question"
        );


    questions.forEach(question => {

        question.addEventListener(
            "click",
            () => {

                const item =
                    question.closest(
                        ".faq-item"
                    );


                if (!item) {
                    return;
                }


                const wasOpen =
                    item.classList.contains(
                        "open"
                    );


                document
                    .querySelectorAll(
                        ".faq-item.open"
                    )
                    .forEach(openItem => {

                        openItem.classList.remove(
                            "open"
                        );

                    });


                if (!wasOpen) {

                    item.classList.add(
                        "open"
                    );

                }

            }
        );

    });

}


/* =========================================================
   SIDEBAR
   ========================================================= */

function initializeSidebar() {

    const menuButton =
        document.getElementById(
            "mobileMenuBtn"
        );

    const sidebar =
        document.getElementById(
            "dashboardSidebar"
        );


    if (!menuButton || !sidebar) {
        return;
    }


    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

            toggleOverlay(
                sidebar.classList.contains(
                    "open"
                )
            );

        }
    );

}


/* =========================================================
   OVERLAY
   ========================================================= */

function toggleOverlay(show) {

    let overlay =
        document.querySelector(
            ".sidebar-overlay"
        );


    if (!overlay) {

        overlay =
            document.createElement("div");

        overlay.className =
            "sidebar-overlay";

        document.body.appendChild(
            overlay
        );


        overlay.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "dashboardSidebar"
                    )
                    ?.classList.remove(
                        "open"
                    );

                overlay.classList.remove(
                    "show"
                );

            }
        );

    }


    overlay.classList.toggle(
        "show",
        show
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        async () => {

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
                    "Unable to logout."
                );

            }

        }
    );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function initializeNavigation() {

    document
        .querySelectorAll(
            'a[href="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                }
            );

        });

}


/* =========================================================
   USER UI
   ========================================================= */

function updateUserUI(user) {

    if (!user) {
        return;
    }


    const name =
        user.displayName ||
        user.email?.split("@")[0] ||
        "Customer";


    const initials =
        getInitials(name);


    setText(
        "sidebarCustomerName",
        name
    );

    setText(
        "sidebarCustomerAvatar",
        initials
    );

    setText(
        "headerName",
        name
    );

    setText(
        "headerAvatar",
        initials
    );

}


/* =========================================================
   HELPERS
   ========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


function createStars(rating) {

    const full =
        Math.floor(Number(rating));

    const half =
        Number(rating) % 1 >= 0.5;

    let result =
        "★".repeat(full);

    if (half) {
        result += "★";
    }

    const remaining =
        5 - result.length;

    if (remaining > 0) {
        result += "☆".repeat(remaining);
    }

    return result;

}


function getInitials(name) {

    if (!name) {
        return "SC";
    }


    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word =>
            word.charAt(0)
        )
        .join("")
        .toUpperCase();

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   TOAST
   ========================================================= */

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

    toast.classList.add("show");


    clearTimeout(
        window.skillConnectToastTimer
    );


    window.skillConnectToastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);

}