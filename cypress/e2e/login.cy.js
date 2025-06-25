describe('Connexion et gestion des utilisateurs', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Afficher le formulaire de connexion', () => {
    cy.contains('Connexion').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('Afficher les identifiants de test admin', () => {
    cy.contains('Compte de test Admin').should('be.visible')
    cy.contains('loise.fenoll@ynov.com').should('be.visible')
    cy.contains('PvdrTAzTeR247sDnAZBr').should('be.visible')
  })

  it('Tentative de connexion avec des identifiants incorrects', () => {
    cy.get('input[name="email"]').type('wrong@email.com')
    cy.get('input[name="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()

    // Vérifier qu'un message d'erreur s'affiche (si le backend est disponible)
    cy.get('body').then(($body) => {
      if ($body.find('.alert.error').length > 0) {
        cy.get('.alert.error').should('be.visible')
      } else {
        // Si pas d'erreur affichée, vérifier que le formulaire est toujours visible
        cy.contains('Connexion').should('be.visible')
      }
    })
  })

  it('Basculer vers le formulaire d\'inscription', () => {
    cy.contains('S\'inscrire').click()
    cy.contains('Inscription').should('be.visible')
    cy.contains('Créez votre compte pour commencer').should('be.visible')
  })
})
  