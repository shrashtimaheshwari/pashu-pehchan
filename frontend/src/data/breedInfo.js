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
  Jaffrabadi: {
    milkYield: "10-14 liters per day (Buffalo)",
    favourableConditions: "Hot and humid climates with water bodies nearby. Requires marshy terrain. Good meat and milk producer.",
    diseases: "Mastitis, Foot and mouth disease, Brucellosis, Tuberculosis, Theileriosis",
    avgLifespan: "14-17 years",
    fodderInfo: "Requires 6-8 kg dry matter per day, preferable with green fodder. Excellent water foragers, suited for wetland areas."
  },
  Mehsana: {
    milkYield: "10-16 liters per day (Buffalo)",
    favourableConditions: "Hot and humid climates, marshy areas. Originated in Gujarat. Good adaptation to tropical conditions.",
    diseases: "Mastitis, Foot and mouth disease, Brucellosis, Tuberculosis, Theileriosis",
    avgLifespan: "14-16 years",
    fodderInfo: "Requires 6-7 kg dry matter per day. Prefers green fodder and aquatic vegetation. Excellent milk producer."
  },
  Nili_Ravi: {
    milkYield: "14-18 liters per day (Buffalo)",
    favourableConditions: "Hot and humid climates with water sources. Originated in Punjab region. Excellent dairy breed with premium milk fat.",
    diseases: "Mastitis, Brucellosis, Tuberculosis, Foot and mouth disease, Infertility",
    avgLifespan: "16-18 years",
    fodderInfo: "Requires 6-8 kg dry matter per day. Prefers green fodder and water hyacinth. High milk fat content."
  },
  Alambadi: {
    milkYield: "2-4 liters per day (Dual purpose)",
    favourableConditions: "Hot and humid climates. Originated in Alambadi region of Tamil Nadu. Good for meat and draught purposes.",
    diseases: "Mastitis, Foot and mouth disease, Theileriosis, Brucellosis, Anemia",
    avgLifespan: "12-14 years",
    fodderInfo: "Moderate fodder requirements, 4-5 kg dry matter per day. Adaptable to local climate and vegetation."
  },
  "Himachali Pahari": {
    milkYield: "4-6 liters per day",
    favourableConditions: "Cold and hilly terrains of Himachal Pradesh. Excellent adaptation to mountainous regions and steep slopes.",
    diseases: "Foot and mouth disease, Mastitis, Pneumonia, Tuberculosis",
    avgLifespan: "12-15 years",
    fodderInfo: "Requires 3-4 kg dry matter per day. Excellent foragers on mountainous grazing. Can survive on sparse vegetation."
  },
  Kangayam: {
    milkYield: "3-5 liters per day (Draught)",
    favourableConditions: "Semi-arid regions of Tamil Nadu. Excellent draught and meat breed. Heat and drought tolerant.",
    diseases: "Foot and mouth disease, Mastitis, Theileriosis, Black quarter, Brucellosis",
    avgLifespan: "14-17 years",
    fodderInfo: "Requires 4-5 kg dry matter per day. Can thrive on poor quality fodder. Excellent for agricultural work."
  },
  Kasargod: {
    milkYield: "4-6 liters per day",
    favourableConditions: "Hot and humid climates of Kerala and coastal regions. Excellent adaptation to tropical conditions.",
    diseases: "Mastitis, Foot and mouth disease, Theileriosis, Brucellosis, Trypanosomiasis",
    avgLifespan: "12-14 years",
    fodderInfo: "Moderate fodder requirement of 4-5 kg dry matter per day. Adaptable to coastal vegetation and coconut fodder."
  },
  Kenkatha: {
    milkYield: "5-8 liters per day",
    favourableConditions: "Originated in West Bengal and Odisha. Adapted to humid subtropical climates with high humidity and rainfall.",
    diseases: "Mastitis, Foot and mouth disease, Brucellosis, Tuberculosis, Infertility",
    avgLifespan: "12-15 years",
    fodderInfo: "Requires 5-6 kg dry matter per day. Good adaptation to moist climates and river valley regions."
  },
  Umblachery: {
    milkYield: "3-5 liters per day",
    favourableConditions: "Hot and humid climates of Tamil Nadu. Primarily used for meat production. Hardy and disease resistant.",
    diseases: "Foot and mouth disease, Mastitis, Theileriosis, Brucellosis",
    avgLifespan: "12-14 years",
    fodderInfo: "Requires 4-5 kg dry matter per day. Good meat quality. Adaptable to local fodder."
  },
  Khariar: {
    milkYield: "4-7 liters per day",
    favourableConditions: "Hot and humid climates of Odisha. Good all-purpose breed with decent milk production and draught ability.",
    diseases: "Foot and mouth disease, Mastitis, Theileriosis, Brucellosis, Tuberculosis",
    avgLifespan: "13-16 years",
    fodderInfo: "Requires 5-6 kg dry matter per day. Adaptable to local climate and feed resources."
  },
  Kosali: {
    milkYield: "3-6 liters per day",
    favourableConditions: "Hot and humid climates of Odisha and Eastern India. Multi-purpose breed suitable for dairy and draught.",
    diseases: "Foot and mouth disease, Mastitis, Theileriosis, Brucellosis, Infertility",
    avgLifespan: "13-16 years",
    fodderInfo: "Moderate fodder requirement of 4-5 kg dry matter per day. Good on local vegetation."
  },
  motu: {
    milkYield: "3-5 liters per day",
    favourableConditions: "Hot and humid tropical climates. Originated in South India. Good for meat production.",
    diseases: "Foot and mouth disease, Mastitis, Theileriosis, Brucellosis, Trypanosomiasis",
    avgLifespan: "11-13 years",
    fodderInfo: "Requires 3-4 kg dry matter per day. Excellent foragers. Hardy and adaptable to tropical conditions."
  },
  Nimari: {
    milkYield: "4-8 liters per day",
    favourableConditions: "Hot and humid climates of Central India. Good dual-purpose breed for milk and draught.",
    diseases: "Foot and mouth disease, Mastitis, Theileriosis, Brucellosis, Anemia",
    avgLifespan: "13-15 years",
    fodderInfo: "Requires 5-6 kg dry matter per day. Adaptable to mixed crop-livestock farming systems."
  },
  "Red kandhari": {
    milkYield: "3-5 liters per day",
    favourableConditions: "Hot and dry climates of Karnataka. Hardy and disease resistant. Good for meat production.",
    diseases: "Foot and mouth disease, Black quarter, Mastitis, Brucellosis, Theileriosis",
    avgLifespan: "12-15 years",
    fodderInfo: "Requires 3-4 kg dry matter per day. Excellent foragers on range lands and can survive on sparse vegetation."
  },
  Vechur: {
    milkYield: "5-8 liters per day",
    favourableConditions: "Hot and humid climates of Kerala. Rare dwarf breed. Excellent for small-scale farming and homesteads.",
    diseases: "Foot and mouth disease, Mastitis, Infertility, Brucellosis, Theileriosis",
    avgLifespan: "12-14 years",
    fodderInfo: "Small breed requiring only 2-3 kg dry matter per day. Very efficient milk producers for their size."
  },
  Bargur: {
    milkYield: "4-7 liters per day",
    favourableConditions: "Hot and semi-arid climates of Tamil Nadu. Good for both meat and draught purposes.",
    diseases: "Foot and mouth disease, Mastitis, Theileriosis, Black quarter, Brucellosis",
    avgLifespan: "13-16 years",
    fodderInfo: "Requires 4-5 kg dry matter per day. Hardy and adaptable to varied agro-climatic conditions."
  },
  Guernsey: {
    milkYield: "16-19 liters per day",
    favourableConditions: "Originated in UK / Guernsey. Best suited for temperate climates with good rainfall and cool temperatures.",
    diseases: "Mastitis, Foot and mouth disease, Reproductive disorders, Tuberculosis",
    avgLifespan: "12-15 years",
    fodderInfo: "Requires 7-9 kg dry matter per day with quality concentrate. Prefers managed grazing and good quality hay."
  },
  "Poda Thirupu": {
    milkYield: "3-5 liters per day",
    favourableConditions: "Hot and humid climates of Tamil Nadu. Primarily beef breed with good meat quality.",
    diseases: "Foot and mouth disease, Mastitis, Theileriosis, Brucellosis, Black quarter",
    avgLifespan: "11-13 years",
    fodderInfo: "Requires 4-5 kg dry matter per day. Good meat production with efficient feed conversion."
  },
  Rathi: {
    milkYield: "5-10 liters per day",
    favourableConditions: "Semi-arid and drought-prone regions of Rajasthan. Heat and drought tolerant with good milk production.",
    diseases: "Mastitis, Foot and mouth disease, Theileriosis, Black quarter, Brucellosis",
    avgLifespan: "14-17 years",
    fodderInfo: "Requires 4-5 kg dry matter per day. Excellent foragers. Can survive on poor quality fodder."
  },
  Dangi: {
    milkYield: "3-5 liters per day",
    favourableConditions: "Originated in dry regions of Gujarat. Excellent for beef production and draught work.",
    diseases: "Foot and mouth disease, Mastitis, Black quarter, Theileriosis, Brucellosis",
    avgLifespan: "12-15 years",
    fodderInfo: "Moderate requirements of 3-4 kg dry matter per day. Hardy and adaptable to adverse conditions."
  },
  ponwar: {
    milkYield: "8-12 liters per day",
    favourableConditions: "Adapted to Indian subcontinent climates. Moderate heat and disease tolerance. Originated in Central India.",
    diseases: "Mastitis, Foot and mouth disease, Theileriosis, Brucellosis, Infertility",
    avgLifespan: "14-16 years",
    fodderInfo: "Moderate fodder requirements. Requires 5-7 kg dry matter per day. Adaptable to local vegetation."
  },
  siri: {
    milkYield: "4-6 liters per day",
    favourableConditions: "Hot and humid climates with high rainfall. Originated in Coorg region of Karnataka. Good foragers.",
    diseases: "Foot and mouth disease, Mastitis, Theileriosis, Brucellosis, Infertility",
    avgLifespan: "12-14 years",
    fodderInfo: "Requires 4-5 kg dry matter per day. Adaptable to hilly and rainfall-rich regions."
  },
  Amritmahal: {
    milkYield: "2-4 liters per day (Draught)",
    favourableConditions: "Hot and semi-arid regions of Karnataka. Primarily used for draught and meat purposes.",
    diseases: "Foot and mouth disease, Black quarter, Mastitis, Theileriosis, Brucellosis",
    avgLifespan: "13-16 years",
    fodderInfo: "Requires 3-4 kg dry matter per day. Excellent draught animals with good strength and stamina."
  },
  dagri: {
    milkYield: "4-6 liters per day",
    favourableConditions: "Hot and humid climates of North Eastern India. Suited for forest and hilly regions.",
    diseases: "Foot and mouth disease, Mastitis, Pneumonia, Brucellosis, Infertility",
    avgLifespan: "12-14 years",
    fodderInfo: "Moderate requirements of 4-5 kg dry matter per day. Good foragers in forest regions."
  },
  gangatari: {
    milkYield: "6-9 liters per day",
    favourableConditions: "Hot and humid climates of Eastern India near Ganges region. Multi-purpose breed.",
    diseases: "Foot and mouth disease, Mastitis, Brucellosis, Tuberculosis, Theileriosis",
    avgLifespan: "13-15 years",
    fodderInfo: "Requires 5-6 kg dry matter per day. Good adaptation to river valley regions and humid climate."
  },
  Hariana: {
    milkYield: "6-10 liters per day",
    favourableConditions: "Hot and semi-arid climates of Haryana. Good dual-purpose breed for milk and draught.",
    diseases: "Mastitis, Foot and mouth disease, Theileriosis, Black quarter, Brucellosis",
    avgLifespan: "14-17 years",
    fodderInfo: "Requires 5-6 kg dry matter per day. Hardy and adaptable to hot weather conditions."
  },
  nagori: {
    milkYield: "3-5 liters per day (Draught)",
    favourableConditions: "Hot and arid regions of Rajasthan. Excellent draught breed with strong physique for heavy work.",
    diseases: "Foot and mouth disease, Black quarter, Mastitis, Theileriosis, Anemia",
    avgLifespan: "14-17 years",
    fodderInfo: "Requires 4-5 kg dry matter per day. Hardy and efficient. Good for agricultural work in arid regions."
  },
  ongole: {
    milkYield: "4-8 liters per day",
    favourableConditions: "Hot and humid to semi-arid climates of Andhra Pradesh. Good meat and draught breed with decent milk.",
    diseases: "Foot and mouth disease, Mastitis, Theileriosis, Black quarter, Brucellosis",
    avgLifespan: "14-17 years",
    fodderInfo: "Requires 5-6 kg dry matter per day. Hardy and adaptable to various agro-climatic conditions."
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
