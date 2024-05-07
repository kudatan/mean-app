import {Injectable} from "@angular/core";
import {Position} from "../../shared/interfaces/position.interface";
import {OrderPosition} from "../../shared/interfaces/order.interface";

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  public list: OrderPosition[] = [];
  public price = 0;

  add(position: Position) {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity !== undefined ? position.quantity : 0,
      _id: position._id !== undefined ? position._id : ''
    });
    const candidate = this.list.find(p => p._id === orderPosition._id);

    if (candidate) {
      candidate.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition);
    }

    this.computePrice();
  }

  remove(position: OrderPosition) {
    const idx = this.list.findIndex(p => p._id === position._id);
    this.list.splice(idx, 1);
    this.computePrice();
  }

  clear() {
    this.list = [];
    this.price = 0;
  }

  private computePrice() {
    this.price = this.list.reduce((total, item) => {
      return total += item.quantity * item.cost
    }, 0);
  }
}
