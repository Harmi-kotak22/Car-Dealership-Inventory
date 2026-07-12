# ---------- Base Image ----------
FROM node:22-alpine

# ---------- Working Directory ----------
WORKDIR /app

# ---------- Install Dependencies ----------
COPY package*.json ./

RUN npm install

# ---------- Copy Source ----------
COPY . .

# ---------- Expose Express Port ----------
EXPOSE 5000

# ---------- Start Application ----------
CMD ["npm", "start"]