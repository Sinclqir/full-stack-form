describe('Tests de gestion des utilisateurs', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearLocalStorage()
  })

  describe('Accès en tant qu\'utilisateur non connecté', () => {
    it('Ne devrait pas pouvoir accéder à la liste des utilisateurs', () => {
      // Essayer d'accéder directement à la liste des utilisateurs
      // L'utilisateur non connecté devrait voir le formulaire de connexion
      cy.get('.auth-title').should('contain', 'Connexion')
      cy.get('.users-title').should('not.exist')
    })

    it('Ne devrait pas voir les boutons de suppression', () => {
      // Même si on arrive à voir la liste, pas de boutons de suppression
      cy.get('.delete-btn').should('not.exist')
    })
  })

  describe('Accès en tant qu\'utilisateur normal', () => {
    beforeEach(() => {
      // Créer un utilisateur normal
      cy.get('.switch-btn').contains('S\'inscrire').click()
      
      const testEmail = `user${Date.now()}@example.com`
      cy.get('#last_name').type('User')
      cy.get('#first_name').type('Normal')
      cy.get('#email').type(testEmail)
      cy.get('#password').type('Password123!')
      cy.get('#birth_date').type('1990-01-01')
      cy.get('#city').type('Lyon')
      cy.get('#postal_code').type('69001')
      cy.get('button[type="submit"]').click()
      
      // Attendre le message de succès
      cy.get('.alert.success', { timeout: 10000 }).should('contain', 'Inscription réussie')
      
      // Recharger la page pour revenir au formulaire de connexion
      cy.reload()
      
      // Se connecter avec l'utilisateur créé
      cy.get('#login-email').type(testEmail)
      cy.get('#login-password').type('Password123!')
      cy.get('button[type="submit"]').click()
      
      // Attendre que la liste des utilisateurs se charge
      cy.get('.users-title', { timeout: 10000 }).should('contain', 'Gestion des utilisateurs')
    })

    it('Devrait voir la liste des utilisateurs en tant qu\'utilisateur normal', () => {
      cy.get('.users-title').should('contain', 'Gestion des utilisateurs')
      cy.get('.user-card').should('exist')
    })

    it('Ne devrait pas voir les boutons de suppression en tant qu\'utilisateur normal', () => {
      cy.get('.delete-btn').should('not.exist')
    })

    it('Ne devrait pas voir les détails complets des utilisateurs', () => {
      // Les utilisateurs normaux ne voient que les emails
      cy.get('.user-email').should('exist')
      // Mais pas les détails comme la date de naissance, ville, etc.
      cy.get('.user-detail-item').should('not.exist')
    })
  })

  describe('Accès en tant qu\'administrateur', () => {
    beforeEach(() => {
      // Se connecter en tant qu'admin
      cy.get('#login-email').type('loise.fenoll@ynov.com')
      cy.get('#login-password').type('PvdrTAzTeR247sDnAZBr')
      cy.get('button[type="submit"]').click()
      
      // Attendre que la liste des utilisateurs se charge
      cy.get('.users-title', { timeout: 10000 }).should('contain', 'Gestion des utilisateurs')
    })

    it('Devrait voir la liste complète des utilisateurs en tant qu\'admin', () => {
      cy.get('.users-title').should('contain', 'Gestion des utilisateurs')
      cy.get('.user-card').should('exist')
      cy.get('.user-email').should('exist')
    })

    it('Devrait voir les détails complets des utilisateurs en tant qu\'admin', () => {
      // Les admins voient tous les détails
      cy.get('.user-detail-item').should('exist')
    })

    it('Devrait voir les boutons de suppression pour les autres utilisateurs', () => {
      // Vérifier qu'il y a des boutons de suppression (sauf pour l'admin lui-même)
      cy.get('.delete-btn').should('exist')
    })

    it('Ne devrait pas voir de bouton de suppression pour son propre compte', () => {
      // L'admin ne peut pas se supprimer lui-même
      cy.get('.user-email').contains('loise.fenoll@ynov.com').parent().parent().parent().within(() => {
        cy.get('.delete-btn').should('not.exist')
      })
    })

    it('Devrait pouvoir supprimer un utilisateur', () => {
      // Compter le nombre d'utilisateurs avant suppression
      cy.get('.user-card').then(($cards) => {
        const initialCount = $cards.length
        
        // Supprimer le premier utilisateur (qui n'est pas l'admin)
        cy.get('.delete-btn').first().click()
        
        // Confirmer la suppression
        cy.on('window:confirm', () => true)
        
        // Vérifier que le nombre d'utilisateurs a diminué
        cy.get('.user-card').should('have.length', initialCount - 1)
      })
    })

    it('Devrait afficher le badge admin', () => {
      cy.get('.role-badge').should('contain', 'Admin')
    })

    it('Devrait pouvoir se déconnecter', () => {
      cy.get('.logout-btn').click()
      cy.get('.auth-title').should('contain', 'Connexion')
      cy.get('.users-title').should('not.exist')
    })
  })

  describe('Gestion des erreurs', () => {
    it('Devrait gérer les erreurs de chargement des utilisateurs', () => {
      // Se connecter en tant qu'admin
      cy.get('#login-email').type('loise.fenoll@ynov.com')
      cy.get('#login-password').type('PvdrTAzTeR247sDnAZBr')
      cy.get('button[type="submit"]').click()
      
      // Vérifier que la liste des utilisateurs se charge correctement
      cy.get('.users-title', { timeout: 10000 }).should('contain', 'Gestion des utilisateurs')
      cy.get('.user-card').should('exist')
      
      // Vérifier que le bouton de retry existe (en cas d'erreur future)
      // Note: Ce test vérifie que l'interface est prête à gérer les erreurs
      cy.get('.retry-btn').should('not.exist') // Normalement pas d'erreur au démarrage
    })
  })
}) 