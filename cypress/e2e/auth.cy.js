describe('Tests d\'authentification', () => {
  beforeEach(() => {
    cy.visit('/')
    // Nettoyer le localStorage avant chaque test
    cy.clearLocalStorage()
  })

  describe('Connexion', () => {
    it('Devrait afficher le formulaire de connexion par défaut', () => {
      cy.get('.auth-title').should('contain', 'Connexion')
      cy.get('#login-email').should('be.visible')
      cy.get('#login-password').should('be.visible')
      cy.get('button[type="submit"]').should('contain', 'Se connecter')
    })

    it('Devrait afficher les identifiants de test admin', () => {
      cy.get('.admin-demo-title').should('contain', 'Compte de test Admin')
      cy.get('.admin-demo-text').should('contain', 'loise.fenoll@ynov.com')
      cy.get('.admin-demo-text').should('contain', 'PvdrTAzTeR247sDnAZBr')
    })

    it('Devrait afficher une erreur avec des identifiants incorrects', () => {
      cy.get('#login-email').type('wrong@email.com')
      cy.get('#login-password').type('wrongpassword')
      cy.get('button[type="submit"]').click()
      
      // Attendre que l'erreur apparaisse (peut prendre du temps)
      cy.wait(2000)
      cy.get('.alert.error', { timeout: 10000 }).should('be.visible')
      // Vérifier juste que l'erreur existe, sans texte spécifique
      cy.get('.alert.error').should('not.be.empty')
    })

    it('Devrait basculer vers le formulaire d\'inscription', () => {
      cy.get('.switch-btn').contains('S\'inscrire').click()
      cy.get('.auth-title').should('contain', 'Inscription')
      cy.get('#email').should('be.visible')
      cy.get('#password').should('be.visible')
    })
  })

  describe('Inscription', () => {
    beforeEach(() => {
      // Ensure we start from the login form
      cy.visit('/')
      cy.clearLocalStorage()
      
      // Wait for the page to load
      cy.get('.auth-title').should('be.visible')
      
      // Basculer vers le formulaire d'inscription avec plus de temps d'attente
      cy.get('.switch-btn', { timeout: 10000 }).contains('S\'inscrire').should('be.visible').click()
      
      // Attendre que le formulaire d'inscription soit visible
      cy.get('.auth-title', { timeout: 10000 }).should('contain', 'Inscription')
      cy.get('#last_name', { timeout: 10000 }).should('be.visible')
    })

    it('Devrait afficher le formulaire d\'inscription', () => {
      cy.get('.auth-title').should('contain', 'Inscription')
      cy.get('#last_name').should('be.visible')
      cy.get('#first_name').should('be.visible')
      cy.get('#email').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.get('#birth_date').should('be.visible')
      cy.get('#city').should('be.visible')
      cy.get('#postal_code').should('be.visible')
    })

    it('Devrait afficher des erreurs avec des données invalides', () => {
      // Utiliser un email déjà existant pour générer une vraie erreur API
      cy.get('#last_name').type('Test')
      cy.get('#first_name').type('User')
      cy.get('#email').type('loise.fenoll@ynov.com') // Email admin déjà existant
      cy.get('#password').type('Password123!')
      cy.get('#birth_date').type('1990-01-01')
      cy.get('#city').type('Paris')
      cy.get('#postal_code').type('75001')
      cy.get('button[type="submit"]').click()
      
      // Attendre que l'erreur apparaisse
      cy.wait(2000)
      cy.get('.alert.error', { timeout: 10000 }).should('be.visible')
      // Vérifier juste que l'erreur existe, sans texte spécifique
      cy.get('.alert.error').should('not.be.empty')
    })

    it('Devrait basculer vers le formulaire de connexion', () => {
      cy.get('.link-btn').contains('Se connecter').click()
      cy.get('.auth-title').should('contain', 'Connexion')
      cy.get('#login-email').should('be.visible')
    })
  })

  describe('Navigation et redirection', () => {
    it('Devrait rediriger vers le formulaire sur une URL inexistante', () => {
      cy.visit('/une-url-inexistante', { failOnStatusCode: false })
      cy.get('.auth-title').should('be.visible')
      cy.get('form').should('exist')
    })
  })
})
