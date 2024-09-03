/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-void */
/* eslint-disable no-script-url */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { useState, useEffect } from "react";
import { IAlertProps } from "./index";
import { PnPClientStorage, dateAdd } from "@pnp/common";
import { AlertType, IAlertItem } from "./IAlerts.types";
import { AlertsService } from "./AlertsService";

import { Bounce, Id, ToastContainer, ToastItem, ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const handleClick = (link: { url:any; }) => () => {
  // Your desired URL or action when the link is clicked
  window.open(link.url, "_blank");
};

export const Msg = ({ title, text, link }: { title: string; text: string; link: any }) => {
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

const Alerts: React.FunctionComponent<IAlertProps> = (props) => {
  const { siteId } = props;
  const [storage] = useState(new PnPClientStorage());
  const storageKey = `${siteId}ClosedAlerts`;
  const cache_key = `${siteId}AllAlerts`;
  const CACHE_DURATION = 2; //in minutes

  const toaster = (myProps: JSX.IntrinsicAttributes & { title: any; text: any; link: any; }, toastProps: ToastOptions<{}>): Id =>
    toast(<Msg {...myProps} />, { ...toastProps });

  toaster.success = (myProps: JSX.IntrinsicAttributes & { title: any; text: any; link: any; }, toastProps: ToastOptions<{}>): Id =>
    toast.success(<Msg {...myProps} />, { ...toastProps });

  toaster.error = (myProps: JSX.IntrinsicAttributes & { title: any; text: any; link: any; }, toastProps: ToastOptions<{}>): Id =>
    toast.error(<Msg {...myProps} />, { ...toastProps });

  toaster.warn = (myProps: JSX.IntrinsicAttributes & { title: any; text: any; link: any; }, toastProps: ToastOptions<{}>): Id =>
    toast.warn(<Msg {...myProps} />, { ...toastProps });

  toaster.info = (myProps: JSX.IntrinsicAttributes & { title: any; text: any; link: any; }, toastProps: ToastOptions<{}>): Id =>
    toast.info(<Msg {...myProps} />, { ...toastProps });


  const fetchAlerts = async () => {
    const closedAlerts = storage.session.get(storageKey);
    let items = storage.local.get(cache_key);

    if (!items) {
      items = await AlertsService.getAlerts();
      storage.local.put(cache_key, items, dateAdd(new Date(), "minute", CACHE_DURATION));
    }

    const alertItems: Array<IAlertItem> = new Array<IAlertItem>();

    items.forEach((val: { [x: string]: any; Id: any; }) => {
      if (!closedAlerts || closedAlerts.indexOf(val.Id) < 0) {
        alertItems.push({
          Id: val.Id,
          title: val.Title,
          description: val.Description,
          type: val.AlertType,
          link: val.Link,
        });
        if (val.AlertType === AlertType.Actionable) {
          toaster.success(
            {
              title: val.Title,
              text: val.Description,
              link: val.Link
            }, {
            toastId: val.Id,
            progress: undefined,
            transition: Bounce,
          });
        } else if (val.AlertType === AlertType.Warning) {
          toaster.warn({
            title: val.Title,
            text: val.Description,
            link: val.Link
          }, {
            toastId: val.Id,
            progress: undefined,
            transition: Bounce,
          });
        } else if (val.AlertType === AlertType.Error) {
          toaster.error({
            title: val.Title,
            text: val.Description,
            link: val.Link
          }, {
            toastId: val.Id,
            progress: undefined,
            transition: Bounce,
          });
        } else {
          toaster.info({
            title: val.Title,
            text: val.Description,
            link: val.Link
          }, {
            toastId: val.Id,
            progress: undefined,
            transition: Bounce,
          });
        }
      }
    });
  };

  useEffect(() => {
    void fetchAlerts();
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




