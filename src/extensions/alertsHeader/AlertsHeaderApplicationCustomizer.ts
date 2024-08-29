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

export interface IAlertsHeaderApplicationCustomizerProperties {}

export default class AlertsHeaderApplicationCustomizer extends BaseApplicationCustomizer<IAlertsHeaderApplicationCustomizerProperties> {
  private topPlaceholder: PlaceholderContent | undefined;
  private bottomPlaceholder: PlaceholderContent | undefined;

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
      this._renderControls(3000);
    }
  }

  private _renderControls = (delay: number) => {

    // This code below would display the alerts in the Top Placeholder zone
    // this is the supported place to display the application customizers

    if (this.topPlaceholder.domElement) {
      const alertElement: React.ReactElement<any> = React.createElement(
        Alerts,
        { siteId: this.context.pageContext.web.id.toString() }
      );
      ReactDOM.render(alertElement, this.topPlaceholder.domElement);
    }

   }
}
