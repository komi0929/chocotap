/* ============================================ */
/*   chocotap — Japan Map Renderer (Accurate)   */
/*   Uses real GeoJSON-derived prefecture paths  */
/* ============================================ */

function createJapanMapSVG() {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", JAPAN_SVG_VIEWBOX);
  svg.setAttribute("xmlns", svgNS);

  for (const [name, d] of Object.entries(JAPAN_PREF_PATHS)) {
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", d);
    path.setAttribute("data-pref", name);
    path.setAttribute("class", "pref-none");
    svg.appendChild(path);
  }

  return svg;
}

// Convert lat/lng to SVG coordinates matching the projection used in generation
function latLngToSVG(lat, lng, containerW, containerH) {
  const latMin = 26, latMax = 46, lngMin = 127, lngMax = 146;
  const svgW = 480, svgH = 620;
  
  // Project to SVG space
  const svgX = ((lng - lngMin) / (lngMax - lngMin)) * svgW;
  const svgY = ((latMax - lat) / (latMax - latMin)) * svgH;
  
  // Scale SVG space to container space (90% with centering)
  const scale = Math.min(containerW / svgW, containerH / svgH) * 0.9;
  const offsetX = (containerW - svgW * scale) / 2;
  const offsetY = (containerH - svgH * scale) / 2;
  
  return {
    x: svgX * scale + offsetX,
    y: svgY * scale + offsetY
  };
}
