/* eslint-disable @microsoft/spfx/pair-react-dom-render-unmount */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import "@pnp/polyfill-ie11";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { override } from "@microsoft/decorators";
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
} from "@microsoft/sp-application-base";
import Alerts from "./components/Alerts/Alerts";
import { sp } from "@pnp/sp";
import { IAlertProps } from "./components/Alerts";

export interface IAlertsHeaderApplicationCustomizerProperties {}

export default class AlertsHeaderApplicationCustomizer extends BaseApplicationCustomizer<IAlertsHeaderApplicationCustomizerProperties> {
  private topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    return super.onInit().then((_) => {
      sp.setup({
        spfxContext: this.context,
      });

      this.context.placeholderProvider.changedEvent.add(
        this,
        this.renderPlaceHolders
      );
    });
  }

  @override
  public onDispose(): Promise<void> {
    this.context.placeholderProvider.changedEvent.remove(
      this,
      this.renderPlaceHolders
    );
    return Promise.resolve();
  }

  private renderPlaceHolders(): void {
    if (!this.topPlaceholder) {
      this.topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top
      );
      if(this.topPlaceholder.domElement.parentElement.getElementsByClassName("Toastify").length > 0) {
        return;
      }
      this._renderControls();
    }
  }

  private _renderControls = () => {

    // This code below would display the alerts in the Top Placeholder zone
    // this is the supported place to display the application customizers

    if (this.topPlaceholder.domElement) {
      const alertElement: React.ReactElement<IAlertProps> = React.createElement(
        Alerts,
        { siteId: this.context.pageContext.web.id.toString() }
      );
      ReactDOM.render(alertElement, this.topPlaceholder.domElement);
    }

   }
}
