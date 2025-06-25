const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// أجزاء الخلية العصبية
const neuronParts = [
  { name: "جسم الخلية", x: 400, y: 300, placed: false },
  { name: "المحور (Axon)", x: 500, y: 300, placed: false },
  { name: "الشجرة العصبية", x: 300, y: 300, placed: false },
  { name: "الغشاء المايليني", x: 550, y: 300, placed: false },
  { name: "التشابك العصبي", x: 600, y: 300, placed: false }
];

let draggedPart = null;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // خطوط الإرشاد
  ctx.setLineDash([5]);
  ctx.strokeStyle = "#999";
  ctx.strokeRect(380, 280, 40, 40); // جسم الخلية
  ctx.strokeRect(480, 280, 40, 40); // Axon
  ctx.strokeRect(280, 280, 40, 40); // Dendrites
  ctx.setLineDash([]);

  // رسم الأجزاء
  neuronParts.forEach(part => {
    ctx.fillStyle = part.placed ? "#aaa" : "#007acc";
    ctx.fillRect(part.x, part.y, 40, 40);
    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.fillText(part.name.split(" ")[0], part.x + 2, part.y + 25);
  });

  if (neuronParts.every(p => p.placed)) {
    document.getElementById("infoBox").innerHTML = `
      🎉 رائع! لقد بنيت خلية عصبية كاملة!<br>
      <button onclick="completeLevel()">إكمال المستوى</button>
    `;
  }
}

function completeLevel() {
  alert("✅ تهانينا! لقد أتممت بناء خلية عصبية.");
  document.getElementById("infoBox").innerHTML = `
    📜 شهادة إنجاز<br>
    <strong>أنت الآن قادر على بناء خلايا عصبية!</strong><br>
    تم إنهاء المستوى بنجاح.
  `;
}

canvas.addEventListener("mousedown", e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  neuronParts.forEach(part => {
    if (!part.placed &&
        mouseX > part.x && mouseX < part.x + 40 &&
        mouseY > part.y && mouseY < part.y + 40) {
      draggedPart = part;
    }
  });
});

canvas.addEventListener("mousemove", e => {
  if (draggedPart) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    draggedPart.x = mouseX - 20;
    draggedPart.y = mouseY - 20;
    draw();
  }
});

canvas.addEventListener("mouseup", () => {
  if (draggedPart) {
    if (draggedPart.name === "جسم الخلية" && draggedPart.x > 370 && draggedPart.x < 390)
      draggedPart.placed = true;

    if (draggedPart.name === "المحور (Axon)" && draggedPart.x > 470 && draggedPart.x < 490)
      draggedPart.placed = true;

    if (draggedPart.name === "الشجرة العصبية" && draggedPart.x > 270 && draggedPart.x < 290)
      draggedPart.placed = true;

    draggedPart = null;
    draw();
  }
});

draw(); // بدء اللعبة
