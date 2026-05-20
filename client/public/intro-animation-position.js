const introAnimationPositionStyle = document.createElement('style');
introAnimationPositionStyle.textContent = `
.segment.is-active .intro-frame-animation {
  grid-column: 2 !important;
  grid-row: 1 !important;
  justify-self: center !important;
  align-self: center !important;
  margin: clamp(34px, 6vh, 72px) 0 0 !important;
}

@media (max-width: 900px) {
  .segment.is-active .intro-frame-animation {
    grid-column: 1 !important;
    grid-row: 2 !important;
    justify-self: center !important;
    align-self: center !important;
    margin: clamp(8px, 2vh, 18px) auto 0 !important;
  }
}
`;
document.head.appendChild(introAnimationPositionStyle);
