import React, { useEffect, useRef, useState, useCallback } from 'react';



const CircuitBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });
    const rafRef = useRef<number | null>(null);
    const targetPos = useRef({ x: -9999, y: -9999 });
    const currentPos = useRef({ x: -9999, y: -9999 });

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        targetPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, []);

    const handleMouseLeave = useCallback(() => {
        targetPos.current = { x: -9999, y: -9999 };
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);

        // Smooth lerp loop
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const tick = () => {
            currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.08);
            currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.08);
            setMousePos({ x: currentPos.current.x, y: currentPos.current.y });
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);

        return () => {
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('mouseleave', handleMouseLeave);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [handleMouseMove, handleMouseLeave]);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto z-0 bg-[#0D0505] bg-[var(--hero-bg)]">
            {/* Cursor-following glow */}
            <div
                className="absolute pointer-events-none z-20"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    width: 600,
                    height: 600,
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, rgba(245,158,11,0.10) 35%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(2px)',
                    transition: 'opacity 0.3s',
                    opacity: mousePos.x === -9999 ? 0 : 1,
                    pointerEvents: 'none',
                }}
            />
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.15]" 
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }} 
            />
             {/* Styles for the circuit animation */}
             <style>{`
                .circuit-path {
                    height: 100%;
                    width: 100%;
                    opacity: 1;
                }
                .path-anim {
                    animation: draw 30s linear infinite;
                    stroke-dasharray: 400 600 200 600 150 400;
                    stroke-dashoffset: 6400;
                    opacity: 1;
                }
                .path-01 { animation-delay: 0s; }
                .path-02 { animation-delay: 3s; }
                .path-03 { animation-delay: 6s; }
                .path-04 { animation-delay: 1.5s; }
                .path-05 { animation-delay: 4.5s; }
                .path-06 { animation-delay: 7.5s; }
                .path-07 { animation-delay: 2s; }
                .path-08 { animation-delay: 5s; }

                @keyframes draw {
                    0% {
                        stroke-dashoffset: 6400;
                        opacity: 0.5;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        stroke-dashoffset: 0;
                        opacity: 0.5;
                    }
                }
             `}</style>

             <svg className="circuit-path" viewBox="0 0 2400 1600" preserveAspectRatio="xMidYMid slice">
                 <defs>
                     <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                         <stop offset="0%" stopColor="#ef4444" /> {/* Red-500 */}
                         <stop offset="50%" stopColor="#f59e0b" /> {/* Amber-500 */}
                         <stop offset="100%" stopColor="#ef4444" /> {/* Red-500 */}
                     </linearGradient>
                     <filter id="glow">
                         <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                         <feMerge>
                             <feMergeNode in="coloredBlur" />
                             <feMergeNode in="SourceGraphic" />
                         </feMerge>
                     </filter>
                 </defs>

                 {/* Module 01 */}
                 <g transform="translate(-1.000000, 0.000000)" className="path-anim path-01" stroke="url(#circuit-gradient)" strokeWidth="4" fill="none" fillRule="evenodd" strokeLinecap="butt" strokeLinejoin="round">
                    <g transform="translate(177.000000, 0.000000)">
                        <polyline points="52 92 84 92 116 60 116 0"></polyline>
                        <polyline points="52 84 80 84 108 56 108 0"></polyline>
                        <polyline points="52 76 76 76 100 52 100 0"></polyline>
                        <polyline points="52 68 72 68 92 48 92 0"></polyline>
                        <polyline points="52 60 68 60 84 44 84 0"></polyline>
                        <path d="M16,56 L16,0"></path>
                        <path d="M8,56 L8,0"></path>
                        <path d="M24,56 L24,0"></path>
                        <path d="M32,56 L32,0"></path>
                        <path d="M40,56 L40,0"></path>
                        <path d="M48,56 L48,0"></path>
                        <path d="M0,92 L4,92"></path>
                        <polyline points="52 100 56 100 72 100 80.0156098 108.01561 80.0156098 124.007338"></polyline>
                        <path d="M0,100 L4,100"></path>
                        <path d="M0,84 L4,84"></path>
                        <path d="M0,76 L4,76"></path>
                        <path d="M0,68 L4,68"></path>
                        <path d="M0,60 L4,60"></path>
                        <polyline points="96 284 88 284 84 288 32 288 16 272 16 108 16 104"></polyline>
                        <polyline points="104 439 104 372 8 276 8 108 8 104"></polyline>
                        <polyline points="124 272 88 272 80 280 36 280 24 268 24 108 24 104"></polyline>
                        <polyline points="68 268 36 268 32 264 32 108 32 104"></polyline>
                        <polyline points="44.0311289 252.000061 44.0311289 244.031129 40 240 40 108 40 104"></polyline>
                        <polyline points="48 108 48 104 48 184 56 192 60 192 64 192"></polyline>
                    </g>
                    <g transform="translate(0.000000, 239.000000)">
                        <polyline points="1 0 25 0 57 32 57 156 69 168 69 172"></polyline>
                        <polyline points="1 8 21 8 50 37 50 161 53 164 53 172"></polyline>
                        <polyline points="1 32 8 32 24 48 24 169 12.954639 180.045361 13 248 13 257 0 270"></polyline>
                        <polyline points="0 282 21 261 21 185 33 173 33 45 12 24 1 24"></polyline>
                        <polyline points="0 317 0 293 29 264 29 189 41 177 41 40 17 16 1 16"></polyline>
                    </g>
                    <g transform="translate(1.000000, 115.000000)">
                        <polyline points="300 361 360 361 376.03122 344.96878 424 344.96878 471.000005 344.96878"></polyline>
                        <polyline points="0 41 76 41 120 85 120 201 156 237 176 237 208 269 208 285 196 297 196 337 228 369 252 369"></polyline>
                        <polyline points="300 369 391 369 395 365 464 365 468 361 476 361 520 405 556 405"></polyline>
                        <polyline points="300 353 356 353 372 337 376 337 380 333"></polyline>
                        <polyline points="0 17 88 17 144 73 144 181 224 261 224 293 212 305 212 329 236 353 252 353"></polyline>
                        <polyline points="300 345 352 345 384 313"></polyline>
                        <polyline points="224 317 224 329 240 345 252 345"></polyline>
                        <polyline points="300 337 347 337 376 308 376 305 385 296"></polyline>
                        <polyline points="136 12 136 21 152 37 152 177 232 257 232 293 236 297 236 329 244 337 252 337"></polyline>
                        <polyline points="300 329 316 329 320 325 336 325"></polyline>
                        <polyline points="348 597 328 597 304 573 304 409 296 401 296 373"></polyline>
                        <polyline points="244 281 244 325 248 329 252 329"></polyline>
                        <polyline points="264 325 264 265 168 169 168 29 160 21 160 12"></polyline>
                        <polyline points="260 489 259.984385 441.015635 247.96878 429.000031 247.96878 413.03122 264 397 264 373"></polyline>
                        <polyline points="256 325 256 269 160 173 160 33 148 21 148 0"></polyline>
                        <polyline points="239 406 256 389 256 373"></polyline>
                        <polyline points="272 325 272 261 176 165 176 25 172 21 172 1"></polyline>
                        <polyline points="259 417 259 414 272 401 272 373"></polyline>
                        <polyline points="272 433 272 413 280 405 280 373"></polyline>
                        <polyline points="288 325 288 237 304 221 304 212"></polyline>
                        <polyline points="348 605 323 605 296 578 296 414 288 406 288 373"></polyline>
                        <polyline points="296 325 296 241 316 221 316 201"></polyline>
                        <polyline points="0 33 79.9895845 32.9895845 128 81 128 197 144 213 164 213 216 265 216 289 204 301.285714 204 333.571429 231.428571 361 252 361"></polyline>
                    </g>
                 </g>

                 {/* Module 02 */}
                 <g transform="translate(599.000000, 0.000000)" className="path-anim path-02" stroke="url(#circuit-gradient)" strokeWidth="4" fill="none" fillRule="evenodd" strokeLinecap="butt" strokeLinejoin="round">
                    <g transform="translate(377.000000, 0.000000)">
                        <polyline points="52 92 84 92 116 60 116 0"></polyline>
                        <polyline points="52 84 80 84 108 56 108 0"></polyline>
                        <polyline points="52 76 76 76 100 52 100 0"></polyline>
                        <path d="M16,56 L16,0"></path>
                        <path d="M8,56 L8,0"></path>
                        <path d="M24,56 L24,0"></path>
                        <path d="M32,56 L32,0"></path>
                        <polyline points="96 284 88 284 84 288 32 288 16 272 16 108 16 104"></polyline>
                        <polyline points="104 439 104 372 8 276 8 108 8 104"></polyline>
                        <polyline points="124 272 88 272 80 280 36 280 24 268 24 108 24 104"></polyline>
                    </g>
                    <g transform="translate(0.000000, 675.000000)">
                        <polyline points="29 153 29 181 49 201 65 201"></polyline>
                        <polyline points="121 201 153 201 169 217 201 217 243 217 254 217 286 185 286 138 277 129 277 125 277 115"></polyline>
                        <polyline points="45 153 45 173 57 185 65 185"></polyline>
                        <polyline points="121 185 161.012498 185 177.00625 200.993752 201 200.993752 243 201 245 201 269 177 269 145 253 129 253 125 253 115"></polyline>
                        <polyline points="121 217 145 217 161 233 201 233 261 233 301 193 301 125 301 116 320.026298 96.9737024 329.058497 96.9737024"></polyline>
                    </g>
                 </g>

                 {/* Module 03 */}
                 <g transform="translate(1024.000000, 164.000000)" className="path-anim path-03" stroke="url(#circuit-gradient)" strokeWidth="4" fill="none" fillRule="evenodd" strokeLinecap="butt" strokeLinejoin="round">
                     <g transform="translate(8.000000, 0.000000)">
                        <polyline points="48 52 195 52 228 85 228 176 300 248 372 248 392 228 432 228 464 260 516 260 520 256 520 248"></polyline>
                        <polyline points="48 44 199 44 235 80 235 171.005494 283.997253 220.002747 436 220.002747 448.040112 232.042859 455.065506 232.042859"></polyline>
                        <polyline points="48 36 203 36 244 77 244 168 288 212 439 212 447 220 482 220"></polyline>
                     </g>
                 </g>
             </svg>

             {/* Lower-right circuit lines (mirrored) */}
             <svg className="circuit-path" viewBox="0 0 2400 1600" preserveAspectRatio="xMidYMid slice" style={{ transform: 'rotate(180deg)' }}>
                 {/* Module 04 - mirrored from Module 01 */}
                 <g transform="translate(-1.000000, 0.000000)" className="path-anim path-04" stroke="url(#circuit-gradient)" strokeWidth="4" fill="none" fillRule="evenodd" strokeLinecap="butt" strokeLinejoin="round">
                    <g transform="translate(177.000000, 0.000000)">
                        <polyline points="52 92 84 92 116 60 116 0"></polyline>
                        <polyline points="52 84 80 84 108 56 108 0"></polyline>
                        <polyline points="52 76 76 76 100 52 100 0"></polyline>
                        <polyline points="52 68 72 68 92 48 92 0"></polyline>
                        <polyline points="52 60 68 60 84 44 84 0"></polyline>
                        <path d="M16,56 L16,0"></path>
                        <path d="M8,56 L8,0"></path>
                        <path d="M24,56 L24,0"></path>
                        <path d="M32,56 L32,0"></path>
                        <path d="M40,56 L40,0"></path>
                        <path d="M48,56 L48,0"></path>
                        <polyline points="96 284 88 284 84 288 32 288 16 272 16 108 16 104"></polyline>
                        <polyline points="104 439 104 372 8 276 8 108 8 104"></polyline>
                        <polyline points="124 272 88 272 80 280 36 280 24 268 24 108 24 104"></polyline>
                    </g>
                    <g transform="translate(0.000000, 239.000000)">
                        <polyline points="1 0 25 0 57 32 57 156 69 168 69 172"></polyline>
                        <polyline points="1 8 21 8 50 37 50 161 53 164 53 172"></polyline>
                        <polyline points="1 32 8 32 24 48 24 169 12.954639 180.045361 13 248 13 257 0 270"></polyline>
                        <polyline points="0 282 21 261 21 185 33 173 33 45 12 24 1 24"></polyline>
                        <polyline points="0 317 0 293 29 264 29 189 41 177 41 40 17 16 1 16"></polyline>
                    </g>
                    <g transform="translate(1.000000, 115.000000)">
                        <polyline points="300 361 360 361 376.03122 344.96878 424 344.96878 471.000005 344.96878"></polyline>
                        <polyline points="0 41 76 41 120 85 120 201 156 237 176 237 208 269 208 285 196 297 196 337 228 369 252 369"></polyline>
                        <polyline points="300 369 391 369 395 365 464 365 468 361 476 361 520 405 556 405"></polyline>
                        <polyline points="0 17 88 17 144 73 144 181 224 261 224 293 212 305 212 329 236 353 252 353"></polyline>
                        <polyline points="136 12 136 21 152 37 152 177 232 257 232 293 236 297 236 329 244 337 252 337"></polyline>
                    </g>
                 </g>

                 {/* Module 05 - mirrored from Module 02 */}
                 <g transform="translate(599.000000, 0.000000)" className="path-anim path-05" stroke="url(#circuit-gradient)" strokeWidth="4" fill="none" fillRule="evenodd" strokeLinecap="butt" strokeLinejoin="round">
                    <g transform="translate(377.000000, 0.000000)">
                        <polyline points="52 92 84 92 116 60 116 0"></polyline>
                        <polyline points="52 84 80 84 108 56 108 0"></polyline>
                        <polyline points="52 76 76 76 100 52 100 0"></polyline>
                        <path d="M16,56 L16,0"></path>
                        <path d="M8,56 L8,0"></path>
                        <path d="M24,56 L24,0"></path>
                        <path d="M32,56 L32,0"></path>
                        <polyline points="96 284 88 284 84 288 32 288 16 272 16 108 16 104"></polyline>
                        <polyline points="104 439 104 372 8 276 8 108 8 104"></polyline>
                    </g>
                    <g transform="translate(0.000000, 675.000000)">
                        <polyline points="29 153 29 181 49 201 65 201"></polyline>
                        <polyline points="121 201 153 201 169 217 201 217 243 217 254 217 286 185 286 138 277 129 277 125 277 115"></polyline>
                        <polyline points="45 153 45 173 57 185 65 185"></polyline>
                        <polyline points="121 185 161.012498 185 177.00625 200.993752 201 200.993752 243 201 245 201 269 177 269 145 253 129 253 125 253 115"></polyline>
                    </g>
                 </g>

                 {/* Module 06 - mirrored from Module 03 */}
                 <g transform="translate(1024.000000, 164.000000)" className="path-anim path-06" stroke="url(#circuit-gradient)" strokeWidth="4" fill="none" fillRule="evenodd" strokeLinecap="butt" strokeLinejoin="round">
                     <g transform="translate(8.000000, 0.000000)">
                        <polyline points="48 52 195 52 228 85 228 176 300 248 372 248 392 228 432 228 464 260 516 260 520 256 520 248"></polyline>
                        <polyline points="48 44 199 44 235 80 235 171.005494 283.997253 220.002747 436 220.002747 448.040112 232.042859 455.065506 232.042859"></polyline>
                        <polyline points="48 36 203 36 244 77 244 168 288 212 439 212 447 220 482 220"></polyline>
                     </g>
                 </g>

                 {/* Module 07 - Extra Lower Right */}
                 <g transform="translate(250.000000, 20.000000)" className="path-anim path-07" stroke="url(#circuit-gradient)" strokeWidth="4" fill="none" fillRule="evenodd" strokeLinecap="butt" strokeLinejoin="round">
                    <g transform="translate(377.000000, 0.000000)">
                        <polyline points="52 92 84 92 116 60 116 0"></polyline>
                        <polyline points="52 84 80 84 108 56 108 0"></polyline>
                        <polyline points="52 76 76 76 100 52 100 0"></polyline>
                        <path d="M16,56 L16,0"></path>
                        <path d="M8,56 L8,0"></path>
                        <path d="M24,56 L24,0"></path>
                        <path d="M32,56 L32,0"></path>
                        <polyline points="96 284 88 284 84 288 32 288 16 272 16 108 16 104"></polyline>
                        <polyline points="104 439 104 372 8 276 8 108 8 104"></polyline>
                    </g>
                    <g transform="translate(0.000000, 675.000000)">
                        <polyline points="29 153 29 181 49 201 65 201"></polyline>
                        <polyline points="121 201 153 201 169 217 201 217 243 217 254 217 286 185 286 138 277 129 277 125 277 115"></polyline>
                        <polyline points="45 153 45 173 57 185 65 185"></polyline>
                        <polyline points="121 185 161.012498 185 177.00625 200.993752 201 200.993752 243 201 245 201 269 177 269 145 253 129 253 125 253 115"></polyline>
                    </g>
                 </g>

                 {/* Module 08 - Extra Lower Right */}
                 <g transform="translate(1300.000000, 50.000000)" className="path-anim path-08" stroke="url(#circuit-gradient)" strokeWidth="4" fill="none" fillRule="evenodd" strokeLinecap="butt" strokeLinejoin="round">
                     <g transform="translate(8.000000, 0.000000)">
                        <polyline points="48 52 195 52 228 85 228 176 300 248 372 248 392 228 432 228 464 260 516 260 520 256 520 248"></polyline>
                        <polyline points="48 44 199 44 235 80 235 171.005494 283.997253 220.002747 436 220.002747 448.040112 232.042859 455.065506 232.042859"></polyline>
                        <polyline points="48 36 203 36 244 77 244 168 288 212 439 212 447 220 482 220"></polyline>
                     </g>
                 </g>
             </svg>

             {/* Vignette Overlay */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.7)_100%)] z-10" />
        </div>
    );
};

export default React.memo(CircuitBackground);
