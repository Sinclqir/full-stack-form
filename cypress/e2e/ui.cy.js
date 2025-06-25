describe('Interface utilisateur', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Afficher le formulaire de connexion par défaut', () => {
    cy.contains('Connexion').should('be.visible')
    cy.contains('Connectez-vous à votre compte').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('Basculer vers le formulaire d\'inscription', () => {
    cy.contains('S\'inscrire').click()
    cy.contains('Inscription').should('be.visible')
    cy.contains('Créez votre compte pour commencer').should('be.visible')
    
    // Vérifier que tous les champs du formulaire d'inscription sont présents
    cy.get('input[name="last_name"]').should('be.visible')
    cy.get('input[name="first_name"]').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('input[name="birth_date"]').should('be.visible')
    cy.get('input[name="city"]').should('be.visible')
    cy.get('input[name="postal_code"]').should('be.visible')
  })

  it('Basculer de l\'inscription vers la connexion', () => {
    cy.contains('S\'inscrire').click()
    cy.contains('Inscription').should('be.visible')
    
    cy.contains('Se connecter').click()
    cy.contains('Connexion').should('be.visible')
  })

  it('Afficher les identifiants de test admin', () => {
    // Sur la page de connexion, les identifiants admin doivent être visibles
    cy.contains('Compte de test Admin').should('be.visible')
    cy.contains('loise.fenoll@ynov.com').should('be.visible')
    cy.contains('PvdrTAzTeR247sDnAZBr').should('be.visible')
  })

  it('Validation des champs du formulaire d\'inscription', () => {
    cy.contains('S\'inscrire').click()
    
    // Essayer de soumettre le formulaire vide
    cy.get('button[type="submit"]').click()
    
    // Les champs requis doivent être marqués comme invalides
    cy.get('input[name="last_name"]:invalid').should('exist')
    cy.get('input[name="first_name"]:invalid').should('exist')
    cy.get('input[name="email"]:invalid').should('exist')
    cy.get('input[name="password"]:invalid').should('exist')
    cy.get('input[name="birth_date"]:invalid').should('exist')
    cy.get('input[name="city"]:invalid').should('exist')
    cy.get('input[name="postal_code"]:invalid').should('exist')
  })
}) 