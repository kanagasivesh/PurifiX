import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

type Product = { id: string; name?: string; category?: string; technology?: string; priceINR?: number; price?: number; active?: boolean };

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const q = query(collection(db, "products"), where("active", "==", true));
    return onSnapshot(q, snapshot => {
      const rows = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      rows.sort((x, y) => (x.name || "").localeCompare(y.name || ""));
      setProducts(rows); setError(""); setLoading(false);
    }, err => {
      console.error("Firestore products error", err);
      setError("Prices are temporarily unavailable. Please try again shortly."); setLoading(false);
    });
  }, []);
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}>
    <Text style={styles.brand}>PurifiX</Text>
    <Text style={styles.tagline}>Pure water. Better living.</Text>
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>CLEAN WATER, EVERY DAY</Text>
      <Image source={{ uri: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=900&h=600&fit=crop&auto=format&q=75" }} style={styles.heroImage} contentFit="cover" cachePolicy="memory-disk" transition={180} accessibilityLabel="Clean drinking water" />
      <Text style={styles.heroTitle}>A purer sip starts here.</Text>
      <Text style={styles.heroText}>Explore water purification designed for your home.</Text>
    </View>
    <Text style={styles.sectionTitle}>Popular purifiers</Text>
    {loading ? <ActivityIndicator size="large" color="#087E8B" style={styles.loader} /> :
      error ? <Text style={styles.message}>{error}</Text> :
      products.length === 0 ? <Text style={styles.message}>No active products are available right now.</Text> :
      products.slice(0, 8).map(p => {
        const price = p.priceINR ?? p.price;
        return <View key={p.id} style={styles.product}>
          <View style={styles.productIcon}><Text style={styles.drop}>◈</Text></View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{p.name || "PurifiX Water Purifier"}</Text>
            <Text style={styles.productType}>{p.technology || p.category || "Water Purifier"}</Text>
            <Text style={styles.price}>{typeof price === "number" ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price) : "Price unavailable"}</Text>
          </View>
        </View>;
      })}
    <Text style={styles.footer}>Need help? Book a PurifiX service appointment.</Text>
  </ScrollView>;
}
const styles = StyleSheet.create({
 page:{flex:1,backgroundColor:"#F4F8FA"}, content:{padding:22,paddingTop:36,paddingBottom:48},
 brand:{fontSize:30,fontWeight:"800",color:"#087E8B"}, tagline:{fontSize:14,color:"#64748B",marginTop:3},
 hero:{backgroundColor:"#073B4C",borderRadius:24,padding:24,marginTop:26,marginBottom:28},
 eyebrow:{color:"#7DE2D1",fontSize:11,fontWeight:"700",letterSpacing:1.5}, heroImage:{width:"100%",height:210,borderRadius:20,marginTop:14},
 heroTitle:{color:"#FFFFFF",fontSize:29,fontWeight:"800",marginTop:14}, heroText:{color:"#D6E9EF",fontSize:15,lineHeight:23,marginTop:10},
 sectionTitle:{fontSize:21,fontWeight:"800",color:"#102A43",marginBottom:14},
 product:{flexDirection:"row",backgroundColor:"#FFFFFF",borderRadius:18,padding:14,marginBottom:12,alignItems:"center"},
 productIcon:{width:66,height:76,borderRadius:14,backgroundColor:"#DDF5F3",alignItems:"center",justifyContent:"center"},
 drop:{fontSize:34,color:"#087E8B"},productInfo:{flex:1,marginLeft:14},productName:{fontSize:16,fontWeight:"700",color:"#102A43"},
 productType:{fontSize:13,color:"#64748B",marginTop:5},price:{fontSize:17,fontWeight:"800",color:"#087E8B",marginTop:9},
 loader:{marginVertical:24},message:{color:"#64748B",lineHeight:22,marginVertical:12},footer:{textAlign:"center",color:"#64748B",marginTop:18,lineHeight:22}
});