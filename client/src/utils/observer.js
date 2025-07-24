class Observer {
  constructor() {
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter((sub) => sub !== callback);
  }

  notify(data) {
    console.log("Observer notified with data:", data);
    this.subscribers.forEach((sub) => sub(data));
  }
}

export default Observer;