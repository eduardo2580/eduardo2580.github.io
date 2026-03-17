// ================================================
// GLOBAL STATE & CONFIGURATION
// ================================================
let knowledgeBase = null;

let conversationSystem = {
    isListening: false,
    isSpeaking: false,
    currentLanguage: 'en',
    speechRecognition: null,
    speechSynthesis: null,
    conversationHistory: [],
    currentPage: 'home'
};

// 3D Scene variables
let scene, camera, renderer, ball, particles = [];
let headRotation = { x: 0, y: 0 };
let vrMode = false;
let xrSession = null;

// ================================================
// LOAD KNOWLEDGE BASE FROM JSON
// ================================================
async function loadKnowledgeBase() {
    try {
        const response = await fetch('knowledge.json');
        knowledgeBase = await response.json();
        console.log('Knowledge base loaded successfully');
    } catch (error) {
        console.error('Failed to load knowledge base:', error);
        // Fallback to default responses
        knowledgeBase = {
            en: { greeting: ['Hello!'], unknown: ['I\'m not sure about that.'] },
            es: { greeting: ['¡Hola!'], unknown: ['No estoy seguro.'] },
            pt: { greeting: ['Olá!'], unknown: ['Não tenho certeza.'] }
        };
    }
}

// ================================================
// INITIALIZE 3D CANVAS (SIMPLIFIED)
// ================================================
function initializeCanvas() {
    const canvas = document.getElementById("canvas3d");
    if (!canvas || !window.THREE) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    scene.fog = new THREE.Fog(0x0a0e27, 15, 100);

    // Create camera
    camera = new THREE.PerspectiveCamera(90, viewportWidth / viewportHeight, 0.1, 1000);
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
    renderer.shadowMap.enabled = false;

    // Main ball
    const ballGeometry = new THREE.IcosahedronGeometry(2.2, 3);
    const ballMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff41,
        emissive: 0x00aa00,
        wireframe: false
    });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);

    // Rotating rings
    const ringGeometry = new THREE.TorusGeometry(3.5, 0.15, 16, 64);
    const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0x00d9ff,
        emissive: 0x006699
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);

    const ring2Geometry = new THREE.TorusGeometry(4.2, 0.1, 16, 64);
    const ring2Material = new THREE.MeshPhongMaterial({
        color: 0xff00ff,
        emissive: 0x660099
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.z = Math.PI / 3;
    scene.add(ring2);

    // Lighting
    const mainLight = new THREE.PointLight(0x00ff41, 1.5, 150);
    mainLight.position.set(8, 8, 8);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x00d9ff, 1, 150);
    blueLight.position.set(-8, -6, 8);
    scene.add(blueLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Particle system
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 40;
        positions[i + 1] = (Math.random() - 0.5) * 40;
        positions[i + 2] = (Math.random() - 0.5) * 40;

        const colorChoice = Math.floor(Math.random() * 4);
        if (colorChoice === 0) {
            colors[i] = 0; colors[i + 1] = 1; colors[i + 2] = 0.25;
        } else if (colorChoice === 1) {
            colors[i] = 0; colors[i + 1] = 0.85; colors[i + 2] = 1;
        } else if (colorChoice === 2) {
            colors[i] = 1; colors[i + 1] = 0; colors[i + 2] = 1;
        } else {
            colors[i] = 1; colors[i + 1] = 0.65; colors[i + 2] = 0;
        }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        sizeAttenuation: true,
        opacity: 0.8,
        transparent: true,
        vertexColors: true
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        if (ball) {
            ball.rotation.x += 0.004;
            ball.rotation.y += 0.008;
        }

        if (scene.children[1]) scene.children[1].rotation.x += 0.005;
        if (scene.children[2]) scene.children[2].rotation.z += 0.006;

        if (particles) {
            particles.rotation.x += 0.0003;
            particles.rotation.y += 0.0005;
        }

        // Head tracking
        camera.rotation.order = 'YXZ';
        camera.rotation.y = headRotation.y;
        camera.rotation.x = headRotation.x;

        renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}

// ================================================
// CREATE SVG AVATAR
// ================================================
function createSVGAvatar() {
    const svgContainer = document.getElementById('svg-avatar') || document.createElement('div');
    svgContainer.id = 'svg-avatar';
    svgContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 350px;
        z-index: 5;
        pointer-events: none;
    `;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 280');
    svg.setAttribute('width', '300');
    svg.setAttribute('height', '350');
    svg.style.cssText = 'filter: drop-shadow(0 0 20px rgba(0, 255, 65, 0.6));';

    // Aura circle
    const aura = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    aura.setAttribute('cx', '100');
    aura.setAttribute('cy', '100');
    aura.setAttribute('r', '95');
    aura.setAttribute('fill', 'none');
    aura.setAttribute('stroke', '#00d9ff');
    aura.setAttribute('stroke-width', '1');
    aura.setAttribute('opacity', '0.4');
    aura.style.animation = 'pulse 2s infinite';
    svg.appendChild(aura);

    // Head
    const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    head.setAttribute('cx', '100');
    head.setAttribute('cy', '60');
    head.setAttribute('r', '35');
    head.setAttribute('fill', '#00d9ff');
    head.id = 'avatar-head';
    svg.appendChild(head);

    // Head glow
    const headGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    headGlow.setAttribute('cx', '100');
    headGlow.setAttribute('cy', '60');
    headGlow.setAttribute('r', '35');
    headGlow.setAttribute('fill', 'none');
    headGlow.setAttribute('stroke', '#00ff41');
    headGlow.setAttribute('stroke-width', '1');
    headGlow.setAttribute('opacity', '0.6');
    svg.appendChild(headGlow);

    // Left eye
    const eyeLeft = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eyeLeft.setAttribute('cx', '85');
    eyeLeft.setAttribute('cy', '55');
    eyeLeft.setAttribute('r', '6');
    eyeLeft.setAttribute('fill', '#ff00ff');
    eyeLeft.id = 'avatar-eye-left';
    svg.appendChild(eyeLeft);

    // Right eye
    const eyeRight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eyeRight.setAttribute('cx', '115');
    eyeRight.setAttribute('cy', '55');
    eyeRight.setAttribute('r', '6');
    eyeRight.setAttribute('fill', '#ff00ff');
    eyeRight.id = 'avatar-eye-right';
    svg.appendChild(eyeRight);

    // Mouth
    const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mouth.setAttribute('d', 'M 90 75 Q 100 82 110 75');
    mouth.setAttribute('stroke', '#00ff41');
    mouth.setAttribute('stroke-width', '2');
    mouth.setAttribute('fill', 'none');
    mouth.setAttribute('stroke-linecap', 'round');
    mouth.id = 'avatar-mouth';
    svg.appendChild(mouth);

    // Body
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    body.setAttribute('x', '75');
    body.setAttribute('y', '100');
    body.setAttribute('width', '50');
    body.setAttribute('height', '60');
    body.setAttribute('fill', '#00ff41');
    body.setAttribute('rx', '5');
    svg.appendChild(body);

    // Body glow
    const bodyGlow = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bodyGlow.setAttribute('x', '75');
    bodyGlow.setAttribute('y', '100');
    bodyGlow.setAttribute('width', '50');
    bodyGlow.setAttribute('height', '60');
    bodyGlow.setAttribute('fill', 'none');
    bodyGlow.setAttribute('stroke', '#00d9ff');
    bodyGlow.setAttribute('stroke-width', '1');
    bodyGlow.setAttribute('rx', '5');
    bodyGlow.setAttribute('opacity', '0.5');
    svg.appendChild(bodyGlow);

    // Left arm
    const armLeft = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    armLeft.setAttribute('x', '55');
    armLeft.setAttribute('y', '110');
    armLeft.setAttribute('width', '20');
    armLeft.setAttribute('height', '50');
    armLeft.setAttribute('fill', '#00d9ff');
    armLeft.setAttribute('rx', '10');
    armLeft.id = 'avatar-arm-left';
    svg.appendChild(armLeft);

    // Right arm
    const armRight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    armRight.setAttribute('x', '125');
    armRight.setAttribute('y', '110');
    armRight.setAttribute('width', '20');
    armRight.setAttribute('height', '50');
    armRight.setAttribute('fill', '#00d9ff');
    armRight.setAttribute('rx', '10');
    armRight.id = 'avatar-arm-right';
    svg.appendChild(armRight);

    // Left leg
    const legLeft = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    legLeft.setAttribute('x', '82');
    legLeft.setAttribute('y', '160');
    legLeft.setAttribute('width', '15');
    legLeft.setAttribute('height', '50');
    legLeft.setAttribute('fill', '#00ff41');
    legLeft.setAttribute('rx', '7');
    legLeft.id = 'avatar-leg-left';
    svg.appendChild(legLeft);

    // Right leg
    const legRight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    legRight.setAttribute('x', '103');
    legRight.setAttribute('y', '160');
    legRight.setAttribute('width', '15');
    legRight.setAttribute('height', '50');
    legRight.setAttribute('fill', '#00ff41');
    legRight.setAttribute('rx', '7');
    legRight.id = 'avatar-leg-right';
    svg.appendChild(legRight);

    svg.innerHTML += `
        <style>
            @keyframes pulse {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 0.8; }
            }
            @keyframes bob {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            @keyframes wave {
                0%, 100% { transform-origin: 125px 110px; transform: rotate(0deg); }
                25% { transform-origin: 125px 110px; transform: rotate(-30deg); }
                75% { transform-origin: 125px 110px; transform: rotate(30deg); }
            }
            #svg-avatar {
                animation: bob 3s ease-in-out infinite;
            }
            #avatar-arm-right.speaking {
                animation: wave 0.5s ease-in-out infinite;
            }
        </style>
    `;

    svgContainer.innerHTML = '';
    svgContainer.appendChild(svg);
    document.body.appendChild(svgContainer);
}

// ================================================
// CREATE SVG-BASED CHAT INTERFACE (PRIMARY FOCUS)
// ================================================
function createChatInterface() {
    const chatContainer = document.getElementById('chat-container') || document.createElement('div');
    chatContainer.id = 'chat-container';
    chatContainer.style.cssText = `
        position: fixed;
        bottom: 40px;
        right: 40px;
        width: 380px;
        height: 500px;
        background: linear-gradient(135deg, rgba(10, 14, 39, 0.98) 0, rgba(5, 8, 25, 0.99) 100%);
        border: 2px solid #00ff41;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        z-index: 10002;
        box-shadow: 0 0 40px rgba(0, 255, 65, 0.6);
        backdrop-filter: blur(20px);
        font-family: "EB Garamond", serif;
        overflow: hidden;
    `;

    // Header with SVG accent
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 15px;
        border-bottom: 2px solid rgba(0, 255, 65, 0.3);
        background: rgba(0, 255, 65, 0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    header.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <svg width="20" height="20" viewBox="0 0 20 20" style="fill: #00ff41;">
                <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
                <circle cx="10" cy="10" r="4" fill="currentColor"/>
            </svg>
            <span style="color: #00ff41; font-weight: bold;">Eduardo's AI</span>
        </div>
    `;

    // Messages area
    const messagesArea = document.createElement('div');
    messagesArea.id = 'chat-messages';
    messagesArea.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        color: #00ff41;
        font-size: 0.95rem;
        line-height: 1.7;
        background: rgba(0, 0, 0, 0.3);
    `;

    // Input area
    const inputArea = document.createElement('div');
    inputArea.style.cssText = `
        padding: 12px;
        border-top: 1px solid rgba(0, 255, 65, 0.3);
        display: flex;
        gap: 8px;
        background: rgba(0, 0, 0, 0.5);
    `;

    // Text input
    const textInput = document.createElement('input');
    textInput.id = 'chat-input';
    textInput.type = 'text';
    textInput.placeholder = 'Ask me something...';
    textInput.style.cssText = `
        flex: 1;
        background: rgba(0, 255, 65, 0.08);
        border: 1px solid #00d9ff;
        color: #00ff41;
        padding: 10px;
        border-radius: 6px;
        font-family: "EB Garamond", serif;
        outline: none;
        font-size: 0.95rem;
        transition: all 0.2s;
    `;

    textInput.addEventListener('focus', () => {
        textInput.style.border = '1px solid #00ff41';
        textInput.style.boxShadow = '0 0 10px rgba(0, 255, 65, 0.3)';
    });

    textInput.addEventListener('blur', () => {
        textInput.style.border = '1px solid #00d9ff';
        textInput.style.boxShadow = 'none';
    });

    // Send button
    const sendButton = document.createElement('button');
    sendButton.innerHTML = '↗';
    sendButton.style.cssText = `
        background: linear-gradient(135deg, rgba(0, 255, 65, 0.3), rgba(0, 217, 255, 0.3));
        border: 1px solid #00ff41;
        color: #00ff41;
        padding: 10px 15px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.2s;
        font-weight: bold;
    `;

    sendButton.addEventListener('mouseenter', () => {
        sendButton.style.background = 'linear-gradient(135deg, rgba(0, 255, 65, 0.5), rgba(0, 217, 255, 0.5))';
        sendButton.style.boxShadow = '0 0 15px rgba(0, 255, 65, 0.5)';
    });

    sendButton.addEventListener('mouseleave', () => {
        sendButton.style.background = 'linear-gradient(135deg, rgba(0, 255, 65, 0.3), rgba(0, 217, 255, 0.3))';
        sendButton.style.boxShadow = 'none';
    });

    // Microphone button
    const micButton = document.createElement('button');
    micButton.innerHTML = '🎤';
    micButton.style.cssText = `
        background: rgba(0, 255, 65, 0.2);
        border: 1px solid #00ff41;
        color: #00ff41;
        padding: 10px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
    `;

    // Language selector area
    const langArea = document.createElement('div');
    langArea.style.cssText = `
        padding: 10px;
        border-top: 1px solid rgba(0, 255, 65, 0.3);
        display: flex;
        gap: 6px;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
    `;

    ['EN', 'ES', 'PT'].forEach((lang, idx) => {
        const btn = document.createElement('button');
        btn.innerHTML = lang;
        btn.style.cssText = `
            padding: 6px 14px;
            background: ${idx === 0 ? 'rgba(0, 255, 65, 0.4)' : 'rgba(0, 255, 65, 0.1)'};
            border: 1px solid #00ff41;
            color: #00ff41;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.2s;
            font-weight: bold;
        `;

        btn.addEventListener('click', () => {
            conversationSystem.currentLanguage = lang.toLowerCase();
            document.querySelectorAll('#lang-toggle button').forEach(b => {
                b.style.background = 'rgba(0, 255, 65, 0.1)';
            });
            btn.style.background = 'rgba(0, 255, 65, 0.4)';
        });

        btn.addEventListener('mouseenter', () => {
            if (lang.toLowerCase() !== conversationSystem.currentLanguage) {
                btn.style.background = 'rgba(0, 255, 65, 0.2)';
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (lang.toLowerCase() !== conversationSystem.currentLanguage) {
                btn.style.background = 'rgba(0, 255, 65, 0.1)';
            }
        });

        langArea.appendChild(btn);
    });
    langArea.id = 'lang-toggle';

    // Assemble chat interface
    inputArea.appendChild(textInput);
    inputArea.appendChild(micButton);
    inputArea.appendChild(sendButton);

    chatContainer.appendChild(header);
    chatContainer.appendChild(messagesArea);
    chatContainer.appendChild(inputArea);
    chatContainer.appendChild(langArea);

    document.body.appendChild(chatContainer);

    // Event listeners
    sendButton.addEventListener('click', () => {
        const message = textInput.value.trim();
        if (message) {
            handleUserInput(message);
            textInput.value = '';
        }
    });

    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    micButton.addEventListener('click', () => {
        if (!conversationSystem.speechRecognition) {
            alert('Speech Recognition not supported in your browser');
            return;
        }

        if (conversationSystem.isListening) {
            conversationSystem.speechRecognition.stop();
            micButton.style.background = 'rgba(0, 255, 65, 0.2)';
        } else {
            const langMap = {
                'en': 'en-US',
                'es': 'es-ES',
                'pt': 'pt-BR'
            };
            conversationSystem.speechRecognition.lang = langMap[conversationSystem.currentLanguage] || 'en-US';
            conversationSystem.speechRecognition.start();
            micButton.style.background = 'rgba(255, 0, 0, 0.4)';
        }
    });
}

// ================================================
// SELECT APPROPRIATE RESPONSE FROM KNOWLEDGE BASE
// ================================================
function selectResponse(userMessage, lang) {
    if (!knowledgeBase || !knowledgeBase[lang]) {
        return 'I did not understand that. Could you ask something else?';
    }

    const knowledge = knowledgeBase[lang];
    const message = userMessage.toLowerCase();

    // Keyword matching for response categories
    const categories = {
        portfolio: ['portfolio', 'about', 'quien', 'quem', 'who'],
        projects: ['project', 'trabajo', 'projetos', 'work', 'build', 'built'],
        technologies: ['technolog', 'skill', 'habilidad', 'tecnología', 'stack', 'language'],
        contact: ['contact', 'reach', 'contacto', 'email', 'mail', 'phone', 'social'],
        experience: ['experience', 'experien', 'background', 'background'],
        education: ['education', 'educación', 'estudio', 'learn', 'course', 'certification'],
        greeting: ['hello', 'hi', 'hola', 'oi', 'olá', 'hey']
    };

    for (const [category, keywords] of Object.entries(categories)) {
        for (const keyword of keywords) {
            if (message.includes(keyword) && knowledge[category]) {
                const responses = knowledge[category];
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
    }

    // Default unknown response
    if (knowledge.unknown) {
        return knowledge.unknown[Math.floor(Math.random() * knowledge.unknown.length)];
    }

    return 'That\'s interesting! Feel free to ask about Eduardo\'s projects and skills.';
}

// ================================================
// INITIALIZE SPEECH RECOGNITION & SYNTHESIS
// ================================================
function initializeSpeechSystem() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;

    if (SpeechRecognition) {
        conversationSystem.speechRecognition = new SpeechRecognition();
        conversationSystem.speechRecognition.continuous = false;
        conversationSystem.speechRecognition.interimResults = true;

        conversationSystem.speechRecognition.onstart = () => {
            conversationSystem.isListening = true;
        };

        conversationSystem.speechRecognition.onend = () => {
            conversationSystem.isListening = false;
        };

        conversationSystem.speechRecognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }

            if (event.results[event.results.length - 1].isFinal && transcript.trim()) {
                handleUserInput(transcript);
            }
        };

        conversationSystem.speechRecognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };
    }

    conversationSystem.speechSynthesis = SpeechSynthesis;
}

// ================================================
// DISPLAY CHAT MESSAGE
// ================================================
function displayChatMessage(message, sender) {
    const messagesArea = document.getElementById('chat-messages');
    if (!messagesArea) return;

    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        margin-bottom: 12px;
        padding: 10px;
        border-radius: 8px;
        background: ${sender === 'user' ? 'rgba(0, 217, 255, 0.12)' : 'rgba(0, 255, 65, 0.12)'};
        border-left: 3px solid ${sender === 'user' ? '#00d9ff' : '#00ff41'};
        animation: slideIn 0.3s ease;
    `;
    
    const displayName = sender === 'user' ? 'You' : 'Eduardo\'s AI';
    messageDiv.innerHTML = `<strong style="color: ${sender === 'user' ? '#00d9ff' : '#00ff41'}">${displayName}:</strong> ${message}`;
    messagesArea.appendChild(messageDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// ================================================
// HANDLE USER INPUT & GENERATE RESPONSE
// ================================================
function handleUserInput(userMessage) {
    const lang = conversationSystem.currentLanguage;
    const response = selectResponse(userMessage.toLowerCase(), lang);

    // Add to conversation history
    conversationSystem.conversationHistory.push({
        user: userMessage,
        avatar: response,
        timestamp: Date.now()
    });

    // Save history
    saveConversationHistory();

    // Display in chat
    displayChatMessage(userMessage, 'user');
    speakResponse(response, lang);
}

// ================================================
// SPEAK AVATAR RESPONSE
// ================================================
function speakResponse(text, lang) {
    if (!conversationSystem.speechSynthesis) {
        displayChatMessage(text, 'avatar');
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.language = lang === 'es' ? 'es-ES' : lang === 'pt' ? 'pt-BR' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
        conversationSystem.isSpeaking = true;
        const armRight = document.getElementById('avatar-arm-right');
        if (armRight) {
            armRight.classList.add('speaking');
        }
    };

    utterance.onend = () => {
        conversationSystem.isSpeaking = false;
        const armRight = document.getElementById('avatar-arm-right');
        if (armRight) {
            armRight.classList.remove('speaking');
        }
    };

    window.speechSynthesis.speak(utterance);
    displayChatMessage(text, 'avatar');
}

// ================================================
// SAVE & LOAD CONVERSATION HISTORY
// ================================================
function saveConversationHistory() {
    try {
        const history = conversationSystem.conversationHistory.slice(-20);
        localStorage.setItem('eduardo_chat_history', JSON.stringify(history));
    } catch (e) {
        console.error('Failed to save conversation history:', e);
    }
}

function loadConversationHistory() {
    try {
        const saved = localStorage.getItem('eduardo_chat_history');
        if (saved) {
            conversationSystem.conversationHistory = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load conversation history:', e);
    }
}

// ================================================
// HEAD TRACKING (DESKTOP & MOBILE)
// ================================================
function setupHeadTracking() {
    document.addEventListener('mousemove', (e) => {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        const moveX = (e.clientX - x) / x;
        const moveY = (e.clientY - y) / y;

        headRotation.y = moveX * 0.5;
        headRotation.x = moveY * 0.3;
    });

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (event) => {
            const alpha = THREE.MathUtils.degToRad(event.alpha);
            const beta = THREE.MathUtils.degToRad(event.beta);
            const gamma = THREE.MathUtils.degToRad(event.gamma);

            if (document.fullscreenElement) {
                headRotation.x = beta * 0.5;
                headRotation.y = gamma * 0.5;
            }
        });
    }
}
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
document.addEventListener("DOMContentLoaded", async () => {
    document.body.classList.add("js-enabled");

    // Add glitch overlay
    const glitchOverlay = document.querySelector('.glitch-overlay') || document.createElement("div");
    if (!glitchOverlay.classList.contains('glitch-overlay')) {
        glitchOverlay.className = "glitch-overlay";
        document.body.appendChild(glitchOverlay);
    }

    // Load knowledge base from JSON
    await loadKnowledgeBase();

    // Initialize 3D scene
    initializeCanvas();

    // Create SVG Avatar
    createSVGAvatar();

    // Create SVG Chat Interface
    createChatInterface();

    // Setup head tracking
    setupHeadTracking();

    // Initialize speech system
    initializeSpeechSystem();

    // Load previous conversation history from localStorage
    loadConversationHistory();
    
    // Restore previous messages to chat
    conversationSystem.conversationHistory.forEach((msg) => {
        if (msg.user) displayChatMessage(msg.user, 'user');
        if (msg.avatar) displayChatMessage(msg.avatar, 'avatar');
    });
    
    // Add greeting message if no history
    if (conversationSystem.conversationHistory.length === 0) {
        setTimeout(() => {
            const lang = conversationSystem.currentLanguage;
            if (knowledgeBase && knowledgeBase[lang] && knowledgeBase[lang].greeting) {
                const greeting = knowledgeBase[lang].greeting[0];
                displayChatMessage(greeting, 'avatar');
            }
        }, 1000);
    }

    // Event listeners
    window.addEventListener("resize", debounce(handleResize, 300));
    
    console.log('✓ Eduardo\'s Cyberpunk AI Portfolio loaded successfully!');
});