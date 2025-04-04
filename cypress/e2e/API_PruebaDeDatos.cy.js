describe('Petstore API', () => {
  let petsData = []; // Guardar la lista de mascotas vendidas
  let petNamesCount = {}; // Para el conteo de las veces que se repite un nombre
  const uniqueID = Date.now(); // Generamos un ID Nuevo siempre que se ejecute el proceso
  const uniqueUserName = `aquilesrosso_${uniqueID}`;

  it('Crear un nuevo usuario', () => {
    const userData = {
      id: uniqueID,
      username: uniqueUserName,
      firstName: "Aquiles",
      lastName: "Rosso",
      email: `${uniqueUserName}@ejemplo.com`,
      password: "contraseña123",
      phone: "123456789",
      userStatus: 1
    };
    // Realizamos la solicitud a la API para la creacion del usuario
    cy.request({
      method: 'POST',
      url: 'https://petstore.swagger.io/v2/user',
      body: userData,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      cy.log(`Respuesta del POST: ${JSON.stringify(response.body)}`);
      expect(response.status).to.eq(200); // Esperamos que sea codigo 200 
      cy.log(`Usuario ${userData.username} creado con éxito.`); // Imprimimos que le usuario se creo correctamente
    });
  });

  it('Obtener los datos del usuario', () => {
    cy.request({
      method: 'GET',
      url: `https://petstore.swagger.io/v2/user/${uniqueUserName}`,
      failOnStatusCode: false  // Esto previene el error 404 y nos permite manejarlo
    }).then((response) => {

      cy.log(`Status del GET: ${response.status}`);
      cy.log(`Respuesta del GET: ${JSON.stringify(response.body)}`);
      if (response.status === 200) { // SI el usuario se creo correctamente nos muestra el 200
        cy.log(`Datos del usuario: ${JSON.stringify(response.body)}`);
      } else {
        cy.log(`Usuario no encontrado, status: ${response.status}`); // si no aparece, nos muestra el codigo
      }
    });
  });

  it('Lista de mascotas vendidas', () => {
    cy.request({
      //Obtener todas las mascotas vendidas
      method: 'GET',
      url: 'https://petstore.swagger.io/v2/pet/findByStatus',
      //Filtramos por estado de vendidas
      qs: {
        status: 'sold' 
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      petsData = response.body; // Guardamos la respuesta en la variable
      cy.log(`Mascotas vendidas encontradas: ${petsData.length}`); //Mostramos la cantidad de mascotas encontradas
    });
  });

  it('Mostramos el nombre de cada mascota vendida', () => {
    // Asegurarse de que petsData se haya poblado
    cy.wrap(petsData).should('have.length.greaterThan', 0).then(() => {
      // Creamos la lista con el id y nombre de cada mascota
      const soldPets = petsData.map(pet => {
        return { id: pet.id, name: pet.name };
      });
      cy.log(`Mascotas vendidas: ${JSON.stringify(soldPets)}`);
    });
  });

  it('Contar la cantidad de veces que se repite un nombre ', () => {
    // Asegurarse de que petsData se haya poblado
    cy.wrap(petsData).should('have.length.greaterThan', 0).then(() => {
      //Recorremos cada mascota y contamos los nombres repetidos
      petsData.forEach(pet => {
        const name = pet.name;
        //Al existir el nombre le sumamos 1 o en caso de no existir, iniciaria en 1
        petNamesCount[name] = (petNamesCount[name] || 0) + 1;
      });
      cy.log(`Conteo de nombres de mascotas: ${JSON.stringify(petNamesCount)}`);

      // Compara si hay algún nombre repetido
      expect(Object.values(petNamesCount).length).to.be.greaterThan(0);  // Esto asegura que se haya contado al menos una mascota
    });
  });
});


  