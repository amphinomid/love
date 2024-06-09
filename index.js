/* Resources:
 * - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
 * - https://stackoverflow.com/questions/15048279/drawimage-not-working
 * - https://stackoverflow.com/questions/21597456/bad-quality-for-100-both-width-and-height-of-canvas
 * - https://stackoverflow.com/questions/27413768/why-is-ctx-drawimage-only-drawing-part-of-the-video-element-to-canvas
 */

const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");
let image = new Image();
image.crossOrigin = "anonymous";
image.src = "https://amphinomid.github.io/love/happy_together.jpg";
// image.alt = "Two men dance together in a kitchen."; // TODO: find another way
let pixels = [];
let debug = true;

image.onload = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    if (debug) console.log("recording pixels");

    // Record pixels
    for (let i = 0; i < canvas.width; i++) {
        pixels_row = []
        for (let j = 0; j < canvas.height; j++) {
            pixel_data = ctx.getImageData(i, j, 1, 1, { colorSpace: "srgb" }).data;
            pixels_row.append(pixel_data[0] ^ pixel_data[1] ^ pixel_data[2]);
        }
        pixels.append(pixels_row);
    }

    if (debug) console.log("creating texts");

    // Create texts
    ctx.font = "10px monospace";
    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
            ctx.fillText(pixels[i][j], i, j);
        }
    }
};
