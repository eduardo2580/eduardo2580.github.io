// ================================================
// BROWSER SUPPORT DETECTION
// ================================================
const BrowserSupport = {
    supportsWebGL: function() {
        try {
            const canvas = document.createElement("canvas");
            return !!(
                window.WebGLRenderingContext &&
                (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
            );
        } catch (e) {
            return false;
        }
    }
};

// ================================================
// GLOBAL VARIABLES
// ================================================
let scene, camera, renderer, ball, particles = [];

let orbitalSystem = {
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
    animationId: null,
    focusedIndex: 0
};

let animationFrameId = null;

// ================================================
// RESPONSIVE DISTANCE CALCULATION
// ================================================
function getResponsiveDistance() {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // Mobile - larger orbit from bottom-right corner
    if (viewportWidth < 576) {
        // Calculate distance so blocks rotate in/out of screen from corner
        const diagonal = Math.sqrt(viewportWidth * viewportWidth + viewportHeight * viewportHeight);
        return diagonal * 0.65; // Large radius for dramatic rotation effect
    }
    // Tablet
    else if (viewportWidth < 1024) {
        const minDimension = Math.min(viewportWidth, viewportHeight);
        return Math.max(minDimension * 0.48, 200);
    }
    // Desktop
    else {
        const minDimension = Math.min(viewportWidth, viewportHeight);
        return Math.max(minDimension * 0.52, 280);
    }
}

// ================================================
// GET ORBIT CENTER FOR MOBILE
// ================================================
function getOrbitCenter() {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const isMobile = viewportWidth < 576;

    if (isMobile) {
        // Bottom-right corner - orbit center outside viewport
        return {
            x: viewportWidth + 100,
            y: viewportHeight + 100
        };
    } else {
        // Center of screen for desktop/tablet
        return {
            x: viewportWidth / 2,
            y: viewportHeight / 2
        };
    }
}

// ================================================
// INITIALIZE 3D CANVAS WITH THREE.JS
// ================================================
function initializeCanvas() {
    const canvas = document.getElementById("canvas3d");

    if (!canvas || !window.THREE || !BrowserSupport.supportsWebGL()) {
        document.body.classList.add("no-webgl");
        console.warn("WebGL not supported - using fallback mode");
        return;
    }

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(75, viewportWidth / viewportHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(viewportWidth, viewportHeight);
    renderer.setClearColor(0x0a0e27, 0.1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create main ball (icosahedron)
    const ballGeometry = new THREE.IcosahedronGeometry(2.2, 5);
    const ballMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff41,
        emissive: 0x00aa00,
        wireframe: false,
        shininess: 120,
        specular: 0x00ff41
    });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);

    // Add lights
    const mainLight = new THREE.PointLight(0x00ff41, 1.2, 100);
    mainLight.position.set(6, 6, 6);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x00d9ff, 0.7, 100);
    blueLight.position.set(-6, -4, 6);
    scene.add(blueLight);

    const magentaLight = new THREE.PointLight(0xff00ff, 0.4, 80);
    magentaLight.position.set(0, -6, 4);
    scene.add(magentaLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    // Create particle system
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 25;
        positions[i + 1] = (Math.random() - 0.5) * 25;
        positions[i + 2] = (Math.random() - 0.5) * 25;

        const colorChoice = Math.floor(Math.random() * 3);
        if (colorChoice === 0) {
            colors[i] = 0;
            colors[i + 1] = 1;
            colors[i + 2] = 0.25;
        } else if (colorChoice === 1) {
            colors[i] = 0;
            colors[i + 1] = 0.85;
            colors[i + 2] = 1;
        } else {
            colors[i] = 1;
            colors[i + 1] = 0;
            colors[i + 2] = 1;
        }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.12,
        sizeAttenuation: true,
        opacity: 0.7,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Start animation loop
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

// ================================================
// HANDLE WINDOW RESIZE
// ================================================
function handleResize() {
    if (renderer && camera) {
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        camera.aspect = viewportWidth / viewportHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(viewportWidth, viewportHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    orbitalSystem.distance = getResponsiveDistance();
    updateOrbitalPositions();
}

// ================================================
// INITIALIZE ORBITAL SYSTEM
// ================================================
function initializeOrbitalSystem() {
    orbitalSystem.distance = getResponsiveDistance();

    const allElements = document.querySelectorAll("header, section, footer");
    const visibleElements = [];

    for (let i = 0; i < allElements.length; i++) {
        if (allElements[i] && allElements[i].offsetParent !== null) {
            visibleElements.push(allElements[i]);
        }
    }

    for (let i = 0; i < visibleElements.length; i++) {
        const element = visibleElements[i];
        const angle = (360 / visibleElements.length) * i;

        element.classList.add("orbital-block");
        element.style.position = "fixed";

        const maxWidth = window.innerWidth < 576 ? "85vw" : 
                        window.innerWidth < 1024 ? "320px" : "380px";
        element.style.maxWidth = maxWidth;

        orbitalSystem.blocks.push({
            element: element,
            angle: angle,
            originalAngle: angle,
            index: i
        });
    }

    updateOrbitalPositions();
}

// ================================================
// CHECK IF ELEMENT IS INTERACTIVE
// ================================================
function isInteractiveElement(target) {
    if (!target) return false;

    const tagName = target.tagName ? target.tagName.toLowerCase() : "";
    if (["a", "button", "input", "select", "textarea"].includes(tagName)) {
        return true;
    }

    let parent = target.parentElement;
    while (parent) {
        const parentTag = parent.tagName ? parent.tagName.toLowerCase() : "";
        if (["a", "button"].includes(parentTag)) {
            return true;
        }

        if (parent.classList && (
            parent.classList.contains("rotation-btn") ||
            parent.classList.contains("lang-btn") ||
            parent.classList.contains("nav-link") ||
            parent.classList.contains("nav-item") ||
            parent.classList.contains("cta-button") ||
            parent.classList.contains("cta-link") ||
            parent.classList.contains("social-btn")
        )) {
            return true;
        }

        parent = parent.parentElement;
    }

    return false;
}

// ================================================
// MOUSE EVENT HANDLERS
// ================================================
function handleMouseDown(e) {
    if (isInteractiveElement(e.target)) return;

    orbitalSystem.isDragging = true;
    orbitalSystem.lastMouseX = e.clientX;
    orbitalSystem.lastMouseY = e.clientY;
    orbitalSystem.velocity = 0;
    document.body.style.cursor = "grabbing";
}

function handleMouseMove(e) {
    if (!orbitalSystem.isDragging) return;

    const deltaX = e.clientX - orbitalSystem.lastMouseX;
    const deltaY = e.clientY - orbitalSystem.lastMouseY;
    const delta = deltaX - (deltaY * 0.5);

    orbitalSystem.targetRotation += delta * 0.9;
    orbitalSystem.velocity = delta * 0.9;
    orbitalSystem.lastMouseX = e.clientX;
    orbitalSystem.lastMouseY = e.clientY;
}

function handleMouseUp() {
    orbitalSystem.isDragging = false;
    document.body.style.cursor = "default";
}

// ================================================
// TOUCH EVENT HANDLERS
// ================================================
function handleTouchStart(e) {
    if (e.touches.length === 0) return;
    if (isInteractiveElement(e.target)) return;

    e.preventDefault();
    orbitalSystem.isDragging = true;
    orbitalSystem.lastTouchX = e.touches[0].clientX;
    orbitalSystem.lastTouchY = e.touches[0].clientY;
    orbitalSystem.velocity = 0;
}

function handleTouchMove(e) {
    if (!orbitalSystem.isDragging || e.touches.length === 0) return;

    e.preventDefault();

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const centerX = (window.innerWidth || document.documentElement.clientWidth) / 2;
    const centerY = (window.innerHeight || document.documentElement.clientHeight) / 2;

    const currentAngle = Math.atan2(touchY - centerY, touchX - centerX) * (180 / Math.PI);
    const lastAngle = Math.atan2(
        orbitalSystem.lastTouchY - centerY,
        orbitalSystem.lastTouchX - centerX
    ) * (180 / Math.PI);

    let angleDelta = currentAngle - lastAngle;

    if (angleDelta > 180) angleDelta -= 360;
    if (angleDelta < -180) angleDelta += 360;

    const delta = angleDelta * 2.2;
    orbitalSystem.targetRotation += delta;
    orbitalSystem.velocity = delta;
    orbitalSystem.lastTouchX = touchX;
    orbitalSystem.lastTouchY = touchY;
}

function handleTouchEnd(e) {
    if (isInteractiveElement(e.target)) return;

    e.preventDefault();
    orbitalSystem.isDragging = false;

    if (Math.abs(orbitalSystem.velocity) > 0.5) {
        applyMomentum();
    }
}

// ================================================
// APPLY MOMENTUM AFTER TOUCH/DRAG
// ================================================
function applyMomentum() {
    const momentumInterval = setInterval(() => {
        orbitalSystem.velocity *= 0.94;
        orbitalSystem.targetRotation += orbitalSystem.velocity;

        if (Math.abs(orbitalSystem.velocity) < 0.1) {
            clearInterval(momentumInterval);
        }
    }, 16);
}

// ================================================
// KEYBOARD NAVIGATION
// ================================================
function handleKeyNavigation(e) {
    const isMobile = window.innerWidth < 576;
    const angleStep = 360 / orbitalSystem.blocks.length;

    // Right Arrow or Down Arrow
    if (e.keyCode === 39 || e.keyCode === 40) {
        e.preventDefault();
        if (isMobile) {
            rotateToNextBlock(1);
        } else {
            orbitalSystem.targetRotation -= angleStep;
        }
    }
    // Left Arrow or Up Arrow
    else if (e.keyCode === 37 || e.keyCode === 38) {
        e.preventDefault();
        if (isMobile) {
            rotateToNextBlock(-1);
        } else {
            orbitalSystem.targetRotation += angleStep;
        }
    }
}

// ================================================
// ROTATE TO NEXT BLOCK (MOBILE)
// ================================================
function rotateToNextBlock(direction) {
    const totalBlocks = orbitalSystem.blocks.length;
    orbitalSystem.focusedIndex = (orbitalSystem.focusedIndex + direction + totalBlocks) % totalBlocks;
    
    const angleStep = 360 / totalBlocks;
    
    // Smooth rotation instead of instant snap
    if (direction > 0) {
        orbitalSystem.targetRotation -= angleStep;
    } else {
        orbitalSystem.targetRotation += angleStep;
    }
}

// ================================================
// UPDATE ORBITAL POSITIONS
// ================================================
function updateOrbitalPositions() {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const isMobile = viewportWidth < 576;
    
    const center = getOrbitCenter();
    const centerX = center.x;
    const centerY = center.y;

    orbitalSystem.currentRotation += (orbitalSystem.targetRotation - orbitalSystem.currentRotation) * 0.12;

    let closestIndex = 0;
    let smallestAngleDiff = Infinity;

    for (let i = 0; i < orbitalSystem.blocks.length; i++) {
        const block = orbitalSystem.blocks[i];
        const currentAngle = block.originalAngle + orbitalSystem.currentRotation;
        const radians = (currentAngle * Math.PI) / 180;

        const x = centerX + orbitalSystem.distance * Math.cos(radians);
        const y = centerY + orbitalSystem.distance * Math.sin(radians);

        const normalizedAngle = ((currentAngle % 360) + 360) % 360;
        
        let angleDiff;
        let targetAngle;
        
        if (isMobile) {
            // On mobile, focus on block at upper-left (around 225 degrees from bottom-right)
            targetAngle = 225;
        } else {
            // On desktop, focus on left side
            targetAngle = 180;
        }
        
        angleDiff = Math.min(
            Math.abs(normalizedAngle - targetAngle),
            360 - Math.abs(normalizedAngle - targetAngle)
        );

        const zIndex = Math.floor(1000 - angleDiff);

        if (angleDiff < smallestAngleDiff) {
            smallestAngleDiff = angleDiff;
            closestIndex = i;
        }

        // Position all blocks in orbital pattern
        block.element.style.left = x + "px";
        block.element.style.top = y + "px";
        block.element.style.zIndex = zIndex;
        block.element.style.transform = "translate(-50%, -50%) scale(1)";

        // Calculate opacity based on position - same for mobile and desktop
        const opacity = 0.3 + (0.7 * (1 - angleDiff / 180));
        block.element.style.opacity = opacity;

        // Remove focus class
        if (block.element.classList) {
            block.element.classList.remove("orbital-focus");
        } else {
            block.element.className = block.element.className.replace(/\borbital-focus\b/g, "");
        }
    }

    // Add focus class to closest block
    if (orbitalSystem.blocks[closestIndex]) {
        const focusedBlock = orbitalSystem.blocks[closestIndex].element;

        focusedBlock.style.opacity = "1";
        focusedBlock.style.zIndex = "2500";
        
        // On mobile, override position to center the focused block
        if (isMobile) {
            focusedBlock.style.left = (viewportWidth / 2) + "px";
            focusedBlock.style.top = (viewportHeight / 2) + "px";
        }

        if (focusedBlock.classList) {
            focusedBlock.classList.add("orbital-focus");
        } else {
            focusedBlock.className += " orbital-focus";
        }

        orbitalSystem.focusedIndex = closestIndex;
    }
}

// ================================================
// START ORBITAL ANIMATION LOOP
// ================================================
function startOrbitalAnimation() {
    function animateOrbit() {
        updateOrbitalPositions();
        animationFrameId = requestAnimationFrame(animateOrbit);
    }
    animateOrbit();
}

// ================================================
// ADD NAVIGATION BUTTONS
// ================================================
function addNavigationButtons() {
    const translations = {
        en: { left: "Rotate Left", right: "Rotate Right" },
        es: { left: "Rotar a la izquierda", right: "Rotar a la derecha" },
        pt: { left: "Girar à esquerda", right: "Girar à direita" }
    };

    const lang = getCurrentLanguage();
    const labels = translations[lang] || translations.en;

    const controlsContainer = document.createElement("div");
    controlsContainer.className = "rotation-controls";

    const leftButton = document.createElement("button");
    leftButton.className = "rotation-btn rotation-btn-left";
    leftButton.innerHTML = "&#8592;";
    leftButton.setAttribute("aria-label", labels.left);
    leftButton.type = "button";

    const rightButton = document.createElement("button");
    rightButton.className = "rotation-btn rotation-btn-right";
    rightButton.innerHTML = "&#8594;";
    rightButton.setAttribute("aria-label", labels.right);
    rightButton.type = "button";

    controlsContainer.appendChild(leftButton);
    controlsContainer.appendChild(rightButton);
    document.body.appendChild(controlsContainer);

    const isMobile = window.innerWidth < 576;
    const angleStep = 360 / orbitalSystem.blocks.length;

    // Left button
    leftButton.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        if (isMobile) {
            rotateToNextBlock(-1);
        } else {
            orbitalSystem.targetRotation += angleStep;
        }
    });

    leftButton.addEventListener("touchstart", (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isMobile) {
            rotateToNextBlock(-1);
        } else {
            orbitalSystem.targetRotation += angleStep;
        }
    });

    // Right button
    rightButton.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        if (isMobile) {
            rotateToNextBlock(1);
        } else {
            orbitalSystem.targetRotation -= angleStep;
        }
    });

    rightButton.addEventListener("touchstart", (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isMobile) {
            rotateToNextBlock(1);
        } else {
            orbitalSystem.targetRotation -= angleStep;
        }
    });
}

// ================================================
// ADD NAVIGATION HINTS
// ================================================
function addNavigationHints() {
    const translations = {
        en: { drag: "Drag to rotate", arrows: "Arrow keys", click: "Click links" },
        es: { drag: "Arrastra para rotar", arrows: "Teclas de flecha", click: "Haz clic en enlaces" },
        pt: { drag: "Arraste para girar", arrows: "Teclas de seta", click: "Clique nos links" }
    };

    const lang = getCurrentLanguage();
    const hints = translations[lang] || translations.en;

    const hintsContainer = document.createElement("div");
    hintsContainer.className = "navigation-hints";
    hintsContainer.innerHTML = `
        <div class="hint-item">
            <span class="hint-icon">👆</span>
            <span class="hint-text">${hints.drag}</span>
        </div>
        <div class="hint-item">
            <span class="hint-icon">←→</span>
            <span class="hint-text">${hints.arrows}</span>
        </div>
        <div class="hint-item">
            <span class="hint-icon">👉</span>
            <span class="hint-text">${hints.click}</span>
        </div>
    `;

    document.body.appendChild(hintsContainer);

    setTimeout(() => {
        hintsContainer.style.animation = "hintFadeOut 1s ease-out forwards";
        setTimeout(() => {
            if (hintsContainer.parentNode) {
                hintsContainer.parentNode.removeChild(hintsContainer);
            }
        }, 1000);
    }, 8000);
}

// ================================================
// SETUP NAVIGATION CLICKS
// ================================================
function setupNavigationClicks() {
    setTimeout(() => {
        const interactiveElements = document.querySelectorAll(".orbital-block a, .orbital-block button");

        for (let i = 0; i < interactiveElements.length; i++) {
            const element = interactiveElements[i];

            element.addEventListener("click", (e) => {
                e.stopPropagation();
            });

            element.addEventListener("touchend", (e) => {
                e.stopPropagation();
            });
        }
    }, 100);
}

// ================================================
// GET CURRENT LANGUAGE
// ================================================
function getCurrentLanguage() {
    const path = window.location.pathname;
    const filename = path.split("/").pop() || "index.en.html";
    const match = filename.match(/\.(en|es|pt)\.html$/);
    return match ? match[1] : "en";
}

// ================================================
// DEBOUNCE UTILITY
// ================================================
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// ================================================
// REQUEST ANIMATION FRAME POLYFILL
// ================================================
(function() {
    let lastTime = 0;
    const vendors = ["webkit", "moz"];

    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] ||
                                      window[vendors[x] + "CancelRequestAnimationFrame"];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(() => {
                callback(currTime + timeToCall);
            }, timeToCall);
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

// ================================================
// INITIALIZE ON DOM READY
// ================================================
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("js-enabled");

    // Add glitch overlay
    const glitchOverlay = document.createElement("div");
    glitchOverlay.className = "glitch-overlay";
    document.body.appendChild(glitchOverlay);

    // Initialize everything
    initializeCanvas();
    initializeOrbitalSystem();
    addNavigationButtons();
    addNavigationHints();
    setupNavigationClicks();

    // Event listeners
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseUp);

    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    document.addEventListener("wheel", (e) => {
        e.preventDefault();
    }, { passive: false });

    window.addEventListener("resize", debounce(handleResize, 300));
    window.addEventListener("keydown", handleKeyNavigation);

    startOrbitalAnimation();
});