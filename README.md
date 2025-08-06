# Piattaforma di Farmacovigilanza - Frontend

Questo repository contiene il codice sorgente per l'applicazione frontend della Piattaforma di Farmacovigilanza. È una **Single Page Application (SPA)** sviluppata con **Angular** per fornire un'interfaccia utente moderna e reattiva per l'inserimento e l'analisi di dati farmaceutici complessi.

---

## Contesto Tesi di Laurea

* **Studente:** Antonio Biondillo
* **Matricola:** 01684787
* **Corso di Studio:** Ingegneria Informatica e dell'Automazione (D.M. 270/04)
* **Percorso:** Database
* **Titolo della Tesi:** Sviluppo di una Piattaforma per l'Analisi di Big Data in Ambito Farmaceutico: un'Applicazione per la Farmacovigilanza

---

## Funzionalità Principali

* ✨ **Interfaccia Moderna e Interattiva:** Design responsivo con una dashboard analitica ricca di componenti visivi.
* 🔐 **Flusso di Autenticazione Completo:** Pagine di login, registrazione e gestione del token JWT tramite `localStorage`.
* 🛡️ **Navigazione Protetta:** Utilizzo di **Route Guards** per proteggere le pagine in base allo stato di login e al ruolo dell'utente (`Operatore`, `Analista`, `Admin`).
* 📝 **Form AIFA Complesso:** Implementazione di un form reattivo multi-sezione basato sulle schede ufficiali AIFA, con gestione dinamica di farmaci multipli (`FormArray`).
* 📈 **Dashboard Analitica Avanzata:**
  * Visualizzazione di KPI (Indicatori Chiave di Performance).
  * Grafici interattivi (barre, torte, heatmap) realizzati con **ngx-charts**.
  * Doppia visualizzazione geografica con **Leaflet**: una mappa con marker colorati per farmaco e una heatmap per la densità delle segnalazioni, entrambe con legende dinamiche.
* 🗂️ **Tabella Dati Interattiva:** Lista delle segnalazioni con filtri avanzati (per farmaco e data), ordinamento lato server e paginazione intelligente.
* 📄 **Esportazione CSV:** Funzionalità di download dei dati direttamente dal browser.
* 👤 **Sezione di Amministrazione:** Interfaccia CRUD completa per la gestione degli utenti (creazione, visualizzazione, modifica, eliminazione) in un modal riutilizzabile, accessibile solo all'Admin.

---

## Stack Tecnologico

* **Framework:** Angular
* **Linguaggio:** TypeScript
* **Styling:** SCSS
* **Grafici:** `ngx-charts`
* **Mappe:** `Leaflet` e `leaflet.heat`
* **Icone:** `Font Awesome`
* **Gestione Asincrona:** RxJS
* **Gestione Form:** Angular Reactive Forms (`FormGroup`, `FormArray`)

---

## Installazione e Avvio

### Prerequisiti

* Node.js (v18.x o superiore)
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

3.  **Configurare l'ambiente:**
  * Aprire il file `src/environments/environment.ts`.
  * Assicurarsi che `apiUrl` punti al backend in esecuzione:
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
