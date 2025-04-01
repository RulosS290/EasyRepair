# Usa una imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de la aplicación
COPY package*.json ./

# Copia el archivo .env al contenedor
COPY .env .env


# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "start"]
