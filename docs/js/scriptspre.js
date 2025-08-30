document.addEventListener("DOMContentLoaded", () => {
  // Definición de servicios
  const servicios = {
    fotografia: {
      nombre: "Fotografía Profesional",
      precio: 100,
      extras: ["Con fondo personalizado", "Edición avanzada", "Entrega exprés", "No gracias"]
    },
    impresion: {
      nombre: "Impresión Personalizada",
      precio: 50,
      extras: ["Papel premium", "Tamaño A3", "Marco incluido", "No gracias"]
    },
    edicion: {
      nombre: "Edición y Retoque",
      precio: 75,
      extras: ["Corrección de color", "Eliminación de objetos", "Estilo cinematográfico", "No gracias"]
    }
  };

  // Variables globales
  let total = 0;
  const container = document.getElementById("servicios-container");
  const totalSpan = document.getElementById("total");
  const addButton = document.getElementById("agregar-servicio");
  const borrarTodoBtn = document.getElementById("borrar-todo");
  const volverBtn = document.getElementById("volver-principal");
  const telefonoInput = document.getElementById("telefono");
  const fechaInput = document.getElementById("fecha");

  // Configuración fecha mínima
  if (fechaInput) {
    const hoy = new Date();
    const plus2 = new Date(hoy);
    plus2.setDate(hoy.getDate() + 2);
    fechaInput.min = plus2.toISOString().split("T")[0];
  }

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

  //Fecha
  function parseLocalDate(yyyyMmDd) {
    if (!yyyyMmDd) return null;
    const [y, m, d] = yyyyMmDd.split("-").map(Number);
    return new Date(y, m - 1, d); // fecha local
  }
  function esFinde(yyyyMmDd) {
    const d = parseLocalDate(yyyyMmDd);
    if (!d) return false;
    const day = d.getDay(); // 0=Domingo, 6=Sábado
    return day === 0 || day === 6;
  }
 

  // Recalcular todos los servicios según la fecha seleccionada
  function recalcularTotal() {
    let nuevoTotal = 0;
    const aplicaDescuento = fechaInput && esFinde(fechaInput.value);

    container.querySelectorAll(".servicio").forEach(servicioDiv => {
      const precioBase = parseFloat(servicioDiv.dataset.precioBase);
      let precioFinal = aplicaDescuento ? precioBase * 0.9 : precioBase;

      nuevoTotal += precioFinal;

      // actualizar visual
      const precioP = servicioDiv.querySelector(".precio");
      if (precioP) {
        precioP.textContent = `Precio: ${precioFinal.toFixed(2)} €` +
          (aplicaDescuento ? " (10% descuento finde)" : "");
      }
    });

    total = nuevoTotal;
    if (totalSpan) totalSpan.textContent = `${total.toFixed(2)} €`;
  }

  function crearServicio() {
  }

  function mostrarFormulario() {
    const formulario = document.createElement("div");
    formulario.className = "formulario-servicio";

    // Selector de servicios
    const selectServicio = document.createElement("select");
    selectServicio.id = "select-servicio";
    selectServicio.innerHTML = `
      <option value="">Selecciona un servicio</option>
      <option value="fotografia">Fotografía Profesional</option>
      <option value="impresion">Impresión Personalizada</option>
      <option value="edicion">Edición y Retoque</option>
    `;

    // Contenedor de extras
    const extrasContainer = document.createElement("div");
    extrasContainer.id = "extras-container";
    extrasContainer.style.display = "none";

    // Botón confirmar
    const confirmarBtn = document.createElement("button");
    confirmarBtn.textContent = "Confirmar";
    confirmarBtn.disabled = true;
    confirmarBtn.classList.add("confirmar");

    // Mostrar extras al elegir servicio
    selectServicio.addEventListener("change", () => {
      const servicioSeleccionado = selectServicio.value;
      if (servicioSeleccionado) {
        const extras = servicios[servicioSeleccionado].extras;
        extrasContainer.innerHTML = extras
          .map(
            (extra) =>
              `<label><input type="checkbox" name="extra" value="${extra}"> ${extra}</label>`
          )
          .join("<br>");
        extrasContainer.style.display = "block";
        confirmarBtn.disabled = false;

        // Lógica "No gracias"
        const checkboxes = extrasContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
          checkbox.addEventListener("change", () => {
            if (checkbox.value === "No gracias" && checkbox.checked) {
              checkboxes.forEach((cb) => {
                if (cb.value !== "No gracias") cb.checked = false;
              });
            } else if (checkbox.value !== "No gracias" && checkbox.checked) {
              const noGraciasCheckbox = extrasContainer.querySelector(
                'input[value="No gracias"]'
              );
              if (noGraciasCheckbox) noGraciasCheckbox.checked = false;
            }
          });
        });
      } else {
        extrasContainer.style.display = "none";
        confirmarBtn.disabled = true;
      }
    });

    // Confirmar servicio
    confirmarBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const servicioSeleccionado = selectServicio.value;
      const extrasSeleccionados = Array.from(
        extrasContainer.querySelectorAll('input[type="checkbox"]:checked')
      ).map((cb) => cb.value);

      // Validación
      if (extrasSeleccionados.length === 0) {
        alert("Debes seleccionar al menos un extra o 'No gracias'.");
        return;
      }

      if (servicioSeleccionado) {
        // precio base sin descuentos
        let precioBase = servicios[servicioSeleccionado].precio;
        extrasSeleccionados.forEach((extra) => {
          if (extra !== "No gracias") precioBase += 10;
        });

        // crear div servicio con dataset
        const servicioDiv = document.createElement("div");
        servicioDiv.className = "servicio";
        servicioDiv.dataset.precioBase = precioBase; 
        servicioDiv.innerHTML = `
          <h3>${servicios[servicioSeleccionado].nombre}</h3>
          <p>Extras: ${extrasSeleccionados.join(", ")}</p>
          <p class="precio"></p>
        `;
        container.appendChild(servicioDiv);

        // recalcular para aplicar fecha actual
        recalcularTotal();

        formulario.remove();
      }
    });

    formulario.appendChild(selectServicio);
    formulario.appendChild(extrasContainer);
    formulario.appendChild(confirmarBtn);
    container.appendChild(formulario);
  }

  // Eventos
  if (borrarTodoBtn) {
    borrarTodoBtn.addEventListener("click", () => {
      container.innerHTML = "";
      total = 0;
      if (totalSpan) totalSpan.textContent = `${total.toFixed(2)} €`;
      crearServicio();
    });
  }

  if (volverBtn) {
    volverBtn.addEventListener("click", () => {
      window.location.href = "Index.html?reload=" + new Date().getTime();
    });
  }

  if (container) crearServicio();

  if (telefonoInput) {
    telefonoInput.addEventListener("input", () => {
      telefonoInput.value = telefonoInput.value.replace(/[^0-9]/g, "");
    });
  }

  if (addButton) {
    addButton.addEventListener("click", () => {
      mostrarFormulario();
    });
  }

  if (fechaInput) {
    fechaInput.addEventListener("change", () => {
      recalcularTotal();
    });
  }
});
