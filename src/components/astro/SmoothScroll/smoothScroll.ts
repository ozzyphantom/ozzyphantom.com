document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const progressIndicator = document.getElementById('progressIndicator');
    
    if (!sections.length || !progressIndicator) return;
    
    let currentIndex = 0;
    let isAnimating = false;
    let lastScrollTime = 0;
    const scrollCooldown = 800; // ms cooldown between scroll events
    
    // Set section backgrounds and create progress dots
    sections.forEach((section, index) => {
        const sectionEl = section as HTMLElement;
        const color = section.getAttribute('data-color');
        const textColor = section.getAttribute('data-text-color') || 'white';
        const fontFamily = section.getAttribute('data-font-family') || 'inherit';
        
        if (color) sectionEl.style.backgroundColor = color;
        
        // Apply text color and font family to the section content
        const sectionContent = sectionEl.querySelector('.section-content') as HTMLElement;
        if (sectionContent) {
            sectionContent.style.color = textColor;
            sectionContent.style.fontFamily = fontFamily;
        }
        
        // Also apply to any h1 and p elements inside (to ensure they inherit properly)
        const headings = sectionContent?.querySelectorAll('h1');
        const paragraphs = sectionContent?.querySelectorAll('p');
        
        headings?.forEach(heading => {
            (heading as HTMLElement).style.color = textColor;
        });
        
        paragraphs?.forEach(paragraph => {
            (paragraph as HTMLElement).style.color = textColor;
        });
        
        // Create progress dots
        const dot = document.createElement('div');
        dot.classList.add('progress-dot');
        dot.addEventListener('click', () => {
            if (!isAnimating && currentIndex !== index) navigateToSection(index);
        });
        progressIndicator.appendChild(dot);
    });
    
    // Initialize sections positioning
    updateSectionsStatus(0);
    
    function updateSectionsStatus(activeIndex: number): void {
        sections.forEach((section, index) => {
            section.classList.remove('active', 'prev', 'next');
            
            if (index === activeIndex) {
                section.classList.add('active');
            } else if (index < activeIndex) {
                section.classList.add('prev');
            } else {
                section.classList.add('next');
            }
        });
        
        // Update dots
        const dots = document.querySelectorAll('.progress-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
            
            // Set dot styling when active
            if (i === activeIndex && i < sections.length) {
                const activeSection = sections[i] as HTMLElement;
                const sectionColor = activeSection.getAttribute('data-color');
                
                // Use white for dot borders by default, regardless of text color
                if (sectionColor) (dot as HTMLElement).style.backgroundColor = sectionColor;
                (dot as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.7)';
            } else {
                (dot as HTMLElement).style.backgroundColor = 'transparent';
                (dot as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.7)';
            }
        });
    }
    
    function navigateToSection(index: number): void {
        if (index === currentIndex || isAnimating || index < 0 || index >= sections.length) return;
        
        isAnimating = true;
        updateSectionsStatus(index);
        currentIndex = index;
        
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }
    
    // Event listener for wheel events
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const now = Date.now();
        if (isAnimating || now - lastScrollTime < scrollCooldown) return;
        
        lastScrollTime = now;
        const direction = e.deltaY > 0 ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(currentIndex + direction, sections.length - 1));
        
        if (nextIndex !== currentIndex) {
            navigateToSection(nextIndex);
        }
    }, { passive: false });
    
    // Touch events for mobile
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (isAnimating || now - lastScrollTime < scrollCooldown) return;
        
        const touchEndY = e.changedTouches[0].screenY;
        const diffY = touchStartY - touchEndY;
        
        if (Math.abs(diffY) >= 50) {
            lastScrollTime = now;
            const direction = diffY > 0 ? 1 : -1;
            const nextIndex = Math.max(0, Math.min(currentIndex + direction, sections.length - 1));
            
            if (nextIndex !== currentIndex) {
                navigateToSection(nextIndex);
            }
        }
    }, { passive: true });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const now = Date.now();
        if (isAnimating || now - lastScrollTime < scrollCooldown) return;
        
        let direction = 0;
        
        if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
            direction = 1;
            e.preventDefault();
        } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
            direction = -1;
            e.preventDefault();
        }
        
        if (direction !== 0) {
            lastScrollTime = now;
            const nextIndex = Math.max(0, Math.min(currentIndex + direction, sections.length - 1));
            
            if (nextIndex !== currentIndex) {
                navigateToSection(nextIndex);
            }
        }
    });
});