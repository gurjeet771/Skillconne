
// auth.js

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


// Registration form
const registerForm = document.getElementById("registerForm");


// Display messages
function showMessage(message, type = "error") {
    let messageBox = document.getElementById("authMessage");

    if (!messageBox) {
        messageBox = document.createElement("p");
        messageBox.id = "authMessage";
        messageBox.setAttribute("role", "status");
        registerForm?.prepend(messageBox);
    }

    messageBox.textContent = message;
    messageBox.style.color =
        type === "success" ? "green" : "red";
}


// Firebase error messages
function getErrorMessage(error) {
    const messages = {
        "auth/email-already-in-use":
            "This email is already registered. Please log in.",
        "auth/invalid-email":
            "Please enter a valid email address.",
        "auth/weak-password":
            "Password must contain at least 6 characters.",
        "auth/operation-not-allowed":
            "Email/password login is not enabled in Firebase.",
        "auth/network-request-failed":
            "Network error. Please check your internet connection.",
        "permission-denied":
            "Firestore permission denied. Please check Firebase Security Rules."
    };

    return messages[error.code] ||
        error.message ||
        "Registration failed. Please try again.";
}


// Handle registration
if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name =
            document.getElementById("registerName")?.value.trim();

        const email =
            document.getElementById("registerEmail")?.value.trim();

        const phone =
            document.getElementById("registerPhone")?.value.trim();

        const password =
            document.getElementById("registerPassword")?.value;

        const confirmPassword =
            document.getElementById("confirmPassword")?.value;

        const termsAccepted =
            document.getElementById("termsCheckbox")?.checked;

        const selectedRole =
            document.querySelector('input[name="role"]:checked');

        const role = selectedRole?.value;

        const registerBtn =
            document.getElementById("registerBtn");

        // Validate fields
        if (!name || !email || !phone ||
            !password || !confirmPassword) {
            showMessage("Please fill in all required fields.");
            return;
        }

        if (!selectedRole ||
            !["customer", "worker"].includes(role)) {
            showMessage("Please select Customer or Worker.");
            return;
        }

        if (password.length < 6) {
            showMessage("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.");
            return;
        }

        if (!termsAccepted) {
            showMessage("Please accept the terms and conditions.");
            return;
        }

        if (registerBtn) {
            registerBtn.disabled = true;
            registerBtn.textContent = "Creating Account...";
        }

        let accountCreated = false;

        try {
            // 1. Create Firebase Authentication account
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;
            accountCreated = true;

            // 2. Save display name
            await updateProfile(user, {
                displayName: name
            });

            // 3. Prepare Firestore writes
            const batch = writeBatch(db);

            const userRef = doc(db, "users", user.uid);

            const commonData = {
                uid: user.uid,
                name: name,
                email: email,
                phone: phone,
                role: role,
                status: role === "worker" ? "pending" : "active",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            batch.set(userRef, commonData);

            // 4. Create role-specific profile
            if (role === "worker") {
                const workerRef = doc(db, "workers", user.uid);

                batch.set(workerRef, {
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
                });

            } else {
                const customerRef =
                    doc(db, "customers", user.uid);

                batch.set(customerRef, {
                    ...commonData,
                    city: "",
                    state: "",
                    address: "",
                    profileImage: ""
                });
            }

            // 5. Save all Firestore documents
            await batch.commit();

            // 6. Save basic session information
            localStorage.setItem(
                "skillconnectUser",
                JSON.stringify({
                    uid: user.uid,
                    name: name,
                    email: email,
                    role: role
                })
            );

            showMessage(
                "Registration successful! Redirecting...",
                "success"
            );

            // 7. Redirect to correct dashboard
            window.location.replace(
                role === "worker"
                    ? "worker-dashboard.html"
                    : "coustomer-dashboard.html"
            );

        } catch (error) {
            console.error("Registration error:", error);

            if (accountCreated) {
                showMessage(
                    "Your Authentication account was created, " +
                    "but saving your profile failed. Check Firestore " +
                    "Security Rules and your Firebase Console."
                );
            } else {
                showMessage(getErrorMessage(error));
            }

        } finally {
            if (registerBtn) {
                registerBtn.disabled = false;
                registerBtn.textContent = "Register";
            }
        }
    });
} else {
    console.error(
        "Registration form not found. Check register.html for id='registerForm'."
    );
}
