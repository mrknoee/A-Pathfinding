export default class PriorityQueue {
    constructor(comparator = (a, b) => a > b) {
        this.heap = [];
        this.comparator = comparator;
    }

    get size() {
        return this.heap.length;
    }

    isEmpty() {
        return this.size === 0;
    }

    peek() {
        return this.heap[0];
    }

    enqueue(value) {
        this.heap.push(value);
        this.bubbleUp();
    }

    dequeue() {
        const top = this.peek();
        const bottom = this.heap.pop();
        if (this.size > 0) {
            this.heap[0] = bottom;
            this.trickleDown();
        }
        return top;
    }

    bubbleUp() {
        let index = this.size - 1;
        while (index > 0 && this.compare(index, this.parentIndex(index))) {
            this.swap(index, this.parentIndex(index));
            index = this.parentIndex(index);
        }
    }

    trickleDown() {
        let index = 0;
        while (
            this.leftChildIndex(index) < this.size &&
            this.compare(this.leftChildIndex(index), index) ||
            this.rightChildIndex(index) < this.size &&
            this.compare(this.rightChildIndex(index), index)
        ) {
            let smallerChildIndex = this.rightChildIndex(index) < this.size &&
                this.compare(this.rightChildIndex(index), this.leftChildIndex(index))
                ? this.rightChildIndex(index)
                : this.leftChildIndex(index);
            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }

    parentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    leftChildIndex(index) {
        return 2 * index + 1;
    }

    rightChildIndex(index) {
        return 2 * index + 2;
    }

    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    compare(index1, index2) {
        return this.comparator(this.heap[index1], this.heap[index2]);
    }
}
