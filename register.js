
// SkillConnect Registration
// Connected files: register.html, firebase-config.js

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    doc,
    writeBatch,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { auth, db } from "./firebase-config.js";

const registerForm = document.getElementById("registerForm");
const registerBtn = document.getElementById("registerBtn");
const authMessage = document.getElementById("authMessage");


// Show message on registration page
function showMessage(message, type = "error") {
    if (!authMessage) {
        alert(message);
        return;
    }

    authMessage.textContent = message;
    authMessage.className = `auth-message ${type}`;
    authMessage.style.display = "block";
}


// Convert Firebase errors into readable messages
function getReadableError(error) {
    const errors = {
        "auth/email-already-in-use":
            "This email is already registered. Please log in.",

        "auth/invalid-email":
            "Please enter a valid email address.",

        "auth/weak-password":
            "Password is too weak. Use at least 6 characters.",

        "auth/operation-not-allowed":
            "Email/Password sign-in is not enabled in Firebase.",

        "auth/network-request-failed":
            "Network error. Please check your internet connection.",

        "auth/too-many-requests":
            "Too many attempts. Please try again later.",

        "permission-denied":
            "Firestore permission denied. Check your Firebase Security Rules."
    };

    return errors[error.code] ||
        error.message ||
        "Registration failed. Please try again.";
}


// Registration form submit
if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document
            .getElementById("registerName").value.trim();

        const email = document
            .getElementById("registerEmail").value.trim();

        const phone = document
            .getElementById("registerPhone").value.trim();

        const password = document
            .getElementById("registerPassword").value;

        const confirmPassword = document
            .getElementById("confirmPassword").value;

        const termsAccepted = document
            .getElementById("termsCheckbox").checked;

        const selectedRole = document
            .querySelector('input[name="role"]:checked');

        const role = selectedRole?.value;

        // Validate form
        if (!name || !email || !phone ||
            !password || !confirmPassword) {
            showMessage("Please fill in all required fields.");
            return;
        }

        if (!selectedRole ||
            !["customer", "worker"].includes(role)) {
            showMessage("Please select an account type.");
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            showMessage("Enter a valid 10-digit mobile number.");
            return;
        }

        if (password.length < 6) {
            showMessage("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.");
            return;
        }

        if (!termsAccepted) {
            showMessage("Please accept the Terms and Conditions.");
            return;
        }

        registerBtn.disabled = true;
        registerBtn.textContent = "Creating Account...";

        let accountCreated = false;

        try {
            // STEP 1: Create Firebase Authentication account
            const credential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = credential.user;
            accountCreated = true;

            // STEP 2: Save user's display name
            await updateProfile(user, {
                displayName: name
            });

            // STEP 3: Prepare user profile data
            const batch = writeBatch(db);
            const timestamp = serverTimestamp();

            const commonData = {
                uid: user.uid,
                name,
                email,
                phone,
                role,
                status: role === "worker" ? "pending" : "active",
                createdAt: timestamp,
                updatedAt: timestamp
            };

            // STEP 4: Save general user document
            batch.set(
                doc(db, "users", user.uid),
                commonData
            );

            // STEP 5: Save role-specific profile
            if (role === "worker") {
                batch.set(
                    doc(db, "workers", user.uid),
                    {
                        ...commonData,
                        verificationStatus: "pending",
                        skills: [],
                        experience: "",
                        price: 0,
                        city: "",
                        state: "",
                        pincode: "",
                        address: "",
                        available: false,
                        rating: 0,
                        reviewCount: 0,
                        profileImage: ""
                    }
                );
            } else {
                batch.set(
                    doc(db, "customers", user.uid),
                    {
                        ...commonData,
                        city: "",
                        state: "",
                        address: "",
                        profileImage: ""
                    }
                );
            }

            // STEP 6: Commit Firestore writes
            await batch.commit();

            // STEP 7: Store basic session information
            localStorage.setItem(
                "skillconnectUser",
                JSON.stringify({
                    uid: user.uid,
                    name,
                    email,
                    role
                })
            );

            showMessage(
                "Account created successfully! Redirecting...",
                "success"
            );

            // STEP 8: Redirect by account type
            const destination = role === "worker"
                ? "worker-dashboard.html"
                : "customer-dashboard.html";

            window.location.replace(destination);

        } catch (error) {
            console.error("SkillConnect registration error:", error);

            if (accountCreated) {
                showMessage(
                    "Your account was created, but profile saving failed. " +
                    "Check Firestore Security Rules and Firebase Console. " +
                    "Do not register again with the same email."
                );
            } else {
                showMessage(getReadableError(error));
            }

        } finally {
            registerBtn.disabled = false;
            registerBtn.textContent = "Create Account";
        }
    });

} else {
    console.error(
        "registerForm was not found. Check the form ID in register.html."
    );
}
