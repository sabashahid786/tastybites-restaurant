window.onload = () => {
  const loggedIn = localStorage.getItem("loggedIn");

  if (!loggedIn) {
    showLogin();
  } else {
    showAccount();
  }
};

function showLogin() {
  document.getElementById("overlay").style.display = "flex";
  document.getElementById("navbar").style.display = "none";
}

function login() {
  localStorage.setItem("loggedIn", "true");
  hidePopups();
  showAccount();
}

function signup() {
  localStorage.setItem("loggedIn", "true");
  hidePopups();
  showAccount();
}

function openSignup() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("signupOverlay").style.display = "flex";
}

function hidePopups() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("signupOverlay").style.display = "none";
  document.getElementById("navbar").style.display = "flex";
}

function showAccount() {
  document.getElementById("authLinks").style.display = "none";
  document.getElementById("myAccount").style.display = "block";
}

// LOGIN
function loginUser(){
  localStorage.setItem("loggedIn", "true");
  window.location.href = "index.html";
}

// SIGNUP
function signupUser(){
  localStorage.setItem("loggedIn", "true");
  window.location.href = "index.html";
}

// NAVBAR CHECK
window.onload = function(){
  if(localStorage.getItem("loggedIn")){
    document.getElementById("authLinks").style.display="none";
    document.getElementById("myAccount").style.display="block";
  }
}
