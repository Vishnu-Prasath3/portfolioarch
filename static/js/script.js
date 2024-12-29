/* ==================== dynamic copyright year ==================== */
document.getElementById("copyright-year").innerText = new Date().getFullYear();

/* ==================== css overlay spinner ==================== */
function overlayFadeIn(query = "#overlay", duration = 300) {
  element = document.querySelectorAll(query)[0];
  element.style.transition = `opacity ${duration / 1000}s`;
  element.style.display = "block";
  setTimeout(() => {
    element.style.opacity = 1;
  }, 100);

  setTimeout(() => {
    element.style.transition = "";
  }, duration);
}

function overlayFadeOut(query = "#overlay", duration = 300) {
  element = document.querySelectorAll(query)[0];
  element.style.transition = `opacity ${duration / 1000}s`;
  element.style.opacity = 0;

  setTimeout(() => {
    element.style.display = "none";
    element.style.transition = "";
  }, duration);
}

/* ==================== toggle icon navbar ==================== */
const menuIcon = document.querySelector("#check");
const navbar = document.querySelector(".navbar");

menuIcon.addEventListener("change", () => {
  if (menuIcon.checked) {
    navbar.classList.add("active");
  } else {
    navbar.classList.remove("active");
  }
});

/* ==================== scroll sections link ==================== */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header nav a");

window.onscroll = window.onfocus = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((navLink) => {
        if (navLink.classList.contains("active")) {
          navLink.classList.remove("active");
        }
        activeNavLink = document.querySelector(`header nav a[href*=${id}]`);
        if (!activeNavLink.classList.contains("active")) {
          activeNavLink.classList.add("active");
        }
        if (window.location.hash !== `#${id}`) {
          window.history.replaceState(null, null, `#${id}`);
        }
      });
    }
  });

  /* ==================== sticky navbar ==================== */
  let header = document.querySelector("header");

  header.classList.toggle("sticky", window.scrollY > 100);

  /* ==================== remove toggle icon and navbar when click navbar link (scroll) ==================== */
  menuIcon.checked = false;
  navbar.classList.remove("active");
};

/* ==================== reset the url to copy ==================== */
window.onblur = () => {
  window.history.replaceState(null, null, window.location.href.split("#")[0]);
};

/* ==================== scroll reveal ==================== */
ScrollReveal({
  reset: true,
  distance: "80px",
  duration: 2000,
  delay: 200,
});

ScrollReveal().reveal(".home-content, .heading", { origin: "top" });
ScrollReveal().reveal(".home-img, .services-container, .contact form", {
  origin: "bottom",
});
ScrollReveal().reveal(".home-content h1, .about-img, .projects-content", {
  origin: "left",
});

/* ==================== typed js ==================== */
new Typed(".home-content h1 .name span", {
  strings: ["Archana Senthilkumar"],
  typeSpeed: 200,
  backSpeed: 100,
  backDelay: 2000,
  loop: true,
});

/* ==================== multiple text ==================== */
let words = document.querySelectorAll(".multiple-text .word");
words.forEach((word) => {
  let letters = word.textContent.split("");
  word.textContent = "";
  letters.forEach((letter) => {
    let span = document.createElement("span");
    span.textContent = letter;
    span.className = "letter";
    word.append(span);
  });
});

let currentWordIndex = 0;
let maxWordIndex = words.length - 1;
words[currentWordIndex].style.opacity = "1";

let changeText = () => {
  let currentWord = words[currentWordIndex];
  let nextWord =
    currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];

  Array.from(currentWord.children).forEach((letter, i) => {
    setTimeout(() => {
      letter.className = "letter out";
    }, i * 80);
  });
  nextWord.style.opacity = "1";
  Array.from(nextWord.children).forEach((letter, i) => {
    letter.className = "letter behind";
    setTimeout(() => {
      letter.className = "letter in";
    }, 340 + i * 80);
  });
  currentWordIndex =
    currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
};

changeText();
setInterval(changeText, 3000);

/* ==================== theming ==================== */
const themeToggle = document.querySelector(".toggle-icon");
const themeSection = document.querySelector("body");
themeToggle.onclick = () => {
  themeSection.classList.toggle("dark");
  themeSection.classList.toggle("light");
};

/* ==================== contact form ==================== */
const submitBtn = document.querySelector("#contact-submit");
const formItems = document.querySelectorAll(".form-item");
const fullName = document.querySelector("#full-name");
const emailId = document.querySelector("#email-id");
const mobileNumber = document.querySelector("#mobile-number");
const emailSubject = document.querySelector("#email-subject");
const emailMessage = document.querySelector("#email-message");
const errorTxtEmail = document.querySelector(".error-txt.email");
var listener_flagged = false;

function resetForm() {
  formItems.forEach((item) => (item.value = ""));
}

function sendEmail(token) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.responseText === "OK") {
        Swal.fire({
          title: "Success!",
          text: "Message sent successfully!",
          icon: "success",
        });
        resetForm();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: xhr.responseText,
          footer: "Something went wrong!",
        });
      }
      listener_flagged = false;
      overlayFadeOut();
    }
  };
  xhr.open("POST", window.location.origin + "/send-email", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      full_name: fullName.value,
      email_id: emailId.value,
      mobile_number: mobileNumber.value,
      email_subject: emailSubject.value,
      email_message: emailMessage.value,
      "g-recaptcha-response": token,
    })
  );
}

const content_listener = (e) => {
  if (e.target.value != "") {
    e.target.classList.remove("error");
    e.target.parentElement.classList.remove("error");
  } else {
    e.target.classList.add("error");
    e.target.parentElement.classList.add("error");
  }
};

function email_listener() {
  const emailRegex =
    /^([a-z\d._%+-]+)@([a-z\d.-]+)\.([a-z]{2,})(\.[a-z]{2,})?$/i;
  if (!emailId.value.match(emailRegex)) {
    emailId.classList.add("error");
    emailId.parentElement.classList.add("error");
    errorTxtEmail.innerText =
      emailId.value !== ""
        ? "Enter a valid email address."
        : "Email Address can't be blank.";
  } else {
    emailId.classList.remove("error");
    emailId.parentElement.classList.remove("error");
  }
}

submitBtn.addEventListener("click", () => {
  overlayFadeIn();
  if (!listener_flagged) {
    formItems.forEach((item) => content_listener({ target: item }));
    email_listener({ target: emailId });
    fullName.addEventListener("keyup", content_listener);
    mobileNumber.addEventListener("keyup", content_listener);
    emailSubject.addEventListener("keyup", content_listener);
    emailMessage.addEventListener("keyup", content_listener);
    emailId.addEventListener("keyup", email_listener);
    listener_flagged = true;
  }
  if (Array.from(formItems).some((item) => item.classList.contains("error"))) {
    overlayFadeOut();
  } else {
    grecaptcha.reset();
    grecaptcha.execute();
  }
});
