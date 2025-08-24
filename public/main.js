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

    // --- Lógica para enviar el formulario ---
    const rsvpForm = document.getElementById('rsvp-form');
    const thankYouMessage = document.getElementById('thank-you-message');

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // URL de tu aplicación web de Google Apps Script
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzRXJydFi4G_LLzZv_ecwMkxOXgkDSIOcMszRMscRDrKdVkgt51Y2oixwsCGHEwqc9l/exec'; // <-- PEGA TU URL AQUÍ

        const submitButton = rsvpForm.querySelector('button[type="submit"]');
        submitButton.disabled = true; // Deshabilita el botón para evitar envíos múltiples
        submitButton.textContent = 'Enviando...';

        // Recopila los datos del formulario
        const guestName = document.getElementById('guestName').value;
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const guestMessage = document.getElementById('guestMessage').value;

        // Envía los datos usando fetch
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // Importante para evitar errores de CORS con Google Scripts
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: guestName,
                attendance: attendance,
                message: guestMessage
            })
        })
        .then(response => {
            // Oculta el formulario y muestra el mensaje de agradecimiento
            rsvpForm.style.display = 'none';
            thankYouMessage.style.display = 'block';

            // Opcional: cierra el modal después de unos segundos
            setTimeout(() => {
                modal.style.display = 'none';
                // Restablece el formulario para un futuro uso
                rsvpForm.style.display = 'block';
                thankYouMessage.style.display = 'none';
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar';
                rsvpForm.reset();
            }, 4000); // 4 segundos
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