const introAnimationPositionStyle = document.createElement('style');
introAnimationPositionStyle.textContent = `
.segment.is-active .intro-frame-animation {
  grid-column: 2 !important;
  grid-row: 1 !important;
  justify-self: center !important;
  align-self: center !important;
  margin: 0 !important;
}

@media (max-width: 900px) {
  .segment.is-active .intro-frame-animation {
    grid-column: 1 !important;
    grid-row: 2 !important;
    justify-self: center !important;
    align-self: center !important;
    margin: 0 auto !important;
  }
}
`;
document.head.appendChild(introAnimationPositionStyle);
