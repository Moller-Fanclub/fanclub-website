export function flyToCart(imageUrl: string) {
    const cartButton = document.querySelector(".floating-cart-button");
    if (!cartButton) return;

    const img = document.createElement("img");
    img.src = imageUrl;
    img.className = "fly-to-cart-img";

    document.body.appendChild(img);

    const cartRect = cartButton.getBoundingClientRect();
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;

    img.style.left = `${startX}px`;
    img.style.top = `${startY}px`;

    setTimeout(() => {
        img.style.transform = `translate(${cartRect.left - startX}px, ${cartRect.top - startY}px) scale(0.1)`;
        img.style.opacity = "0";
    }, 10);

    setTimeout(() => {
        img.remove();
    }, 700);
}
