import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_GASTOS = 'gastos';

const gastosIniciales = [
  {
    id: '1',
    descripcion: 'Supermercado',
    monto: 15000,
    categoria: 'Alimentación',
  },
  {
    id: '2',
    descripcion: 'Nafta',
    monto: 20000,
    categoria: 'Transporte',
  },
  {
    id: '3',
    descripcion: 'Café',
    monto: 3500,
    categoria: 'Alimentación',
  },
];

export async function obtenerGastos() {
  const datosGuardados = await AsyncStorage.getItem(CLAVE_GASTOS);

  if (datosGuardados !== null) {
    return JSON.parse(datosGuardados);
  }

  await guardarGastos(gastosIniciales);

  return gastosIniciales;
}

export async function guardarGastos(gastos) {
  await AsyncStorage.setItem(
    CLAVE_GASTOS,
    JSON.stringify(gastos)
  );
}