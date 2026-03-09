const people = [
  "Ivan",
  "Alvaro",
  "Alba",
  "Andreu",
  "Berni",
  "Eric",
  "Nora",
  "Paula",
  "Ruben",
  "Sergi",
  "Vera",
  "Isa",
  "Jordi",
  "Maria"
];

const paid = {
  Vera: 23.23,
  Jordi: 2,
  Alvaro: 76.20,
  Berni: 5.50
};

const items = [
  { id: 1, name: "CARBO VEGETAL", price: 4.25, category: "comun", consumers: "all" },
  //{ id: 2, name: "BOSSA PLASTIC", price: 1.20, category: "comun", consumers: "all" },
  { id: 3, name: "OLI VERGE", price: 4.45, category: "comun", exclude: ["Berni", "Vera"] },
  { id: 4, name: "ROTLLIE CUINA GEGANT", price: 2.90, category: "comun", consumers: "all" },
  { id: 5, name: "SAL FINA", price: 0.40, category: "comun", consumers: "all" },
  { id: 6, name: "ALL SEC 250 G", price: 1.85, category: "comun", consumers: "all" },
  { id: 7, name: "ALLOTI TARRINA", price: 1.10, category: "comun", exclude: ["Berni", "Vera"] },
  { id: 8, name: "GOT REUTILITZABLE", price: 1.65, category: "comun", consumers: "all" },
  { id: 9, name: "SALSA CALÇOTS (4)", price: 11.20, category: "comun", exclude: ["Berni", "Vera"] },
  { id: 10, name: "OLIVA AMB OS PET", price: 1.40, category: "comun", consumers: "all" },
  { id: 11, name: "PEBRE NEGRE MOLT", price: 1.30, category: "comun", consumers: "all" },
  { id: 12, name: "HIGIENIC DOBLE ROLL", price: 4.50, category: "comun", consumers: "all" },
  { id: 13, name: "CALÇOTS", price: 40.00, category: "comun", exclude: ["Berni", "Vera"] },
  { id: 14, name: "OLIVAS", price: 4.89, category: "comun", exclude: ["Isa"] },
  { id: 15, name: "PATATAS", price: 5.98, category: "comun", consumers: "all" },
  { id: 16, name: "PATATAS CAMPESINAS", price: 2.05, category: "comun", consumers: "all" },
  { id: 17, name: "RUFFLES JAMÓN", price: 2.99, category: "comun",  exclude: ["Berni"] },
  { id: 18, name: "PAPEL DE PLATA", price: 3.34, category: "comun", consumers: "all" },
  { id: 19, name: "BOLSAS DE BASURA", price: 2.10, category: "comun", exclude: ["Ruben", "Eric"] },
  { id: 20, name: "ESTROPAJO", price: 2.00, category: "comun", consumers: "all" },
  { id: 21, name: "HIELOS", price: 5.50, category: "comun", exclude: ["Isa"] },
  { id: 22, name: "PASTILLAS CARBON", price: 1.05, category: "comun", consumers: "all" }
];
