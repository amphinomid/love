/* Resources:
 * - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
 * - https://stackoverflow.com/questions/15048279/drawimage-not-working
 * - https://stackoverflow.com/questions/21597456/bad-quality-for-100-both-width-and-height-of-canvas
 * - https://stackoverflow.com/questions/27413768/why-is-ctx-drawimage-only-drawing-part-of-the-video-element-to-canvas
 * - https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
 */

const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");
let image = new Image();
image.crossOrigin = "anonymous";
image.src = "https://amphinomid.github.io/love/happy_together.jpg";
let pixels = [];
let texts = [];
let debug = true;

function xor(a, b) {
    return (a + b) % 2;
}

function flicker_text(text_div) {
    setTimeout(() => {
        text_div.style.visibility = "hidden";
    }, Math.random() * 50);
    setTimeout(() => {
        text_div.style.visibility = "visible";
    }, Math.random() * 50);
}

function add_text(bit, x, y) {
    const new_div = document.createElement("div");
    const new_text = document.createTextNode(bit);
    new_div.appendChild(new_text);
    const parent_div = document.getElementById("parent");
    parent_div.appendChild(new_div);
    new_div.style.position = "absolute";
    new_div.style.left = (x - 2.5) + "px";
    new_div.style.top = (y - 7.5) + "px";
    new_div.style.visibility = "hidden";
    return new_div;
}

image.onload = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Record pixels
    if (debug) console.log("recording pixels");
    for (let i = 0; i < canvas.width; i++) {
        let pixels_row = []
        for (let j = 0; j < canvas.height; j++) {
            pixel_data = ctx.getImageData(i, j, 1, 1, { colorSpace: "srgb" }).data;
            pixels_row.push(xor(xor(pixel_data[0], pixel_data[1]), pixel_data[2]));
        }
        pixels.push(pixels_row);
    }

    // Create texts
    if (debug) console.log("creating texts");
    for (let i = 0; i < canvas.width; i += 5) {
        for (let j = 0; j < canvas.height; j += 5) {
            let new_div = add_text(pixels[i][j], i, j);
            texts.push(new_div);
        }
    }

    // Pause for two seconds, then begin flickering
    setTimeout(() => {
        // Make texts flicker indefinitely
        let denom = 1000;
        window.setInterval(function() {
            for (let i = 0; i < texts.length / denom; i++) {
                const idx = Math.floor(Math.random() * texts.length);
                flicker_text(texts[idx]);
                if (denom > 2) denom -= 0.0001;
            }
        }, 1);
    }, 2000);
};
