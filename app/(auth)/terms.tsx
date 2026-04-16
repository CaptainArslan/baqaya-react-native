// Terms & conditions screen — placeholder
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '@/src/theme';

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Terms & Conditions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  text: { fontSize: Typography.size.lg, color: Colors.textPrimary },
});
