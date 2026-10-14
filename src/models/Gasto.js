export function crearGasto(descripcion, monto, categoria) {
  return {
    id: Date.now().toString(),
    descripcion: descripcion.trim(),
    monto: Number(monto),
    categoria: categoria.trim(),
  };
}

export function validarGasto(descripcion, monto, categoria) {
  if (!descripcion.trim() || !monto || !categoria.trim()) {
    return 'Completá todos los campos.';
  }

  if (!Number.isFinite(Number(monto)) || Number(monto) <= 0) {
    return 'Ingresá un monto válido mayor que cero.';
  }

  return null;
}