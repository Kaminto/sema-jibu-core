import realtimeSaga from "ra-realtime";
import { GET_LIST, GET_ONE } from "react-admin";

const observeRequest = dataProvider => (type, resource, params) => {
  if (
    resource === "admin/print-runs" &&
    (type === GET_LIST || type === GET_ONE)
  ) {
    return {
      subscribe(observer) {
        let intervalId = setInterval(() => {
          dataProvider(type, resource, params)
            .then(results => observer.next(results)) // New data received, notify the observer
            .catch(error => observer.error(error)); // Ouch, an error occured, notify the observer
        }, 3000);

        const subscription = {
          unsubscribe() {
            if (intervalId) {
              // Clean up after ourselves
              clearInterval(intervalId);
              intervalId = undefined;
              // Notify the saga that we cleaned up everything
              observer.complete();
            }
          }
        };

        return subscription;
      }
    };
  }
};

export const realTimeProvider = dataProvider =>
  realtimeSaga(observeRequest(dataProvider));
