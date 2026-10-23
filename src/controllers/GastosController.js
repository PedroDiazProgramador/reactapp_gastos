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


export async function editarGasto(
  gastosActuales,
  id,
  descripcion,
  monto,
  categoria
) {
  const error = validarGasto(descripcion, monto, categoria);

  if (error) {
    throw new Error(error);
  }

  const gastoEditado = {
    id,
    descripcion: descripcion.trim(),
    monto: Number(monto),
    categoria: categoria.trim(),
  };

  const nuevosGastos = gastosActuales.map((gasto) =>
    gasto.id === id ? gastoEditado : gasto
  );

  await guardarGastos(nuevosGastos);

  return nuevosGastos;
}


export async function eliminarGasto(gastosActuales, id) {
  const nuevosGastos = gastosActuales.filter(
    (gasto) => gasto.id !== id
  );

  await guardarGastos(nuevosGastos);

  return nuevosGastos;
}