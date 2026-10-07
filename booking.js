/* =========================================================
   SKILLCONNECT
   BOOKING JAVASCRIPT
   File: booking.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const bookingForm = document.getElementById("bookingForm");

    const serviceSelect = document.getElementById("service");
    const professionalSelect = document.getElementById("professional");
    const serviceDate = document.getElementById("serviceDate");
    const serviceTime = document.getElementById("serviceTime");
    const duration = document.getElementById("duration");
    const pincode = document.getElementById("pincode");

    const summaryService =
        document.getElementById("summaryService");

    const summaryProfessional =
        document.getElementById("summaryProfessional");

    const summaryDate =
        document.getElementById("summaryDate");

    const summaryTime =
        document.getElementById("summaryTime");

    const summaryDuration =
        document.getElementById("summaryDuration");

    const servicePrice =
        document.getElementById("servicePrice");

    const totalPrice =
        document.getElementById("totalPrice");

    const confirmBookingBtn =
        document.getElementById("confirmBookingBtn");


    /* =====================================================
       SERVICE PRICES
    ===================================================== */

    const servicePrices = {
        "home-cleaning": 350,
        "bathroom-cleaning": 350,
        "plumbing": 450,
        "electrician": 400,
        "ac-repair": 600,
        "carpenter": 500,
        "painting": 700,
        "appliance-repair": 550
    };


    /* =====================================================
       PROFESSIONAL DATA
    ===================================================== */

    const professionals = {
        "rahul-kumar": {
            name: "Rahul Kumar",
            price: 350
        },

        "amit-sharma": {
            name: "Amit Sharma",
            price: 400
        },

        "rohit-verma": {
            name: "Rohit Verma",
            price: 450
        }
    };


    /* =====================================================
       SET MINIMUM DATE
    ===================================================== */

    if (serviceDate) {

        const today = new Date();

        const year = today.getFullYear();

        const month =
            String(today.getMonth() + 1).padStart(2, "0");

        const day =
            String(today.getDate()).padStart(2, "0");

        serviceDate.min =
            `${year}-${month}-${day}`;
    }


    /* =====================================================
       UPDATE SERVICE SUMMARY
    ===================================================== */

    function updateServiceSummary() {

        if (!serviceSelect) {
            return;
        }

        const selectedOption =
            serviceSelect.options[
                serviceSelect.selectedIndex
            ];

        if (
            selectedOption &&
            selectedOption.value
        ) {

            summaryService.textContent =
                selectedOption.textContent.trim();

        } else {

            summaryService.textContent =
                "Select Service";
        }


        updatePrice();
    }


    /* =====================================================
       UPDATE PROFESSIONAL SUMMARY
    ===================================================== */

    function updateProfessionalSummary() {

        const selectedOption =
            professionalSelect.options[
                professionalSelect.selectedIndex
            ];

        if (
            selectedOption &&
            selectedOption.value
        ) {

            const professional =
                professionals[selectedOption.value];

            summaryProfessional.textContent =
                professional
                    ? professional.name
                    : selectedOption.textContent
                        .replace(/⭐.*$/, "")
                        .trim();

        } else {

            summaryProfessional.textContent =
                "Select Professional";
        }


        updatePrice();
    }


    /* =====================================================
       UPDATE DATE
    ===================================================== */

    function updateDateSummary() {

        if (
            !serviceDate ||
            !serviceDate.value
        ) {
            summaryDate.textContent =
                "Select Date";

            return;
        }

        const date =
            new Date(
                serviceDate.value + "T00:00:00"
            );

        const options = {
            day: "2-digit",
            month: "short",
            year: "numeric"
        };

        summaryDate.textContent =
            date.toLocaleDateString(
                "en-IN",
                options
            );
    }


    /* =====================================================
       UPDATE TIME
    ===================================================== */

    function updateTimeSummary() {

        if (
            !serviceTime ||
            !serviceTime.value
        ) {
            summaryTime.textContent =
                "Select Time";

            return;
        }

        const [hours, minutes] =
            serviceTime.value.split(":");

        let hour =
            parseInt(hours, 10);

        const ampm =
            hour >= 12 ? "PM" : "AM";

        hour =
            hour % 12 || 12;

        summaryTime.textContent =
            `${hour}:${minutes} ${ampm}`;
    }


    /* =====================================================
       UPDATE DURATION
    ===================================================== */

    function updateDurationSummary() {

        if (
            !duration ||
            !duration.value
        ) {
            summaryDuration.textContent =
                "2 Hours";

            return;
        }

        const value =
            parseInt(duration.value, 10);

        summaryDuration.textContent =
            value >= 5
                ? "5+ Hours"
                : `${value} Hour${value > 1 ? "s" : ""}`;
    }


    /* =====================================================
       UPDATE PRICE
    ===================================================== */

    function updatePrice() {

        let price = 350;

        if (
            professionalSelect &&
            professionalSelect.value &&
            professionals[professionalSelect.value]
        ) {

            price =
                professionals[
                    professionalSelect.value
                ].price;

        } else if (
            serviceSelect &&
            servicePrices[serviceSelect.value]
        ) {

            price =
                servicePrices[
                    serviceSelect.value
                ];
        }


        const platformFee = 30;

        const tax = 20;

        const total =
            price + platformFee + tax;


        if (servicePrice) {
            servicePrice.textContent =
                `₹${price}`;
        }

        if (totalPrice) {
            totalPrice.textContent =
                `₹${total}`;
        }
    }


    /* =====================================================
       PINCODE VALIDATION
    ===================================================== */

    if (pincode) {

        pincode.addEventListener(
            "input",
            () => {

                pincode.value =
                    pincode.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
            }
        );
    }


    /* =====================================================
       EVENT LISTENERS
    ===================================================== */

    if (serviceSelect) {

        serviceSelect.addEventListener(
            "change",
            updateServiceSummary
        );
    }


    if (professionalSelect) {

        professionalSelect.addEventListener(
            "change",
            updateProfessionalSummary
        );
    }


    if (serviceDate) {

        serviceDate.addEventListener(
            "change",
            updateDateSummary
        );
    }


    if (serviceTime) {

        serviceTime.addEventListener(
            "change",
            updateTimeSummary
        );
    }


    if (duration) {

        duration.addEventListener(
            "change",
            updateDurationSummary
        );
    }


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                /* Browser validation */

                if (
                    !bookingForm.checkValidity()
                ) {

                    bookingForm.reportValidity();

                    return;
                }


                /* Validate pincode */

                if (
                    !/^\d{6}$/.test(
                        pincode.value.trim()
                    )
                ) {

                    alert(
                        "Please enter a valid 6-digit pincode."
                    );

                    pincode.focus();

                    return;
                }


                /* Validate date */

                const selectedDate =
                    new Date(
                        serviceDate.value +
                        "T00:00:00"
                    );

                const today =
                    new Date();

                today.setHours(
                    0,
                    0,
                    0,
                    0
                );

                if (selectedDate < today) {

                    alert(
                        "Please select today or a future date."
                    );

                    serviceDate.focus();

                    return;
                }


                /* Get booking information */

                const serviceName =
                    serviceSelect
                        .options[
                            serviceSelect.selectedIndex
                        ]
                        .textContent
                        .trim();

                const professional =
                    professionals[
                        professionalSelect.value
                    ];

                const total =
                    parseInt(
                        totalPrice.textContent
                            .replace(/[₹,]/g, ""),
                        10
                    );


                /* Save temporary booking data */

                const bookingData = {

                    bookingId:
                        "SC-" +
                        new Date()
                            .getFullYear() +
                        "-" +
                        Math.floor(
                            10000 +
                            Math.random() * 90000
                        ),

                    service:
                        serviceName,

                    professional:
                        professional
                            ? professional.name
                            : "Selected Professional",

                    date:
                        serviceDate.value,

                    time:
                        serviceTime.value,

                    duration:
                        duration.value,

                    address:
                        document
                            .getElementById("address")
                            .value
                            .trim(),

                    city:
                        document
                            .getElementById("city")
                            .value
                            .trim(),

                    pincode:
                        pincode.value.trim(),

                    landmark:
                        document
                            .getElementById("landmark")
                            .value
                            .trim(),

                    notes:
                        document
                            .getElementById("notes")
                            .value
                            .trim(),

                    contactPreference:
                        document.querySelector(
                            'input[name="contactPreference"]:checked'
                        )?.value || "call",

                    total:
                        total,

                    status:
                        "PENDING",

                    createdAt:
                        new Date().toISOString()
                };


                /* Store locally for now */

                localStorage.setItem(
                    "skillconnectPendingBooking",
                    JSON.stringify(
                        bookingData
                    )
                );


                /* Button loading */

                const originalText =
                    confirmBookingBtn.textContent;

                confirmBookingBtn.disabled =
                    true;

                confirmBookingBtn.textContent =
                    "Processing...";


                setTimeout(() => {

                    alert(
                        "Booking request submitted successfully!\n\n" +
                        "Booking ID: " +
                        bookingData.bookingId
                    );


                    window.location.href =
                        "booking-details.html";

                }, 900);
            }
        );
    }


    /* =====================================================
       CONTACT SUPPORT
    ===================================================== */

    window.contactSupport = function () {

        const email =
            "support@skillconnect.com";

        const subject =
            encodeURIComponent(
                "SkillConnect Booking Support"
            );

        const body =
            encodeURIComponent(
                "Hello SkillConnect Support,\n\n" +
                "I need help regarding my booking.\n\n" +
                "Thank you."
            );

        window.location.href =
            `mailto:${email}?subject=${subject}&body=${body}`;
    };


    /* =====================================================
       INITIAL SUMMARY
    ===================================================== */

    updateServiceSummary();
    updateProfessionalSummary();
    updateDateSummary();
    updateTimeSummary();
    updateDurationSummary();
    updatePrice();

});