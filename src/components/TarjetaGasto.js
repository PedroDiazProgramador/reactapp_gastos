import { View, Text, StyleSheet } from 'react-native';

export default function TarjetaGasto({ gasto }) {
  return (
    <View style={styles.tarjeta}>
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