<template>
  <svg class="signal-field" viewBox="0 0 1200 600" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <pattern id="signal-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" stroke="currentColor" stroke-opacity=".14" /></pattern>
      <pattern id="signal-glyph" width="10" height="10" patternUnits="userSpaceOnUse"><path d="m3 3 4 4m0-4L3 7" stroke="currentColor" stroke-width=".7" /></pattern>
    </defs>
    <path fill="url(#signal-grid)" d="M0 0h1200v600H0z" />
    <g fill="url(#signal-glyph)" class="signal-stars">
      <path d="m130 60 20 40 40 20-40 20-20 40-20-40-40-20 40-20Z" />
      <path d="m970 40 30 60 60 30-60 30-30 60-30-60-60-30 60-30Z" />
      <path d="m1060 340 30 60 60 30-60 30-30 60-30-60-60-30 60-30Z" />
      <path d="m220 400 20 40 40 20-40 20-20 40-20-40-40-20 40-20Z" />
      <path d="m760 490 15 30 30 15-30 15-15 30-15-30-30-15 30-15Z" />
    </g>
  </svg>
</template>
