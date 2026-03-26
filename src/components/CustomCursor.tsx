import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * CustomCursor
 * – Dual-layer: a sharp inner dot + a soft outer ring that trails behind
 * – Gradient: brand red (#ef4444) → amber (#f59e0b)
 * – Faint glow via SVG filter (visible on both light and dark backgrounds)
 * – Hides the native cursor globally
 */
const CustomCursor = () => {
    const dotRef   = useRef<HTMLDivElement>(null);
    const ringRef  = useRef<HTMLDivElement>(null);
    const rafRef   = useRef<number | null>(null);

    // Raw target (snaps instantly)
    const dot  = useRef({ x: -100, y: -100 });
    // Smooth trailing position for the ring
    const ring = useRef({ x: -100, y: -100 });

    const [visible, setVisible] = useState(false);
    const [clicking, setClicking] = useState(false);

    const onMove = useCallback((e: MouseEvent) => {
        dot.current = { x: e.clientX, y: e.clientY };
        if (!visible) setVisible(true);
    }, [visible]);

    const onLeave  = useCallback(() => setVisible(false), []);
    const onDown   = useCallback(() => setClicking(true),  []);
    const onUp     = useCallback(() => setClicking(false), []);

    useEffect(() => {
        document.addEventListener('mousemove',  onMove);
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mousedown',  onDown);
        document.addEventListener('mouseup',    onUp);

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const tick = () => {
            // Inner dot follows instantly via CSS transform
            if (dotRef.current) {
                dotRef.current.style.transform =
                    `translate(${dot.current.x}px, ${dot.current.y}px) translate(-50%, -50%)`;
            }
            // Outer ring lerps toward the dot
            ring.current.x = lerp(ring.current.x, dot.current.x, 0.12);
            ring.current.y = lerp(ring.current.y, dot.current.y, 0.12);
            if (ringRef.current) {
                ringRef.current.style.transform =
                    `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            document.removeEventListener('mousemove',  onMove);
            document.removeEventListener('mouseleave', onLeave);
            document.removeEventListener('mousedown',  onDown);
            document.removeEventListener('mouseup',    onUp);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [onMove, onLeave, onDown, onUp]);

    return (
        <>
            {/* Inject cursor:none globally */}
            <style>{`* { cursor: none !important; }`}</style>

            {/* SVG filter for the glow (rendered off-screen) */}
            <svg width="0" height="0" style={{ position: 'fixed', pointerEvents: 'none' }}>
                <defs>
                    <filter id="cursor-glow" x="-80%" y="-80%" width="260%" height="260%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="cursor-dot-glow" x="-150%" y="-150%" width="400%" height="400%">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="cursor-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Outer ring – trails the cursor, works on any bg */}
            <div
                ref={ringRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: clicking ? 28 : 36,
                    height: clicking ? 28 : 36,
                    borderRadius: '50%',
                    // Gradient border via box-shadow layering (no fill = fully transparent inside)
                    border: '1.5px solid rgba(239,68,68,0)',
                    boxShadow:
                        '0 0 0 1.5px rgba(239,68,68,0.75), ' +
                        '0 0 0 1.5px rgba(245,158,11,0.45), ' +
                        '0 0 8px 1px rgba(239,68,68,0.25), ' +
                        '0 0 12px 2px rgba(245,158,11,0.15)',
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 0.2s, width 0.1s, height 0.1s',
                    pointerEvents: 'none',
                    zIndex: 99999,
                    willChange: 'transform',
                }}
            />

            {/* Inner dot – snaps instantly */}
            <div
                ref={dotRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ef4444, #f59e0b)',
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 0.2s',
                    pointerEvents: 'none',
                    zIndex: 99999,
                    filter: 'url(#cursor-dot-glow)',
                    willChange: 'transform',
                }}
            />
        </>
    );
};

export default CustomCursor;
