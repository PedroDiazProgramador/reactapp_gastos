import {
  obtenerGastos,
  guardarGastos,
} from '../repositories/GastosRepository';

import {
  crearGasto,
  validarGasto,
} from '../models/Gasto';

export async function cargarGastos() {
  return await obtenerGastos();
}

export async function agregarGasto(
  gastosActuales,
  descripcion,
  monto,
  categoria
) {
  const error = validarGasto(descripcion, monto, categoria);

  if (error) {
    throw new Error(error);
  }

  const nuevoGasto = crearGasto(
    descripcion,
    monto,
    categoria
  );

  const nuevosGastos = [...gastosActuales, nuevoGasto];

  await guardarGastos(nuevosGastos);

  return nuevosGastos;
}