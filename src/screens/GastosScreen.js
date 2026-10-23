
import { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';

import {
  cargarGastos,
  agregarGasto,
  eliminarGasto,
  editarGasto,
} from '../controllers/GastosController';

import FormularioGasto from '../components/FormularioGasto';
import ListaGastos from '../components/ListaGastos';

export default function GastosScreen() {
  const [gastos, setGastos] = useState([]);

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');

  const [gastoEnEdicion, setGastoEnEdicion] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const modoEdicion = gastoEnEdicion !== null;

  useEffect(() => {
    async function iniciar() {
      try {
        const datos = await cargarGastos();
        setGastos(datos);
      } catch (error) {
        Alert.alert(
          'Error',
          'No se pudieron cargar los gastos.'
        );
      } finally {
        setCargando(false);
      }
    }

    iniciar();
  }, []);

  const limpiarFormulario = () => {
    setDescripcion('');
    setMonto('');
    setCategoria('');
    setGastoEnEdicion(null);
  };

  const manejarAgregar = async () => {
    if (guardando || cargando) {
      return;
    }

    try {
      setGuardando(true);

      const nuevosGastos = await agregarGasto(
        gastos,
        descripcion,
        monto,
        categoria
      );

      setGastos(nuevosGastos);
      limpiarFormulario();
    } catch (error) {
      Alert.alert(
        'No se pudo agregar el gasto',
        error.message || 'Ocurrió un error inesperado.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const manejarEditar = (gasto) => {
    setGastoEnEdicion(gasto.id);
    setDescripcion(gasto.descripcion);
    setMonto(String(gasto.monto));
    setCategoria(gasto.categoria);
  };

  const manejarGuardarEdicion = async () => {
    if (guardando || cargando || gastoEnEdicion === null) {
      return;
    }

    try {
      setGuardando(true);

      const nuevosGastos = await editarGasto(
        gastos,
        gastoEnEdicion,
        descripcion,
        monto,
        categoria
      );

      setGastos(nuevosGastos);
      limpiarFormulario();
    } catch (error) {
      Alert.alert(
        'No se pudieron guardar los cambios',
        error.message || 'Ocurrió un error inesperado.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminar = (id) => {
    if (guardando || cargando) {
      return;
    }

    Alert.alert(
      'Eliminar gasto',
      '¿Estás seguro de que querés eliminar este gasto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (guardando) {
              return;
            }

            try {
              setGuardando(true);

              const nuevosGastos = await eliminarGasto(
                gastos,
                id
              );

              setGastos(nuevosGastos);

              if (gastoEnEdicion === id) {
                limpiarFormulario();
              }
            } catch (error) {
              Alert.alert(
                'Error',
                'No se pudo eliminar el gasto.'
              );
            } finally {
              setGuardando(false);
            }
          },
        },
      ]
    );
  };

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#53745B" />
        <Text style={styles.textoCargando}>
          Cargando gastos...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis gastos</Text>

      <Text style={styles.subtitulo}>
        Registro de gastos personales
      </Text>

      <FormularioGasto
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        monto={monto}
        setMonto={setMonto}
        categoria={categoria}
        setCategoria={setCategoria}
        onAgregar={manejarAgregar}
        onEditar={manejarGuardarEdicion}
        modoEdicion={modoEdicion}
        deshabilitado={guardando}
      />

      {modoEdicion && (
        <Pressable
          style={styles.botonCancelar}
          onPress={limpiarFormulario}
          disabled={guardando}
        >
          <Text style={styles.textoCancelar}>
            Cancelar edición
          </Text>
        </Pressable>
      )}

      <ListaGastos
        gastos={gastos}
        onEliminarGasto={manejarEliminar}
        onEditarGasto={manejarEditar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EF',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitulo: {
    fontSize: 15,
    color: '#777777',
    marginTop: 5,
    marginBottom: 20,
  },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4EF',
  },
  textoCargando: {
    marginTop: 12,
    color: '#777777',
  },
  botonCancelar: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  textoCancelar: {
    color: '#777777',
    fontWeight: '600',
  },
});
