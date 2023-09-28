
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const navLogo = document.querySelector('#navbar__logo');
const body = document.querySelector('body');

const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
    body.classList.toggle('active');
};

menu.addEventListener('click', mobileMenu);

gsap.registerPlugin(ScrollTrigger);

gsap.from('.animate-hero', {
    duration: 2,
    opacity:0,
    y:-150,
    stagger: 0.5,
});

gsap.from('.animate-services', {
    ScrollTrigger: '.animate-services',
    duration: 3,
    opacity:0,
    x:-200,
});

gsap.from('.animate-img', {
    ScrollTrigger: '.animate-img',
    duration: 3,
    opacity:1,
    x:-200,
});

gsap.from('.animate-membership', {
    ScrollTrigger: '.animate-membership',
    duration: 1,
    opacity:0,
    y:-150,
    stagger: 0.3,
    delay: 0.5,
});

gsap.from('.animate-table', {
    ScrollTrigger: '.animate-table',
    duration: 1,
    opacity:0,
    y:-150,
    stagger: 0.1,
    delay: 0.5,
});



