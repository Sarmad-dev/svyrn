Environment variables required:

- NEXT_PUBLIC_API_URL=https://your-backend-host
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

The ad creation flow will create a Campaign first, then process a Stripe payment, and finally create the Ad with uploaded media (base64 -> Cloudinary handled by backend).


