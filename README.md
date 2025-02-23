# EasyRepair

## Descripción del Proyecto

EasyRepair es una plataforma web y móvil que conecta a usuarios con técnicos certificados para la reparación de dispositivos electrónicos y electrodomésticos. Permite solicitar reparaciones a domicilio o encontrar talleres cercanos, con un sistema de valoración para garantizar la calidad del servicio.

## Versión del Lenguaje

*  [Node.js](https://nodejs.org/es): 22.13.1

## **Dependencias principales (`dependencies`)**
1. **dotenv (`^16.4.7`)**  
   - Permite cargar variables de entorno desde un archivo `.env` en `process.env`, facilitando la configuración de credenciales y valores sensibles sin exponerlos en el código fuente.

2. **express (`^4.21.2`)**  
   - Framework minimalista para Node.js que facilita la creación de servidores web y APIs REST.

3. **jsonwebtoken (`^9.0.2`)**  
   - Librería para generar y verificar tokens JWT (JSON Web Token), usados para autenticación segura en aplicaciones web.

4. **jwt-decode (`^4.0.0`)**  
   - Permite decodificar tokens JWT sin necesidad de validarlos o proporcionar una clave secreta, útil para extraer información del payload.

5. **mysql2 (`^3.12.0`)**  
   - Una versión mejorada del paquete `mysql`, con soporte para Promises y mejoras de rendimiento.

## **Dependencias de desarrollo (`devDependencies`)**

7. **jest (`^29.7.0`)**  
   - Framework de pruebas para JavaScript, utilizado para escribir y ejecutar pruebas unitarias y de integración de manera sencilla.

8. **supertest (`^7.0.0`)**  
   - Librería para realizar pruebas HTTP en servidores Node.js basados en `express`, permitiendo probar endpoints de APIs de manera eficiente.

9. **nodemon (`^3.1.9`)**  
   - Herramienta que reinicia automáticamente la aplicación cuando detecta cambios en los archivos, útil para el desarrollo en Node.js.

### Instrucciones de instalamiento

1. Clonar el repositorio.
   
```bash
git clone https://github.com/RulosS290/EasyRepair.git
```

2. Muevete a la carpeta clonada.
   
```bash
cd EasyRepair/
```
 
3. Instala las dependencias:
   
```bash
npm install
```

4. Ejecuta el programa.  

 ```bash
node src/server.js
```

5. Abre este [link](http://localhost:3000/login) para ver la app

## Endpoints

###  **AuthRoutes**

1. **POST `/login`**  
  - **Descripción**: Permite a un usuario iniciar sesión proporcionando su `username` y `password`.  
  - **Funcionamiento**:  
     - Llama a `authService.login(username, password)` para autenticar al usuario.  
     - Si la autenticación es exitosa, genera un token JWT con información del usuario (`id`, `username`, `type`).  
     - Retorna el token en la respuesta.  
     - Si ocurre un error, devuelve un estado `500` con la información del error.  

2. **POST `/register`**  
  - **Descripción**: Permite registrar un nuevo usuario con `username`, `password` y `type`.  
  - **Funcionamiento**:  
     - Llama a `authService.register(username, password, type)` para registrar al usuario en el sistema.  
     - Si el registro es exitoso, devuelve la respuesta del servicio.  
     - Si ocurre un error, devuelve un estado `500` con la información del error.  
 
###  **userRoutes**

1. **GET `/admin/profiles`**  
  - **Descripción**: Obtiene la lista de usuarios del sistema.  
  - **Funcionamiento**:  
    - Requiere autenticación con `authenticateToken`.  
    - Requiere que el usuario tenga permisos de administrador (`isAdmin`).  
    - Llama a `adminController.getUsers` para obtener la lista de usuarios.  
    - Devuelve un listado con la información de los usuarios registrados.  

2. **DELETE `/profiles/:id`**  
  - **Descripción**: Elimina un usuario específico del sistema.  
  - **Funcionamiento**:  
    - Requiere autenticación con `authenticateToken`.  
    - Requiere que el usuario tenga permisos de administrador (`isAdmin`).  
    - Llama a `adminController.deleteUser`, pasando el `id` del usuario a eliminar.  
    - Elimina al usuario con el `id` proporcionado y devuelve una respuesta indicando el éxito o error de la operación.

###  **appointmentRoutes**

1. **GET `/user/schedule`**  
  - **Descripción**: Obtiene las citas del usuario autenticado.  
  - **Funcionamiento**:  
    - Requiere autenticación (`authenticateToken`).  
    - Llama a `appointmentController.getAppointments` para obtener las citas del usuario.  
    - Devuelve una lista con las citas del usuario autenticado.  

2. **POST `/appointments`**  
  - **Descripción**: Crea una nueva cita.  
  - **Funcionamiento**:  
    - Requiere autenticación (`authenticateToken`).  
    - Llama a `appointmentController.addAppointment` para registrar una nueva cita.  
    - Devuelve la información de la cita creada o un error en caso de fallo.  

3. **GET `/appointmentsGetTechnicians`**  
  - **Descripción**: Obtiene la lista de técnicos disponibles para las citas.  
  - **Funcionamiento**:  
    - Requiere autenticación (`authenticateToken`).  
    - Llama a `appointmentController.getTechnicians` para obtener los técnicos.  
    - Devuelve la lista de técnicos disponibles.  

4. **PATCH `/appointments/pay/:id`**  
  - **Descripción**: Actualiza el estado de pago de una cita.  
  - **Funcionamiento**:  
    - Requiere autenticación (`authenticateToken`).    
    - Llama a `appointmentController.updateAppointmentPaid`, pasando el `id` de la cita.  
    - Marca la cita como pagada y devuelve el estado actualizado.  

5. **DELETE `/appointments/:id`**  
  - **Descripción**: Elimina una cita específica.  
  - **Funcionamiento**:  
    - Requiere autenticación (`authenticateToken`).  
    - Llama a `appointmentController.deleteAppointment`, pasando el `id` de la cita.  
    - Elimina la cita y devuelve una respuesta indicando el éxito o error de la operación.  

6. **PATCH `/appointments/:id`**  
  - **Descripción**: Modifica una cita específica.  
  - **Funcionamiento**:  
    - Requiere autenticación (`authenticateToken`).  
    - Llama a `appointmentController.updateAppointment`, pasando el `id` de la cita y los datos a modificar.  
    - Devuelve la cita actualizada o un error en caso de fallo.

###  **paymentRoutes**

1. **GET `/payment`**  
  - **Descripción**: Muestra la página de pago (`payment.html`).  
  - **Funcionamiento**:  
    - Recibe un parámetro de consulta (`id`) que representa el ID de la cita a pagar.  
    - Si no se proporciona un `id`, responde con un error `400` indicando que el ID es requerido.  
    - Si el `id` está presente, envía el archivo `payment.html` ubicado en `../views/`.  

###  **supportTicketRoutes**

1. **POST `/user/supportTicket`**  
- **Descripción**: Permite a un usuario autenticado crear un nuevo ticket de soporte.  
- **Funcionamiento**:  
  - Requiere autenticación (`authenticateToken`).  
  - Llama a `supportTicketController.createSupportTicket` para registrar el ticket.  
  - Devuelve la información del ticket creado o un error en caso de fallo.  

2. **GET `/user/supportTicket`**  
- **Descripción**: Obtiene todos los tickets de soporte (solo para administradores).  
- **Funcionamiento**:  
  - Requiere autenticación (`authenticateToken`).  
  - Requiere permisos de administrador (`isAdmin`).  
  - Llama a `supportTicketController.getAllSupportTickets` para recuperar todos los tickets.  
  - Devuelve una lista con todos los tickets registrados.  

3. **GET `/user/supportTicket/myTickets`**  
- **Descripción**: Obtiene los tickets de soporte creados por el usuario autenticado.  
- **Funcionamiento**:  
  - Requiere autenticación (`authenticateToken`).  
  - Llama a `supportTicketController.getSupportTicketsByUser` para obtener los tickets del usuario actual.  
  - Devuelve una lista con los tickets asociados al usuario autenticado.
 
###  **supportMessageRoutes** 

1. **GET `/supportTicket/:ticketId/messages`**  
- **Descripción**: Obtiene los mensajes asociados a un ticket de soporte específico.  
- **Funcionamiento**:  
  - Requiere autenticación (`authenticateToken`).  
  - Llama a `supportMessageController.getMessagesByTicket`, pasando el `ticketId` como parámetro.  
  - Devuelve una lista con los mensajes relacionados con el ticket indicado.  

2. **POST `/supportTicket/:ticketId/messages`**  
- **Descripción**: Crea un nuevo mensaje en un ticket de soporte específico.  
- **Funcionamiento**:  
  - Requiere autenticación (`authenticateToken`).  
  - Llama a `supportMessageController.createMessage`, pasando el `ticketId` y los datos del mensaje.  
  - Guarda el mensaje en la conversación del ticket y devuelve la información del mensaje creado.  

## Documento de Planeación

[Notion](https://pouncing-suede-9e1.notion.site/Projects-Tasks-18cfb1f9fcb0809ba29ef0c5d02a0d8c)

## Sprint 1

#  Funcionamiento del endpoint

![image](https://github.com/user-attachments/assets/029e37fd-9100-41b7-aaab-2413a043ad4a)
![image](https://github.com/user-attachments/assets/64a3e002-1a66-4b42-8fb8-12167ce9f42c)

# Video sprint 1
[Link](https://youtu.be/48XF7RM1qM8)

## Integrantes

*  [Daniel Santiago Torres Acosta](https://github.com/RulosS290)
*  [Diego Fernando Castellanos Amaya](https://github.com/Diegoc04)
