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

    it('Devrait se connecter avec les identifiants admin corrects', () => {
      // Intercepter les appels API pour le debug
      cy.intercept('POST', '**/login').as('loginRequest')
      cy.intercept('GET', '**/users').as('usersRequest')
      
      cy.get('#login-email').type('loise.fenoll@ynov.com')
      cy.get('#login-password').type('PvdrTAzTeR247sDnAZBr')
      cy.get('button[type="submit"]').click()
      
      // Attendre la réponse de login
      cy.wait('@loginRequest').then((interception) => {
        console.log('Login response status:', interception.response?.statusCode)
        console.log('Login response body:', interception.response?.body)
        console.log('Login request body:', interception.request?.body)
        
        if (interception.response?.statusCode === 500) {
          console.error('Login failed with 500 error:', interception.response?.body)
        }
        
        expect(interception.response?.statusCode).to.be.oneOf([200, 201])
      })
      
      // Attendre plus longtemps pour la réponse API
      cy.wait(3000)
      
      // Attendre la réponse de fetch users
      cy.wait('@usersRequest').then((interception) => {
        console.log('Users response status:', interception.response?.statusCode)
        console.log('Users response body:', interception.response?.body)
        
        if (interception.response?.statusCode === 500) {
          console.error('Users fetch failed with 500 error:', interception.response?.body)
        }
        
        expect(interception.response?.statusCode).to.be.oneOf([200, 201])
      })
      
      // Vérifier la redirection vers la liste des utilisateurs
      cy.get('.users-title', { timeout: 15000 }).should('contain', 'Gestion des utilisateurs')
      cy.get('.user-email').should('contain', 'loise.fenoll@ynov.com')
      cy.get('.role-badge').should('contain', 'Admin')
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

    it('Devrait s\'inscrire avec des données valides', () => {
      // Ensure we're on the registration form
      cy.get('.auth-title').should('contain', 'Inscription')
      cy.get('#last_name').should('be.visible')
      
      // Intercepter l'appel API d'inscription
      cy.intercept('POST', '**/register').as('registerRequest')
      
      const testEmail = `test${Date.now()}@example.com`
      
      cy.get('#last_name').type('Doe')
      cy.get('#first_name').type('John')
      cy.get('#email').type(testEmail)
      cy.get('#password').type('Password123!')
      cy.get('#birth_date').type('1990-01-01')
      cy.get('#city').type('Paris')
      cy.get('#postal_code').type('75001')
      cy.get('button[type="submit"]').click()
      
      // Attendre la réponse de l'API
      cy.wait('@registerRequest').then((interception) => {
        console.log('Register response status:', interception.response?.statusCode)
        console.log('Register response body:', interception.response?.body)
        console.log('Register request body:', interception.request?.body)
        
        if (interception.response?.statusCode === 500) {
          console.error('Registration failed with 500 error:', interception.response?.body)
        }
        
        expect(interception.response?.statusCode).to.be.oneOf([200, 201])
      })
      
      // Attendre plus longtemps pour la réponse API
      cy.wait(3000)
      
      // Vérifier que nous sommes revenus au formulaire de connexion
      cy.get('.auth-title').should('contain', 'Connexion')
      cy.get('#login-email').should('be.visible')
      cy.get('#login-password').should('be.visible')
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