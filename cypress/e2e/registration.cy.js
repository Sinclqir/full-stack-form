describe('Inscription utilisateur', () => {
    beforeEach(() => {
      cy.visit('/') // page d'accueil
      // Cliquer sur le bouton "S'inscrire" pour afficher le formulaire
      cy.contains('S\'inscrire').click()
    })
  
    it("Remplir le formulaire d'inscription et vérifier la validation", () => {
      const email = `testuser_${Date.now()}@example.com`
  
      cy.get('input[name="last_name"]').type('Dupont')
      cy.get('input[name="first_name"]').type('Jean')
      cy.get('input[name="email"]').type(email)
      cy.get('input[name="password"]').type('Password123!')
      cy.get('input[name="birth_date"]').type('1990-01-01')
      cy.get('input[name="city"]').type('Paris')
      cy.get('input[name="postal_code"]').type('75001')
  
      // Vérifier que tous les champs sont remplis
      cy.get('input[name="last_name"]').should('have.value', 'Dupont')
      cy.get('input[name="first_name"]').should('have.value', 'Jean')
      cy.get('input[name="email"]').should('have.value', email)
      cy.get('input[name="password"]').should('have.value', 'Password123!')
      cy.get('input[name="birth_date"]').should('have.value', '1990-01-01')
      cy.get('input[name="city"]').should('have.value', 'Paris')
      cy.get('input[name="postal_code"]').should('have.value', '75001')
  
      // Le bouton submit doit être cliquable
      cy.get('button[type="submit"]').should('not.be.disabled')
    })
  
    it("Essayer de s'inscrire avec des mauvais champs et détecter erreurs", () => {
      // Vider les champs d'abord
      cy.get('input[name="last_name"]').clear()
      cy.get('input[name="first_name"]').clear()
      cy.get('input[name="email"]').clear().type('pas un email')
      cy.get('input[name="password"]').clear().type('123') // trop court
      cy.get('input[name="birth_date"]').clear()
      cy.get('input[name="city"]').clear()
      cy.get('input[name="postal_code"]').clear().type('abc') // invalide
  
      cy.get('button[type="submit"]').click()
  
      // Vérifier que des messages d'erreur s'affichent
      // Soit une alerte d'erreur, soit des messages de validation HTML
      cy.get('body').then(($body) => {
        if ($body.find('.alert.error').length > 0) {
          cy.get('.alert.error').should('exist')
        } else {
          // Vérifier que les champs sont marqués comme invalides
          cy.get('input[name="last_name"]:invalid').should('exist')
          cy.get('input[name="first_name"]:invalid').should('exist')
          cy.get('input[name="email"]:invalid').should('exist')
        }
      })
    })
  
    it("Basculer entre connexion et inscription", () => {
      // Vérifier qu'on est sur le formulaire d'inscription
      cy.contains('Inscription').should('be.visible')
      
      // Basculer vers la connexion
      cy.contains('Se connecter').click()
      cy.contains('Connexion').should('be.visible')
      
      // Basculer vers l'inscription
      cy.contains('S\'inscrire').click()
      cy.contains('Inscription').should('be.visible')
    })
  })
  