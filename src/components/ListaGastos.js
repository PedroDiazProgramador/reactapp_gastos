import { ScrollView, Text, StyleSheet } from 'react-native';
import TarjetaGasto from './TarjetaGasto';

export default function ListaGastos({ gastos }) {
  if (gastos.length === 0) {
    return (
      <Text style={styles.vacio}>
        Todavía no hay gastos registrados.
      </Text>
    );
  }

  return (
    <ScrollView>
      {gastos.map((gasto) => (
        <TarjetaGasto
          key={gasto.id}
          gasto={gasto}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  vacio: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777777',
  },
});