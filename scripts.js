$(document).ready(function() {
    // Initialize WOW.js
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }

    // UI Logic
    setupMobileMenu();
    setupHeroSlider();
    setupTabs();
    setupAccordion();
    init3D();

    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });
});

function setupMobileMenu() {
    $('#mobile-toggle').click(function() {
        $('#nav-menu').toggleClass('active');
        $(this).find('i').toggleClass('fa-bars fa-times');
    });

    // Close menu on link click
    $('#nav-menu a').click(function() {
        $('#nav-menu').removeClass('active');
        $('#mobile-toggle i').addClass('fa-bars').removeClass('fa-times');
    });
}

function setupHeroSlider() {
    const slides = $('.hero-slide');
    let currentSlide = 0;

    function nextSlide() {
        slides.eq(currentSlide).removeClass('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides.eq(currentSlide).addClass('active');
    }

    setInterval(nextSlide, 5000);
}

function setupTabs() {
    $('.tab-link').click(function() {
        const tabId = $(this).data('tab');
        
        $('.tab-link').removeClass('active');
        $(this).addClass('active');
        
        $('.tab-panel').removeClass('active');
        $('#' + tabId).addClass('active');
    });
}

function setupAccordion() {
    $('.accordion-header').click(function() {
        const item = $(this).parent();
        $('.accordion-item').not(item).removeClass('active');
        item.toggleClass('active');
    });
}

/* 
   3D Effect: Sunny Bubbles & Golden Dust
   Cheerful, vacation-themed effect with floating bubbles and sparkling sun particles.
*/
function init3D() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Bubbles System (Sea Bubbles)
    const bubbleCount = 40;
    const bubbles = [];
    const bubbleGeometry = new THREE.SphereGeometry(1, 16, 16);
    
    for (let i = 0; i < bubbleCount; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: Math.random() * 0.3 + 0.1,
            shininess: 100
        });
        const bubble = new THREE.Mesh(bubbleGeometry, material);
        
        bubble.position.set(
            Math.random() * 40 - 20,
            Math.random() * 40 - 20,
            Math.random() * 20 - 15
        );
        const scale = Math.random() * 0.5 + 0.1;
        bubble.scale.set(scale, scale, scale);
        
        // Custom movement properties
        bubble.userData = {
            speed: Math.random() * 0.02 + 0.005,
            wiggle: Math.random() * 0.5
        };
        
        bubbles.push(bubble);
        scene.add(bubble);
    }

    // 2. Golden Dust System (Sun Sparkles)
    const particleCount = 1000;
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = Math.random() * 40 - 20;
        positions[i * 3 + 1] = Math.random() * 40 - 20;
        positions[i * 3 + 2] = Math.random() * 40 - 20;

        // Golden/White colors
        colors[i * 3] = 1; // R
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.3; // B
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });

    const sunDust = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(sunDust);

    // Lights
    const directLight = new THREE.DirectionalLight(0xffffff, 2);
    directLight.position.set(5, 10, 5);
    scene.add(directLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    camera.position.z = 12;

    const clock = new THREE.Clock();
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    function animate() {
        const time = clock.getElapsedTime();
        
        // Animate Bubbles (Float up and wiggle)
        bubbles.forEach(bubble => {
            bubble.position.y += bubble.userData.speed;
            bubble.position.x += Math.sin(time + bubble.userData.wiggle) * 0.01;
            
            // Reset position if out of bounds
            if (bubble.position.y > 20) {
                bubble.position.y = -20;
            }
        });

        // Rotate Sun Dust
        sunDust.rotation.y = time * 0.05;
        sunDust.rotation.x = time * 0.02;

        // Mouse follow
        camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 4 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}
