console.log("auth.js running");

/* =====================================================
   AUTH PAGE LOGIC
   Relies on firebase-init.js having already run and
   set the global `auth` variable.
===================================================== */

const emailInput = document.getElementById("authEmail");
const passwordInput = document.getElementById("authPassword");

const submitBtn = document.getElementById("submitBtn");
const toggleLink = document.getElementById("toggleLink");
const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");
const message = document.getElementById("authMessage");
const logoutBtn = document.getElementById("logoutBtn");

let isLogin = false;

/* ================= MESSAGE HELPER ================= */

function showMessage(text, type = "info") {
  if (!message) return;
  message.innerText = text;
  message.className = type;
}

/* ================= LOGIN / SIGNUP TOGGLE ================= */

if (toggleLink && submitBtn && formTitle) {
  toggleLink.onclick = () => {
    isLogin = !isLogin;

    if (isLogin) {
      formTitle.innerText = "Login";
      submitBtn.innerText = "Login";
      toggleLink.innerText = "Create Account";
    } else {
      formTitle.innerText = "Create Account";
      submitBtn.innerText = "Sign Up";
      toggleLink.innerText = "Login";
    }

    showMessage("");
  };
}

/* ================= SUBMIT (LOGIN / SIGNUP) ================= */

if (submitBtn) {
  submitBtn.onclick = () => {

    if (!auth) {
      showMessage("Authentication is not available right now.", "error");
      return;
    }

    const email = emailInput?.value;
    const password = passwordInput?.value;

    if (!email || !password) {
      showMessage("Please fill all fields", "error");
      return;
    }

    if (isLogin) {
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          showMessage("Login successful!", "success");
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);
        })
        .catch(err => showMessage(err.message, "error"));

    } else {
      auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          showMessage("Account created!", "success");
        })
        .catch(err => showMessage(err.message, "error"));
    }
  };
}

/* ================= LOGOUT ================= */

if (logoutBtn) {
  logoutBtn.onclick = () => {
    if (!auth) return;
    auth.signOut().then(() => {
      showMessage("Logged out.", "success");
    });
  };
}

/* ================= SESSION STATE ================= */

if (auth) {
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log("Logged in:", user.email);

      // Show logged-in state, hide the form
      if (formTitle) formTitle.innerText = "Welcome back!";
      if (emailInput) emailInput.style.display = "none";
      if (passwordInput) passwordInput.style.display = "none";
      if (submitBtn) submitBtn.style.display = "none";
      if (toggleText) toggleText.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "block";

      showMessage("Signed in as " + user.email, "success");

    } else {
      console.log("No user");

      if (formTitle) formTitle.innerText = isLogin ? "Login" : "Create Account";
      if (emailInput) emailInput.style.display = "block";
      if (passwordInput) passwordInput.style.display = "block";
      if (submitBtn) submitBtn.style.display = "block";
      if (toggleText) toggleText.style.display = "block";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  });
}
