/* =========================================================
   SKILLCONNECT - CUSTOMER PROFILE
   profile.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const profileForm = document.getElementById("profileForm");
    const addressForm = document.getElementById("addressForm");

    const profileName = document.getElementById("profileName");
    const profilePhone = document.getElementById("profilePhone");
    const profileEmail = document.getElementById("profileEmail");
    const profileGender = document.getElementById("profileGender");
    const profileDob = document.getElementById("profileDob");

    const profileAddress = document.getElementById("profileAddress");
    const profileCity = document.getElementById("profileCity");
    const profileState = document.getElementById("profileState");
    const profilePincode = document.getElementById("profilePincode");
    const profileLandmark = document.getElementById("profileLandmark");

    const headerName = document.getElementById("headerName");
    const headerAvatar = document.getElementById("headerAvatar");

    const profileDisplayName =
        document.getElementById("profileDisplayName");

    const profileDisplayEmail =
        document.getElementById("profileDisplayEmail");

    const profileInitials =
        document.getElementById("profileInitials");

    const photoInitials =
        document.getElementById("photoInitials");

    const profileLocation =
        document.getElementById("profileLocation");

    const memberSince =
        document.getElementById("memberSince");

    const profileBookingCount =
        document.getElementById("profileBookingCount");

    const savedAddressText =
        document.getElementById("savedAddressText");

    const profilePhoto =
        document.getElementById("profilePhoto");

    const cancelProfileBtn =
        document.getElementById("cancelProfileBtn");

    const changePasswordBtn =
        document.getElementById("changePasswordBtn");

    const profileLogoutBtn =
        document.getElementById("profileLogoutBtn");

    const emailVerificationStatus =
        document.getElementById("emailVerificationStatus");

    const verificationBadge =
        document.getElementById("verificationBadge");

    const savePreferencesBtn =
        document.getElementById("savePreferencesBtn");

    const profileToast =
        document.getElementById("profileToast");


    /* =====================================================
       LOCAL STORAGE KEYS
       ===================================================== */

    const PROFILE_KEY = "skillconnectCustomerProfile";
    const ADDRESS_KEY = "skillconnectCustomerAddress";
    const PREFERENCES_KEY = "skillconnectCustomerPreferences";


    /* =====================================================
       DEFAULT PROFILE
       ===================================================== */

    const defaultProfile = {
        name: "Customer",
        phone: "",
        email: "customer@example.com",
        gender: "",
        dob: "",
        location: "Kanpur, India",
        memberSince: new Date().getFullYear(),
        photo: ""
    };


    /* =====================================================
       HELPER FUNCTIONS
       ===================================================== */

    function getStoredData(key, fallback) {

        try {
            const data = localStorage.getItem(key);

            if (!data) {
                return fallback;
            }

            return JSON.parse(data);

        } catch (error) {

            console.error("Local storage error:", error);
            return fallback;
        }
    }


    function saveData(key, data) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(data)
            );

        } catch (error) {

            console.error("Unable to save data:", error);
        }
    }


    function getInitials(name) {

        if (!name || !name.trim()) {
            return "C";
        }

        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();
    }


    function showToast(message, type = "success") {

        if (!profileToast) {
            return;
        }

        profileToast.textContent = message;

        profileToast.className =
            "profile-toast show " + type;

        setTimeout(() => {

            profileToast.classList.remove("show");

        }, 3000);
    }


    /* =====================================================
       LOAD PROFILE
       ===================================================== */

    let profile = getStoredData(
        PROFILE_KEY,
        defaultProfile
    );

    let address = getStoredData(
        ADDRESS_KEY,
        {
            completeAddress: "",
            city: "",
            state: "",
            pincode: "",
            landmark: ""
        }
    );


    /* =====================================================
       DISPLAY PROFILE
       ===================================================== */

    function loadProfile() {

        if (profileName) {
            profileName.value = profile.name || "";
        }

        if (profilePhone) {
            profilePhone.value = profile.phone || "";
        }

        if (profileEmail) {
            profileEmail.value = profile.email || "";
        }

        if (profileGender) {
            profileGender.value = profile.gender || "";
        }

        if (profileDob) {
            profileDob.value = profile.dob || "";
        }

        if (profileDisplayName) {
            profileDisplayName.textContent =
                profile.name || "Customer";
        }

        if (profileDisplayEmail) {
            profileDisplayEmail.textContent =
                profile.email || "customer@example.com";
        }

        const initials = getInitials(profile.name);

        if (profileInitials) {
            profileInitials.textContent = initials;
        }

        if (photoInitials) {
            photoInitials.textContent = initials;
        }

        if (headerAvatar) {
            headerAvatar.textContent = initials;
        }

        if (headerName) {
            headerName.textContent =
                profile.name || "Customer";
        }

        if (profileLocation) {

            profileLocation.textContent =
                profile.location ||
                "Kanpur, India";
        }

        if (memberSince) {

            memberSince.textContent =
                profile.memberSince ||
                new Date().getFullYear();
        }

        loadProfilePhoto();
    }


    /* =====================================================
       LOAD ADDRESS
       ===================================================== */

    function loadAddress() {

        if (profileAddress) {
            profileAddress.value =
                address.completeAddress || "";
        }

        if (profileCity) {
            profileCity.value =
                address.city || "";
        }

        if (profileState) {
            profileState.value =
                address.state || "";
        }

        if (profilePincode) {
            profilePincode.value =
                address.pincode || "";
        }

        if (profileLandmark) {
            profileLandmark.value =
                address.landmark || "";
        }

        updateSavedAddress();
        updateLocation();
    }


    function updateSavedAddress() {

        if (!savedAddressText) {
            return;
        }

        const parts = [
            address.completeAddress,
            address.city,
            address.state,
            address.pincode
        ].filter(Boolean);

        if (parts.length === 0) {

            savedAddressText.textContent =
                "No address saved yet.";

            return;
        }

        savedAddressText.textContent =
            parts.join(", ");
    }


    function updateLocation() {

        if (!profileLocation) {
            return;
        }

        if (address.city && address.state) {

            profileLocation.textContent =
                `${address.city}, ${address.state}`;

        } else if (address.city) {

            profileLocation.textContent =
                address.city;

        } else {

            profileLocation.textContent =
                profile.location ||
                "Kanpur, India";
        }
    }


    /* =====================================================
       LOAD PROFILE PHOTO
       ===================================================== */

    function loadProfilePhoto() {

        if (!profile.photo) {
            return;
        }

        const containers = [
            document.querySelector(".profile-photo"),
            document.querySelector(".profile-avatar-large")
        ];

        containers.forEach(container => {

            if (!container) {
                return;
            }

            const oldImage =
                container.querySelector("img");

            if (oldImage) {
                oldImage.remove();
            }

            const img =
                document.createElement("img");

            img.src = profile.photo;
            img.alt = "Customer profile photo";

            container.innerHTML = "";
            container.appendChild(img);
        });
    }


    /* =====================================================
       COUNT BOOKINGS
       ===================================================== */

    function updateBookingCount() {

        let count = 0;

        try {

            const storedBookings =
                localStorage.getItem(
                    "skillconnectBookings"
                );

            if (storedBookings) {

                const bookings =
                    JSON.parse(storedBookings);

                if (Array.isArray(bookings)) {
                    count = bookings.length;
                }
            }

        } catch (error) {

            console.error(error);
        }


        /*
         * Also check pending booking from booking page.
         */

        const pendingBooking =
            localStorage.getItem(
                "skillconnectPendingBooking"
            );

        if (pendingBooking && count === 0) {
            count = 1;
        }


        if (profileBookingCount) {
            profileBookingCount.textContent = count;
        }
    }


    /* =====================================================
       PERSONAL FORM SUBMIT
       ===================================================== */

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const name =
                    profileName.value.trim();

                const phone =
                    profilePhone.value.trim();

                if (!name) {

                    showToast(
                        "Please enter your full name.",
                        "error"
                    );

                    profileName.focus();
                    return;
                }

                if (!phone) {

                    showToast(
                        "Please enter your phone number.",
                        "error"
                    );

                    profilePhone.focus();
                    return;
                }

                if (!/^\d{10}$/.test(phone)) {

                    showToast(
                        "Please enter a valid 10-digit phone number.",
                        "error"
                    );

                    profilePhone.focus();
                    return;
                }


                profile.name = name;
                profile.phone = phone;
                profile.gender =
                    profileGender.value;

                profile.dob =
                    profileDob.value;


                if (!profile.memberSince) {

                    profile.memberSince =
                        new Date().getFullYear();
                }


                saveData(
                    PROFILE_KEY,
                    profile
                );


                loadProfile();


                showToast(
                    "Profile updated successfully!"
                );
            }
        );
    }


    /* =====================================================
       CANCEL PROFILE CHANGES
       ===================================================== */

    if (cancelProfileBtn) {

        cancelProfileBtn.addEventListener(
            "click",
            () => {

                loadProfile();

                showToast(
                    "Changes cancelled."
                );
            }
        );
    }


    /* =====================================================
       PHONE INPUT VALIDATION
       ===================================================== */

    if (profilePhone) {

        profilePhone.addEventListener(
            "input",
            () => {

                profilePhone.value =
                    profilePhone.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
            }
        );
    }


    /* =====================================================
       ADDRESS FORM
       ===================================================== */

    if (addressForm) {

        addressForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const completeAddress =
                    profileAddress.value.trim();

                const city =
                    profileCity.value.trim();

                const state =
                    profileState.value.trim();

                const pincode =
                    profilePincode.value.trim();

                const landmark =
                    profileLandmark.value.trim();


                if (!completeAddress) {

                    showToast(
                        "Please enter your complete address.",
                        "error"
                    );

                    profileAddress.focus();
                    return;
                }

                if (!city) {

                    showToast(
                        "Please enter your city.",
                        "error"
                    );

                    profileCity.focus();
                    return;
                }

                if (!state) {

                    showToast(
                        "Please enter your state.",
                        "error"
                    );

                    profileState.focus();
                    return;
                }

                if (!/^\d{6}$/.test(pincode)) {

                    showToast(
                        "Please enter a valid 6-digit pincode.",
                        "error"
                    );

                    profilePincode.focus();
                    return;
                }


                address = {
                    completeAddress,
                    city,
                    state,
                    pincode,
                    landmark
                };


                saveData(
                    ADDRESS_KEY,
                    address
                );


                profile.location =
                    `${city}, ${state}`;

                saveData(
                    PROFILE_KEY,
                    profile
                );


                updateSavedAddress();
                updateLocation();


                showToast(
                    "Address saved successfully!"
                );
            }
        );
    }


    /* =====================================================
       PINCODE VALIDATION
       ===================================================== */

    if (profilePincode) {

        profilePincode.addEventListener(
            "input",
            () => {

                profilePincode.value =
                    profilePincode.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
            }
        );
    }


    /* =====================================================
       PROFILE PHOTO UPLOAD
       ===================================================== */

    if (profilePhoto) {

        profilePhoto.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];

                if (!file) {
                    return;
                }

                if (!file.type.startsWith("image/")) {

                    showToast(
                        "Please select an image file.",
                        "error"
                    );

                    return;
                }


                /*
                 * Limit file size to 2MB
                 */

                if (file.size > 2 * 1024 * 1024) {

                    showToast(
                        "Image size should be less than 2MB.",
                        "error"
                    );

                    profilePhoto.value = "";
                    return;
                }


                const reader =
                    new FileReader();

                reader.onload = function (e) {

                    profile.photo =
                        e.target.result;

                    saveData(
                        PROFILE_KEY,
                        profile
                    );

                    loadProfilePhoto();

                    showToast(
                        "Profile photo updated!"
                    );
                };

                reader.readAsDataURL(file);
            }
        );
    }


    /* =====================================================
       PROFILE TABS
       ===================================================== */

    const tabButtons =
        document.querySelectorAll(
            ".profile-nav-item"
        );

    const profileSections =
        document.querySelectorAll(
            ".profile-section"
        );


    tabButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const target =
                    button.dataset.tab;


                tabButtons.forEach(item => {

                    item.classList.remove("active");

                });


                profileSections.forEach(section => {

                    section.classList.remove("active");

                });


                button.classList.add("active");


                const targetSection =
                    document.querySelector(
                        `[data-section="${target}"]`
                    );


                if (targetSection) {

                    targetSection.classList.add(
                        "active"
                    );
                }


                /*
                 * Update URL without reloading.
                 */

                history.replaceState(
                    null,
                    "",
                    `#${target}`
                );
            }
        );
    });


    /* =====================================================
       OPEN TAB FROM URL HASH
       ===================================================== */

    function openTabFromHash() {

        const hash =
            window.location.hash.replace("#", "");

        if (!hash) {
            return;
        }

        const button =
            document.querySelector(
                `.profile-nav-item[data-tab="${hash}"]`
            );

        if (button) {
            button.click();
        }
    }


    /* =====================================================
       CHANGE PASSWORD
       ===================================================== */

    if (changePasswordBtn) {

        changePasswordBtn.addEventListener(
            "click",
            () => {

                const email =
                    profile.email ||
                    "your registered email";

                const confirmed =
                    confirm(
                        `A password reset link will be sent to ${email}. Continue?`
                    );

                if (!confirmed) {
                    return;
                }

                /*
                 * Firebase password reset will be connected here later.
                 */

                showToast(
                    "Password reset feature will be connected with Firebase."
                );
            }
        );
    }


    /* =====================================================
       EMAIL VERIFICATION DEMO
       ===================================================== */

    function updateVerificationStatus() {

        if (!emailVerificationStatus ||
            !verificationBadge) {
            return;
        }

        const verified =
            localStorage.getItem(
                "skillconnectEmailVerified"
            ) === "true";


        if (verified) {

            emailVerificationStatus.textContent =
                "Your email address is verified.";

            verificationBadge.textContent =
                "Verified";

            verificationBadge.classList.add(
                "verified"
            );

        } else {

            emailVerificationStatus.textContent =
                "Your email address is not verified yet.";

            verificationBadge.textContent =
                "Not Verified";

            verificationBadge.classList.remove(
                "verified"
            );
        }
    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    if (profileLogoutBtn) {

        profileLogoutBtn.addEventListener(
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

                }, 800);
            }
        );
    }


    /* =====================================================
       PREFERENCES
       ===================================================== */

    const bookingNotifications =
        document.getElementById(
            "bookingNotifications"
        );

    const messageNotifications =
        document.getElementById(
            "messageNotifications"
        );

    const offerNotifications =
        document.getElementById(
            "offerNotifications"
        );

    const emailNotifications =
        document.getElementById(
            "emailNotifications"
        );


    function loadPreferences() {

        const defaults = {
            booking: true,
            messages: true,
            offers: false,
            email: true
        };


        const preferences =
            getStoredData(
                PREFERENCES_KEY,
                defaults
            );


        if (bookingNotifications) {
            bookingNotifications.checked =
                preferences.booking;
        }

        if (messageNotifications) {
            messageNotifications.checked =
                preferences.messages;
        }

        if (offerNotifications) {
            offerNotifications.checked =
                preferences.offers;
        }

        if (emailNotifications) {
            emailNotifications.checked =
                preferences.email;
        }
    }


    if (savePreferencesBtn) {

        savePreferencesBtn.addEventListener(
            "click",
            () => {

                const preferences = {

                    booking:
                        bookingNotifications
                            ? bookingNotifications.checked
                            : true,

                    messages:
                        messageNotifications
                            ? messageNotifications.checked
                            : true,

                    offers:
                        offerNotifications
                            ? offerNotifications.checked
                            : false,

                    email:
                        emailNotifications
                            ? emailNotifications.checked
                            : true
                };


                saveData(
                    PREFERENCES_KEY,
                    preferences
                );


                showToast(
                    "Notification preferences saved!"
                );
            }
        );
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    loadProfile();

    loadAddress();

    loadPreferences();

    updateBookingCount();

    updateVerificationStatus();

    openTabFromHash();

});