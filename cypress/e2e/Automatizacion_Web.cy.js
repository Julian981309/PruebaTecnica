describe('Reto_Multifuncional', () => {
  //Ignora el error de reCAPTCHA, mientras realizamos la validacion
    Cypress.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('solveSimpleChallenge is not defined') || err.message.includes('reCAPTCHA')) {
        return false;
      }
      return true;
    });
  
    it('Automatización de una Web', () => { // Defino el caso de prueba individual
      cy.visit('https://www.google.com'); // Se abre la pagina principal
      cy.get("#APjFqb").type('automatización{enter}'); // Se ingresa la palabra en el campo de busqueda y presionamos enter
      cy.contains('Automatización - Wikipedia, la enciclopedia libre', { timeout: 30000 })
        .scrollIntoView({ duration: 2000}) // Hacemos scroll en 2 segundos
        .should('be.visible') //Nos aseguramos que sea visible
        .click({ force: true }); //hacemos click
      cy.origin('https://es.wikipedia.org/wiki/Automatizaci%C3%B3n', () => { //Cambiamos a dominio de wikipedia para interactuar
        cy.get('#La_Revolución_Industrial_en_Europa_Occidental', { timeout: 10000 }) // Buscamos este encabezado
          .scrollIntoView({ duration: 2000})
          .should('be.visible');
        cy.screenshot('Prueba',{capture: 'viewport'}); //Tomamos captura a la pagina con las fechas de las maquinas automatizadas
        }); 
    });
});
