// Splash Screen
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splashScreen = document.getElementById('splash-screen');
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 500);
    }, 2000);
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Countdown Timer
const weddingDate = new Date('2026-04-09T16:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para abrir y cerrar el modal ---
    const modal = document.getElementById('rsvp-modal');
    const rsvpButton = document.getElementById('rsvp-button');
    const closeButton = document.querySelector('.modal .close');

    rsvpButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Mostrar sección de invitados solo si se asiste
    document.querySelectorAll('input[name="attendance"]').forEach(el => {
        el.addEventListener('change', function() {
            const guestsSection = document.getElementById('guests-section');
            const noSection = document.getElementById('no-section');
            const noGuestNameInput = document.getElementById('noGuestName');
            const guestCountInput = document.getElementById('guestCount');
            const guestNamesDiv = document.getElementById('guestNames');
            if (this.value === 'yes') {
                guestsSection.style.display = 'block';
                noSection.style.display = 'none';
                if (noGuestNameInput) noGuestNameInput.removeAttribute('required');
                if (guestCountInput) guestCountInput.setAttribute('required', 'required');
                guestNamesDiv.innerHTML = '';
            } else {
                guestsSection.style.display = 'none';
                noSection.style.display = 'block';
                if (noGuestNameInput) noGuestNameInput.setAttribute('required', 'required');
                if (guestCountInput) guestCountInput.removeAttribute('required');
                guestNamesDiv.innerHTML = '';
                guestCountInput.value = '';
            }
        });
    });

    // Generar campos de nombres de invitados según el select
    document.getElementById('guestCount').addEventListener('input', function() {
        const guestNamesDiv = document.getElementById('guestNames');
        guestNamesDiv.innerHTML = '';
        if (this.offsetParent === null) return; // Si el input está oculto, no hacer nada
        const count = parseInt(this.value, 10);
        if (count > 0 && count <= 15) {
            for (let i = 1; i <= count; i++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.name = `guestName${i}`;
                input.placeholder = `Nombre del invitado ${i}`;
                input.required = true;
                guestNamesDiv.appendChild(input);
            }
        }
    });

    // Mostrar sección de mensaje solo si no se asiste
    document.querySelectorAll('input[name="attendance"]').forEach(el => {
        el.addEventListener('change', function() {
            const guestsSection = document.getElementById('guests-section');
            const noSection = document.getElementById('no-section');
            const noGuestNameInput = document.getElementById('noGuestName');
            const guestCountInput = document.getElementById('guestCount');
            if (this.value === 'yes') {
                guestsSection.style.display = 'block';
                noSection.style.display = 'none';
                if (noGuestNameInput) noGuestNameInput.removeAttribute('required');
                if (guestCountInput) guestCountInput.setAttribute('required', 'required');
            } else {
                guestsSection.style.display = 'none';
                noSection.style.display = 'block';
                if (noGuestNameInput) noGuestNameInput.setAttribute('required', 'required');
                if (guestCountInput) guestCountInput.removeAttribute('required');
                document.getElementById('guestNames').innerHTML = '';
                guestCountInput.value = '';
            }
        });
    });

    // --- Lógica para enviar el formulario ---
    const rsvpForm = document.getElementById('rsvp-form');
    const thankYouMessage = document.getElementById('thank-you-message');

    rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

        const scriptURL = 'https://script.google.com/macros/s/AKfycbz2zrooMkoeQbwR5UPxWB-ha4sFd18Cca70X4zR9Sk_qYK5-k6pwPRclLNUJd7QKCTV/exec';
        const submitButton = rsvpForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const guestMessage = document.getElementById('guestMessage').value;

        let payload = {
            attendance: attendance,
            message: guestMessage
        };

        if (attendance === "yes") {
            const guestCount = parseInt(document.getElementById('guestCount').value, 10) || 1;
            payload.guestCount = guestCount;
            for (let i = 1; i <= guestCount; i++) {
                const input = document.querySelector(`input[name="guestName${i}"]`);
                payload[`guestName${i}`] = input ? input.value : '';
            }
        } else {
            const noGuestName = document.getElementById('noGuestName').value;
            payload.noGuestName = noGuestName;
        }

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            rsvpForm.style.display = 'none';
            thankYouMessage.style.display = 'block';
            setTimeout(() => {
                modal.style.display = 'none';
                rsvpForm.style.display = 'block';
                thankYouMessage.style.display = 'none';
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar';
                rsvpForm.reset();
                document.getElementById('guestNames').innerHTML = '';
            }, 10000);
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Hubo un error al enviar tu confirmación. Por favor, inténtalo de nuevo.');
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar';
        });
    });
});
// Add to Calendar
document.getElementById('add-to-calendar').addEventListener('click', () => {
    const event = {
        title: 'Boda de Kevin y Nicole',
        description: '¡Celebra con nosotros nuestro día especial!',
        location: '845 South Wellwood Avenue, Lindenhurst, New York, 11757, Ciudad',
        start: '2026-04-09T16:00:00',
        end: '2026-04-10T04:00:00'
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${event.start.replace(/[-:]/g, '')}/${event.end.replace(/[-:]/g, '')}`;
    
    window.open(googleCalendarUrl, '_blank');
});

// Navigation Buttons
document.getElementById('google-maps').addEventListener('click', () => {
    const address = encodeURIComponent('845 South Wellwood Avenue, Lindenhurst, New York, 11757, Ciudad');
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
});

document.getElementById('waze').addEventListener('click', () => {
    const address = encodeURIComponent('845 South Wellwood Avenue, Lindenhurst, New York, 11757, Ciudad');
    window.open(`https://waze.com/ul?q=${address}`, '_blank');
});

// ==== GALERÍA ====
const galleryItems = [
    { type: 'video', src: 'img/Save-the-date.mp4', poster: 'img/poster-save-the-date.webp' },
    { type: 'video', src: 'img/30-agosto.mp4', poster: 'img/30-agosto-preliminar.webp' },
    { type: 'image', src: 'img/FutureMrandMrsPyle-022.webp' },
    { type: 'image', src: 'img/FutureMrandMrsPyle-069.webp' },
    { type: 'image', src: 'img/FutureMrandMrsPyle-078.webp' },
    { type: 'image', src: 'img/FutureMrandMrsPyle-086.webp' },
    { type: 'image', src: 'img/FutureMrandMrsPyle-089.webp' }
];

const galleryGrid = document.getElementById('photo-gallery');
// Modifica renderGallery: no asignar src directo, usar data-src/data-poster
function renderGallery() {
    galleryGrid.innerHTML = '';
    galleryItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'gallery-item';

        const media = document.createElement('div');
        media.className = 'media';

        if (item.type === 'image') {
            const img = document.createElement('img');
            img.alt = 'Galería';
            img.loading = 'lazy';
            img.decoding = 'async';
            // colocar atributos responsive si tienes versiones: img.srcset = 'img/name-320.webp 320w, img/name-768.webp 768w, img/name-1200.webp 1200w';
            // img.sizes = '(max-width:768px) 100vw, 33vw';
            img.dataset.src = item.src; // src real asignado por observer
            img.classList.add('lazy-media');
            media.appendChild(img);
        } else if (item.type === 'video') {
            const video = document.createElement('video');
            video.controls = true;
            video.preload = 'none'; // importante: no descargar hasta que esté visible
            video.muted = true;
            video.playsInline = true;
            video.setAttribute('webkit-playsinline', '');
            video.setAttribute('playsinline', '');
            if (item.poster) video.dataset.poster = item.poster;
            video.dataset.src = item.src; // src asignado por observer
            video.classList.add('lazy-media');
            media.appendChild(video);
        }

        div.appendChild(media);
        galleryGrid.appendChild(div);

        // hover handlers (tilt) — pueden permanecer
        div.addEventListener('mouseenter', () => div.classList.add('hovered'));
        div.addEventListener('mouseleave', () => div.classList.remove('hovered'));
    });
}

// Lazy load observer: carga img.src / video.src cuando entra en viewport
function initLazyMedia() {
    const lazyElements = document.querySelectorAll('.lazy-media');
    if (!('IntersectionObserver' in window)) {
        // Fallback: load all immediately
        lazyElements.forEach(el => {
            if (el.tagName === 'IMG') el.src = el.dataset.src;
            if (el.tagName === 'VIDEO') {
                if (el.dataset.poster) el.poster = el.dataset.poster;
                el.src = el.dataset.src;
            }
        });
        return;
    }

    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.tagName === 'IMG') {
                el.src = el.dataset.src;
                el.removeAttribute('data-src');
            } else if (el.tagName === 'VIDEO') {
                if (el.dataset.poster) el.poster = el.dataset.poster;
                // asignar src y llamar load(); no reproducir (respeta autoplay policies)
                el.src = el.dataset.src;
                el.removeAttribute('data-src');
                el.load();
            }
            obs.unobserve(el);
        });
    }, { root: null, rootMargin: '200px 0px', threshold: 0.01 });

    lazyElements.forEach(el => io.observe(el));
}

// Ejecutar: renderizar galería y luego inicializar lazy-load en idle
renderGallery();
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => initLazyMedia(), { timeout: 500 });
} else {
    setTimeout(initLazyMedia, 100);
}

// Lazy-load para backgrounds y elementos .lazy-media fuera del gallery
(function initSimpleLazy() {
    const bgEls = document.querySelectorAll('[data-bg]');
    bgEls.forEach(el => {
        // cargar background inmediatamente en mobile/desktop según preferencia o con IO
        const img = new Image();
        img.src = el.dataset.bg;
        img.onload = () => {
            el.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)), url('${el.dataset.bg}')`;
        };
    });

    // las imágenes con class lazy-media ya las maneja initLazyMedia() desde renderGallery
})();

// === Carousel buttons: scroll logic ===
(function() {
    const leftBtn = document.querySelector('.carousel-btn.left');
    const rightBtn = document.querySelector('.carousel-btn.right');
    const gallery = document.getElementById('photo-gallery');

    if (!gallery) return;

    function getGapPx() {
        const gap = getComputedStyle(gallery).gap;
        return gap ? parseFloat(gap) : 16;
    }

    function scrollGallery(direction) {
        const item = gallery.querySelector('.gallery-item');
        if (!item) return;
        const itemWidth = Math.ceil(item.getBoundingClientRect().width) + getGapPx();
        if (direction === 'left') {
            gallery.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        } else {
            gallery.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    }

    if (leftBtn) leftBtn.addEventListener('click', () => scrollGallery('left'));
    if (rightBtn) rightBtn.addEventListener('click', () => scrollGallery('right'));

    // Optional: enable keyboard arrows when gallery focused
    gallery.tabIndex = gallery.tabIndex || 0;
    gallery.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') scrollGallery('left');
        if (e.key === 'ArrowRight') scrollGallery('right');
    });
})();

/* ==== Reveal on scroll (restaurar animaciones) ==== */
(function() {
    function initScrollReveals() {
        const options = {
            root: null,
            rootMargin: '0px 0px -12% 0px',
            threshold: 0.12
        };
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    // si quieres que solo ocurra una vez:
                    // io.unobserve(entry.target);
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, options);

        // selectores a observar
        const selectors = [
            '.banner-content',
            '.banner-content *',
            '.section-content',
            '.gallery-item',
            '.countdown-item',
            '.location-card',
            '.date-card',
            '.dress-column',
            '.modal-content'
        ];
        const targets = document.querySelectorAll(selectors.join(', '));

        targets.forEach(el => {
            // Añadir clase base si no existe (permite CSS .reveal)
            if (!el.classList.contains('reveal')) el.classList.add('reveal');
            io.observe(el);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveals);
    } else {
        // Si ya cargó, esperar un tick para asegurar que renderGallery ya ejecutó
        setTimeout(initScrollReveals, 60);
    }
})();

/* ==== Mejor carrusel: navegación por snap positions y tilt optimizado ==== */
(function initImprovedCarousel() {
    const gallery = document.getElementById('photo-gallery');
    if (!gallery) return;

    let items = Array.from(gallery.querySelectorAll('.gallery-item'));
    let snapPositions = [];
    const leftBtn = document.querySelector('.carousel-btn.left');
    const rightBtn = document.querySelector('.carousel-btn.right');

    // recalcula posiciones de snap (centro de cada item relativo al contenedor)
    function computeSnapPositions() {
        items = Array.from(gallery.querySelectorAll('.gallery-item'));
        snapPositions = items.map(item => {
            // posición donde queremos hacer scroll para centrar el item
            const itemRect = item.getBoundingClientRect();
            const galleryRect = gallery.getBoundingClientRect();
            const offset = item.offsetLeft - (gallery.clientWidth / 2 - itemRect.width / 2);
            return Math.round(offset);
        });
    }

    // buscar índice objetivo (prev/next) según scrollLeft actual
    function findNearestIndex(currentScroll, direction = 'next') {
        for (let i = 0; i < snapPositions.length; i++) {
            if (direction === 'next' && snapPositions[i] > currentScroll + 5) return i;
            if (direction === 'prev' && snapPositions[i] >= currentScroll - 5) {
                const idx = i - 1;
                return idx >= 0 ? idx : 0;
            }
        }
        return direction === 'next' ? snapPositions.length - 1 : 0;
    }

    // scroll to index
    function scrollToIndex(index) {
        index = Math.max(0, Math.min(snapPositions.length - 1, index));
        const left = snapPositions[index];
        gallery.scrollTo({ left, behavior: 'smooth' });
    }

    // listeners botones
    if (leftBtn) leftBtn.addEventListener('click', () => {
        const cur = Math.round(gallery.scrollLeft);
        const idx = findNearestIndex(cur, 'prev');
        scrollToIndex(idx);
    }, { passive: true });

    if (rightBtn) rightBtn.addEventListener('click', () => {
        const cur = Math.round(gallery.scrollLeft);
        const idx = findNearestIndex(cur, 'next');
        scrollToIndex(idx);
    }, { passive: true });

    // keyboard
    gallery.tabIndex = gallery.tabIndex || 0;
    gallery.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') leftBtn && leftBtn.click();
        if (e.key === 'ArrowRight') rightBtn && rightBtn.click();
    });

    // recalcula en resize y al cargar imágenes/videos
    const resizeObserver = new ResizeObserver(() => computeSnapPositions());
    resizeObserver.observe(gallery);
    window.addEventListener('load', computeSnapPositions, { passive: true });
    window.addEventListener('resize', () => {
        // debounce mínimo
        clearTimeout(window._galleryResizeTimeout);
        window._galleryResizeTimeout = setTimeout(computeSnapPositions, 120);
    }, { passive: true });

    // compute initially after small delay so items exist
    setTimeout(computeSnapPositions, 60);

    // Optional: update active visual (add .in-view to centered item)
    let rafId = null;
    function onScroll() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const cur = Math.round(gallery.scrollLeft);
            // find index of nearest snap
            let nearest = 0;
            let minDiff = Infinity;
            snapPositions.forEach((pos, i) => {
                const d = Math.abs(pos - cur);
                if (d < minDiff) { minDiff = d; nearest = i; }
            });
            items.forEach((it, i) => it.classList.toggle('active', i === nearest));
        });
    }
    gallery.addEventListener('scroll', onScroll, { passive: true });

    // --- Tilt effect: only on pointer:fine (mouse, not touch) and throttle via rAF ---
    const supportsFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (supportsFinePointer) {
        items.forEach(item => {
            const media = item.querySelector('.media');
            if (!media) return;
            let busy = false;
            function handleMove(e) {
                if (busy) return;
                busy = true;
                requestAnimationFrame(() => {
                    const r = item.getBoundingClientRect();
                    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
                    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);
                    const px = (clientX - r.left) / r.width - 0.5;
                    const py = (clientY - r.top) / r.height - 0.5;
                    const rotY = px * 8;
                    const rotX = -py * 6;
                    media.style.transform = `perspective(900px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.02)`;
                    busy = false;
                });
            }
            const leave = () => media.style.transform = '';
            item.addEventListener('mousemove', handleMove, { passive: true });
            item.addEventListener('mouseleave', leave, { passive: true });
            item.addEventListener('touchmove', handleMove, { passive: true }); // gentle support
            item.addEventListener('touchend', leave, { passive: true });
        });
    } else {
        // remove any inline transform on touch devices
        items.forEach(it => {
            const media = it.querySelector('.media');
            if (media) media.style.transform = '';
        });
    }
})();

/* Mobile menu toggle: inicializar después de DOMContentLoaded (español) */
document.addEventListener('DOMContentLoaded', () => {
    (function initMobileMenu_es() {
        const nav = document.getElementById('main-nav');
        if (!nav) return;
        const toggle = document.getElementById('menu-toggle');
        const links = nav.querySelector('.nav-links');
        if (!toggle || !links) return;
        if (toggle.dataset.mobileInit) return;
        toggle.dataset.mobileInit = '1';

        toggle.addEventListener('click', (e) => {
            const opened = nav.classList.toggle('menu-open');
            toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
            e.stopPropagation();
        });

        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                nav.classList.remove('menu-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target)) {
                nav.classList.remove('menu-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        }, { passive: true });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                nav.classList.remove('menu-open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.blur();
            }
        });
    })();
});