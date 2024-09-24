const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let startX, startY;
let circles = []; // To store all circles with their properties
let isCircleDrawn = false; // Track if a circle has been drawn

// Get random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Clear canvas function
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Redraw all stored circles
function redrawCircles() {
  clearCanvas(); // Clear canvas first
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color; // Use stored color
    ctx.fill();
    ctx.stroke();
  });
}

// Check if a point is inside a circle
function isInsideCircle(x, y, circle) {
  const distance = Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2));
  console.log("distance: " + distance)
  console.log("circle radius: " + circle.radius)
  return distance < circle.radius;
}

// Start drawing a new circle
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

// Update the circle size while dragging
canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;

  const currentX = e.offsetX;
  const currentY = e.offsetY;
  const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));

  // Redraw existing circles
  redrawCircles();

  // Draw the current circle being dragged (temporary until mouseup)
  ctx.beginPath();
  ctx.arc(startX, startY, radius, 0, Math.PI * 2);
  ctx.fillStyle = getRandomColor(); // Temporary random color for the new circle
  ctx.fill();
  ctx.stroke();
});

// Stop drawing and store the circle's properties
canvas.addEventListener('mouseup', (e) => {
  if (!isDrawing) return;

  const currentX = e.offsetX;
  const currentY = e.offsetY;
  const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
  const color = getRandomColor(); // Generate random color for this specific circle

  // Store the circle's details (position, radius, and color)
  circles.push({
    x: startX,
    y: startY,
    radius: radius,
    color: color
  });

  // Mark that at least one circle has been drawn
  isCircleDrawn = true;

  // Final redraw to ensure the current circle has the correct color
  redrawCircles();

  isDrawing = false;
});

// Reset button to clear the canvas and stored circles
document.getElementById('reset').addEventListener('click', () => {
  clearCanvas();
  circles = []; // Clear the stored circles
  isCircleDrawn = false; // Reset the flag when circles are cleared
});

// Feature 1: Show "Hit" or "Miss" when clicking on the canvas after drawing
canvas.addEventListener('click', (e) => {
  // Only show Hit/Miss after circles have been drawn
  if (!isCircleDrawn) return; // Don't show anything if no circles exist

  const clickX = e.offsetX;
  const clickY = e.offsetY;

  let hit = false;

  // Check if the click is inside any drawn circle
  for (let circle of circles) {
    if (isInsideCircle(clickX, clickY, circle)) {
      hit = true;
      break; // Stop the loop if we find a "Hit"
    }
  }

  // Redraw existing circles to clear any previous "Hit" or "Miss" text
  redrawCircles();

  // Show "Hit" or "Miss" based on whether a circle is beneath the cursor
  const message = hit ? 'Hit' : 'Miss';
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(message, clickX, clickY);
});

// Feature 2: Delete a circle on double click
canvas.addEventListener('dblclick', (e) => {
  const clickX = e.offsetX;
  const clickY = e.offsetY;

  // Find the circle that was double clicked
  circles = circles.filter(circle => !isInsideCircle(clickX, clickY, circle));

  // Redraw after deleting the circle
  redrawCircles();

  // If no circles remain, reset the flag
  if (circles.length === 0) {
    isCircleDrawn = false;
  }
});
