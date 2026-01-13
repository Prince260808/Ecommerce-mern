import express from 'express';
import {
    addToCart,
    removeItem,
    updateQuantity,
    getCart
} from '../controllers/CartController.js';

const router = express.Router();

// Add item to cart 
router.post('/add',addToCart);

// Remove item from cart
router.post('/remove',removeItem);

// Update item from cart
router.post('/update',updateQuantity);

// Get User's Cart
router.get('/:userId',getCart);

export default router;