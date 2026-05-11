document.addEventListener("DOMContentLoaded", () => {
    const AGE_VERIFIED_KEY = "hayati_age_verified";
    const body = document.body;
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-link");
    const hamburgerSpans = hamburgerBtn.querySelectorAll("span");
    const navLinks = document.querySelectorAll("[data-target]");
    const sliderCards = document.querySelectorAll(".hero-card");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const faqButtons = document.querySelectorAll(".faq-question");
    const revealItems = document.querySelectorAll(".reveal");
    const yearSpan = document.getElementById("year");
    const cityToggle = document.getElementById("city");
    const citiesList = document.getElementById("portugal-cities");
    const ageModal = document.getElementById("ageModal");
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const header = document.querySelector(".header");
    const warn = document.querySelector(".warn");

    let isMenuOpen = false;
    let currentIndex = 1;
    const totalCards = sliderCards.length;

    function setMenuState(open) {
        isMenuOpen = open;
        mobileMenu.classList.toggle("active", open);
        hamburgerBtn.setAttribute("aria-expanded", String(open));
        body.style.overflow = open ? "hidden" : "";

        hamburgerSpans[0].style.transform = open ? "rotate(45deg) translate(5px, 6px)" : "none";
        hamburgerSpans[1].style.opacity = open ? "0" : "1";
        hamburgerSpans[2].style.transform = open ? "rotate(-45deg) translate(5px, -6px)" : "none";
    }

    hamburgerBtn.addEventListener("click", () => {
        setMenuState(!isMenuOpen);
    });

    mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
            setMenuState(false);
        });
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetSelector = link.getAttribute("data-target");
            const target = targetSelector ? document.querySelector(targetSelector) : null;

            if (target) {
                event.preventDefault();
                const headerOffset = document.querySelector(".header").offsetHeight;
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset + 6;
                window.scrollTo({ top: offsetTop, behavior: "smooth" });
            }
        });
    });

    function updateSlider() {
        sliderCards.forEach((card, index) => {
            card.classList.remove("active", "prev", "next", "prev-2", "next-2");

            const position = (index - currentIndex + totalCards) % totalCards;

            if (position === 0) {
                card.classList.add("active");
            } else if (position === totalCards - 1) {
                card.classList.add("prev");
            } else if (position === 1) {
                card.classList.add("next");
            } else if (position === totalCards - 2) {
                card.classList.add("prev-2");
            } else if (position === 2) {
                card.classList.add("next-2");
            }
        });
    }

    if (totalCards > 0) {
        updateSlider();
    }

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalCards;
        updateSlider();
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateSlider();
    });

    faqButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.closest(".faq-item");
            const isActive = item.classList.contains("active");

            document.querySelectorAll(".faq-item").forEach((faqItem) => {
                faqItem.classList.remove("active");
                faqItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
            });

            if (!isActive) {
                item.classList.add("active");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (cityToggle) {
        cityToggle.addEventListener("click", () => {
            const open = cityToggle.getAttribute("aria-expanded") !== "true";
            cityToggle.setAttribute("aria-expanded", String(open));
            if (citiesList) {
                citiesList.hidden = !open;
            }
        });
    }

    let isHeaderScrolled = false;

    function syncHeaderState() {
        if (!header || !warn) {
            return;
        }

        const shouldCompact = window.scrollY > 10;

        if (shouldCompact === isHeaderScrolled) {
            return;
        }

        isHeaderScrolled = shouldCompact;
        header.classList.toggle("is-scrolled", shouldCompact);
    }

    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });

    window.addEventListener("load", () => {
        if (localStorage.getItem(AGE_VERIFIED_KEY) !== "true") {
            ageModal.style.display = "flex";
            ageModal.setAttribute("aria-hidden", "false");
            body.style.overflow = "hidden";
        }
    });

    yesBtn.addEventListener("click", () => {
        localStorage.setItem(AGE_VERIFIED_KEY, "true");
        ageModal.style.display = "none";
        ageModal.setAttribute("aria-hidden", "true");
        if (!isMenuOpen) {
            body.style.overflow = "";
        }
    });

    noBtn.addEventListener("click", () => {
        window.alert("Acesso negado. Este site destina-se apenas a maiores de 18 anos.");
    });
});
