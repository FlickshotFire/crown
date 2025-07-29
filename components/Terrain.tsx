
import React from 'react';

const Terrain: React.FC = () => {
    const terrainStyle: React.CSSProperties = {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        backgroundColor: '#4a5d45', // Base dark green color
        backgroundImage: `
            /* Floating particles layer */
            radial-gradient(white 1px, transparent 1px),
            /* Blurry spots layer */
            radial-gradient(ellipse 40% 50% at 20% 30%, rgba(180, 200, 150, 0.15), transparent),
            radial-gradient(ellipse 40% 50% at 80% 70%, rgba(180, 200, 150, 0.15), transparent),
            radial-gradient(ellipse 30% 40% at 50% 90%, rgba(180, 200, 150, 0.1), transparent),
            radial-gradient(ellipse 30% 40% at 90% 10%, rgba(180, 200, 150, 0.1), transparent)
        `,
        backgroundRepeat: 'repeat, no-repeat, no-repeat, no-repeat, no-repeat',
        backgroundSize: `
            200px 200px, /* Particles repeat over a grid */
            100% 100%, 100% 100%, 100% 100%, 100% 100%
        `,
        animation: 'floatParticles 60s linear infinite',
        filter: 'blur(3px)', // Apply a slight blur to the whole thing for softness
    };

    const keyframes = `
        @keyframes floatParticles {
            from {
                background-position: 0 0;
            }
            to {
                /* Only animate the first background (particles), leaving the spots static */
                background-position: -200px 400px, 0 0, 0 0, 0 0, 0 0;
             }
        }
    `;

    return (
        <>
            <style>{keyframes}</style>
            <div
                className="absolute inset-0 w-full h-full"
                style={terrainStyle}
            ></div>
        </>
    );
};

export default Terrain;
