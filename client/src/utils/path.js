
const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    PRODUCTS: ':category',
    BLOGS: 'blogs',
    OUR_SERVICES: 'services',
    FAQ: 'faqs',
    DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'reset-password/:token',
    DETAIL_CART: 'detail-cart',
    CHECKOUT: 'checkout',
    PAYMENT_SUCCESS: 'payment-success',
    CHATBOT_DETAILS: 'chatbot',
    
    //Admin
    ADMIN: 'admin',
    CREATE_PRODUCT: 'create-product',
    DASHBOARD: 'dashboard',
    MANAGE_USER: 'manage-user',
    MANAGE_PRODUCT: 'manage-product',
    MANAGE_ORDER: 'manage-order',
    
    //Member
    MEMBER: 'member',
    PERSONAL: 'personal',
    MY_CART: 'my-cart',
    WISHLIST: 'wishlist',
    MY_ORDER: 'my-order',
}

export default path