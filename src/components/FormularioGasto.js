import { Picker } from '@react-native-picker/picker';
import { CATEGORIAS } from '../constants/categorias';


import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function FormularioGasto({
  descripcion,
  setDescripcion,
  monto,
  setMonto,
  categoria,
  setCategoria,
  onAgregar,
  onEditar,
  modoEdicion,
  deshabilitado,
}) {
  return (
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
        keyboardType="decimal-pad"
      />

      {/* <TextInput
        style={styles.input}
        placeholder="Categoría"
        value={categoria}
        onChangeText={setCategoria}
      /> */}

      <Picker selectedValue={categoria} onValueChange={(valor) => setCategoria(valor)} >
        <Picker.Item label="Seleccione una categoría" value=""/>

        {CATEGORIAS.map((item) => (
          <Picker.Item
            key={item.id}
            label={item.nombre}
            value={item.nombre}
          />
        ))}
      </Picker>

      <Pressable
        style={[
          styles.boton,
          deshabilitado && styles.botonDeshabilitado,
        ]}
        onPress={modoEdicion ? onEditar : onAgregar}
        disabled={deshabilitado}
      >
        <Text style={styles.textoBoton}>
          {modoEdicion ? 'Guardar cambios' : 'Agregar gasto'}
        </Text>
      </Pressable>

      {modoEdicion && (
        <Text style={styles.textoEdicion}>
          Estás editando un gasto existente.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  botonDeshabilitado: {
    opacity: 0.5,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoEdicion: {
    color: '#777777',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  },
});
