let scenario = null;
let sousEtapesValidees = [];
let etapes = {};
let index = 0;

async function chargerScenario() {
  scenario = await fetch("data/scenarios/acr.json")
    .then(r => r.json());

  for (const id of scenario.etapes) {
    etapes[id] = await fetch(`data/etapes/${id}.json`)
      .then(r => r.json());
  }

  afficherEtape();
}

function normaliser(texte) {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "");
}

function afficherEtape() {
  const etape = etapes[scenario.etapes[index]];

  sousEtapesValidees = [];

  document.getElementById("question").textContent = etape.question;
  document.getElementById("reponse").value = "";
  document.getElementById("feedback").textContent = "";
}

function valider() {
  const etape = etapes[scenario.etapes[index]];
  const reponse = normaliser(
    document.getElementById("reponse").value
  );

  const feedback = document.getElementById("feedback");

  // --- CAS 1 : étape avec sous-étapes ---
  if (etape.sous_etapes) {
    let progression = false;
    let messages = [];

    for (const sousEtape of etape.sous_etapes) {
      if (sousEtapesValidees.includes(sousEtape.id)) {
        continue;
      }

      const trouve = sousEtape.attendus.some(attendu =>
        reponse.includes(normaliser(attendu))
      );

      if (trouve) {
        sousEtapesValidees.push(sousEtape.id);
        progression = true;
        messages.push("✔️ " + sousEtape.feedback);
      }
    }

    if (messages.length > 0) {
      feedback.innerHTML = messages.join("<br>");
    }

    if (sousEtapesValidees.length === etape.sous_etapes.length) {
      setTimeout(() => {
        feedback.textContent = etape.feedback.ok;
        index++;
        if (index < scenario.etapes.length) {
          setTimeout(afficherEtape, 800);
        } else {
          document.getElementById("question").textContent =
            "Scénario terminé.";
        }
      }, 800);
      return;
    }

    if (!progression) {
      feedback.textContent = etape.feedback.ko;
    }

    return;
  }

  // --- CAS 2 : étape simple (attendus classiques) ---
  const ok = etape.attendus.some(attendu =>
    reponse.includes(normaliser(attendu))
  );

  if (ok) {
    feedback.textContent = etape.feedback.ok;
    index++;
    if (index < scenario.etapes.length) {
      setTimeout(afficherEtape, 800);
    } else {
      document.getElementById("question").textContent =
        "Scénario terminé.";
    }
  } else {
    feedback.textContent = etape.feedback.ko;
  }
}


chargerScenario();
