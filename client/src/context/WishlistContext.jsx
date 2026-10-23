import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync wishlist from server whenever user is authenticated
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        setWishlist([]);
        return;
      }

      try {
        setLoading(true);
        const res = await wishlistService.get();
        if (res?.wishlist) {
          setWishlist(res.wishlist);
        }
      } catch (err) {
        console.error('Failed to load wishlist:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.some(
      (item) => (item._id || item).toString() === productId.toString()
    );
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to save items to your wishlist');
    }

    const productId = product._id || product;
    const exists = isInWishlist(productId);

    if (exists) {
      // Optimistic removal
      setWishlist((prev) =>
        prev.filter((item) => (item._id || item).toString() !== productId.toString())
      );
      try {
        await wishlistService.remove(productId);
      } catch (err) {
        // Revert on error
        setWishlist((prev) => [...prev, product]);
        throw err;
      }
    } else {
      // Optimistic add
      setWishlist((prev) => [...prev, product]);
      try {
        await wishlistService.add(productId);
      } catch (err) {
        // Revert on error
        setWishlist((prev) =>
          prev.filter((item) => (item._id || item).toString() !== productId.toString())
        );
        throw err;
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    const previous = [...wishlist];
    setWishlist((prev) =>
      prev.filter((item) => (item._id || item).toString() !== productId.toString())
    );
    try {
      await wishlistService.remove(productId);
    } catch (err) {
      setWishlist(previous);
      throw err;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
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
