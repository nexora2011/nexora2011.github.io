// NeXora Landing Page - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Variables globales
    let isMobile = window.innerWidth <= 1023;
    let isTouchDevice = 'ontouchstart' in window;
    
    // Función para detectar cambios de tamaño de pantalla
    function handleResize() {
        isMobile = window.innerWidth <= 1023;
        updateLayout();
    }
    
    // Función para actualizar el layout según el dispositivo
    function updateLayout() {
        const heroVisual = document.querySelector('.hero-visual');
        const floatingCards = document.querySelectorAll('.floating-card');
        
        if (isMobile && heroVisual) {
            heroVisual.style.order = '-1';
        } else if (heroVisual) {
            heroVisual.style.order = '0';
        }
        
        // Ajustar animaciones según el dispositivo
        if (isTouchDevice) {
            floatingCards.forEach(card => {
                card.style.animation = 'none';
            });
        } else {
            floatingCards.forEach(card => {
                card.style.animation = 'float 6s ease-in-out infinite';
            });
        }
    }
    
    // Navegación móvil mejorada
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav-container');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            
            // Animar el menú
            if (navMenu.classList.contains('active')) {
                animateMenuItems();
            }
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!navContainer.contains(e.target) && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Cerrar menú con Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
    
    function animateMenuItems() {
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    });
    
    // Scroll suave para enlaces internos con offset para header fijo
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20; // Offset adicional
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efecto de parallax optimizado para móviles
    const hero = document.querySelector('.hero');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    function handleParallax() {
        if (isMobile) return; // Desactivar parallax en móviles
        
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3; // Reducir intensidad
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Efecto en las tarjetas flotantes
        floatingCards.forEach((card, index) => {
            const speed = 0.3 + (index * 0.05);
            card.style.transform = `translateY(${scrolled * speed * 0.05}px)`;
        });
    }
    
    // Throttle para el scroll
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Animación de aparición al hacer scroll con Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animar elementos hijos si existen
                const animatedChildren = entry.target.querySelectorAll('.animate-child');
                animatedChildren.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const animateElements = document.querySelectorAll('.education-card, .service-card, .product-card, .section-header');
    animateElements.forEach(el => observer.observe(el));
    
    // Efecto de typing en el título principal (solo en desktop)
    if (!isMobile) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // Iniciar typing después de un delay
            setTimeout(typeWriter, 500);
        }
    }
    
    // Efecto de hover en botones (solo en desktop)
    if (!isTouchDevice) {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Contador animado para estadísticas
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }
    
    // Efecto de partículas en el fondo (solo en desktop)
    if (!isMobile && !isTouchDevice) {
        function createParticles() {
            const hero = document.querySelector('.hero');
            if (!hero) return;
            
            for (let i = 0; i < 30; i++) { // Reducir número de partículas
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: ${Math.random() > 0.5 ? 'var(--neon-purple)' : 'var(--neon-cyan)'};
                    border-radius: 50%;
                    opacity: ${Math.random() * 0.3 + 0.1};
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: float-particle ${Math.random() * 15 + 10}s infinite linear;
                    pointer-events: none;
                `;
                hero.appendChild(particle);
            }
        }
        
        // Crear partículas después de un delay
        setTimeout(createParticles, 1000);
    }
    
    // Smooth scroll para botones CTA
    const ctaButtons = document.querySelectorAll('.cta .btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simular acción (en un caso real, redirigir o abrir modal)
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> ¡Gracias!';
            this.style.background = 'var(--neon-cyan)';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
            }, 2000);
        });
    });
    
    // Efecto de glassmorphism en scroll
    function handleHeaderScroll() {
        const header = document.querySelector('.header');
        const scrolled = window.pageYOffset;
        
        if (scrolled > 100) {
            header.style.background = 'rgba(10, 10, 15, 0.98)';
            header.style.backdropFilter = 'blur(25px)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(10, 10, 15, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = 'none';
        }
    }
    
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    
    // Lazy loading para imágenes
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Cursor personalizado (solo en desktop)
    if (!isTouchDevice) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--gradient-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.8;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Efecto hover en enlaces y botones
        document.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
    }
    
    // Optimizaciones para dispositivos táctiles
    if (isTouchDevice) {
        // Aumentar área de toque
        const touchElements = document.querySelectorAll('.btn, .hamburger, .nav-menu a');
        touchElements.forEach(el => {
            el.style.minHeight = '44px';
            el.style.minWidth = '44px';
        });
        
        // Desactivar hover en dispositivos táctiles
        const hoverElements = document.querySelectorAll('.education-card, .service-card, .product-card, .floating-card');
        hoverElements.forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            el.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    // Gestión de orientación del dispositivo
    function handleOrientation() {
        if (window.orientation === 90 || window.orientation === -90) {
            // Landscape
            document.body.classList.add('landscape');
        } else {
            // Portrait
            document.body.classList.remove('landscape');
        }
    }
    
    window.addEventListener('orientationchange', handleOrientation);
    handleOrientation(); // Verificar orientación inicial
    
    // Optimizaciones de rendimiento
    function optimizePerformance() {
        // Reducir animaciones en dispositivos de bajo rendimiento
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.body.classList.add('low-performance');
        }
        
        // Detectar conexión lenta
        if ('connection' in navigator) {
            if (navigator.connection.effectiveType === 'slow-2g' || 
                navigator.connection.effectiveType === '2g') {
                document.body.classList.add('slow-connection');
            }
        }
    }
    
    // Inicializar
    function init() {
        updateLayout();
        optimizePerformance();
        handleHeaderScroll();
        
        // Agregar clase al body para CSS
        if (isMobile) document.body.classList.add('mobile');
        if (isTouchDevice) document.body.classList.add('touch');
        
        console.log('NeXora Landing Page - JavaScript cargado correctamente');
        console.log(`Dispositivo: ${isMobile ? 'Móvil' : 'Desktop'}, Táctil: ${isTouchDevice ? 'Sí' : 'No'}`);
    }
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', init);
    
    // Inicializar inmediatamente si el DOM ya está listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
});

// Agregar estilos CSS adicionales para las animaciones y responsive
const additionalStyles = `
    @keyframes float-particle {
        0% { transform: translateY(0px) rotate(0deg); }
        100% { transform: translateY(-100vh) rotate(360deg); }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .animate-child {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .animate-child.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(10, 10, 15, 0.98);
        backdrop-filter: blur(25px);
        padding: var(--spacing-lg);
        border-top: 1px solid rgba(139, 92, 246, 0.1);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        animation: slideDown 0.3s ease-out;
        z-index: 999;
    }
    
    .nav-menu.active li {
        margin: var(--spacing-sm) 0;
        opacity: 0;
        transform: translateX(-20px);
        transition: all 0.3s ease;
    }
    
    .nav-menu.active li:nth-child(1) { transition-delay: 0.1s; }
    .nav-menu.active li:nth-child(2) { transition-delay: 0.2s; }
    .nav-menu.active li:nth-child(3) { transition-delay: 0.3s; }
    .nav-menu.active li:nth-child(4) { transition-delay: 0.4s; }
    
    .nav-menu.active li.animate-in {
        opacity: 1;
        transform: translateX(0);
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    /* Clases para dispositivos específicos */
    .mobile .hero-container {
        grid-template-columns: 1fr;
    }
    
    .touch .btn:hover {
        transform: none !important;
    }
    
    .touch .floating-card:hover {
        transform: none !important;
    }
    
    .landscape .hero {
        min-height: auto;
        padding: 60px 0 30px;
    }
    
    .low-performance * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
    
    .slow-connection .floating-card {
        animation: none;
    }
    
    /* Prevenir scroll cuando el menú móvil está abierto */
    body.nav-open {
        overflow: hidden;
    }
    
    /* Mejoras para dispositivos de alta densidad */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        .floating-card {
            border-width: 0.5px;
        }
    }
    
    /* Soporte para modo oscuro del sistema */
    @media (prefers-color-scheme: dark) {
        .custom-cursor {
            background: var(--gradient-primary);
        }
    }
    
    @media (prefers-color-scheme: light) {
        .custom-cursor {
            background: var(--gradient-secondary);
        }
    }
    
    /* Mejoras de accesibilidad */
    @media (prefers-reduced-motion: reduce) {
        .animate-in,
        .animate-child.animate-in {
            animation: none;
            opacity: 1;
            transform: none;
        }
        
        .floating-card {
            animation: none;
        }
        
        .particle {
            display: none;
        }
    }
    
    /* Estilos para el cursor personalizado */
    .custom-cursor {
        mix-blend-mode: difference;
    }
    
    /* Mejoras para dispositivos con pantallas pequeñas */
    @media (max-width: 320px) {
        .nav-menu.active {
            padding: var(--spacing-md);
        }
        
        .nav-menu.active li {
            margin: var(--spacing-xs) 0;
        }
    }
`;

// Insertar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
