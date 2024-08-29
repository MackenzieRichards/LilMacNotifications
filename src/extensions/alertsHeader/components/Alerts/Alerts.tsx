import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./Alerts.module.scss";
import { IAlertProps } from "./index";
import { PnPClientStorage, dateAdd } from "@pnp/common";
import { AlertType, IAlertItem } from "./IAlerts.types";
import { AlertsService } from "./AlertsService";

import { Bounce, Id, ToastContainer, ToastItem, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Alerts: React.FunctionComponent<IAlertProps> = (props) => {
  const { siteId } = props;
  const [storage] = useState(new PnPClientStorage());
  const storageKey = `${siteId}ClosedAlerts`;
  const cache_key = `${siteId}AllAlerts`;
  const CACHE_DURATION = 2; //in minutes

  useEffect(() => {
    fetchAlerts();
  }, []);

  toast.onChange((payload: ToastItem) => {
    switch (payload.status) {
      case "added":
        // new toast added
        break;
      case "updated":
        // toast updated
        break;
      case "removed":
        // toast has been removed
        _addClosedAlerts(Number(payload.id));
        break;
    }
  });

  const toaster = (myProps, toastProps): Id =>
    toast(<Msg {...myProps} />, { ...toastProps });

  toaster.success = (myProps, toastProps): Id =>
    toast.success(<Msg {...myProps} />, { ...toastProps });

  toaster.error = (myProps, toastProps): Id =>
    toast.error(<Msg {...myProps} />, { ...toastProps });

  toaster.warn = (myProps, toastProps): Id =>
    toast.warn(<Msg {...myProps} />, { ...toastProps });

  toaster.info = (myProps, toastProps): Id =>
    toast.info(<Msg {...myProps} />, { ...toastProps });


  const fetchAlerts = async () => {
    let closedAlerts = storage.session.get(storageKey);
    let items = storage.local.get(cache_key);

    if (!items) {
      items = await AlertsService.getAlerts();
      storage.local.put(cache_key, items, dateAdd(new Date(), "minute", CACHE_DURATION));
    }

    let alertItems: Array<IAlertItem> = new Array<IAlertItem>();

    items.forEach((val: IAlertItem) => {
      if (!closedAlerts || closedAlerts.indexOf(val.Id) < 0) {
        alertItems.push({
          Id: val["Id"],
          title: val["Title"],
          description: val["Description"],
          type: val["AlertType"],
          link: val["Link"],
        });
        if (val["AlertType"] == AlertType.Actionable) {
          toaster.success(
            {
              title: val["Title"],
              text: val["Description"],
              link: val["Link"]
            }, {
            toastId: val["Id"],
            progress: undefined,
            transition: Bounce,
          });
        } else if (val["AlertType"] == AlertType.Warning) {
          toaster.warn({
            title: val["Title"],
            text: val["Description"],
            link: val["Link"]
          }, {
            toastId: val["Id"],
            progress: undefined,
            transition: Bounce,
          });
        } else if (val["AlertType"] == AlertType.Error) {
          toaster.error({
            title: val["Title"],
            text: val["Description"],
            link: val["Link"]
          }, {
            toastId: val["Id"],
            progress: undefined,
            transition: Bounce,
          });
        } else {
          toaster.info({
            title: val["Title"],
            text: val["Description"],
            link: val["Link"]
          }, {
            toastId: val["Id"],
            progress: undefined,
            transition: Bounce,
          });
        }
      }
    });
  };

  const _addClosedAlerts = (id: number): void => {
    let closedAlertsInStorage = storage.session.get(storageKey);
    if (closedAlertsInStorage) {
      const t = closedAlertsInStorage;
      if (t.indexOf(id) < 0) {
        closedAlertsInStorage.push(id);
      }
    } else {
      closedAlertsInStorage = new Array<number>();
      closedAlertsInStorage.push(id);
    }
    storage.session.put(storageKey, closedAlertsInStorage);
  };

  return (
    <ToastContainer newestOnTop autoClose={false} hideProgressBar={true} closeOnClick={false} pauseOnHover={false} draggable position="top-right" theme="colored" />
  );
};

export default Alerts;

export const Msg = ({ title, text, link }) => {
  if (link) {
    const url = link.Url;
    return (
      <div className="msg-container">
        <p className="msg-title">{title}: {text}</p>
        <p><a href="javascript:void(0)" onClick={handleClick({url})}>{link.Description}</a></p>
      </div>
    );
  } else {
    return (
      <div className="msg-container">
        <p className="msg-title">{title}: {text}</p>
      </div>
    );
  }
};

const handleClick = (link) => () => {
  // Your desired URL or action when the link is clicked
  window.open(link.url, "_blank");
};

