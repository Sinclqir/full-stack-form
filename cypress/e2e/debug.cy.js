describe('Debug - Voir le contenu de la page', () => {
  it('Devrait afficher le contenu de la page', () => {
    cy.visit('/')
    
    // Attendre que la page se charge
    cy.wait(2000)
    
    // Afficher le contenu du body
    cy.get('body').then(($body) => {
      cy.log('Contenu du body:', $body.html())
    })
    
    // Vérifier si React est chargé
    cy.get('#root').should('exist')
    
    // Afficher le contenu du root
    cy.get('#root').then(($root) => {
      cy.log('Contenu du root:', $root.html())
    })
    
    // Chercher tous les éléments avec des classes
    cy.get('*[class]').then(($elements) => {
      const classes = []
      $elements.each((i, el) => {
        const className = el.className
        if (className && !classes.includes(className)) {
          classes.push(className)
        }
      })
      cy.log('Classes trouvées:', classes)
    })
    
    // Chercher tous les formulaires
    cy.get('form').then(($forms) => {
      cy.log('Nombre de formulaires:', $forms.length)
      $forms.each((i, form) => {
        cy.log(`Formulaire ${i}:`, form.outerHTML)
      })
    })
    
    // Chercher tous les inputs
    cy.get('input').then(($inputs) => {
      cy.log('Nombre d\'inputs:', $inputs.length)
      $inputs.each((i, input) => {
        cy.log(`Input ${i}:`, input.outerHTML)
      })
    })
  })
})

describe('Debug Test', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearLocalStorage()
  })

  it('Should switch to registration form', () => {
    // Wait for page to load
    cy.get('.auth-title').should('contain', 'Connexion')
    
    // Click the switch button
    cy.get('.switch-btn').contains('S\'inscrire').click()
    
    // Wait for registration form
    cy.get('.auth-title').should('contain', 'Inscription')
    
    // Check if registration form elements are visible
    cy.get('#last_name').should('be.visible')
    cy.get('#first_name').should('be.visible')
    cy.get('#email').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#birth_date').should('be.visible')
    cy.get('#city').should('be.visible')
    cy.get('#postal_code').should('be.visible')
  })
}) 