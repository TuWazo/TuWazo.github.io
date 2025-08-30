// Navbar y Hamburgesa 
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

// Cambia color de navbar al hacer scroll
document.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Toggle del menú hamburguesa con animación de botones
if(hamburger && navLinks){
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    hamburger.classList.toggle("active");

    if(navLinks.classList.contains("show")){
      navbar.classList.add("menu-open");

      navLinks.querySelectorAll("a").forEach((link, index) => {
        link.style.transition = `transform 0.3s ease ${index * 0.1}s, opacity 0.3s ease ${index * 0.1}s`;
        link.style.transform = "translateY(0)";
        link.style.opacity = "1";
      });
    } else {
      navbar.classList.remove("menu-open");

      navLinks.querySelectorAll("a").forEach((link) => {
        link.style.transition = "";
        link.style.transform = "translateY(-20px)";
        link.style.opacity = "0";
      });
    }
  });

  // Cerrar menú al pulsar un enlace
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
      hamburger.classList.remove("active");
      navbar.classList.remove("menu-open");
    });
  });
}

// Mapa Leaflet
const negocioCoords = [39.466783, -0.385269];
const map = L.map('map').setView(negocioCoords, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Marcador del negocio
L.marker(negocioCoords).addTo(map)
  .bindPopup("<b>Foto Express</b><br>C/ de l'Historiador Diago, 17")
  .openPopup();

// Geolocalización del cliente y ruta
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const userCoords = [pos.coords.latitude, pos.coords.longitude];

    L.Routing.control({
      waypoints: [
        L.latLng(userCoords),
        L.latLng(negocioCoords)
      ],
      routeWhileDragging: true,
      language: 'es'
    }).addTo(map);

    L.marker(userCoords).addTo(map)
      .bindPopup("Tu ubicación")
      .openPopup();
  }, () => {
    alert("No se pudo obtener tu ubicación.");
  });
} else {
  alert("La geolocalización no está soportada en este navegador.");
}
