export default function NightmarePage() {
    return (
        <div id="nightmare-bg-container" className="fixed inset-0 pointer-events-none z-0 hidden">
            <canvas id="ember-canvas" className="absolute inset-0 w-full h-full"></canvas>

            <div id="fire-overlay" className="absolute inset-0">        
                {/* <video autoplay loop muted playsinline className="w-full h-full object-cover mix-blend-screen opacity-70">
                    <source src="Media/Video/FireFrame.mp4" type="video/mp4" />
                </video>        */}
            </div>

            <div className="crt-scanlines"></div>
            <div id="lightning-flash"></div>
            <div className="blood-vignette"></div>
        </div>
    )
}