import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';
import React from 'react';
import { RevenueCatProps } from '@/providers/RevenueCat';

// Use your RevenueCat API keys
const APIKeys = {
  apple: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY as string,
  google: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY as string,
};

const RevenueCatContext = createContext<RevenueCatProps | null>(null);

export const RevenueCatProvider = ({ children }: any) => {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isRevenueCatAPIKeyPresent, setIsRevenueCatAPIKeyPresent] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        if (!APIKeys.google || APIKeys.google === '') {
          console.log("Invalid or absent RevenueCat Android API key");
          setIsReady(true);
          return;
        } else { setIsRevenueCatAPIKeyPresent(true); }

        await Purchases.configure({ apiKey: APIKeys.google });
      } else if (Platform.OS === 'ios') {
        if (!APIKeys.apple || APIKeys.apple === '') {
          console.log("Invalid or absent RevenueCat iOS API key");
          setIsReady(true);
          return;
        } else { setIsRevenueCatAPIKeyPresent(true); }

        await Purchases.configure({ apiKey: APIKeys.apple });
      }
      setIsReady(true);

      // Use more logging during debug if want!
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);

      // Load all offerings and the user object with entitlements
      await loadOfferings();
    };
    init();
  }, []);

  // Load all offerings a user can (currently) purchase
  const loadOfferings = async () => {
    // Below line of code is to handle case of no Android or iOS app in RevenueCat
    // if (!isRevenueCatAPIKeyPresent) {return;}
    // Above line is not needed as this method is called only by above useEffect which already checks for the key
    const offerings = await Purchases.getOfferings();
    if (offerings.current) {
      console.log('offerings', offerings.current);
      setPackages(offerings.current.availablePackages);
    }
  };

  // Purchase a package
  const purchasePackage = async (pack: PurchasesPackage) => {
    // Below line of code is to handle case of no Android or iOS app in RevenueCat
    if (!isRevenueCatAPIKeyPresent) {return;}
    try {
      return await Purchases.purchasePackage(pack);
    } catch (e: any) {
      if (!e.userCancelled) {
        alert(e);
      }
      throw e;
    }
  };

  // // Restore previous purchases
  const restorePermissions = async () => {
    // Below line of code is to handle case of no Android or iOS app in RevenueCat
    if (!isRevenueCatAPIKeyPresent) {return;}
    const customer = await Purchases.restorePurchases();
    return customer;
  };

  const value = {
    restorePermissions,
    packages,
    purchasePackage,
  };

  // Return empty fragment if provider is not ready (Purchase not yet initialised)
  if (!isReady) return <></>;

  return <RevenueCatContext.Provider value={value}>{children}</RevenueCatContext.Provider>;
};

// Export context for easy usage
export const useRevenueCat = () => {
  return useContext(RevenueCatContext) as RevenueCatProps;
};
