/*==================== SHOW MENU ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle');

if(navToggle){
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show-menu');
    });
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link');

function linkAction(){
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]');

function scrollActive(){
    const scrollY = window.pageYOffset;

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if(navLink) {
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
                navLink.classList.add('active-link');
            }else{
                navLink.classList.remove('active-link');
            }
        }
    });
}
window.addEventListener('scroll', scrollActive);

/*==================== CHANGE BACKGROUND HEADER ====================*/ 
function scrollHeader(){
    const nav = document.querySelector('.header');
    if(this.scrollY >= 50) nav.classList.add('scroll-header'); 
    else nav.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);

/*==================== CUSTOM GLOW CURSOR (Desktop Only) ====================*/
const cursor = document.getElementById('glow-cursor');

if(window.innerWidth > 768 && cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add CSS for cursor dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        #glow-cursor {
            position: fixed;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 240, 255, 0.4) 0%, rgba(255, 0, 127, 0) 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
            transition: width 0.3s, height 0.3s;
            mix-blend-mode: screen;
        }
        
        a:hover ~ #glow-cursor, button:hover ~ #glow-cursor {
            width: 60px;
            height: 60px;
            background: radial-gradient(circle, rgba(255, 0, 127, 0.5) 0%, rgba(0, 240, 255, 0) 70%);
        }
        
        body {
            cursor: none; /* Hide default cursor to use custom one */
        }
        
        a, button, .nav__toggle {
            cursor: none; /* Keep none, let glow cursor show */
        }
    `;
    document.head.appendChild(style);
}

/*==================== SCROLL REVEAL ANIMATION (Intersection Observer) ====================*/
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-element');
            observer.unobserve(entry.target); // Observers only once
        }
    });
}, observerOptions);

document.querySelectorAll('.hidden-element').forEach((el) => {
    el.classList.add('hidden-state'); // Add base hidden class via JS
    observer.observe(el);
});

// Base styles for reveal
const revealStyle = document.createElement('style');
revealStyle.innerHTML = `
    .hidden-state {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
    }
    
    .show-element {
        opacity: 1;
        transform: translateY(0);
    }
    
    .show-menu {
        right: 0 !important;
    }
    
    .scroll-header {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        background: rgba(11, 15, 25, 0.9);
    }
`;
document.head.appendChild(revealStyle);

/* Set delay for staggered items in hero */
document.querySelectorAll('.home__data').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.2}s`;
});
document.querySelectorAll('.home__visual').forEach((el) => {
    el.style.transitionDelay = `0.4s`;
});
