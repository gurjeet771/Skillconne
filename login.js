/* =========================================================
   SKILLCONNECT AUTHENTICATION
   auth.js
   ========================================================= */

import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import { app } from "./firebase-config.js";


/* =========================================================
   FIREBASE INITIALIZATION
   ========================================================= */

const auth = getAuth(app);
const db = getFirestore(app);


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const rememberMe = document.getElementById("rememberMe");

const loginBtn = document.getElementById("loginBtn");
const authMessage = document.getElementById("authMessage");

const forgotPasswordLink =
    document.getElementById("forgotPasswordLink");

const googleLoginBtn =
    document.getElementById("googleLoginBtn");


/* =========================================================
   MESSAGE FUNCTION
   ========================================================= */

function showMessage(message, type = "info") {

    if (!authMessage) return;

    authMessage.textContent = message;

    authMessage.className = "auth-message show " + type;
}


/* =========================================================
   CLEAR MESSAGE
   ========================================================= */

function clearMessage() {

    if (!authMessage) return;

    authMessage.textContent = "";
    authMessage.className = "auth-message";
}


/* =========================================================
   LOADING STATE
   ========================================================= */

function setLoading(isLoading) {

    if (!loginBtn) return;

    loginBtn.disabled = isLoading;

    if (isLoading) {
        loginBtn.classList.add("loading");
    } else {
        loginBtn.classList.remove("loading");
    }
}


/* =========================================================
   EMAIL VALIDATION
   ========================================================= */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


/* =========================================================
   SAVE REMEMBERED EMAIL
   ========================================================= */

function saveRememberedEmail() {

    if (!loginEmail) return;

    if (rememberMe && rememberMe.checked) {

        localStorage.setItem(
            "skillconnectRememberedEmail",
            loginEmail.value.trim()
        );

    } else {

        localStorage.removeItem(
            "skillconnectRememberedEmail"
        );
    }
}


/* =========================================================
   LOAD REMEMBERED EMAIL
   ========================================================= */

function loadRememberedEmail() {

    const savedEmail =
        localStorage.getItem(
            "skillconnectRememberedEmail"
        );

    if (savedEmail && loginEmail) {

        loginEmail.value = savedEmail;

        if (rememberMe) {
            rememberMe.checked = true;
        }
    }
}


/* =========================================================
   GET USER ROLE FROM FIRESTORE
   ========================================================= */

async function getUserRole(uid) {

    try {

        const userRef = doc(db, "users", uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {

            const userData = userSnapshot.data();

            return userData.role || "customer";
        }

        return "customer";

    } catch (error) {

        console.error(
            "Error getting user role:",
            error
        );

        return "customer";
    }
}


/* =========================================================
   REDIRECT USER BASED ON ROLE
   ========================================================= */

async function redirectUser(user) {

    const role = await getUserRole(user.uid);

    localStorage.setItem(
        "skillconnectUser",
        JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            role: role
        })
    );


    /* -----------------------------------------
       ADMIN
       ----------------------------------------- */

    if (role === "admin") {

        window.location.href =
            "admin-dashboard.html";

        return;
    }


    /* -----------------------------------------
       WORKER
       ----------------------------------------- */

    if (role === "worker") {

        window.location.href =
            "worker-dashboard.html";

        return;
    }


    /* -----------------------------------------
       CUSTOMER
       ----------------------------------------- */

    window.location.href =
        "customer-dashboard.html";
}


/* =========================================================
   LOGIN FORM
   ========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            clearMessage();

            const email =
                loginEmail.value.trim();

            const password =
                loginPassword.value;


            /* -------------------------------------
               VALIDATION
               ------------------------------------- */

            if (!email) {

                showMessage(
                    "Please enter your email address.",
                    "error"
                );

                loginEmail.focus();

                return;
            }


            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                loginEmail.focus();

                return;
            }


            if (!password) {

                showMessage(
                    "Please enter your password.",
                    "error"
                );

                loginPassword.focus();

                return;
            }


            if (password.length < 6) {

                showMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                loginPassword.focus();

                return;
            }


            /* -------------------------------------
               LOGIN
               ------------------------------------- */

            setLoading(true);

            try {

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                const user =
                    userCredential.user;


                /* Save remember-me setting */

                saveRememberedEmail();


                showMessage(
                    "Login successful. Redirecting...",
                    "success"
                );


                /* Redirect */

                setTimeout(() => {

                    redirectUser(user);

                }, 700);


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                let message =
                    "Unable to login. Please try again.";


                switch (error.code) {

                    case "auth/invalid-credential":
                        message =
                            "Invalid email or password.";
                        break;

                    case "auth/invalid-email":
                        message =
                            "Please enter a valid email address.";
                        break;

                    case "auth/user-disabled":
                        message =
                            "This account has been disabled.";
                        break;

                    case "auth/user-not-found":
                        message =
                            "No account found with this email.";
                        break;

                    case "auth/wrong-password":
                        message =
                            "Incorrect password.";
                        break;

                    case "auth/too-many-requests":
                        message =
                            "Too many login attempts. Please try again later.";
                        break;

                    case "auth/network-request-failed":
                        message =
                            "Network error. Please check your internet connection.";
                        break;
                }


                showMessage(
                    message,
                    "error"
                );

                setLoading(false);
            }
        }
    );
}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

if (forgotPasswordLink) {

    forgotPasswordLink.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();

            clearMessage();

            const email =
                loginEmail.value.trim();


            if (!email) {

                showMessage(
                    "Enter your email address first.",
                    "error"
                );

                loginEmail.focus();

                return;
            }


            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                loginEmail.focus();

                return;
            }


            try {

                await sendPasswordResetEmail(
                    auth,
                    email
                );

                showMessage(
                    "Password reset link has been sent to your email.",
                    "success"
                );

            } catch (error) {

                console.error(
                    "Password reset error:",
                    error
                );

                let message =
                    "Unable to send password reset email.";


                if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    message =
                        "No account found with this email.";
                }

                if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Please enter a valid email address.";
                }


                showMessage(
                    message,
                    "error"
                );
            }
        }
    );
}


/* =========================================================
   GOOGLE LOGIN
   ========================================================= */

if (googleLoginBtn) {

    googleLoginBtn.addEventListener(
        "click",
        async function () {

            clearMessage();

            googleLoginBtn.disabled = true;

            try {

                const provider =
                    new GoogleAuthProvider();

                const result =
                    await signInWithPopup(
                        auth,
                        provider
                    );

                const user =
                    result.user;


                showMessage(
                    "Google login successful. Redirecting...",
                    "success"
                );


                setTimeout(() => {

                    redirectUser(user);

                }, 700);


            } catch (error) {

                console.error(
                    "Google login error:",
                    error
                );


                if (
                    error.code ===
                    "auth/popup-closed-by-user"
                ) {

                    showMessage(
                        "Google login window was closed.",
                        "info"
                    );

                } else {

                    showMessage(
                        "Google login failed. Please try again.",
                        "error"
                    );
                }


            } finally {

                googleLoginBtn.disabled = false;
            }
        }
    );
}


/* =========================================================
   PASSWORD SHOW / HIDE
   ========================================================= */

const passwordToggleButtons =
    document.querySelectorAll(
        ".password-toggle"
    );


passwordToggleButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    button.dataset.target;

                const passwordInput =
                    document.getElementById(targetId);


                if (!passwordInput) return;


                if (
                    passwordInput.type ===
                    "password"
                ) {

                    passwordInput.type =
                        "text";

                    button.textContent =
                        "🙈";

                    button.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                } else {

                    passwordInput.type =
                        "password";

                    button.textContent =
                        "👁";

                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );
                }
            }
        );
    }
);


/* =========================================================
   ENTER KEY
   ========================================================= */

if (loginPassword) {

    loginPassword.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                loginForm.requestSubmit();
            }
        }
    );
}


/* =========================================================
   LOAD REMEMBERED EMAIL
   ========================================================= */

loadRememberedEmail();


/* =========================================================
   CHECK CURRENT AUTH STATE
   ========================================================= */

onAuthStateChanged(
    auth,
    function (user) {

        if (user) {

            console.log(
                "Firebase user already logged in:",
                user.email
            );
        }
    }
);