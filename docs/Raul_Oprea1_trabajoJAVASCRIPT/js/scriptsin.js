document.addEventListener("DOMContentLoaded", () => {

  //Dezplazamiento suave
  function agregarDesplazamientoSuave() {
    const botones = document.querySelectorAll(".btn[href^='#']"); 
    botones.forEach(boton => {
      boton.addEventListener("click", (event) => {
        event.preventDefault(); 
        const targetId = boton.getAttribute("href"); 
        const targetElement = document.querySelector(targetId); 
        if(targetElement){
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });
  }
  agregarDesplazamientoSuave();

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
        navLinks.querySelectorAll("a").forEach((lnk) => {
          lnk.style.transition = "";
          lnk.style.transform = "translateY(-20px)";
          lnk.style.opacity = "0";
        });
      });
    });
  }

  //Carga de Noticias
  const contenedor = document.getElementById("contenedor-noticias");
  if(contenedor){
    fetch("../json/Noticias.json")
      .then(res => res.json())
      .then(noticias => {
        noticias.forEach(noticia => {
          const div = document.createElement("div");
          div.classList.add("noticia");
          div.innerHTML = `
            <h2>${noticia.titulo}</h2>
            <p><strong>${noticia.fecha}</strong></p>
            <p>${noticia.contenido}</p>
            <hr>
          `;
          contenedor.appendChild(div);
        });
      })
      .catch(error => {
        contenedor.innerHTML = "No se pudieron cargar las noticias 😢";
        console.error(error);
      });
  }

  //Inicializa estado de los botones
  if(navLinks){
    navLinks.querySelectorAll("a").forEach((link) => {
      link.style.transform = "translateY(-20px)";
      link.style.opacity = "0";
    });
  }

});
