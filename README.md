GPS VR2 – Login Page
This project is a Login Page built using modern web technologies, featuring Google Sign-In and Email/Password authentication.
Once logged in, users can access 4 integrated applications after completing their profile setup.

🚀 Technologies Used
Frontend Framework: React + Vite

Backend Framework: Express (Node.js environment)

Authentication:

Google Sign-In

Manual Email ID + Password login

📌 Features
Dual Authentication

Login using Email + Password

Login using Google Sign-In

Profile Completion
After logging in, users are prompted to complete their profile with:

Name

WhatsApp Number

Congregation Number

Congregation Validation

If the entered Congregation Number is not found, the user must provide:

Congregation Number

Name of Congregation

Language

Post Login Apps

After setup, 4 applications are displayed for user access.

🖥️ How to Sign In
Email + Password Login

Enter Email ID and Password

Click Login

Google Sign-In

Click Sign in with Google to use your Google account.

📋 Post-Login Flow
Profile Completion Page

Fill in Name, WhatsApp Number, and Congregation Number

Click Continue

If Congregation Not Found

Fill in the Congregation Number, Name of Congregation, and Language

Click Save and Continue

Access Applications

The user is redirected to a dashboard displaying 4 available applications.

⚙️ Installation & Setup
You need to run both the frontend and backend servers.

Frontend Setup
bash
Copy
Edit
cd login-react/login-ui-frontend
npm install
npm run dev
Backend Setup
bash
Copy
Edit
cd login-react/login-ui-backend
npm install
npm run dev


<img width="1199" height="736" alt="image" src="https://github.com/user-attachments/assets/52e73305-b4eb-44d1-885c-2e4201b8072b" />
<img width="1200" height="742" alt="image" src="https://github.com/user-attachments/assets/46cab0f0-d9f0-4526-b5cb-cf83340d8959" />
<img width="1189" height="729" alt="image" src="https://github.com/user-attachments/assets/b3c48851-4b7b-45fe-9475-9fdbe100b6bf" />
<img width="1201" height="744" alt="image" src="https://github.com/user-attachments/assets/b7f596e8-1911-4332-b097-4abc81f026cf" />
<img width="1191" height="740" alt="image" src="https://github.com/user-attachments/assets/0b98f8f2-5d04-4029-acd5-cde6fbae626a" />
<img width="631" height="156" alt="image" src="https://github.com/user-attachments/assets/95f8b51d-8d90-4876-82b1-d5e3352362bb" />
<img width="1866" height="879" alt="image" src="https://github.com/user-attachments/assets/9ced2ee9-bed1-4fb4-bd14-076d3101c905" />


📂 Project Structure
pgsql
Copy
Edit
gps-vr2-login/
│
├── login-ui-frontend/    # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── login-ui-backend/     # Express backend
│   ├── src/
│   ├── package.json
│
└── README.md



📜 License
This project is for internal use under the GPS VR2 environment. Unauthorized use or distribution is prohibited.

