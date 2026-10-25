const fs = require("node:fs");
const path = require("node:path");
const admin = require("firebase-admin");

async function main() {
  const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!credentialPath || !fs.existsSync(credentialPath)) {
    throw new Error(
      "GOOGLE_APPLICATION_CREDENTIALS must point to your local service-account JSON file."
    );
  }

  const cataloguePath = path.join(__dirname, "..", "data", "catalogue.json");
  const products = JSON.parse(
    fs.readFileSync(cataloguePath, "utf8").replace(/^\uFEFF/, "")
  );

  if (!Array.isArray(products) || products.length < 50) {
    throw new Error("Expected at least 50 products in the catalogue.");
  }

  const serviceAccount = JSON.parse(
    fs.readFileSync(credentialPath, "utf8").replace(/^\uFEFF/, "")
  );

  if (serviceAccount.project_id !== "purifixro") {
    throw new Error("Service-account project ID does not match purifixro.");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "purifixro",
  });

  const db = admin.firestore();
  const batch = db.batch();

  for (const item of products) {
    if (!item.sku || typeof item.priceINR !== "number" ||
        typeof item.dealerPriceINR !== "number") {
      throw new Error(`Invalid product record: ${item.sku || "missing SKU"}`);
    }

    const { dealerPriceINR, ...publicProduct } = item;

    batch.set(db.collection("products").doc(item.sku), {
      ...publicProduct,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    batch.set(db.collection("dealerPrices").doc(item.sku), {
      sku: item.sku,
      priceINR: dealerPriceINR,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  }

  await batch.commit();

  console.log(`Uploaded ${products.length} public products.`);
  console.log(`Uploaded ${products.length} separate dealer price records.`);
}

main().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
});
