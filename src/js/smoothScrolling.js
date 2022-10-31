export function smoothScroll() {
    const firstImage = document
        .querySelector('.gallery')
        .firstElementChild;
  if (!firstImage) {
    return;
  }
  const { height: cardHeight } = firstImage.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.5,
    behavior: 'smooth',
  });
}
