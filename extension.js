const vscode = require("vscode");

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.changeTheme",
    function () {
      // Définir les thèmes
      const themes = {
        day: ["January Day", "February Day" /* + autres mois... */],
        night: ["January Night", "February Night" /* + autres mois... */],
        holiday: [
          {
            name: "New Year",
            date: new Date(2022, 00, 01),
            dayTheme: "New Year Day",
            nightTheme: "New Year Night",
          },
          /* + autres jours fériés...*/
        ],
      };

      const currentDateTime = new Date();

      // Vérifier si c'est un jour férié
      for (const holiday of themes.holiday) {
        if (
          holiday.date.getDate() === currentDateTime.getDate() &&
          holiday.date.getMonth() === currentDateTime.getMonth()
        ) {
          if (
            currentDateTime.getHours() >= 6 &&
            currentDateTime.getHours() < 18
          ) {
            vscode.workspace
              .getConfiguration()
              .update("workbench.colorTheme", holiday.dayTheme, true);
          } else {
            vscode.workspace
              .getConfiguration()
              .update("workbench.colorTheme", holiday.nightTheme, true);
          }

          // terminer le programme
          return;
        }

        // Changer le thème normalement
        if (
          currentDateTime.getHours() >= 6 &&
          currentDateTime.getHours() < 18
        ) {
          vscode.workspace
            .getConfiguration()
            .update(
              "workbench.colorTheme",
              themes.day[currentDateTime.getMonth()],
              true
            );
        } else {
          vscode.workspace
            .getConfiguration()
            .update(
              "workbench.colorTheme",
              themes.night[currentDateTime.getMonth()],
              true
            );
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;
