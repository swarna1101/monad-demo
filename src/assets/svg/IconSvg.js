// src/assets/svg/IconSvg.js

export default function createMonadIconSvg() {
    const svgNS = "http://www.w3.org/2000/svg";

    // Create SVG element
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");

    // Create defs section
    const defs = document.createElementNS(svgNS, "defs");

    // Create radial gradient
    const gradient = document.createElementNS(svgNS, "radialGradient");
    gradient.setAttribute("id", "monadGradient");
    gradient.setAttribute("cx", "30%");
    gradient.setAttribute("cy", "30%");
    gradient.setAttribute("r", "70%");

    // Create gradient stops
    const stops = [
        { offset: "0%", color: "#836EF9", animateFrom: "#836EF9", animateTo: "#6A50E0" },
        { offset: "70%", color: "#200052", animateFrom: "#200052", animateTo: "#38006C" },
        { offset: "100%", color: "#120030", animateFrom: "#120030", animateTo: "#200052" }
    ];

    stops.forEach((stopInfo, index) => {
        const stop = document.createElementNS(svgNS, "stop");
        stop.setAttribute("offset", stopInfo.offset);
        stop.setAttribute("stop-color", stopInfo.color);

        // Create animation
        const animate = document.createElementNS(svgNS, "animate");
        animate.setAttribute("attributeName", "stop-color");
        animate.setAttribute("values", `${stopInfo.color};${stopInfo.animateTo};${stopInfo.animateFrom};${stopInfo.color}`);
        animate.setAttribute("dur", "5s");
        animate.setAttribute("repeatCount", "indefinite");

        stop.appendChild(animate);
        gradient.appendChild(stop);
    });

    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Create main circle
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", "40");
    circle.setAttribute("fill", "url(#monadGradient)");

    // Create pulse animation
    const pulseAnimate = document.createElementNS(svgNS, "animate");
    pulseAnimate.setAttribute("attributeName", "r");
    pulseAnimate.setAttribute("values", "40;42;40");
    pulseAnimate.setAttribute("dur", "2s");
    pulseAnimate.setAttribute("repeatCount", "indefinite");
    pulseAnimate.setAttribute("calcMode", "spline");
    pulseAnimate.setAttribute("keySplines", "0.4 0 0.2 1; 0.4 0 0.2 1");

    circle.appendChild(pulseAnimate);
    svg.appendChild(circle);

    return svg;
}

// Alternative version using HTML string if you prefer
export function getMonadIconSvgHtml() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="monadGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#836EF9">
            <animate
              attributeName="stop-color"
              values="#836EF9;#6A50E0;#836EF9"
              dur="5s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="70%" stop-color="#200052">
            <animate
              attributeName="stop-color"
              values="#200052;#38006C;#200052"
              dur="5s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stop-color="#120030">
            <animate
              attributeName="stop-color"
              values="#120030;#200052;#120030"
              dur="5s"
              repeatCount="indefinite"
            />
          </stop>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#monadGradient)">
        <animate
          attributeName="r"
          values="40;42;40"
          dur="2s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
        />
      </circle>
    </svg>
  `;
}

// Create a Holesky network icon
export function createHoleskyIconSvg() {
    const svgNS = "http://www.w3.org/2000/svg";

    // Create SVG element
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");

    // Create defs section
    const defs = document.createElementNS(svgNS, "defs");

    // Create radial gradient
    const gradient = document.createElementNS(svgNS, "radialGradient");
    gradient.setAttribute("id", "holeskyGradient");
    gradient.setAttribute("cx", "30%");
    gradient.setAttribute("cy", "30%");
    gradient.setAttribute("r", "70%");

    // Create gradient stops
    const stops = [
        { offset: "0%", color: "#5f9ea0", animateFrom: "#5f9ea0", animateTo: "#4f8e90" },
        { offset: "70%", color: "#2F4F4F", animateFrom: "#2F4F4F", animateTo: "#3F5F5F" },
        { offset: "100%", color: "#1F3F3F", animateFrom: "#1F3F3F", animateTo: "#2F4F4F" }
    ];

    stops.forEach((stopInfo, index) => {
        const stop = document.createElementNS(svgNS, "stop");
        stop.setAttribute("offset", stopInfo.offset);
        stop.setAttribute("stop-color", stopInfo.color);

        // Create animation (slower for Holesky to represent slower network)
        const animate = document.createElementNS(svgNS, "animate");
        animate.setAttribute("attributeName", "stop-color");
        animate.setAttribute("values", `${stopInfo.color};${stopInfo.animateTo};${stopInfo.animateFrom};${stopInfo.color}`);
        animate.setAttribute("dur", "15s"); // Slower animation to represent slower network
        animate.setAttribute("repeatCount", "indefinite");

        stop.appendChild(animate);
        gradient.appendChild(stop);
    });

    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Create hexagon shape (Ethereum-like)
    const hexagon = document.createElementNS(svgNS, "path");
    const hexPath = "M50,10 L85,30 L85,70 L50,90 L15,70 L15,30 Z";
    hexagon.setAttribute("d", hexPath);
    hexagon.setAttribute("fill", "url(#holeskyGradient)");

    // Create pulse animation (slower for Holesky)
    const pulseAnimate = document.createElementNS(svgNS, "animate");
    pulseAnimate.setAttribute("attributeName", "opacity");
    pulseAnimate.setAttribute("values", "1;0.9;1");
    pulseAnimate.setAttribute("dur", "15s"); // Slower animation
    pulseAnimate.setAttribute("repeatCount", "indefinite");

    hexagon.appendChild(pulseAnimate);
    svg.appendChild(hexagon);

    return svg;
}

// Get Holesky icon as HTML string
export function getHoleskyIconSvgHtml() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="holeskyGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#5f9ea0">
            <animate
              attributeName="stop-color"
              values="#5f9ea0;#4f8e90;#5f9ea0"
              dur="15s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="70%" stop-color="#2F4F4F">
            <animate
              attributeName="stop-color"
              values="#2F4F4F;#3F5F5F;#2F4F4F"
              dur="15s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stop-color="#1F3F3F">
            <animate
              attributeName="stop-color"
              values="#1F3F3F;#2F4F4F;#1F3F3F"
              dur="15s"
              repeatCount="indefinite"
            />
          </stop>
        </radialGradient>
      </defs>
      <path d="M50,10 L85,30 L85,70 L50,90 L15,70 L15,30 Z" fill="url(#holeskyGradient)">
        <animate
          attributeName="opacity"
          values="1;0.9;1"
          dur="15s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  `;
}