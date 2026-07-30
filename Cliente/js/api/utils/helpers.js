export function mostrarMensaje(mensaje, tipo = 'error') {
  alert(mensaje);
}

export function confirmarAccion(mensaje) {
  return confirm(mensaje);
}
