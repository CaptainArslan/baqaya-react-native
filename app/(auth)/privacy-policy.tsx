// Privacy policy screen — placeholder
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '@/src/theme';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Privacy Policy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  text: { fontSize: Typography.size.lg, color: Colors.textPrimary },
});
