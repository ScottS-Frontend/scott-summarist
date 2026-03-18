import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export interface Price {
  id: string;
  unit_amount: number;
  currency: string;
  interval?: string;
  product: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  prices: Price[];
}

export const getProducts = async (): Promise<Product[]> => {
  const productsRef = collection(db, "products");
  const productsSnapshot = await getDocs(productsRef);

  const pricesRef = collection(db, "prices");
  const pricesSnapshot = await getDocs(pricesRef);

  const products: Product[] = [];

  for (const productDoc of productsSnapshot.docs) {
    const productData = productDoc.data();

    const productPrices = pricesSnapshot.docs
      .filter((priceDoc) => priceDoc.data().product === productDoc.id)
      .map((priceDoc) => {
        const priceData = priceDoc.data();
        return {
          id: priceDoc.id,
          unit_amount: priceData.unit_amount,
          currency: priceData.currency,
          interval: priceData.recurring?.interval || "month",
          product: priceData.product,
        };
      });

    products.push({
      id: productDoc.id,
      name: productData.name,
      description: productData.description,
      prices: productPrices,
    });
  }

  return products;
};

export const createCheckoutSession = async (priceId: string): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("You must be logged in to subscribe");

  const userRef = doc(db, "users", user.uid);
  const checkoutSessionsRef = collection(userRef, "checkout_sessions");

  const docRef = await addDoc(checkoutSessionsRef, {
    price: priceId,
    success_url: `${window.location.origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${window.location.origin}/choose-plan`,
    mode: "subscription",
    client_reference_id: user.uid,
    created: serverTimestamp(),
  });

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const data = snap.data();

      if (data?.url) {
        unsubscribe();
        window.location.assign(data.url);
        resolve();
      }

      if (data?.error) {
        unsubscribe();
        reject(new Error(data.error.message));
      }
    });
  });
};
