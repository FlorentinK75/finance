// Données par défaut pour le modèle financier

export const defaultInputs = {
    // Objectif global de CA
    targetRevenue: 500000,
    
    // Prix et offres
    pricing: {
      smallAssociation: {
        monthlyPrice: 20,
        yearlyDiscount: 0.1, // 10% de réduction
      },
      largeAssociation: {
        monthlyPrice: 50,
        yearlyDiscount: 0.1, // 10% de réduction
      },
      localAuthority: {
        pack10: {
          price: 2280,
          discount: 0.05, // 5% de réduction
        },
        pack20: {
          price: 4320,
          discount: 0.1, // 10% de réduction
        },
        pack50: {
          price: 10200,
          discount: 0.15, // 15% de réduction
        },
        pack100: {
          price: 19200,
          discount: 0.2, // 20% de réduction
        },
      },
    },
    
    // Répartition initiale des clients
    initialDistribution: {
      smallAssociations: 833, // Petites assos
      largeAssociations: 333, // Grandes assos
      localAuthorities: {
        pack10: 5,
        pack20: 5,
        pack50: 5,
        pack100: 1,
      },
    },
    
    // Taux de paiement annuel vs mensuel (pourcentage de clients qui paient annuellement)
    annualPaymentRate: {
      smallAssociations: 0.7, // 70% paient annuellement
      largeAssociations: 0.8, // 80% paient annuellement
      localAuthorities: 1, // 100% paient annuellement
    },
    
    // Modules d'upsell
    upsells: {
      tempo: {
        trimester: 1,
        pricePerYear: 0, // Inclus dans l'abonnement
        adoptionRate: {
          smallAssociations: 1, // 100%
          largeAssociations: 1, // 100%
          localAuthorities: 1, // 100%
        },
      },
      mutualization: {
        trimester: 2,
        pricePerYear: 100, // 100€/an/asso
        adoptionRate: {
          smallAssociations: 0,
          largeAssociations: 0,
          localAuthorities: 0.3, // 30%
        },
      },
      aiAssistant: {
        trimester: 2,
        pricePerMonth: 10, // 10€/mois/asso
        adoptionRate: {
          smallAssociations: 0.3, // 30%
          largeAssociations: 0.3, // 30%
          localAuthorities: 0,
        },
      },
      communication: {
        trimester: 3,
        pricePerMonth: 10, // 10€/mois/asso
        adoptionRate: {
          smallAssociations: 0.2, // 20%
          largeAssociations: 0.2, // 20%
          localAuthorities: 0,
        },
      },
      subsidies: {
        trimester: 3,
        pricePerYear: 300, // environ 300€/an (1% du budget)
        adoptionRate: {
          smallAssociations: 0.7, // 70%
          largeAssociations: 0.7, // 70%
          localAuthorities: 0,
        },
      },
    },
    
    // Acquisition
    acquisition: {
      channels: {
        email: {
          conversionRate: 0.01, // 1%
          timePerContact: 0, // automatisé
        },
        phone: {
          conversionRate: 0.05, // 5%
          timePerContact: 5, // 5 minutes
        },
        linkedin: {
          conversionRate: 0.02, // 2%
          timePerContact: 0, // automatisé
        },
      },
      conversion: {
        webinar: {
          meeting1ToMeeting2Rate: 0.2, // 20%
          meeting2ToClientRate: 0.4, // 40%
          timePerClient: 15, // 15 minutes
        },
        videoCall: {
          meeting1ToMeeting2Rate: 0.5, // 50%
          meeting2ToClientRate: 0.6, // 60%
          timePerClient: 60, // 1 heure
        },
      },
      meetings: {
        perWeek: 15, // 15 rendez-vous par semaine
      },
      cacPerClient: 60, // 60€ par client
    },
    
    // Coûts
    costs: {
      salaries: {
        founder: {
          annual: 36000, // 36 000€/an
          growth: 'stable',
        },
        development: {
          annual: 45000, // 45 000€/an
          addPerClients: 400, // +1 à partir de 400 clients
        },
        sales: {
          annual: 28800, // 28 800€/an
          addPerClients: 150, // +1 tous les 150 clients
        },
      },
      technical: {
        hosting: 2000, // 2 000€/an
        domain: 300, // 300€/an
        internalTools: 1200, // 1 200€/an
        security: 1500, // 1 500€/an
      },
    },
    
    // Croissance
    growth: {
      organic: {
        annual: 0.175, // 17.5% (moyenne entre 15-20%)
      },
      acquisition: {
        emailCost: 300, // 300€/mois
        emailLeads: 150, // 150 leads/mois
        forumsCost: 2000, // 2 000€/trimestre
        forumsContacts: 50, // 50 contacts qualifiés
        partnersCost: 250, // 250€/mois (moyenne entre 0-500€)
      },
    },
    
    // Churn
    churn: {
      monthly: {
        smallAssociations: 0.03, // 3%
        largeAssociations: 0.02, // 2%
        localAuthorities: 0.01, // 1%
      },
      evolution: {
        smallAssociations: 0.022, // Évolue vers 2.2%
        largeAssociations: 0.015, // Évolue vers 1.5%
        localAuthorities: 0.005, // Évolue vers 0.5%
      },
    },
  };
  
  // Définition des couleurs pour les segments
  export const segmentColors = {
    smallAssociations: '#1976d2',
    largeAssociations: '#388e3c',
    localAuthorities: '#f57c00',
    expenses: '#d32f2f',
    profit: '#9c27b0',
  };
  
  // Données pour les trimestres
  export const quarters = [
    'T1 Année 1', 'T2 Année 1', 'T3 Année 1', 'T4 Année 1',
    'T1 Année 2', 'T2 Année 2', 'T3 Année 2', 'T4 Année 2',
    'T1 Année 3', 'T2 Année 3', 'T3 Année 3', 'T4 Année 3',
  ];