// Veritas Shield SVG Data URL
export const veritasSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" width="200" height="280">
  <!-- Outer Shield Border -->
  <path d="M 10 10 L 190 10 L 190 180 C 190 230 100 270 100 270 C 100 270 10 230 10 180 Z" fill="#ffffff" stroke="#000000" stroke-width="4"/>
  <path d="M 14 14 L 186 14 L 186 178 C 186 226 100 264 100 264 C 100 264 14 226 14 178 Z" fill="#ffffff" stroke="#000000" stroke-width="2"/>

  <!-- VERITAS Header Box -->
  <rect x="14" y="14" width="172" height="36" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="100" y="42" font-family="'Arial Black', Arial, sans-serif" font-weight="900" font-size="28" text-anchor="middle" fill="#000000" letter-spacing="2">VERITAS</text>

  <!-- Dominican Gyronny (Quartered / Flanqué background inside shield) -->
  <g clip-path="url(#shield-clip)">
    <clipPath id="shield-clip">
      <path d="M 14 50 L 186 50 L 186 178 C 186 226 100 264 100 264 C 100 264 14 226 14 178 Z"/>
    </clipPath>
    <!-- Background triangles -->
    <polygon points="100,150 14,50 100,50" fill="#ffffff"/>
    <polygon points="100,150 100,50 186,50" fill="#000000"/>
    <polygon points="100,150 186,50 186,150" fill="#ffffff"/>
    <polygon points="100,150 186,150 100,264" fill="#000000"/>
    <polygon points="100,150 100,264 14,150" fill="#ffffff"/>
    <polygon points="100,150 14,150 14,50" fill="#000000"/>

    <!-- Dominican Cross Fleury (Cross with fleur-de-lis ends) -->
    <g fill="#000000" stroke="#ffffff" stroke-width="2">
      <!-- Vertical Shaft -->
      <path d="M 94,60 L 106,60 L 106,230 L 94,230 Z" fill="#000000"/>
      <!-- Horizontal Bar -->
      <path d="M 30,144 L 170,144 L 170,156 L 30,156 Z" fill="#000000"/>
      <!-- Top Fleur-de-lis -->
      <path d="M 100,55 C 92,65 85,60 92,72 C 98,72 100,68 100,68 C 100,68 102,72 108,72 C 115,60 108,65 100,55 Z" fill="#000000"/>
      <!-- Bottom Fleur-de-lis -->
      <path d="M 100,240 C 92,230 85,235 92,223 C 98,223 100,227 100,227 C 100,227 102,223 108,223 C 115,235 108,230 100,240 Z" fill="#000000"/>
      <!-- Left Fleur-de-lis -->
      <path d="M 25,150 C 35,142 30,135 42,142 C 42,148 38,150 38,150 C 38,150 42,152 42,158 C 30,165 35,158 25,150 Z" fill="#000000"/>
      <!-- Right Fleur-de-lis -->
      <path d="M 175,150 C 165,142 170,135 158,142 C 158,148 162,150 162,150 C 162,150 158,152 158,158 C 170,165 165,158 175,150 Z" fill="#000000"/>
    </g>
    <!-- Counterchanged cross overlay -->
    <path d="M 100,60 L 100,236 M 28,150 L 172,150" stroke="#ffffff" stroke-width="3"/>
  </g>
</svg>`;

export const veritasLogoDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(veritasSvg);
