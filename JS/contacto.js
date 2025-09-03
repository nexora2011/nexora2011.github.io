// Contacto - JavaScript específico de la página

document.addEventListener('DOMContentLoaded', function() {
    
    // Referencias a elementos del formulario
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectSelect = document.getElementById('subject');
    const messageTextarea = document.getElementById('message');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Validación del formulario
    function validateForm() {
        let isValid = true;
        let errorMessage = '';
        
        // Validar nombre
        if (!nameInput.value.trim()) {
            isValid = false;
            errorMessage += 'El nombre es obligatorio.\n';
            nameInput.style.borderColor = '#ef4444';
        } else {
            nameInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            isValid = false;
            errorMessage += 'El email es obligatorio.\n';
            emailInput.style.borderColor = '#ef4444';
        } else if (!emailRegex.test(emailInput.value)) {
            isValid = false;
            errorMessage += 'El formato del email no es válido.\n';
            emailInput.style.borderColor = '#ef4444';
        } else {
            emailInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        
        // Validar teléfono (opcional pero si se llena debe ser válido)
        if (phoneInput.value.trim()) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(phoneInput.value)) {
                isValid = false;
                errorMessage += 'El formato del teléfono no es válido.\n';
                phoneInput.style.borderColor = '#ef4444';
            } else {
                phoneInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        } else {
            phoneInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        
        // Validar asunto
        if (!subjectSelect.value || subjectSelect.value === '') {
            isValid = false;
            errorMessage += 'Debe seleccionar un asunto.\n';
            subjectSelect.style.borderColor = '#ef4444';
        } else {
            subjectSelect.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        
        // Validar mensaje
        if (!messageTextarea.value.trim()) {
            isValid = false;
            errorMessage += 'El mensaje es obligatorio.\n';
            messageTextarea.style.borderColor = '#ef4444';
        } else if (messageTextarea.value.trim().length < 10) {
            isValid = false;
            errorMessage += 'El mensaje debe tener al menos 10 caracteres.\n';
            messageTextarea.style.borderColor = '#ef4444';
        } else {
            messageTextarea.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
        
        return { isValid, errorMessage };
    }
    
    // Función para mostrar mensajes de error
    function showError(message) {
        // Crear o actualizar mensaje de error
        let errorDiv = document.querySelector('.form-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = `
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid #ef4444;
                color: #ef4444;
                padding: var(--spacing-md);
                border-radius: var(--border-radius);
                margin-bottom: var(--spacing-lg);
                font-size: var(--font-size-sm);
                white-space: pre-line;
            `;
            contactForm.insertBefore(errorDiv, contactForm.firstChild);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
    
    // Función para mostrar mensaje de éxito
    function showSuccess() {
        // Crear mensaje de éxito
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.style.cssText = `
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid #22c55e;
            color: #22c55e;
            padding: var(--spacing-md);
            border-radius: var(--border-radius);
            margin-bottom: var(--spacing-lg);
            font-size: var(--font-size-sm);
            text-align: center;
        `;
        successDiv.innerHTML = `
            <i class="fas fa-check-circle" style="margin-right: var(--spacing-xs);"></i>
            ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.
        `;
        
        contactForm.insertBefore(successDiv, contactForm.firstChild);
        
        // Limpiar formulario
        contactForm.reset();
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }
    
    // Función para simular envío del formulario
    function submitForm(formData) {
        // Simular envío (en un caso real, aquí se haría la petición AJAX)
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Datos del formulario:', formData);
                resolve({ success: true });
            }, 1500);
        });
    }
    
    // Event listener para el envío del formulario
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar formulario
        const validation = validateForm();
        if (!validation.isValid) {
            showError(validation.errorMessage);
            return;
        }
        
        // Ocultar mensajes de error previos
        const errorDiv = document.querySelector('.form-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        
        // Cambiar estado del botón
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;
        
        try {
            // Recopilar datos del formulario
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                subject: subjectSelect.value,
                message: messageTextarea.value.trim(),
                timestamp: new Date().toISOString()
            };
            
            // Enviar formulario
            const result = await submitForm(formData);
            
            if (result.success) {
                showSuccess();
            } else {
                showError('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
            }
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            showError('Hubo un error inesperado. Por favor, inténtalo de nuevo.');
        } finally {
            // Restaurar botón
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
    
    // Validación en tiempo real
    const inputs = [nameInput, emailInput, phoneInput, subjectSelect, messageTextarea];
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            // Validar campo individual al perder el foco
            if (this === nameInput && !this.value.trim()) {
                this.style.borderColor = '#ef4444';
            } else if (this === emailInput) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!this.value.trim() || !emailRegex.test(this.value)) {
                    this.style.borderColor = '#ef4444';
                } else {
                    this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            } else if (this === phoneInput && this.value.trim()) {
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(this.value)) {
                    this.style.borderColor = '#ef4444';
                } else {
                    this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            } else if (this === subjectSelect && (!this.value || this.value === '')) {
                this.style.borderColor = '#ef4444';
            } else if (this === messageTextarea && (!this.value.trim() || this.value.trim().length < 10)) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
        
        input.addEventListener('input', function() {
            // Limpiar borde rojo al escribir
            if (this.style.borderColor === 'rgb(239, 68, 68)') {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
    
    // Efectos de hover para las tarjetas sociales
    const socialCards = document.querySelectorAll('.social-card');
    socialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efectos de hover para los elementos de contacto
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.background = 'rgba(255, 255, 255, 0.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.background = 'rgba(255, 255, 255, 0.02)';
        });
    });
    
    // Animación de aparición para elementos de la página
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const animateElements = document.querySelectorAll('.contact-form, .contact-info, .social-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Inicialización
    console.log('Contacto - JavaScript cargado correctamente');
    
    // Simular carga de datos (en un caso real, esto vendría de una API)
    setTimeout(() => {
        console.log('Formulario de contacto listo para usar');
    }, 100);
});
