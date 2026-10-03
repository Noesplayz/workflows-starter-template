export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Formulier inzending verwerken
    if (request.method === "POST" && url.pathname === "/submit") {
      try {
        const formData = await request.formData();
        
        let emailInhoud = "<h2>Nieuwe vriendenboek pagina ontvangen!</h2><ul style='line-height: 1.8;'>";
        for (const [key, value] of formData.entries()) {
          if (value && value.trim() !== "") {
            emailInhoud += `<li><strong>${key}:</strong> ${value}</li>`;
          }
        }
        emailInhoud += "</ul>";

        // Verstuur e-mail via Resend API
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": "Bearer re_MNC516Jn_GENiGG5HWmUeXExgzx1fDjT4",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "Vriendenboek <onboarding@resend.dev>",
            to: ["musauzan7@gmail.com"],
            subject: `Nieuwe vriendenboek pagina van ${formData.get("naam") || "iemand"}`,
            html: emailInhoud
          })
        });

        if (resendResponse.ok) {
          return new Response(`
            <!DOCTYPE html>
            <html lang="nl">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verzonden!</title>
              <style>
                body { background-color: #e0f7f4; color: #1a4a4d; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .card { background: white; padding: 40px; border-radius: 16px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                a { color: #0d6b6e; text-decoration: none; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Super bedankt! 🎉</h1>
                <p>Je vriendenboek pagina is succesvol verstuurd naar Musa.</p>
                <br>
                <a href="/">← Nog een pagina invullen</a>
              </div>
            </body>
            </html>
          `, {
            headers: { "content-type": "text/html; charset=utf-8" }
          });
        } else {
          const err = await resendResponse.json();
          return new Response("Resend Fout: " + JSON.stringify(err), { status: 500 });
        }
      } catch (err) {
        return new Response("Server Fout: " + err.message, { status: 500 });
      }
    }

    // HTML Pagina tonen
    return new Response(htmlContent, {
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
};

const htmlContent = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vul het vriendenboek in</title>
  <style>
    :root {
      --bg-color: #e0f7f4;
      --card-bg: #ffffff;
      --text-color: #1a4a4d;
      --heading-color: #0d6b6e;
      --input-border: #d0e8e6;
      --input-bg: #f9fdfd;
      --button-bg: #0d6b6e;
      --button-hover: #084d4f;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    body { background-color: var(--bg-color); color: var(--text-color); padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { font-size: 2.5rem; margin-bottom: 8px; }
    .header p { font-size: 1.1rem; opacity: 0.8; }
    .container { max-width: 1100px; margin: 0 auto; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 20px; }
    .card { background: var(--card-bg); border-radius: 16px; padding: 24px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03); }
    .card h2 { color: var(--heading-color); font-size: 1.3rem; margin-bottom: 16px; }
    .form-group { margin-bottom: 14px; }
    .form-group label { display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 6px; }
    .form-group input, .form-group textarea { width: 100%; padding: 10px 14px; border: 1px solid var(--input-border); border-radius: 8px; background-color: var(--input-bg); font-size: 0.95rem; color: var(--text-color); outline: none; }
    .form-group textarea { resize: vertical; min-height: 120px; }
    .submit-container { text-align: center; margin-top: 10px; }
    .submit-btn { background-color: var(--button-bg); color: white; font-size: 1.1rem; font-weight: bold; border: none; padding: 14px 40px; border-radius: 30px; cursor: pointer; transition: background-color 0.2s, transform 0.1s; box-shadow: 0 4px 10px rgba(13, 107, 110, 0.3); }
    .submit-btn:hover { background-color: var(--button-hover); }
    .submit-btn:active { transform: scale(0.98); }
  </style>
</head>
<body>

  <div class="header">
    <h1>Vul het vriendenboek in</h1>
    <p>Vul alles in en geniet van het invullen in de pagina zelf.</p>
  </div>

  <div class="container">
    <form action="/submit" method="POST">

      <div class="grid">
        
        <!-- Jouw gegevens -->
        <div class="card">
          <h2>Jouw gegevens</h2>
          <div class="form-group"><label for="naam">Naam</label><input type="text" id="naam" name="naam" placeholder="Bijvoorbeeld: Sam" required></div>
          <div class="form-group"><label for="bijnaam">Bijnaam</label><input type="text" id="bijnaam" name="bijnaam" placeholder="Bijvoorbeeld: Slaappop"></div>
          <div class="form-group"><label for="leeftijd">Leeftijd</label><input type="number" id="leeftijd" name="leeftijd" placeholder="13"></div>
          <div class="form-group"><label for="woonplaats">Woonplaats</label><input type="text" id="woonplaats" name="woonplaats" placeholder="Bijvoorbeeld: Utrecht"></div>
          <div class="form-group"><label for="lievelingskleur">Lievelingskleur</label><input type="text" id="lievelingskleur" name="lievelingskleur" placeholder="Bijvoorbeeld: blauwgroen"></div>
        </div>

        <!-- Favorieten -->
        <div class="card">
          <h2>Favorieten</h2>
          <div class="form-group"><label for="lievelingseten">Lievelingseten</label><input type="text" id="lievelingseten" name="lievelingseten" placeholder="Bijvoorbeeld: pizza"></div>
          <div class="form-group"><label for="favoriete_snoep">Favoriete snoep</label><input type="text" id="favoriete_snoep" name="favoriete_snoep" placeholder="Bijvoorbeeld: zure matjes"></div>
          <div class="form-group"><label for="favoriete_muziek">Favoriete muziek</label><input type="text" id="favoriete_muziek" name="favoriete_muziek" placeholder="Bijvoorbeeld: rap of pop"></div>
          <div class="form-group"><label for="favoriete_dier">Favoriete dier</label><input type="text" id="favoriete_dier" name="favoriete_dier" placeholder="Bijvoorbeeld: hond"></div>
          <div class="form-group"><label for="favoriete_seizoen">Favoriete seizoen</label><input type="text" id="favoriete_seizoen" name="favoriete_seizoen" placeholder="Bijvoorbeeld: zomer"></div>
        </div>

      </div>

      <div class="grid">
        
        <!-- Leuke dingen -->
        <div class="card">
          <h2>Leuke dingen</h2>
          <div class="form-group"><label for="blij_van">Waar word je blij van?</label><input type="text" id="blij_van" name="blij_van" placeholder="Bijvoorbeeld: gamen met vrienden"></div>
          <div class="form-group"><label for="weekend">Wat doe je graag in het weekend?</label><input type="text" id="weekend" name="weekend" placeholder="Bijvoorbeeld: voetbalen"></div>
        </div>

        <!-- Grappige vragen -->
        <div class="card">
          <h2>Grappige vragen</h2>
          <div class="form-group"><label for="superkracht">Welke superkracht wil je?</label><input type="text" id="superkracht" name="superkracht" placeholder="Bijvoorbeeld: vliegen"></div>
          <div class="form-group"><label for="ochtend_avond">Ochtendmens of avondmens?</label><input type="text" id="ochtend_avond" name="ochtend_avond" placeholder="Bijvoorbeeld: avondmens"></div>
        </div>

        <!-- Berichtje -->
        <div class="card">
          <h2>Berichtje</h2>
          <div class="form-group"><label for="berichtje">Schrijf een lieve of grappige boodschap</label><textarea id="berichtje" name="berichtje" placeholder="Bijvoorbeeld: Jij bent echt top!"></textarea></div>
        </div>

      </div>

      <div class="submit-container">
        <button type="submit" class="submit-btn">Verstuur Vriendenboek</button>
      </div>

    </form>
  </div>

</body>
</html>`;
