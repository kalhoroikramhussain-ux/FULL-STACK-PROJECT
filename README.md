# Full Stack User App — Frontend + Backend Combined

## Structure
- `server.js` — Backend (Node.js + Express, 4 APIs: POST, GET, PUT, DELETE)
- `public/index.html` — Frontend (HTML + CSS + JavaScript, ek hi file)

## Combine kese hua?
1. Backend mein ek line: `app.use(express.static("public"));`
   Is se Express frontend wali files bhi khud hi chala deta hai — alag server nahi chahiye.
2. Frontend mein JavaScript ka `fetch()` backend API ko call karta hai:
   - Add User button → `fetch(API_URL, { method: "POST" })`
   - Page khulte hi → `fetch(API_URL)` yani GET, saare users table mein
   - Edit button → data form mein, phir submit par PUT
   - Delete button → `fetch(url, { method: "DELETE" })`

API_URL = `http://localhost:3000/api/users`

Note: Frontend aur backend same server (port 3000) par hain, is liye CORS ki zaroorat nahi padi.
Agar frontend alag chalao (masalan Live Server port 5500) to backend mein `cors` package lagana parega.

## Chalana
```bash
npm install
npm start
```
Phir browser mein kholo: http://localhost:3000
Form bhar kar Add User dabao — user neeche table mein aa jayega. Edit / Delete buttons bhi wahi hain.

## Restrictions / Validations (Frontend + Backend dono par)
1. Koi field khaali nahi ho sakta — teeno lazmi hain.
2. Username: sirf letters aur space, 3-30 characters. Number ya @ # $ allow nahi.
3. Contact Number: sirf numbers, bilkul 11 digits, 03 se shuru (03001234567).
   Frontend mein letter type hi nahi hota, backend Postman se galat bhejo to 400 error dega.
4. Address: 5-100 characters.
5. Duplicate: ek contact number se do users nahi ban sakte.
Galat data par API 400 status ke saath waja (message) bhejti hai, jo frontend par laal rang mein show hoti hai.
