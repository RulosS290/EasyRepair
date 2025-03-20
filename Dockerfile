# Usa una imagen oficial de Node.js
FROM node:16

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de la aplicación
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "start"]
