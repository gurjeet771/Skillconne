/* =========================================================
   SKILLCONNECT - WORKER PROFILE JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       DEFAULT DATA
       ===================================================== */

    const defaultWorker = {
        name: "Aman Sharma",
        email: "aman@example.com",
        phone: "9876543210",
        gender: "male",
        experience: "5 years",
        price: 400,
        title: "Home Cleaning Specialist",
        about: "Experienced professional providing reliable home cleaning services with quality work and customer satisfaction.",
        city: "Kanpur",
        state: "Uttar Pradesh",
        pincode: "208001",
        radius: "10",

        skills: [
            "Bathroom Cleaning",
            "Home Cleaning",
            "Deep Cleaning"
        ],

        available: true,
        rating: 4.8,
        reviews: 24,
        completedJobs: 0,
        responseRate: 95,

        verification: "approved"
    };


    /* =====================================================
       STORAGE
       ===================================================== */

    const PROFILE_KEY = "skillconnect_worker_profile";
    const PORTFOLIO_KEY = "skillconnect_worker_portfolio";


    /* =====================================================
       LOAD DATA
       ===================================================== */

    let worker = loadWorker();

    let portfolio = loadPortfolio();


    function loadWorker() {

        try {

            const saved =
                localStorage.getItem(PROFILE_KEY);

            if (saved) {

                const parsed =
                    JSON.parse(saved);

                return {
                    ...defaultWorker,
                    ...parsed
                };
            }

        } catch (error) {

            console.error(
                "Worker profile load error:",
                error
            );
        }

        return {
            ...defaultWorker
        };
    }


    function saveWorker() {

        localStorage.setItem(
            PROFILE_KEY,
            JSON.stringify(worker)
        );
    }


    function loadPortfolio() {

        try {

            const saved =
                localStorage.getItem(PORTFOLIO_KEY);

            return saved
                ? JSON.parse(saved)
                : [];

        } catch (error) {

            console.error(
                "Portfolio load error:",
                error
            );

            return [];
        }
    }


    function savePortfolio() {

        try {

            localStorage.setItem(
                PORTFOLIO_KEY,
                JSON.stringify(portfolio)
            );

        } catch (error) {

            showToast(
                "Storage full. Please use smaller images."
            );
        }
    }


    /* =====================================================
       DOM ELEMENTS
       ===================================================== */

    const profileForm =
        document.getElementById("profileForm");

    const locationForm =
        document.getElementById("locationForm");

    const skillInput =
        document.getElementById("skillInput");

    const addSkillBtn =
        document.getElementById("addSkillBtn");

    const skillsList =
        document.getElementById("skillsList");

    const availabilityToggle =
        document.getElementById("availabilityToggle");

    const availabilityBox =
        document.getElementById("availabilityBox");

    const portfolioInput =
        document.getElementById("portfolioInput");

    const portfolioGrid =
        document.getElementById("portfolioGrid");

    const menuBtn =
        document.getElementById("menuBtn");

    const sidebar =
        document.getElementById("sidebar");


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    fillProfileForm();

    updateProfileUI();

    renderSkills();

    renderPortfolio();

    updateAvailability();

    updateVerification();


    /* =====================================================
       FILL FORM
       ===================================================== */

    function fillProfileForm() {

        setValue("workerName", worker.name);
        setValue("workerEmail", worker.email);
        setValue("workerPhone", worker.phone);
        setValue("workerGender", worker.gender);
        setValue("workerExperience", worker.experience);
        setValue("workerPrice", worker.price);
        setValue("workerTitle", worker.title);
        setValue("workerAbout", worker.about);

        setValue("workerCity", worker.city);
        setValue("workerState", worker.state);
        setValue("workerPincode", worker.pincode);
        setValue("serviceRadius", worker.radius);
    }


    /* =====================================================
       UPDATE PROFILE UI
       ===================================================== */

    function updateProfileUI() {

        const initials =
            getInitials(worker.name);


        // Names

        setText(
            "sidebarName",
            worker.name
        );

        setText(
            "headerName",
            worker.name
        );

        setText(
            "heroName",
            worker.name
        );


        // Avatar

        setText(
            "sidebarAvatar",
            initials
        );

        setText(
            "headerAvatar",
            initials
        );

        setText(
            "bigAvatar",
            initials
        );


        // Professional title

        setText(
            "heroTitle",
            worker.title
        );


        // Rating

        setText(
            "heroRating",
            Number(worker.rating).toFixed(1)
        );

        setText(
            "heroReviews",
            worker.reviews
        );

        setText(
            "heroStars",
            makeStars(worker.rating)
        );


        // Stats

        setText(
            "statExperience",
            capitalize(worker.experience)
        );

        setText(
            "statJobs",
            worker.completedJobs
        );

        setText(
            "statPrice",
            "₹" + Number(worker.price).toLocaleString("en-IN")
        );

        setText(
            "statResponse",
            worker.responseRate + "%"
        );


        // Side profile

        setText(
            "sideName",
            worker.name
        );

        setText(
            "sideCategory",
            getCategory()
        );

        setText(
            "sideExperience",
            capitalize(worker.experience)
        );

        setText(
            "sideLocation",
            worker.city + ", " + worker.state
        );

        setText(
            "sidePrice",
            "₹" + Number(worker.price).toLocaleString("en-IN")
        );


        // Rating card

        setText(
            "sideRating",
            Number(worker.rating).toFixed(1)
        );

        setText(
            "sideStars",
            makeStars(worker.rating)
        );

        setText(
            "sideReviews",
            worker.reviews
        );
    }


    /* =====================================================
       SAVE PROFILE
       ===================================================== */

    profileForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                .getElementById("workerName")
                .value.trim();

            const phone =
                document
                .getElementById("workerPhone")
                .value.trim();

            const experience =
                document
                .getElementById("workerExperience")
                .value.trim();

            const price =
                Number(
                    document
                    .getElementById("workerPrice")
                    .value
                );

            const title =
                document
                .getElementById("workerTitle")
                .value.trim();

            const about =
                document
                .getElementById("workerAbout")
                .value.trim();


            if (
                !name ||
                !phone ||
                !experience ||
                !price ||
                !title ||
                !about
            ) {

                showToast(
                    "Please fill all required fields."
                );

                return;
            }


            if (!/^\d{10}$/.test(phone)) {

                showToast(
                    "Enter a valid 10 digit mobile number."
                );

                return;
            }


            worker.name = name;
            worker.phone = phone;
            worker.gender =
                document
                .getElementById("workerGender")
                .value;

            worker.experience =
                experience;

            worker.price =
                price;

            worker.title =
                title;

            worker.about =
                about;


            saveWorker();

            updateProfileUI();

            fillProfileForm();

            showToast(
                "Profile saved successfully."
            );
        }
    );


    /* =====================================================
       CANCEL
       ===================================================== */

    document
        .getElementById("cancelBtn")
        .addEventListener(
            "click",
            function () {

                fillProfileForm();

                showToast(
                    "Changes cancelled."
                );
            }
        );


    /* =====================================================
       EDIT PROFILE BUTTON
       ===================================================== */

    document
        .getElementById("editProfileBtn")
        .addEventListener(
            "click",
            function () {

                const input =
                    document.getElementById(
                        "workerName"
                    );

                input.focus();

                input.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                showToast(
                    "You can edit your profile below."
                );
            }
        );


    /* =====================================================
       LOCATION
       ===================================================== */

    locationForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const city =
                document
                .getElementById("workerCity")
                .value.trim();

            const state =
                document
                .getElementById("workerState")
                .value.trim();

            const pincode =
                document
                .getElementById("workerPincode")
                .value.trim();

            const radius =
                document
                .getElementById("serviceRadius")
                .value;


            if (!city || !state || !pincode) {

                showToast(
                    "Please fill all location fields."
                );

                return;
            }


            if (!/^\d{6}$/.test(pincode)) {

                showToast(
                    "Enter a valid 6 digit pincode."
                );

                return;
            }


            worker.city =
                city;

            worker.state =
                state;

            worker.pincode =
                pincode;

            worker.radius =
                radius;


            saveWorker();

            updateProfileUI();

            showToast(
                "Location saved successfully."
            );
        }
    );


    /* =====================================================
       ADD SKILL
       ===================================================== */

    addSkillBtn.addEventListener(
        "click",
        addSkill
    );


    skillInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                addSkill();
            }
        }
    );


    function addSkill() {

        const skill =
            skillInput.value.trim();


        if (!skill) {

            showToast(
                "Enter a skill first."
            );

            return;
        }


        const exists =
            worker.skills.some(
                function (item) {

                    return item.toLowerCase() ===
                        skill.toLowerCase();
                }
            );


        if (exists) {

            showToast(
                "This skill already exists."
            );

            return;
        }


        worker.skills.push(skill);

        saveWorker();

        skillInput.value = "";

        renderSkills();

        updateProfileUI();

        showToast(
            "Skill added successfully."
        );
    }


    /* =====================================================
       RENDER SKILLS
       ===================================================== */

    function renderSkills() {

        skillsList.innerHTML = "";


        worker.skills.forEach(
            function (skill, index) {

                const div =
                    document.createElement("div");

                div.className = "skill";


                const text =
                    document.createElement("span");

                text.textContent =
                    skill;


                const button =
                    document.createElement("button");

                button.type = "button";

                button.className =
                    "remove-skill";

                button.textContent = "×";


                button.addEventListener(
                    "click",
                    function () {

                        removeSkill(index);
                    }
                );


                div.appendChild(text);

                div.appendChild(button);

                skillsList.appendChild(div);
            }
        );
    }


    /* =====================================================
       REMOVE SKILL
       ===================================================== */

    function removeSkill(index) {

        if (worker.skills.length <= 1) {

            showToast(
                "At least one skill is required."
            );

            return;
        }


        worker.skills.splice(
            index,
            1
        );


        saveWorker();

        renderSkills();

        updateProfileUI();

        showToast(
            "Skill removed."
        );
    }


    /* =====================================================
       AVAILABILITY
       ===================================================== */

    availabilityToggle.addEventListener(
        "change",
        function () {

            worker.available =
                availabilityToggle.checked;

            saveWorker();

            updateAvailability();


            if (worker.available) {

                showToast(
                    "You are now available for jobs."
                );

            } else {

                showToast(
                    "You are now unavailable for jobs."
                );
            }
        }
    );


    function updateAvailability() {

        availabilityToggle.checked =
            worker.available;


        if (worker.available) {

            availabilityBox.classList.remove(
                "offline"
            );

            document
                .getElementById("availabilityTitle")
                .textContent =
                "Available for Jobs";

            document
                .getElementById("availabilityText")
                .textContent =
                "Customers can currently send you job requests.";

            document
                .getElementById("onlineDot")
                .classList.remove(
                    "offline"
                );

        } else {

            availabilityBox.classList.add(
                "offline"
            );

            document
                .getElementById("availabilityTitle")
                .textContent =
                "Currently Unavailable";

            document
                .getElementById("availabilityText")
                .textContent =
                "Customers cannot send you new job requests right now.";

            document
                .getElementById("onlineDot")
                .classList.add(
                    "offline"
                );
        }
    }


    /* =====================================================
       PORTFOLIO UPLOAD
       ===================================================== */

    portfolioInput.addEventListener(
        "change",
        function (event) {

            const files =
                Array.from(
                    event.target.files
                );


            files.forEach(
                function (file) {

                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {
                        return;
                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        function (e) {

                            portfolio.push({
                                id:
                                    Date.now() +
                                    Math.random(),

                                image:
                                    e.target.result
                            });


                            savePortfolio();

                            renderPortfolio();

                            showToast(
                                "Photo added to portfolio."
                            );
                        };


                    reader.readAsDataURL(file);
                }
            );


            portfolioInput.value = "";
        }
    );


    /* =====================================================
       RENDER PORTFOLIO
       ===================================================== */

    function renderPortfolio() {

        portfolioGrid.innerHTML = "";


        portfolio.forEach(
            function (item) {

                const box =
                    document.createElement("div");

                box.className =
                    "portfolio-item";


                const image =
                    document.createElement("img");

                image.src =
                    item.image;

                image.alt =
                    "Work portfolio";


                const deleteBtn =
                    document.createElement("button");

                deleteBtn.type =
                    "button";

                deleteBtn.className =
                    "portfolio-delete";

                deleteBtn.textContent =
                    "×";


                deleteBtn.addEventListener(
                    "click",
                    function () {

                        portfolio =
                            portfolio.filter(
                                function (photo) {

                                    return photo.id !==
                                        item.id;
                                }
                            );


                        savePortfolio();

                        renderPortfolio();

                        showToast(
                            "Photo removed."
                        );
                    }
                );


                box.appendChild(image);

                box.appendChild(deleteBtn);

                portfolioGrid.appendChild(box);
            }
        );
    }


    /* =====================================================
       VERIFICATION
       ===================================================== */

    function updateVerification() {

        const box =
            document.getElementById(
                "verificationBox"
            );

        const title =
            document.getElementById(
                "verificationTitle"
            );

        const text =
            document.getElementById(
                "verificationText"
            );

        const badge =
            document.getElementById(
                "verificationBadge"
            );


        box.classList.remove(
            "pending",
            "rejected"
        );

        badge.classList.remove(
            "pending",
            "rejected"
        );


        if (
            worker.verification ===
            "approved"
        ) {

            title.textContent =
                "✓ Profile Verified";

            text.textContent =
                "Your professional profile has been verified.";

            badge.textContent =
                "✓ Verified Professional";

        }

        else if (
            worker.verification ===
            "pending"
        ) {

            box.classList.add(
                "pending"
            );

            badge.classList.add(
                "pending"
            );

            title.textContent =
                "⏳ Verification Pending";

            text.textContent =
                "Your professional profile is currently under review.";

            badge.textContent =
                "Verification Pending";

        }

        else {

            box.classList.add(
                "rejected"
            );

            badge.classList.add(
                "rejected"
            );

            title.textContent =
                "✕ Verification Rejected";

            text.textContent =
                "Please update your verification details and try again.";

            badge.textContent =
                "Verification Required";
        }
    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    menuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );
        }
    );


    document
        .querySelectorAll(".nav-link")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        sidebar.classList.remove(
                            "open"
                        );
                    }
                );
            }
        );


    /* =====================================================
       LOGOUT
       ===================================================== */

    document
        .getElementById("logoutBtn")
        .addEventListener(
            "click",
            logout
        );


    document
        .getElementById("profileLogoutBtn")
        .addEventListener(
            "click",
            logout
        );


    function logout() {

        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmLogout) {
            return;
        }


        showToast(
            "Logging out..."
        );


        setTimeout(
            function () {

                window.location.href =
                    "login.html";

            },
            700
        );
    }


    /* =====================================================
       TOAST
       ===================================================== */

    let toastTimer;


    function showToast(message) {

        const toast =
            document.getElementById(
                "toast"
            );


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
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                2500
            );
    }


    /* =====================================================
       HELPERS
       ===================================================== */

    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent =
                value;
        }
    }


    function setValue(id, value) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value =
                value ?? "";
        }
    }


    function getInitials(name) {

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(
                function (word) {

                    return word
                        .charAt(0)
                        .toUpperCase();
                }
            )
            .join("");
    }


    function getCategory() {

        if (
            !worker.skills ||
            worker.skills.length === 0
        ) {

            return "Professional";
        }

        return worker.skills[0];
    }


    function capitalize(text) {

        if (!text) {
            return "";
        }

        return text
            .replace(
                /\b\w/g,
                function (char) {
                    return char.toUpperCase();
                }
            );
    }


    function makeStars(rating) {

        const rounded =
            Math.round(Number(rating));

        let result = "";

        for (
            let i = 1;
            i <= 5;
            i++
        ) {

            result +=
                i <= rounded
                    ? "★"
                    : "☆";
        }

        return result;
    }

});