export function mostrarNotificacion(mensaje, tipo = 'error') {
  const container = document.getElementById('notificaciones') || crearContenedorNotificaciones();
  const notificacion = document.createElement('div');
  notificacion.className = `notificacion notificacion-${tipo}`;
  notificacion.textContent = mensaje;
  container.appendChild(notificacion);
  setTimeout(() => notificacion.remove(), 3000);
}

function crearContenedorNotificaciones() {
  const div = document.createElement('div');
  div.id = 'notificaciones';
  document.body.appendChild(div);
  return div;
}

export function mostrarConfirmacion(mensaje) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-confirmacion">
        <p>${mensaje}</p>
        <div class="modal-acciones">
          <button class="btn-cancelar">Cancelar</button>
          <button class="btn-confirmar">Eliminar</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    overlay.querySelector('.btn-confirmar').onclick = () => {
      overlay.remove();
      resolve(true);
    };
    overlay.querySelector('.btn-cancelar').onclick = () => {
      overlay.remove();
      resolve(false);
    };
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        resolve(false);
      }
    });
  });
}

export function mostrarCargando(mostrar = true) {
  let spinner = document.getElementById('loading-spinner');
  if (mostrar) {
    if (!spinner) {
      spinner = document.createElement('div');
      spinner.id = 'loading-spinner';
      spinner.className = 'loading-spinner';
      spinner.innerHTML = '<div class="spinner"></div>';
      document.body.appendChild(spinner);
    }
    spinner.style.display = 'flex';
  } else if (spinner) {
    spinner.style.display = 'none';
  }
}
