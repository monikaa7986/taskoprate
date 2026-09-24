import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = 'atelier_local_wishlist';

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch from server if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      wishlistService.getWishlist()
        .then((res) => {
          if (res.success && res.data?.wishlist) {
            setWishlist(res.data.wishlist);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Persist locally for guests
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isAuthenticated]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item.id || item.product_id) === productId);
  };

  const toggleWishlist = async (product) => {
    const isCurrentlySaved = isInWishlist(product.id);

    if (isCurrentlySaved) {
      setWishlist((prev) => prev.filter((item) => (item.id || item.product_id) !== product.id));
      showToast(`Removed "${product.name}" from your wishlist.`, 'info');
      if (isAuthenticated) {
        try {
          await wishlistService.removeFromWishlist(product.id);
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Added "${product.name}" to your wishlist.`, 'success');
      if (isAuthenticated) {
        try {
          await wishlistService.addToWishlist(product.id);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
