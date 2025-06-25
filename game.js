const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let currentLevel = 1;
let score = 0;

// الصور المدمجة بصيغة Base64
const neuronImages = {
  "جسم الخلية": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA...",
  "المحور (Axon)": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA...",
  "الشجرة العصبية": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA...",
  "الغشاء المايليني": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA...",
  "التشابك العصبي": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA..."
};

// بيانات المستويات مع الصور
const levels = [
  {
    title: "مستوى 1: جسم الخلية والعصبون",
    parts: [
      { name: "جسم الخلية", x: 400, y: 300, placed: false, correctX: 380, correctY: 280 },
      { name: "المحور (Axon)", x: 500, y: 300, placed: false, correctX: 480, correctY: 280 },
      { name: "الشجرة العصبية", x: 300, y: 300, placed: false, correctX: 280, correctY: 280 }
    ],
    info: {
      "جسم الخلية": "هو مركز الخلية ويحتوي على النواة.",
      "المحور (Axon)": "ينقل الإشارات من الخلية إلى الخلايا الأخرى.",
      "الشجرة العصبية": "تستقبل الإشارات من الخلايا العصبية المجاورة."
    }
  },
  {
    title: "مستوى 2: الغشاء المايليني والتشابك",
    parts: [
      { name: "الغشاء المايليني", x: 550, y: 300, placed: false, correctX: 530, correctY: 280 },
      { name: "التشابك العصبي", x: 600, y: 300, placed: false, correctX: 580, correctY: 280 }
    ],
    info: {
      "الغشاء المايليني": "يحمي المحور العصبي ويسرع من نقل الإشارة.",
      "التشابك العصبي": "نقطة التواصل بين خلية وأخرى."
    }
  }
];

let draggedPart = null;
let imagesLoaded = 0;
const images = {};

function loadImages() {
  levels.forEach((level, i) => {
    level.parts.forEach(part => {
      const img = new Image();
      img.src = neuronImages[part.name];
      img.onload = () => {
        images[part.name] = img;
        imagesLoaded++;
        if (imagesLoaded === getTotalParts()) draw();
      };
    });
  });
}

function getTotalParts() {
  return levels.reduce((sum, level) => sum + level.parts.length, 0);
}

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  loadImages();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // رسم خطوط الإرشاد
  ctx.setLineDash([5]);
  ctx.strokeStyle = "#999";

  const level = levels[currentLevel - 1];
  level.parts.forEach(part => {
    ctx.strokeRect(part.correctX, part.correctY, 40, 40);
  });
  ctx.setLineDash([]);

  // رسم الأجزاء
  level.parts.forEach(part => {
    if (images[part.name]) {
      ctx.drawImage(images[part.name], part.x, part.y, 40, 40);
    }
  });

  if (level.parts.every(p => p.placed)) {
    document.getElementById("infoBox").innerHTML = `
      🎉 رائع! لقد أتممت المستوى ${currentLevel}!<br>
      <button onclick="nextLevel()">المستوى التالي</button><br>
      <strong>نقاطك الحالية: ${score += 10}</strong>
    `;
  }
}

function nextLevel() {
  if (currentLevel < levels.length) {
    currentLevel++;
    resetGame();
  } else {
    showCertificate();
  }
}

function showCertificate() {
  document.getElementById("infoBox").innerHTML = `
    📜 <strong>شهادة إنجاز</strong><br>
    لقد أتممت جميع مستويات لعبة BrainCraft.<br>
    🧠 أنت الآن قادر على فهم تركيب الخلية العصبية!<br>
    <strong>إجمالي النقاط: ${score}</strong>
  `;
}

function resetGame() {
  const level = levels[currentLevel - 1];
  level.parts.forEach(p => {
    p.placed = false;
    p.x = Math.random() * 600 + 100;
    p.y = Math.random() * 400 + 100;
  });
  document.getElementById("levelNum").innerText = currentLevel;
  document.getElementById("infoBox").innerText = "اسحب الأجزاء وضعها في أماكنها الصحيحة";
  draw();
}

canvas.addEventListener("mousedown", e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const level = levels[currentLevel - 1];
  level.parts.forEach(part => {
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
    const level = levels[currentLevel - 1];
    level.parts.forEach(part => {
      if (draggedPart === part) {
        const dx = Math.abs(part.x - part.correctX);
        const dy = Math.abs(part.y - part.correctY);
        if (dx < 20 && dy < 20) {
          part.x = part.correctX;
          part.y = part.correctY;
          part.placed = true;

          // عرض شرح الجزء
          document.getElementById("infoBox").innerHTML = `
            📘 <strong>${part.name}:</strong><br>
            ${level.info[part.name]}<br>
            <small>استمر في اللعب...</small>
          `;
        }
      }
    });
    draggedPart = null;
    draw();
  }
});

document.getElementById("levelNum").innerText = currentLevel;
