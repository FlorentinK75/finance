export const segmentColors = {
  smallAssociations: '#2196f3',
  largeAssociations: '#4caf50',
  localAuthorities: '#ff9800',
  mutualization: '#9c27b0',
  aiAssistant: '#f44336',
  communication: '#009688',
  subsidies: '#795548'
};

export const quarters = [
  'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024',
  'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025',
  'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'
];

export const defaultInputs = {
  targetRevenue: 500000,
  initialDistribution: {
    smallAssociations: 50,
    largeAssociations: 20,
    localAuthorities: {
      pack10: 5,
      pack20: 3,
      pack50: 2,
      pack100: 1
    }
  },
  annualPaymentRate: {
    smallAssociations: 0.3,
    largeAssociations: 0.5
  },
  pricing: {
    smallAssociation: {
      monthlyPrice: 49,
      yearlyDiscount: 0.1
    },
    largeAssociation: {
      monthlyPrice: 99,
      yearlyDiscount: 0.15
    },
    localAuthority: {
      pack10: {
        price: 299,
        discount: 0.05
      },
      pack20: {
        price: 499,
        discount: 0.1
      },
      pack50: {
        price: 999,
        discount: 0.15
      },
      pack100: {
        price: 1499,
        discount: 0.2
      }
    }
  },
  upsells: {
    tempo: {
      trimester: 1
    },
    mutualization: {
      pricePerYear: 299,
      adoptionRate: {
        localAuthorities: 0.3
      },
      trimester: 2
    },
    aiAssistant: {
      pricePerMonth: 29,
      adoptionRate: {
        smallAssociations: 0.2,
        largeAssociations: 0.3
      },
      trimester: 3
    },
    communication: {
      pricePerMonth: 49,
      adoptionRate: {
        smallAssociations: 0.15,
        largeAssociations: 0.25
      },
      trimester: 4
    },
    subsidies: {
      pricePerYear: 499,
      adoptionRate: {
        smallAssociations: 0.1,
        largeAssociations: 0.2
      },
      trimester: 5
    }
  },
  churn: {
    monthly: {
      smallAssociations: 0.02,
      largeAssociations: 0.015,
      localAuthorities: 0.01
    },
    evolution: {
      smallAssociations: 0.001,
      largeAssociations: 0.0005,
      localAuthorities: 0.0003
    }
  },
  growth: {
    organic: {
      annual: 0.1
    },
    acquisition: {
      emailCost: 500,
      emailLeads: 50,
      forumsCost: 1000,
      forumsContacts: 30,
      partnersCost: 2000
    }
  },
  acquisition: {
    conversion: {
      webinar: {
        meeting1ToMeeting2Rate: 0.4,
        meeting2ToClientRate: 0.3
      },
      videoCall: {
        meeting1ToMeeting2Rate: 0.5,
        meeting2ToClientRate: 0.4
      }
    },
    meetings: {
      perWeek: 8
    },
    cacPerClient: 500
  },
  costs: {
    salaries: {
      founder: {
        annual: 60000
      },
      development: {
        annual: 45000,
        addPerClients: 200
      },
      sales: {
        annual: 40000,
        addPerClients: 150
      }
    },
    technical: {
      hosting: 2000,
      domain: 100,
      internalTools: 1000,
      security: 2000
    }
  }
};
