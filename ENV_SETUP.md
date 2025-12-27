# Environment Variables Setup Guide

This guide will help you set up the required environment variables for both the backend and frontend of the Nilamee Auction Platform.

## 🔐 Security Notice

**IMPORTANT:** Never commit `.env` or `config.env` files to version control. These files contain sensitive information like API keys, database credentials, and secret keys.

The `.gitignore` files have been configured to exclude these files automatically.

---

## 🔧 Backend Setup

### Step 1: Create Backend Environment File

Navigate to the backend config directory and copy the example file:

```bash
cd backend/config
copy .env.example config.env    # Windows
# or
cp .env.example config.env      # Linux/Mac
```

### Step 2: Configure Backend Variables

Open `backend/config/config.env` and update the following values:

```env
# Server Configuration
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/NILAMEE_AUCTION_PLATFORM

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SERVICE=gmail
SMTP_MAIL=your-email@gmail.com
SMTP_PASSWORD=your-email-app-password
```

#### Required Setup:

1. **MongoDB**: Install MongoDB locally or use MongoDB Atlas

   - Local: `mongodb://127.0.0.1:27017/NILAMEE_AUCTION_PLATFORM`
   - Atlas: Get connection string from your MongoDB Atlas dashboard

2. **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com)

   - Get your Cloud Name, API Key, and API Secret from the dashboard

3. **Gmail SMTP** (for sending emails):

   - Use your Gmail account
   - Enable 2-Factor Authentication
   - Generate an App Password: [Google Account > Security > App Passwords](https://myaccount.google.com/apppasswords)
   - Use the generated password as `SMTP_PASSWORD`

4. **JWT Secret**: Generate a strong random secret key:
   ```bash
   # Using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

---

## 🎨 Frontend Setup

### Step 1: Create Frontend Environment File

Navigate to the frontend directory and copy the example file:

```bash
cd frontend
copy .env.example .env    # Windows
# or
cp .env.example .env      # Linux/Mac
```

### Step 2: Configure Frontend Variables

Open `frontend/.env` and update the following values:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api/v1

# EmailJS Configuration (for contact form)
VITE_EMAILJS_SERVICE_ID=your-emailjs-service-id
VITE_EMAILJS_TEMPLATE_ID=your-emailjs-template-id
VITE_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
```

#### Required Setup:

1. **Backend API URL**:

   - Development: `http://localhost:5000`
   - Production: Your deployed backend URL

2. **EmailJS** (for contact form): Sign up at [emailjs.com](https://www.emailjs.com)
   - Create a new service (Gmail, Outlook, etc.)
   - Create an email template
   - Get your Service ID, Template ID, and Public Key from the dashboard

---

## 🚀 Running the Application

### Start Backend

```bash
cd backend
npm install
npm start
```

Backend should start on `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend should start on `http://localhost:5173`

---

## 📝 Environment Variables Reference

### Backend Variables

| Variable                | Description               | Required | Default |
| ----------------------- | ------------------------- | -------- | ------- |
| `PORT`                  | Backend server port       | Yes      | 5000    |
| `FRONTEND_URL`          | Frontend URL for CORS     | Yes      | -       |
| `MONGO_URI`             | MongoDB connection string | Yes      | -       |
| `JWT_SECRET_KEY`        | Secret key for JWT tokens | Yes      | -       |
| `JWT_EXPIRE`            | JWT token expiry time     | Yes      | 7d      |
| `COOKIE_EXPIRE`         | Cookie expiry in days     | Yes      | 7       |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name     | Yes      | -       |
| `CLOUDINARY_API_KEY`    | Cloudinary API key        | Yes      | -       |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret     | Yes      | -       |
| `SMTP_HOST`             | SMTP server host          | Yes      | -       |
| `SMTP_PORT`             | SMTP server port          | Yes      | -       |
| `SMTP_SERVICE`          | Email service name        | Yes      | -       |
| `SMTP_MAIL`             | Sender email address      | Yes      | -       |
| `SMTP_PASSWORD`         | Email account password    | Yes      | -       |

### Frontend Variables

| Variable                   | Description          | Required | Default                      |
| -------------------------- | -------------------- | -------- | ---------------------------- |
| `VITE_API_BASE_URL`        | Backend base URL     | Yes      | http://localhost:5000        |
| `VITE_API_URL`             | Backend API endpoint | Yes      | http://localhost:5000/api/v1 |
| `VITE_EMAILJS_SERVICE_ID`  | EmailJS service ID   | Yes      | -                            |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID  | Yes      | -                            |
| `VITE_EMAILJS_PUBLIC_KEY`  | EmailJS public key   | Yes      | -                            |

**Note:** Application branding (name, tagline) and theme colors are configured in `frontend/src/config/app.config.js`, not in environment variables. See `THEME_SYSTEM.md` for details.

---

## 🔍 Troubleshooting

### Backend Issues

**Error: "MONGO_URI is not defined"**

- Make sure `config.env` exists in `backend/config/`
- Verify MongoDB is running locally or connection string is correct

**Error: "Cloudinary upload failed"**

- Verify Cloudinary credentials are correct
- Check if you have upload permissions on your Cloudinary account

**Error: "Email sending failed"**

- Verify Gmail App Password is correct (not your regular Gmail password)
- Check SMTP settings match your email provider

### Frontend Issues

**Error: "Failed to fetch"**

- Make sure backend is running on the correct port
- Check `VITE_API_BASE_URL` matches your backend URL

**Error: "EmailJS not working"**

- Verify EmailJS credentials in `.env`
- Check EmailJS dashboard for service status

**Environment variables not loading:**

- Restart the Vite dev server after changing `.env`
- Make sure variable names start with `VITE_`

---

## 🌐 Production Deployment

### Backend

1. Set up environment variables on your hosting platform (Heroku, Railway, Render, etc.)
2. Update `FRONTEND_URL` to your production frontend URL
3. Use MongoDB Atlas for production database
4. Generate a strong `JWT_SECRET_KEY` for production

### Frontend

1. Update `VITE_API_BASE_URL` to your production backend URL
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

---

## ✅ Verification Checklist

- [ ] Backend `config.env` created and configured
- [ ] Frontend `.env` created and configured
- [ ] MongoDB is running and accessible
- [ ] Cloudinary account set up with valid credentials
- [ ] Gmail SMTP configured with App Password
- [ ] EmailJS account set up for contact form
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register/login users
- [ ] Can upload images (profile, auction items)
- [ ] Can send emails (winner notification)
- [ ] Contact form sends emails successfully

---

## 🔒 Security Best Practices

1. **Never commit** `.env` or `config.env` files
2. **Use different credentials** for development and production
3. **Rotate secrets** regularly in production
4. **Use strong passwords** and secret keys (minimum 32 characters)
5. **Enable 2FA** on all third-party services (Cloudinary, MongoDB Atlas, etc.)
6. **Restrict API keys** to specific domains in production
7. **Monitor usage** of third-party services for suspicious activity

---

## 📞 Need Help?

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all services (MongoDB, Cloudinary, EmailJS) are accessible
4. Check firewall/network settings
5. Review the main README.md for additional setup instructions
