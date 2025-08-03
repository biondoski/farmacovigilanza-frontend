# Piattaforma di Farmacovigilanza - Frontend

Questo repository contiene il codice sorgente per l'applicazione frontend della Piattaforma di Farmacovigilanza. È una **Single Page Application (SPA)** sviluppata con **Angular** per fornire un'interfaccia utente moderna e reattiva per l'analisi dei dati farmaceutici.

---

## Contesto Tesi di Laurea

Questo progetto è stato sviluppato da:

* **Studente:** Antonio Biondillo
* **Matricola:** 01684787
* **Corso di Studio:** Ingegneria Informatica e dell'Automazione (D.M. 270/04)
* **Percorso:** Database
* **Titolo della Tesi:** Sviluppo di una Piattaforma per l'Analisi di Big Data in Ambito Farmaceutico: un'Applicazione per la Farmacovigilanza

---

## Funzionalità Principali

* ✨ **Interfaccia Moderna:** Design pulito e responsivo.
* 🔐 **Flusso di Autenticazione Completo:** Pagine di login e registrazione che comunicano con il backend tramite JWT.
* 🛡️ **Navigazione Protetta:** Utilizzo di **Route Guards** per proteggere le pagine in base allo stato di login e al ruolo dell'utente (`Operatore`, `Analista`, `Admin`).
* 📈 **Dashboard Analitica Avanzata:**
  * Visualizzazione di KPI (Indicatori Chiave di Performance).
  * Grafici interattivi (barre, torte, heatmap) realizzati con **ngx-charts**.
  * Mappe interattive (marker colorati, heatmap e legende) realizzate con **Leaflet**.
* 📝 **Gestione Dati Intuitiva:** Form reattivi per la creazione e modifica delle segnalazioni, con validazione in tempo reale.
* 🗂️ **Tabella Dati Interattiva:** Lista delle segnalazioni con filtri avanzati, ordinamento lato server e paginazione.
* 📄 **Esportazione CSV:** Funzionalità di download dei dati direttamente dal browser.
* 👤 **Sezione di Amministrazione:** Interfaccia per la gestione degli utenti (creazione, visualizzazione, eliminazione) accessibile solo all'Admin.

---

## Stack Tecnologico

* **Framework:** Angular (versione 12+ consigliata)
* **Linguaggio:** TypeScript
* **Styling:** SCSS
* **Grafici:** `ngx-charts`
* **Mappe:** `Leaflet` e `leaflet.heat`
* **Icone:** `Font Awesome`
* **Gestione Asincrona:** RxJS

---

## Installazione e Avvio

### Prerequisiti

* Node.js (versione 18.x o superiore consigliata)
* Angular CLI installato globalmente: `npm install -g @angular/cli`

### Procedura

1.  **Clonare il repository:**
    ```bash
    git clone <URL_DEL_REPOSITORY>
    cd farmacovigilanza-frontend
    ```

2.  **Installare le dipendenze:**
    ```bash
    npm install
    ```

3.  **Configurare le variabili d'ambiente:**
  * Aprire il file `src/environments/environment.ts`.
  * Assicurarsi che la variabile `apiUrl` punti al backend in esecuzione:
      ```typescript
      export const environment = {
        production: false,
        apiUrl: 'http://localhost:5000/api'
      };
      ```

4.  **Avviare l'applicazione:**
    ```bash
    ng serve
    ```
L'applicazione sarà accessibile su `http://localhost:4200`. Assicurarsi che il server backend sia già in esecuzione.
