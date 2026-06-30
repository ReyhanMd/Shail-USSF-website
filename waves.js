/**
 * Perlin Noise Generator
 * This is a standard implementation of Perlin noise, used for the wave effect.
 */
class Noise {
    constructor(seed) {
        this.p = new Uint8Array(512);
        this.seed = seed > 0 && seed < 1 ? seed : Math.random();
        this.grad3 = [
            [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
            [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
            [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
        ];
        this.init(this.seed);
    }

    init(seed) {
        let i, j, k;
        let p = new Uint8Array(256);
        for (i = 0; i < 256; i++) {
            p[i] = i;
        }
        for (i = 0; i < 256; i++) {
            j = Math.floor(seed * (i + 1)) % 256;
            k = p[i];
            p[i] = p[j];
            p[j] = k;
        }
        for (i = 0; i < 512; i++) {
            this.p[i] = p[i & 255];
        }
    }

    dot(g, x, y) {
        return g[0] * x + g[1] * y;
    }

    perlin2(x, y) {
        let X = Math.floor(x) & 255;
        let Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        let fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
        let u = fade(x);
        let v = fade(y);
        let p = this.p;
        let grad3 = this.grad3;
        let n00 = this.dot(grad3[p[X + p[Y]] % 12], x, y);
        let n01 = this.dot(grad3[p[X + p[Y + 1]] % 12], x, y - 1);
        let n10 = this.dot(grad3[p[X + 1 + p[Y]] % 12], x - 1, y);
        let n11 = this.dot(grad3[p[X + 1 + p[Y + 1]] % 12], x - 1, y - 1);
        let lerp = (a, b, x) => a + x * (b - a);
        return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v);
    }
}

const animationConfig = {
    GRID_X_GAP: 10,
    GRID_Y_GAP: 32,
    GRID_WIDTH_OFFSET: 200,
    GRID_HEIGHT_OFFSET: 30,
    WAVE_TIME_X_FACTOR: 0.0125,
    WAVE_NOISE_X_FACTOR: 0.002,
    WAVE_TIME_Y_FACTOR: 0.005,
    WAVE_NOISE_Y_FACTOR: 0.0015,
    WAVE_NOISE_MAGNITUDE: 12,
    WAVE_AMPLITUDE_X: 32,
    WAVE_AMPLITUDE_Y: 16,
    MOUSE_INFLUENCE_RADIUS: 175,
    MOUSE_FALLOFF_FACTOR: 0.001,
    MOUSE_FORCE_FACTOR: 0.00065,
    MOUSE_SMOOTHING_FACTOR: 0.1,
    MAX_MOUSE_VELOCITY: 100,
    TENSION_STRENGTH: 0.005, 
    FRICTION: 0.925, 
    CURSOR_DISPLACEMENT_STRENGTH: 2,
    MAX_CURSOR_DISPLACEMENT: 100,
};

function initWaves() {
    const container = document.createElement('div');
    container.className = 'waves-container';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '0'; // Place behind everything
    container.style.pointerEvents = 'none'; // Allow clicks to pass through
    container.style.overflow = 'hidden';
    
    // We want the background behind the waves to just be transparent so the page background shows
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    document.body.insertBefore(container, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    
    const state = {
        ctx,
        mouse: { x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false },
        lines: [],
        noise: new Noise(Math.random()),
        bounding: null,
        animationFrameId: null,
        lineColor: 'rgba(0, 0, 0, 0.15)', // Darkened another 5%
    };

    const moved = (point, withCursorForce = true) => {
        const coords = {
            x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
            y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0)
        };
        coords.x = Math.round(coords.x * 10) / 10;
        coords.y = Math.round(coords.y * 10) / 10;
        return coords;
    };

    const setSize = () => {
        // Measure the full document height to cover the entire page
        const width = document.documentElement.scrollWidth;
        const height = document.documentElement.scrollHeight;
        
        container.style.width = width + 'px';
        container.style.height = height + 'px';
        
        state.bounding = { left: 0, top: 0, width, height };
        canvas.width = width;
        canvas.height = height;
    };

    const setLines = () => {
        if (!state.bounding) return;
        const { width, height } = state.bounding;
        state.lines = [];
        const { GRID_X_GAP, GRID_Y_GAP, GRID_WIDTH_OFFSET, GRID_HEIGHT_OFFSET } = animationConfig;

        const oWidth = width + GRID_WIDTH_OFFSET;
        const oHeight = height + GRID_HEIGHT_OFFSET;

        const totalLines = Math.ceil(oWidth / GRID_X_GAP);
        const totalPoints = Math.ceil(oHeight / GRID_Y_GAP);

        const xStart = (width - GRID_X_GAP * totalLines) / 2;
        const yStart = (height - GRID_Y_GAP * totalPoints) / 2;

        for (let i = 0; i <= totalLines; i++) {
            const points = [];
            for (let j = 0; j <= totalPoints; j++) {
                points.push({
                    x: xStart + GRID_X_GAP * i,
                    y: yStart + GRID_Y_GAP * j,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 }
                });
            }
            state.lines.push(points);
        }
    };

    const movePoints = (time) => {
        const { lines, mouse, noise } = state;
        const { 
            WAVE_TIME_X_FACTOR, WAVE_NOISE_X_FACTOR, WAVE_TIME_Y_FACTOR, WAVE_NOISE_Y_FACTOR,
            WAVE_NOISE_MAGNITUDE, WAVE_AMPLITUDE_X, WAVE_AMPLITUDE_Y, MOUSE_INFLUENCE_RADIUS,
            MOUSE_FALLOFF_FACTOR, MOUSE_FORCE_FACTOR, TENSION_STRENGTH, FRICTION,
            CURSOR_DISPLACEMENT_STRENGTH, MAX_CURSOR_DISPLACEMENT
        } = animationConfig;

        lines.forEach((points) => {
            points.forEach((p) => {
                const noiseInputX = (p.x + time * WAVE_TIME_X_FACTOR) * WAVE_NOISE_X_FACTOR;
                const noiseInputY = (p.y + time * WAVE_TIME_Y_FACTOR) * WAVE_NOISE_Y_FACTOR;
                const move = noise.perlin2(noiseInputX, noiseInputY) * WAVE_NOISE_MAGNITUDE;
                p.wave.x = Math.cos(move) * WAVE_AMPLITUDE_X;
                p.wave.y = Math.sin(move) * WAVE_AMPLITUDE_Y;

                const dx = p.x - mouse.sx;
                const dy = p.y - mouse.sy;
                const d = Math.hypot(dx, dy);
                const influenceRadius = Math.max(MOUSE_INFLUENCE_RADIUS, mouse.vs);

                if (d < influenceRadius) {
                    const falloff = 1 - d / influenceRadius;
                    const force = Math.cos(d * MOUSE_FALLOFF_FACTOR) * falloff;
                    const forceFactor = force * influenceRadius * mouse.vs * MOUSE_FORCE_FACTOR;
                    p.cursor.vx += Math.cos(mouse.a) * forceFactor;
                    p.cursor.vy += Math.sin(mouse.a) * forceFactor;
                }

                p.cursor.vx += (0 - p.cursor.x) * TENSION_STRENGTH;
                p.cursor.vy += (0 - p.cursor.y) * TENSION_STRENGTH;
                p.cursor.vx *= FRICTION;
                p.cursor.vy *= FRICTION;
                p.cursor.x += p.cursor.vx * CURSOR_DISPLACEMENT_STRENGTH;
                p.cursor.y += p.cursor.vy * CURSOR_DISPLACEMENT_STRENGTH;
                p.cursor.x = Math.min(MAX_CURSOR_DISPLACEMENT, Math.max(-MAX_CURSOR_DISPLACEMENT, p.cursor.x));
                p.cursor.y = Math.min(MAX_CURSOR_DISPLACEMENT, Math.max(-MAX_CURSOR_DISPLACEMENT, p.cursor.y));
            });
        });
    };

    const drawLines = () => {
        const { ctx, bounding, lines } = state;
        if (!bounding) return;
        ctx.clearRect(0, 0, bounding.width, bounding.height);
        ctx.beginPath();
        ctx.strokeStyle = state.lineColor;
        ctx.lineWidth = 0.5;

        lines.forEach((points) => {
            let p1 = moved(points[0], false);
            ctx.moveTo(p1.x, p1.y);
            for (let i = 0; i < points.length - 1; i++) {
                const currentPoint = moved(points[i], true);
                const nextPoint = moved(points[i + 1], true);
                const xc = (currentPoint.x + nextPoint.x) / 2;
                const yc = (currentPoint.y + nextPoint.y) / 2;
                ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, xc, yc);
            }
        });
        ctx.stroke();
    };

    const tick = (time) => {
        const { mouse } = state;
        const { MOUSE_SMOOTHING_FACTOR, MAX_MOUSE_VELOCITY } = animationConfig;

        mouse.sx += (mouse.x - mouse.sx) * MOUSE_SMOOTHING_FACTOR;
        mouse.sy += (mouse.y - mouse.sy) * MOUSE_SMOOTHING_FACTOR;

        const dx = mouse.sx - mouse.lx;
        const dy = mouse.sy - mouse.ly;
        const d = Math.hypot(dx, dy);
        
        mouse.v = d;
        mouse.vs += (d - mouse.vs) * MOUSE_SMOOTHING_FACTOR;
        mouse.vs = Math.min(MAX_MOUSE_VELOCITY, mouse.vs);
        mouse.a = Math.atan2(dy, dx);
        
        mouse.lx = mouse.sx;
        mouse.ly = mouse.sy;

        movePoints(time);
        drawLines();

        state.animationFrameId = requestAnimationFrame(tick);
    };

    const updateMousePosition = (x, y) => {
        if (!state.bounding) return;
        const { mouse } = state;
        mouse.x = x - state.bounding.left;
        mouse.y = y - state.bounding.top;
        if (!mouse.set) {
            mouse.sx = mouse.x;
            mouse.sy = mouse.y;
            mouse.lx = mouse.x;
            mouse.ly = mouse.y;
            mouse.set = true;
        }
    };
    
    const onResize = () => { setSize(); setLines(); };
    // Listen on window for mouse move to capture correctly across full document
    window.addEventListener("mousemove", (e) => { 
        updateMousePosition(e.pageX, e.pageY); 
    });
    window.addEventListener("touchmove", (e) => {
        updateMousePosition(e.touches[0].pageX, e.touches[0].pageY);
    }, { passive: true });

    window.addEventListener("resize", onResize);
    
    setSize();
    setLines();
    state.animationFrameId = requestAnimationFrame(tick);
}

// Initialize waves once the DOM is loaded
document.addEventListener("DOMContentLoaded", initWaves);
