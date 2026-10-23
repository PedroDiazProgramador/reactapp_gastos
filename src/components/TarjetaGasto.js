
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

export default function TarjetaGasto({
  gasto,
  onEliminar,
  onEditar,
}) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.informacion}>
        <Text style={styles.descripcion}>
          {gasto.descripcion}
        </Text>

        <Text style={styles.categoria}>
          {gasto.categoria}
        </Text>

        <Text style={styles.monto}>
          ${gasto.monto.toLocaleString('es-AR')}
        </Text>
      </View>

      <View style={styles.acciones}>
        <Pressable
          style={styles.botonEditar}
          onPress={onEditar}
          accessibilityRole="button"
          accessibilityLabel={`Editar gasto ${gasto.descripcion}`}
        >
          <Text style={styles.textoEditar}>
            Editar
          </Text>
        </Pressable>

        <Pressable
          style={styles.botonEliminar}
          onPress={onEliminar}
          accessibilityRole="button"
          accessibilityLabel={`Eliminar gasto ${gasto.descripcion}`}
        >
          <Text style={styles.textoEliminar}>
            Eliminar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  informacion: {
    flex: 1,
    marginRight: 12,
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
    marginTop: 6,
  },
  acciones: {
    alignItems: 'stretch',
    gap: 8,
  },
  botonEditar: {
    backgroundColor: '#E7EFE8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoEditar: {
    color: '#53745B',
    fontSize: 13,
    fontWeight: '600',
  },
  botonEliminar: {
    backgroundColor: '#FBE9E7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoEliminar: {
    color: '#B3261E',
    fontSize: 13,
    fontWeight: '600',
  },
});

