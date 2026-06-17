// Premium High-Fidelity Photorealistic Earth Scene

// 1. Setup Smooth Scrolling (Lenis)
const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

const canvas = document.getElementById('webgl-canvas');
if(canvas) {
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 30); // Start far away

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Groups
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Texture Loader
    const loader = new THREE.TextureLoader();
    const colorMap = loader.load('/images/textures/earth-color.jpg');
    const bumpMap = loader.load('/images/textures/earth-bump.png');
    const specularMap = loader.load('/images/textures/earth-specular.png');
    const cloudsMap = loader.load('/images/textures/earth-clouds.png');

    // 1. Earth Mesh
    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
        map: colorMap,
        bumpMap: bumpMap,
        bumpScale: 0.15,
        roughnessMap: specularMap, // Water is shiny (low roughness), land is matte
        roughness: 0.8,
        metalness: 0.1
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);

    // 2. Cloud Layer Mesh
    const cloudGeometry = new THREE.SphereGeometry(5.1, 64, 64);
    const cloudMaterial = new THREE.MeshStandardMaterial({
        map: cloudsMap,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earthGroup.add(clouds);

    // 3. Atmospheric Glow (Custom Shader Fresnel Effect)
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const atmosphereFragmentShader = `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
      }
    `;
    const atmosphereGeometry = new THREE.SphereGeometry(6, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphere);

    // 4. Starfield (Parallax Deep Space)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i < starCount * 3; i++) {
        starPos[i] = (Math.random() - 0.5) * 200; // Spread massively
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Lighting (Cinematic Sun)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // Very dim ambient
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(10, 5, 5);
    scene.add(sunLight);

    // GSAP ScrollTrigger Cinematic Choreography
    
    // Tilt Earth slightly
    earthGroup.rotation.z = 23.5 * Math.PI / 180;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5 // Extra smooth scrubbing
        }
    });

    // Animate Earth Rotation
    tl.to(earth.rotation, { y: Math.PI * 2, ease: "none" }, 0);
    tl.to(clouds.rotation, { y: Math.PI * 2.5, ease: "none" }, 0); // Clouds move slightly faster
    
    // Animate Starfield flying past the camera
    tl.to(stars.position, { z: 50, ease: "none" }, 0);

    // Camera Dive Journey
    // Step 1: Dive towards Earth
    tl.to(camera.position, {
        z: 8,
        x: -2,
        y: 1,
        ease: "power2.inOut"
    }, 0);

    // Step 2: Pan across the surface for later sections
    tl.to(camera.position, {
        x: 4,
        y: -1,
        z: 6,
        ease: "sine.inOut"
    }, 0.5);

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        // Very slow idle spin
        earth.rotation.y += 0.0005;
        clouds.rotation.y += 0.0007;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
