/* =========================================================
   SKILLCONNECT - HOME PAGE
   script.js
   ========================================================= */


/* =========================================================
   SEARCH SERVICE
   ========================================================= */

function searchService() {

    const serviceInput =
        document.getElementById("serviceSearch");

    if (!serviceInput) {
        return;
    }

    const service =
        serviceInput.value.trim();


    if (!service) {

        alert("Please enter the service you need.");

        serviceInput.focus();

        return;
    }


    /*
     * Save searched service so the services page
     * can use it later.
     */

    localStorage.setItem(
        "skillconnectSelectedService",
        service
    );


    /*
     * Redirect to services page.
     */

    window.location.href =
        "services.html?service=" +
        encodeURIComponent(service);
}


/* =========================================================
   SELECT POPULAR SERVICE
   ========================================================= */

function selectService(service) {

    if (!service) {
        return;
    }


    localStorage.setItem(
        "skillconnectSelectedService",
        service
    );


    /*
     * Redirect user to services page
     * with selected service.
     */

    window.location.href =
        "services.html?service=" +
        encodeURIComponent(service);
}


/* =========================================================
   LOGIN BUTTON
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const loginButton =
            document.querySelector(".login-btn");

        const registerButton =
            document.querySelector(".register-btn");


        if (loginButton) {

            loginButton.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "login.html";
                }
            );
        }


        if (registerButton) {

            registerButton.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "register.html";
                }
            );
        }


        /* =================================================
           ENTER KEY SEARCH
           ================================================= */

        const serviceInput =
            document.getElementById(
                "serviceSearch"
            );


        if (serviceInput) {

            serviceInput.addEventListener(
                "keydown",
                event => {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        searchService();
                    }
                }
            );
        }


        /* =================================================
           LOCATION INPUT
           ================================================= */

        const searchInputs =
            document.querySelectorAll(
                ".search-box input"
            );


        if (searchInputs.length >= 2) {

            const locationInput =
                searchInputs[1];


            locationInput.addEventListener(
                "input",
                () => {

                    localStorage.setItem(
                        "skillconnectSearchLocation",
                        locationInput.value.trim()
                    );
                }
            );
        }


        /* =================================================
           LOAD SAVED SEARCH
           ================================================= */

        const savedService =
            localStorage.getItem(
                "skillconnectSelectedService"
            );


        if (
            savedService &&
            serviceInput &&
            !serviceInput.value
        ) {

            serviceInput.value =
                savedService;
        }


        /* =================================================
           ACTIVE NAVIGATION
           ================================================= */

        const navLinks =
            document.querySelectorAll(
                ".navbar nav a"
            );


        navLinks.forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );

                    link.classList.add("active");
                }
            );
        });

    }
);