---
config:
  layout: dagre
  theme: neo-dark
---
flowchart TD
    Start(["Début"]) --> LoadQuiz["Charger la première question du quiz"]
    LoadQuiz --> ShowQuestion["Afficher la question et les choix"]
    ShowQuestion -- oui --> Answer{"Utilisateur sélectionne une réponse ?"}
    Answer -- Oui --> Check["Vérifier la réponse"]
    Check -- Bonne réponse --> FeedbackGood["Bonne réponse en vert !"]
    Check -- Mauvaise réponse --> FeedbackBad["Mauvaise réponseen rouge"]
    FeedbackGood --> NextQuestion["Cliquer sur Question suivante ?"]
    FeedbackBad --> NextQuestion
    NextQuestion -- Oui, il reste des questions --> ShowQuestion
    NextQuestion -- Non, quiz terminé --> End(["Fin du quiz, score affiché"])
    ShowQuestion -- non --> Error@{ label: "Afficher un message d'erreur" }
    Error@{ shape: rect}
