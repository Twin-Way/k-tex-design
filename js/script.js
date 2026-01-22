// Предзагрузка фонового изображения в шапке
function initBgPreload() {
    const bgImg = new Image();
    bgImg.src = '/imgs/head/background.webp';
    bgImg.onload = () => {
        document.getElementById('head').classList.add('loaded');
    };
}

// Бургер-меню: активация + плавная прокрутка
function initMenu() {
    const burgerBtn = document.querySelector('.horizontalMenu .burger-menu');
    const overlay = document.querySelector('.menu-overlay');
    const scrollLinks = document.querySelectorAll('a[data-scroll]');

    burgerBtn.addEventListener('click', () => {
        const isHidden = document.body.style.overflow === 'hidden';
        burgerBtn.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = isHidden ? '' : 'hidden';
    });

    scrollLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            burgerBtn.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            const targetId = link.getAttribute('href');
            document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}
// «Ревил»-анимация
function initRevealAnimations() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('loaded');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    const selectors = [
        '.section-header',
        '.scrollable-header',
        '.service',
        '.stage',
        '.founder',
        '#about .description',
        '.feature',
        '.textile-title',
        '.product-card',
        '#textile .video',
        '.gallery',
        '.gallery-btn',
        '.app-form .description',
        '.app-form-btn',
        '.contact-data',
        '.contact-map'
    ].join(',');

    document.querySelectorAll(selectors)
        .forEach(el => observer.observe(el));
}

// Горизонтальные смещения заголовков при прокрутке
function initScrollAnimations() {
    const scrollableHeaders = Array.from(document.querySelectorAll('.scrollable-header'));
    const menuBar = document.querySelector('.horizontalMenu');
    let viewportHeight = window.innerHeight;
    let viewportWidth = window.innerWidth;
    const BREAK_WIDTH = 980;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        menuBar.classList.toggle('scrolled', scrollY > 0);

        scrollableHeaders.forEach(header => {
            const rectTop = header.getBoundingClientRect().top;
            if (rectTop > viewportHeight) return;

            header.classList.add('loaded');
            const headerPageY = header.offsetTop;
            let translateX = scrollY - (headerPageY - viewportHeight / 2);

            translateX = viewportWidth > BREAK_WIDTH
                ? Math.max(translateX, 0)
                : translateX * 0.5;

            header.style.transform = `translateX(${translateX}px)`;
        });
    });

    window.addEventListener('resize', () => {
        viewportHeight = window.innerHeight;
        viewportWidth = window.innerWidth;
    });
}

// Текстиль: открытие/закрытие деталей карточки
function initTextile() {
    document.querySelectorAll('#textile .product-card').forEach(card => {
        card.addEventListener('click', () => {
            const titleElem = card.querySelector('.title');
            const detailsElem = card.querySelector('.details');
            detailsElem.classList.toggle('opened');
        });
    });
}

//Реализация бесконечной прокрутки
window.addEventListener('load', () => {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('.prev');
    const next = carousel.querySelector('.next');

    let cards = Array.from(track.children);
    const visible = 2;
    const gap = 20;

    if (!cards.length) return;

    const cardWidth =
        cards[0].offsetWidth + gap;

    // 🔁 клонируем
    cards.slice(0, visible).forEach(card => {
        track.appendChild(card.cloneNode(true));
    });

    cards.slice(-visible).forEach(card => {
        track.insertBefore(card.cloneNode(true), track.firstChild);
    });

    cards = Array.from(track.children);

    let index = visible;

    track.style.transition = 'none';
    track.style.transform = `translateX(-${index * cardWidth}px)`;

    next.addEventListener('click', () => {
        index++;
        track.style.transition = 'transform 0.4s ease';
        track.style.transform = `translateX(-${index * cardWidth}px)`;

        if (index === cards.length - visible) {
            setTimeout(() => {
                track.style.transition = 'none';
                index = visible;
                track.style.transform = `translateX(-${index * cardWidth}px)`;
            }, 400);
        }
    });

    prev.addEventListener('click', () => {
        index--;
        track.style.transition = 'transform 0.4s ease';
        track.style.transform = `translateX(-${index * cardWidth}px)`;

        if (index === visible - 1) {
            setTimeout(() => {
                track.style.transition = 'none';
                index = cards.length - visible * 2;
                track.style.transform = `translateX(-${index * cardWidth}px)`;
            }, 400);
        }
    });
});

// Портфолио: пагинация
function initPortfolio() {
    const projects = Array.from(document.querySelectorAll('#portfolio .project'));
    const toggleBtn = document.querySelector('#portfolio button');
    let currentPage = 1;

    function showPage(pageNumber, scrollIntoView = false) {
        const pageProjects = projects.filter(p => p.classList.contains(`project_${pageNumber}`));
        pageProjects.forEach(p => {
            p.style.display = '';
            if (scrollIntoView) p.scrollIntoView({ behavior: 'smooth' });
        });
    }

    projects.forEach(p => p.style.display = 'none');
    showPage(currentPage);
    toggleBtn.textContent = 'Показать ещё';

    toggleBtn.addEventListener('click', () => {
        const hasNextPage = projects.some(p => p.classList.contains(`project_${currentPage + 1}`));

        if (toggleBtn.textContent.includes('Показать') && hasNextPage) {
            currentPage++;
            showPage(currentPage, true);

            const noFurther = !projects.some(p => p.classList.contains(`project_${currentPage + 1}`));
            if (noFurther) toggleBtn.textContent = 'Скрыть часть';
        }
        else if (currentPage > 1) {
            projects
                .filter(p => p.classList.contains(`project_${currentPage}`))
                .forEach(p => p.style.display = 'none');

            currentPage--;
            toggleBtn.textContent = currentPage === 1 ? 'Показать ещё' : toggleBtn.textContent;

            const lastOfPrev = projects
                .filter(p => p.classList.contains(`project_${currentPage}`))
                .pop();
            lastOfPrev?.scrollIntoView({ behavior: 'smooth' });
        }
    });

    if ('ontouchstart' in document.documentElement) {
        projects.forEach(p => {
            p.classList.add('mobile');
            p.addEventListener('click', () => {
                projects.forEach(other => {
                    if (other !== p) other.classList.remove('active');
                });
                p.classList.toggle('active');
            });
        });

        document.body.addEventListener('click', e => {
            if (!e.target.closest('.project')) {
                projects.forEach(p => p.classList.remove('active'));
            }
        });
    }
}

// О бюро: анимация счётчиков в секции
function initCounters() {
    let hasRun = false;

    function runCounters() {
        const table = document.querySelector('.features-table');
        if (!table) return;

        const tableTop = table.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY + window.innerHeight < tableTop + 50) return;

        document.querySelectorAll('.features-table .value').forEach(el => {
            const rawText = el.textContent.trim();
            const number = +rawText.replace(/\D/g, '');
            const suffix = rawText.replace(/\d/g, '');
            const prefix = rawText.startsWith(suffix) ? suffix : '';
            const endSuffix = prefix ? '' : suffix;

            let current = 0;
            const step = Math.ceil(number / 100);

            const interval = setInterval(() => {
                current += step;
                if (current >= number) {
                    current = number;
                    clearInterval(interval);
                }
                el.textContent = prefix + current + endSuffix;
            }, 20);
        });

        hasRun = true;
    }

    window.addEventListener('scroll', () => {
        if (!hasRun) runCounters();
    });
}

// Футер: текущий год
function initYear() {
    const yearElem = document.getElementById('current-year');
    if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
    }
}

// Инициализация всех компонентов после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
    initBgPreload();
    initMenu();
    initRevealAnimations();
    initScrollAnimations();
    initTextile();
    initPortfolio();
    initCounters();
    initYear();
});