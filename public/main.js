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
            if (this.value === 'yes') {
                guestsSection.style.display = 'block';
                noSection.style.display = 'none';
                if (noGuestNameInput) noGuestNameInput.removeAttribute('required');
            } else {
                guestsSection.style.display = 'none';
                noSection.style.display = 'block';
                if (noGuestNameInput) noGuestNameInput.setAttribute('required', 'required');
                document.getElementById('guestNames').innerHTML = '';
                document.getElementById('guestCount').value = '';
            }
        });
    });

    // Generar campos de nombres de invitados según el select
    document.getElementById('guestCount').addEventListener('input', function() {
        const guestNamesDiv = document.getElementById('guestNames');
        guestNamesDiv.innerHTML = '';
        const count = parseInt(this.value, 10);
        if (count > 0 && count <= 10) { // Limitar a un máximo de 10 invitados
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
            if (this.value === 'yes') {
                guestsSection.style.display = 'block';
                noSection.style.display = 'none';
            } else {
                guestsSection.style.display = 'none';
                noSection.style.display = 'block';
                document.getElementById('guestNames').innerHTML = '';
                document.getElementById('guestCount').value = '';
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

// Photo Gallery
const photos = [
    'https://images.unsplash.com/photo-1519741497674-611481863552',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8'
];

const gallery = document.getElementById('photo-gallery');
photos.forEach(photo => {
    const img = document.createElement('img');
    img.src = `${photo}?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80`
    img.alt = 'Momento especial';
    gallery.appendChild(img);
});