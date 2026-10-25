import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const products = [
  { name: "PurifiX PureFlow RO", type: "RO + UV Water Purifier", price: "₹12,999" },
  { name: "PurifiX AquaShield", type: "UV + UF Water Purifier", price: "₹8,499" },
  { name: "PurifiX MineralPro", type: "RO + Mineral Enrichment", price: "₹15,499" },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.brand}>PurifiX</Text>
      <Text style={styles.tagline}>Pure water. Better living.</Text>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>CLEAN WATER, EVERY DAY</Text>
        <Image
  source={{
    uri: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=900&h=600&fit=crop&auto=format&q=75",
  }}
  style={{
    width: "100%",
    height: 210,
    borderRadius: 20,
  }}
  contentFit="cover"
  cachePolicy="memory-disk"
  transition={180}
  accessibilityLabel="Clean drinking water"
/>
        <Text style={styles.heroTitle}>A purer sip starts here.</Text>
        <Text style={styles.heroText}>
          Explore water purification designed for your home.cd "F:\water app\PurifiX"

$file = ".\src\lib\firebase.ts"
$content = Get-Content -Raw $file
$content = $content -replace '(?m)^\s*projectId:.*$', '  projectId: "purifixro",'
Set-Content -Path $file -Value $content -Encoding utf8

Select-String -Path $file -Pattern "projectId"
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Popular purifiers</Text>

      {products.map((product) => (
        <View key={product.name} style={styles.product}>
          <View style={styles.productIcon}>
            <Text style={styles.drop}>◈</Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productType}>{product.type}</Text>
            <Text style={styles.price}>{product.price}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.footer}>
        Need help? Book a PurifiX service appointment.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F4F8FA" },
  content: { padding: 22, paddingTop: 36, paddingBottom: 48 },
  brand: { fontSize: 30, fontWeight: "800", color: "#087E8B" },
  tagline: { fontSize: 14, color: "#64748B", marginTop: 3 },
  hero: {
    backgroundColor: "#073B4C",
    borderRadius: 24,
    padding: 24,
    marginTop: 26,
    marginBottom: 28,
  },
  eyebrow: { color: "#7DE2D1", fontSize: 11, fontWeight: "700", letterSpacing: 1.5 },
  heroTitle: { color: "#FFFFFF", fontSize: 29, fontWeight: "800", marginTop: 14 },
  heroText: { color: "#D6E9EF", fontSize: 15, lineHeight: 23, marginTop: 10 },
  sectionTitle: { fontSize: 21, fontWeight: "800", color: "#102A43", marginBottom: 14 },
  product: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
  },
  productIcon: {
    width: 66,
    height: 76,
    borderRadius: 14,
    backgroundColor: "#DDF5F3",
    alignItems: "center",
    justifyContent: "center",
  },
  drop: { fontSize: 34, color: "#087E8B" },
  productInfo: { flex: 1, marginLeft: 14 },
  productName: { fontSize: 16, fontWeight: "700", color: "#102A43" },
  productType: { fontSize: 13, color: "#64748B", marginTop: 5 },
  price: { fontSize: 17, fontWeight: "800", color: "#087E8B", marginTop: 9 },
  footer: { textAlign: "center", color: "#64748B", marginTop: 18, lineHeight: 22 },
});
