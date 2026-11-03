
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { CATEGORIAS } from '../constants/categorias';

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
  //para filtrar
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');

  const [gastoEnEdicion, setGastoEnEdicion] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const modoEdicion = gastoEnEdicion !== null;

  
  //filtrar gastos según la categoría seleccionada
  const gastosFiltrados = gastos.filter((gasto) => {
    return (
      categoriaFiltro === '' ||
      gasto.categoria === categoriaFiltro
    );
  });

  //calcular total de los gastos filtrados
  //para total de gastos, recorre los gastos y va sumando
  const totalGastado = gastosFiltrados.reduce(
    (total, gasto) => total + Number(gasto.monto || 0),
    0
  );

  //para la cantidad de gastos, cuenta lo filtyrado
  const cantidadGastos = gastosFiltrados.length;

  //formato del total
  const totalFormateado = totalGastado.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
    setMostrarFormulario(false);
  };

  //Abrir un nuevo formulario para nevio gasto
  const abrirFormulario = () => {
    setDescripcion('');
    setMonto('');
    setCategoria('');
    setGastoEnEdicion(null);
    setMostrarFormulario(true);
  };
  //fin Abrir un nuevo formulario para nevio gasto

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

    //abrir formulario para editar
    setMostrarFormulario(true);
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

    {!mostrarFormulario ? (
      <>
        {/* PANTALLA PRINCIPAL */}

        <Text style={styles.titulo}>
          Mis gastos
        </Text>

        <Text style={styles.subtitulo}>
          Registro de gastos personales
        </Text>

        <Pressable
          style={styles.botonAgregar}
          onPress={abrirFormulario}
          disabled={guardando}
        >
          <Text style={styles.textoBotonAgregar}>
            + Agregar gasto
          </Text>
        </Pressable>
        <View style={styles.contenedorFiltro}>
          <Text style={styles.etiquetaFiltro}>
            Filtrar por categoría
          </Text>

          <View style={styles.selectorFiltro}>
            <Picker
              selectedValue={categoriaFiltro}
              onValueChange={(valor) => setCategoriaFiltro(valor)}
            >
              <Picker.Item
                label="Todas las categorías"
                value=""
              />

              {CATEGORIAS.map((item) => (
                <Picker.Item
                  key={item.id}
                  label={item.nombre}
                  value={item.nombre}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Total de gastos */}
        <View style={styles.contenedorTotal}>
          <Text style={styles.etiquetaTotal}>
            {categoriaFiltro === ''
              ? 'Total gastado'
              : `Total en ${categoriaFiltro}`}
          </Text>

          <Text style={styles.valorTotal}>
            $ {totalFormateado}
          </Text>

          {/* Mostrar la cantidad de gastos */}
          <Text style={styles.cantidadGastos}>
            Cantidad de gastos: {cantidadGastos}
          </Text>
        </View>
        {/* Fin Total de gastos */}

        {/* Lista de gastos, todos y filtrados */}
        <ListaGastos
          gastos={gastosFiltrados}
          onEliminarGasto={manejarEliminar}
          onEditarGasto={manejarEditar}
        />
      </>
    ) : (
      <>
        {/* PANTALLA DEL FORMULARIO */}

        <Text style={styles.titulo}>
          {modoEdicion ? 'Editar gasto' : 'Nuevo gasto'}
        </Text>

        <Text style={styles.subtitulo}>
          {modoEdicion
            ? 'Modificar los datos del gasto'
            : 'Ingresar los datos del nuevo gasto'}
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

        <Pressable
          style={styles.botonCancelar}
          onPress={limpiarFormulario}
          disabled={guardando}
        >
          <Text style={styles.textoCancelar}>
            Cancelar y volver
          </Text>
        </Pressable>
      </>
    )}

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

  botonAgregar: {
    backgroundColor: '#53745B',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  textoBotonAgregar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  //Para mostrar el total
  contenedorTotal: {
    backgroundColor: '#E3EDE5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C5D8CA',
  },

  etiquetaTotal: {
    fontSize: 16,
    color: '#53745B',
    fontWeight: '600',
    marginBottom: 8,
  },

  valorTotal: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2F5138',
  },

  //FILTRO
    contenedorFiltro: {
    marginBottom: 15,
  },

  etiquetaFiltro: {
    fontSize: 15,
    fontWeight: '600',
    color: '#53745B',
    marginBottom: 8,
  },

  selectorFiltro: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C5D8CA',
    borderRadius: 10,
    overflow: 'hidden',
  },

  cantidadGastos: {
    fontSize: 13,
    color: '#53745B',
    marginTop: 8,
  },
});
