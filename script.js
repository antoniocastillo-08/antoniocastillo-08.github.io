// ============================================
// Renderizado de proyectos desde projects.json
// ============================================
//
// Estructura esperada de cada proyecto en projects.json:
// {
//   "name": "",
//   "date": "",          // ej. "2026-02" o "Febrero 2026"
//   "image": "",         // ruta/URL. Si está vacío -> imagen aleatoria entre 4 por defecto
//   "description": "",
//   "media": "",         // opcional: enlace a demo/vídeo/gif
//   "url": ""            // opcional: enlace al repo o proyecto
// }

const DEFAULT_IMAGES = [
  "assets/defaults/default-1.svg",
  "assets/defaults/default-2.svg",
  "assets/defaults/default-3.svg",
  "assets/defaults/default-4.svg",
];

function pickRandomDefaultImage() {
  const index = Math.floor(Math.random() * DEFAULT_IMAGES.length);
  return DEFAULT_IMAGES[index];
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  // Acepta "YYYY-MM", "YYYY-MM-DD" o texto libre (ej. "Marzo 2025"); si no
  // reconoce un formato de fecha estándar, lo muestra tal cual.
  const parts = dateStr.split("-");
  const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  if (parts.length >= 2 && !isNaN(parts[1])) {
    const mesIndex = parseInt(parts[1], 10) - 1;
    if (mesIndex >= 0 && mesIndex < 12) {
      return `${meses[mesIndex]} ${parts[0]}`;
    }
  }
  return dateStr;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function buildProjectCard(project) {
  const image = project.image && project.image.trim() !== ""
    ? project.image
    : pickRandomDefaultImage();

  const card = document.createElement("article");
  card.className = "project-card";

  const links = [];
  if (project.url && project.url.trim() !== "") {
    links.push(`<a href="${escapeHtml(project.url)}" target="_blank" rel="noopener">Ver en GitHub →</a>`);
  }
  if (project.media && project.media.trim() !== "") {
    links.push(`<a href="${escapeHtml(project.media)}" target="_blank" rel="noopener">Ver demo</a>`);
  }

  card.innerHTML = `
    <div class="project-thumb">
      <img src="${escapeHtml(image)}" alt="${escapeHtml(project.name || "Proyecto")}" loading="lazy">
    </div>
    <div class="project-body">
      ${project.date ? `<span class="project-date">${escapeHtml(formatDate(project.date))}</span>` : ""}
      <h3>${escapeHtml(project.name || "Sin título")}</h3>
      <p>${escapeHtml(project.description || "")}</p>
      ${links.length ? `<div class="project-links">${links.join("")}</div>` : ""}
    </div>
  `;

  return card;
}

function renderEmptyState(container, message) {
  container.innerHTML = `<div class="projects-empty">${message}</div>`;
}

async function loadProjects() {
  const container = document.getElementById("project-grid");
  if (!container) return;

  try {
    const response = await fetch("projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const projects = await response.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      renderEmptyState(container, "Todavía no hay proyectos en projects.json.");
      return;
    }

    // Ordena por fecha descendente cuando el formato es comparable (YYYY-MM[-DD])
    const sorted = [...projects].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    container.innerHTML = "";
    sorted.forEach((project) => container.appendChild(buildProjectCard(project)));
  } catch (err) {
    console.error("No se pudo cargar projects.json:", err);
    renderEmptyState(
      container,
      "No se pudo cargar projects.json. Si abriste el archivo directamente con file://, sírvelo con un servidor local (ej. `python3 -m http.server`) o súbelo a GitHub Pages."
    );
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);