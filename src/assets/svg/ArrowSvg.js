// src/assets/svg/ArrowSvg.js

export default function createArrowSvg() {
    const svgNS = "http://www.w3.org/2000/svg";

    // Create SVG element
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "14");
    svg.setAttribute("height", "14");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("fill", "none");
    svg.setAttribute("class", "pb-1");

    // Create title for accessibility
    const title = document.createElementNS(svgNS, "title");
    title.textContent = "Arrow SVG";
    svg.appendChild(title);

    // Create path element
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M3.25586 2.99992H11.9106L1.33325 13.5773L2.51176 14.7558L13.0892 4.1784V12.8333H14.7559V1.33325H3.25586V2.99992Z");
    path.setAttribute("fill", "currentColor");
    svg.appendChild(path);

    return svg;
}

// Alternative version using HTML string if you prefer
export function getArrowSvgHtml() {
    return `
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="pb-1"
    >
      <title>Arrow SVG</title>
      <path
        d="M3.25586 2.99992H11.9106L1.33325 13.5773L2.51176 14.7558L13.0892 4.1784V12.8333H14.7559V1.33325H3.25586V2.99992Z"
        fill="currentColor"
      />
    </svg>
  `;
}