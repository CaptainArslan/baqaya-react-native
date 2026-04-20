// Privacy policy screen — placeholder
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '@/src/i18n';
import { Colors, Typography } from '@/src/theme';

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t.drawer.privacy}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  text: { fontSize: Typography.size.lg, color: Colors.textPrimary },
});
