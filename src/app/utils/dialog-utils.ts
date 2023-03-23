import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {NgZone} from "@angular/core";
import {ComponentType} from "@angular/cdk/overlay";
import {WarningDialogComponent} from "../components/warning-dialog/warning-dialog.component";

export class DialogUtils
{
  public static createDialogConfig(width: number, height: number, content: object)
  {
    const dialogConfig = this.createBasicConfig(width, height);
    dialogConfig.data =
      {
        content: content
      };

    return dialogConfig;
  }

  public static createBasicConfig(width: number, height: number)
  {
    const dialogConfig = new MatDialogConfig();
    const px = 'px';
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = width + px;
    dialogConfig.width = width + px;
    dialogConfig.minHeight = height + px;
    dialogConfig.height = height + px;

    return dialogConfig;
  }

  static openDialog(zone: NgZone, dialog: MatDialog, dialogConfig: MatDialogConfig, component: ComponentType<any>): MatDialogRef<any>
  {
    return zone.run(() => dialog.open(component, dialogConfig))
  }

  static openWarningDialog(dialogData: DialogData, zone: NgZone, dialog: MatDialog): MatDialogRef<any>
  {
    const width = 500;
    const height = 210;

    const dialogConfig = this.createBasicConfig(width, height);

    dialogConfig.data =
      {
        title: dialogData.title,
        description: dialogData.description,
        buttonText: dialogData.buttonText
      }
    dialogConfig.panelClass = 'warning-dialog';
    return this.openDialog(zone, dialog, dialogConfig, WarningDialogComponent);
  }

  static createWarningDialogData(title: string, description: string, buttonText: string): DialogData
  {
    return {
      title: title,
      description: description,
      buttonText: buttonText,
    };
  }
}

interface DialogData
{
  title: string,
  description: string,
  buttonText: string
}
