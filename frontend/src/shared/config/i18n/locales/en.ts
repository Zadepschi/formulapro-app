import type { TranslationKey } from "../types";

export const en: Record<TranslationKey, string> = {
  appName: "FormulaPro",
  home: "Home",
  calculators: "Calculators",
  circle: "Circle",
  triangle: "Triangle",
  sphere: "Sphere",
  cone: "Cone",
  prism: "Rectangular Prism",
  parallelogram: "Parallelogram",
  quiz: "Knowledge Test",
  history: "Calculation History",
  settings: "Settings",
  about: "About",

  welcome: "Welcome to FormulaPro",
  description:
    "Explore geometry, perform calculations, and test your knowledge.",

  language: "Language",
  theme: "Theme",
  light: "Light",
  dark: "Dark",
  pastel: "Pastel",

  aboutTitle: "About FormulaPro",
  aboutSubtitle: "Making mathematics easier",

  aboutDescriptionTitle: "About the application",
  aboutDescription:
    "FormulaPro is an application for mathematical calculations, learning geometry, and testing your knowledge. It helps users perform calculations, explore geometric shapes, and better understand mathematical formulas.",

  aboutFeaturesTitle: "Application features",
  aboutFeature2D:
    "2D calculators: circle, triangle, and parallelogram.",
  aboutFeature3D:
    "3D calculators: sphere, cone, and rectangular prism.",
  aboutFeatureQuiz:
    "Knowledge test to check your understanding of mathematics.",
  aboutFeatureHistory:
    "Calculation history for reviewing previous results.",
  aboutFeatureLanguages:
    "Russian and English language support.",
  aboutFeatureThemes:
    "Light and dark themes.",

  aboutMissionTitle: "Our mission",
  aboutMission:
    "To make mathematical calculations understandable, accessible, and convenient for everyone. We aim to combine learning and practice in one application.",

  aboutVersion: "Version",
  aboutCopyright: "All rights reserved.",

  heroEyebrow: "GEOMETRY • FORMULAS • CALCULATIONS",
  featureCalculations: "Online calculations",
  featureFormulas: "Formulas and explanations",
  featureTests: "Knowledge tests",
  featureHistory: "Geometry history",
  quizDescription: "Test your knowledge",
  historyDescription: "Geometry development",

   //circle
circleTitle: "Circle Calculator",
circleSubtitle: "Change the parameters and see how the circle changes.",
inputValues: "Input values",
radius: "Radius (r)",
sectorAngle: "Sector angle (°)",
visualization: "Visualization",
invalidCircle: "Enter a radius greater than 0 and an angle from 0° to 360°.",
correctCircle: "Correct the input values to display the circle.",
resultsAndSolution: "Results and solutions",
diameter: "Diameter",
circumference: "Circumference",
circleArea: "Circle area",
arcLength: "Arc length",
formula: "Formula",
solution: "Solution",
saveToHistory: "Save to history",
saving: "Saving...",
savedSuccessfully: "Calculation saved to history!",
saveError: "Could not save. Check whether the server is running.",
//cone

coneTitle: "Cone — Volume and Surface Area",
coneSubtitle: "Enter the radius of the base and the height of the cone.",
coneParameters: "Cone Parameters",
baseRadius: "Base radius",
height: "Height",
enterRadius: "Enter radius",
enterHeight: "Enter height",
invalidCone: "Enter positive values for the radius and height.",
coneVisualization: "3D Cone Model",
coneResults: "Calculation Results",
coneVolume: "Cone Volume",
totalSurfaceArea: "Total Surface Area",
slantHeight: "Slant height",
coneEmptyResults: "Results will appear after entering valid values.",

//parallelogram

parallelogramTitle: "Parallelogram Calculator",
parallelogramSubtitle: "Change the parameters and see how the parallelogram changes.",
base: "Base",
side: "Side",
heightToBase: "Height to base",
invalidParallelogram: "Enter positive values. The height cannot exceed the side length.",
correctParallelogram: "Correct the input values to display the parallelogram.",
perimeter: "Perimeter",
area: "Area",
parallelogramSaveError: "Could not save the calculation. Check the server connection.",

//prism

prismTitle: "Rectangular Prism — Volume and Surface Area",
prismSubtitle: "Enter the length, width and height of the prism.",
prismParameters: "Prism Parameters",
length: "Length",
width: "Width",
enterLength: "Enter length",
enterWidth: "Enter width",
invalidPrism: "Enter positive values for all three parameters.",
prismVisualization: "3D Rectangular Prism Model",
prismResults: "Calculation Results",
prismVolume: "Prism Volume",
prismEmptyResults: "Results will appear after entering valid values.",
prismSaveError: "Could not save the calculation. Check your server connection.",

};