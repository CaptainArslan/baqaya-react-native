// Add ledger entry modal — placeholder
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Typography } from '@/src/theme';

export default function AddEntryScreen() {
  const { customerId, type } = useLocalSearchParams<{ customerId: string; type: 'udhaar' | 'payment' }>();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Entry — {type} for {customerId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  text: { fontSize: Typography.size.lg, color: Colors.textPrimary },
});
