
interface SpeechQueue {
  text: string;
  priority: boolean;
  timestamp: number;
  id: string;
}

export class SpeechSystemQueue {
  private queue: SpeechQueue[] = [];

  addItem(text: string, priority: boolean = false) {
    const item: SpeechQueue = {
      text: text.trim(),
      priority,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9),
    };
    if (priority) {
      this.queue.unshift(item);
    } else {
      this.queue.push(item);
    }
  }

  shift(): SpeechQueue | undefined {
    return this.queue.shift();
  }

  getNext(): string | undefined {
    const item = this.queue.shift();
    return item?.text;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  clear() {
    this.queue = [];
  }

  get length() {
    return this.queue.length;
  }
}
