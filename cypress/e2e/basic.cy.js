describe('Basic Infrastructure Tests', () => {
  it('Should load the page successfully', () => {
    cy.visit('/')
    
    // Vérifier que la page se charge (status 200)
    cy.request('/').its('status').should('eq', 200)
    
    // Vérifier que le HTML de base est présent
    cy.get('html').should('exist')
    cy.get('head').should('exist')
    cy.get('body').should('exist')
    
    // Vérifier que le titre de la page est présent
    cy.title().should('not.be.empty')
    
    // Vérifier que le div root existe (pour React)
    cy.get('#root').should('exist')
  })

  it('Should load static assets', () => {
    cy.visit('/')
    
    // Vérifier que les assets CSS et JS sont chargés
    cy.get('head').find('link[rel="stylesheet"]').should('exist')
    cy.get('head').find('script[type="module"]').should('exist')
  })

  it('Should have basic HTML structure', () => {
    cy.visit('/')
    
    // Vérifier la structure HTML de base
    cy.get('html').should('have.attr', 'lang', 'fr')
    cy.get('head').should('exist')
    cy.get('body').should('exist')
  })
}) 