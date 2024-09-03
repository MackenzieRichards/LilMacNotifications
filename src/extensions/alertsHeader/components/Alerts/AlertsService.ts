import { sp } from '@pnp/sp';

export class AlertsService {
  public static readonly LIST_TITLE: string = "Alerts";
  public static readonly CONFIG_KEY: string = "AlertsSource";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async getAlerts(): Promise<Array<any>> {

    const dateTimeNow: Date = new Date();

    return sp.web.lists
      .getByTitle("Alerts")
      .items.select("ID", "Title", "AlertType", "Description", "Link", "EndDateTime")
      .filter(
        `StartDateTime le datetime'${dateTimeNow.toISOString()}' and EndDateTime ge datetime'${dateTimeNow.toISOString()}'`
      )
      .orderBy("StartDateTime", false)
      .get();
  }
}
