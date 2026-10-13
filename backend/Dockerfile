# 1. Usar una imagen oficial de Node.js ligera
FROM node:18-alpine

# 2. Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar los archivos de dependencias primero
COPY package*.json ./

# 4. Instalar las dependencias de producción
RUN npm ci --only=production

# 5. Copiar el resto del código fuente del proyecto
COPY . .

# 6. Exponer el puerto en el que corre tu aplicación (ej. 3000 o el que utilices)
EXPOSE 3000

# 7. Comando para iniciar la aplicación (apuntando a tu main.js)
CMD ["node", "main.js"]