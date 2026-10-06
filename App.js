import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';

export default function App() {

  const [gastos, setGastos] = useState([]);

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');


  // Carga de datos inicial. traer de asinc
  useEffect(() => {
    cargarGastos();
  }, []);


  const cargarGastos = async () => {
    try {

      const datosGuardados = await AsyncStorage.getItem('gastos');

      if (datosGuardados) {

        const gastosGuardados = JSON.parse(datosGuardados);

        setGastos(gastosGuardados);

      } else {

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

        setGastos(gastosIniciales);

        await AsyncStorage.setItem(
          'gastos',
          JSON.stringify(gastosIniciales)
        );
      }

    } catch (error) {

      console.log('Error al cargar los gastos:', error);

    }
  };


  const agregarGasto = async () => {

    if (!descripcion || !monto || !categoria) {
      return;
    }

    const nuevoGasto = {
      id: Date.now().toString(),
      descripcion: descripcion,
      monto: Number(monto),
      categoria: categoria,
    };


    const nuevosGastos = [...gastos, nuevoGasto];


    // refresh de pant.
    setGastos(nuevosGastos);


    // Guardardamos en async
    try {

      await AsyncStorage.setItem(
        'gastos',
        JSON.stringify(nuevosGastos)
      );

    } catch (error) {

      console.log('Error al guardar el gasto:', error);

    }


    //form limpio
    setDescripcion('');
    setMonto('');
    setCategoria('');
  };


  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Mis gastos
      </Text>

      <Text style={styles.subtitulo}>
        Registro de gastos personales
      </Text>


      {/* FORMULARIO */}

      <View style={styles.formulario}>

        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
        />

        <TextInput
          style={styles.input}
          placeholder="Monto"
          value={monto}
          onChangeText={setMonto}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Categoría"
          value={categoria}
          onChangeText={setCategoria}
        />

        <Pressable
          style={styles.boton}
          onPress={agregarGasto}
        >

          <Text style={styles.textoBoton}>
            Agregar gasto
          </Text>

        </Pressable>

      </View>


      {/* LISTA DE GASTOS */}

      <ScrollView>

        {gastos.map((gasto) => (

          <View
            key={gasto.id}
            style={styles.tarjeta}
          >

            <View>

              <Text style={styles.descripcion}>
                {gasto.descripcion}
              </Text>

              <Text style={styles.categoria}>
                {gasto.categoria}
              </Text>

            </View>

            <Text style={styles.monto}>
              ${gasto.monto.toLocaleString('es-AR')}
            </Text>

          </View>

        ))}

      </ScrollView>

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

  formulario: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 15,
  },

  boton: {
    backgroundColor: '#53745B',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  tarjeta: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  descripcion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },

  categoria: {
    fontSize: 13,
    color: '#777777',
    marginTop: 5,
  },

  monto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#53745B',
  },

});