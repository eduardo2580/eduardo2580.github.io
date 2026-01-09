// ============================================
// ENHANCED 3D BALL PORTFOLIO SYSTEM
// Fixed: Consistent block size during rotation
// Improved: Front block readability
// ============================================

const BrowserSupport = {
    supportsWebGL: function() {
        try {
            var canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch(e) {
            return false;
        }
    }
};

var scene, camera, renderer, ball, particles = [];
var orbitalSystem = {
    blocks: [],
    currentRotation: 0,
    targetRotation: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    lastTouchX: 0,
    lastTouchY: 0,
    distance: 350,
    velocity: 0,
    animationId: null
};

var animationFrameId = null;

// ============================================
// RESPONSIVE DISTANCE CALCULATION
// ============================================

function getResponsiveDistance() {
    var width = window.innerWidth || document.documentElement.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight;
    var minDimension = Math.min(width, height);
    
    if (minDimension < 576) {
        return Math.max(minDimension * 0.45, 140);
    } else if (minDimension < 1024) {
        return Math.max(minDimension * 0.48, 200);
    } else {
        return Math.max(minDimension * 0.52, 280);
    }
}

// ============================================
// REQUEST ANIMATION FRAME POLYFILL
// ============================================

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || 
                                      window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
})();

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add("js-enabled");
    
    // Add glitch overlay
    var glitchOverlay = document.createElement('div');
    glitchOverlay.className = 'glitch-overlay';
    document.body.appendChild(glitchOverlay);
    
    initializeCanvas();
    initializeOrbitalSystem();
    addNavigationButtons();
    addNavigationHints();
    setupNavigationClicks();
    
    // Mouse events - excluding interactive elements
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
    
    // Touch events - excluding interactive elements
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Prevent scroll
    document.addEventListener('wheel', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Resize handler
    window.addEventListener('resize', debounce(handleResize, 300));
    
    // Keyboard navigation
    window.addEventListener('keydown', handleKeyNavigation);
    
    // Start animation loop
    startOrbitalAnimation();
});

// ============================================
// 3D CANVAS INITIALIZATION
// ============================================

function initializeCanvas() {
    var canvas = document.getElementById('canvas3d');
    if (!canvas || !window.THREE || !BrowserSupport.supportsWebGL()) {
        document.body.classList.add('no-webgl');
        console.warn('WebGL not supported - using fallback mode');
        return;
    }

    var width = window.innerWidth || document.documentElement.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight;

    // Three.js Scene Setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x0a0e27, 0.1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create Enhanced 3D Ball
    var geometry = new THREE.IcosahedronGeometry(2.2, 5);
    var material = new THREE.MeshPhongMaterial({
        color: 0x00ff41,
        emissive: 0x00aa00,
        wireframe: false,
        shininess: 120,
        specular: 0x00ff41
    });
    ball = new THREE.Mesh(geometry, material);
    scene.add(ball);

    // Enhanced Lighting System
    var light1 = new THREE.PointLight(0x00ff41, 1.2, 100);
    light1.position.set(6, 6, 6);
    scene.add(light1);

    var light2 = new THREE.PointLight(0x00d9ff, 0.7, 100);
    light2.position.set(-6, -4, 6);
    scene.add(light2);

    var light3 = new THREE.PointLight(0xff00ff, 0.4, 80);
    light3.position.set(0, -6, 4);
    scene.add(light3);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    // Enhanced Particle System
    var particleGeometry = new THREE.BufferGeometry();
    var particleCount = 150;
    var positions = new Float32Array(particleCount * 3);
    var colors = new Float32Array(particleCount * 3);

    for (var i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 25;
        positions[i + 1] = (Math.random() - 0.5) * 25;
        positions[i + 2] = (Math.random() - 0.5) * 25;
        
        // Random colors: green, cyan, magenta
        var colorChoice = Math.floor(Math.random() * 3);
        if (colorChoice === 0) {
            colors[i] = 0; colors[i + 1] = 1; colors[i + 2] = 0.25;
        } else if (colorChoice === 1) {
            colors[i] = 0; colors[i + 1] = 0.85; colors[i + 2] = 1;
        } else {
            colors[i] = 1; colors[i + 1] = 0; colors[i + 2] = 1;
        }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    var particleMaterial = new THREE.PointsMaterial({
        size: 0.12,
        sizeAttenuation: true,
        opacity: 0.7,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (ball) {
            ball.rotation.x += 0.003;
            ball.rotation.y += 0.006;
        }

        if (particles) {
            particles.rotation.x += 0.0002;
            particles.rotation.y += 0.0004;
        }

        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }

    animate();
}

// ============================================
// RESIZE HANDLER
// ============================================

function handleResize() {
    if (renderer && camera) {
        var newWidth = window.innerWidth || document.documentElement.clientWidth;
        var newHeight = window.innerHeight || document.documentElement.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    orbitalSystem.distance = getResponsiveDistance();
    updateOrbitalPositions();
}

// ============================================
// ORBITAL SYSTEM INITIALIZATION
// ============================================

function initializeOrbitalSystem() {
    orbitalSystem.distance = getResponsiveDistance();
    
    var sections = [];
    var allSections = document.querySelectorAll('header, section, footer');
    
    // Filter visible sections
    for (var i = 0; i < allSections.length; i++) {
        if (allSections[i] && allSections[i].offsetParent !== null) {
            sections.push(allSections[i]);
        }
    }

    for (var j = 0; j < sections.length; j++) {
        var section = sections[j];
        var totalSections = sections.length;
        var angle = (360 / totalSections) * j;

        section.classList.add('orbital-block');
        section.style.position = 'fixed';
        
        var blockWidth = window.innerWidth < 576 ? '85vw' : 
                        window.innerWidth < 1024 ? '320px' : '380px';
        section.style.maxWidth = blockWidth;

        orbitalSystem.blocks.push({
            element: section,
            angle: angle,
            originalAngle: angle,
            index: j
        });
    }

    updateOrbitalPositions();
}

// ============================================
// INTERACTIVE ELEMENT DETECTION
// ============================================

function isInteractiveElement(target) {
    if (!target) return false;
    
    var tagName = target.tagName ? target.tagName.toLowerCase() : '';
    
    if (tagName === 'a' || tagName === 'button' || tagName === 'input' || 
        tagName === 'select' || tagName === 'textarea') {
        return true;
    }
    
    var parent = target.parentElement;
    while (parent) {
        var parentTag = parent.tagName ? parent.tagName.toLowerCase() : '';
        if (parentTag === 'a' || parentTag === 'button') {
            return true;
        }
        if (parent.classList && (
            parent.classList.contains('rotation-btn') || 
            parent.classList.contains('lang-btn') || 
            parent.classList.contains('nav-link') ||
            parent.classList.contains('nav-item') ||
            parent.classList.contains('cta-button') ||
            parent.classList.contains('cta-link') ||
            parent.classList.contains('social-btn')
        )) {
            return true;
        }
        parent = parent.parentElement;
    }
    
    return false;
}

// ============================================
// MOUSE HANDLERS
// ============================================

function handleMouseDown(e) {
    if (isInteractiveElement(e.target)) {
        return;
    }
    
    orbitalSystem.isDragging = true;
    orbitalSystem.lastMouseX = e.clientX;
    orbitalSystem.lastMouseY = e.clientY;
    orbitalSystem.velocity = 0;
    document.body.style.cursor = 'grabbing';
}

function handleMouseMove(e) {
    if (orbitalSystem.isDragging) {
        var deltaX = e.clientX - orbitalSystem.lastMouseX;
        var deltaY = e.clientY - orbitalSystem.lastMouseY;
        
        var movement = deltaX - deltaY * 0.5;
        
        orbitalSystem.targetRotation += movement * 0.9;
        orbitalSystem.velocity = movement * 0.9;
        
        orbitalSystem.lastMouseX = e.clientX;
        orbitalSystem.lastMouseY = e.clientY;
    }
}

function handleMouseUp() {
    orbitalSystem.isDragging = false;
    document.body.style.cursor = 'default';
}

// ============================================
// TOUCH HANDLERS
// ============================================

function handleTouchStart(e) {
    if (e.touches.length > 0 && isInteractiveElement(e.target)) {
        return;
    }
    
    if (e.touches.length > 0) {
        e.preventDefault();
        orbitalSystem.isDragging = true;
        orbitalSystem.lastTouchX = e.touches[0].clientX;
        orbitalSystem.lastTouchY = e.touches[0].clientY;
        orbitalSystem.velocity = 0;
    }
}

function handleTouchMove(e) {
    if (orbitalSystem.isDragging && e.touches.length > 0) {
        e.preventDefault();
        
        var currentX = e.touches[0].clientX;
        var currentY = e.touches[0].clientY;
        
        var centerX = (window.innerWidth || document.documentElement.clientWidth) / 2;
        var centerY = (window.innerHeight || document.documentElement.clientHeight) / 2;
        
        var angleFromCenter = Math.atan2(currentY - centerY, currentX - centerX) * (180 / Math.PI);
        var lastAngle = Math.atan2(orbitalSystem.lastTouchY - centerY, orbitalSystem.lastTouchX - centerX) * (180 / Math.PI);
        
        var angleDelta = angleFromCenter - lastAngle;
        
        if (angleDelta > 180) angleDelta -= 360;
        if (angleDelta < -180) angleDelta += 360;
        
        var movement = angleDelta * 2.2;
        
        orbitalSystem.targetRotation += movement;
        orbitalSystem.velocity = movement;
        
        orbitalSystem.lastTouchX = currentX;
        orbitalSystem.lastTouchY = currentY;
    }
}

function handleTouchEnd(e) {
    if (!isInteractiveElement(e.target)) {
        e.preventDefault();
    }
    orbitalSystem.isDragging = false;
    
    if (Math.abs(orbitalSystem.velocity) > 0.5) {
        applyMomentum();
    }
}

// ============================================
// MOMENTUM EFFECT
// ============================================

function applyMomentum() {
    var momentumInterval = setInterval(function() {
        orbitalSystem.velocity *= 0.94;
        orbitalSystem.targetRotation += orbitalSystem.velocity;
        
        if (Math.abs(orbitalSystem.velocity) < 0.1) {
            clearInterval(momentumInterval);
        }
    }, 16);
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

function handleKeyNavigation(e) {
    var totalBlocks = orbitalSystem.blocks.length;
    var rotationStep = 360 / totalBlocks;
    
    if (e.keyCode === 39 || e.keyCode === 40) {
        e.preventDefault();
        orbitalSystem.targetRotation -= rotationStep;
    } else if (e.keyCode === 37 || e.keyCode === 38) {
        e.preventDefault();
        orbitalSystem.targetRotation += rotationStep;
    }
}

// ============================================
// UPDATE ORBITAL POSITIONS - FIXED VERSION
// ============================================

function updateOrbitalPositions() {
    var centerX = (window.innerWidth || document.documentElement.clientWidth) / 2;
    var centerY = (window.innerHeight || document.documentElement.clientHeight) / 2;

    // Smooth interpolation
    var ease = 0.12;
    orbitalSystem.currentRotation += (orbitalSystem.targetRotation - orbitalSystem.currentRotation) * ease;

    var closestBlockIdx = 0;
    var closestDistance = Infinity;

    for (var i = 0; i < orbitalSystem.blocks.length; i++) {
        var block = orbitalSystem.blocks[i];
        
        var angle = block.originalAngle + orbitalSystem.currentRotation;
        var rad = (angle * Math.PI) / 180;

        var x = centerX + orbitalSystem.distance * Math.cos(rad);
        var y = centerY + orbitalSystem.distance * Math.sin(rad);
        
        // Calculate depth - normalized angle from front (180 degrees)
        var normalizedAngle = ((angle % 360) + 360) % 360;
        var angleDistance = Math.min(Math.abs(normalizedAngle - 180), 360 - Math.abs(normalizedAngle - 180));
        
        // FIXED: Constant scale - no size changes
        var scale = 1.0; // Always keep blocks at 100% scale
        
        // Z-index based on depth
        var zIndex = Math.floor(1000 - angleDistance);
        
        // Track closest block for focus effect
        if (angleDistance < closestDistance) {
            closestDistance = angleDistance;
            closestBlockIdx = i;
        }

        // Apply position and styling
        block.element.style.left = x + 'px';
        block.element.style.top = y + 'px';
        block.element.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
        block.element.style.zIndex = zIndex;
        
        // Opacity fade for depth perception (but keep readable)
        var opacity = 0.3 + (1 - angleDistance / 180) * 0.7;
        block.element.style.opacity = opacity;
        
        // Remove focus class
        if (block.element.classList) {
            block.element.classList.remove('orbital-focus');
        } else {
            block.element.className = block.element.className.replace(/\borbital-focus\b/g, '');
        }
    }
    
    // Highlight front block for readability
    if (orbitalSystem.blocks[closestBlockIdx]) {
        var focusBlock = orbitalSystem.blocks[closestBlockIdx].element;
        
        // Check if mobile
        var isMobile = window.innerWidth < 576;
        
        // Full opacity for focused block
        focusBlock.style.opacity = '1';
        focusBlock.style.zIndex = '2000'; // Ensure it's on top
        
        if (focusBlock.classList) {
            focusBlock.classList.add('orbital-focus');
        } else {
            focusBlock.className += ' orbital-focus';
        }
        
        // On mobile, make background blocks more transparent
        if (isMobile) {
            for (var j = 0; j < orbitalSystem.blocks.length; j++) {
                if (j !== closestBlockIdx) {
                    var bgBlock = orbitalSystem.blocks[j].element;
                    var currentOpacity = parseFloat(bgBlock.style.opacity) || 0.3;
                    bgBlock.style.opacity = Math.min(currentOpacity, 0.2);
                }
            }
        }
    }
}

// ============================================
// START ANIMATION LOOP
// ============================================

function startOrbitalAnimation() {
    function animate() {
        updateOrbitalPositions();
        animationFrameId = requestAnimationFrame(animate);
    }
    animate();
}

// ============================================
// NAVIGATION BUTTONS - MULTI-LANGUAGE
// ============================================

function addNavigationButtons() {
    var lang = getCurrentLanguage();
    var translations = {
        en: {
            left: 'Rotate Left',
            right: 'Rotate Right'
        },
        es: {
            left: 'Rotar a la izquierda',
            right: 'Rotar a la derecha'
        },
        pt: {
            left: 'Girar à esquerda',
            right: 'Girar à direita'
        }
    };
    
    var t = translations[lang] || translations.en;
    
    var buttonContainer = document.createElement('div');
    buttonContainer.className = 'rotation-controls';
    
    var leftButton = document.createElement('button');
    leftButton.className = 'rotation-btn rotation-btn-left';
    leftButton.innerHTML = '&#8592;';
    leftButton.setAttribute('aria-label', t.left);
    leftButton.type = 'button';
    
    var rightButton = document.createElement('button');
    rightButton.className = 'rotation-btn rotation-btn-right';
    rightButton.innerHTML = '&#8594;';
    rightButton.setAttribute('aria-label', t.right);
    rightButton.type = 'button';
    
    buttonContainer.appendChild(leftButton);
    buttonContainer.appendChild(rightButton);
    document.body.appendChild(buttonContainer);
    
    var totalBlocks = orbitalSystem.blocks.length;
    var rotationStep = 360 / totalBlocks;
    
    leftButton.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        orbitalSystem.targetRotation += rotationStep;
    });
    
    leftButton.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        e.preventDefault();
        orbitalSystem.targetRotation += rotationStep;
    });
    
    rightButton.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        orbitalSystem.targetRotation -= rotationStep;
    });
    
    rightButton.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        e.preventDefault();
        orbitalSystem.targetRotation -= rotationStep;
    });
}

// ============================================
// NAVIGATION HINTS - MULTI-LANGUAGE
// ============================================

function addNavigationHints() {
    var lang = getCurrentLanguage();
    var translations = {
        en: {
            drag: 'Drag to rotate',
            arrows: 'Arrow keys',
            click: 'Click links'
        },
        es: {
            drag: 'Arrastra para rotar',
            arrows: 'Teclas de flecha',
            click: 'Haz clic en enlaces'
        },
        pt: {
            drag: 'Arraste para girar',
            arrows: 'Teclas de seta',
            click: 'Clique nos links'
        }
    };
    
    var t = translations[lang] || translations.en;
    
    var hintContainer = document.createElement('div');
    hintContainer.className = 'navigation-hints';
    hintContainer.innerHTML = '\
        <div class="hint-item">\
            <span class="hint-icon">👆</span>\
            <span class="hint-text">' + t.drag + '</span>\
        </div>\
        <div class="hint-item">\
            <span class="hint-icon">←→</span>\
            <span class="hint-text">' + t.arrows + '</span>\
        </div>\
        <div class="hint-item">\
            <span class="hint-icon">👉</span>\
            <span class="hint-text">' + t.click + '</span>\
        </div>\
    ';
    document.body.appendChild(hintContainer);
    
    setTimeout(function() {
        hintContainer.style.animation = 'hintFadeOut 1s ease-out forwards';
        setTimeout(function() {
            if (hintContainer.parentNode) {
                hintContainer.parentNode.removeChild(hintContainer);
            }
        }, 1000);
    }, 8000);
}

// ============================================
// SETUP NAVIGATION CLICKS
// ============================================

function setupNavigationClicks() {
    setTimeout(function() {
        var allLinks = document.querySelectorAll('.orbital-block a, .orbital-block button');
        
        for (var i = 0; i < allLinks.length; i++) {
            (function(link) {
                link.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
                
                link.addEventListener('touchend', function(e) {
                    e.stopPropagation();
                });
            })(allLinks[i]);
        }
    }, 100);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getCurrentLanguage() {
    var path = window.location.pathname.split('/').pop() || 'index.en.html';
    var match = path.match(/\.(en|es|pt)\.html$/);
    return match ? match[1] : 'en';
}

function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this;
        var args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}