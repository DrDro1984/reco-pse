let scenario = null;
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
  document.getElementById("question").textContent = etape.question;
  document.getElementById("reponse").value = "";
  document.getElementById("feedback").textContent = "";
}

function valider() {
  const etape = etapes[scenario.etapes[index]];
  const reponse = normaliser(
    document.getElementById("reponse").value
  );

  const ok = etape.attendus.some(attendu =>
    reponse.includes(normaliser(attendu))
  );

  const feedback = document.getElementById("feedback");

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
