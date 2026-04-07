document.addEventListener('DOMContentLoaded', () => {
    // Scroll reveal animation
    const reveals = document.querySelectorAll('.skills-section, .projects-section, .contact-section, .project-card, .reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    // Add initial reveal class to appropriate elements
    reveals.forEach(r => r.classList.add('reveal'));

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Navbar background behavior on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.5)';
            navbar.style.padding = '1rem 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1.5rem 0';
        }
    });

    // Contact form toggle and submit
    const sayHelloBtn = document.getElementById('say-hello-btn');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (sayHelloBtn && contactForm) {
        sayHelloBtn.addEventListener('click', () => {
            sayHelloBtn.classList.add('hidden');
            contactForm.classList.remove('hidden');
            contactForm.style.position = 'relative'; // Reset position when shown
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            try {
                const response = await fetch('/contact/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.status === 'success') {
                    formStatus.textContent = result.message;
                    formStatus.className = 'success';
                    contactForm.reset();
                    
                    // Reset to button view after 4 seconds
                    setTimeout(() => {
                        contactForm.classList.add('hidden');
                        contactForm.style.position = 'absolute';
                        sayHelloBtn.classList.remove('hidden');
                        formStatus.className = 'hidden';
                    }, 4000);
                } else {
                    throw new Error(result.message || 'Something went wrong');
                }
            } catch (error) {
                formStatus.textContent = error.message;
                formStatus.className = 'error';
            } finally {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
                formStatus.classList.remove('hidden');
            }
        });
    }

    console.log("Portfolio loaded with dynamic tech interactions.");
});
