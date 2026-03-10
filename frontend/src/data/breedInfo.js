const breedData = {
  Gir: {
    milkYield: "10-16 liters per day",
    favourableConditions: "Hot and humid climates, semi-arid regions. Originated in Gir Forest of Gujarat. Requires good grazing land and adequate water supply.",
    diseases: "Foot and mouth disease, Mastitis, Theileriosis, Brucellosis, Tuberculosis",
    avgLifespan: "15-18 years",
    fodderInfo: "Grass, legumes, supplemented with concentrate feed. Requires 6-8 kg dry matter per day. Easy to adapt to local fodder."
  },
  Sahiwal: {
    milkYield: "8-14 liters per day",
    favourableConditions: "Hot and dry climates, semi-arid and sub-humid regions. Originated in Punjab region. Heat and drought tolerant.",
    diseases: "Mastitis, Foot and mouth disease, Theileriosis, Black quarter, Brucellosis",
    avgLifespan: "14-17 years",
    fodderInfo: "Can thrive on poor-quality fodder. Requires 5-7 kg dry matter per day. Excellent foragers, adaptable to local vegetation."
  },
  "Red Sindhi": {
    milkYield: "6-10 liters per day",
    favourableConditions: "Hot and humid to semi-arid climates. Originated in Sindhi region of Pakistan. Climate tolerant and disease resistant.",
    diseases: "Mastitis, Infertility, Foot and mouth disease, Theileriosis, Brucellosis",
    avgLifespan: "12-15 years",
    fodderInfo: "Moderate fodder requirement of 4-6 kg dry matter per day. Produces good milk on average quality feed."
  },
  Tharparkar: {
    milkYield: "7-12 liters per day",
    favourableConditions: "Semi-arid desert climate, low rainfall areas. Originated in Thar Desert. Excellent heat and drought tolerance.",
    diseases: "Mastitis, Anemia, Infertility, Foot and mouth disease, Black quarter",
    avgLifespan: "14-17 years",
    fodderInfo: "Highly adapted to arid regions. Requires 4-6 kg dry matter per day. Can utilize low-quality fodder effectively."
  },
  Murrah: {
    milkYield: "12-16 liters per day (Buffalo)",
    favourableConditions: "Requires water bodies, marshy areas, tropical and subtropical climates. Excellent milk producer.",
    diseases: "Mastitis, Foot and mouth disease, Brucellosis, Tuberculosis, Infertility",
    avgLifespan: "15-18 years",
    fodderInfo: "Green fodder requirement 6-8 kg per day. Prefers rice straw, water hyacinth, and other aquatic vegetation."
  },
  Jafarabadi: {
    milkYield: "10-14 liters per day (Buffalo)",
    favourableConditions: "Hot and humid climates with water bodies nearby. Requires marshy terrain. Good meat and milk producer.",
    diseases: "Mastitis, Foot and mouth disease, Brucellosis, Tuberculosis, Theileriosis",
    avgLifespan: "14-17 years",
    fodderInfo: "Requires 6-8 kg dry matter per day, preferable with green fodder. Excellent water foragers, suited for wetland areas."
  },
  ponwar: {
    milkYield: "8-12 liters per day",
    favourableConditions: "Adapted to Indian subcontinent climates. Moderate heat and disease tolerance.",
    diseases: "Mastitis, Foot and mouth disease, Theileriosis, Brucellosis",
    avgLifespan: "14-16 years",
    fodderInfo: "Moderate fodder requirements. Requires 5-7 kg dry matter per day. Adaptable to local vegetation."
  }
};

export const breedInfo = breedData;

// Fallback function to get breed info with safe access
export const getBreedInfo = (breedName) => {
  return breedData[breedName] || {
    milkYield: "Information not available",
    favourableConditions: "Information not available",
    diseases: "Information not available",
    avgLifespan: "Information not available",
    fodderInfo: "Information not available"
  };
};
